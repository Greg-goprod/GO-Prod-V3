/*
  # Fix permissions for enum modification

  1. Changes
    - Create new RPC function with SECURITY DEFINER to safely modify enum types
    - Grant execute permission to authenticated users
    - Drop old function if it exists

  2. Security
    - Function runs with elevated privileges via SECURITY DEFINER
    - Only authenticated users can execute the function
    - Input validation prevents SQL injection
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.add_enum_value;

-- Create new function with proper security context
CREATE OR REPLACE FUNCTION public.add_enum_value(enum_name text, new_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the owner
SET search_path = public
AS $$
DECLARE
    enum_values text[];
    alter_type_sql text;
BEGIN
    -- Validate input to prevent SQL injection
    IF enum_name !~ '^[a-zA-Z_][a-zA-Z0-9_]*$' THEN
        RAISE EXCEPTION 'Invalid enum name format';
    END IF;
    
    IF new_value !~ '^[A-Z_][A-Z0-9_]*$' THEN
        RAISE EXCEPTION 'Invalid enum value format. Must be uppercase with underscores.';
    END IF;

    -- Get existing enum values
    EXECUTE format(
        'SELECT array(SELECT unnest(enum_range(NULL::%I))::text)',
        enum_name
    ) INTO enum_values;

    -- Check if value already exists
    IF new_value = ANY(enum_values) THEN
        RAISE EXCEPTION 'Value already exists in enum';
    END IF;

    -- Build and execute ALTER TYPE statement
    alter_type_sql := format(
        'ALTER TYPE %I ADD VALUE IF NOT EXISTS %L',
        enum_name,
        new_value
    );
    
    EXECUTE alter_type_sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_enum_value(text, text) TO authenticated;