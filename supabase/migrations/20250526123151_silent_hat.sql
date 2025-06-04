/*
  # Update language management
  
  1. Changes
    - Drop language enum type
    - Create languages table for dynamic language management
    - Update driver_languages table to reference languages table
    - Add initial language values
    - Update foreign key relationships
  
  2. Security
    - Enable RLS on languages table
    - Add policies for authenticated users
*/

-- Drop existing language type and related table
DROP TABLE IF EXISTS driver_languages;
DROP TYPE IF EXISTS language;

-- Create languages table for dynamic management
CREATE TABLE languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on languages table
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Create policies for languages table
CREATE POLICY "Authenticated users can view languages"
  ON languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage languages"
  ON languages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create new driver_languages junction table
CREATE TABLE driver_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  language_id uuid NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(driver_id, language_id)
);

-- Create indexes for better performance
CREATE INDEX idx_driver_languages_driver_id ON driver_languages(driver_id);
CREATE INDEX idx_driver_languages_language_id ON driver_languages(language_id);

-- Enable RLS on driver_languages
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Create policies for driver_languages
CREATE POLICY "Authenticated users can view driver languages"
  ON driver_languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage driver languages"
  ON driver_languages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial languages
INSERT INTO languages (name) VALUES
  ('French'),
  ('English'),
  ('German'),
  ('Spanish'),
  ('Portuguese'),
  ('Mandarin')
ON CONFLICT (name) DO NOTHING;