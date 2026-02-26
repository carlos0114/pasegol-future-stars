
-- Create storage bucket for player videos
INSERT INTO storage.buckets (id, name, public) VALUES ('player-videos', 'player-videos', true);

-- Anyone can view videos (public bucket)
CREATE POLICY "Anyone can view player videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'player-videos');

-- Authenticated users can upload videos to their own folder (folder = user id)
CREATE POLICY "Users can upload their own player videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'player-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can update their own videos
CREATE POLICY "Users can update their own player videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'player-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own player videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'player-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
