/*
  # Fix Storage Policies for Driver Photos

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new storage bucket policies with proper permissions
    - Add RLS policies for authenticated users
  
  2. Security
    - Enable RLS on storage objects
    - Allow authenticated users to upload photos
    - Allow public access to view photos
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload driver photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view driver photos" ON storage.objects;

-- Create storage bucket for driver photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for uploading driver photos
CREATE POLICY "Users can upload driver photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-photos'
  AND owner = auth.uid()
);

-- Create policy for updating driver photos
CREATE POLICY "Users can update own driver photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'driver-photos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'driver-photos' AND owner = auth.uid());

-- Create policy for deleting driver photos
CREATE POLICY "Users can delete own driver photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'driver-photos' AND owner = auth.uid());

-- Create policy for viewing driver photos
CREATE POLICY "Anyone can view driver photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'driver-photos');