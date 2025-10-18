-- Add visibility column to circle_members table

-- Create enum type for visibility states
CREATE TYPE visibility_state AS ENUM ('auto', 'always_visible', 'always_hidden');

-- Add visibility column to circle_members table
ALTER TABLE public.circle_members
ADD COLUMN visibility visibility_state NOT NULL DEFAULT 'auto';
