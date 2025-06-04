/*
  # Travel System Tables

  1. New Tables (if not exist)
    - `travels` - Stores travel records for artists and contacts
    - `travel_details` - Stores additional details for flights and trains

  2. Changes
    - Creates tables only if they don't exist
    - Adds necessary indexes
    - Disables RLS for development

  3. Security
    - RLS disabled for development
*/

-- Create travels table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'travels') THEN
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

    -- Create indexes for travels table
    CREATE INDEX idx_travels_artist ON travels(artist_id);
    CREATE INDEX idx_travels_contact ON travels(contact_id);
    CREATE INDEX idx_travels_datetime ON travels(scheduled_datetime);

    -- Disable RLS for development
    ALTER TABLE travels DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create travel_details table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'travel_details') THEN
    CREATE TABLE travel_details (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      travel_id uuid NOT NULL REFERENCES travels(id) ON DELETE CASCADE,
      reference_number text NOT NULL,
      departure_location text NOT NULL,
      arrival_location text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create index for travel_details table
    CREATE INDEX idx_travel_details_travel ON travel_details(travel_id);

    -- Disable RLS for development
    ALTER TABLE travel_details DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;