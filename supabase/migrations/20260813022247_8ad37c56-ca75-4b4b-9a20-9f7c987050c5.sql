DROP POLICY IF EXISTS "Anyone can view player photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view player videos" ON storage.objects;

CREATE POLICY "Users can list their own player media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id IN ('player-photos','player-videos')
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

CREATE POLICY "Admins can list player media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id IN ('player-photos','player-videos')
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);