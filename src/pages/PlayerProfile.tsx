import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin, Ruler, Weight, ArrowLeft, Send, Upload, Loader2, Trash2,
  Calendar, Footprints, Shield, Trophy, Clock, Star, Play, Image, Mail, Phone, User
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  photo_url: string | null;
  profile_id: string;
  birth_year: number | null;
  preferred_foot: string | null;
  secondary_position: string | null;
  category: string | null;
  years_playing: number | null;
  achievements: string | null;
  speed: number | null;
  technique: number | null;
  game_vision: number | null;
  finishing: number | null;
  endurance: number | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
}

interface Profile {
  user_type: string;
}

const SkillBar = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground font-medium">{icon}{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${value}%`,
          background: value >= 75 ? 'hsl(var(--lime))' : value >= 50 ? 'hsl(var(--gold))' : 'hsl(var(--muted-foreground))',
        }}
      />
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
    <div className="mt-0.5 text-lime">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [senderProfile, setSenderProfile] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const fetchPlayer = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("players").select("*").eq("id", id!).maybeSingle();
    if (data) setPlayer(data as Player);
    setLoading(false);
  }, [id]);

  const fetchSenderProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle();
    if (data) setSenderProfile(data as Profile);
  }, [user]);

  useEffect(() => { fetchPlayer(); }, [fetchPlayer]);
  useEffect(() => { fetchSenderProfile(); }, [fetchSenderProfile]);

  const getVideoPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("player-videos").getPublicUrl(path);
    return data.publicUrl;
  };

  const getPhotoPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("player-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !player) return;
    if (!file.type.startsWith("image/")) { toast.error("Solo se permiten archivos de imagen"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("La imagen no puede superar los 5MB"); return; }

    setUploadingPhoto(true);
    const rawExt = file.name.split(".").pop();
    const fileExt = rawExt ? rawExt.replace(/[^a-zA-Z0-9]/g, "") : "jpg";
    const filePath = `${user.id}/${player.id}.${fileExt}`;

    try {
      // Remove previous photo if exists
      if (player.photo_url) {
        try { await supabase.storage.from("player-photos").remove([player.photo_url]); } catch (remErr) { console.warn("No se pudo borrar la foto anterior:", remErr); }
      }

        const { error: uploadError } = await supabase.storage.from("player-photos").upload(filePath, file, { upsert: true });
        if (uploadError) {
          console.error("Upload error:", uploadError);
          const msg = (uploadError.message || "(sin detalles)");
        if (String(msg).toLowerCase().includes("bucket not found")) {
          toast.error("El bucket 'player-photos' no existe en Supabase. Crealo en Dashboard → Storage → Buckets y marcá acceso público.");
        } else {
          toast.error("Error al subir la foto: " + msg);
        }
        setUploadingPhoto(false);
        return;
      }

      const { error: updateError } = await supabase.from("players").update({ photo_url: filePath }).eq("id", player.id);
      if (updateError) {
        console.error("DB update error:", updateError);
        toast.error("Error al guardar la referencia de la foto: " + (updateError.message || "(sin detalles)"));
      } else {
        toast.success("¡Foto subida!");
        setPlayer({ ...player, photo_url: filePath });
      }
    } catch (err) {
      console.error("Unexpected error al subir foto:", err);
      toast.error("Ocurrió un error inesperado al subir la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !player) return;
    if (!file.type.startsWith("video/")) { toast.error("Solo se permiten archivos de video"); return; }
    if (file.size > 50 * 1024 * 1024) { toast.error("El video no puede superar los 50MB"); return; }

    setUploading(true);
    const rawExt = file.name.split(".").pop();
    const fileExt = rawExt ? rawExt.replace(/[^a-zA-Z0-9]/g, "") : "mp4";
    const filePath = `${user.id}/${player.id}.${fileExt}`;

    try {
      if (player.video_url) {
        try { await supabase.storage.from("player-videos").remove([player.video_url]); } catch (remErr) { console.warn("No se pudo borrar el video anterior:", remErr); }
      }

      const { error: uploadError } = await supabase.storage.from("player-videos").upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error("Upload error:", uploadError);
        const msg = (uploadError.message || "(sin detalles)");
        if (String(msg).toLowerCase().includes("bucket not found")) {
          toast.error("El bucket 'player-videos' no existe en Supabase. Crealo en Dashboard → Storage → Buckets y marcá acceso público.");
        } else {
          toast.error("Error al subir el video: " + msg);
        }
        setUploading(false);
        return;
      }

      const { error: updateError } = await supabase.from("players").update({ video_url: filePath }).eq("id", player.id);
      if (updateError) {
        console.error("DB update error:", updateError);
        toast.error("Error al guardar la referencia del video: " + (updateError.message || "(sin detalles)"));
      } else {
        toast.success("¡Video subido!");
        setPlayer({ ...player, video_url: filePath });
      }
    } catch (err) {
      console.error("Unexpected error al subir video:", err);
      toast.error("Ocurrió un error inesperado al subir el video");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!player?.video_url || !user) return;
    setUploading(true);
    await supabase.storage.from("player-videos").remove([player.video_url]);
    await supabase.from("players").update({ video_url: null }).eq("id", player.id);
    setPlayer({ ...player, video_url: null });
    toast.success("Video eliminado");
    setUploading(false);
  };

  const sendContactRequest = async () => {
    if (!user || !player || !message.trim() || !player.profile_id) {
      toast.error("No se puede enviar el mensaje en este momento");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_requests").insert({
      requester_id: user.id,
      recipient_id: player.profile_id,
      message: message.trim(),
    });
    if (error) {
      console.error("Error al enviar:", error);
      toast.error("Error al enviar mensaje: " + error.message);
    } else {
      toast.success("¡Mensaje enviado a la familia!"); setMessage("");
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Cargando...</div>;
  if (!player) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Jugador no encontrado</div>;

  const isOwner = user?.id === player.profile_id;
  const isClub = senderProfile?.user_type === "club";
  const overallRating = Math.round(((player.speed ?? 50) + (player.technique ?? 50) + (player.game_vision ?? 50) + (player.finishing ?? 50) + (player.endurance ?? 50)) / 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy border-b border-lime/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={isOwner ? "/dashboard" : "/explorar"} className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-2xl font-display text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hero Card */}
        <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-card">
          <div className="bg-hero-gradient p-6 md:p-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full border-2 border-primary-foreground -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-2 border-primary-foreground translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group shrink-0">
                {player.photo_url ? (
                  <img src={getPhotoPublicUrl(player.photo_url)} alt={player.name}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-lime/30 shadow-glow" />
                ) : (
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-navy-light border-2 border-lime/30 flex items-center justify-center text-4xl font-display text-lime">
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                {isOwner && (
                  <button onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto}
                    className="absolute inset-0 w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-navy/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingPhoto ? <Loader2 size={24} className="animate-spin text-lime" /> : <Upload size={24} className="text-lime" />}
                  </button>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" aria-label="Seleccionar foto de perfil" />
              </div>

              {/* Name & badges */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-display text-primary-foreground tracking-wide">{player.name.toUpperCase()}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-lg bg-lime/20 text-lime text-sm font-semibold">{player.position}</span>
                  {player.secondary_position && (
                    <span className="px-3 py-1 rounded-lg bg-gold/20 text-accent text-sm font-semibold">{player.secondary_position}</span>
                  )}
                  {player.preferred_foot && (
                    <span className="px-3 py-1 rounded-lg bg-primary-foreground/10 text-primary-foreground/70 text-sm font-medium">
                      Pie {player.preferred_foot}
                    </span>
                  )}
                </div>
                {player.club && (
                  <p className="mt-2 text-primary-foreground/60 text-sm font-medium flex items-center gap-1.5">
                    <Shield size={14} /> {player.club}
                    {player.category && <span className="text-primary-foreground/40">• {player.category}</span>}
                  </p>
                )}
              </div>

              {/* Overall Rating */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-lime/20 border border-lime/30 flex flex-col items-center justify-center shadow-glow">
                  <span className="text-3xl md:text-4xl font-display text-lime leading-none">{overallRating}</span>
                  <span className="text-[10px] text-lime/70 font-semibold uppercase tracking-wider">Overall</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border bg-muted/30">
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Edad</p>
              <p className="text-lg font-bold text-foreground">{player.age} años</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Altura</p>
              <p className="text-lg font-bold text-foreground">{player.height || "—"}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Peso</p>
              <p className="text-lg font-bold text-foreground">{player.weight || "—"}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Experiencia</p>
              <p className="text-lg font-bold text-foreground">{player.years_playing ? `${player.years_playing} años` : "—"}</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="w-full grid grid-cols-3 bg-card border border-border h-12 rounded-xl">
            <TabsTrigger value="info" className="rounded-lg font-semibold text-sm font-body data-[state=active]:bg-navy data-[state=active]:text-primary-foreground">
              Información
            </TabsTrigger>
            <TabsTrigger value="skills" className="rounded-lg font-semibold text-sm font-body data-[state=active]:bg-navy data-[state=active]:text-primary-foreground">
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg font-semibold text-sm font-body data-[state=active]:bg-navy data-[state=active]:text-primary-foreground">
              Multimedia
            </TabsTrigger>
          </TabsList>

          {/* INFO TAB */}
          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Personal Data */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                <User size={18} className="text-lime" /> DATOS PERSONALES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem icon={<User size={16} />} label="Nombre completo" value={player.name} />
                <InfoItem icon={<Calendar size={16} />} label="Edad" value={`${player.age} años`} />
                {player.birth_year && <InfoItem icon={<Calendar size={16} />} label="Año de nacimiento" value={String(player.birth_year)} />}
                {player.height && <InfoItem icon={<Ruler size={16} />} label="Altura" value={player.height} />}
                {player.weight && <InfoItem icon={<Weight size={16} />} label="Peso" value={player.weight} />}
                {player.city && <InfoItem icon={<MapPin size={16} />} label="Ciudad / País" value={player.city} />}
                {player.preferred_foot && <InfoItem icon={<Footprints size={16} />} label="Pierna hábil" value={player.preferred_foot} />}
              </div>
            </div>

            {/* Sports Info */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                <Shield size={18} className="text-lime" /> INFORMACIÓN DEPORTIVA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem icon={<Star size={16} />} label="Posición principal" value={player.position} />
                {player.secondary_position && <InfoItem icon={<Star size={16} />} label="Posición secundaria" value={player.secondary_position} />}
                {player.club && <InfoItem icon={<Shield size={16} />} label="Club actual" value={player.club} />}
                {player.category && <InfoItem icon={<Trophy size={16} />} label="Categoría" value={player.category} />}
                {player.years_playing != null && <InfoItem icon={<Clock size={16} />} label="Años jugando" value={`${player.years_playing} años`} />}
              </div>
              {player.achievements && (
                <div className="mt-4 p-4 rounded-xl bg-gold/10 border border-gold/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Trophy size={12} className="text-accent" /> Logros y campeonatos</p>
                  <p className="text-sm text-foreground whitespace-pre-line">{player.achievements}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* SKILLS TAB */}
          <TabsContent value="skills" className="mt-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-lg font-display text-foreground mb-6 flex items-center gap-2">
                <Star size={18} className="text-lime" /> PERFIL TÉCNICO
              </h3>
              <div className="space-y-5">
                <SkillBar label="Velocidad" value={player.speed ?? 50} icon={<Footprints size={14} />} />
                <SkillBar label="Técnica" value={player.technique ?? 50} icon={<Star size={14} />} />
                <SkillBar label="Visión de juego" value={player.game_vision ?? 50} icon={<Shield size={14} />} />
                <SkillBar label="Definición" value={player.finishing ?? 50} icon={<Trophy size={14} />} />
                <SkillBar label="Resistencia" value={player.endurance ?? 50} icon={<Clock size={14} />} />
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Puntuación general</p>
                <p className="text-4xl font-display text-lime">{overallRating}</p>
              </div>
            </div>
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="mt-4 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                <Play size={18} className="text-lime" /> VIDEO DESTACADO
              </h3>
              {player.video_url ? (
                <div className="space-y-3">
                  <video src={getVideoPublicUrl(player.video_url)} controls
                    className="w-full rounded-xl bg-muted object-contain" />
                  {isOwner && (
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Cambiar video
                      </button>
                      <button onClick={handleDeleteVideo} disabled={uploading}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors disabled:opacity-50">
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                  {isOwner ? (
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      {uploading ? <Loader2 size={32} className="animate-spin text-lime" /> : (
                        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center"><Upload size={24} className="text-lime" /></div>
                      )}
                      <span className="text-sm font-medium">{uploading ? "Subiendo video..." : "Subir video del jugador"}</span>
                      <span className="text-xs text-muted-foreground">Máximo 50MB • MP4, MOV, WebM</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-2">
                        <Play size={24} className="text-lime" />
                      </div>
                      <p className="text-muted-foreground text-sm">Sin video disponible</p>
                    </div>
                  )}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" aria-label="Seleccionar video del jugador" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact section - only for clubs */}
        {user && !isOwner && isClub && (
          <div className="mt-6 space-y-4">
            {/* Contact info */}
            {(player.parent_name || player.parent_email || player.parent_phone) && (
              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                  <Phone size={18} className="text-lime" /> CONTACTO FAMILIAR
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {player.parent_name && <InfoItem icon={<User size={16} />} label="Padre / Madre" value={player.parent_name} />}
                  {player.parent_email && <InfoItem icon={<Mail size={16} />} label="Email" value={player.parent_email} />}
                  {player.parent_phone && <InfoItem icon={<Phone size={16} />} label="Teléfono" value={player.parent_phone} />}
                </div>
              </div>
            )}

            {/* Message form */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
                <Send size={18} className="text-lime" /> ENVIAR MENSAJE
              </h3>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribí tu mensaje para la familia..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime outline-none resize-none h-28 text-sm" />
              <button onClick={sendContactRequest} disabled={sending || !message.trim()}
                className="mt-3 flex items-center gap-2 px-6 py-3 rounded-xl bg-cta-gradient text-navy font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                <Send size={16} /> {sending ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </div>
          </div>
        )}

        {user && !isOwner && !isClub && (
          <div className="mt-6 bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">Solo los clubes y scouts pueden contactar a los jugadores.</p>
          </div>
        )}

        {!user && (
          <div className="mt-6 bg-card rounded-2xl border border-border p-6 text-center">
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
