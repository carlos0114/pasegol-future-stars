import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const positions = ["Portero", "Defensa", "Mediocampista", "Delantero"];
const feet = ["Derecha", "Izquierda", "Ambidiestro"];

const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-lime outline-none text-sm";
const labelClass = "block text-sm font-medium text-muted-foreground mb-1";

const CreatePlayer = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", age: "", birth_year: "", position: "", secondary_position: "",
    city: "", height: "", weight: "", club: "", category: "",
    preferred_foot: "Derecha", years_playing: "", achievements: "",
    speed: 50, technique: 50, game_vision: 50, finishing: 50, endurance: 50,
    parent_name: "", parent_email: "", parent_phone: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=register");
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSlider = (name: string, value: number[]) => {
    setForm((prev) => ({ ...prev, [name]: value[0] }));
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
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      preferred_foot: form.preferred_foot,
      secondary_position: form.secondary_position || null,
      category: form.category || null,
      years_playing: form.years_playing ? parseInt(form.years_playing) : null,
      achievements: form.achievements || null,
      speed: form.speed,
      technique: form.technique,
      game_vision: form.game_vision,
      finishing: form.finishing,
      endurance: form.endurance,
      parent_name: form.parent_name || null,
      parent_email: form.parent_email || null,
      parent_phone: form.parent_phone || null,
    });

    if (error) toast.error("Error al crear el perfil: " + error.message);
    else { toast.success("¡Jugador creado con éxito!"); navigate("/dashboard"); }
    setSubmitting(false);
  };

  const SkillSlider = ({ name, label, value }: { name: string; label: string; value: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => handleSlider(name, v)} max={100} step={1} className="[&_[role=slider]]:border-lime [&_[role=slider]]:bg-lime [&_.bg-primary]:bg-lime" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy border-b border-lime/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-primary-foreground/50 hover:text-primary-foreground"><ArrowLeft size={20} /></Link>
          <span className="text-2xl font-display text-primary-foreground">PASE<span className="text-gradient-lime">GOL</span></span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-display text-foreground mb-1">CREAR JUGADOR</h1>
        <p className="text-muted-foreground text-sm mb-8">Completá los datos del jugador para que pueda ser descubierto por clubes y scouts.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Data */}
          <section>
            <h2 className="text-lg font-display text-foreground mb-4 border-b border-border pb-2">DATOS PERSONALES</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre completo *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Nombre del jugador" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Edad *</label>
                  <input name="age" type="number" min="5" max="15" value={form.age} onChange={handleChange} required className={inputClass} placeholder="5-15" />
                </div>
                <div>
                  <label className={labelClass}>Año nacimiento</label>
                  <input name="birth_year" type="number" min="2010" max="2021" value={form.birth_year} onChange={handleChange} className={inputClass} placeholder="2015" />
                </div>
                <div>
                  <label className={labelClass}>Pierna hábil</label>
                  <select name="preferred_foot" value={form.preferred_foot} onChange={handleChange} className={inputClass}>
                    {feet.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Altura</label>
                  <input name="height" value={form.height} onChange={handleChange} className={inputClass} placeholder="Ej: 1.52m" />
                </div>
                <div>
                  <label className={labelClass}>Peso</label>
                  <input name="weight" value={form.weight} onChange={handleChange} className={inputClass} placeholder="Ej: 42kg" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Ciudad / País</label>
                <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Ej: Buenos Aires, Argentina" />
              </div>
            </div>
          </section>

          {/* Sports Info */}
          <section>
            <h2 className="text-lg font-display text-foreground mb-4 border-b border-border pb-2">INFORMACIÓN DEPORTIVA</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Posición principal *</label>
                  <select name="position" value={form.position} onChange={handleChange} required className={inputClass}>
                    <option value="">Seleccionar</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Posición secundaria</label>
                  <select name="secondary_position" value={form.secondary_position} onChange={handleChange} className={inputClass}>
                    <option value="">Ninguna</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Club actual</label>
                  <input name="club" value={form.club} onChange={handleChange} className={inputClass} placeholder="Ej: River Plate Inf." />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="Ej: Sub-12" />
                </div>
                <div>
                  <label className={labelClass}>Años jugando</label>
                  <input name="years_playing" type="number" min="0" max="15" value={form.years_playing} onChange={handleChange} className={inputClass} placeholder="3" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Logros o campeonatos</label>
                <textarea name="achievements" value={form.achievements} onChange={handleChange} className={`${inputClass} resize-none h-20`} placeholder="Ej: Campeón Liga Infantil 2025, Mejor jugador del torneo..." />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-lg font-display text-foreground mb-4 border-b border-border pb-2">PERFIL TÉCNICO</h2>
            <p className="text-xs text-muted-foreground mb-4">Autoevaluación del jugador (0-100)</p>
            <div className="space-y-5 bg-card rounded-xl border border-border p-5">
              <SkillSlider name="speed" label="Velocidad" value={form.speed} />
              <SkillSlider name="technique" label="Técnica" value={form.technique} />
              <SkillSlider name="game_vision" label="Visión de juego" value={form.game_vision} />
              <SkillSlider name="finishing" label="Definición" value={form.finishing} />
              <SkillSlider name="endurance" label="Resistencia" value={form.endurance} />
            </div>
          </section>

          {/* Parent Contact */}
          <section>
            <h2 className="text-lg font-display text-foreground mb-4 border-b border-border pb-2">CONTACTO FAMILIAR</h2>
            <p className="text-xs text-muted-foreground mb-4">Solo visible para clubes y scouts registrados</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre del padre/madre</label>
                <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass} placeholder="Nombre completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass} placeholder="email@ejemplo.com" />
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={inputClass} placeholder="+54 11 1234-5678" />
                </div>
              </div>
            </div>
          </section>

          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? "Creando..." : "Crear Jugador"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlayer;
