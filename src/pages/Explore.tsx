import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Ruler, Weight, ArrowLeft, Search } from "lucide-react";

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

const Explore = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*").order("created_at", { ascending: false });
    if (data) setPlayers(data);
    setLoading(false);
  };

  const filtered = players.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.city?.toLowerCase().includes(search.toLowerCase()));
    const matchesPos = !posFilter || p.position === posFilter;
    return matchesSearch && matchesPos;
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
        <h1 className="text-3xl font-display text-foreground mb-2">EXPLORAR JUGADORES</h1>
        <p className="text-muted-foreground text-sm mb-8">Descubrí el próximo talento del fútbol juvenil.</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o ciudad..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none"
            />
          </div>
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
        </div>

        {loading ? (
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
        )}
      </div>
    </div>
  );
};

export default Explore;
