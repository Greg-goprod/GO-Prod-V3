/*
  # Create artists table with policies

  1. New Tables
    - `artists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `spotify_url` (text)
      - `performance_date` (timestamptz)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `artists` table
    - Add policies for CRUD operations
*/

-- Create the artists table if it doesn't exist
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  spotify_url text NOT NULL,
  performance_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view all artists" ON artists;
  DROP POLICY IF EXISTS "Users can create artists" ON artists;
  DROP POLICY IF EXISTS "Users can update their artists" ON artists;
  DROP POLICY IF EXISTS "Users can delete their artists" ON artists;
END $$;

-- Create policies
CREATE POLICY "Users can view all artists"
  ON artists
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create artists"
  ON artists
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their artists"
  ON artists
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete their artists"
  ON artists
  FOR DELETE
  TO authenticated
  USING (true);