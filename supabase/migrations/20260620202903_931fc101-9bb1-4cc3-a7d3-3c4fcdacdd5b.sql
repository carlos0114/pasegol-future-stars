DROP POLICY IF EXISTS "Authenticated can view approved clubs" ON public.clubs;
CREATE POLICY "Verified clubs scouts admins or owner can view clubs"
ON public.clubs FOR SELECT TO authenticated
USING (
  profile_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (verification_status = 'aprobado' AND is_club_or_scout(auth.uid()))
);

DROP POLICY IF EXISTS "View scouts" ON public.scouts;
CREATE POLICY "Verified clubs scouts admins or owner can view scouts"
ON public.scouts FOR SELECT TO authenticated
USING (
  profile_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (verification_status = 'aprobado' AND is_club_or_scout(auth.uid()))
);