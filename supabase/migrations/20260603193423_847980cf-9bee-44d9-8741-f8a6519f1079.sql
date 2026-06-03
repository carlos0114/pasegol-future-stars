
-- 1) Enforce verification_status = 'pendiente' on club INSERT
DROP POLICY IF EXISTS "Owner can insert club" ON public.clubs;
CREATE POLICY "Owner can insert club"
  ON public.clubs FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid() AND verification_status = 'pendiente');

-- Prevent users from changing their own verification_status via UPDATE
DROP POLICY IF EXISTS "Owner can update club" ON public.clubs;
CREATE POLICY "Owner can update club"
  ON public.clubs FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (
    profile_id = auth.uid()
    AND verification_status = (SELECT verification_status FROM public.clubs c WHERE c.id = clubs.id)
  );

-- 2) Enforce verification_status = 'pendiente' on scout INSERT
DROP POLICY IF EXISTS "Owner can insert scout" ON public.scouts;
CREATE POLICY "Owner can insert scout"
  ON public.scouts FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid() AND verification_status = 'pendiente');

DROP POLICY IF EXISTS "Owner can update scout" ON public.scouts;
CREATE POLICY "Owner can update scout"
  ON public.scouts FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (
    profile_id = auth.uid()
    AND verification_status = (SELECT verification_status FROM public.scouts s WHERE s.id = scouts.id)
    AND account_status = (SELECT account_status FROM public.scouts s WHERE s.id = scouts.id)
  );

-- 3) Restrict scouts SELECT to authenticated only
DROP POLICY IF EXISTS "View scouts" ON public.scouts;
CREATE POLICY "View scouts"
  ON public.scouts FOR SELECT
  TO authenticated
  USING (
    (verification_status = 'aprobado')
    OR (profile_id = auth.uid())
    OR public.is_club_or_scout(auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- 4) Contact requests: only verified clubs/scouts or admins
DROP POLICY IF EXISTS "Authenticated users can send requests" ON public.contact_requests;
CREATE POLICY "Verified clubs/scouts can send requests"
  ON public.contact_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_profile_id = auth.uid()
    AND (public.is_club_or_scout(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
  );

-- 5) Lock down SECURITY DEFINER helper functions from anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_club_or_scout(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_player_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_club_or_scout(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_player_owner(uuid) TO authenticated;
