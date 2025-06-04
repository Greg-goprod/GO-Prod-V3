/*
  # Add driver photos support
  
  1. New Storage
    - Create 'driver-photos' bucket for storing driver profile pictures
    - Add storage policies for authenticated users
  
  2. Schema Changes
    - Add photo_url column to drivers table
    
  3. Security
    - Enable public access to driver photos
    - Maintain existing RLS policies
*/

-- Create storage bucket for driver photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-photos', 'driver-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the driver-photos bucket
CREATE POLICY "Users can upload driver photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'driver-photos');

-- Allow public access to driver photos
CREATE POLICY "Public can view driver photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'driver-photos');

-- Add photo_url column to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS photo_url text;