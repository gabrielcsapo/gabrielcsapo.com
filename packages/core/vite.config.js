import { defineConfig } from "vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import inspect from "vite-plugin-inspect";
import generateSitemap from "vite-plugin-pages-sitemap";
import url from "@rollup/plugin-url";
import pages from "@gabrielcsapo/vite-plugin-pages";
import remarkImageImport from "@gabrielcsapo/remark-image-import";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import remarkFrontmatter from "remark-frontmatter";
import remarkFrontmatterAdditional from "@gabrielcsapo/remark-frontmatter-additional";
import remarkDirective from "remark-directive";
import remarkAdmonitions from "@gabrielcsapo/remark-admonitions";
import { rssPlugin } from "@gabrielcsapo/vite-plugin-rss";

import fastGlob from "fast-glob";

import matter from "gray-matter";
import fs from "fs";

const rssPostsData = [];

function findAllBlogPostsWithMeta() {
  const posts = fastGlob.sync("./src/pages/posts/**/*.mdx");
  for (const post of posts) {
    const { data } = matter(fs.readFileSync(post));

    rssPostsData.push({
      title: data.title,
      link: "http://lvh.me:3000/test/2",
      pubDate: new Date(data.date ?? new Date()),
    });
  }
}

findAllBlogPostsWithMeta();

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkDirective,
        remarkFrontmatter,
        remarkFrontmatterAdditional,
        remarkImageImport,
        remarkAdmonitions,
      ],
      providerImportSource: "@mdx-js/react",
    }),
    rssPlugin({
      mode: "define",
      items: rssPostsData,
      channel: {
        title: "Gabriel J. Csapo",
        link: "http://www.gabrielcsapo.com",
        description: "Blog for Gabriel J. Csapo",
      },
    }),
    react(),
    pages({
      baseDir: __dirname,
      globals: {
        siteName: "Gabriel J. Csapo",
      },
    }),
    url(),
    inspect(),
    ViteImageOptimizer({}),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src", "components"),
      "@utils": path.resolve(__dirname, "src", "utils"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
});
