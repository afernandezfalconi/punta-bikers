import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mercado Pago API
const MERCADO_PAGO_API = 'https://api.mercadopago.com/v1';
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Verify authentication
    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user.user?.id) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { rental_id } = body;

    if (!rental_id) {
      return NextResponse.json(
        { error: 'Missing rental_id' },
        { status: 400 }
      );
    }

    // Fetch rental from database to get actual cost (NEVER trust client)
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('cost, user_id, scooter_id')
      .eq('id', rental_id)
      .single();

    if (rentalError || !rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    // Verify user owns this rental
    if (rental.user_id !== user.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Use SERVER-SIDE cost, NOT client-provided amount
    const amount = rental.cost;

    // Create Mercado Pago preference
    const preference = {
      items: [
        {
          title: 'Renta de Scooter - PUNTA BIKERS',
          quantity: 1,
          unit_price: parseFloat(amount.toString()),
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
