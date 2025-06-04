/*
  # Update driver languages table

  1. Changes
    - Add created_at timestamp to driver_languages table
    - Add indexes for better query performance
    - Update RLS policies
*/

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'driver_languages' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE driver_languages ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add index on driver_id for better join performance
CREATE INDEX IF NOT EXISTS idx_driver_languages_driver_id ON driver_languages(driver_id);

-- Add index on language for filtering
CREATE INDEX IF NOT EXISTS idx_driver_languages_language ON driver_languages(language);

-- Ensure RLS is enabled
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Authenticated users can view driver languages" ON driver_languages;
DROP POLICY IF EXISTS "Authenticated users can manage driver languages" ON driver_languages;

CREATE POLICY "Authenticated users can view driver languages"
  ON driver_languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage driver languages"
  ON driver_languages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);