import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/api-auth';
import { adminClient } from '@/lib/supabase-admin';

function fail(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

// Customers see their own rentals; admins see all (role filtering done here, RLS is the backstop).
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuth(req);
    if (!auth) return fail('Unauthorized', 'UNAUTHORIZED', 401);

    let query = adminClient()
      .from('rentals')
      .select('*, scooters(model, license_plate)')
      .order('created_at', { ascending: false });
    if (!auth.isAdmin) query = query.eq('user_id', auth.user.id);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Rentals GET error:', error instanceof Error ? error.message : error);
    return fail('Failed to fetch rentals', 'RENTALS_FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth(req);
    if (!auth) return fail('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await req.json().catch(() => null);
    if (!body?.scooter_id || typeof body.scooter_id !== 'string') {
      return fail('Missing scooter_id', 'VALIDATION_ERROR', 400);
    }

    const supabase = adminClient();
    const { data: scooter, error: scooterError } = await supabase
      .from('scooters')
      .select('price_per_hour, status')
      .eq('id', body.scooter_id)
      .single();

    if (scooterError || !scooter) return fail('Scooter not found', 'NOT_FOUND', 404);
    if (scooter.status !== 'available') {
      return fail('Scooter not available', 'SCOOTER_UNAVAILABLE', 400);
    }

    // user_id, status and cost are always server-decided. A rental starts at
    // pending_doc and only moves forward through document approval and payment.
    const { data: rental, error } = await supabase
      .from('rentals')
      .insert([
        {
          scooter_id: body.scooter_id,
          user_id: auth.user.id,
          status: 'pending_doc',
          cost: scooter.price_per_hour,
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json(rental?.[0], { status: 201 });
  } catch (error) {
    console.error('Rentals POST error:', error instanceof Error ? error.message : error);
    return fail('Failed to create rental', 'RENTAL_CREATE_FAILED', 500);
  }
}
