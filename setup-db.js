const { Pool } = require('pg');
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

const DATABASE_URL = envVars['DATABASE_URL'];

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

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

DROP POLICY IF EXISTS "Enable read access for all users" ON scooters;
CREATE POLICY "Enable read access for all users" ON scooters
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON scooters;
CREATE POLICY "Enable insert for authenticated users" ON scooters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON scooters;
CREATE POLICY "Enable update for authenticated users" ON scooters
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON scooters;
CREATE POLICY "Enable delete for authenticated users" ON scooters
  FOR DELETE USING (auth.role() = 'authenticated');
`;

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Setting up scooters table...');

    // Execute SQL
    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement + ';');
      }
    }

    console.log('✓ Scooters table created successfully!');

    // Verify table exists
    const result = await client.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='scooters')`
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
