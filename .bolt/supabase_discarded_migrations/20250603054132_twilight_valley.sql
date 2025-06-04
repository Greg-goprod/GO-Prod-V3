/*
  # Update contacts table
  
  1. Changes
    - Add IF NOT EXISTS check for table creation
    - Handle existing table gracefully
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE tablename = 'contacts'
  ) THEN
    CREATE TABLE contacts (
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
  END IF;
END $$;

-- Disable RLS for development
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;