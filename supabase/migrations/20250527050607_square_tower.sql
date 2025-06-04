/*
  # Fix drivers table RLS policies

  1. Security
    - Enable RLS on drivers table
    - Add policies for CRUD operations
*/

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON drivers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON drivers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON drivers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON drivers FOR DELETE
TO authenticated
USING (true);