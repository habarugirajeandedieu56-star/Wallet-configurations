'use client';

import { useState } from 'react';
import { piSDK } from '@/lib/pi-sdk';
import { PaymentData } from '@/types/pi-sdk';
import { cn, formatPiAmount } from '@/lib/utils';

interface PiPaymentProps {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  onPaymentSuccess?: (paymentId: string, txid: string) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentCancelled?: () => void;
  className?: string;
  buttonText?: string;
}

export function PiPayment({
  amount,
  memo,
  metadata = {},
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancelled,
  className,
  buttonText = `Pay ${formatPiAmount(amount)} π`,
}: PiPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'approving' | 'completing' | 'completed' | 'error'>('idle');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('idle');
    console.log('=== Pi Payment Section Started ===');
    console.log('Payment initiated with:', { amount, memo, metadata });

    const paymentData: PaymentData = {
      amount,
      memo,
      metadata,
    };

    piSDK.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId: string) => {
        setPaymentStatus('approving');
        console.log('=== Pi Payment Section: Ready for Server Approval ===');
        console.log('Payment ID:', paymentId);
        console.log('Payment details:', { amount, memo, metadata });
        
        try {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Approval timeout - took too long')), 30000)
          );
          
          // Call backend to approve the payment
          const approvalPromise = fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }),
          }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || 'Failed to approve payment');
            }
            return data;
          });
          
          // Race between approval and timeout
          const data = await Promise.race([approvalPromise, timeoutPromise]);
          
          console.log('=== Pi Payment Section: Server Approval Successful ===');
          console.log('Approval response:', data);
        } catch (error) {
          console.error('=== Pi Payment Section: Server Approval Failed ===');
          console.error('Error:', error);
          setPaymentStatus('error');
          setIsProcessing(false);
          onPaymentError?.(error instanceof Error ? error : new Error('Approval failed'));
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        setPaymentStatus('completing');
        console.log('=== Pi Payment Section: Ready for Server Completion ===');
        console.log('Payment ID:', paymentId);
        console.log('Transaction ID:', txid);
        console.log('Payment details:', { amount, memo, metadata });
        
        try {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Completion timeout - took too long')), 30000)
          );
          
          // Call backend to complete the payment
          const completionPromise = fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid }),
          }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || 'Failed to complete payment');
            }
            return data;
          });
          
          // Race between completion and timeout
          const data = await Promise.race([completionPromise, timeoutPromise]);
          
          console.log('=== Pi Payment Section: Server Completion Successful ===');
          console.log('Completion response:', data);
          setPaymentStatus('completed');
          onPaymentSuccess?.(paymentId, txid);
          console.log('=== Pi Payment Section: Completed Successfully ===');
        } catch (error) {
          console.error('=== Pi Payment Section: Server Completion Failed ===');
          console.error('Error:', error);
          setPaymentStatus('error');
          onPaymentError?.(error instanceof Error ? error : new Error('Completion failed'));
        } finally {
          setIsProcessing(false);
        }
      },
      onCancel: (paymentId: string) => {
        console.log('=== Pi Payment Section: Cancelled ===');
        console.log('Payment ID:', paymentId);
        console.log('Payment details:', { amount, memo, metadata });
        setPaymentStatus('idle');
        setIsProcessing(false);
        onPaymentCancelled?.();
      },
      onError: (paymentId: string, error: Error) => {
        console.error('=== Pi Payment Section: Error Occurred ===');
        console.error('Payment ID:', paymentId);
        console.error('Error:', error);
        console.error('Payment details:', { amount, memo, metadata });
        setPaymentStatus('error');
        setIsProcessing(false);
        onPaymentError?.(error);
      },
    });
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'approving':
        return 'Waiting for server approval...';
      case 'completing':
        return 'Processing transaction...';
      case 'completed':
        return 'Payment completed successfully!';
      case 'error':
        return 'Payment failed. Please try again.';
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-semibold text-white transition-all",
          "bg-green-600 hover:bg-green-700",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>

      {getStatusMessage() && (
        <div
          className={cn(
            "p-3 rounded-md text-center text-sm",
            paymentStatus === 'completed' && "bg-green-50 text-green-800",
            paymentStatus === 'error' && "bg-red-50 text-red-800",
            (paymentStatus === 'approving' || paymentStatus === 'completing') && "bg-blue-50 text-blue-800"
          )}
        >
          {getStatusMessage()}
        </div>
      )}
    </div>
  );
}
