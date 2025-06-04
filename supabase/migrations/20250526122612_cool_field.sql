/*
  # Add function to get enum values

  1. New Functions
    - `get_enum_values(enum_name text)`
      - Takes an enum name as input
      - Returns an array of all possible values for that enum
  
  2. Security
    - Function is accessible to authenticated users
*/

CREATE OR REPLACE FUNCTION public.get_enum_values(enum_name text)
RETURNS text[] AS $$
BEGIN
  RETURN (
    SELECT array_agg(enumlabel::text)
    FROM pg_enum
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
    WHERE typname = enum_name
    ORDER BY enumsortorder
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_enum_values(text) TO authenticated;