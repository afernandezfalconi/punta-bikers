import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ScooterUpdate {
  model?: string;
  licensePlate?: string;
  status?: string;
  battery?: number;
  location?: string;
  pricePerHour?: number;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const body = (await req.json()) as ScooterUpdate;
    const id = params.id;

    const updateData: Record<string, any> = {};
    if (body.model) updateData.model = body.model;
    if (body.licensePlate) updateData.license_plate = body.licensePlate;
    if (body.status) updateData.status = body.status;
    if (body.battery !== undefined) updateData.battery = body.battery;
    if (body.location) updateData.location = body.location;
    if (body.pricePerHour !== undefined) updateData.price_per_hour = body.pricePerHour;

    const { data: scooter, error } = await supabase
      .from('scooters')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(scooter?.[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Scooter PUT error:', message);
    return NextResponse.json(
      { error: 'Failed to update scooter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const id = params.id;

    const { error } = await supabase
      .from('scooters')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Scooter DELETE error:', message);
    return NextResponse.json(
      { error: 'Failed to delete scooter' },
      { status: 500 }
    );
  }
}
