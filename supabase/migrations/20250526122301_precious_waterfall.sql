/*
  # Fix driver_languages table structure

  1. Changes
    - Drop and recreate driver_languages table with proper structure
    - Add necessary indexes
    - Set up RLS policies
    - Add foreign key constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- First ensure the language type exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language') THEN
    CREATE TYPE language AS ENUM ('French', 'English', 'German', 'Spanish', 'Portuguese');
  END IF;
END $$;

-- Drop and recreate the table with proper structure
DROP TABLE IF EXISTS driver_languages;

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

-- Enable RLS
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Create policies
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