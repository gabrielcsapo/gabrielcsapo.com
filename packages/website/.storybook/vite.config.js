import { defineConfig } from "vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import inspect from "vite-plugin-inspect";
import url from "@rollup/plugin-url";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkImageImport from "../plugins/remark-image-import";
import remarkAdmonitions from "../plugins/remark-admonitions";
import MiniSearch from "minisearch";

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
        return `const globals = ${JSON.stringify(options.globals || {})}; 
        
        const routes = {}; 
        
        export async function getPostImage(slug) {
          return slug;
        };

        export function getComponent(name) {
          return name;
        };

        export { globals, routes };
        
        `;
      }
    },
  };
};

const localSearch = () => {
  const virtualModuleId = "virtual:search";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-local-search",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const miniSearch = new MiniSearch({
          fields: ["title", "text"],
          storeFields: ["title", "sectionTitle", "link"],
        });
        miniSearch.addAll([]);

        return `
          const searchIndex = ${JSON.stringify(miniSearch.toJSON())};
        
          export default searchIndex;
        `;
      }
    },
  };
};

export default defineConfig({
  plugins: [
    mdx({
      mdxExtensions: [".psx"],
      remarkPlugins: [
        remarkGfm,
        remarkDirective,
        remarkFrontmatter,
        remarkImageImport,
        remarkAdmonitions,
      ],
      providerImportSource: "@mdx-js/react",
      outputFormat: "function-body",
    }),
    localSearch(),
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
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  build: {
    outDir: path.resolve(__dirname, "..", "dist"),
  },
});
