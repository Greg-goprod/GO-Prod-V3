-- Create storage bucket for Word templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('word-templates', 'word-templates', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for Word templates bucket
CREATE POLICY "Users can upload Word templates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'word-templates');

CREATE POLICY "Users can view their Word templates"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'word-templates');

-- Create word_templates table
CREATE TABLE word_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_word_templates_created_by ON word_templates(created_by);

-- Disable RLS for development
ALTER TABLE word_templates DISABLE ROW LEVEL SECURITY;