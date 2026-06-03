
-- 1. Profiles: drop overly broad SELECT policy. Keep "Users can view own profile".
DROP POLICY IF EXISTS "Authenticated can view profiles" ON public.profiles;

-- 2. Clubs: restrict approved-club visibility to authenticated users only.
DROP POLICY IF EXISTS "Anyone can view approved clubs" ON public.clubs;
CREATE POLICY "Authenticated can view approved clubs"
  ON public.clubs
  FOR SELECT
  TO authenticated
  USING (verification_status = 'aprobado' OR profile_id = auth.uid());

-- 3. Require verified status for clubs/scouts to see players (and parent contact data).
CREATE OR REPLACE FUNCTION public.is_club_or_scout(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clubs
    WHERE profile_id = _user_id AND verification_status = 'aprobado'
    UNION
    SELECT 1 FROM public.scouts
    WHERE profile_id = _user_id AND verification_status = 'aprobado'
  )
$$;

-- 4. Lock down SECURITY DEFINER helpers from anonymous callers.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_club_or_scout(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_player_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_club_or_scout(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_player_owner(uuid) TO authenticated;
