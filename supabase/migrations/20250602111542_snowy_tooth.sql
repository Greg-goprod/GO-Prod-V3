-- Remove redundant columns from artists table if they exist
ALTER TABLE artists 
DROP COLUMN IF EXISTS performance_date,
DROP COLUMN IF EXISTS scene,
DROP COLUMN IF EXISTS scene_type;

-- Ensure offers table has the correct columns
ALTER TABLE offers
ADD COLUMN IF NOT EXISTS performance_date DATE,
ADD COLUMN IF NOT EXISTS scene_type TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offers_performance_date ON offers(performance_date);
CREATE INDEX IF NOT EXISTS idx_offers_scene_type ON offers(scene_type);

-- Clean up any null values in required fields
UPDATE offers 
SET scene_type = 'MAINSTAGE' 
WHERE scene_type IS NULL;