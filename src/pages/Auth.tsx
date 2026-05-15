import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"player" | "club" | "scout">("player");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "club") setUserType("club");
    if (type === "scout") setUserType("scout");
    const mode = searchParams.get("mode");
    if (mode === "register") setIsLogin(false);
  }, [searchParams]);

  const executeRegister = async () => {
    setShowTerms(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, user_type: userType },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("SignUp error:", error);
        const status = (error as any).status || (error as any).statusCode || null;
        if (status === 500) {
          toast.error("Error del servidor al crear la cuenta. Revisá SMTP y los logs en Supabase Dashboard (Authentication → Settings → SMTP / Logs).");
        } else {
          toast.error(error.message || "Error al crear la cuenta");
        }
        setLoading(false);
        return;
      }

      toast.success("¡Cuenta creada exitosamente!");

      try {
        const userId = (data as any)?.user?.id;
        if (userId) {
          const { error: upsertErr } = await supabase.from("profiles").upsert({ id: userId, full_name: fullName, user_type: userType });
          if (upsertErr) {
            console.warn("Upsert profile failed:", upsertErr);
            if (upsertErr.message?.includes("check") || upsertErr.message?.toLowerCase().includes("constraint")) {
              toast.error("No se pudo crear el perfil automáticamente por una restricción en la base de datos. Revisá el campo 'user_type' en la tabla profiles (permitir 'scout' o cambiar el valor antes de crear).");
            } else if (upsertErr.message?.toLowerCase().includes("permission") || upsertErr.code === "42501") {
              toast.error("No tenés permisos para crear el perfil automáticamente. Iniciá sesión y completá tu perfil manualmente.");
            } else {
              toast.error("No se pudo crear el perfil automáticamente. Completá tu perfil desde el Dashboard después de iniciar sesión.");
            }
          }
        }
      } catch (upsertErr) {
        console.warn("No se pudo crear/actualizar el perfil automáticamente:", upsertErr);
      }

      if (userType === "club") {
        navigate("/perfil-club");
      } else if (userType === "scout") {
        navigate("/perfil-scout");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error?.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta!");
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Auth error:", error);
        toast.error(error?.message || "Error en la autenticación");
      } finally {
        setLoading(false);
      }
    } else {
      setShowTerms(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="block text-center mb-8">
          <span className="text-4xl font-display text-primary-foreground">
            PASE<span className="text-gradient-lime">GOL</span>
          </span>
        </a>

        <div className="bg-card rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-display text-foreground mb-6 text-center">
            {isLogin ? "INICIAR SESIÓN" : "CREAR CUENTA"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime focus:border-transparent outline-none"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de cuenta</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType("player")}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                        userType === "player"
                          ? "bg-cta-gradient text-navy"
                          : "border border-border text-muted-foreground hover:border-lime/50"
                      }`}
                    >
                      ⚽ Jugador / Padre
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("club")}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                        userType === "club"
                          ? "bg-cta-gradient text-navy"
                          : "border border-border text-muted-foreground hover:border-lime/50"
                      }`}
                    >
                      🏟️ Club
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("scout")}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                        userType === "scout"
                          ? "bg-cta-gradient text-navy"
                          : "border border-border text-muted-foreground hover:border-lime/50"
                      }`}
                    >
                      🔍 Scout
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime focus:border-transparent outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-lime focus:border-transparent outline-none"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cta-gradient text-navy font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Cargando..." : isLogin ? "Entrar" : "Crear Cuenta"}
             </button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-lime font-semibold hover:underline"
            >
              {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </p>
        </div>
      </div>
      <AlertDialog open={showTerms} onOpenChange={setShowTerms}>
        <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-display text-foreground">
              Aviso antes del registro
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-foreground">
              <p>
                Al registrarte en PaseGol aceptás nuestros términos, condiciones y políticas de uso.
              </p>
              <p>
                Los datos personales e información proporcionada por los usuarios serán utilizados únicamente para el funcionamiento de la plataforma, incluyendo la creación de perfiles deportivos, publicación de contenido, contacto entre usuarios, clubes, entrenadores y buscatalentos.
              </p>
              <p>
                PaseGol no vende ni comparte información personal con terceros ajenos al funcionamiento de la plataforma.
              </p>
              <p>
                Cada usuario es responsable del contenido, información, fotos y videos que publica en su perfil. PaseGol no se hace responsable por información falsa, inexacta, ofensiva o publicada por los usuarios.
              </p>
              <p>
                En el caso de menores de edad, el registro y uso de la plataforma debe realizarse con autorización y supervisión de un padre, madre o tutor legal.
              </p>
              <p className="font-semibold">
                Al continuar, confirmás que leíste y aceptás estas condiciones.
              </p>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTerms(false)} className="border-border text-foreground hover:bg-muted">
              No acepto
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeRegister}
              className="bg-cta-gradient text-navy font-bold hover:opacity-90"
            >
              Acepto y continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Auth;
