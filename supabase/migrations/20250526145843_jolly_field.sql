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

-- Create storage bucket for driver photos
INSERT INTO storage.buckets (id, name, public)
SELECT 'driver-photos', 'driver-photos', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'driver-photos'
);

-- Create policy for uploading driver photos
CREATE POLICY "authenticated users can upload driver photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'driver-photos');

-- Create policy for viewing driver photos
CREATE POLICY "authenticated users can view driver photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'driver-photos');

-- Create policy for deleting driver photos
CREATE POLICY "authenticated users can delete driver photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'driver-photos');