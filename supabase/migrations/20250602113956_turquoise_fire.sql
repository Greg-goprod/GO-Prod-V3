-- Remove redundant columns if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'scene_type') THEN
        ALTER TABLE offers DROP COLUMN scene_type;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'event_date') THEN
        ALTER TABLE offers DROP COLUMN event_date;
    END IF;
END $$;

-- Add stage_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'stage_id') THEN
        ALTER TABLE offers ADD COLUMN stage_id UUID REFERENCES stages(id);
    END IF;
END $$;

-- Add unique constraint on artist_id and performance_date if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'offers_artist_performance_unique'
    ) THEN
        ALTER TABLE offers ADD CONSTRAINT offers_artist_performance_unique UNIQUE (artist_id, performance_date);
    END IF;
END $$;

-- Create indexes for better performance if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_offers_stage') THEN
        CREATE INDEX idx_offers_stage ON offers(stage_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_offers_performance_date') THEN
        CREATE INDEX idx_offers_performance_date ON offers(performance_date);
    END IF;
END $$;