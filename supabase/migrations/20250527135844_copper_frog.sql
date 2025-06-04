/*
  # Add multiple drivers per shift

  1. Changes
    - Remove driver_id from shifts table
    - Ensure shift_drivers table exists with proper structure
    - Add indexes for better query performance
  
  2. Security
    - Disable RLS for development
*/

-- Only drop driver_id if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shifts' AND column_name = 'driver_id'
  ) THEN
    ALTER TABLE shifts DROP COLUMN driver_id;
  END IF;
END $$;

-- Create shift_drivers table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'shift_drivers'
  ) THEN
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

    -- Disable RLS for development
    ALTER TABLE shift_drivers DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;