import { visit } from "unist-util-visit";
import { name as isValidIdentifierName } from "estree-util-is-identifier-name";
import { valueToEstree } from "estree-util-value-to-estree";
import { Literal, Root } from "mdast";
import { MdxjsEsm } from "mdast-util-mdx";
import { parse as parseToml } from "toml";
import { Plugin } from "unified";
import path from "path";
import { parse as parseYaml } from "yaml";
import readingTime from "reading-time";

type FrontmatterParsers = Record<string, (value: string) => unknown>;

export interface RemarkMdxFrontmatterOptions {
  /**
   * If specified, the YAML data is exported using this name. Otherwise, each
   * object key will be used as an export name.
   */
  name?: string;

  /**
   * A mapping of node types to parsers.
   *
   * Each key represents a frontmatter node type. The value is a function that accepts the
   * frontmatter data as a string, and returns the parsed data.
   *
   * By default `yaml` nodes will be parsed using [`yaml`](https://github.com/eemeli/yaml) and
   * `toml` nodes using [`toml`](https://github.com/BinaryMuse/toml-node).
   */
  parsers?: FrontmatterParsers;
}

function generateAlphabetHash(filePath: string) {
  const hash = md5(filePath); // Replace `createHash("md5").update(filePath).digest("hex")` with `md5(filePath)`
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

function md5(input: string) {
  let hash = "";
  const hexLookup = "0123456789abcdef";

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash += hexLookup[char >>> 4] + hexLookup[char & 0x0f];
  }

  return hash;
}

function createImport(moduleName: string, importName: string): MdxjsEsm {
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

/**
 * Create an MDX ESM export AST node from an object.
 *
 * Each key of the object will be used as the export name.
 *
 * @param object The object to create an export node for.
 * @returns The MDX ESM node.
 */
function createExport(object: object): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            specifiers: [],
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: Object.entries(object).map(([identifier, val]) => {
                if (!isValidIdentifierName(identifier)) {
                  throw new Error(
                    `Frontmatter keys should be valid identifiers, got: ${JSON.stringify(
                      identifier
                    )}`
                  );
                }
                return {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: identifier },
                  init: valueToEstree(val),
                };
              }),
            },
          },
        ],
      },
    },
  };
}

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options Optional options to configure the output.
 * @returns A unified transformer.
 */
const remarkMdxFrontmatter: Plugin<[RemarkMdxFrontmatterOptions?], Root> = ({
  name,
  parsers,
} = {}) => {
  const sentenceCount = 3;

  const allParsers: FrontmatterParsers = {
    yaml: parseYaml,
    toml: parseToml,
    ...parsers,
  };

  return (ast, vfile) => {
    let sentences: string[] = [];
    let currentSentenceCount = 0;

    const imports: MdxjsEsm[] = [];
    let filePath = vfile.history[0] ?? "examples/foo.mdx";

    const { name: fileName } = path.parse(filePath);

    let hasTitle = false;
    let hasSlug = false;
    let hasDate = false;
    let hasExcerpt = false;
    let headerText = "";

    visit(ast, "text", (node) => {
      for (const node of ast.children) {
        if (!Object.hasOwnProperty.call(allParsers, node.type)) {
          continue;
        }

        const parser = allParsers[node.type];

        const { value } = node as Literal;
        const data: any = parser(value);

        if (data == null) {
          continue;
        }
        if (!name && typeof data !== "object") {
          throw new Error(
            `Expected frontmatter data to be an object, got:\n${value}`
          );
        }

        if (data.title) {
          hasTitle = true;
        }

        if (data.slug) {
          hasSlug = true;
        }

        if (data.date) {
          hasDate = true;
        }

        if (data.excerpt) {
          hasExcerpt = true;
        }

        imports.push(createExport(name ? { [name]: data } : (data as object)));
        // @ts-ignore
        node.value = "";
      }
    });

    visit(ast, "heading", (node) => {
      if (!headerText) {
        const _headerText = node.children
          .filter((child) => child.type === "text")
          // @ts-ignore
          .map((child) => child.value)
          .join(" ");

        headerText = _headerText;
      }
    });

    visit(ast, "text", (node) => {
      if (currentSentenceCount >= sentenceCount) {
        return;
      }

      const nodeSentences = node.value.match(/[^.!?]+[.!?]+/g) || [];
      const remainingSentences = sentenceCount - currentSentenceCount;

      if (nodeSentences.length <= remainingSentences) {
        sentences = sentences.concat(nodeSentences);
        currentSentenceCount += nodeSentences.length;
      } else {
        sentences = sentences.concat(
          nodeSentences.slice(0, remainingSentences)
        );
        currentSentenceCount = sentenceCount;
      }
    });

    if (!hasExcerpt) {
      imports.push(createExport({ excerpt: sentences.join(" ").trim() }));
    }

    const slug = filePath.replace(/.*\/pages/, "").replace(".mdx", "");

    if (!hasSlug) {
      imports.push(createExport({ slug }));
    } else {
      imports.push(createExport({ defaultSlug: slug }));
    }

    imports.push(
      createExport({ readingTime: readingTime(String(vfile.value)) })
    );

    if (name && !isValidIdentifierName(name)) {
      throw new Error(
        `If name is specified, this should be a valid identifier name, got: ${JSON.stringify(
          name
        )}`
      );
    }

    if (name && !imports.length) {
      imports.push(createExport({ [name]: undefined }));
    }

    if (!hasTitle) {
      // we will provide a default title
      imports.push(createExport({ title: headerText }));
    }

    const updatedData = imports.map((object: MdxjsEsm) => {
      if (object.type === "mdxjsEsm" && object.data?.estree?.body) {
        object.data.estree.body.forEach((node: any) => {
          if (
            node.type === "ExportNamedDeclaration" &&
            node.declaration?.type === "VariableDeclaration"
          ) {
            node.declaration.declarations.forEach((declaration: any) => {
              if (
                declaration.id?.name === "image" &&
                declaration.init?.type === "Literal"
              ) {
                const newImageHash = generateAlphabetHash(
                  declaration.init.value
                );

                imports.push(
                  createImport(declaration.init.value, newImageHash)
                );

                Object.assign(declaration, {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: "image" },
                  init: {
                    type: "Identifier",
                    name: newImageHash,
                  },
                });
              }
            });
          }
        });
      }
      return object;
    });

    if (!hasDate) {
      const datePart = fileName.substring(0, 10); // "2020-07-30"

      // Parse the string into a Date object
      const date = new Date(datePart);

      imports.push(createExport({ date: date.toLocaleString() }));
    }

    ast.children.unshift(...imports);
  };
};

export default remarkMdxFrontmatter;
