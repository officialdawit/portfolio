import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { apiPlugin } from "./vite-api-plugin";

const VIRTUAL = "virtual:app";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // API handlers read process.env; Vite only populates import.meta.env by default.
  Object.assign(process.env, env);

  const target = env.VITE_TARGET === "admin" ? "admin" : "public";
  const entry = resolve(
    process.cwd(),
    target === "admin" ? "src/AppAdmin.tsx" : "src/AppPublic.tsx",
  );

  return {
    plugins: [
      {
        // One target's routes are resolved; the other's never enter the graph.
        name: "app-target",
        resolveId: (id) => (id === VIRTUAL ? entry : null),
      },
      react(),
      tailwindcss(),
      apiPlugin(),
    ],
    define: {
      __APP_TARGET__: JSON.stringify(target),
    },
  };
});
