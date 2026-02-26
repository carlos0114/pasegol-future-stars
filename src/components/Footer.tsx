import { Mail, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy border-t border-primary/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-3xl font-display tracking-wider text-primary-foreground">
              PASE<span className="text-gradient-lime">GOL</span>
            </span>
            <p className="mt-4 text-sm text-primary-foreground/50 font-body leading-relaxed">
              La mayor plataforma de visibilidad para fútbol juvenil en Latinoamérica.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-navy-light flex items-center justify-center text-primary-foreground/50 hover:text-lime hover:bg-lime/10 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4 font-body uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-2.5">
              {["Crear Perfil", "Buscar Talento", "Cómo Funciona", "Precios"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4 font-body uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-2.5">
              {["Centro de Ayuda", "Contacto", "Seguridad", "Privacidad"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4 font-body uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {["Términos de Uso", "Política de Privacidad", "Protección de Menores", "Cookies"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/30 font-body">
            © 2026 PaseGol. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/30 font-body">
            Comprometidos con la seguridad y protección de menores 🛡️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
