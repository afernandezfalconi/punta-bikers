import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client. Bypasses RLS, so ONLY use it in server code after the
 * caller has been authenticated/authorized (see getAuth in api-auth.ts).
 */
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role is not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}
