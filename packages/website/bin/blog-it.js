#!/usr/bin/env node

import { createServer, build, preview } from "vite";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .command("build", "Build the Vite application")
  .command("serve", "Serve the Vite application")
  .command("start", "Starts a built Vite application")
  .command("preview", "Previews a built server")
  .option("directory", {
    alias: "d",
    type: "string",
    description: "Specify the directory",
    default: ".",
  })
  .demandCommand(
    1,
    "You need to provide a command (either build, serve or preview)"
  )
  .help().argv;

const directory = path.resolve(process.cwd(), argv.directory);

if (!directory) {
  console.error("Please provide a directory path using --dir option.");
  process.exit(1);
}

(async function () {
  process.env.BLOG_IT_DIRECTORY = directory;

  switch (argv._[0]) {
    case "serve":
      const server = await createServer({
        configFile: path.resolve(__dirname, "..", "vite.config.js"),
        root: path.resolve(__dirname, ".."),
      });

      await server.listen();

      server.printUrls();
      break;
    case "build":
      await build({
        configFile: path.resolve(__dirname, "..", "vite.config.js"),
        root: path.resolve(__dirname, ".."),
      });
      break;
    case "preview":
      await build({
        configFile: path.resolve(__dirname, "..", "vite.config.js"),
        root: path.resolve(__dirname, ".."),
      });

      const previewServer = await preview({
        configFile: path.resolve(__dirname, "..", "vite.config.js"),
        root: path.resolve(__dirname, ".."),
      });

      previewServer.printUrls();
      break;
  }
})();
