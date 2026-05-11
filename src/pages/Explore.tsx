import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Ruler, Weight, ArrowLeft, Search, Briefcase, Globe, Mail } from "lucide-react";

interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  city: string | null;
  height: string | null;
  weight: string | null;
  club: string | null;
  photo_url: string | null;
}

interface Scout {
  id: string;
  full_name: string;
  country: string;
  city: string | null;
  photo_url: string | null;
  years_experience: number | null;
  target_positions: string[] | null;
  target_age_min: number | null;
  target_age_max: number | null;
  target_countries: string[] | null;
  player_type_sought: string | null;
  previous_clubs: string[] | null;
  professional_id: string | null;
  verification_status: string;
}

const Explore = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"players" | "scouts">("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPlayers();
      fetchScouts();
    }
  }, [user]);

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*").order("created_at", { ascending: true });
    if (data) setPlayers(data);
    setLoading(false);
  };

  const fetchScouts = async () => {
    const { data } = await supabase.from("scouts").select("*").order("created_at", { ascending: false });
    if (data) setScouts(data as Scout[]);
  };

  const filtered = players.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.city?.toLowerCase().includes(search.toLowerCase()));
    const matchesPos = !posFilter || p.position === posFilter;
    return matchesSearch && matchesPos;
  });

  const filteredScouts = scouts.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || (s.city?.toLowerCase().includes(q)) || s.country.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-primary-foreground/50 hover:text-primary-foreground">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-2xl font-display text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display text-foreground mb-2">EXPLORAR</h1>
        <p className="text-muted-foreground text-sm mb-6">Descubrí talento juvenil y conectá con cazatalentos.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setTab("players")}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${tab === "players" ? "text-lime border-b-2 border-lime" : "text-muted-foreground hover:text-foreground"}`}
          >
            Jugadores
          </button>
          <button
            onClick={() => setTab("scouts")}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${tab === "scouts" ? "text-lime border-b-2 border-lime" : "text-muted-foreground hover:text-foreground"}`}
          >
            Cazatalentos
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "players" ? "Buscar por nombre o ciudad..." : "Buscar cazatalento por nombre, ciudad o país..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none"
            />
          </div>
          {tab === "players" && (
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none"
            >
              <option value="">Todas las posiciones</option>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Mediocampista">Mediocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          )}
        </div>

        {tab === "players" ? (
          loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : filtered.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No se encontraron jugadores.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="bg-hero-gradient p-6 relative">
                    {p.photo_url ? (
                      <img
                        src={supabase.storage.from("player-photos").getPublicUrl(p.photo_url).data.publicUrl}
                        alt={p.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-lime/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-navy-light border-2 border-lime/30 flex items-center justify-center text-xl font-display text-lime">
                        {p.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-primary-foreground font-body">{p.name}</h3>
                      <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-lime/20 text-lime text-xs font-semibold">
                        {p.position}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 text-5xl font-display text-primary-foreground/10">{p.age}</div>
                  </div>
                  <div className="p-6 space-y-3">
                    {p.city && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} /> {p.city}</div>}
                    <div className="flex gap-4">
                      {p.height && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Ruler size={14} /> {p.height}</div>}
                      {p.weight && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Weight size={14} /> {p.weight}</div>}
                    </div>
                    {p.club && <div className="text-sm font-medium text-foreground">{p.club}</div>}
                    <Link
                      to={`/jugador/${p.id}`}
                      className="block w-full mt-4 py-2.5 rounded-xl bg-cta-gradient text-navy font-semibold text-sm text-center hover:opacity-90"
                    >
                      Ver Perfil Completo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredScouts.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <p className="text-muted-foreground">No se encontraron cazatalentos.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScouts.map((s) => (
              <div key={s.id} className="rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="bg-hero-gradient p-6 relative">
                  {s.photo_url ? (
                    <img
                      src={s.photo_url}
                      alt={s.full_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-lime/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-navy-light border-2 border-lime/30 flex items-center justify-center text-xl font-display text-lime">
                      {s.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div className="mt-3">
                    <h3 className="text-lg font-bold text-primary-foreground font-body">{s.full_name}</h3>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-lime/20 text-lime text-xs font-semibold">
                      Cazatalentos
                    </span>
                  </div>
                  {s.verification_status === "aprobado" && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-lime/20 text-lime text-[10px] font-semibold uppercase tracking-wide">
                      Verificado
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} /> {s.city ? `${s.city}, ${s.country}` : s.country}
                  </div>
                  {typeof s.years_experience === "number" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase size={14} /> {s.years_experience} años de experiencia
                    </div>
                  )}
                  {s.target_positions && s.target_positions.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Posiciones que busca</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.target_positions.map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded-full bg-muted text-xs text-foreground">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(s.target_age_min || s.target_age_max) && (
                    <div className="text-sm text-foreground">
                      Edades: <span className="font-medium">{s.target_age_min ?? "-"} a {s.target_age_max ?? "-"} años</span>
                    </div>
                  )}
                  {s.target_countries && s.target_countries.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Globe size={14} className="mt-0.5" />
                      <span>{s.target_countries.join(", ")}</span>
                    </div>
                  )}
                  {s.player_type_sought && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{s.player_type_sought}</p>
                  )}
                  {s.previous_clubs && s.previous_clubs.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Clubes anteriores</p>
                      <p className="text-sm text-foreground">{s.previous_clubs.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
