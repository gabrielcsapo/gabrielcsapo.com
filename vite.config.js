import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

// The public site is a portfolio. Historical posts remain in the repository,
// but are not routed, indexed, bundled, or emitted as RSS.
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@utils": path.resolve(import.meta.dirname, "src/utils"),
    },
  },
  build: { outDir: "dist" },
});
