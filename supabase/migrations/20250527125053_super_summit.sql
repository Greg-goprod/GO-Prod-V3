/*
  # Shifts Table Setup

  1. Changes
    - Disable RLS temporarily for development
    - Add proper indexes for performance
    - Add constraints for data integrity

  2. Security
    - Temporarily disable RLS for development phase
*/

-- First ensure the table exists with proper structure
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  driver_id uuid REFERENCES drivers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shifts_start_datetime ON shifts(start_datetime);
CREATE INDEX IF NOT EXISTS idx_shifts_driver_id ON shifts(driver_id);

-- Add constraint to ensure end_datetime is after start_datetime
ALTER TABLE shifts DROP CONSTRAINT IF EXISTS shifts_datetime_check;
ALTER TABLE shifts ADD CONSTRAINT shifts_datetime_check 
  CHECK (end_datetime > start_datetime);

-- Disable RLS for development
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;