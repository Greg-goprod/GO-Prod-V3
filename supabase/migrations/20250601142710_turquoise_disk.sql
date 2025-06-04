/*
  # Booking Offers Schema

  1. New Types
    - offer_status enum for tracking offer states
  
  2. New Tables
    - offer_templates for reusable offer templates
    - offers for storing offer data
    
  3. Security
    - RLS disabled for development
*/

-- Create offer status enum
CREATE TYPE offer_status AS ENUM (
  'a_faire',
  'envoyee', 
  'validee',
  'refusee'
);

-- Create offer templates table
CREATE TABLE offer_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create offers table
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_id uuid REFERENCES contacts(id),
  artist_id uuid REFERENCES artists(id),
  status offer_status NOT NULL DEFAULT 'a_faire',
  content text NOT NULL,
  amount decimal(10,2),
  deadline timestamptz,
  sent_at timestamptz,
  template_id uuid REFERENCES offer_templates(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure either client_id or artist_id is set, but not both
  CONSTRAINT one_recipient CHECK (
    (client_id IS NULL AND artist_id IS NOT NULL) OR
    (client_id IS NOT NULL AND artist_id IS NULL)
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_deadline ON offers(deadline);
CREATE INDEX idx_offers_client ON offers(client_id);
CREATE INDEX idx_offers_artist ON offers(artist_id);
CREATE INDEX idx_offers_template ON offers(template_id);

-- Disable RLS for development
ALTER TABLE offer_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;