# Production Deployment Guide

## Recommended flow

Commit the full source package to a repository and let the configured platform run `npm run build`. The build creates a clean `dist/` release, runs URL intelligence, and the platform then publishes `dist/`.

## Custom production domain

When you have the final HTTPS domain, define:

```text
PORTFOLIO_SITE_URL=https://your-domain.example/
```

This value is the highest-priority canonical origin and is used for canonical tags, Open Graph URLs, JSON-LD URLs, `robots.txt`, and `sitemap.xml`.

### GitHub Pages

Add `PORTFOLIO_SITE_URL` under **Repository → Settings → Secrets and variables → Actions → Variables** if using a custom domain. If it is absent, the build infers the conventional GitHub Pages URL from the repository owner and repository name.

### Netlify

The build can use Netlify's production site `URL`. Set `PORTFOLIO_SITE_URL` only when you want an explicit canonical override.

### Vercel

The build can use Vercel's production URL variables. `PORTFOLIO_SITE_URL` remains the preferred override for a custom canonical domain.

## Local production simulation

```bash
PORTFOLIO_SITE_URL=https://example.com/portfolio/ PORTFOLIO_DEPLOY_CONTEXT=production npm run build
npm run qa:dist
```

Use a real domain before publishing. The example value is only for local testing.

## Live audit

After deployment:

```bash
npm run audit:live -- https://your-live-site.example/
```

The audit writes `live-audit.json` and verifies the homepage, canonical URL, Open Graph URL, structured data, `robots.txt`, sitemap, manifest, deployment metadata, application brief, and a representative project page.
