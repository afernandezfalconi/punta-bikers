import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        *,
        scooters(model, license_plate),
        user:user_id(email)
      `)
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

    const body = await req.json();

    if (!body.scooter_id || !body.user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: rental, error } = await supabase
      .from('rentals')
      .insert([
        {
          scooter_id: body.scooter_id,
          user_id: body.user_id,
          status: 'active',
          cost: body.cost || 0,
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
