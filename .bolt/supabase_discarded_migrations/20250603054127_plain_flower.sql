/*
  # Storage policies for driver photos
  
  1. Changes
    - Add IF NOT EXISTS checks for bucket creation
    - Add IF NOT EXISTS checks for policies
    - Handle existing policies gracefully
*/

-- Create storage bucket for driver photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'driver-photos', 'driver-photos', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'driver-photos'
);

-- Create policies if they don't exist
DO $$ BEGIN
  -- Upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'authenticated users can upload driver photos'
  ) THEN
    CREATE POLICY "authenticated users can upload driver photos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'driver-photos');
  END IF;

  -- View policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'authenticated users can view driver photos'
  ) THEN
    CREATE POLICY "authenticated users can view driver photos"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'driver-photos');
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'authenticated users can delete driver photos'
  ) THEN
    CREATE POLICY "authenticated users can delete driver photos"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'driver-photos');
  END IF;
END $$;