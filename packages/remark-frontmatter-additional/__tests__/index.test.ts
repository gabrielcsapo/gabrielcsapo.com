import { describe, test, expect } from "vitest";

import path from "path";
import fs from "node:fs/promises";
import { compile } from "@mdx-js/mdx";
import { VFile } from "vfile";

import remarkFrontmatter from "remark-frontmatter";
import remarkFrontmatterAdditional from "../src/index";

describe("remark-frontmatter-additional", () => {
  test("basic", async () => {
    const content = await fs.readFile(
      path.resolve(__dirname, "fixtures", "post.mdx")
    );
    const file = new VFile(content);
    file.history = ["/src/pages/post.mdx"];

    const { value } = await compile(file, {
      remarkPlugins: [remarkFrontmatter, remarkFrontmatterAdditional],
      jsx: true,
    });

    expect(value).toMatchSnapshot();
  });

  test("file with no title (expecting default first header to exist)", async () => {
    const content = await fs.readFile(
      path.resolve(__dirname, "fixtures", "post-with-no-title.mdx")
    );
    const file = new VFile(content);
    file.history = ["/src/pages/post-with-no-title.mdx"];

    const { value } = await compile(file, {
      remarkPlugins: [remarkFrontmatter, remarkFrontmatterAdditional],
      jsx: true,
    });

    expect(value).toMatchSnapshot();
  });
});
