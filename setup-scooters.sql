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
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON scooters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON scooters
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON scooters
  FOR DELETE USING (auth.role() = 'authenticated');
