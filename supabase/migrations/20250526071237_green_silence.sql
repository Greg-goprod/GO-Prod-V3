/*
  # Suppression de la colonne photoUrl de la table artists

  1. Changements
    - Supprime la colonne photoUrl de la table artists car nous utilisons maintenant uniquement la photo Spotify
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artists' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE artists DROP COLUMN photo_url;
  END IF;
END $$;