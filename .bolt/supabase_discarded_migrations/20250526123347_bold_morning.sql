/*
  # Fix RLS policies for languages table

  1. Security
    - Enable RLS on languages table
    - Add policies for full CRUD operations on languages table
    - Ensure authenticated users can manage languages
*/

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can manage languages" ON languages;
DROP POLICY IF EXISTS "Authenticated users can view languages" ON languages;

-- Create new comprehensive policy for all operations
CREATE POLICY "Authenticated users can manage languages"
ON languages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);