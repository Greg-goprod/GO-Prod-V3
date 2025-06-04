/*
  # Travel Management Schema

  1. New Tables
    - `travels`: Stores travel records for artists and contacts
      - `id` (uuid, primary key)
      - `artist_id` (uuid, foreign key to artists)
      - `contact_id` (uuid, foreign key to contacts)
      - `is_arrival` (boolean)
      - `travel_type` (enum)
      - `scheduled_datetime` (timestamptz)
      - `actual_datetime` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `travel_details`: Additional details for flights and trains
      - `id` (uuid, primary key)
      - `travel_id` (uuid, foreign key to travels)
      - `reference_number` (text)
      - `departure_location` (text)
      - `arrival_location` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Constraints
    - Only one person (artist or contact) per travel record
    - Foreign key relationships with cascading deletes
    - Required fields validation

  3. Indexes
    - Optimized queries for person lookup
    - Datetime-based queries
    - Travel details lookup
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
CREATE TABLE travel_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_id uuid NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
  reference_number text NOT NULL,
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_travels_artist ON travels(artist_id);
CREATE INDEX idx_travels_contact ON travels(contact_id);
CREATE INDEX idx_travels_datetime ON travels(scheduled_datetime);
CREATE INDEX idx_travel_details_travel ON travel_details(travel_id);

-- Disable RLS for development
ALTER TABLE travels DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_details DISABLE ROW LEVEL SECURITY;