import { UserPlus, Video, Search, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "CREA TU PERFIL",
    description: "Registra al jugador con sus datos deportivos, posición, estadísticas y fotos.",
  },
  {
    icon: Video,
    title: "SUBE TUS VIDEOS",
    description: "Comparte las mejores jugadas y momentos destacados en la cancha.",
  },
  {
    icon: Search,
    title: "SÉ DESCUBIERTO",
    description: "Clubes y buscatalentos buscan perfiles filtrados por edad, posición y país.",
  },
  {
    icon: Handshake,
    title: "CONECTA",
    description: "Recibe contacto directo de clubes interesados a través de nuestro sistema seguro.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-lime">Paso a paso</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-navy mt-2">
            ¿CÓMO FUNCIONA?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-6xl font-display text-muted/60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-14 h-14 rounded-xl bg-lime/10 flex items-center justify-center mb-6 group-hover:bg-lime/20 transition-colors">
                <step.icon size={28} className="text-lime" />
              </div>
              <h3 className="text-xl font-display text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
