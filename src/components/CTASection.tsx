import { ChevronRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display text-primary-foreground leading-[0.95]">
            EL PRÓXIMO GRAN<br />
            <span className="text-gradient-lime">JUGADOR</span> PUEDE<br />
            SER TU HIJO
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/60 max-w-xl mx-auto font-body">
            No dejes que el talento pase desapercibido. Crea un perfil gratuito hoy y abre las puertas al futuro deportivo.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth?mode=register" className="group px-8 py-4 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-all animate-pulse-glow flex items-center justify-center gap-2">
              Crear Perfil Gratis
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/auth?mode=register&type=club" className="px-8 py-4 rounded-xl border-2 border-gold/30 text-gold font-semibold text-lg hover:border-gold/50 hover:bg-gold/5 transition-all">
              Soy Club / Buscatalento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
