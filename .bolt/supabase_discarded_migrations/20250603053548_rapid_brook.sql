/*
  # Create event contact role enum if it doesn't exist
  
  1. New Types
    - event_contact_role enum for tracking contact roles
  
  2. New Tables
    - events: Main events table
    - event_days: Tracks days and times for each event
    - event_contacts: Manages contact assignments
  
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create event contact role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_contact_role') THEN
        CREATE TYPE event_contact_role AS ENUM ('artist_relations', 'technical_director', 'press_media');
    END IF;
END $$;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event_days table
CREATE TABLE IF NOT EXISTS event_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  day_index INTEGER,
  date DATE NOT NULL,
  open_time TIME,
  close_time TIME,
  UNIQUE(event_id, date)
);

-- Create event_contacts table
CREATE TABLE IF NOT EXISTS event_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  role event_contact_role NOT NULL,
  UNIQUE(event_id, role)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Authenticated users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for event_days
CREATE POLICY "Authenticated users can view event days"
  ON event_days FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage event days"
  ON event_days FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for event_contacts
CREATE POLICY "Authenticated users can view event contacts"
  ON event_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage event contacts"
  ON event_contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_event_days_event_id ON event_days(event_id);
CREATE INDEX idx_event_days_date ON event_days(date);
CREATE INDEX idx_event_contacts_event_id ON event_contacts(event_id);
CREATE INDEX idx_event_contacts_contact_id ON event_contacts(contact_id);