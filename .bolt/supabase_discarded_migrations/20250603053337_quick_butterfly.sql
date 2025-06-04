/*
  # Create Events Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `artist_relations_contact_id` (uuid, foreign key to contacts)
      - `technical_director_contact_id` (uuid, foreign key to contacts)
      - `press_media_contact_id` (uuid, foreign key to contacts)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_active` (boolean)
    
    - `event_days`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `date` (date, required)
      - `open_time` (time, required)
      - `close_time` (time, required)
      - `created_at` (timestamptz)
      - `is_active` (boolean)
    
    - `stages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text)
      - `location` (text)
      - `created_at` (timestamptz)
      - `is_active` (boolean)
    
    - `event_stages`
      - Composite primary key (event_id, stage_id)
      - `event_id` (uuid, foreign key to events)
      - `stage_id` (uuid, foreign key to stages)
      - `created_at` (timestamptz)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all active records
    - Add policies for service role to manage all records
*/

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  artist_relations_contact_id UUID REFERENCES public.contacts(id),
  technical_director_contact_id UUID REFERENCES public.contacts(id),
  press_media_contact_id UUID REFERENCES public.contacts(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read active events"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Allow service role to manage events"
  ON public.events
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create event_days table
CREATE TABLE IF NOT EXISTS public.event_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.event_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read active event days"
  ON public.event_days
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Allow service role to manage event days"
  ON public.event_days
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create stages table
CREATE TABLE IF NOT EXISTS public.stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read active stages"
  ON public.stages
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Allow service role to manage stages"
  ON public.stages
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create event_stages junction table
CREATE TABLE IF NOT EXISTS public.event_stages (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  PRIMARY KEY (event_id, stage_id)
);

ALTER TABLE public.event_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read active event stages"
  ON public.event_stages
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Allow service role to manage event stages"
  ON public.event_stages
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();