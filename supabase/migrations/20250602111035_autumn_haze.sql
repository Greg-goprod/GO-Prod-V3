-- Drop old columns if they exist
ALTER TABLE artists DROP COLUMN IF EXISTS performance_date;
ALTER TABLE artists DROP COLUMN IF EXISTS scene;
ALTER TABLE artists DROP COLUMN IF EXISTS scene_type;

-- Update artists table structure
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  spotify_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add new columns to offers table
ALTER TABLE offers
ADD COLUMN IF NOT EXISTS artist_id UUID REFERENCES artists(id),
ADD COLUMN IF NOT EXISTS performance_date DATE,
ADD COLUMN IF NOT EXISTS scene_type TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_offers_artist ON offers(artist_id);
CREATE INDEX IF NOT EXISTS idx_offers_deadline ON offers(deadline);