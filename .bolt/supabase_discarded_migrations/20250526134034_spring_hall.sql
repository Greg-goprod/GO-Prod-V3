/*
  # Create driver photos storage bucket and policies

  1. Storage Setup
    - Create `driver-photos` bucket for storing driver profile pictures
  
  2. Security
    - Enable RLS on the bucket
    - Add policies for:
      - Authenticated users can upload photos
      - Authenticated users can read photos
      - Authenticated users can update their photos
      - Authenticated users can delete their photos
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('driver-photos', 'driver-photos')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading photos (INSERT)
CREATE POLICY "Authenticated users can upload driver photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-photos'
);

-- Policy for viewing photos (SELECT)
CREATE POLICY "Authenticated users can view driver photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'driver-photos'
);

-- Policy for updating photos (UPDATE)
CREATE POLICY "Authenticated users can update driver photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'driver-photos'
)
WITH CHECK (
  bucket_id = 'driver-photos'
);

-- Policy for deleting photos (DELETE)
CREATE POLICY "Authenticated users can delete driver photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'driver-photos'
);