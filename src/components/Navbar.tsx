import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-3xl font-display tracking-wider text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Cómo Funciona
          </a>
          <a href="#beneficios" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Beneficios
          </a>
          <a href="#clubes" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Para Clubes
          </a>
          <a href="/auth" className="px-5 py-2 rounded-lg border border-primary/30 text-primary-foreground font-semibold text-sm hover:bg-primary/10 transition-colors">
            Iniciar Sesión
          </a>
          <a href="/auth?mode=register" className="px-5 py-2 rounded-lg bg-cta-gradient text-navy font-semibold text-sm hover:opacity-90 transition-opacity">
            Crear Perfil Gratis
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy border-t border-primary/10 px-4 py-4 space-y-3 animate-fade-in">
          <a href="#como-funciona" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground">Cómo Funciona</a>
          <a href="#beneficios" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground">Beneficios</a>
          <a href="#clubes" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground">Para Clubes</a>
          <a href="/auth?mode=register" className="block w-full px-5 py-2 rounded-lg bg-cta-gradient text-navy font-semibold text-sm text-center">
            Crear Perfil Gratis
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
