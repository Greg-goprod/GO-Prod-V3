/*
  # Création de la table des contacts

  1. Nouvelle Table
    - `contacts`
      - `id` (uuid, clé primaire)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `function_id` (uuid, référence contact_functions)
      - `artist_id` (uuid, référence artists)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS désactivé pour le développement initial
*/

CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  function_id uuid NOT NULL REFERENCES contact_functions(id),
  artist_id uuid REFERENCES artists(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;