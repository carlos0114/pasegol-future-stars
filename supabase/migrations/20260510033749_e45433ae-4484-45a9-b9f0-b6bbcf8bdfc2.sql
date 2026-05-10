ALTER TABLE public.players 
  ADD COLUMN IF NOT EXISTS native_language text,
  ADD COLUMN IF NOT EXISTS other_languages text[] DEFAULT '{}'::text[];