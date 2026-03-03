import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, User, Briefcase, Target, ShieldCheck } from "lucide-react";

const CreateScoutProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [existingScout, setExistingScout] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    professional_id: "",
    country: "Argentina",
    city: "",
    years_experience: "",
    previous_clubs: "",
    player_type_sought: "",
    references_info: "",
    target_age_min: "5",
    target_age_max: "15",
    target_positions: [] as string[],
    target_countries: [] as string[],
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?type=club&mode=register");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("scouts").select("id").eq("profile_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setExistingScout(data.id);
      });
    }
  }, [user]);

  useEffect(() => {
    if (existingScout) {
      supabase.from("scouts").select("*").eq("id", existingScout).single().then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name || "",
            professional_id: data.professional_id || "",
            country: data.country || "Argentina",
            city: data.city || "",
            years_experience: data.years_experience?.toString() || "",
            previous_clubs: (data.previous_clubs || []).join(", "),
            player_type_sought: data.player_type_sought || "",
            references_info: data.references_info || "",
            target_age_min: data.target_age_min?.toString() || "5",
            target_age_max: data.target_age_max?.toString() || "15",
            target_positions: data.target_positions || [],
            target_countries: (data.target_countries || []),
          });
        }
      });
    }
  }, [existingScout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePosition = (pos: string) => {
    setForm((prev) => ({
      ...prev,
      target_positions: prev.target_positions.includes(pos) ? prev.target_positions.filter((p) => p !== pos) : [...prev.target_positions, pos],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const payload = {
      profile_id: user.id,
      full_name: form.full_name,
      professional_id: form.professional_id || null,
      country: form.country,
      city: form.city || null,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      previous_clubs: form.previous_clubs ? form.previous_clubs.split(",").map((s) => s.trim()).filter(Boolean) : [],
      player_type_sought: form.player_type_sought || null,
      references_info: form.references_info || null,
      target_age_min: parseInt(form.target_age_min) || 5,
      target_age_max: parseInt(form.target_age_max) || 15,
      target_positions: form.target_positions,
      target_countries: form.target_countries.length ? form.target_countries : [],
    };

    let error;
    if (existingScout) {
      ({ error } = await supabase.from("scouts").update(payload).eq("id", existingScout));
    } else {
      ({ error } = await supabase.from("scouts").insert(payload));
    }

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success(existingScout ? "Perfil actualizado" : "Perfil de scout creado");
      navigate("/dashboard");
    }
    setSubmitting(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime focus:border-transparent outline-none text-sm";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";
  const positions = ["Arquero", "Defensor", "Lateral", "Mediocampista", "Volante", "Enganche", "Extremo", "Delantero"];

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-primary-foreground">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-primary-foreground/50 hover:text-primary-foreground"><ArrowLeft size={20} /></Link>
          <span className="text-2xl font-display text-primary-foreground">PASE<span className="text-gradient-lime">GOL</span></span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-display text-foreground mb-2">{existingScout ? "EDITAR" : "CREAR"} PERFIL DE SCOUT</h1>
        <p className="text-muted-foreground text-sm mb-8">Completá tu información profesional para buscar talentos.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><User size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">INFORMACIÓN PERSONAL</h2></div>
            <div><label className={labelClass}>Nombre completo *</label><input name="full_name" value={form.full_name} onChange={handleChange} required className={inputClass} placeholder="Tu nombre completo" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>País</label><input name="country" value={form.country} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Ciudad</label><input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Buenos Aires" /></div>
            </div>
            <div><label className={labelClass}>ID profesional (opcional)</label><input name="professional_id" value={form.professional_id} onChange={handleChange} className={inputClass} placeholder="Número de matrícula o ID" /></div>
          </section>

          {/* Experience */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Briefcase size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">EXPERIENCIA</h2></div>
            <div><label className={labelClass}>Años de experiencia</label><input name="years_experience" type="number" value={form.years_experience} onChange={handleChange} className={inputClass} placeholder="Ej: 5" /></div>
            <div><label className={labelClass}>Clubes donde trabajó (separados por coma)</label><input name="previous_clubs" value={form.previous_clubs} onChange={handleChange} className={inputClass} placeholder="Club A, Club B, Club C" /></div>
            <div>
              <label className={labelClass}>Especialidad</label>
              <select name="player_type_sought" value={form.player_type_sought} onChange={handleChange} className={inputClass}>
                <option value="">Seleccioná</option>
                <option value="formativo">Formativo</option>
                <option value="profesional">Profesional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
            <div><label className={labelClass}>Referencias</label><textarea name="references_info" value={form.references_info} onChange={handleChange} rows={3} className={inputClass + " resize-none"} placeholder="Información de contacto de referencias profesionales" /></div>
          </section>

          {/* Search Preferences */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Target size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">PREFERENCIAS DE BÚSQUEDA</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Edad mínima</label><input name="target_age_min" type="number" min="5" max="20" value={form.target_age_min} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Edad máxima</label><input name="target_age_max" type="number" min="5" max="20" value={form.target_age_max} onChange={handleChange} className={inputClass} /></div>
            </div>
            <div>
              <label className={labelClass}>Posiciones de interés</label>
              <div className="flex flex-wrap gap-2">
                {positions.map((pos) => (
                  <button key={pos} type="button" onClick={() => togglePosition(pos)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.target_positions.includes(pos) ? "bg-cta-gradient text-navy" : "border border-border text-muted-foreground hover:border-lime/50"}`}>{pos}</button>
                ))}
              </div>
            </div>
          </section>

          {/* Verification */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">VERIFICACIÓN</h2></div>
            <p className="text-sm text-muted-foreground">Tu perfil será revisado por un administrador antes de poder contactar jugadores.</p>
          </section>

          <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? "Guardando..." : existingScout ? "Guardar Cambios" : "Crear Perfil de Scout"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateScoutProfile;
