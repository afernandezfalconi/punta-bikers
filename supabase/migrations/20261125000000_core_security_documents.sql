-- PUNTA BIKERS: security hardening + document verification flow.
-- Safe to re-run. Apply in Supabase SQL editor (or `supabase db push`).
-- All privileged writes go through the Next.js API using the service role,
-- which bypasses RLS. Users/anon only get the read access defined here.

-- 1. Rental state machine: pending_doc -> pending_payment -> active -> completed (| cancelled)
ALTER TABLE rentals DROP CONSTRAINT IF EXISTS rentals_status_check;
UPDATE rentals SET status = 'pending_doc' WHERE status = 'pending';
ALTER TABLE rentals
  ADD CONSTRAINT rentals_status_check
  CHECK (status IN ('pending_doc', 'pending_payment', 'active', 'completed', 'cancelled'));
ALTER TABLE rentals ALTER COLUMN status SET DEFAULT 'pending_doc';

-- 2. rentals: owners read their own rows; nobody writes through PostgREST.
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read for all users" ON rentals;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rentals;
DROP POLICY IF EXISTS "Enable update for rental owner" ON rentals;
DROP POLICY IF EXISTS "Enable delete for rental owner" ON rentals;
DROP POLICY IF EXISTS "rentals_select_own_or_admin" ON rentals;
CREATE POLICY "rentals_select_own_or_admin" ON rentals
  FOR SELECT USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 3. scooters: public catalog read; writes only via server (admin-checked).
ALTER TABLE scooters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON scooters;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON scooters;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON scooters;

-- 4. payments: owners can read payments of their rentals; writes via server only.
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM rentals r WHERE r.id = payments.rental_id AND r.user_id = auth.uid())
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 5. documents (INE / passport), reviewed manually by admin/receptionist.
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('INE', 'PASSPORT')),
  front_path TEXT NOT NULL,
  back_path TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_documents_rental_id ON documents(rental_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "documents_select_own_or_admin" ON documents;
CREATE POLICY "documents_select_own_or_admin" ON documents
  FOR SELECT USING (
    auth.uid() = user_id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 6. Private bucket for ID photos (no public URLs; admins get short-lived signed URLs).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = false;
