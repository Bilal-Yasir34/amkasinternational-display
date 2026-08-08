-- Add certifications columns to homepage singleton table
ALTER TABLE homepage 
ADD COLUMN IF NOT EXISTS certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_certifications boolean NOT NULL DEFAULT true;
