import { NextRequest, NextResponse } from 'next/server';
import { getAuth, userClient } from '@/lib/api-auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const supabase = userClient(req);
    const body = await req.json();
    const { id } = await params;

    // Money (cost) and status transitions are server-controlled (payment webhook);
    // customers may only edit notes / end_time on their own rentals.
    const updateData: Record<string, unknown> = {};
    if (body.end_time) updateData.end_time = body.end_time;
    if (body.notes) updateData.notes = body.notes;
    if (auth.isAdmin) {
      if (body.status) updateData.status = body.status;
      if (body.cost !== undefined) updateData.cost = body.cost;
    }
    updateData.updated_at = new Date();

    let query = supabase.from('rentals').update(updateData).eq('id', id);
    if (!auth.isAdmin) query = query.eq('user_id', auth.user.id);
    const { data: rental, error } = await query.select();

    if (error) throw error;
    if (!rental?.length) {
      return NextResponse.json({ error: 'Rental not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(rental[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rental PUT error:', message);
    return NextResponse.json(
      { error: 'Failed to update rental', code: 'RENTAL_UPDATE_FAILED' },
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

    const { id } = await params;
    const { error } = await userClient(req).from('rentals').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Rental DELETE error:', message);
    return NextResponse.json(
      { error: 'Failed to delete rental', code: 'RENTAL_DELETE_FAILED' },
      { status: 500 }
    );
  }
}
