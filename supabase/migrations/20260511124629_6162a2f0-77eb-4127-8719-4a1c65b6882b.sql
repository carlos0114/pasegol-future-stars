DROP POLICY IF EXISTS "Anyone can view approved scouts" ON public.scouts;
CREATE POLICY "View scouts" ON public.scouts FOR SELECT USING (
  verification_status = 'aprobado'
  OR profile_id = auth.uid()
  OR public.is_club_or_scout(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);