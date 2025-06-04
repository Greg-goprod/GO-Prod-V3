/*
  # Update RLS policies for driver photos

  1. Security
    - Enable RLS on driver_photos table
    - Add policies for CRUD operations for authenticated users
*/

-- Enable RLS on driver_photos table
ALTER TABLE driver_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for driver_photos
DO $$ 
BEGIN
  -- Policy for viewing photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_photos' 
    AND policyname = 'Authenticated users can view driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can view driver photos"
    ON driver_photos
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  -- Policy for inserting photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_photos' 
    AND policyname = 'Authenticated users can insert driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can insert driver photos"
    ON driver_photos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;

  -- Policy for updating photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_photos' 
    AND policyname = 'Authenticated users can update driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can update driver photos"
    ON driver_photos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;

  -- Policy for deleting photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_photos' 
    AND policyname = 'Authenticated users can delete driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can delete driver photos"
    ON driver_photos
    FOR DELETE
    TO authenticated
    USING (true);
  END IF;
END $$;