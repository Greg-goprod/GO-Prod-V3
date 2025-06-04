/*
  # Add contact functions

  1. Changes
    - Adds all contact functions to the contact_functions table
    - Uses ON CONFLICT DO NOTHING to safely handle duplicates

  2. Security
    - Maintains existing RLS settings
*/

INSERT INTO contact_functions (name) VALUES
  ('Agent'),
  ('Artiste'),
  ('Booker'),
  ('Chargé de production'),
  ('Concepteur lumière'),
  ('Dancer'),
  ('Directeur de production'),
  ('Directeur technique'),
  ('Ingé son foh'),
  ('Ingé son mon'),
  ('Manager'),
  ('Presse communication'),
  ('Prod manager / régisseur tournée'),
  ('Producteur'),
  ('Production vf'),
  ('Responsable administrative'),
  ('Régie lumière'),
  ('Régie technique'),
  ('Sfx'),
  ('Stage manager'),
  ('Tour manager'),
  ('Venue manager')
ON CONFLICT (name) DO NOTHING;