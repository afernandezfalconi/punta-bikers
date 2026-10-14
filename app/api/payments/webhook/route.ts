import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const MERCADO_PAGO_API = 'https://api.mercadopago.com/v1';
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

function verifyMercadoPagoSignature(req: NextRequest): boolean {
  const signature = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id');

  if (!signature || !requestId) {
    return false;
  }

  // MP sends signature as: "ts=<timestamp>,v1=<hash>"
  const parts = signature.split(',');
  let ts = '';
  let v1 = '';

  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  });

  if (!ts || !v1) {
    return false;
  }

  const dataToSign = `id=${requestId};request-id=${requestId};ts=${ts}`;
  const expectedSignature = crypto
    .createHmac('sha256', MP_WEBHOOK_SECRET || '')
    .update(dataToSign)
    .digest('hex');

  return v1 === expectedSignature;
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    if (!verifyMercadoPagoSignature(req)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { action, data } = await req.json();

    // Handle Mercado Pago webhook
    if (action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data.id;

      // Get payment details from Mercado Pago
      const mpResponse = await fetch(`${MERCADO_PAGO_API}/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      });

      if (!mpResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch payment details' },
          { status: 400 }
        );
      }

      const paymentData = await mpResponse.json();
      const rentalId = paymentData.external_reference;
      const status = paymentData.status; // approved, pending, rejected, cancelled

      // Update payment record in Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: status === 'approved' ? 'approved' : status,
          mercado_pago_id: paymentId,
          webhook_data: paymentData,
        })
        .eq('rental_id', rentalId);

      if (paymentError) throw paymentError;

      // If payment approved, update rental status to active
      if (status === 'approved') {
        const { error: rentalError } = await supabase
          .from('rentals')
          .update({
            status: 'active',
            cost: paymentData.transaction_amount,
          })
          .eq('id', rentalId);

        if (rentalError) throw rentalError;

        console.log(`✓ Payment ${paymentId} approved, rental ${rentalId} activated`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Webhook error:', message);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET for webhook verification
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Webhook endpoint ready' });
}
