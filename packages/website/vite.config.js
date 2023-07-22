import { defineConfig } from "vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import inspect from "vite-plugin-inspect";
import url from "@rollup/plugin-url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { visualizer } from "rollup-plugin-visualizer";
import { imagetools } from "vite-imagetools";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import macrosPlugin from "vite-plugin-babel-macros";

import remarkImageImport from "./plugins/remark-image-import";
import remarkAdmonitions from "./plugins/remark-admonitions";
import { rssPlugin } from "./plugins/vite-plugin-rss/src/index";
import { searchPlugin } from "./plugins/vite-plugin-local-search";
import { pages } from "./plugins/vite-plugin-pages";

import { getFrontMatter } from "./plugins/common";

import fse from "fs-extra";

import fastGlob from "fast-glob";

const rssPostsData = [];

function findAllBlogPostsWithMeta() {
  const postsPath = fastGlob.sync("../../posts/**/*.mdx");
  for (const postPath of postsPath) {
    const data = getFrontMatter(postPath);

    rssPostsData.push({
      title: data.title,
      link: `https://www.gabrielcsapo.com${data.slug}`,
      pubDate: new Date(data.date),
    });
  }
}

findAllBlogPostsWithMeta();

// TODO: This should really be handled by the pages plugin
function copyAllBlogPostsFilesToPublic() {
  const postsPath = fastGlob.sync("../../posts/**/*.mdx");
  for (const postPath of postsPath) {
    const postDirectory = path.dirname(postPath);
    const potentialFilesDirectory = path.resolve(postDirectory, "files");
    if (fse.existsSync(potentialFilesDirectory)) {
      fse.copySync(
        potentialFilesDirectory,
        path.resolve(__dirname, "public", "files")
      );
    }
  }

  fse.copySync(
    path.resolve(__dirname, "..", "..", "posts", "files"),
    path.resolve(__dirname, "public", "files")
  );
}

copyAllBlogPostsFilesToPublic();

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkDirective,
        remarkFrontmatter,
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
    pages({
      baseDir: __dirname,
      globals: {
        siteName: "Gabriel J. Csapo",
      },
    }),
    searchPlugin({
      baseDir: path.resolve(__dirname, "../../posts"),
    }),
    react(),
    url(),
    inspect(),
    imagetools(),
    ViteImageOptimizer(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
    macrosPlugin(),
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
