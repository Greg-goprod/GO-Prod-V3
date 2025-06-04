/*
  # Add name field to shifts table

  1. Changes
    - Add name column to shifts table
*/

ALTER TABLE shifts ADD COLUMN IF NOT EXISTS name text;