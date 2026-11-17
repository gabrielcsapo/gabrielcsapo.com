# gabrielcsapo.com

Gabriel J. Csapo's platform engineering portfolio. Built with React and Vite.

- `pnpm dev` starts the local site.
- `pnpm build` creates the static deployment in `dist/`.
- `pnpm lint` checks source files.

The public site is the homepage. The writing in `posts/` is published at `/posts`
(one page per post at the top level, `/<slug>`), which nothing links to and which asks search
engines to skip it. Downloads the posts refer to are in `public/files/`. Blog search,
tags, and RSS are disabled; their old components are kept as source material only.

The resume download is `public/gabriel-csapo-resume.pdf`.
Pushing to `main` triggers the existing GitHub Pages deployment workflow.
