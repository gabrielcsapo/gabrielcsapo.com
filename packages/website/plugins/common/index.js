import fs from "fs";
import path from "path";
import { compileSync } from "@mdx-js/mdx";
import { visit } from "unist-util-visit";
import matter from "gray-matter";
import { VFile } from "vfile";
import readingTime from "reading-time";
import remarkFrontmatter from "remark-frontmatter";

export function generateAlphabetHash(filePath) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let hash = 0;

  for (let i = 0; i < filePath.length; i++) {
    const charCode = filePath.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to 32bit integer
  }

  let hashString = "";
  do {
    const value = hash % alphabet.length;
    hashString += alphabet[Math.abs(value)];
    hash = (hash / alphabet.length) | 0;
  } while (hash);

  return hashString.toLocaleUpperCase();
}

export function getFrontMatter(filePath) {
  const { name: fileName } = path.parse(filePath);
  if (filePath.indexOf(".md") === -1) {
    throw new Error("Trying to get the frontmatter of a non-md file");
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  const file = new VFile(fileContent);
  file.history = [filePath];

  let autoGeneratedTitle = "";
  let autoGeneratedExcerpt = "";

  compileSync(file, {
    remarkPlugins: [
      remarkFrontmatter,
      function test() {
        let sentences = [];
        let currentSentenceCount = 0;
        let sentenceCount = 3;

        return (ast, vfile) => {
          visit(ast, "heading", (node) => {
            if (!autoGeneratedTitle) {
              const _autoGeneratedTitle = node.children
                .filter((child) => child.type === "text")
                // @ts-ignore
                .map((child) => child.value)
                .join(" ");

              autoGeneratedTitle = _autoGeneratedTitle;
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

          autoGeneratedExcerpt = sentences.join(" ").trim();
        };
      },
    ],
  });

  const frontmatter = {
    ...data,
  };

  if (!frontmatter.date) {
    const datePart = fileName.substring(0, 10); // "2020-07-30"

    // Parse the string into a Date object
    frontmatter.date = new Date(datePart);
  }

  if (!frontmatter.slug) {
    frontmatter.slug = `/posts/${fileName}`;
  }

  if (!frontmatter.title) {
    frontmatter.title = autoGeneratedTitle;
  }

  if (!frontmatter.excerpt) {
    frontmatter.excerpt = autoGeneratedExcerpt;
  }

  if (frontmatter.image) {
    const absoluteImagePath = path.resolve(
      path.dirname(filePath),
      frontmatter.image
    );
    frontmatter.image =
      absoluteImagePath + "?w=300;500;700;900;1200&format=webp&as=picture";
  }

  if (frontmatter.layout) {
    frontmatter.layout = path.resolve(
      path.dirname(filePath),
      frontmatter.layout
    );
  } else {
    frontmatter.layout = path.resolve("./src/components/BlogLayout");
  }

  if (frontmatter.author) {
    frontmatter.author = {
      name: "Gabriel J. Csapo",
      title: "Wanderer",
      url: "https://github.com/gabrielcsapo",
      image_url: "https://github.com/gabrielcsapo.png",
    };
  }

  frontmatter.readingTime = readingTime(fileContent);
  frontmatter.locationOnDisk = filePath;

  return frontmatter;
}