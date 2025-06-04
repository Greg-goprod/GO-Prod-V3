-- Create additional_equipment enum type
CREATE TYPE additional_equipment AS ENUM (
  'AIR_CONDITIONING',
  'BLUETOOTH',
  'GPS',
  'LEATHER_SEATS',
  'PARKING_SENSORS',
  'REAR_VIEW_CAMERA',
  'ROOF_RACK',
  'SOUND_SYSTEM',
  'TINTED_WINDOWS',
  'TOW_BAR',
  'USB_PORTS',
  'WIFI'
);

-- Add additional_equipment column to vehicles table
ALTER TABLE vehicles 
DROP COLUMN IF EXISTS additional_equipment,
ADD COLUMN additional_equipment additional_equipment[];