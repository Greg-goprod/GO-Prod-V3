/*
  # Create schedules table

  1. New Tables
    - `schedules`
      - `id` (uuid, primary key)
      - `day` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `schedules` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert schedules"
  ON schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schedules"
  ON schedules
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete schedules"
  ON schedules
  FOR DELETE
  TO authenticated
  USING (true);