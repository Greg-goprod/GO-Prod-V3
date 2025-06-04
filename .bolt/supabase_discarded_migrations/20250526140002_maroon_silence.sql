/*
  # Storage setup for driver photos

  1. Changes
    - Creates a storage bucket for driver photos
    - Sets up RLS policies for authenticated users
    - Configures file size and type restrictions

  2. Security
    - Bucket is private (not public)
    - Only authenticated users can access
    - File size limited to 5MB
    - Only image files allowed
*/

-- Create the storage bucket if it doesn't exist
BEGIN;

SET session_replication_role = 'replica';

INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the driver-photos bucket
CREATE POLICY "Authenticated users can upload driver photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-photos' AND
  octet_length(content) <= 5242880 AND -- 5MB limit
  mime_type IN ('image/jpeg', 'image/png', 'image/webp')
);

CREATE POLICY "Authenticated users can view driver photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'driver-photos');

CREATE POLICY "Authenticated users can update driver photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'driver-photos')
WITH CHECK (
  bucket_id = 'driver-photos' AND
  octet_length(content) <= 5242880 AND -- 5MB limit
  mime_type IN ('image/jpeg', 'image/png', 'image/webp')
);

CREATE POLICY "Authenticated users can delete driver photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'driver-photos');

SET session_replication_role = 'origin';

COMMIT;