-- 1. Enum de eventos
CREATE TYPE public.analytics_event AS ENUM (
  'user_signup','user_login','profile_created','profile_completed',
  'photo_uploaded','video_uploaded','video_view','player_profile_view',
  'scout_profile_view','club_profile_view','scout_registered','club_registered',
  'contact_made','seeking_opportunities','movement_joined','search_performed',
  'banner_impression','banner_click'
);

-- 2. Tabla de eventos
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name public.analytics_event NOT NULL,
  actor_profile_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_user_type text NULL,
  target_type text NULL,
  target_id uuid NULL,
  session_id text NULL,
  path text NULL,
  referrer text NULL,
  utm_source text NULL,
  utm_medium text NULL,
  utm_campaign text NULL,
  country text NULL,
  city text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. GRANTs (mínimos): insertar para visitantes y usuarios; lectura solo autenticados (RLS restringe a admin)
GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

-- 4. RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_can_insert_anonymous_events"
  ON public.analytics_events FOR INSERT TO anon
  WITH CHECK (actor_profile_id IS NULL);

CREATE POLICY "authenticated_can_insert_own_events"
  ON public.analytics_events FOR INSERT TO authenticated
  WITH CHECK (actor_profile_id IS NULL OR actor_profile_id = auth.uid());

CREATE POLICY "admins_can_read_events"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 5. Refuerzo anti-suplantación a nivel trigger
CREATE OR REPLACE FUNCTION public.enforce_analytics_actor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.actor_profile_id IS NOT NULL AND NEW.actor_profile_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'actor_profile_id must match the authenticated user';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_analytics_actor
  BEFORE INSERT ON public.analytics_events
  FOR EACH ROW EXECUTE FUNCTION public.enforce_analytics_actor();

-- 6. Índices
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_name_created ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX idx_analytics_events_actor ON public.analytics_events (actor_profile_id, created_at DESC);
CREATE INDEX idx_analytics_events_target ON public.analytics_events (target_type, target_id);
CREATE INDEX idx_analytics_events_metadata ON public.analytics_events USING gin (metadata);

-- 7. Campos nuevos en players (aditivos)
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS seeking_opportunities boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_completed_at timestamp with time zone NULL;

-- 8. Vistas agregadas (security_invoker: respetan RLS del usuario que consulta)
CREATE VIEW public.analytics_daily_signups
WITH (security_invoker = on) AS
  SELECT date_trunc('day', p.created_at)::date AS day,
         p.user_type,
         count(*)::bigint AS signups
  FROM public.profiles p
  GROUP BY 1, 2;

CREATE VIEW public.analytics_daily_events
WITH (security_invoker = on) AS
  SELECT date_trunc('day', e.created_at)::date AS day,
         e.event_name,
         e.actor_user_type,
         count(*)::bigint AS total,
         count(DISTINCT e.actor_profile_id)::bigint AS unique_actors
  FROM public.analytics_events e
  GROUP BY 1, 2, 3;

CREATE VIEW public.analytics_funnel_registro
WITH (security_invoker = on) AS
  SELECT p.user_type,
         count(*)::bigint AS cuentas,
         count(pl.id)::bigint AS con_perfil_jugador,
         count(pl.photo_url)::bigint AS con_foto,
         count(pl.video_url)::bigint AS con_video,
         count(pl.profile_completed_at)::bigint AS perfil_completado
  FROM public.profiles p
  LEFT JOIN public.players pl ON pl.profile_id = p.id
  GROUP BY 1;

GRANT SELECT ON public.analytics_daily_signups TO authenticated;
GRANT SELECT ON public.analytics_daily_events TO authenticated;
GRANT SELECT ON public.analytics_funnel_registro TO authenticated;
GRANT SELECT ON public.analytics_daily_signups, public.analytics_daily_events, public.analytics_funnel_registro TO service_role;

-- 9. Asegurar que las funciones usadas por políticas sean ejecutables (evita 401)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_analytics_actor() TO anon, authenticated;