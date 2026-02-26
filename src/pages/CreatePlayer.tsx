import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const positions = ["Portero", "Defensa", "Mediocampista", "Delantero"];

const CreatePlayer = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    position: "",
    city: "",
    height: "",
    weight: "",
    club: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=register");
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.from("players").insert({
      profile_id: user.id,
      name: form.name,
      age: parseInt(form.age),
      position: form.position,
      city: form.city || null,
      height: form.height || null,
      weight: form.weight || null,
      club: form.club || null,
    });

    if (error) {
      toast.error("Error al crear el perfil: " + error.message);
    } else {
      toast.success("¡Jugador creado con éxito!");
      navigate("/dashboard");
    }
    setSubmitting(false);
  };

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

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-display text-foreground mb-2">CREAR JUGADOR</h1>
        <p className="text-muted-foreground text-sm mb-8">Completá los datos del jugador para que pueda ser descubierto.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre completo *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="Nombre del jugador" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Edad *</label>
              <input name="age" type="number" min="5" max="15" value={form.age} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="5-15" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Posición *</label>
              <select name="position" value={form.position} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none">
                <option value="">Seleccionar</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Ciudad / País</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="Ej: Buenos Aires, AR" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Altura</label>
              <input name="height" value={form.height} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="Ej: 1.52m" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Peso</label>
              <input name="weight" value={form.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="Ej: 42kg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Club actual</label>
            <input name="club" value={form.club} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none" placeholder="Ej: River Plate Inf." />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-6">
            {submitting ? "Creando..." : "Crear Jugador"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlayer;
