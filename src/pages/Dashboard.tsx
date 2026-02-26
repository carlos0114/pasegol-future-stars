import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, LogOut, MapPin, Ruler, Weight, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

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

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; user_type: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPlayers();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("full_name, user_type").eq("id", user!.id).single();
    if (data) setProfile(data);
  };

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("*").eq("profile_id", user!.id);
    if (data) setPlayers(data);
    setLoadingPlayers(false);
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      toast.success("Jugador eliminado");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-primary-foreground">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/70">{profile?.full_name || user?.email}</span>
            <button onClick={handleSignOut} className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display text-foreground">MI PANEL</h1>
            <p className="text-muted-foreground text-sm">
              {profile?.user_type === "club" ? "Explorá jugadores y contactá familias" : "Administrá los perfiles de tus jugadores"}
            </p>
          </div>
          {profile?.user_type !== "club" && (
            <Link
              to="/crear-jugador"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={18} /> Agregar Jugador
            </Link>
          )}
          {profile?.user_type === "club" && (
            <Link
              to="/explorar"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
            >
              Explorar Jugadores
            </Link>
          )}
        </div>

        {loadingPlayers ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : profile?.user_type === "club" ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">Como club/scout, podés explorar todos los perfiles de jugadores.</p>
            <Link to="/explorar" className="text-lime font-semibold hover:underline">
              Ver jugadores disponibles →
            </Link>
          </div>
        ) : players.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <h3 className="text-xl font-display text-foreground mb-2">TODAVÍA NO TENÉS JUGADORES</h3>
            <p className="text-muted-foreground mb-6">Creá el primer perfil de jugador para que pueda ser descubierto.</p>
            <Link
              to="/crear-jugador"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90"
            >
              <Plus size={18} /> Crear Primer Perfil
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((p) => (
              <div key={p.id} className="rounded-2xl overflow-hidden bg-card border border-border shadow-card">
                <div className="bg-hero-gradient p-6">
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
                  <h3 className="text-lg font-bold text-primary-foreground mt-3">{p.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-lime/20 text-lime text-xs font-semibold">
                    {p.position}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  {p.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} /> {p.city}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {p.height && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Ruler size={14} /> {p.height}</div>}
                    {p.weight && <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Weight size={14} /> {p.weight}</div>}
                  </div>
                  {p.club && <div className="text-sm font-medium text-foreground">{p.club}</div>}
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/jugador/${p.id}`}
                      className="flex-1 py-2 rounded-xl bg-cta-gradient text-navy font-semibold text-sm text-center hover:opacity-90"
                    >
                      Ver Perfil
                    </Link>
                    <button
                      onClick={() => deletePlayer(p.id)}
                      className="p-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
