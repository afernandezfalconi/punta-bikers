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

const { Pool } = require('pg');

const DATABASE_URL = envVars['DATABASE_URL'];

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const sql = `
CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scooter_id UUID NOT NULL REFERENCES scooters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rentals_scooter_id ON rentals(scooter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);

ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON rentals;
CREATE POLICY "Enable read for all users" ON rentals
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rentals;
CREATE POLICY "Enable insert for authenticated users" ON rentals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable update for rental owner" ON rentals;
CREATE POLICY "Enable update for rental owner" ON rentals
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for rental owner" ON rentals;
CREATE POLICY "Enable delete for rental owner" ON rentals
  FOR DELETE USING (auth.uid() = user_id);
`;

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Setting up rentals table...');

    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement + ';');
      }
    }

    console.log('✓ Rentals table created successfully!');

    const result = await client.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='rentals')`
    );
    console.log('✓ Table verification:', result.rows[0].exists ? 'EXISTS' : 'NOT FOUND');

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

setupDatabase();
