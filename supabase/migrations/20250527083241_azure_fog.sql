/*
  # Create contact functions table

  1. New Tables
    - `contact_functions`
      - `id` (uuid, primary key): Unique identifier for the function
      - `name` (text, unique): Name of the contact function (e.g., "Manager", "Tour Manager", "Sound Engineer")
      - `created_at` (timestamptz): Timestamp when the record was created

  2. Security
    - Enable RLS on `contact_functions` table
    - Add policies for authenticated users to:
      - Read all contact functions
      - Manage (create/update/delete) contact functions
*/

-- Create the contact_functions table
CREATE TABLE IF NOT EXISTS contact_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_functions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view contact functions"
  ON contact_functions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage contact functions"
  ON contact_functions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some common contact function types
INSERT INTO contact_functions (name) VALUES
  ('Tour Manager'),
  ('Production Manager'),
  ('Sound Engineer'),
  ('Light Engineer'),
  ('Stage Manager'),
  ('Artist Manager'),
  ('Driver'),
  ('Security'),
  ('Catering')
ON CONFLICT (name) DO NOTHING;