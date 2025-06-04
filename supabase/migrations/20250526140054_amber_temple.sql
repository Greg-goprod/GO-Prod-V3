/*
  # Driver Photos Storage Setup
  
  1. New Tables
    - `driver_photos` table for storing photo metadata
      - `id` (uuid, primary key)
      - `driver_id` (uuid, references drivers)
      - `photo_url` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on driver_photos table
    - Add policies for authenticated users to manage their photos
*/

-- Create driver_photos table
CREATE TABLE IF NOT EXISTS driver_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE driver_photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view driver photos"
  ON driver_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert driver photos"
  ON driver_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update driver photos"
  ON driver_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete driver photos"
  ON driver_photos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_driver_photos_driver_id ON driver_photos(driver_id);