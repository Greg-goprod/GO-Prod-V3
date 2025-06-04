-- Create vehicle type enum
CREATE TYPE vehicle_type AS ENUM (
  'VAN',
  'SEDAN',
  'SUV',
  'MINIBUS',
  'LIMOUSINE',
  'BUS'
);

-- Create fuel type enum
CREATE TYPE fuel_type AS ENUM (
  'GASOLINE',
  'DIESEL',
  'ELECTRIC',
  'HYBRID',
  'PLUG_IN_HYBRID'
);

-- Create vehicle status enum
CREATE TYPE vehicle_status AS ENUM (
  'AVAILABLE',
  'UNAVAILABLE',
  'MAINTENANCE'
);

-- Create vehicles table
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  type vehicle_type NOT NULL,
  color text NOT NULL,
  passenger_capacity integer NOT NULL,
  luggage_capacity integer NOT NULL,
  engagement_number text NOT NULL,
  registration_number text NOT NULL,
  fuel_type fuel_type NOT NULL,
  additional_equipment text,
  supplier text,
  status vehicle_status NOT NULL DEFAULT 'AVAILABLE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle check logs table
CREATE TABLE vehicle_check_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('RECEPTION', 'RETURN')),
  date date NOT NULL,
  kilometers integer NOT NULL,
  defects text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicle_check_logs_vehicle ON vehicle_check_logs(vehicle_id);

-- Disable RLS for development
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_check_logs DISABLE ROW LEVEL SECURITY;