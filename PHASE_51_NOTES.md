# Phase 51 — Live Deployment & Domain Intelligence

Phase 51 adds environment-aware URL and post-deployment validation infrastructure without hard-coding an unverified production domain.

## Added
- Build-time canonical URL injection across every HTML page.
- Absolute `og:url`, Open Graph image and structured-data URL handling.
- Production-only XML sitemap generation.
- Environment-aware `robots.txt`: production indexing, preview/local noindex.
- `deployment-meta.json` release metadata.
- Public deployment-status surface on the homepage.
- GitHub Pages URL inference with `PORTFOLIO_SITE_URL` override support for a future custom domain.
- Netlify primary URL and Vercel production URL detection.
- Post-deployment HTTP audit tool and GitHub Pages post-deploy audit job.

## Canonical URL precedence
1. `PORTFOLIO_SITE_URL` (explicit override; preferred for a custom domain)
2. Netlify production `URL`
3. Vercel production URL variables
4. GitHub Pages URL inferred from repository owner/name
5. Unresolved locally; canonical tags/sitemap are intentionally omitted until deployment

## Custom domain
Set `PORTFOLIO_SITE_URL` to the final HTTPS origin, including any required base path. On GitHub Actions, add it as a repository variable named `PORTFOLIO_SITE_URL`.
