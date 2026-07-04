CREATE OR REPLACE FUNCTION public.get_public_players()
RETURNS TABLE (
  id uuid,
  name text,
  age integer,
  "position" text,
  city text,
  height text,
  weight text,
  club text,
  video_url text,
  photo_url text,
  profile_id uuid,
  birth_year integer,
  preferred_foot text,
  secondary_position text,
  category text,
  years_playing integer,
  achievements text,
  speed integer,
  technique integer,
  game_vision integer,
  finishing integer,
  endurance integer,
  native_language text,
  other_languages text[],
  eu_passport boolean,
  representation_status text,
  representative_name text,
  competitions jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.name,
    p.age,
    p.position AS "position",
    p.city,
    p.height,
    p.weight,
    p.club,
    p.video_url,
    p.photo_url,
    CASE WHEN p.profile_id = auth.uid() THEN p.profile_id ELSE NULL::uuid END AS profile_id,
    p.birth_year,
    p.preferred_foot,
    p.secondary_position,
    p.category,
    p.years_playing,
    p.achievements,
    p.speed,
    p.technique,
    p.game_vision,
    p.finishing,
    p.endurance,
    p.native_language,
    p.other_languages,
    p.eu_passport,
    p.representation_status,
    p.representative_name,
    p.competitions,
    p.created_at
  FROM public.players p
  WHERE auth.uid() IS NOT NULL
    AND (
      p.profile_id = auth.uid()
      OR public.has_club_or_scout_profile(auth.uid())
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    )
  ORDER BY p.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_public_player(_player_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  age integer,
  "position" text,
  city text,
  height text,
  weight text,
  club text,
  video_url text,
  photo_url text,
  profile_id uuid,
  birth_year integer,
  preferred_foot text,
  secondary_position text,
  category text,
  years_playing integer,
  achievements text,
  speed integer,
  technique integer,
  game_vision integer,
  finishing integer,
  endurance integer,
  native_language text,
  other_languages text[],
  eu_passport boolean,
  representation_status text,
  representative_name text,
  competitions jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.name,
    p.age,
    p.position AS "position",
    p.city,
    p.height,
    p.weight,
    p.club,
    p.video_url,
    p.photo_url,
    CASE WHEN p.profile_id = auth.uid() THEN p.profile_id ELSE NULL::uuid END AS profile_id,
    p.birth_year,
    p.preferred_foot,
    p.secondary_position,
    p.category,
    p.years_playing,
    p.achievements,
    p.speed,
    p.technique,
    p.game_vision,
    p.finishing,
    p.endurance,
    p.native_language,
    p.other_languages,
    p.eu_passport,
    p.representation_status,
    p.representative_name,
    p.competitions,
    p.created_at
  FROM public.players p
  WHERE p.id = _player_id
    AND auth.uid() IS NOT NULL
    AND (
      p.profile_id = auth.uid()
      OR public.has_club_or_scout_profile(auth.uid())
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
$$;

CREATE OR REPLACE FUNCTION public.get_public_scouts()
RETURNS TABLE (
  id uuid,
  full_name text,
  country text,
  city text,
  photo_url text,
  years_experience integer,
  target_positions text[],
  target_age_min integer,
  target_age_max integer,
  target_countries text[],
  player_type_sought text,
  previous_clubs text[],
  verification_status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.full_name,
    s.country,
    s.city,
    s.photo_url,
    s.years_experience,
    s.target_positions,
    s.target_age_min,
    s.target_age_max,
    s.target_countries,
    s.player_type_sought,
    s.previous_clubs,
    s.verification_status,
    s.created_at
  FROM public.scouts s
  WHERE auth.uid() IS NOT NULL
    AND (
      s.profile_id = auth.uid()
      OR public.has_club_or_scout_profile(auth.uid())
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    )
  ORDER BY s.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_public_players() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_public_player(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_public_scouts() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_public_players() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_player(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_scouts() TO authenticated, service_role;