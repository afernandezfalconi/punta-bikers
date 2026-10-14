import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
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

    // Get only user's own rentals (RLS enforced by Supabase)
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        *,
        scooters(model, license_plate),
        user:user_id(email)
      `)
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json(rentals || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rentals GET error:', message);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}

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

    if (!body.scooter_id) {
      return NextResponse.json(
        { error: 'Missing scooter_id' },
        { status: 400 }
      );
    }

    // Verify scooter exists and is available
    const { data: scooter, error: scooterError } = await supabase
      .from('scooters')
      .select('price_per_hour, status')
      .eq('id', body.scooter_id)
      .single();

    if (scooterError || !scooter) {
      return NextResponse.json(
        { error: 'Scooter not found' },
        { status: 404 }
      );
    }

    if (scooter.status !== 'available') {
      return NextResponse.json(
        { error: 'Scooter not available' },
        { status: 400 }
      );
    }

    // Create rental with authenticated user ID (NOT from client)
    const { data: rental, error } = await supabase
      .from('rentals')
      .insert([
        {
          scooter_id: body.scooter_id,
          user_id: user.user.id, // Use authenticated user, never trust client
          status: 'pending', // Pending until payment confirmed
          cost: scooter.price_per_hour, // Use server-side price
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(rental?.[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rentals POST error:', message);
    return NextResponse.json(
      { error: 'Failed to create rental' },
      { status: 500 }
    );
  }
}
