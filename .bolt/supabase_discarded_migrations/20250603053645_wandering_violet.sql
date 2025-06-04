/*
  # Event Management Tables

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `artist_relations_contact_id` (uuid, foreign key to contacts)
      - `technical_director_contact_id` (uuid, foreign key to contacts)
      - `press_media_contact_id` (uuid, foreign key to contacts)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_active` (boolean)
    
    - `event_days`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `date` (date, required)
      - `open_time` (time, required)
      - `close_time` (time, required)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `stages`
      - `id` (uuid, primary key)
      - `name` (text, required, unique)
      - `type` (text)
      - `location` (text)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `event_stages`
      - Composite primary key (event_id, stage_id)
      - `event_id` (uuid, foreign key to events)
      - `stage_id` (uuid, foreign key to stages)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `contact_functions`
      - `id` (uuid, primary key)
      - `name` (text, required, unique)
      - `created_at` (timestamp)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for service role to manage all data
*/

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  artist_relations_contact_id uuid REFERENCES public.contacts(id),
  technical_director_contact_id uuid REFERENCES public.contacts(id),
  press_media_contact_id uuid REFERENCES public.contacts(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read events"
  ON public.events
  FOR SELECT
  TO authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Allow service role to manage events"
  ON public.events
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create event_days table
CREATE TABLE IF NOT EXISTS public.event_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  date date NOT NULL,
  open_time time NOT NULL,
  close_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.event_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read event days"
  ON public.event_days
  FOR SELECT
  TO authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Allow service role to manage event days"
  ON public.event_days
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create stages table
CREATE TABLE IF NOT EXISTS public.stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text,
  location text,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read stages"
  ON public.stages
  FOR SELECT
  TO authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Allow service role to manage stages"
  ON public.stages
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create event_stages table
CREATE TABLE IF NOT EXISTS public.event_stages (
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, stage_id),
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.event_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read event stages"
  ON public.event_stages
  FOR SELECT
  TO authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Allow service role to manage event stages"
  ON public.event_stages
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create contact_functions table
CREATE TABLE IF NOT EXISTS public.contact_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.contact_functions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read contact functions"
  ON public.contact_functions
  FOR SELECT
  TO authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Allow service role to manage contact functions"
  ON public.contact_functions
  TO service_role
  USING (true)
  WITH CHECK (true);