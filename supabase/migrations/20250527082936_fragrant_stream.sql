/*
  # Création de la table des fonctions de contact

  1. Nouvelle Table
    - `contact_functions`
      - `id` (uuid, clé primaire)
      - `name` (text, unique)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS désactivé pour le développement initial
*/

CREATE TABLE contact_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_functions DISABLE ROW LEVEL SECURITY;

-- Insertion de quelques fonctions par défaut
INSERT INTO contact_functions (name) VALUES
  ('Tour Manager'),
  ('PR Manager'),
  ('Agent'),
  ('Event Coordinator'),
  ('Technical Director'),
  ('Production Manager');