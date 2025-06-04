/*
  # Fix get_enum_values function

  1. Changes
    - Update get_enum_values function to properly handle enumsortorder
    - Add ORDER BY clause to ensure consistent enum value ordering
    - Return both value and label for better usability

  2. Technical Details
    - Fix GROUP BY clause issue with pg_enum.enumsortorder
    - Ensure proper type casting and null handling
    - Maintain backward compatibility with existing function calls
*/

CREATE OR REPLACE FUNCTION get_enum_values(enum_name text)
RETURNS TABLE (
  value text,
  label text
) AS $$
  SELECT 
    e.enumlabel::text as value,
    e.enumlabel::text as label
  FROM pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  WHERE t.typname = enum_name
  ORDER BY e.enumsortorder;
$$ LANGUAGE sql;