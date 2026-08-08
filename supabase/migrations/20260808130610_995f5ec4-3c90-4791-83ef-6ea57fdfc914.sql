CREATE TABLE public.player_profile_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  viewer_profile_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_player_profile_events_player ON public.player_profile_events(player_id, event_type);

GRANT SELECT, INSERT ON public.player_profile_events TO authenticated;
GRANT ALL ON public.player_profile_events TO service_role;

ALTER TABLE public.player_profile_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can log profile events"
ON public.player_profile_events FOR INSERT TO authenticated
WITH CHECK (viewer_profile_id = auth.uid() AND event_type IN ('video_view', 'contact_click'));

CREATE POLICY "Owners and admins can read profile events"
ON public.player_profile_events FOR SELECT TO authenticated
USING (public.is_player_owner(player_id) OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.get_player_metrics(_player_id uuid)
RETURNS TABLE(video_views bigint, contact_clicks bigint, saves bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.player_profile_events e WHERE e.player_id = _player_id AND e.event_type = 'video_view'),
    (SELECT count(*) FROM public.player_profile_events e WHERE e.player_id = _player_id AND e.event_type = 'contact_click'),
    (SELECT count(*) FROM public.favorites f WHERE f.player_id = _player_id)
  WHERE auth.uid() IS NOT NULL
    AND (
      public.is_player_owner(_player_id)
      OR public.has_explorer_access(auth.uid())
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    );
$$;

REVOKE EXECUTE ON FUNCTION public.get_player_metrics(uuid) FROM anon;