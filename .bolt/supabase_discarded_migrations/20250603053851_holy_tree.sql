/*
  # Driver Photos Table

  1. Changes
    - Create driver_photos table if it doesn't exist
    - Add RLS policies for authenticated users
    - Add index for driver_id lookups

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Create driver_photos table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS driver_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
    photo_url text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE driver_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view driver photos" ON driver_photos;
DROP POLICY IF EXISTS "Authenticated users can insert driver photos" ON driver_photos;
DROP POLICY IF EXISTS "Authenticated users can update driver photos" ON driver_photos;
DROP POLICY IF EXISTS "Authenticated users can delete driver photos" ON driver_photos;

-- Create policies
CREATE POLICY "Authenticated users can view driver photos"
  ON driver_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert driver photos"
  ON driver_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update driver photos"
  ON driver_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete driver photos"
  ON driver_photos
  FOR DELETE
  TO authenticated
  USING (true);

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_driver_photos_driver_id;

-- Create index for faster lookups
CREATE INDEX idx_driver_photos_driver_id ON driver_photos(driver_id);