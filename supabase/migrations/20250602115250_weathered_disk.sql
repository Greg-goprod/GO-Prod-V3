/*
  # Update offers table structure
  
  1. Changes
    - Remove redundant columns (scene_type, event_date)
    - Add unique constraint for artist/date/stage combination
    - Update indexes for better performance
*/

-- Remove redundant columns
ALTER TABLE offers 
DROP COLUMN IF EXISTS scene_type,
DROP COLUMN IF EXISTS event_date;

-- Add unique constraint for artist/date/stage combination
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'offers_artist_date_stage_unique'
  ) THEN
    ALTER TABLE offers 
    ADD CONSTRAINT offers_artist_date_stage_unique 
    UNIQUE (artist_id, performance_date, stage_id);
  END IF;
END $$;

-- Create or update indexes for better performance
DROP INDEX IF EXISTS idx_offers_performance_date;
DROP INDEX IF EXISTS idx_offers_artist_performance;
DROP INDEX IF EXISTS idx_offers_stage;

CREATE INDEX idx_offers_performance_date ON offers(performance_date);
CREATE INDEX idx_offers_artist_stage ON offers(artist_id, stage_id);