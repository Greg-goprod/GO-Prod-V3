/*
  # Add driver_id column to shifts table

  1. Changes
    - Add `driver_id` column to `shifts` table
    - Add foreign key constraint to reference `drivers` table
    - Add index on `driver_id` column for better query performance

  2. Security
    - No RLS changes needed as the shifts table already has RLS policies
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shifts' AND column_name = 'driver_id'
  ) THEN
    ALTER TABLE shifts ADD COLUMN driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL;
    CREATE INDEX idx_shifts_driver_id ON shifts(driver_id);
  END IF;
END $$;