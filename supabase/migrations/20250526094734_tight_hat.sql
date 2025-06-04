/*
  # Create scenes table and management functionality
  
  1. New Tables:
    - scenes
      - id (uuid, primary key)
      - name (text, unique)
      - color (text)
      - created_at (timestamp)
  
  2. Security:
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view scenes"
  ON scenes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create scenes"
  ON scenes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update scenes"
  ON scenes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert default scenes
INSERT INTO scenes (name, color) VALUES
  ('MAINSTAGE', '#EFF6FF'),
  ('RIVERSTAGE', '#F0FDFA'),
  ('LA GRANGE', '#FFFBEB')
ON CONFLICT (name) DO NOTHING;