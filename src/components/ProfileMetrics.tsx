import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Eye, Send, Bookmark } from "lucide-react";

interface Metrics {
  video_views: number;
  contact_clicks: number;
  saves: number;
}

interface ProfileMetricsProps {
  playerId: string;
  /** Cambiar este valor fuerza una recarga de las métricas */
  refreshKey?: number;
}

const StatCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  hint: string;
}) => (
  <div className="rounded-xl bg-muted/50 p-4">
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-lime">{icon}</span>
      <span className="text-xs uppercase tracking-wider">{label}</span>
    </div>
    <p className="mt-1 text-3xl font-display text-foreground">{value ?? "—"}</p>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </div>
);

const ProfileMetrics = ({ playerId, refreshKey = 0 }: ProfileMetricsProps) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any).rpc("get_player_metrics", { _player_id: playerId });
    if (error) console.error("Error cargando métricas del perfil:", error);
    const row = Array.isArray(data) ? data[0] : data;
    if (row) {
      setMetrics({
        video_views: Number(row.video_views ?? 0),
        contact_clicks: Number(row.contact_clicks ?? 0),
        saves: Number(row.saves ?? 0),
      });
    } else {
      setMetrics(null);
    }
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading || !metrics) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-lime" /> RENDIMIENTO DEL PERFIL
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<Eye size={16} />} label="Vistas del video" value={metrics.video_views} hint="Reproducciones del video destacado" />
        <StatCard icon={<Send size={16} />} label="Clics en contactar" value={metrics.contact_clicks} hint="Intentos de contacto de clubes y cazatalentos" />
        <StatCard icon={<Bookmark size={16} />} label="Guardados" value={metrics.saves} hint="Veces guardado en favoritos" />
      </div>
    </div>
  );
};

export default ProfileMetrics;
