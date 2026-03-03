import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Building2, Trophy, Phone, ShieldCheck } from "lucide-react";

const CreateClubProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [existingClub, setExistingClub] = useState<string | null>(null);

  const [form, setForm] = useState({
    official_name: "",
    founded_year: "",
    country: "Argentina",
    city: "",
    address: "",
    website: "",
    social_instagram: "",
    social_facebook: "",
    social_twitter: "",
    categories: [] as string[],
    club_type: "formativo",
    league: "",
    competitive_level: "",
    institutional_email: "",
    phone: "",
    contact_person: "",
    contact_role: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?type=club&mode=register");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("clubs").select("id").eq("profile_id", user.id).maybeSingle().then(({ data }) => {
        if (data) setExistingClub(data.id);
      });
    }
  }, [user]);

  useEffect(() => {
    if (existingClub) {
      supabase.from("clubs").select("*").eq("id", existingClub).single().then(({ data }) => {
        if (data) {
          setForm({
            official_name: data.official_name || "",
            founded_year: data.founded_year?.toString() || "",
            country: data.country || "Argentina",
            city: data.city || "",
            address: data.address || "",
            website: data.website || "",
            social_instagram: data.social_instagram || "",
            social_facebook: data.social_facebook || "",
            social_twitter: data.social_twitter || "",
            categories: data.categories || [],
            club_type: data.club_type || "formativo",
            league: data.league || "",
            competitive_level: data.competitive_level || "",
            institutional_email: data.institutional_email || "",
            phone: data.phone || "",
            contact_person: data.contact_person || "",
            contact_role: data.contact_role || "",
          });
        }
      });
    }
  }, [existingClub]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const payload = {
      profile_id: user.id,
      official_name: form.official_name,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      country: form.country,
      city: form.city || null,
      address: form.address || null,
      website: form.website || null,
      social_instagram: form.social_instagram || null,
      social_facebook: form.social_facebook || null,
      social_twitter: form.social_twitter || null,
      categories: form.categories,
      club_type: form.club_type,
      league: form.league || null,
      competitive_level: form.competitive_level || null,
      institutional_email: form.institutional_email || null,
      phone: form.phone || null,
      contact_person: form.contact_person || null,
      contact_role: form.contact_role || null,
    };

    let error;
    if (existingClub) {
      ({ error } = await supabase.from("clubs").update(payload).eq("id", existingClub));
    } else {
      ({ error } = await supabase.from("clubs").insert(payload));
    }

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success(existingClub ? "Perfil actualizado" : "Perfil de club creado");
      navigate("/dashboard");
    }
    setSubmitting(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime focus:border-transparent outline-none text-sm";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1";
  const allCategories = ["Sub 7", "Sub 9", "Sub 10", "Sub 11", "Sub 13", "Sub 15", "Sub 17", "Sub 20", "Primera"];

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
        <h1 className="text-3xl font-display text-foreground mb-2">{existingClub ? "EDITAR" : "CREAR"} PERFIL DE CLUB</h1>
        <p className="text-muted-foreground text-sm mb-8">Completá la información institucional de tu club.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Institutional */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Building2 size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">INFORMACIÓN INSTITUCIONAL</h2></div>
            <div><label className={labelClass}>Nombre oficial del club *</label><input name="official_name" value={form.official_name} onChange={handleChange} required className={inputClass} placeholder="Ej: Club Atlético Tigre" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Año de fundación</label><input name="founded_year" type="number" value={form.founded_year} onChange={handleChange} className={inputClass} placeholder="Ej: 1990" /></div>
              <div><label className={labelClass}>País</label><input name="country" value={form.country} onChange={handleChange} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Ciudad</label><input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="Buenos Aires" /></div>
              <div><label className={labelClass}>Dirección</label><input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Av. Siempreviva 742" /></div>
            </div>
            <div><label className={labelClass}>Sitio web</label><input name="website" value={form.website} onChange={handleChange} className={inputClass} placeholder="https://..." /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelClass}>Instagram</label><input name="social_instagram" value={form.social_instagram} onChange={handleChange} className={inputClass} placeholder="@club" /></div>
              <div><label className={labelClass}>Facebook</label><input name="social_facebook" value={form.social_facebook} onChange={handleChange} className={inputClass} placeholder="facebook.com/club" /></div>
              <div><label className={labelClass}>Twitter / X</label><input name="social_twitter" value={form.social_twitter} onChange={handleChange} className={inputClass} placeholder="@club" /></div>
            </div>
          </section>

          {/* Sports */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Trophy size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">INFORMACIÓN DEPORTIVA</h2></div>
            <div>
              <label className={labelClass}>Categorías que maneja</label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.categories.includes(cat) ? "bg-cta-gradient text-navy" : "border border-border text-muted-foreground hover:border-lime/50"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tipo de institución</label>
                <select name="club_type" value={form.club_type} onChange={handleChange} className={inputClass}>
                  <option value="formativo">Formativo</option>
                  <option value="profesional">Profesional</option>
                  <option value="academia">Academia</option>
                </select>
              </div>
              <div><label className={labelClass}>Liga</label><input name="league" value={form.league} onChange={handleChange} className={inputClass} placeholder="Liga Regional" /></div>
            </div>
            <div><label className={labelClass}>Nivel competitivo</label><input name="competitive_level" value={form.competitive_level} onChange={handleChange} className={inputClass} placeholder="Ej: Nacional, Regional, Local" /></div>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Phone size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">CONTACTO</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Email institucional</label><input name="institutional_email" type="email" value={form.institutional_email} onChange={handleChange} className={inputClass} placeholder="info@club.com" /></div>
              <div><label className={labelClass}>Teléfono</label><input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+54 11..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Persona responsable</label><input name="contact_person" value={form.contact_person} onChange={handleChange} className={inputClass} placeholder="Nombre completo" /></div>
              <div><label className={labelClass}>Cargo</label><input name="contact_role" value={form.contact_role} onChange={handleChange} className={inputClass} placeholder="Director deportivo" /></div>
            </div>
          </section>

          {/* Status info */}
          <section className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck size={20} className="text-lime" /><h2 className="text-xl font-display text-foreground">VERIFICACIÓN</h2></div>
            <p className="text-sm text-muted-foreground">Tu perfil será revisado por un administrador. Una vez aprobado, será visible para scouts y contratistas.</p>
          </section>

          <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? "Guardando..." : existingClub ? "Guardar Cambios" : "Crear Perfil de Club"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClubProfile;
