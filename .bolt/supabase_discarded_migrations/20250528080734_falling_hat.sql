/*
  # Travel Management Schema

  1. New Tables
    - `travel_types` - Types of transportation
    - `travels` - Travel records for artists and contacts
    - `travel_details` - Additional details for flights and trains

  2. Security
    - RLS disabled for development
*/

-- Create enum for travel types
CREATE TYPE travel_type AS ENUM (
  'PLANE',
  'TRAIN',
  'CAR',
  'VAN',
  'VAN_TRAILER',
  'TOURBUS',
  'TOURBUS_TRAILER',
  'TRUCK',
  'TRUCK_TRAILER'
);

-- Create travels table
CREATE TABLE travels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_type text NOT NULL CHECK (person_type IN ('ARTIST', 'CONTACT')),
  person_id uuid NOT NULL,
  is_arrival boolean NOT NULL,
  travel_type travel_type NOT NULL,
  scheduled_datetime timestamptz NOT NULL,
  actual_datetime timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add foreign key constraints with dynamic reference based on person_type
  CONSTRAINT person_reference CHECK (
    (person_type = 'ARTIST' AND EXISTS (
      SELECT 1 FROM artists WHERE id = person_id
    )) OR
    (person_type = 'CONTACT' AND EXISTS (
      SELECT 1 FROM contacts WHERE id = person_id
    ))
  )
);

-- Create travel_details table for flights and trains
CREATE TABLE travel_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_id uuid NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
  reference_number text NOT NULL, -- Flight number or train number
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_travels_person ON travels(person_type, person_id);
CREATE INDEX idx_travels_datetime ON travels(scheduled_datetime);
CREATE INDEX idx_travel_details_travel ON travel_details(travel_id);

-- Disable RLS for development
ALTER TABLE travels DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_details DISABLE ROW LEVEL SECURITY;