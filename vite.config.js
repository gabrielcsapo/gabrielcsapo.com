import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import { imagetools } from "vite-imagetools";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkImageImport from "./plugins/remark-image-import/index.js";
import remarkAdmonitions from "./plugins/remark-admonitions/index.js";
import { posts } from "./plugins/vite-plugin-posts/index.js";

// The homepage is the public site. The writing in `posts/` is published at /posts,
// which nothing links to and search engines are asked to skip. There is no RSS or search.
export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkDirective,
        remarkFrontmatter,
        remarkImageImport,
        remarkAdmonitions,
      ],
    }),
    posts({ postsDir: path.resolve(import.meta.dirname, "posts") }),
    react(),
    imagetools(),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@utils": path.resolve(import.meta.dirname, "src/utils"),
    },
  },
  build: { outDir: "dist" },
});
