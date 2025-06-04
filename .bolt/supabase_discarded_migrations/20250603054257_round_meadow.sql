/*
  # Create Events Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `location` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `event_days`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `date` (date)
      - `open_time` (time)
      - `close_time` (time)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their data
*/

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    start_date date,
    end_date date,
    location text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create event_days table
CREATE TABLE IF NOT EXISTS public.event_days (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    date date NOT NULL,
    open_time time without time zone,
    close_time time without time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_days ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Allow authenticated users to read events"
    ON public.events
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert events"
    ON public.events
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
    ON public.events
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policies for event_days
CREATE POLICY "Allow authenticated users to read event_days"
    ON public.event_days
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert event_days"
    ON public.event_days
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update event_days"
    ON public.event_days
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_name ON public.events(name);
CREATE INDEX IF NOT EXISTS idx_event_days_event_id ON public.event_days(event_id);
CREATE INDEX IF NOT EXISTS idx_event_days_date ON public.event_days(date);