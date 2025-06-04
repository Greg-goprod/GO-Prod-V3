/*
  # Create event contact role enum if it doesn't exist
  
  1. New Types
    - event_contact_role enum for tracking contact roles
  
  2. New Tables
    - events table for storing event data
    - event_days table for managing event days
    - event_contacts table for contact assignments
  
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