/*
  # Add driver permit enum type

  1. New Types
    - Creates DRIVER_PERMIT enum type with all valid permit values

  2. Changes
    - Converts existing permits column from text[] to DRIVER_PERMIT[]
    - Maintains NOT NULL constraint
    - Preserves existing data

  3. Security
    - Temporarily disables and re-enables RLS for the modification
*/

-- Create DRIVER_PERMIT enum type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_permit') THEN
    CREATE TYPE DRIVER_PERMIT AS ENUM (
      'A', 'A1', 'B', 'B1', 'BE', 
      'C', 'C1', 'C1E', 'CE',
      'D', 'D1', 'D1E', 'DE',
      'F', 'G', 'M',
      'TPP 121', 'TPP 122'
    );
  END IF;
END $$;

-- Temporarily disable RLS to modify the table
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;

-- Create a temporary column with the new type
ALTER TABLE drivers 
ADD COLUMN permits_enum DRIVER_PERMIT[] NULL;

-- Copy data from the old permits column to the new one
UPDATE drivers 
SET permits_enum = ARRAY(
  SELECT UNNEST(permits)::DRIVER_PERMIT
);

-- Drop the old column
ALTER TABLE drivers DROP COLUMN permits;

-- Add the new column with the correct name
ALTER TABLE drivers ADD COLUMN permits DRIVER_PERMIT[] NOT NULL DEFAULT '{}';

-- Copy data from temporary column
UPDATE drivers 
SET permits = permits_enum;

-- Drop the temporary column
ALTER TABLE drivers DROP COLUMN permits_enum;

-- Re-enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;