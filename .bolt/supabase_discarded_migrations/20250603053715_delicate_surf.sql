/*
  # Storage policies for driver photos

  1. Changes
    - Create storage bucket for driver photos
    - Add policies for authenticated users to:
      - Upload photos
      - View photos
      - Delete photos

  2. Security
    - Enable RLS
    - Restrict operations to authenticated users
    - Limit operations to driver-photos bucket
*/

-- Create storage bucket for driver photos if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'driver-photos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('driver-photos', 'driver-photos', true);
  END IF;
END $$;

-- Create or replace policies for driver photos
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "authenticated users can upload driver photos" ON storage.objects;
  DROP POLICY IF EXISTS "authenticated users can view driver photos" ON storage.objects;
  DROP POLICY IF EXISTS "authenticated users can delete driver photos" ON storage.objects;

  -- Create new policies
  CREATE POLICY "authenticated users can upload driver photos"
    ON storage.objects 
    FOR INSERT 
    TO authenticated
    WITH CHECK (bucket_id = 'driver-photos');

  CREATE POLICY "authenticated users can view driver photos"
    ON storage.objects 
    FOR SELECT 
    TO authenticated
    USING (bucket_id = 'driver-photos');

  CREATE POLICY "authenticated users can delete driver photos"
    ON storage.objects 
    FOR DELETE 
    TO authenticated
    USING (bucket_id = 'driver-photos');
END $$;