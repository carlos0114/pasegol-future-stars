import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, GripVertical, ExternalLink, Shield, Mail } from "lucide-react";

interface ContactMessage {
  id: string;
  message: string;
  status: string;
  created_at: string;
  player_id: string;
  sender_profile_id: string;
  player_name?: string;
  sender_name?: string;
  sender_email?: string;
}

interface AdBanner {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  position: string;
  is_active: boolean;
  display_order: number;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // New banner form
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newPosition, setNewPosition] = useState("horizontal");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAdminRole();
  }, [user, loading]);

  const checkAdminRole = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!data) {
      navigate("/dashboard");
      toast({ title: "Acceso denegado", description: "No tenés permisos de administrador", variant: "destructive" });
      return;
    }
    setIsAdmin(true);
    setChecking(false);
    fetchBanners();
  };

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from("ad_banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) setBanners(data as AdBanner[]);
    setLoadingBanners(false);
  };

  const createBanner = async () => {
    if (!newTitle.trim()) {
      toast({ title: "Error", description: "El título es obligatorio", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("ad_banners").insert({
      title: newTitle,
      image_url: newImageUrl || null,
      link_url: newLinkUrl || null,
      position: newPosition,
      display_order: banners.length,
      created_by: user!.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Banner creado" });
    setNewTitle("");
    setNewImageUrl("");
    setNewLinkUrl("");
    setShowForm(false);
    fetchBanners();
  };

  const toggleBanner = async (id: string, currentState: boolean) => {
    await supabase.from("ad_banners").update({ is_active: !currentState }).eq("id", id);
    setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: !currentState } : b));
  };

  const deleteBanner = async (id: string) => {
    await supabase.from("ad_banners").delete().eq("id", id);
    setBanners(prev => prev.filter(b => b.id !== id));
    toast({ title: "Banner eliminado" });
  };

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Verificando permisos...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-display text-foreground">Panel de Administración</h1>
        </div>

        {/* Ad Banners Management */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Publicidad</h2>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus size={16} />
              Nuevo Banner
            </Button>
          </div>

          {/* Create form */}
          {showForm && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ej: Sponsor Nike" />
              </div>
              <div>
                <Label>URL de la imagen</Label>
                <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Enlace (al hacer clic)</Label>
                <Input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Orientación</Label>
                <select
                  value={newPosition}
                  onChange={e => setNewPosition(e.target.value)}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="horizontal">Horizontal (728×90)</option>
                  <option value="vertical">Vertical (160×600)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createBanner}>Guardar</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          {/* Banner list */}
          {loadingBanners ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : banners.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay banners todavía. Creá uno nuevo.</p>
          ) : (
            <div className="space-y-3">
              {banners.map(banner => (
                <div key={banner.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background">
                  <GripVertical size={16} className="text-muted-foreground" />

                  {/* Preview */}
                  {banner.image_url && (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-12 w-20 object-cover rounded border border-border"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{banner.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {banner.position === "horizontal" ? "Horizontal" : "Vertical"} •{" "}
                      {banner.is_active ? "Activo" : "Inactivo"}
                    </p>
                  </div>

                  {banner.link_url && (
                    <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink size={16} />
                    </a>
                  )}

                  <Switch
                    checked={banner.is_active}
                    onCheckedChange={() => toggleBanner(banner.id, banner.is_active)}
                  />

                  <Button variant="ghost" size="icon" onClick={() => deleteBanner(banner.id)} className="text-destructive hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
