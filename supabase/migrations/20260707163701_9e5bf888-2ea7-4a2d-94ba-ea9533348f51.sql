GRANT SELECT ON public.ad_banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ad_banners TO authenticated;
GRANT ALL ON public.ad_banners TO service_role;