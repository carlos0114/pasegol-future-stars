-- 1) Restrict SECURITY DEFINER metrics function to signed-in users only
REVOKE ALL ON FUNCTION public.get_player_metrics(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_player_metrics(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_player_metrics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_player_metrics(uuid) TO service_role;

-- 2) Least-privilege grants on movement_supporters (emails)
REVOKE ALL ON public.movement_supporters FROM anon;
REVOKE ALL ON public.movement_supporters FROM authenticated;
GRANT INSERT ON public.movement_supporters TO anon;
GRANT INSERT, SELECT, DELETE ON public.movement_supporters TO authenticated;
GRANT ALL ON public.movement_supporters TO service_role;

-- 3) Public counter table is read-only for clients
REVOKE ALL ON public.movement_stats FROM anon;
REVOKE ALL ON public.movement_stats FROM authenticated;
GRANT SELECT ON public.movement_stats TO anon;
GRANT SELECT ON public.movement_stats TO authenticated;
GRANT ALL ON public.movement_stats TO service_role;