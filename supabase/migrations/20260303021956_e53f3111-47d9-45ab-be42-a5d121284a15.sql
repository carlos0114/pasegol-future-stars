
-- =============================================
-- FASE 1: Modelo de datos profesional PaseGol
-- =============================================

-- 1. TABLA CLUBS
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Información institucional
  official_name TEXT NOT NULL,
  founded_year INTEGER,
  country TEXT NOT NULL DEFAULT 'Argentina',
  city TEXT,
  address TEXT,
  website TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  logo_url TEXT,
  -- Información deportiva
  categories TEXT[] DEFAULT '{}',
  club_type TEXT DEFAULT 'formativo',
  league TEXT,
  competitive_level TEXT,
  -- Contacto
  institutional_email TEXT,
  phone TEXT,
  contact_person TEXT,
  contact_role TEXT,
  -- Verificación
  verification_doc_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pendiente',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved clubs" ON public.clubs
  FOR SELECT USING (verification_status = 'aprobado' OR profile_id = auth.uid());

CREATE POLICY "Owner can insert club" ON public.clubs
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owner can update club" ON public.clubs
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Owner can delete club" ON public.clubs
  FOR DELETE USING (profile_id = auth.uid());

CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. TABLA SCOUTS
CREATE TABLE public.scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Información personal
  full_name TEXT NOT NULL,
  professional_id TEXT,
  country TEXT NOT NULL DEFAULT 'Argentina',
  city TEXT,
  photo_url TEXT,
  -- Experiencia
  years_experience INTEGER DEFAULT 0,
  previous_clubs TEXT[] DEFAULT '{}',
  player_type_sought TEXT,
  references_info TEXT,
  -- Preferencias de búsqueda
  target_age_min INTEGER DEFAULT 5,
  target_age_max INTEGER DEFAULT 18,
  target_positions TEXT[] DEFAULT '{}',
  target_countries TEXT[] DEFAULT '{}',
  -- Verificación
  verification_doc_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pendiente',
  account_status TEXT NOT NULL DEFAULT 'activo',
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved scouts" ON public.scouts
  FOR SELECT USING (verification_status = 'aprobado' OR profile_id = auth.uid());

CREATE POLICY "Owner can insert scout" ON public.scouts
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owner can update scout" ON public.scouts
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Owner can delete scout" ON public.scouts
  FOR DELETE USING (profile_id = auth.uid());

CREATE TRIGGER update_scouts_updated_at
  BEFORE UPDATE ON public.scouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. RELACIÓN CLUB ↔ SCOUT
CREATE TABLE public.club_scouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  scout_id UUID NOT NULL REFERENCES public.scouts(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'scout',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(club_id, scout_id)
);

ALTER TABLE public.club_scouts ENABLE ROW LEVEL SECURITY;

-- Club owner or scout themselves can view
CREATE POLICY "Club owner or scout can view" ON public.club_scouts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = club_id AND profile_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.scouts WHERE id = scout_id AND profile_id = auth.uid())
  );

CREATE POLICY "Club owner can manage scouts" ON public.club_scouts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = club_id AND profile_id = auth.uid())
  );

CREATE POLICY "Club owner can remove scouts" ON public.club_scouts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = club_id AND profile_id = auth.uid())
  );

-- 4. FAVORITOS
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, player_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own favorites" ON public.favorites
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "User can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "User can remove favorites" ON public.favorites
  FOR DELETE USING (profile_id = auth.uid());

-- 5. ACTIVITY LOGS
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view own logs" ON public.activity_logs
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "User can insert own logs" ON public.activity_logs
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Index for performance
CREATE INDEX idx_activity_logs_profile ON public.activity_logs(profile_id);
CREATE INDEX idx_activity_logs_target ON public.activity_logs(target_type, target_id);
CREATE INDEX idx_favorites_profile ON public.favorites(profile_id);
CREATE INDEX idx_clubs_country_city ON public.clubs(country, city);
CREATE INDEX idx_scouts_country ON public.scouts(country);
