/*
  # Add reception and return columns to vehicles table

  1. Changes
    - Add `reception` column to vehicles table (JSONB, nullable)
    - Add `return` column to vehicles table (JSONB, nullable)

  2. Purpose
    - Store reception and return inspection data for vehicles
    - Allow tracking of vehicle condition at check-in and check-out
*/

ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS reception JSONB,
ADD COLUMN IF NOT EXISTS "return" JSONB;