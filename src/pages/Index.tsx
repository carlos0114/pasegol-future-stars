import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import PlayerShowcase from "@/components/PlayerShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return <div className="min-h-screen bg-navy" />;
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <AdBanner />
      <PlayerShowcase />
      <Benefits />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
