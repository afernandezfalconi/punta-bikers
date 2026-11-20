import { NextRequest, NextResponse } from 'next/server';
import { getAuth, userClient } from '@/lib/api-auth';

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuth(req);
    if (!auth?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
    }
    const supabase = userClient(req);

    const body = (await req.json()) as ScooterUpdate;
    const { id } = await params;

    const updateData: Record<string, unknown> = {};
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuth(req);
    if (!auth?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
    }
    const supabase = userClient(req);

    const { id } = await params;

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
