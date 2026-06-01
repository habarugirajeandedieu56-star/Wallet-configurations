import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';

export async function POST(request: NextRequest) {
  let paymentId: string | undefined;
  try {
    console.log('=== Pi Payment Section: Server Approval Request Received ===');
    const body = await request.json();
    paymentId = body.paymentId;
    console.log('Payment approval request details:', { paymentId, body });

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
    console.log('API Key configured:', apiKey.substring(0, 10) + '...');

    if (!paymentId) {
      console.log('=== Pi Payment Section: Missing Payment ID Error ===');
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Approve the payment using Pi API
    console.log('=== Pi Payment Section: Initiating Payment Approval ===');
    console.log('Calling Pi API to approve payment:', paymentId);
    const payment = await piAPI.approvePayment(paymentId);
    console.log('=== Pi Payment Section: Payment Approved Successfully ===');
    console.log('Approved payment details:', payment);

    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error) {
    console.error('=== Pi Payment Section: Payment Approval Error Occurred ===');
    console.error('Error details:', error);
    console.error('Payment ID:', { paymentId });
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = errorMessage.includes('401') || errorMessage.includes('403');
    
    return NextResponse.json(
      { 
        error: isAuthError 
          ? 'API authentication failed. Check your PI_API_KEY' 
          : `Payment approval failed: ${errorMessage}` 
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
