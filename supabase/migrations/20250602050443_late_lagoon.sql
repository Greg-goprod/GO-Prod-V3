-- Check and create enums if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fee_type') THEN
        CREATE TYPE fee_type AS ENUM ('net', 'brut');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'responsibility') THEN
        CREATE TYPE responsibility AS ENUM ('artist', 'festival', 'non_applicable');
    END IF;
END $$;

-- Create stages table if it doesn't exist
CREATE TABLE IF NOT EXISTS stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create currencies table if it doesn't exist
CREATE TABLE IF NOT EXISTS currencies (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

-- Create show_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS show_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create charge_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS charge_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create show_durations table if it doesn't exist
CREATE TABLE IF NOT EXISTS show_durations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create exclusivity_clauses table if it doesn't exist
CREATE TABLE IF NOT EXISTS exclusivity_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL
);

-- Add new columns to offers table if they don't exist
DO $$ 
BEGIN
    -- Add columns one by one with existence check
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'artist_id') THEN
        ALTER TABLE offers ADD COLUMN artist_id UUID REFERENCES artists(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'event_date') THEN
        ALTER TABLE offers ADD COLUMN event_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'stage_id') THEN
        ALTER TABLE offers ADD COLUMN stage_id UUID REFERENCES stages(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'deadline') THEN
        ALTER TABLE offers ADD COLUMN deadline DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'show_type_id') THEN
        ALTER TABLE offers ADD COLUMN show_type_id UUID REFERENCES show_types(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'show_duration_id') THEN
        ALTER TABLE offers ADD COLUMN show_duration_id UUID REFERENCES show_durations(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'fee_amount') THEN
        ALTER TABLE offers ADD COLUMN fee_amount NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'fee_text') THEN
        ALTER TABLE offers ADD COLUMN fee_text TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'currency_code') THEN
        ALTER TABLE offers ADD COLUMN currency_code TEXT REFERENCES currencies(code);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'fee_type') THEN
        ALTER TABLE offers ADD COLUMN fee_type fee_type;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'charge_type_id') THEN
        ALTER TABLE offers ADD COLUMN charge_type_id UUID REFERENCES charge_types(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'exclusivity_clause_id') THEN
        ALTER TABLE offers ADD COLUMN exclusivity_clause_id UUID REFERENCES exclusivity_clauses(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'hotel_responsibility') THEN
        ALTER TABLE offers ADD COLUMN hotel_responsibility responsibility DEFAULT 'non_applicable';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'hotel_nights') THEN
        ALTER TABLE offers ADD COLUMN hotel_nights INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'backline_responsibility') THEN
        ALTER TABLE offers ADD COLUMN backline_responsibility responsibility DEFAULT 'non_applicable';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'intl_transport_responsibility') THEN
        ALTER TABLE offers ADD COLUMN intl_transport_responsibility responsibility DEFAULT 'non_applicable';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'pressing_responsibility') THEN
        ALTER TABLE offers ADD COLUMN pressing_responsibility responsibility DEFAULT 'non_applicable';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'bus_assortment_responsibility') THEN
        ALTER TABLE offers ADD COLUMN bus_assortment_responsibility responsibility DEFAULT 'non_applicable';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'local_transport_responsibility') THEN
        ALTER TABLE offers ADD COLUMN local_transport_responsibility responsibility DEFAULT 'non_applicable';
    END IF;
END $$;

-- Insert initial data if tables are empty
INSERT INTO stages (name)
SELECT name FROM (
    VALUES 
        ('MAINSTAGE'),
        ('RIVERSTAGE'),
        ('LA GRANGE')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM stages);

INSERT INTO currencies (code, label)
SELECT code, label FROM (
    VALUES 
        ('EUR', '€ (EUR)'),
        ('CHF', 'CHF'),
        ('USD', '$ (USD)')
) AS v(code, label)
WHERE NOT EXISTS (SELECT 1 FROM currencies);

INSERT INTO show_types (label)
SELECT label FROM (
    VALUES 
        ('Concert'),
        ('DJ Set'),
        ('Live Performance'),
        ('Showcase')
) AS v(label)
WHERE NOT EXISTS (SELECT 1 FROM show_types);

INSERT INTO charge_types (label)
SELECT label FROM (
    VALUES 
        ('Standard'),
        ('Premium'),
        ('VIP')
) AS v(label)
WHERE NOT EXISTS (SELECT 1 FROM charge_types);

INSERT INTO show_durations (label)
SELECT label FROM (
    VALUES 
        ('30 minutes'),
        ('45 minutes'),
        ('60 minutes'),
        ('90 minutes'),
        ('120 minutes')
) AS v(label)
WHERE NOT EXISTS (SELECT 1 FROM show_durations);

INSERT INTO exclusivity_clauses (text)
SELECT text FROM (
    VALUES 
        ('No performances within 100km radius for 30 days before and after'),
        ('Exclusive festival appearance in the region'),
        ('No other performances in the country during festival week')
) AS v(text)
WHERE NOT EXISTS (SELECT 1 FROM exclusivity_clauses);