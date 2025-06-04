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
DROP TABLE IF EXISTS driver_languages CASCADE;
DROP TYPE IF EXISTS language CASCADE;

-- Create languages table for dynamic management if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS languages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS on languages table
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view languages" ON languages;
DROP POLICY IF EXISTS "Authenticated users can manage languages" ON languages;

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

-- Create new driver_languages junction table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS driver_languages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    language_id uuid NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(driver_id, language_id)
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_driver_languages_driver_id;
DROP INDEX IF EXISTS idx_driver_languages_language_id;

-- Create indexes for better performance
CREATE INDEX idx_driver_languages_driver_id ON driver_languages(driver_id);
CREATE INDEX idx_driver_languages_language_id ON driver_languages(language_id);

-- Enable RLS on driver_languages
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view driver languages" ON driver_languages;
DROP POLICY IF EXISTS "Authenticated users can manage driver languages" ON driver_languages;

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