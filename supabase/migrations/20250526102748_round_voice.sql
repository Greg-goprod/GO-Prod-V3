/*
  # Create drivers schema
  
  1. New Types
    - T_SHIRT_SIZE enum
    - LANGUAGE enum
  
  2. New Tables
    - hired_year: Manages valid hire years
    - drivers: Main drivers table
    - driver_languages: Junction table for driver-language relationships
  
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create T_SHIRT_SIZE enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 't_shirt_size') THEN
    CREATE TYPE T_SHIRT_SIZE AS ENUM ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL');
  END IF;
END $$;

-- Create language enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language') THEN
    CREATE TYPE language AS ENUM ('French', 'English', 'German', 'Spanish', 'Portuguese');
  END IF;
END $$;

-- Create hired_year table for managing valid hire years
CREATE TABLE IF NOT EXISTS hired_year (
  year integer PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on hired_year
ALTER TABLE hired_year ENABLE ROW LEVEL SECURITY;

-- Create policies for hired_year
CREATE POLICY "Authenticated users can view hire years"
  ON hired_year
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage hire years"
  ON hired_year
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  street text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  birth_date date NOT NULL,
  t_shirt_size T_SHIRT_SIZE NOT NULL,
  hired_year integer NOT NULL REFERENCES hired_year(year),
  permits text[] NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on drivers
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create driver_languages junction table
CREATE TABLE IF NOT EXISTS driver_languages (
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  language language NOT NULL,
  PRIMARY KEY (driver_id, language)
);

-- Enable RLS on driver_languages
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Create policies for drivers
CREATE POLICY "Authenticated users can view drivers"
  ON drivers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage drivers"
  ON drivers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

-- Insert initial hire years
INSERT INTO hired_year (year)
SELECT generate_series(2015, EXTRACT(YEAR FROM CURRENT_DATE)::integer)
ON CONFLICT DO NOTHING;