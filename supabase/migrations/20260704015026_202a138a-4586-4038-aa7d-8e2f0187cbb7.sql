
DROP POLICY IF EXISTS "Club or scout can view players" ON public.players;
CREATE POLICY "Club or scout can view players"
ON public.players
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR public.is_club_or_scout(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Clubs scouts admins or owner can view clubs" ON public.clubs;
CREATE POLICY "Clubs scouts admins or owner can view clubs"
ON public.clubs
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_club_or_scout(auth.uid())
);

DROP POLICY IF EXISTS "Clubs scouts admins or owner can view scouts" ON public.scouts;
CREATE POLICY "Clubs scouts admins or owner can view scouts"
ON public.scouts
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_club_or_scout(auth.uid())
);
