CREATE TABLE IF NOT EXISTS public.movement_stats (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  supporters_count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.movement_stats TO anon, authenticated;
GRANT ALL ON public.movement_stats TO service_role;

ALTER TABLE public.movement_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read movement stats" ON public.movement_stats;
CREATE POLICY "Anyone can read movement stats"
ON public.movement_stats FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.movement_stats (id, supporters_count)
VALUES (true, (SELECT count(*) FROM public.movement_supporters))
ON CONFLICT (id) DO UPDATE SET supporters_count = EXCLUDED.supporters_count;

CREATE OR REPLACE FUNCTION public.refresh_movement_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.movement_stats
  SET supporters_count = (SELECT count(*) FROM public.movement_supporters),
      updated_at = now()
  WHERE id;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.refresh_movement_stats() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_refresh_movement_stats ON public.movement_supporters;
CREATE TRIGGER trg_refresh_movement_stats
AFTER INSERT OR DELETE ON public.movement_supporters
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_movement_stats();

REVOKE EXECUTE ON FUNCTION public.get_movement_supporters_count() FROM anon;