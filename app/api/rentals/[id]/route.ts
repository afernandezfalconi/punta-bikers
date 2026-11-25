import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/api-auth';
import { adminClient } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ id: string }> };

function fail(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const auth = await getAuth(req);
    if (!auth) return fail('Unauthorized', 'UNAUTHORIZED', 401);
    const { id } = await params;

    const { data: rental, error } = await adminClient()
      .from('rentals')
      .select('*, scooters(model, license_plate), documents(id, document_type, status, rejection_reason, created_at)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!rental || (!auth.isAdmin && rental.user_id !== auth.user.id)) {
      return fail('Rental not found', 'NOT_FOUND', 404);
    }
    return NextResponse.json(rental);
  } catch (error) {
    console.error('Rental GET error:', error instanceof Error ? error.message : error);
    return fail('Failed to fetch rental', 'RENTAL_FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const auth = await getAuth(req);
    if (!auth) return fail('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await req.json().catch(() => ({}));
    const { id } = await params;

    // Money (cost) and status transitions are server-controlled (documents review and
    // payment webhook); customers may only edit notes / end_time on their own rentals.
    const updateData: Record<string, unknown> = {};
    if (body.end_time) updateData.end_time = body.end_time;
    if (body.notes) updateData.notes = body.notes;
    if (auth.isAdmin) {
      if (body.status) updateData.status = body.status;
      if (body.cost !== undefined) updateData.cost = body.cost;
    }
    updateData.updated_at = new Date();

    let query = adminClient().from('rentals').update(updateData).eq('id', id);
    if (!auth.isAdmin) query = query.eq('user_id', auth.user.id);
    const { data: rental, error } = await query.select();

    if (error) throw error;
    if (!rental?.length) return fail('Rental not found', 'NOT_FOUND', 404);
    return NextResponse.json(rental[0]);
  } catch (error) {
    console.error('Rental PUT error:', error instanceof Error ? error.message : error);
    return fail('Failed to update rental', 'RENTAL_UPDATE_FAILED', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const auth = await getAuth(req);
    if (!auth?.isAdmin) return fail('Forbidden', 'FORBIDDEN', 403);

    const { id } = await params;
    const { error } = await adminClient().from('rentals').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rental DELETE error:', error instanceof Error ? error.message : error);
    return fail('Failed to delete rental', 'RENTAL_DELETE_FAILED', 500);
  }
}
