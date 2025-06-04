/*
  # Update language enum and add Mandarin

  1. Changes
    - Add Mandarin to the language enum
    - Recreate the language type with updated values
    - Update driver_languages table to use new enum
*/

-- Temporarily disable RLS
ALTER TABLE driver_languages DISABLE ROW LEVEL SECURITY;

-- Drop existing language type (must drop table first since it depends on the type)
DROP TABLE driver_languages;
DROP TYPE language;

-- Recreate language type with updated values
CREATE TYPE language AS ENUM (
  'French',
  'English',
  'German',
  'Spanish',
  'Portuguese',
  'Mandarin'
);

-- Recreate driver_languages table
CREATE TABLE driver_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  language language NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(driver_id, language)
);

-- Create indexes for better performance
CREATE INDEX idx_driver_languages_driver_id ON driver_languages(driver_id);
CREATE INDEX idx_driver_languages_language ON driver_languages(language);

-- Re-enable RLS
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Recreate policies
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