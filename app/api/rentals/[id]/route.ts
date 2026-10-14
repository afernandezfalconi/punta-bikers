import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const body = await req.json();
    const id = params.id;

    const updateData: Record<string, any> = {};
    if (body.status) updateData.status = body.status;
    if (body.end_time) updateData.end_time = body.end_time;
    if (body.cost !== undefined) updateData.cost = body.cost;
    if (body.notes) updateData.notes = body.notes;
    updateData.updated_at = new Date();

    const { data: rental, error } = await supabase
      .from('rentals')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(rental?.[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rental PUT error:', message);
    return NextResponse.json(
      { error: 'Failed to update rental' },
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
      .from('rentals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rental DELETE error:', message);
    return NextResponse.json(
      { error: 'Failed to delete rental' },
      { status: 500 }
    );
  }
}
