import type { NextRequest } from 'next/server'
import { createClient, type User } from '@supabase/supabase-js'

export type AuthResult = { user: User; isAdmin: boolean } | null

/**
 * Resolves the authenticated user from the `sb-access-token` cookie.
 * Admin = `app_metadata.role === 'admin'` (only settable server-side)
 * or an email listed in the ADMIN_EMAILS env var (comma separated).
 */
export async function getAuth(req: NextRequest): Promise<AuthResult> {
  const token = req.cookies.get('sb-access-token')?.value
  if (!token) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const email = data.user.email?.toLowerCase() ?? ''
  const isAdmin = data.user.app_metadata?.role === 'admin' || adminEmails.includes(email)

  return { user: data.user, isAdmin }
}

/** Supabase client that acts as the user (so RLS applies). */
export function userClient(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value ?? ''
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}
