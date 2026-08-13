-- 1) Split ad_banners SELECT so anon no longer needs has_role()
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.ad_banners;

CREATE POLICY "Anyone can view active banners"
ON public.ad_banners
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can view all banners"
ON public.ad_banners
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) Revoke anon EXECUTE on SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3) Restrict player-photos write policies to authenticated role
DROP POLICY IF EXISTS "Authenticated users can upload player photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own player photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own player photos" ON storage.objects;

CREATE POLICY "Authenticated users can upload player photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'player-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own player photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'player-photos' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'player-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own player photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'player-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);