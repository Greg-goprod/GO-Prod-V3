/*
  # Enable RLS and Add Policies

  1. Security Changes
    - Enable RLS on tables that were missing it:
      - drivers
      - contacts
      - contact_functions
      - driver_languages
      - shifts
    - Add appropriate policies for each table to allow authenticated users to perform necessary operations

  2. Changes
    - No structural changes to tables
    - Only security policy updates
*/

-- Enable RLS on tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Policies for drivers table
CREATE POLICY "Allow authenticated users to view drivers"
  ON drivers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert drivers"
  ON drivers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update drivers"
  ON drivers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete drivers"
  ON drivers
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for contacts table
CREATE POLICY "Allow authenticated users to view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for contact_functions table
CREATE POLICY "Allow authenticated users to view contact functions"
  ON contact_functions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert contact functions"
  ON contact_functions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update contact functions"
  ON contact_functions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete contact functions"
  ON contact_functions
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for driver_languages table
CREATE POLICY "Allow authenticated users to view driver languages"
  ON driver_languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert driver languages"
  ON driver_languages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update driver languages"
  ON driver_languages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete driver languages"
  ON driver_languages
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for shifts table
CREATE POLICY "Allow authenticated users to view shifts"
  ON shifts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert shifts"
  ON shifts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update shifts"
  ON shifts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete shifts"
  ON shifts
  FOR DELETE
  TO authenticated
  USING (true);