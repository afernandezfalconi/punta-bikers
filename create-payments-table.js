const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  mercado_pago_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  payment_method VARCHAR(50),
  transaction_date TIMESTAMP WITH TIME ZONE,
  webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON payments(rental_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_mercado_pago_id ON payments(mercado_pago_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON payments;
CREATE POLICY "Enable read for all users" ON payments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON payments;
CREATE POLICY "Enable insert for authenticated users" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON payments;
CREATE POLICY "Enable update for authenticated users" ON payments
  FOR UPDATE USING (auth.role() = 'authenticated');
`;

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Setting up payments table...');

    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement + ';');
      }
    }

    console.log('✓ Payments table created successfully!');

    const result = await client.query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='payments')`
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
