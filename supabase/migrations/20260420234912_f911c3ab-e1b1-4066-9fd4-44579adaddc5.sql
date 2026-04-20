-- Drop existing check constraint and recreate it including 'scout'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (user_type IN ('player', 'club', 'scout'));

-- Fix existing scout profiles that were saved as 'player'
UPDATE public.profiles
SET user_type = 'scout', updated_at = now()
WHERE user_type <> 'scout'
  AND id IN (SELECT profile_id FROM public.scouts);

-- Fix existing club profiles saved with the wrong type
UPDATE public.profiles
SET user_type = 'club', updated_at = now()
WHERE user_type <> 'club'
  AND id IN (SELECT profile_id FROM public.clubs);