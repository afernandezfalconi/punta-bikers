import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('Scooter')
      .select('*')
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message, code: 'SCOOTERS_FETCH_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0,
    })
  } catch (err: any) {
    console.error('Error fetching scooters:', err)
    return NextResponse.json(
      { error: 'Failed to fetch scooters', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
