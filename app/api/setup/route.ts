import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      return NextResponse.json(
        {
          error: 'SUPABASE_SERVICE_ROLE_KEY not configured. Please add it to your .env.local',
          instructions:
            '1. Go to Supabase Dashboard\n2. Settings > API\n3. Copy "service_role" key\n4. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=<key>\n5. Redeploy',
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

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
        FOR SELECT
        USING (true);

      DROP POLICY IF EXISTS "Enable insert for authenticated users" ON scooters;
      CREATE POLICY "Enable insert for authenticated users" ON scooters
        FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Enable update for authenticated users" ON scooters;
      CREATE POLICY "Enable update for authenticated users" ON scooters
        FOR UPDATE
        USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Enable delete for authenticated users" ON scooters;
      CREATE POLICY "Enable delete for authenticated users" ON scooters
        FOR DELETE
        USING (auth.role() = 'authenticated');
    `;

    const { data, error } = await supabase.rpc('exec', { sql });

    if (error) {
      // Try alternative method - use fetch directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });

      if (!response.ok) {
        // If exec RPC doesn't exist, return manual SQL
        return NextResponse.json(
          {
            status: 'success_manual',
            message: 'Copy and paste this SQL in Supabase > SQL Editor',
            sql,
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Scooters table created successfully!',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: 'manual_required',
        message: 'Please create the table manually',
        error: message,
        sql: getSql(),
      },
      { status: 500 }
    );
  }
}

function getSql() {
  return `
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
}
