-- Update currencies data
TRUNCATE TABLE currencies CASCADE;
INSERT INTO currencies (code, label) VALUES
  ('CHF', 'CHF'),
  ('EUR', '€ (EUR)'),
  ('GBP', '£ (GBP)'),
  ('USD', '$ (USD)');

-- Update show_types data
TRUNCATE TABLE show_types CASCADE;
INSERT INTO show_types (label) VALUES
  ('DJ SET'),
  ('LIVE SHOW');

-- Update show_durations data
TRUNCATE TABLE show_durations CASCADE;
INSERT INTO show_durations (label) VALUES
  ('15 minutes'),
  ('2 titres'),
  ('3 titres'),
  ('30 minutes'),
  ('45 minutes'),
  ('5 titres'),
  ('60 minutes'),
  ('75 minutes'),
  ('90 minutes'),
  ('TBC');

-- Update charge_types data
TRUNCATE TABLE charge_types CASCADE;
INSERT INTO charge_types (label) VALUES
  ('/ BRUT'),
  ('/ NET');

-- Update exclusivity_clauses data
TRUNCATE TABLE exclusivity_clauses CASCADE;
INSERT INTO exclusivity_clauses (text) VALUES
  ('--');

-- Note: fee_type and responsibility enums are already created and their values
-- are fixed as part of the enum type definition, so they cannot be modified here