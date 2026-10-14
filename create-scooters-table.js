const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.trim();
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_ANON_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sql = `
CREATE TABLE IF NOT EXISTS scooters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model VARCHAR(255) NOT NULL,
  license_plate VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
  battery INTEGER DEFAULT 100 CHECK (battery >= 0 AND battery <= 100),
  location VARCHAR(255) DEFAULT 'Puerto Escondido',
  price_per_hour DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scooters_license_plate ON scooters(license_plate);
CREATE INDEX IF NOT EXISTS idx_scooters_status ON scooters(status);

ALTER TABLE scooters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON scooters
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON scooters
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON scooters
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON scooters
  FOR DELETE
  USING (auth.role() = 'authenticated');
`;

async function createTable() {
  try {
    console.log('Creating scooters table...');

    // Execute raw SQL via Supabase RPC (we need service key for this)
    // For now, we'll just test if the table exists by trying to query it
    const { data, error } = await supabase.from('scooters').select('*').limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('Table does not exist yet. Please create it manually in Supabase SQL Editor.');
      console.log('Copy this SQL and run it in Supabase > SQL Editor:');
      console.log(sql);
    } else if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('✓ Scooters table already exists!');
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

createTable();
