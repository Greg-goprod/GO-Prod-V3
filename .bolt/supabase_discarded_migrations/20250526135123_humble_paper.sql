/*
  # Driver Photos Storage Setup

  1. Storage Configuration
    - Creates a storage bucket for driver photos
    - Sets bucket to be private (not public)
    - Configures allowed file types and size limits

  2. Security
    - Enables Row Level Security (RLS) on storage.objects
    - Creates policies for authenticated users to:
      - Upload photos
      - View photos
      - Update photos
      - Delete photos
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Set bucket configuration
UPDATE storage.buckets
SET metadata = JSONB_BUILD_OBJECT(
  'allowedMimeTypes', ARRAY['image/jpeg', 'image/png', 'image/webp'],
  'fileSizeLimit', 5242880 -- 5MB
)
WHERE id = 'driver-photos';

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the driver-photos bucket
DO $$ 
BEGIN
  -- Policy for uploading photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload driver photos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'driver-photos');
  END IF;

  -- Policy for viewing photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can view driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can view driver photos"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'driver-photos');
  END IF;

  -- Policy for updating photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can update driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can update driver photos"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'driver-photos')
    WITH CHECK (bucket_id = 'driver-photos');
  END IF;

  -- Policy for deleting photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can delete driver photos'
  ) THEN
    CREATE POLICY "Authenticated users can delete driver photos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'driver-photos');
  END IF;
END $$;