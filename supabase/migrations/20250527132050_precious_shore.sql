/*
  # Disable RLS policies for development

  This migration disables Row Level Security (RLS) on all tables during development.
  This is a temporary measure to simplify development and testing.
  
  Tables affected:
  - artists
  - contacts
  - contact_functions
  - drivers
  - driver_languages
  - languages
  - shifts
*/

-- Disable RLS on all tables
ALTER TABLE artists DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_functions DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE driver_languages DISABLE ROW LEVEL SECURITY;
ALTER TABLE languages DISABLE ROW LEVEL SECURITY;
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;