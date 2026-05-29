import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';

export async function POST(request: NextRequest) {
  let paymentId: string | undefined;
  try {
    console.log('=== Pi Payment Section: Server Approval Request Received ===');
    const body = await request.json();
    paymentId = body.paymentId;
    console.log('Payment approval request details:', { paymentId, body });

    if (!paymentId) {
      console.log('=== Pi Payment Section: Missing Payment ID Error ===');
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Approve the payment using Pi API
    console.log('=== Pi Payment Section: Initiating Payment Approval ===');
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
    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
