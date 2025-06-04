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
      - `deleted_at` (timestamptz)

    - `event_days`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `date` (date, required)
      - `open_time` (time)
      - `close_time` (time)
      - `closing_day` (date)
      - `created_at` (timestamptz)

    - `stages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text)
      - `location` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

    - `event_stages`
      - Composite primary key (event_id, stage_id)
      - `event_id` (uuid, foreign key to events)
      - `stage_id` (uuid, foreign key to stages)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read active records
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
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to events"
    ON public.events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read active events"
    ON public.events
    FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Create event_days table
CREATE TABLE IF NOT EXISTS public.event_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    open_time TIME,
    close_time TIME,
    closing_day DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to event_days"
    ON public.event_days
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read event_days"
    ON public.event_days
    FOR SELECT
    TO authenticated
    USING (true);

-- Create stages table
CREATE TABLE IF NOT EXISTS public.stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to stages"
    ON public.stages
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read active stages"
    ON public.stages
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Create event_stages table
CREATE TABLE IF NOT EXISTS public.event_stages (
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (event_id, stage_id)
);

ALTER TABLE public.event_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to event_stages"
    ON public.event_stages
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read event_stages"
    ON public.event_stages
    FOR SELECT
    TO authenticated
    USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON public.events(deleted_at);
CREATE INDEX IF NOT EXISTS idx_event_days_event_id ON public.event_days(event_id);
CREATE INDEX IF NOT EXISTS idx_event_stages_event_id ON public.event_stages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_stages_stage_id ON public.event_stages(stage_id);

-- Create trigger to automatically update updated_at timestamp
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