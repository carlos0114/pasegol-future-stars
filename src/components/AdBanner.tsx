const AdBanner = () => {
  return (
    <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-card/50 border border-border/30 min-h-[120px] md:min-h-[100px] flex items-center justify-center">
          {/* Replace this div's content with your ad code or image */}
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50 py-4">
            <span className="text-xs uppercase tracking-widest font-medium">Espacio publicitario</span>
            <div className="w-full max-w-[728px] h-[90px] border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center">
              <span className="text-sm text-muted-foreground/40">728 × 90 — Leaderboard</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
