import fs from "fs";
import path from "path";
import fastGlob from "fast-glob";

import { generateAlphabetHash, getFrontMatter } from "../common";

const virtualModuleId = "virtual:pages.jsx";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

function findAllBlogPosts() {
  const postsPath = fastGlob.sync("../../posts/**/*.mdx", {
    absolute: true,
  });
  return postsPath.map((postPath) => {
    return getFrontMatter(postPath);
  });
}

async function getRoutesFromDir(dir, baseDir) {
  function getSlug(fileName, frontMatter) {
    let slug = fileName.replace(".jsx", "").replace(".mdx", "");

    // we want to replace all the index keywords as those are just /
    slug = slug.replace(/index/g, "");

    return frontMatter?.slug ?? slug;
  }

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const dirPromises = entries.map(async (entry) => {
    if (entry.isDirectory()) {
      return getRoutesFromDir(path.join(dir, entry.name), baseDir);
    } else if (entry.name.endsWith(".jsx")) {
      const routePath = getSlug(
        path.resolve(dir, entry.name).replace(baseDir + "/pages", "")
      );
      // we are going to find the closet layout or use the default layout
      const layout =
        entries.find((e) => {
          e.name === "Layout.jsx";
        }) ?? path.resolve(__dirname, "../../src/Layout.jsx");

      return {
        path: routePath,
        component: path.resolve(dir, entry.name),
        layout,
      };
    }
  });
  const results = await Promise.all(dirPromises);
  return results.flat().filter((route) => route !== undefined);
}

export function pages(options) {
  const baseDir = options.baseDir;
  const globals = options.globals;

  return {
    name: "vite-plugin-routes",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const hashes = {};
        const posts = findAllBlogPosts();
        const generatedPostRoutes = posts.map((post) => {
          return {
            path: post.slug,
            component: post.locationOnDisk,
            layout: post.layout,
            props: post,
          };
        });
        const routes = [
          ...(await getRoutesFromDir(
            path.resolve(baseDir, "src/pages/"),
            path.resolve(baseDir, "src/")
          )),
          ...generatedPostRoutes,
        ];
        const imageHashes = {};
        const imageImports = posts
          .filter((post) => post.image)
          .map((post) => {
            const imageHash = generateAlphabetHash(post.slug);
            imageHashes[post.slug] = imageHash;

            return `const ${imageHash} = async function() {
              return import("${post.image}");
            }`;
          })
          .join("\n");

        const layoutImports = routes
          .map((route) => {
            hashes[route.layout] = generateAlphabetHash(route.layout);

            return `const ${generateAlphabetHash(
              route.layout
            )} = React.lazy(() => import('${route.layout}'));`;
          })
          .reduce(
            (unique, item) =>
              unique.includes(item) ? unique : [...unique, item],
            []
          )
          .join("\n");
        const imports = routes
          .map((route) => {
            hashes[route.component] = generateAlphabetHash(route.component);

            return `const ${generateAlphabetHash(
              route.component
            )} = React.lazy(() => import('${route.component}'));`;
          })
          .join("\n");

        return `
          import React from 'react';

          ${layoutImports}
          ${imports}
          ${imageImports}

          const componentLookupMap = {
            ${Object.keys(hashes)
              .map((k) => `"${k}": ${hashes[k]},`)
              .join("\n")}
          };

          const imageLookupMap = {
            ${Object.keys(imageHashes)
              .map((k) => `"${k}": ${imageHashes[k]},`)
              .join("\n")}
          }

          export const routes = ${JSON.stringify(routes)};
          export const posts = ${JSON.stringify(posts)};
          export const globals = ${JSON.stringify(globals || {})};

          export async function getPostImage(slug) {
            return await imageLookupMap[slug]?.();
          };

          export function getComponent(name) {
            return componentLookupMap[name];
          };
        `;
      }
    },
  };
}
