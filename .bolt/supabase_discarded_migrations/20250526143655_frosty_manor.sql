/*
  # Fix driver photos storage permissions

  1. Changes
    - Create storage bucket for driver photos
    - Set up proper RLS policies for storage objects
    - Enable public access to driver photos

  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users to manage their photos
    - Allow public access to view photos
*/

-- Create storage bucket for driver photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload driver photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view driver photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update driver photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete driver photos" ON storage.objects;

-- Create new policies with proper checks
CREATE POLICY "Users can upload driver photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-photos' AND
  (CASE 
    WHEN mime_type IS NOT NULL THEN mime_type IN ('image/jpeg', 'image/png', 'image/webp')
    ELSE false
  END)
);

CREATE POLICY "Public can view driver photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'driver-photos');

CREATE POLICY "Users can update driver photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'driver-photos')
WITH CHECK (
  bucket_id = 'driver-photos' AND
  (CASE 
    WHEN mime_type IS NOT NULL THEN mime_type IN ('image/jpeg', 'image/png', 'image/webp')
    ELSE false
  END)
);

CREATE POLICY "Users can delete driver photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'driver-photos');