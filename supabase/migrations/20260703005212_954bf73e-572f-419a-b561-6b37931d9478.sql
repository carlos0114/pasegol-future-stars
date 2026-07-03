
-- Allow any authenticated club or scout (not only verified) to view players and scouts directory.
CREATE OR REPLACE FUNCTION public.has_club_or_scout_profile(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clubs WHERE profile_id = _user_id
    UNION
    SELECT 1 FROM public.scouts WHERE profile_id = _user_id
  )
$$;

DROP POLICY IF EXISTS "Club or scout can view players" ON public.players;
CREATE POLICY "Club or scout can view players"
ON public.players FOR SELECT TO authenticated
USING (
  profile_id = auth.uid()
  OR public.has_club_or_scout_profile(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Verified clubs scouts admins or owner can view scouts" ON public.scouts;
CREATE POLICY "Clubs scouts admins or owner can view scouts"
ON public.scouts FOR SELECT TO authenticated
USING (
  profile_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_club_or_scout_profile(auth.uid())
);

DROP POLICY IF EXISTS "Verified clubs scouts admins or owner can view clubs" ON public.clubs;
CREATE POLICY "Clubs scouts admins or owner can view clubs"
ON public.clubs FOR SELECT TO authenticated
USING (
  profile_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_club_or_scout_profile(auth.uid())
);
