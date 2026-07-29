import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImg from "@/assets/movement-hero.jpg";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Ingresá un correo válido" })
  .max(255, { message: "El correo es demasiado largo" });

const Move = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [joined, setJoined] = useState(false);

  const loadCount = async () => {
    const { data, error } = await supabase
      .from("movement_stats")
      .select("supporters_count")
      .maybeSingle();
    if (!error && data) setCount(Number(data.supporters_count));
  };

  useEffect(() => {
    loadCount();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Correo inválido", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("movement_supporters")
      .insert({ email: parsed.data.toLowerCase() });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Ya estás en el movimiento",
          description: "Este correo ya forma parte del movimiento.",
        });
        setJoined(true);
        return;
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "¡Bienvenido/a!",
      description: "¡Gracias por sumarte al Movimiento PaseGol!",
    });
    setJoined(true);
    setEmail("");
    loadCount();
  };

  return (
    <>
      <Helmet>
        <title>Movimiento PaseGol | No a la violencia en el fútbol</title>
        <meta
          name="description"
          content="Sumate al movimiento que promueve el respeto, la inclusión y la no violencia en el fútbol."
        />
        <link rel="canonical" href="https://www.pasegol.com.uy/move" />
        <meta property="og:title" content="Movimiento PaseGol | No a la violencia en el fútbol" />
        <meta
          property="og:description"
          content="Sumate al movimiento que promueve el respeto, la inclusión y la no violencia en el fútbol."
        />
        <meta property="og:url" content="https://www.pasegol.com.uy/move" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-20">
          {/* Hero image */}
          <div className="relative w-full h-[45vh] min-h-[320px] max-h-[520px] overflow-hidden">
            <img
              src={heroImg}
              alt="Jóvenes futbolistas unidos por el respeto y la no violencia"
              width={1536}
              height={1024}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-background" />
            <div className="absolute inset-0 flex items-end justify-center pb-8 px-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-lime/20 border border-lime/40 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-lime">
                <Heart size={14} /> Movimiento PaseGol
              </span>
            </div>
          </div>

          <section className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl text-center leading-tight text-foreground tracking-wider">
              ¿Estás de acuerdo con decir{" "}
              <span className="text-gradient-lime">NO</span> a la violencia en el fútbol?
            </h1>

            <p className="mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              Sumate al Movimiento PaseGol y ayudanos a construir un fútbol con más
              respeto, inclusión y valores para todos.
            </p>

            {/* Counter */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-card px-6 py-4 shadow-sm">
                <Users className="text-lime" size={24} />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Personas que ya se sumaron
                  </p>
                  <p className="text-3xl font-display text-foreground tracking-wider">
                    {count === null ? "—" : count.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleJoin}
              className="mt-10 mx-auto max-w-md bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm"
            >
              <div>
                <label htmlFor="movement-email" className="block text-sm font-medium text-foreground mb-2">
                  Correo electrónico
                </label>
                <Input
                  id="movement-email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sumándote..." : "Me sumo al movimiento"}
              </Button>
              {joined && (
                <p className="text-sm text-center text-lime">
                  ¡Gracias por ser parte del cambio! 💚
                </p>
              )}
            </form>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Move;
