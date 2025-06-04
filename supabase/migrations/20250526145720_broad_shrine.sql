/*
  # Storage Policies for Driver Photos

  1. Changes
    - Creates storage bucket for driver photos
    - Sets up RLS policies for driver photo access

  2. Security
    - Enables public access to view photos
    - Restricts upload/update/delete to authenticated users
    - Users can only modify their own photos
*/

-- Create storage bucket for driver photos
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('driver-photos', 'driver-photos', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage.objects policies
BEGIN;
  -- Delete policies if they exist
  DROP POLICY IF EXISTS "Users can upload driver photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own driver photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own driver photos" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view driver photos" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Users can upload driver photos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'driver-photos' AND auth.role() = 'authenticated');

  CREATE POLICY "Users can update own driver photos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'driver-photos' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'driver-photos' AND owner = auth.uid());

  CREATE POLICY "Users can delete own driver photos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'driver-photos' AND owner = auth.uid());

  CREATE POLICY "Anyone can view driver photos"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'driver-photos');
COMMIT;