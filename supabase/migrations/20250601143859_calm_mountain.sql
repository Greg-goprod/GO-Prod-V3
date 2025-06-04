-- Create fee_type enum
CREATE TYPE fee_type AS ENUM ('net', 'brut');

-- Add new columns to offers table
ALTER TABLE offers ADD COLUMN artist_name text;
ALTER TABLE offers ADD COLUMN event_name text;
ALTER TABLE offers ADD COLUMN event_date date;
ALTER TABLE offers ADD COLUMN event_location text;
ALTER TABLE offers ADD COLUMN stage text;
ALTER TABLE offers ADD COLUMN performance_type text;
ALTER TABLE offers ADD COLUMN show_duration text;
ALTER TABLE offers ADD COLUMN slot_time text;
ALTER TABLE offers ADD COLUMN fee_amount numeric;
ALTER TABLE offers ADD COLUMN fee_currency text;
ALTER TABLE offers ADD COLUMN fee_type fee_type;
ALTER TABLE offers ADD COLUMN logistics jsonb;
ALTER TABLE offers ADD COLUMN legal_notice text;
ALTER TABLE offers ADD COLUMN notes_internal text;
ALTER TABLE offers ADD COLUMN validated_at timestamptz;
ALTER TABLE offers ADD COLUMN refused_at timestamptz;

-- Add same fields to offer_templates table (except status-related fields)
ALTER TABLE offer_templates ADD COLUMN artist_name text;
ALTER TABLE offer_templates ADD COLUMN event_name text;
ALTER TABLE offer_templates ADD COLUMN event_location text;
ALTER TABLE offer_templates ADD COLUMN stage text;
ALTER TABLE offer_templates ADD COLUMN performance_type text;
ALTER TABLE offer_templates ADD COLUMN show_duration text;
ALTER TABLE offer_templates ADD COLUMN slot_time text;
ALTER TABLE offer_templates ADD COLUMN fee_amount numeric;
ALTER TABLE offer_templates ADD COLUMN fee_currency text;
ALTER TABLE offer_templates ADD COLUMN fee_type fee_type;
ALTER TABLE offer_templates ADD COLUMN logistics jsonb;
ALTER TABLE offer_templates ADD COLUMN legal_notice text;
ALTER TABLE offer_templates ADD COLUMN notes_internal text;