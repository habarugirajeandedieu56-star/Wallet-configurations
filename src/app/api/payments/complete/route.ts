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

    if (!paymentId || !txid) {
      console.log('=== Pi Payment Section: Missing Payment ID or Transaction ID Error ===');
      return NextResponse.json(
        { error: 'Payment ID and transaction ID are required' },
        { status: 400 }
      );
    }

    // Complete the payment using Pi API
    console.log('=== Pi Payment Section: Initiating Payment Completion ===');
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
    return NextResponse.json(
      { error: 'Failed to complete payment' },
      { status: 500 }
    );
  }
}
