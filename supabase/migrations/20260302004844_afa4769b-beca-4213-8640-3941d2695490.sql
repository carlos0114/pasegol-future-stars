
-- Add new columns to players table
ALTER TABLE public.players
ADD COLUMN birth_year integer,
ADD COLUMN preferred_foot text DEFAULT 'Derecha',
ADD COLUMN secondary_position text,
ADD COLUMN category text,
ADD COLUMN years_playing integer,
ADD COLUMN achievements text,
ADD COLUMN speed integer DEFAULT 50 CHECK (speed >= 0 AND speed <= 100),
ADD COLUMN technique integer DEFAULT 50 CHECK (technique >= 0 AND technique <= 100),
ADD COLUMN game_vision integer DEFAULT 50 CHECK (game_vision >= 0 AND game_vision <= 100),
ADD COLUMN finishing integer DEFAULT 50 CHECK (finishing >= 0 AND finishing <= 100),
ADD COLUMN endurance integer DEFAULT 50 CHECK (endurance >= 0 AND endurance <= 100),
ADD COLUMN parent_name text,
ADD COLUMN parent_email text,
ADD COLUMN parent_phone text;
