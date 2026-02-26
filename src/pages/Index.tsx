import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import PlayerShowcase from "@/components/PlayerShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <PlayerShowcase />
      <Benefits />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
