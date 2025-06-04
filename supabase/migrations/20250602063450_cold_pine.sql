/*
  # Add contact columns to events table

  1. Changes
    - Add contact columns to events table:
      - artist_relations_contact_id (uuid, foreign key to contacts)
      - technical_director_contact_id (uuid, foreign key to contacts)
      - press_media_contact_id (uuid, foreign key to contacts)
    
  2. Foreign Keys
    - All contact columns reference the contacts table
    - ON DELETE SET NULL to avoid orphaned events if contacts are deleted
*/

-- Add contact columns
ALTER TABLE events
ADD COLUMN artist_relations_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
ADD COLUMN technical_director_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
ADD COLUMN press_media_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX idx_events_artist_relations_contact ON events(artist_relations_contact_id);
CREATE INDEX idx_events_technical_director_contact ON events(technical_director_contact_id);
CREATE INDEX idx_events_press_media_contact ON events(press_media_contact_id);