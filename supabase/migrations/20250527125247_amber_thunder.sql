/*
  # Shifts Table Setup

  1. Table Structure
    - Creates shifts table with proper columns and constraints
    - Adds indexes for performance optimization
    - Ensures end time is after start time

  2. Security
    - Enables RLS
    - Adds policies for authenticated users to manage shifts
*/

-- Create shifts table if it doesn't exist
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  driver_id uuid REFERENCES drivers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT shifts_datetime_check CHECK (end_datetime > start_datetime)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shifts_start_datetime ON shifts(start_datetime);
CREATE INDEX IF NOT EXISTS idx_shifts_driver_id ON shifts(driver_id);

-- Enable RLS
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
ON shifts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON shifts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON shifts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON shifts FOR DELETE
TO authenticated
USING (true);