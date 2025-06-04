/*
  # Create artists table

  1. New Tables
    - `artists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `spotify_url` (text)
      - `performance_date` (timestamptz)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `artists` table
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create the artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  spotify_url text NOT NULL,
  performance_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

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