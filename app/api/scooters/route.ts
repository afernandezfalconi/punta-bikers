import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Scooter {
  id?: string;
  model: string;
  licensePlate: string;
  status: 'available' | 'rented' | 'maintenance';
  battery: number;
  location: string;
  pricePerHour: number;
  createdAt?: string;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get all scooters (for now, return empty since table might not exist)
    const { data: scooters, error } = await supabase
      .from('scooters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json(scooters || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Scooters GET error:', message);
    return NextResponse.json(
      { error: 'Failed to fetch scooters' },
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

    // Verify authentication + admin role (TODO: add admin role check)
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

    const body = (await req.json()) as Scooter;

    if (!body.model || !body.licensePlate || !body.pricePerHour) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: scooter, error } = await supabase
      .from('scooters')
      .insert([
        {
          model: body.model,
          license_plate: body.licensePlate,
          status: body.status || 'available',
          battery: body.battery || 100,
          location: body.location || 'Puerto Escondido',
          price_per_hour: body.pricePerHour,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(scooter?.[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Scooters POST error:', message);
    return NextResponse.json(
      { error: 'Failed to create scooter' },
      { status: 500 }
    );
  }
}
