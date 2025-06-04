-- Create function to add new enum values
CREATE OR REPLACE FUNCTION add_enum_value(enum_name text, new_value text)
RETURNS void AS $$
BEGIN
    EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', enum_name, new_value);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_enum_value(text, text) TO authenticated;