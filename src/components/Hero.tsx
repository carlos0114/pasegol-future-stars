import heroBg from "@/assets/hero-bg.jpg";
import { Play, ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Joven futbolista celebrando un gol en un estadio"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Play size={14} className="text-lime" />
            <span className="text-sm font-medium text-lime">La plataforma #1 de búsqueda de talentos juveniles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display leading-[0.95] text-primary-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            ¿TIENES TALENTO<br />
            PERO NADIE<br />
            <span className="text-gradient-lime">TE DESCUBRE?</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-10 font-body animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Tu camino hacia nuevas oportunidades comienza aquí. PaseGol conecta futbolistas, familias, clubes, academias, representantes y captadores de talento en un entorno seguro y profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <a href="/auth?mode=register" className="group px-8 py-4 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-all animate-pulse-glow flex items-center justify-center gap-2">
              Crear Perfil Gratis
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/auth?mode=register&type=club" className="px-8 py-4 rounded-xl border-2 border-primary-foreground/20 text-primary-foreground font-semibold text-lg hover:border-primary-foreground/40 hover:bg-primary-foreground/5 transition-all flex items-center justify-center gap-2">
              Soy Club / Cazatalento
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-8 md:gap-16 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            {[
              { value: "5K+", label: "Jugadores" },
              { value: "200+", label: "Clubes" },
              { value: "15", label: "Países" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-display text-gradient-lime">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
