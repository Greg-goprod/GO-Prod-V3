-- Add event_stages table for N:N relationship between events and stages
CREATE TABLE IF NOT EXISTS event_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, stage_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_event_stages_event_id ON event_stages(event_id);
CREATE INDEX idx_event_stages_stage_id ON event_stages(stage_id);

-- Add closing_day column to event_days to handle next-day closings
ALTER TABLE event_days
ADD COLUMN closing_day DATE;

-- Add check constraint to ensure closing_day is either NULL or >= date
ALTER TABLE event_days
ADD CONSTRAINT event_days_closing_day_check 
CHECK (closing_day IS NULL OR closing_day >= date);