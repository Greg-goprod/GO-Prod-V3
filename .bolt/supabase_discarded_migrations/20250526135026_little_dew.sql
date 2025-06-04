/*
  # Create driver photos storage bucket and policies
  
  1. Storage
    - Creates a new bucket for driver photos
    - Sets public access to false
    - Configures file size limits and allowed mime types
  
  2. Security
    - Adds policies for authenticated users to:
      - Upload photos
      - View photos
      - Update photos
      - Delete photos
*/

-- Create an extension to generate file names
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  -- Create the storage bucket
  PERFORM storage.create_bucket(
    'driver-photos',
    JSONB_BUILD_OBJECT(
      'public', false,
      'allowed_mime_types', ARRAY['image/jpeg', 'image/png', 'image/webp'],
      'file_size_limit', 5242880 -- 5MB
    )
  );

  -- Create policies for the bucket
  PERFORM storage.create_policy(
    'driver-photos',
    'authenticated can upload',
    'INSERT',
    'authenticated',
    true
  );

  PERFORM storage.create_policy(
    'driver-photos',
    'authenticated can view',
    'SELECT',
    'authenticated',
    true
  );

  PERFORM storage.create_policy(
    'driver-photos',
    'authenticated can update',
    'UPDATE',
    'authenticated',
    true
  );

  PERFORM storage.create_policy(
    'driver-photos',
    'authenticated can delete',
    'DELETE',
    'authenticated',
    true
  );
END $$;