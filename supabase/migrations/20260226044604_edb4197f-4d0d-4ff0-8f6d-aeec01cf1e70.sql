
-- Add photo_url column to players table
ALTER TABLE public.players ADD COLUMN photo_url text;

-- Create storage bucket for player photos
INSERT INTO storage.buckets (id, name, public) VALUES ('player-photos', 'player-photos', true);

-- Storage policies for player photos
CREATE POLICY "Anyone can view player photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'player-photos');

CREATE POLICY "Authenticated users can upload player photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own player photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'player-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own player photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'player-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
