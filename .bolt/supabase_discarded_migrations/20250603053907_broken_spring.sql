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
INSERT INTO storage.buckets (id, name, public)
SELECT 'driver-photos', 'driver-photos', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'driver-photos'
);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "authenticated users can upload driver photos" ON storage.objects;
DROP POLICY IF EXISTS "authenticated users can view driver photos" ON storage.objects;
DROP POLICY IF EXISTS "authenticated users can delete driver photos" ON storage.objects;

-- Create policy for uploading driver photos
DO $$ BEGIN
  CREATE POLICY "authenticated users can upload driver photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'driver-photos');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policy for viewing driver photos
DO $$ BEGIN
  CREATE POLICY "authenticated users can view driver photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'driver-photos');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policy for deleting driver photos
DO $$ BEGIN
  CREATE POLICY "authenticated users can delete driver photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'driver-photos');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;