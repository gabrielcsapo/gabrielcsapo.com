import path from "path";
import crypto from "crypto";
import { visit } from "unist-util-visit";
import { u } from "unist-builder";

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

function createImport(importName, moduleName) {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: importName },
              },
            ],
            source: { type: "Literal", value: moduleName },
          },
        ],
      },
    },
  };
}

const remarkImageImport = () => (tree, file) => {
  let dir;

  const filePath = file.history[0];

  if (filePath) {
    const parsedPath = path.parse(filePath);
    dir = parsedPath.dir;
  }

  visit(tree, "image", (node, index, parent) => {
    if (node.url.startsWith("./images/")) {
      const imagePath =
        path.resolve(dir, node.url) +
        (node.url.indexOf(".gif") > -1
          ? ""
          : "?w=300;500;700;900;1200&format=webp&as=srcset");
      const importName = generateAlphabetHash(imagePath);
      const importNode = createImport(importName, imagePath);

      tree.children.push(importNode);

      const jsxNode = u("mdxJsxFlowElement", {
        name: "img",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "src",
            value: {
              type: "mdxJsxAttributeValueExpression",
              data: {
                estree: {
                  type: "Program",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "Identifier",
                        name: `${importName}`,
                      },
                    },
                  ],
                  sourceType: "module",
                  comments: [],
                },
              },
            },
          },
          {
            type: "mdxJsxAttribute",
            name: "alt",
            value: node?.alt || "",
          },
        ],
        children: [],
      });
      parent.children[index] = jsxNode;
    }
  });

  return tree;
};

export default remarkImageImport;
