import { Mail, Instagram, Twitter, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const CONTACT_EMAIL = "pasegolcom@gmail.com";

const ContactEmailDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast({ title: "Correo copiado", description: CONTACT_EMAIL });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "No se pudo copiar", description: CONTACT_EMAIL, variant: "destructive" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">Contactanos</DialogTitle>
          <DialogDescription>
            Escribinos a nuestro correo oficial. Podés copiarlo o abrirlo directamente en tu app de correo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-lg border border-primary/10 bg-navy-light px-4 py-3">
          <Mail className="text-lime shrink-0" size={18} />
          <span className="font-body text-primary-foreground flex-1 break-all">{CONTACT_EMAIL}</span>
          <Button size="icon" variant="ghost" onClick={copyEmail} aria-label="Copiar correo">
            {copied ? <Check size={18} className="text-lime" /> : <Copy size={18} />}
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="flex-1">
            <a href={`mailto:${CONTACT_EMAIL}`}>Abrir app de correo</a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Gmail
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-navy-light flex items-center justify-center text-primary-foreground/50 hover:text-lime hover:bg-lime/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-navy-light flex items-center justify-center text-primary-foreground/50 hover:text-lime hover:bg-lime/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <ContactEmailDialog
                trigger={
                  <button
                    type="button"
                    aria-label="Correo"
                    className="w-10 h-10 rounded-lg bg-navy-light flex items-center justify-center text-primary-foreground/50 hover:text-lime hover:bg-lime/10 transition-colors"
                  >
                    <Mail size={18} />
                  </button>
                }
              />
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
              <li>
                <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">Centro de Ayuda</a>
              </li>
              <li>
                <ContactEmailDialog
                  trigger={
                    <button
                      type="button"
                      className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body"
                    >
                      Contacto
                    </button>
                  }
                />
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">Seguridad</a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">Privacidad</a>
              </li>
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
