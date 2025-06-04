/*
  # Shifts Table Setup
  
  1. New Tables
    - `shifts`
      - `id` (uuid, primary key)
      - `start_datetime` (timestamptz)
      - `end_datetime` (timestamptz) 
      - `driver_id` (uuid, foreign key to drivers)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Indexes
    - Index on start_datetime for efficient date-based queries
    - Index on driver_id for efficient driver lookups
  
  3. Constraints
    - Check constraint ensuring end_datetime is after start_datetime
    - Foreign key constraint to drivers table
*/

DO $$ BEGIN
  -- Create the shifts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS shifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    start_datetime timestamptz NOT NULL,
    end_datetime timestamptz NOT NULL,
    driver_id uuid REFERENCES drivers(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shifts_start_datetime'
  ) THEN
    CREATE INDEX idx_shifts_start_datetime ON shifts(start_datetime);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shifts_driver_id'
  ) THEN
    CREATE INDEX idx_shifts_driver_id ON shifts(driver_id);
  END IF;

  -- Add datetime check constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shifts_datetime_check'
  ) THEN
    ALTER TABLE shifts ADD CONSTRAINT shifts_datetime_check 
      CHECK (end_datetime > start_datetime);
  END IF;

END $$;

-- Disable RLS for development
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;