import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Resolved at build time by the `virtual:app` alias in vite.config.ts.
// The other target's code is never part of this bundle.
import App from "virtual:app";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
