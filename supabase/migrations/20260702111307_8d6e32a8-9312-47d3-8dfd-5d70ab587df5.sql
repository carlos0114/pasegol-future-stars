
CREATE TABLE public.movement_supporters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Anyone (including anonymous visitors) can join the movement by inserting their email.
-- Only admins can read the full list of supporters.
GRANT INSERT ON public.movement_supporters TO anon, authenticated;
GRANT SELECT, DELETE ON public.movement_supporters TO authenticated;
GRANT ALL ON public.movement_supporters TO service_role;

ALTER TABLE public.movement_supporters ENABLE ROW LEVEL SECURITY;

-- Anyone can add themselves
CREATE POLICY "Anyone can join the movement"
  ON public.movement_supporters
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read the list of supporters (emails are private)
CREATE POLICY "Admins can view all supporters"
  ON public.movement_supporters
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete supporters"
  ON public.movement_supporters
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public count function so anyone can see the total without exposing emails
CREATE OR REPLACE FUNCTION public.get_movement_supporters_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.movement_supporters;
$$;

REVOKE ALL ON FUNCTION public.get_movement_supporters_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_movement_supporters_count() TO anon, authenticated;
