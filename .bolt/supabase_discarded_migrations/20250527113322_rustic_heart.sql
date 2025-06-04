/*
  # Fix contact functions RLS policies

  1. Changes
    - Drop existing RLS policies for contact_functions table
    - Create new, more specific policies for each operation
    
  2. Security
    - Enable RLS on contact_functions table
    - Add policies for:
      - SELECT: Allow authenticated users to view all contact functions
      - INSERT: Allow authenticated users to create contact functions
      - UPDATE: Allow authenticated users to update contact functions
      - DELETE: Allow authenticated users to delete contact functions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can manage contact functions" ON contact_functions;
DROP POLICY IF EXISTS "Authenticated users can view contact functions" ON contact_functions;

-- Create new specific policies
CREATE POLICY "Enable read access for authenticated users"
ON contact_functions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON contact_functions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON contact_functions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON contact_functions FOR DELETE
TO authenticated
USING (true);