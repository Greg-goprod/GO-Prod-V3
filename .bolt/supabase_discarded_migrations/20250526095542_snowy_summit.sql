/*
  # Create storage for artist photos

  1. Storage
    - Creates a public storage bucket for artist photos
    - Sets up policies for upload and viewing

  2. Schema Changes
    - Adds photo_url column to artists table if it doesn't exist

  3. Security
    - Allows authenticated users to upload photos
    - Allows public access to view photos
*/

-- Create storage bucket for artist photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-photos', 'artist-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the artist-photos bucket
CREATE POLICY "Users can upload artist photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'artist-photos'
);

-- Allow public access to artist photos
CREATE POLICY "Public can view artist photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'artist-photos');

-- Add photo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artists' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE artists ADD COLUMN photo_url text;
  END IF;
END $$;