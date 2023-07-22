import { defineConfig } from "vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import inspect from "vite-plugin-inspect";
import generateSitemap from "vite-plugin-pages-sitemap";
import url from "@rollup/plugin-url";
import remarkImageImport from "@gabrielcsapo/remark-image-import";
import remarkFrontmatter from "remark-frontmatter";

// we are generating fake data here instead of all the real data
const pages = (options) => {
  const virtualModuleId = "virtual:pages.jsx";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-pages",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `const globals = ${JSON.stringify(
          options.globals || {}
        )}; const routes = {}; export { globals, routes };`;
      }
    },
  };
};

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkImageImport],
      providerImportSource: "@mdx-js/react",
      outputFormat: "program",
    }),
    pages({
      globals: {
        siteName: "Gabriel J. Csapo",
      },
    }),
    react(),
    url(),
    inspect(),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "..", "src", "components"),
      "@utils": path.resolve(__dirname, "..", "src", "utils"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "..", "dist"),
  },
});
