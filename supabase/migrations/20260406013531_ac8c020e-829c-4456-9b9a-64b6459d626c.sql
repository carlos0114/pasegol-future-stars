
-- Create helper function to check user type
CREATE OR REPLACE FUNCTION public.is_club_or_scout(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id
    AND user_type IN ('club', 'scout')
  )
$$;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view players" ON public.players;

-- New policy: only owner or club/scout can view
CREATE POLICY "Club or scout can view players"
ON public.players
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR public.is_club_or_scout(auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
