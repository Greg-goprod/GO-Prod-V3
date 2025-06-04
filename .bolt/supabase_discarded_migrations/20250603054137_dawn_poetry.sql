/*
  # Shifts Table Setup
  
  1. Changes
    - Create shifts table with proper structure
    - Add indexes for better performance
    - Add datetime validation constraint
*/

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  driver_id uuid REFERENCES drivers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT shifts_datetime_check CHECK (end_datetime > start_datetime)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shifts_start_datetime ON shifts(start_datetime);
CREATE INDEX IF NOT EXISTS idx_shifts_driver_id ON shifts(driver_id);

-- Disable RLS for development
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;