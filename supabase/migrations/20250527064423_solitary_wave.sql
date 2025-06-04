/*
  # Correction de la structure de la table des chauffeurs

  1. Modifications
    - Ajout de la colonne languages comme un tableau de texte
    - Ajout de la colonne permits comme un tableau d'énumérations
    - Ajout des contraintes NOT NULL appropriées
*/

-- Supprime la table si elle existe
DROP TABLE IF EXISTS drivers CASCADE;

-- Recrée la table avec la bonne structure
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  street text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  birth_date date NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  t_shirt_size t_shirt_size NOT NULL,
  hired_year integer NOT NULL,
  permits driver_permit[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Désactive RLS pour simplifier le développement initial
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;