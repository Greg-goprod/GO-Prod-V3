/*
  # Create shifts table

  1. New Tables
    - `shifts`
      - `id` (uuid, primary key)
      - `start_datetime` (timestamptz, required)
      - `end_datetime` (timestamptz, required)
      - `driver_id` (uuid, optional, references drivers)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - RLS disabled for development
*/

CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  driver_id uuid REFERENCES drivers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disable RLS for development
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;