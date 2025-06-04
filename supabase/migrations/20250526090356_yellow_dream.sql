/*
  # Add SCENE field to artists table
  
  1. Changes
    - Add SCENE column with enum type
    - Add constraint to limit values to MAINSTAGE, RIVERSTAGE, LA GRANGE
*/

-- Create enum type for scene
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scene_type') THEN
    CREATE TYPE scene_type AS ENUM ('MAINSTAGE', 'RIVERSTAGE', 'LA GRANGE');
  END IF;
END $$;

-- Add scene column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artists' AND column_name = 'scene'
  ) THEN
    ALTER TABLE artists ADD COLUMN scene scene_type;
  END IF;
END $$;