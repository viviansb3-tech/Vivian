# Vivian Sibanda — portfolio

A minimal, static portfolio for applied statistics, data, research and software.

## Pages

- `index.html`: default landing page, with Work, About and Contact navigation.
- `projects.html`: all 16 case studies.
- `projects/`: original evidence-led project pages.
- `explorer.html`: preserved advanced research workspace.
- `assets/`: CV and contact card.

The landing page and project collection work without JavaScript, use local assets and system fonts, and support phones, keyboard navigation and reduced motion.

## Build and verify

Requires Node.js 20 or newer. No dependencies need to be installed.

```sh
npm run check
```

Build output is `dist/`. Serve it with any static web server.

## Hosting

The existing production address is https://viviansibanda.netlify.app/ . `netlify.toml` builds and verifies the site and publishes `dist/`. Connect this GitHub repository to the existing Netlify site to deploy future commits. The Netlify production build sets the correct canonical URL; preview builds stay noindex.

GitHub Actions runs quality checks on pushes and pull requests. The optional Pages deployment is manual via workflow_dispatch; it requires GitHub Pages to be configured for Actions in the repository settings.

## Refresh

Replaced the crowded homepage with a clear introduction, four selected projects, a short profile and direct contact links. The complete project content is preserved. Technical release panels and role-based tools live only in the optional research explorer. Release hashes and link, asset, responsive and deployment checks remain part of the build.
