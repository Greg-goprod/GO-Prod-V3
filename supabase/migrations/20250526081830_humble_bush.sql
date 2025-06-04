/*
  # Add artist photo storage

  1. Storage
    - Create a public bucket for artist photos
    - Set up policies for upload and viewing

  2. Database Changes
    - Add photo_url column to artists table
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
  bucket_id = 'artist-photos' AND
  (CASE WHEN metadata->>'size' IS NOT NULL 
    THEN (metadata->>'size')::int < 10485760 -- Limit file size to 10MB
    ELSE true
  END)
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