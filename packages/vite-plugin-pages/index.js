import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";

const virtualModuleId = "virtual:pages";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

function generateAlphabetHash(filePath) {
  const hash = crypto.createHash("md5").update(filePath).digest("hex");
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const hashLength = hash.length;
  let alphabetHash = "";

  for (let i = 0; i < hashLength; i += 2) {
    const hexValue = hash.substr(i, 2);
    const index = parseInt(hexValue, 16) % alphabet.length;
    alphabetHash += alphabet[index];
  }

  return alphabetHash;
}

function getFrontmatter(filePath, componentInfo) {
  if (componentInfo.ext === ".mdx") {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const { data } = matter(fileContent);

    return data;
  }
  return {};
}

function getSlug(fileName, frontMatter) {
  let slug = fileName.replace(".jsx", "").replace(".mdx", "");

  if (slug === "index") {
    return "/";
  }

  return frontMatter?.slug ?? slug;
}

function generateRoutes(rootDir, baseDir) {
  let imports = [];
  // Get the file paths in the pages directory
  const fileNames = fs.readdirSync(baseDir);

  // Generate the routes based on the file names
  return {
    imports,
    routes: fileNames
      .map((fileName) => {
        const filePath = path.resolve(baseDir, fileName);
        const componentInfo = path.parse(filePath); // Use any method to get component info (e.g., react-docgen)

        // if it has an extension it can render on its own, if not we are in a folder and we need to recurse down
        if (
          componentInfo.ext &&
          [".jsx", ".mdx"].indexOf(componentInfo.ext) > -1
        ) {
          const frontmatter = getFrontmatter(filePath, componentInfo);
          const importName = generateAlphabetHash(filePath);
          imports.push(
            `import * as ${importName} from "${filePath.replace(
              rootDir + "/",
              "./"
            )}";`
          );
          return {
            path: getSlug(fileName, frontmatter),
            element: `:::::${importName}:::::`,
            pathOnDisk: componentInfo.name,
          };
        } else {
          if (fs.lstatSync(filePath).isDirectory()) {
            const { routes: childrenRoutes, imports: childrenImports } =
              generateRoutes(rootDir, filePath);

            imports.push(...childrenImports);

            const indexRoute = childrenRoutes.find((route) => {
              return route.path === "/";
            });

            if (childrenRoutes.length > 0) {
              // we need to check if the child route is same route as the file so we can hoist it
              if (childrenRoutes[0].pathOnDisk === fileName) {
                return {
                  ...childrenRoutes[0],
                };
              } else {
                return {
                  path: getSlug(fileName, {}),
                  children: childrenRoutes.filter((path) => {
                    return path !== indexRoute;
                  }),
                  element: indexRoute?.element,
                  pathOnDisk: fileName,
                };
              }
            }
          }
        }
      })
      .filter((path) => {
        return path !== undefined;
      }),
  };
}

export default function pages(options) {
  const baseDir = options.baseDir;
  const globals = options.globals ?? {};

  return {
    name: "vite-plugin-pages",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const pagesDir = path.resolve(baseDir, "src/pages"); // Update this path to match your project structure

        // Get the file paths in the pages directory
        const { imports, routes } = generateRoutes(baseDir, pagesDir);

        function componentReplacer(str, replaceStr) {
          return replaceStr;
        }

        return `${imports.join(
          "\n"
        )}import React from "react";\n const routes = ${JSON.stringify(
          routes
        ).replace(
          /":::::(.+?):::::"/g,
          componentReplacer
        )}; const globals = ${JSON.stringify(
          globals
        )}; export { routes, globals };`;
      }
    },
  };
}
