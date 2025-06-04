/*
  # Update language management
  
  1. Changes
    - Create languages table for dynamic language management
    - Update driver_languages table to reference languages table
    - Add initial language values
    - Update foreign key relationships
  
  2. Security
    - Enable RLS on languages table
    - Add policies for authenticated users
*/

-- Create languages table if it doesn't exist
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

-- Create policies for languages table if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'languages' 
    AND policyname = 'Authenticated users can view languages'
  ) THEN
    CREATE POLICY "Authenticated users can view languages"
      ON languages
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'languages' 
    AND policyname = 'Authenticated users can manage languages'
  ) THEN
    CREATE POLICY "Authenticated users can manage languages"
      ON languages
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create driver_languages table if it doesn't exist
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

-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_driver_languages_driver_id'
  ) THEN
    CREATE INDEX idx_driver_languages_driver_id ON driver_languages(driver_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_driver_languages_language_id'
  ) THEN
    CREATE INDEX idx_driver_languages_language_id ON driver_languages(language_id);
  END IF;
END $$;

-- Enable RLS on driver_languages
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Create policies for driver_languages if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Authenticated users can view driver languages'
  ) THEN
    CREATE POLICY "Authenticated users can view driver languages"
      ON driver_languages
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'driver_languages' 
    AND policyname = 'Authenticated users can manage driver languages'
  ) THEN
    CREATE POLICY "Authenticated users can manage driver languages"
      ON driver_languages
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Insert initial languages if they don't exist
INSERT INTO languages (name)
VALUES
  ('French'),
  ('English'),
  ('German'),
  ('Spanish'),
  ('Portuguese'),
  ('Mandarin')
ON CONFLICT (name) DO NOTHING;