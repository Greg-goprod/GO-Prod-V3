/*
  # Fix RLS policies for driver_languages table

  1. Security
    - Enable RLS on driver_languages table
    - Add policies for CRUD operations
*/

-- Enable RLS
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON driver_languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON driver_languages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON driver_languages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON driver_languages
  FOR DELETE
  TO authenticated
  USING (true);