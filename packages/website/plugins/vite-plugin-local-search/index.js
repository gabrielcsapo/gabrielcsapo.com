import fs from "fs";
import MarkdownIt from "markdown-it";
import fastGlob from "fast-glob";
import MiniSearch from "minisearch";

import { getFrontMatter } from "../common";

const removeFrontMatter = (mdCode) => mdCode.replace(/^---(.|\W)*?---/, "");

const processMdFiles = (HTML_FOLDER, options) => {
  let allData = [];
  const postsPath = fastGlob.sync(`${HTML_FOLDER}/**/*.mdx`, {
    absolute: true,
  });

  for (const postPath of postsPath) {
    const postContent = fs.readFileSync(postPath, "utf8");

    allData.push({ content: removeFrontMatter(postContent), path: postPath });
  }

  return allData;
};

const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const rCombining = /[\u0300-\u036F]/g;

/**
 * Default slugification function
 */
export const slugify = (str) =>
  str
    .normalize("NFKD")
    // Remove accents
    .replace(rCombining, "")
    // Remove control characters
    .replace(rControl, "")
    // Replace special characters
    .replace(rSpecial, "-")
    // Remove continuos separators
    .replace(/-{2,}/g, "-")
    // Remove prefixing and trailing separators
    .replace(/^-+|-+$/g, "")
    // ensure it doesn't start with a number (#121)
    .replace(/^(\d)/, "_$1")
    // lowercase
    .toLowerCase();

const buildDoc = (mdDoc, id) => {
  let m, t;
  let a = (t = mdDoc.anchor);
  if ((m = /\{(.*?)\}/m.exec(mdDoc.anchor)) !== null) {
    a = m[0];
    t = mdDoc.anchor.replace(/\{(.*?)\}/m, "");
  }
  const frontmatter = getFrontMatter(mdDoc.path);
  let link = frontmatter.slug;

  a = slugify(a);
  if (a[0] == "#") a = a.replace("#", "");

  if (!id.includes(".0")) link += `#${slugify(a)}`;

  return {
    id,
    link,
    text: mdDoc.content,
    slug: a,
    sectionTitle: t,
    title: frontmatter.title,
  };
};

/**
 * Split an md content by anchors in several index docs
 * @param mdCode an md content
 * @param path path of md file
 * @returns array of index docs
 */
const parseMdContent = (mdCode, path) => {
  const result = mdCode.split(/(^|\s)#{2,}\s/gi);
  const cleaning = result.filter((i) => i != "" && i != "\n");
  const mdData = cleaning.map((i) => {
    let content = i.split("\n");
    let anchor = content?.shift() || "";
    return { anchor, content: content.join("\n"), path };
  });
  return mdData;
};

const buildDocs = async (HTML_FOLDER, options) => {
  const files = await processMdFiles(HTML_FOLDER, options);

  const docs = [];
  if (files !== undefined) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let mdDocs = parseMdContent(file.content, file.path);

      for (let index = 0; index < mdDocs.length; index++) {
        const mdDoc = mdDocs[index];
        docs.push(buildDoc(mdDoc, i + "." + index));
      }
    }
  }
  return docs;
};

const md = new MarkdownIt();
let MAX_PREVIEW_CHARS = 62; // Number of characters to show for a given search result

export async function IndexSearch(HTML_FOLDER, options) {
  console.log("  🔎 Indexing...");
  if (options.previewLength) MAX_PREVIEW_CHARS = options.previewLength;
  const docs = await buildDocs(HTML_FOLDER, options);

  const miniSearch = new MiniSearch({
    fields: ["title", "text"],
    storeFields: ["title", "sectionTitle", "link"],
  });
  miniSearch.addAll(docs);

  const js = `
  const searchIndex = ${JSON.stringify(miniSearch.toJSON())};

  export default searchIndex;
  `;

  console.log("  🔎 Done.");

  return js;
}

const DEFAULT_OPTIONS = {
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs",
  allow: [],
  ignore: [],
};

export function searchPlugin(searchOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...searchOptions,
  };

  const virtualModuleId = "virtual:search";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-search",
    enforce: "pre",

    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return;

      const data = await IndexSearch(searchOptions.baseDir, options);

      return data;
    },
  };
}
