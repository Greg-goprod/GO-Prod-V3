/*
  # Add scene_type column to offers table

  1. Changes
    - Add `scene_type` column to `offers` table with type `scene_type` enum
    - Make it nullable since it may not be required for all offers
    - Add index for performance

  2. Notes
    - Using the existing `scene_type` enum type
    - Added index to improve query performance when filtering by scene type
*/

-- Add scene_type column to offers table
ALTER TABLE offers 
ADD COLUMN scene_type scene_type NULL;

-- Add index for scene_type column
CREATE INDEX idx_offers_scene_type ON offers (scene_type);