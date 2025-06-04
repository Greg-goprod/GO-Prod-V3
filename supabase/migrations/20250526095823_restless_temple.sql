/*
  # Storage setup for artist photos
  
  1. Changes
    - Creates artist-photos storage bucket if it doesn't exist
    - Adds upload policy for authenticated users
    - Adds view policy for public access
    - Adds photo_url column to artists table
  
  2. Security
    - Only authenticated users can upload photos
    - Public read access for photos
*/

-- Create storage bucket for artist photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-photos', 'artist-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the artist-photos bucket
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload artist photos'
  ) THEN
    CREATE POLICY "Users can upload artist photos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'artist-photos');
  END IF;
END $$;

-- Allow public access to artist photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public can view artist photos'
  ) THEN
    CREATE POLICY "Public can view artist photos"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'artist-photos');
  END IF;
END $$;

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