// Google Analytics 4 helper
// Measurement ID: G-RHTXZ4BN6Q (loaded via index.html gtag.js)

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = "G-RHTXZ4BN6Q";

export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch (err) {
    console.warn("GA trackEvent failed", err);
  }
};

export const trackPageView = (path: string, title?: string) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", GA_ID, {
        page_path: path,
        page_title: title ?? document.title,
        page_location: window.location.href,
      });
      window.gtag("event", "page_view", {
        page_path: path,
        page_title: title ?? document.title,
        page_location: window.location.href,
      });
    }
  } catch (err) {
    console.warn("GA trackPageView failed", err);
  }
};
