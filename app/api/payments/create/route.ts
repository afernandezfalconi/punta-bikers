import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mercado Pago API
const MERCADO_PAGO_API = 'https://api.mercadopago.com/v1';
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rental_id, amount, title } = body;

    if (!rental_id || !amount) {
      return NextResponse.json(
        { error: 'Missing rental_id or amount' },
        { status: 400 }
      );
    }

    // Create Mercado Pago preference
    const preference = {
      items: [
        {
          title: title || 'Renta de Scooter - PUNTA BIKERS',
          quantity: 1,
          unit_price: parseFloat(amount),
        },
      ],
      payer: {
        email: 'customer@example.com',
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rentals?status=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rentals?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/rentals?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      external_reference: rental_id,
    };

    const mpResponse = await fetch(`${MERCADO_PAGO_API}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      throw new Error('Failed to create Mercado Pago preference');
    }

    const mpData = await mpResponse.json();

    // Save payment record in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: payment, error } = await supabase
      .from('payments')
      .insert([
        {
          rental_id,
          mercado_pago_id: mpData.id,
          amount: parseFloat(amount),
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      payment: payment?.[0],
      checkout_url: mpData.init_point,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Payment creation error:', message);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
