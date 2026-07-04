
-- Revoke public EXECUTE on SECURITY DEFINER functions that don't need anon access
REVOKE EXECUTE ON FUNCTION public.has_club_or_scout_profile(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_club_or_scout_profile(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_movement_supporters_count() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_movement_supporters_count() TO authenticated, service_role;

-- Tighten overly-permissive INSERT policy on movement_supporters
DROP POLICY IF EXISTS "Anyone can join the movement" ON public.movement_supporters;
CREATE POLICY "Anyone can join the movement"
ON public.movement_supporters
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
