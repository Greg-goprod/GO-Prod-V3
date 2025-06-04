/*
  # Ajout de la date de performance pour les artistes

  1. Modifications
    - Ajout de la colonne `performance_date` à la table `artists`
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artists' AND column_name = 'performance_date'
  ) THEN
    ALTER TABLE artists ADD COLUMN performance_date timestamptz;
  END IF;
END $$;