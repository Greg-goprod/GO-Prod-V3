/*
  # Disable RLS during development
  
  This migration temporarily disables RLS on the drivers and driver_languages tables
  during the development phase.
*/

ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE driver_languages DISABLE ROW LEVEL SECURITY;