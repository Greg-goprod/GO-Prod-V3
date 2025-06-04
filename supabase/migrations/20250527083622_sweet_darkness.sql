/*
  # Update contact functions

  1. Changes
    - Adds predefined contact functions to match the existing data

  2. Security
    - Maintains existing RLS policies
*/

-- Insert or update contact functions
INSERT INTO contact_functions (name) VALUES
  ('Tour Manager'),
  ('PR Manager'),
  ('Agent'),
  ('Event Coordinator'),
  ('Technical Director'),
  ('Production Manager'),
  ('Sound Engineer'),
  ('Light Engineer'),
  ('Stage Manager'),
  ('Artist Manager'),
  ('Driver'),
  ('Security'),
  ('Catering')
ON CONFLICT (name) DO NOTHING;