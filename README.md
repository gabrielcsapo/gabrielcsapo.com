# gabrielcsapo.com

Gabriel Csapo's platform engineering portfolio. Built with React and Vite.

- `pnpm dev` starts the local site.
- `pnpm build` creates the static deployment in `dist/`.
- `pnpm lint` checks source files.

The public application has a homepage and a not-found route. Historical writing in
`posts/`, old page components, and downloads in `archive/blog-files/` are retained
as source material only. They are not imported by the application or published by
the build. Blog search, generated post routes, and RSS are disabled.

The resume download is `public/gabriel-csapo-resume.pdf`.
Pushing to `main` triggers the existing GitHub Pages deployment workflow.
