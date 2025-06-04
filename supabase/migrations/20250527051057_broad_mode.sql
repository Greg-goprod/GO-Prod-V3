/*
  # Fix driver languages RLS policies

  1. Security
    - Enable RLS on driver_languages table
    - Add policies for CRUD operations if they don't exist
*/

-- Enable RLS
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Create SELECT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON driver_languages
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Create INSERT policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Enable insert access for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert access for authenticated users"
      ON driver_languages
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Create UPDATE policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Enable update access for authenticated users'
  ) THEN
    CREATE POLICY "Enable update access for authenticated users"
      ON driver_languages
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Create DELETE policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Enable delete access for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete access for authenticated users"
      ON driver_languages
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;