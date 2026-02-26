import { Star, Shield, Globe, TrendingUp, Eye, Users } from "lucide-react";

const playerBenefits = [
  { icon: Star, title: "Perfil profesional", desc: "Muestra tu talento con un perfil que impresiona." },
  { icon: Eye, title: "Visibilidad global", desc: "Sé visto por clubes y scouts de todo el mundo." },
  { icon: Shield, title: "Seguridad ante todo", desc: "Protección especial para menores de edad." },
];

const clubBenefits = [
  { icon: Globe, title: "Talento sin fronteras", desc: "Accede a jugadores de toda Latinoamérica." },
  { icon: TrendingUp, title: "Filtros inteligentes", desc: "Busca por edad, posición, país y más." },
  { icon: Users, title: "Contacto directo", desc: "Comunícate de forma segura con las familias." },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="py-24 bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-lime">Ventajas</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-foreground mt-2">
            BENEFICIOS
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Jugadores */}
          <div>
            <h3 className="text-2xl font-display text-gradient-lime mb-8">PARA JUGADORES</h3>
            <div className="space-y-6">
              {playerBenefits.map((b) => (
                <div key={b.title} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center flex-shrink-0 group-hover:bg-lime/20 transition-colors">
                    <b.icon size={22} className="text-lime" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary-foreground mb-1 font-body">{b.title}</h4>
                    <p className="text-primary-foreground/60 text-sm font-body">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clubes */}
          <div id="clubes">
            <h3 className="text-2xl font-display text-gradient-gold mb-8">PARA CLUBES</h3>
            <div className="space-y-6">
              {clubBenefits.map((b) => (
                <div key={b.title} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <b.icon size={22} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary-foreground mb-1 font-body">{b.title}</h4>
                    <p className="text-primary-foreground/60 text-sm font-body">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
