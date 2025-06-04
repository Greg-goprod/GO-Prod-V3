-- Create enums
CREATE TYPE fee_type AS ENUM ('net', 'brut');
CREATE TYPE responsibility AS ENUM ('artist', 'festival', 'non_applicable');

-- Create currencies table
CREATE TABLE currencies (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

-- Create show_types table
CREATE TABLE show_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create charge_types table
CREATE TABLE charge_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create show_durations table
CREATE TABLE show_durations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL
);

-- Create exclusivity_clauses table
CREATE TABLE exclusivity_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL
);

-- Add new columns to offers table
ALTER TABLE offers ADD COLUMN artist_id UUID REFERENCES artists(id);
ALTER TABLE offers ADD COLUMN event_date DATE;
ALTER TABLE offers ADD COLUMN stage_id UUID REFERENCES stages(id);
ALTER TABLE offers ADD COLUMN deadline DATE;
ALTER TABLE offers ADD COLUMN show_type_id UUID REFERENCES show_types(id);
ALTER TABLE offers ADD COLUMN show_duration_id UUID REFERENCES show_durations(id);
ALTER TABLE offers ADD COLUMN fee_amount NUMERIC;
ALTER TABLE offers ADD COLUMN fee_text TEXT;
ALTER TABLE offers ADD COLUMN currency_code TEXT REFERENCES currencies(code);
ALTER TABLE offers ADD COLUMN fee_type fee_type;
ALTER TABLE offers ADD COLUMN charge_type_id UUID REFERENCES charge_types(id);
ALTER TABLE offers ADD COLUMN exclusivity_clause_id UUID REFERENCES exclusivity_clauses(id);
ALTER TABLE offers ADD COLUMN hotel_responsibility responsibility DEFAULT 'non_applicable';
ALTER TABLE offers ADD COLUMN hotel_nights INTEGER;
ALTER TABLE offers ADD COLUMN backline_responsibility responsibility DEFAULT 'non_applicable';
ALTER TABLE offers ADD COLUMN intl_transport_responsibility responsibility DEFAULT 'non_applicable';
ALTER TABLE offers ADD COLUMN pressing_responsibility responsibility DEFAULT 'non_applicable';
ALTER TABLE offers ADD COLUMN bus_assortment_responsibility responsibility DEFAULT 'non_applicable';
ALTER TABLE offers ADD COLUMN local_transport_responsibility responsibility DEFAULT 'non_applicable';

-- Insert some initial data
INSERT INTO currencies (code, label) VALUES
  ('EUR', '€ (EUR)'),
  ('CHF', 'CHF'),
  ('USD', '$ (USD)');

INSERT INTO show_types (label) VALUES
  ('Concert'),
  ('DJ Set'),
  ('Live Performance'),
  ('Showcase');

INSERT INTO charge_types (label) VALUES
  ('Standard'),
  ('Premium'),
  ('VIP');

INSERT INTO show_durations (label) VALUES
  ('30 minutes'),
  ('45 minutes'),
  ('60 minutes'),
  ('90 minutes'),
  ('120 minutes');

INSERT INTO exclusivity_clauses (text) VALUES
  ('No performances within 100km radius for 30 days before and after'),
  ('Exclusive festival appearance in the region'),
  ('No other performances in the country during festival week');