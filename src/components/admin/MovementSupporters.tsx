import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Heart, Trash2 } from "lucide-react";

interface Supporter {
  id: string;
  email: string;
  created_at: string;
}

const MovementSupporters = () => {
  const { toast } = useToast();
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("movement_supporters")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSupporters((data as Supporter[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const exportCsv = () => {
    const header = "email,created_at\n";
    const rows = supporters
      .map((s) => `"${s.email.replace(/"/g, '""')}","${s.created_at}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimiento-pasegol-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este correo del movimiento?")) return;
    const { error } = await supabase.from("movement_supporters").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSupporters((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Eliminado" });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-lime" />
          <h2 className="text-xl font-semibold text-foreground">
            Movimiento PaseGol
          </h2>
          <span className="text-sm text-muted-foreground">
            ({supporters.length} adherentes)
          </span>
        </div>
        <Button onClick={exportCsv} disabled={!supporters.length} className="gap-2">
          <Download size={16} /> Exportar CSV
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : supporters.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Todavía no hay adherentes al movimiento.
        </p>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {supporters.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 p-3 border border-border rounded-lg bg-background"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {s.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleString("es-AR")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(s.id)}
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovementSupporters;
