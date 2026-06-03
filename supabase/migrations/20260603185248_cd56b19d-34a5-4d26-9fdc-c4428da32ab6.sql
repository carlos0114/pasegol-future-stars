ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS representation_status text NOT NULL DEFAULT 'prefiero_no_informar',
  ADD COLUMN IF NOT EXISTS representative_name text;