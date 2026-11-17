import fastGlob from "fast-glob";

import { getFrontMatter } from "../common/index.js";

const virtualModuleId = "virtual:posts";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

// Exposes `virtual:posts`: a small list describing every post, newest first,
// and a loader per post so each one is only downloaded when it is opened.
export function posts({ postsDir }) {
  return {
    name: "vite-plugin-posts",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return;
      const all = fastGlob
        .sync("**/*.mdx", { absolute: true, cwd: postsDir })
        .map((file) => {
          const frontMatter = getFrontMatter(file);
          return {
            file,
            slug: frontMatter.slug.split("/").filter(Boolean).pop(),
            title: frontMatter.title,
            date: new Date(frontMatter.date).toISOString(),
            excerpt: frontMatter.excerpt,
            minutes: Math.ceil(frontMatter.readingTime.minutes),
          };
        })
        .sort((a, b) => b.date.localeCompare(a.date));
      const list = all.map(({ file, ...post }) => post);
      const loaders = all
        .map(({ slug, file }) => `${JSON.stringify(slug)}: () => import(${JSON.stringify(file)}),`)
        .join("\n");
      return `export const posts = ${JSON.stringify(list)};\nexport const loaders = {\n${loaders}\n};\n`;
    },
  };
}
