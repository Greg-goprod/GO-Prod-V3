/*
  # Update driver_languages table structure

  1. Changes
    - Add language column definition
    - Add driver_id foreign key constraint
    - Add created_at timestamp
  
  2. Security
    - Ensure RLS is enabled
    - Update policies for authenticated users
*/

-- First ensure the language type exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language') THEN
    CREATE TYPE language AS ENUM ('French', 'English', 'German', 'Spanish', 'Portuguese');
  END IF;
END $$;

-- Drop and recreate the table with proper constraints
DROP TABLE IF EXISTS driver_languages;

CREATE TABLE driver_languages (
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  language language NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (driver_id, language)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_driver_languages_driver_id ON driver_languages(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_languages_language ON driver_languages(language);

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