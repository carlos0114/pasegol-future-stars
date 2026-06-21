import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Tracks SPA route changes as GA4 page_view events.
 * Mount once inside <BrowserRouter>.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    // Defer slightly so document.title is updated by the new route
    const t = setTimeout(() => trackPageView(path), 0);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
