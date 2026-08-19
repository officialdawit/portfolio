import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { apiPlugin } from "./vite-api-plugin";

export default defineConfig(({ mode }) => {
  // API handlers read process.env; Vite only populates import.meta.env by default.
  // Server-side secrets stay out of the client bundle — nothing here is VITE_ prefixed.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
  };
});
