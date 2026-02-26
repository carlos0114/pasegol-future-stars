
-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  user_type TEXT NOT NULL DEFAULT 'player' CHECK (user_type IN ('player', 'club')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Players table (publicly viewable)
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  city TEXT,
  height TEXT,
  weight TEXT,
  club TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Helper function to check player ownership
CREATE OR REPLACE FUNCTION public.is_player_owner(_player_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.players
    WHERE id = _player_id AND profile_id = auth.uid()
  );
$$;

CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create players" ON public.players FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Owners can update players" ON public.players FOR UPDATE TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "Owners can delete players" ON public.players FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- Contact requests table
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sender can view own requests" ON public.contact_requests FOR SELECT TO authenticated USING (sender_profile_id = auth.uid());
CREATE POLICY "Receiver can view requests for their players" ON public.contact_requests FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.players WHERE id = player_id AND profile_id = auth.uid())
);
CREATE POLICY "Authenticated users can send requests" ON public.contact_requests FOR INSERT TO authenticated WITH CHECK (sender_profile_id = auth.uid());
CREATE POLICY "Receiver can update request status" ON public.contact_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.players WHERE id = player_id AND profile_id = auth.uid())
);
CREATE POLICY "Sender can delete own requests" ON public.contact_requests FOR DELETE TO authenticated USING (sender_profile_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
