-- First, create the new join table
CREATE TABLE shift_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shift_id, driver_id)
);

-- Create indexes for better performance
CREATE INDEX idx_shift_drivers_shift_id ON shift_drivers(shift_id);
CREATE INDEX idx_shift_drivers_driver_id ON shift_drivers(driver_id);

-- Remove the old driver_id column from shifts
ALTER TABLE shifts DROP COLUMN IF EXISTS driver_id;

-- Disable RLS for development
ALTER TABLE shift_drivers DISABLE ROW LEVEL SECURITY;