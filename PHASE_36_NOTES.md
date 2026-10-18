# Phase 36 — Deployment & Production Packaging

## Production layer
- Added GitHub Pages deployment workflow at `.github/workflows/pages.yml`.
- Added `.nojekyll` for static GitHub Pages hosting.
- Added Netlify configuration with security headers and a 404 route.
- Added Vercel configuration with security headers and clean URLs.
- Added `404.html` branded error page.
- Added `robots.txt`.
- Added `site.webmanifest` for installable/PWA-ready metadata.
- Added production metadata to `index.html` including author, theme colour, Open Graph and Twitter card metadata.

## Preservation
- Existing portfolio sections, projects, images, CV, scripts and contact routes remain intact.
- No LinkedIn URL was guessed; the existing LinkedIn placeholder remains until the exact profile URL is supplied.

## Deployment
### GitHub Pages
Push the repository to GitHub, keep the default branch as `main`, then enable **Settings → Pages → GitHub Actions**. The included workflow deploys the repository automatically on every push to `main`.

### Netlify
Deploy the repository as a static site with the publish directory set to `.`. `netlify.toml` supplies the production headers and 404 handling.

### Vercel
Import the repository as a static project. `vercel.json` supplies production headers.
