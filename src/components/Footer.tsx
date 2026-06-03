import { Mail, Instagram, Twitter, Youtube, Copy, Check } from "lucide-react";
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
      </DialogContent>
    </Dialog>
  );
};

const ChildProtectionDialog = ({ trigger }: { trigger: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display tracking-wider">Protección de Menores</DialogTitle>
        <DialogDescription>
          Declaración de Estándares Contra la Explotación y Abuso Sexual Infantil (EASI)
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 text-sm text-foreground font-body leading-relaxed">
        <p>
          PASEGOL se compromete fehacientemente a desarrollar un espacio seguro y protegido para todos los usuarios, especialmente para los menores de edad. Proteger a los menores de cualquier explotación y abuso sexual es nuestro principal objetivo. PASEGOL es un espacio donde puedan interactuar de manera segura y positiva.
        </p>

        <div>
          <h4 className="font-semibold text-base mb-2">Principios Fundamentales</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Educación:</strong> Promovemos la educación y la concienciación sobre los riesgos de la explotación y el abuso sexual infantil entre nuestros usuarios y empleados. Creemos que un usuario bien informado es la mejor defensa contra el abuso.</li>
            <li><strong>Seguridad y Protección Infantil:</strong> La seguridad de los niños es nuestra máxima prioridad. Implementamos medidas para prevenir y detectar cualquier actividad que ponga en riesgo a los menores.</li>
            <li><strong>Tolerancia Cero:</strong> Adoptamos una política de tolerancia cero hacia cualquier forma de explotación y abuso sexual infantil. Cualquier comportamiento sospechoso será investigado y abordado de inmediato.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Responsabilidades de los Usuarios</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Uso Responsable:</strong> Todos los usuarios de PASEGOL deben utilizar la plataforma de manera responsable y respetar los derechos y la dignidad de los demás.</li>
            <li><strong>Denuncia de Incidentes:</strong> Instamos a nuestros usuarios a denunciar cualquier contenido o comportamiento sospechoso a través de nuestras herramientas de reporte. La colaboración de la comunidad es esencial para mantener un entorno seguro.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Compromisos de PASEGOL</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Detección y Prevención:</strong> Utilizamos tecnologías avanzadas para monitorear y detectar cualquier contenido o comportamiento inapropiado. Contamos con un equipo especializado en seguridad que actúa rápidamente ante cualquier incidente.</li>
            <li><strong>Colaboración con Autoridades:</strong> Trabajamos en colaboración con autoridades y organizaciones especializadas en la protección infantil para garantizar una respuesta efectiva ante cualquier caso de abuso o explotación.</li>
            <li><strong>Apoyo a las Víctimas:</strong> Brindamos apoyo y recursos a las víctimas de explotación y abuso sexual infantil. Facilitamos el acceso a servicios de asistencia y orientación para garantizar su bienestar y recuperación.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-base mb-2">Evaluación y Mejora Continua</h4>
          <p>
            Nos comprometemos a revisar y mejorar continuamente nuestras políticas y procedimientos para garantizar que estamos a la vanguardia en la lucha contra la explotación y el abuso sexual infantil. Escuchamos a nuestra comunidad y adoptamos las mejores prácticas para ofrecer un entorno seguro y confiable.
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

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
              <a
                href="https://www.youtube.com/@pasegol-c5t"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-lg bg-navy-light flex items-center justify-center text-primary-foreground/50 hover:text-lime hover:bg-lime/10 transition-colors"
              >
                <Youtube size={18} />
              </a>
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
              {["Términos de Uso", "Política de Privacidad"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">{l}</a>
                </li>
              ))}
              <li>
                <ChildProtectionDialog
                  trigger={
                    <button
                      type="button"
                      className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body text-left"
                    >
                      Protección de Menores
                    </button>
                  }
                />
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/50 hover:text-lime transition-colors font-body">Cookies</a>
              </li>
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
