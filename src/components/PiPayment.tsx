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

  const handlePayment = () => {
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
      onReadyForServerApproval: (paymentId: string) => {
        setPaymentStatus('approving');
        console.log('=== Pi Payment Section: Ready for Server Approval ===');
        console.log('Payment ID:', paymentId);
        console.log('Payment details:', { amount, memo, metadata });
        // In production, send paymentId to your backend for approval
        // await fetch('/api/payments/approve', { method: 'POST', body: JSON.stringify({ paymentId }) });
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        setPaymentStatus('completing');
        console.log('=== Pi Payment Section: Ready for Server Completion ===');
        console.log('Payment ID:', paymentId);
        console.log('Transaction ID:', txid);
        console.log('Payment details:', { amount, memo, metadata });
        // In production, send paymentId and txid to your backend for completion
        // await fetch('/api/payments/complete', { method: 'POST', body: JSON.stringify({ paymentId, txid }) });
        setPaymentStatus('completed');
        onPaymentSuccess?.(paymentId, txid);
        setIsProcessing(false);
        console.log('=== Pi Payment Section: Completed Successfully ===');
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
