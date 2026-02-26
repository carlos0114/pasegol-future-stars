import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Ruler, Weight, ArrowLeft, Send, Upload, Loader2, Trash2 } from "lucide-react";
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
  photo_url: string | null;
  profile_id: string;
}

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    const { data } = await supabase.from("players").select("*").eq("id", id!).single();
    if (data) setPlayer(data);
    setLoading(false);
  };

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

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    setUploadingPhoto(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${player.id}.${fileExt}`;

    if (player.photo_url) {
      await supabase.storage.from("player-photos").remove([player.photo_url]);
    }

    const { error: uploadError } = await supabase.storage
      .from("player-photos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Error al subir la foto: " + uploadError.message);
      setUploadingPhoto(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("players")
      .update({ photo_url: filePath })
      .eq("id", player.id);

    if (updateError) {
      toast.error("Error al guardar la foto");
    } else {
      toast.success("¡Foto subida con éxito!");
      setPlayer({ ...player, photo_url: filePath });
    }
    setUploadingPhoto(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !player) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Solo se permiten archivos de video");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("El video no puede superar los 50MB");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${player.id}.${fileExt}`;

    // Delete old video if exists
    if (player.video_url) {
      await supabase.storage.from("player-videos").remove([player.video_url]);
    }

    const { error: uploadError } = await supabase.storage
      .from("player-videos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Error al subir el video: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("players")
      .update({ video_url: filePath })
      .eq("id", player.id);

    if (updateError) {
      toast.error("Error al guardar la referencia del video");
    } else {
      toast.success("¡Video subido con éxito!");
      setPlayer({ ...player, video_url: filePath });
    }
    setUploading(false);
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
        <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-card">
          <div className="bg-hero-gradient p-8 relative">
            <div className="relative group">
              {player.photo_url ? (
                <img
                  src={getPhotoPublicUrl(player.photo_url)}
                  alt={player.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-lime/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-navy-light border-2 border-lime/30 flex items-center justify-center text-3xl font-display text-lime">
                  {player.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              {isOwner && (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 w-20 h-20 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : (
                    <Upload size={20} className="text-white" />
                  )}
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
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

            {/* Video section */}
            <div className="mt-6">
              {player.video_url ? (
                <div className="space-y-3">
                  <video
                    src={getVideoPublicUrl(player.video_url)}
                    controls
                    className="w-full aspect-video rounded-xl bg-muted object-cover"
                  />
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Cambiar video
                      </button>
                      <button
                        onClick={handleDeleteVideo}
                        disabled={uploading}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                  {isOwner ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {uploading ? (
                        <Loader2 size={32} className="animate-spin text-lime" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center">
                          <Upload size={24} className="text-lime" />
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {uploading ? "Subiendo video..." : "Subir video del jugador"}
                      </span>
                      <span className="text-xs text-muted-foreground">Máximo 50MB • MP4, MOV, WebM</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-2">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-lime border-b-[10px] border-b-transparent ml-1" />
                      </div>
                      <p className="text-muted-foreground text-sm">Sin video disponible</p>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
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
