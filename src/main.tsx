import { initClarity } from "./lib/clarity";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Microsoft Clarity (safely checks for PROD and avoids duplicates)
if (typeof window !== "undefined") {
  initClarity("xabaqvuhjk");
}

createRoot(document.getElementById("root")!).render(<App />);
