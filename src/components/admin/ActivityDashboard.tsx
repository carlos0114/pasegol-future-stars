import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Users, Building2, Search, Video, Activity, ExternalLink, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  actor_name: string | null;
  actor_email: string | null;
  account_type: string | null;
  country: string | null;
  target_url: string | null;
  video_url: string | null;
  message: string | null;
  created_at: string;
}

interface Stats {
  players: number;
  clubs: number;
  scouts: number;
  videos: number;
}

const typeLabels: Record<string, { label: string; color: string; icon: any }> = {
  new_player: { label: "Nuevo jugador", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: Users },
  new_club: { label: "Nuevo club", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: Building2 },
  new_scout: { label: "Nuevo scout", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: Search },
  new_video: { label: "Nuevo video", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: Video },
  new_contact_request: { label: "Solicitud de contacto", color: "bg-pink-500/10 text-pink-400 border-pink-500/30", icon: MessageSquare },
};

const ActivityDashboard = () => {
  const [stats, setStats] = useState<Stats>({ players: 0, clubs: 0, scouts: 0, videos: 0 });
  const [activity, setActivity] = useState<Notification[]>([]);
  const [recentVideos, setRecentVideos] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [playersCount, clubsCount, scoutsCount, videosCount, recentActivity, videos] = await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("clubs").select("id", { count: "exact", head: true }),
      supabase.from("scouts").select("id", { count: "exact", head: true }),
      (supabase as any).from("admin_notifications").select("id", { count: "exact", head: true }).eq("type", "new_video"),
      (supabase as any).from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(20),
      (supabase as any).from("admin_notifications").select("*").eq("type", "new_video").order("created_at", { ascending: false }).limit(6),
    ]);

    setStats({
      players: playersCount.count || 0,
      clubs: clubsCount.count || 0,
      scouts: scoutsCount.count || 0,
      videos: videosCount.count || 0,
    });
    setActivity((recentActivity.data || []) as Notification[]);
    setRecentVideos((videos.data || []) as Notification[]);
    setLoading(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Jugadores", value: stats.players, icon: Users, color: "text-emerald-400" },
          { label: "Clubes", value: stats.clubs, icon: Building2, color: "text-blue-400" },
          { label: "Scouts", value: stats.scouts, icon: Search, color: "text-purple-400" },
          { label: "Videos subidos", value: stats.videos, icon: Video, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="text-3xl font-display text-foreground">{loading ? "..." : s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent videos */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-foreground">Últimos videos subidos</h2>
        </div>
        {recentVideos.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">Aún no hay videos.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentVideos.map((v) => (
              <div key={v.id} className="border border-border rounded-lg p-3 bg-background">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground truncate">{v.actor_name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(v.created_at)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{v.country || "—"}</p>
                <div className="flex gap-2">
                  {v.target_url && (
                    <Link to={v.target_url} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      Ver perfil <ExternalLink size={12} />
                    </Link>
                  )}
                  {v.video_url && (
                    <a href={v.video_url} target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1">
                      Video <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Actividad reciente</h2>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : activity.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">Sin actividad todavía.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((n) => {
              const meta = typeLabels[n.type] || { label: n.type, color: "bg-muted text-muted-foreground", icon: Activity };
              const Icon = meta.icon;
              return (
                <div key={n.id} className="flex items-start gap-3 p-3 border border-border rounded-lg bg-background">
                  <div className={`shrink-0 mt-0.5 rounded-md border px-2 py-1 text-xs inline-flex items-center gap-1 ${meta.color}`}>
                    <Icon size={12} /> {meta.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      <span className="font-medium">{n.actor_name || "Usuario"}</span>
                      {n.account_type && <span className="text-muted-foreground"> · {n.account_type}</span>}
                      {n.country && <span className="text-muted-foreground"> · {n.country}</span>}
                    </p>
                    {n.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{formatDate(n.created_at)}</span>
                      {n.target_url && (
                        <Link to={n.target_url} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                          Abrir <ExternalLink size={11} />
                        </Link>
                      )}
                      {n.video_url && (
                        <a href={n.video_url} target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1">
                          Video <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDashboard;
