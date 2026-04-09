import { MapPin, Ruler, Weight } from "lucide-react";

const players = [
  { name: "Ismael Molina", age: 15, position: "Delantero", city: "Montevideo, UY", height: "1.55m", weight: "53.7kg", club: "Tacurú" },
  { name: "Owen Vargas", age: 9, position: "Delantero", city: "Montevideo, UY", height: "1.20m", weight: "40kg", club: "Tacurú" },
  { name: "Filippo Volpe", age: 8, position: "Defensa", city: "Montevideo, UY", height: "1.15m", weight: "35kg", club: "Tacurú" },
];

const PlayerShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-lime">Talento destacado</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-navy mt-2">
            PERFILES EJEMPLO
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-body">
            Así lucirá el perfil de tu jugador. Profesional, claro y listo para ser descubierto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {players.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              {/* Card header */}
              <div className="bg-hero-gradient p-6 relative">
                <div className="w-16 h-16 rounded-full bg-navy-light border-2 border-lime/30 flex items-center justify-center text-2xl font-display text-lime">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-bold text-primary-foreground font-body">{p.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-lime/20 text-lime text-xs font-semibold">
                    {p.position}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-display text-primary-foreground/10">
                  {p.age}
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} /> {p.city}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Ruler size={14} /> {p.height}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Weight size={14} /> {p.weight}
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">{p.club}</div>

                {/* Video placeholder */}
                <div className="mt-4 aspect-video rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-lime border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>

                <a href="/auth" className="block w-full mt-4 py-2.5 rounded-xl bg-cta-gradient text-navy font-semibold text-sm hover:opacity-90 transition-opacity text-center">
                  Ver Perfil Completo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayerShowcase;
