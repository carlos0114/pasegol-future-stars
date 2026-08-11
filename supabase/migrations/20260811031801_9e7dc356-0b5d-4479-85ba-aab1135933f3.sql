REVOKE ALL ON public.analytics_events FROM anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;

REVOKE ALL ON public.analytics_daily_signups FROM anon, authenticated;
REVOKE ALL ON public.analytics_daily_events FROM anon, authenticated;
REVOKE ALL ON public.analytics_funnel_registro FROM anon, authenticated;
GRANT SELECT ON public.analytics_daily_signups TO authenticated;
GRANT SELECT ON public.analytics_daily_events TO authenticated;
GRANT SELECT ON public.analytics_funnel_registro TO authenticated;