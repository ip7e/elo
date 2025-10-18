-- Add auto_hide_after_games column to circles table

ALTER TABLE public.circles
ADD COLUMN auto_hide_after_games integer NOT NULL DEFAULT 20;
