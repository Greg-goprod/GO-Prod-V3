/*
  # Fix RLS policies for driver photos

  1. Changes
    - Enable RLS on driver_photos table
    - Add policies for CRUD operations on driver_photos
    - Ensure authenticated users can manage photos
*/

-- Enable RLS on driver_photos table
ALTER TABLE driver_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for driver_photos
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