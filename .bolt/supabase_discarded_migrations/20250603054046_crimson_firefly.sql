/*
  # Create events table and related tables
  
  1. New Tables
    - events: Main events table
    - event_days: Days for each event
    - event_stages: Junction table for event-stage relationships
  
  2. Security
    - RLS disabled for development
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_days table
CREATE TABLE IF NOT EXISTS event_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  date date NOT NULL,
  open_time time,
  close_time time,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, date)
);

-- Create event_stages table
CREATE TABLE IF NOT EXISTS event_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, stage_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_days_event_id ON event_days(event_id);
CREATE INDEX IF NOT EXISTS idx_event_stages_event_id ON event_stages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_stages_stage_id ON event_stages(stage_id);

-- Disable RLS for development
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_days DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_stages DISABLE ROW LEVEL SECURITY;