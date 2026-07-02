import { initClarity } from "./lib/clarity";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Initialize Microsoft Clarity (safely checks for PROD and avoids duplicates)
if (typeof window !== "undefined") {
  initClarity("xabaqvuhjk");
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

