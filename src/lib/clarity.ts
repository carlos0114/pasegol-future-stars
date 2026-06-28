declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Initialize Microsoft Clarity on production builds.
 *
 * - Loads the Clarity script once (adds script tag with id 'clarity-script').
 * - No-op on non-browser environments and in non-PROD builds.
 * - Safe to call multiple times; it guards against duplication.
 */
export const initClarity = (projectId = "xabaqvuhjk") => {
  if (typeof window === "undefined") return;

  // Only load in production
  // Vite exposes import.meta.env.PROD
  // If import.meta.env is unavailable at runtime, this will be replaced at build time by Vite.
  if (!import.meta.env.PROD) return;

  try {
    // If clarity already exists or script already injected, do nothing
    if ((window as any).clarity) return;
    if (document.getElementById("clarity-script")) return;

    (function (c, l, a, r, i, t, y) {
      (c as any)[a] = (c as any)[a] || function () {
        ((c as any)[a].q = (c as any)[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      t.id = "clarity-script";
      y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
  } catch (err) {
    // Swallow errors so analytics doesn't break the app
    // eslint-disable-next-line no-console
    console.warn("initClarity failed", err);
  }
};
