import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const token = req.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Failed to get user' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Auth me error:', message);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}
