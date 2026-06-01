import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';

export async function POST(request: NextRequest) {
  let paymentId: string | undefined;
  let txid: string | undefined;
  try {
    console.log('=== Pi Payment Section: Server Completion Request Received ===');
    const body = await request.json();
    paymentId = body.paymentId;
    txid = body.txid;
    console.log('Payment completion request details:', { paymentId, txid, body });

    // Check if API key is configured
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      console.error('=== Pi Payment Section: API Key Not Configured ===');
      console.error('Please set PI_API_KEY in your environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: API key not set' },
        { status: 500 }
      );
    }

    if (!paymentId || !txid) {
      console.log('=== Pi Payment Section: Missing Payment ID or Transaction ID Error ===');
      return NextResponse.json(
        { error: 'Payment ID and transaction ID are required' },
        { status: 400 }
      );
    }

    // Complete the payment using Pi API
    console.log('=== Pi Payment Section: Initiating Payment Completion ===');
    console.log('Calling Pi API to complete payment:', { paymentId, txid });
    const payment = await piAPI.completePayment(paymentId, txid);
    console.log('=== Pi Payment Section: Payment Completed Successfully ===');
    console.log('Completed payment details:', payment);

    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error) {
    console.error('=== Pi Payment Section: Payment Completion Error Occurred ===');
    console.error('Error details:', error);
    console.error('Payment ID:', { paymentId });
    console.error('Transaction ID:', { txid });
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = errorMessage.includes('401') || errorMessage.includes('403');
    
    return NextResponse.json(
      { 
        error: isAuthError 
          ? 'API authentication failed. Check your PI_API_KEY' 
          : `Payment completion failed: ${errorMessage}` 
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
