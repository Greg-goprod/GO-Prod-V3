/*
  # Add storage policies for driver photos

  1. Changes
    - Create storage bucket for driver photos if it doesn't exist
    - Enable RLS on the bucket
    - Add policies for authenticated users to:
      - Upload photos
      - Read photos
      - Delete photos
*/

-- Create the bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('driver-photos', 'driver-photos')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload driver photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'driver-photos'
);

-- Policy to allow authenticated users to read photos
CREATE POLICY "Authenticated users can read driver photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'driver-photos'
);

-- Policy to allow authenticated users to delete their photos
CREATE POLICY "Authenticated users can delete driver photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'driver-photos'
);