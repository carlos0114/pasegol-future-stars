import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Ruler, Weight, ArrowLeft, Send } from "lucide-react";
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
  video_url: string | null;
  profile_id: string;
}

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    const { data } = await supabase.from("players").select("*").eq("id", id!).single();
    if (data) setPlayer(data);
    setLoading(false);
  };

  const sendContactRequest = async () => {
    if (!user || !player || !message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_requests").insert({
      sender_profile_id: user.id,
      player_id: player.id,
      message: message.trim(),
    });
    if (error) {
      toast.error("Error al enviar mensaje");
    } else {
      toast.success("¡Mensaje enviado a la familia!");
      setMessage("");
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!player) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Jugador no encontrado</div>;

  const isOwner = user?.id === player.profile_id;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={isOwner ? "/dashboard" : "/explorar"} className="text-primary-foreground/50 hover:text-primary-foreground">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-2xl font-display text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Player card */}
        <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-card">
          <div className="bg-hero-gradient p-8 relative">
            <div className="w-20 h-20 rounded-full bg-navy-light border-2 border-lime/30 flex items-center justify-center text-3xl font-display text-lime">
              {player.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-primary-foreground font-body">{player.name}</h1>
              <span className="inline-block mt-2 px-4 py-1 rounded-full bg-lime/20 text-lime text-sm font-semibold">
                {player.position}
              </span>
            </div>
            <div className="absolute top-6 right-6 text-7xl font-display text-primary-foreground/10">
              {player.age}
            </div>
          </div>

          <div className="p-8 space-y-4">
            {player.city && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} /> {player.city}
              </div>
            )}
            <div className="flex gap-6">
              {player.height && <div className="flex items-center gap-2 text-muted-foreground"><Ruler size={16} /> {player.height}</div>}
              {player.weight && <div className="flex items-center gap-2 text-muted-foreground"><Weight size={16} /> {player.weight}</div>}
            </div>
            {player.club && (
              <div className="text-foreground font-medium">{player.club}</div>
            )}

            {/* Video placeholder */}
            <div className="mt-6 aspect-video rounded-xl bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-2">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-lime border-b-[10px] border-b-transparent ml-1" />
                </div>
                <p className="text-muted-foreground text-sm">Video próximamente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form for clubs */}
        {user && !isOwner && (
          <div className="mt-8 bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-display text-foreground mb-4">CONTACTAR A LA FAMILIA</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribí tu mensaje..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime outline-none resize-none h-24"
            />
            <button
              onClick={sendContactRequest}
              disabled={sending || !message.trim()}
              className="mt-3 flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 disabled:opacity-50"
            >
              <Send size={16} /> {sending ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </div>
        )}

        {!user && (
          <div className="mt-8 bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-muted-foreground mb-3">¿Querés contactar a este jugador?</p>
            <Link to="/auth?type=club" className="text-lime font-semibold hover:underline">
              Iniciá sesión como Club / Scout →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
