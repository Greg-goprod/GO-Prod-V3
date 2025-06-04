/*
  # Create shifts table with RLS policies

  1. New Tables
    - `shifts`
      - `id` (uuid, primary key)
      - `start_datetime` (timestamptz)
      - `end_datetime` (timestamptz)
      - `driver_id` (uuid, foreign key to drivers)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Indexes
    - On start_datetime for efficient date filtering
    - On driver_id for efficient driver lookups

  3. Constraints
    - Check constraint to ensure end_datetime is after start_datetime

  4. Security
    - Enable RLS
    - Add policies for authenticated users
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
DO $$ 
BEGIN
  -- Create SELECT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shifts' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON shifts
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Create INSERT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shifts' 
    AND policyname = 'Enable insert access for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert access for authenticated users"
      ON shifts
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Create UPDATE policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shifts' 
    AND policyname = 'Enable update access for authenticated users'
  ) THEN
    CREATE POLICY "Enable update access for authenticated users"
      ON shifts
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Create DELETE policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shifts' 
    AND policyname = 'Enable delete access for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete access for authenticated users"
      ON shifts
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;