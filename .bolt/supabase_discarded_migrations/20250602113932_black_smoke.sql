-- Remove redundant columns
ALTER TABLE offers
DROP COLUMN IF EXISTS scene_type,
DROP COLUMN IF EXISTS event_date;

-- Add stage_id column if it doesn't exist
ALTER TABLE offers
ADD COLUMN IF NOT EXISTS stage_id UUID REFERENCES stages(id);

-- Add unique constraint on artist_id and performance_date
ALTER TABLE offers
ADD CONSTRAINT offers_artist_performance_unique UNIQUE (artist_id, performance_date);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_offers_stage ON offers(stage_id);
CREATE INDEX IF NOT EXISTS idx_offers_performance_date ON offers(performance_date);

-- Clean up any existing data
UPDATE offers
SET stage_id = (
  SELECT id FROM stages WHERE name = scene_type
)
WHERE scene_type IS NOT NULL AND stage_id IS NULL;