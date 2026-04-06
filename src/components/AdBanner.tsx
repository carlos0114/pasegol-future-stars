import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  position: string;
}

const AdBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("ad_banners")
        .select("id, title, image_url, link_url, position")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (data) setBanners(data as Banner[]);
    };
    fetchBanners();
  }, []);

  const horizontalBanners = banners.filter(b => b.position === "horizontal");

  if (horizontalBanners.length === 0) {
    return (
      <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20">
              <Megaphone size={14} className="text-lime" />
              <span className="text-sm font-medium text-lime">Sponsors Oficiales</span>
            </div>
          </div>
          <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-card/50 border border-border/30 min-h-[100px] flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/40">Espacio publicitario</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 max-w-[80px] bg-border/50" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium">Sponsors</span>
          <div className="h-px flex-1 max-w-[80px] bg-border/50" />
        </div>
        {horizontalBanners.map(banner => (
          <div key={banner.id} className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden mb-4 last:mb-0">
            {banner.link_url ? (
              <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-auto object-cover rounded-xl" loading="lazy" />
                ) : (
                  <div className="w-full h-[90px] bg-card/50 border border-border/30 rounded-xl flex items-center justify-center">
                    <span className="text-foreground font-medium">{banner.title}</span>
                  </div>
                )}
              </a>
            ) : banner.image_url ? (
              <img src={banner.image_url} alt={banner.title} className="w-full h-auto object-cover rounded-xl" loading="lazy" />
            ) : (
              <div className="w-full h-[90px] bg-card/50 border border-border/30 rounded-xl flex items-center justify-center">
                <span className="text-foreground font-medium">{banner.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdBanner;
