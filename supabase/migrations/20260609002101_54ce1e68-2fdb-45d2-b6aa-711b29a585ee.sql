
-- Tipos de eventos
CREATE TYPE public.admin_notification_type AS ENUM (
  'new_player',
  'new_club',
  'new_scout',
  'new_video',
  'new_contact_request'
);

-- Tabla de auditoría
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.admin_notification_type NOT NULL,
  actor_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name text,
  actor_email text,
  account_type text,
  country text,
  target_id uuid,
  target_url text,
  video_url text,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX idx_admin_notif_type ON public.admin_notifications(type);
CREATE INDEX idx_admin_notif_email_pending ON public.admin_notifications(email_sent) WHERE email_sent = false;

GRANT SELECT, UPDATE ON public.admin_notifications TO authenticated;
GRANT ALL ON public.admin_notifications TO service_role;

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notifications"
  ON public.admin_notifications FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notifications"
  ON public.admin_notifications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGER FUNCTIONS ============

-- Nuevo jugador
CREATE OR REPLACE FUNCTION public.notify_new_player()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text; v_full_name text;
BEGIN
  SELECT email, full_name INTO v_email, v_full_name FROM public.profiles WHERE id = NEW.profile_id;
  INSERT INTO public.admin_notifications (type, actor_profile_id, actor_name, actor_email, account_type, country, target_id, target_url, metadata)
  VALUES ('new_player', NEW.profile_id, NEW.name, v_email, 'Jugador', NEW.city,
          NEW.id, '/jugador/' || NEW.id::text,
          jsonb_build_object('age', NEW.age, 'position', NEW.position));
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_new_player
  AFTER INSERT ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_player();

-- Nuevo club
CREATE OR REPLACE FUNCTION public.notify_new_club()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email FROM public.profiles WHERE id = NEW.profile_id;
  INSERT INTO public.admin_notifications (type, actor_profile_id, actor_name, actor_email, account_type, country, target_id, target_url, metadata)
  VALUES ('new_club', NEW.profile_id, NEW.official_name, v_email, 'Club', NEW.country,
          NEW.id, '/admin',
          jsonb_build_object('city', NEW.city, 'club_type', NEW.club_type));
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_new_club
  AFTER INSERT ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_club();

-- Nuevo scout
CREATE OR REPLACE FUNCTION public.notify_new_scout()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email FROM public.profiles WHERE id = NEW.profile_id;
  INSERT INTO public.admin_notifications (type, actor_profile_id, actor_name, actor_email, account_type, country, target_id, target_url, metadata)
  VALUES ('new_scout', NEW.profile_id, NEW.full_name, v_email, 'Scout', NEW.country,
          NEW.id, '/admin',
          jsonb_build_object('city', NEW.city, 'years_experience', NEW.years_experience));
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_new_scout
  AFTER INSERT ON public.scouts
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_scout();

-- Nuevo video (al crear jugador con video o cuando cambia el video_url)
CREATE OR REPLACE FUNCTION public.notify_new_video()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text;
BEGIN
  IF NEW.video_url IS NULL OR NEW.video_url = '' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND COALESCE(OLD.video_url, '') = COALESCE(NEW.video_url, '') THEN
    RETURN NEW;
  END IF;
  SELECT email INTO v_email FROM public.profiles WHERE id = NEW.profile_id;
  INSERT INTO public.admin_notifications (type, actor_profile_id, actor_name, actor_email, account_type, country, target_id, target_url, video_url, metadata)
  VALUES ('new_video', NEW.profile_id, NEW.name, v_email, 'Jugador', NEW.city,
          NEW.id, '/jugador/' || NEW.id::text, NEW.video_url,
          jsonb_build_object('position', NEW.position));
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_new_video
  AFTER INSERT OR UPDATE OF video_url ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_video();

-- Nueva solicitud de contacto
CREATE OR REPLACE FUNCTION public.notify_new_contact_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_sender_email text; v_sender_name text; v_player_name text; v_player_city text;
BEGIN
  SELECT email, full_name INTO v_sender_email, v_sender_name FROM public.profiles WHERE id = NEW.sender_profile_id;
  SELECT name, city INTO v_player_name, v_player_city FROM public.players WHERE id = NEW.player_id;
  INSERT INTO public.admin_notifications (type, actor_profile_id, actor_name, actor_email, account_type, country, target_id, target_url, message, metadata)
  VALUES ('new_contact_request', NEW.sender_profile_id, v_sender_name, v_sender_email, 'Contacto', v_player_city,
          NEW.player_id, '/jugador/' || NEW.player_id::text, NEW.message,
          jsonb_build_object('player_name', v_player_name));
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_new_contact_request
  AFTER INSERT ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_contact_request();
