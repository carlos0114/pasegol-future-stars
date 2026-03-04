import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, LogOut, MapPin, Ruler, Weight, Trash2, Building2, UserSearch, Globe, Phone, Mail, Trophy, Briefcase, Target, Shield } from "lucide-react";
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

interface ClubData {
  id: string;
  official_name: string;
  founded_year: number | null;
  country: string;
  city: string | null;
  club_type: string | null;
  league: string | null;
  categories: string[] | null;
  institutional_email: string | null;
  phone: string | null;
  contact_person: string | null;
  contact_role: string | null;
  website: string | null;
  verification_status: string;
}

interface ScoutData {
  id: string;
  full_name: string;
  country: string;
  city: string | null;
  years_experience: number | null;
  previous_clubs: string[] | null;
  player_type_sought: string | null;
  target_age_min: number | null;
  target_age_max: number | null;
  target_positions: string[] | null;
  verification_status: string;
}

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string; user_type: string } | null>(null);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [scoutData, setScoutData] = useState<ScoutData | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPlayers();
      supabase.from("clubs").select("*").eq("profile_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setClubData(data);
      });
      supabase.from("scouts").select("*").eq("profile_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setScoutData(data);
      });
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

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-500/20 text-yellow-400",
      aprobado: "bg-green-500/20 text-green-400",
      rechazado: "bg-red-500/20 text-red-400",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.pendiente}`}>
        <Shield size={12} /> {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-primary-foreground">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background">
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-foreground">MI PANEL</h1>
            <p className="text-muted-foreground text-sm">
              {profile?.user_type === "club"
                ? "Gestioná tu club y explorá jugadores"
                : profile?.user_type === "scout"
                ? "Buscá talentos y gestioná tu perfil profesional"
                : "Administrá los perfiles de tus jugadores"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile?.user_type === "player" && (
              <Link to="/crear-jugador" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 transition-opacity">
                <Plus size={18} /> Agregar Jugador
              </Link>
            )}
            {profile?.user_type === "club" && (
              <>
                <Link to="/perfil-club" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-lime/50 transition-colors">
                  <Building2 size={18} /> {clubData ? "Editar Perfil Club" : "Crear Perfil Club"}
                </Link>
                <Link to="/explorar" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 transition-opacity">
                  Explorar Jugadores
                </Link>
              </>
            )}
            {profile?.user_type === "scout" && (
              <>
                <Link to="/perfil-scout" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold hover:border-lime/50 transition-colors">
                  <UserSearch size={18} /> {scoutData ? "Editar Perfil Scout" : "Crear Perfil Scout"}
                </Link>
                <Link to="/explorar" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 transition-opacity">
                  Explorar Jugadores
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ===== CLUB DASHBOARD ===== */}
        {profile?.user_type === "club" && (
          clubData ? (
            <div className="space-y-6">
              {/* Club Header Card */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="bg-hero-gradient p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-navy-light border border-lime/30 flex items-center justify-center">
                          <Building2 size={24} className="text-lime" />
                        </div>
                        <div>
                          <h2 className="text-xl font-display text-primary-foreground">{clubData.official_name}</h2>
                          <p className="text-primary-foreground/60 text-sm">{clubData.club_type ? clubData.club_type.charAt(0).toUpperCase() + clubData.club_type.slice(1) : "Club"} • {clubData.country}</p>
                        </div>
                      </div>
                    </div>
                    {statusBadge(clubData.verification_status)}
                  </div>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clubData.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} className="text-lime" /> {clubData.city}, {clubData.country}
                    </div>
                  )}
                  {clubData.founded_year && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy size={14} className="text-lime" /> Fundado en {clubData.founded_year}
                    </div>
                  )}
                  {clubData.league && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy size={14} className="text-lime" /> {clubData.league}
                    </div>
                  )}
                  {clubData.institutional_email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} className="text-lime" /> {clubData.institutional_email}
                    </div>
                  )}
                  {clubData.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={14} className="text-lime" /> {clubData.phone}
                    </div>
                  )}
                  {clubData.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe size={14} className="text-lime" /> {clubData.website}
                    </div>
                  )}
                </div>
              </div>

              {/* Categories & Contact */}
              <div className="grid sm:grid-cols-2 gap-6">
                {clubData.categories && clubData.categories.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-display text-foreground mb-3 flex items-center gap-2"><Trophy size={18} className="text-lime" /> Categorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {clubData.categories.map((cat) => (
                        <span key={cat} className="px-3 py-1 rounded-full bg-lime/10 text-lime text-xs font-semibold">{cat}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(clubData.contact_person || clubData.contact_role) && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-display text-foreground mb-3 flex items-center gap-2"><Phone size={18} className="text-lime" /> Responsable</h3>
                    {clubData.contact_person && <p className="text-foreground font-medium">{clubData.contact_person}</p>}
                    {clubData.contact_role && <p className="text-muted-foreground text-sm">{clubData.contact_role}</p>}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Building2 size={48} className="mx-auto text-lime/40 mb-4" />
              <h3 className="text-xl font-display text-foreground mb-2">COMPLETÁ TU PERFIL DE CLUB</h3>
              <p className="text-muted-foreground mb-6">Agregá la información institucional de tu club para que scouts y jugadores te encuentren.</p>
              <Link to="/perfil-club" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90">
                <Building2 size={18} /> Crear Perfil de Club
              </Link>
            </div>
          )
        )}

        {/* ===== SCOUT DASHBOARD ===== */}
        {profile?.user_type === "scout" && (
          scoutData ? (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="bg-hero-gradient p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-navy-light border border-lime/30 flex items-center justify-center">
                        <UserSearch size={24} className="text-lime" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display text-primary-foreground">{scoutData.full_name}</h2>
                        <p className="text-primary-foreground/60 text-sm">Scout • {scoutData.country}{scoutData.city ? `, ${scoutData.city}` : ""}</p>
                      </div>
                    </div>
                    {statusBadge(scoutData.verification_status)}
                  </div>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scoutData.years_experience != null && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase size={14} className="text-lime" /> {scoutData.years_experience} años de experiencia
                    </div>
                  )}
                  {scoutData.player_type_sought && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target size={14} className="text-lime" /> Busca: {scoutData.player_type_sought}
                    </div>
                  )}
                  {scoutData.target_age_min != null && scoutData.target_age_max != null && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target size={14} className="text-lime" /> Edad: {scoutData.target_age_min} - {scoutData.target_age_max} años
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {scoutData.target_positions && scoutData.target_positions.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-display text-foreground mb-3 flex items-center gap-2"><Target size={18} className="text-lime" /> Posiciones buscadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {scoutData.target_positions.map((pos) => (
                        <span key={pos} className="px-3 py-1 rounded-full bg-lime/10 text-lime text-xs font-semibold">{pos}</span>
                      ))}
                    </div>
                  </div>
                )}
                {scoutData.previous_clubs && scoutData.previous_clubs.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-display text-foreground mb-3 flex items-center gap-2"><Briefcase size={18} className="text-lime" /> Clubes anteriores</h3>
                    <div className="flex flex-wrap gap-2">
                      {scoutData.previous_clubs.map((club) => (
                        <span key={club} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{club}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <UserSearch size={48} className="mx-auto text-lime/40 mb-4" />
              <h3 className="text-xl font-display text-foreground mb-2">COMPLETÁ TU PERFIL DE SCOUT</h3>
              <p className="text-muted-foreground mb-6">Agregá tu información profesional para buscar y contactar talentos.</p>
              <Link to="/perfil-scout" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90">
                <UserSearch size={18} /> Crear Perfil de Scout
              </Link>
            </div>
          )
        )}

        {/* ===== PLAYER DASHBOARD ===== */}
        {profile?.user_type === "player" && (
          loadingPlayers ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : players.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <h3 className="text-xl font-display text-foreground mb-2">TODAVÍA NO TENÉS JUGADORES</h3>
              <p className="text-muted-foreground mb-6">Creá el primer perfil de jugador para que pueda ser descubierto.</p>
              <Link to="/crear-jugador" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90">
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
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
