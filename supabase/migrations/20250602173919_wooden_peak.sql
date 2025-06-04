/*
  # Add social media columns to artists table

  1. Changes
    - Add Instagram URL column
    - Add Facebook URL column
    - Add TikTok URL column
    - Add Twitter URL column
    - Add YouTube URL column

  2. Validation
    - All columns are optional (nullable)
    - All columns must be valid URLs if provided
*/

ALTER TABLE artists
ADD COLUMN instagram_url text CHECK (instagram_url IS NULL OR instagram_url ~ '^https?://'),
ADD COLUMN facebook_url text CHECK (facebook_url IS NULL OR facebook_url ~ '^https?://'),
ADD COLUMN tiktok_url text CHECK (tiktok_url IS NULL OR tiktok_url ~ '^https?://'),
ADD COLUMN twitter_url text CHECK (twitter_url IS NULL OR twitter_url ~ '^https?://'),
ADD COLUMN youtube_url text CHECK (youtube_url IS NULL OR youtube_url ~ '^https?://');

-- Add comments to explain the columns
COMMENT ON COLUMN artists.instagram_url IS 'Artist''s Instagram profile URL';
COMMENT ON COLUMN artists.facebook_url IS 'Artist''s Facebook page URL';
COMMENT ON COLUMN artists.tiktok_url IS 'Artist''s TikTok profile URL';
COMMENT ON COLUMN artists.twitter_url IS 'Artist''s Twitter/X profile URL';
COMMENT ON COLUMN artists.youtube_url IS 'Artist''s YouTube channel URL';