/*
  # Configure storage for driver photos
  
  1. Creates a private storage bucket for driver photos
  2. Enables RLS on storage.objects
  3. Creates policies for authenticated users to:
     - Upload photos
     - View photos
     - Update photos
     - Delete photos
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', false)
ON CONFLICT (id) DO NOTHING;

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
    WITH CHECK (
      bucket_id = 'driver-photos' AND
      octet_length(content) <= 5242880 AND -- 5MB limit
      mime_type IN ('image/jpeg', 'image/png', 'image/webp')
    );
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
    WITH CHECK (
      bucket_id = 'driver-photos' AND
      octet_length(content) <= 5242880 AND -- 5MB limit
      mime_type IN ('image/jpeg', 'image/png', 'image/webp')
    );
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