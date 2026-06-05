
-- 1. Player parent contacts (split sensitive PII)
CREATE TABLE public.player_parent_contacts (
  player_id uuid PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  parent_name text,
  parent_email text,
  parent_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.player_parent_contacts (player_id, parent_name, parent_email, parent_phone)
SELECT id, parent_name, parent_email, parent_phone FROM public.players
WHERE parent_name IS NOT NULL OR parent_email IS NOT NULL OR parent_phone IS NOT NULL;

ALTER TABLE public.players DROP COLUMN parent_name;
ALTER TABLE public.players DROP COLUMN parent_email;
ALTER TABLE public.players DROP COLUMN parent_phone;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_parent_contacts TO authenticated;
GRANT ALL ON public.player_parent_contacts TO service_role;
ALTER TABLE public.player_parent_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages parent contact"
ON public.player_parent_contacts
FOR ALL TO authenticated
USING (public.is_player_owner(player_id))
WITH CHECK (public.is_player_owner(player_id));

CREATE POLICY "Admin reads parent contact"
ON public.player_parent_contacts
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Accepted contact senders read parent contact"
ON public.player_parent_contacts
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.contact_requests cr
    WHERE cr.player_id = player_parent_contacts.player_id
      AND cr.sender_profile_id = auth.uid()
      AND cr.status = 'accepted'
  )
);

CREATE TRIGGER update_player_parent_contacts_updated_at
BEFORE UPDATE ON public.player_parent_contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Scouts private (split sensitive verification/refs)
CREATE TABLE public.scouts_private (
  scout_id uuid PRIMARY KEY REFERENCES public.scouts(id) ON DELETE CASCADE,
  verification_doc_url text,
  references_info text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.scouts_private (scout_id, verification_doc_url, references_info)
SELECT id, verification_doc_url, references_info FROM public.scouts
WHERE verification_doc_url IS NOT NULL OR references_info IS NOT NULL;

ALTER TABLE public.scouts DROP COLUMN verification_doc_url;
ALTER TABLE public.scouts DROP COLUMN references_info;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.scouts_private TO authenticated;
GRANT ALL ON public.scouts_private TO service_role;
ALTER TABLE public.scouts_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages scout private"
ON public.scouts_private
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.scouts s WHERE s.id = scout_id AND s.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.scouts s WHERE s.id = scout_id AND s.profile_id = auth.uid()));

CREATE POLICY "Admin reads scout private"
ON public.scouts_private
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_scouts_private_updated_at
BEFORE UPDATE ON public.scouts_private
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. contact_requests INSERT requires player to exist
DROP POLICY IF EXISTS "Verified clubs/scouts can send requests" ON public.contact_requests;
CREATE POLICY "Verified clubs/scouts can send requests"
ON public.contact_requests
FOR INSERT TO authenticated
WITH CHECK (
  sender_profile_id = auth.uid()
  AND (public.is_club_or_scout(auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))
  AND EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id)
);

-- 4. Revoke SECURITY DEFINER function execute from public/anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_club_or_scout(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_player_owner(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
