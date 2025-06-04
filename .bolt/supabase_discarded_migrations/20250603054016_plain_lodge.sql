/*
  # Create contacts table
  
  1. New Tables
    - contacts table for storing contact information
  
  2. Security
    - Disable RLS for development
*/

-- Create contacts table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text NOT NULL,
    function_id uuid NOT NULL REFERENCES contact_functions(id),
    artist_id uuid REFERENCES artists(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Disable RLS for development
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;