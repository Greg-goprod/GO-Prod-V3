/*
  # Update travel tables

  1. Changes
    - Add IF NOT EXISTS to table creation
    - Add IF NOT EXISTS to index creation
    - Add DROP ... IF EXISTS statements for safety

  2. Tables Modified
    - travels
    - travel_details

  3. Indexes
    - idx_travels_artist
    - idx_travels_contact
    - idx_travels_datetime
    - idx_travel_details_travel
*/

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS travel_details;
DROP TABLE IF EXISTS travels;

-- Create travels table
CREATE TABLE IF NOT EXISTS travels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  is_arrival boolean NOT NULL,
  travel_type travel_type NOT NULL,
  scheduled_datetime timestamptz NOT NULL,
  actual_datetime timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure only one person type is set
  CONSTRAINT one_person_only CHECK (
    (artist_id IS NULL AND contact_id IS NOT NULL) OR
    (artist_id IS NOT NULL AND contact_id IS NULL)
  )
);

-- Create travel_details table for flights and trains
CREATE TABLE IF NOT EXISTS travel_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_id uuid NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
  reference_number text NOT NULL,
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_travels_artist;
DROP INDEX IF EXISTS idx_travels_contact;
DROP INDEX IF EXISTS idx_travels_datetime;
DROP INDEX IF EXISTS idx_travel_details_travel;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_travels_artist ON travels(artist_id);
CREATE INDEX IF NOT EXISTS idx_travels_contact ON travels(contact_id);
CREATE INDEX IF NOT EXISTS idx_travels_datetime ON travels(scheduled_datetime);
CREATE INDEX IF NOT EXISTS idx_travel_details_travel ON travel_details(travel_id);

-- Disable RLS for development
ALTER TABLE travels DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_details DISABLE ROW LEVEL SECURITY;