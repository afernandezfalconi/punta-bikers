import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const envCheck = {
      supabase_url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_key_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      node_env: process.env.NODE_ENV,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'API test endpoint',
      env: envCheck,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Test endpoint error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
