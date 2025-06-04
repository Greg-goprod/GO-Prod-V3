-- Drop the existing function first
DROP FUNCTION IF EXISTS get_enum_values(text);

-- Create the new function with updated return type
CREATE FUNCTION get_enum_values(enum_name text)
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