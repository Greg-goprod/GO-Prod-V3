/*
  # Add Foreign Key Relationship for Hired Year

  1. Changes
    - Add foreign key constraint from drivers.hired_year to hired_year.year
    - Ensure hired_year column type matches between tables
*/

-- Modify the hired_year column in drivers table to reference hired_year table
ALTER TABLE drivers
ALTER COLUMN hired_year TYPE integer USING hired_year::integer;

-- Add foreign key constraint
ALTER TABLE drivers
ADD CONSTRAINT drivers_hired_year_fkey
FOREIGN KEY (hired_year)
REFERENCES hired_year (year)
ON DELETE RESTRICT;