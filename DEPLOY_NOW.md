# Deploy Now — Phase 52

This folder is a launch candidate. It deliberately does not claim a production domain until a real deployment environment supplies one.

## 1. Run the complete release gate

```bash
npm run release
```

This rebuilds `dist/`, resolves environment-aware URL rules, generates the SHA-256 release manifest, and runs structural, deployment, release-integrity and launch-preflight checks.

## 2. Choose a host

### GitHub Pages
1. Create or choose the portfolio repository.
2. Push this project to the `main` branch.
3. In GitHub Pages settings, use **GitHub Actions** as the Pages source.
4. Optional custom domain: set repository variable `PORTFOLIO_SITE_URL` to the final HTTPS root URL.
5. The included `.github/workflows/pages.yml` validates, runs Lighthouse, deploys `dist/`, then audits the live URL.

### Netlify
1. Import the Git repository.
2. `netlify.toml` runs the production build and QA automatically.
3. Add a custom domain when available. Netlify's production URL is detected automatically; `PORTFOLIO_SITE_URL` can override it.

### Vercel
1. Import the Git repository.
2. `vercel.json` runs the production build and QA automatically.
3. Vercel production URL variables are detected automatically; `PORTFOLIO_SITE_URL` can override them for a custom domain.

## 3. Verify any live URL manually

```bash
node tools/audit-live.mjs https://your-live-site.example/
```

The audit verifies HTTP availability, canonical metadata, Open Graph URL, structured data, robots, sitemap, manifest, deployment metadata, Phase 52 release identity, Application Brief and a representative project route.

## 4. Release integrity

`dist/release-manifest.json` contains a SHA-256 digest for each public file and a single release fingerprint. Run:

```bash
npm run verify:release
```

A mismatch means the deployed/public bundle differs from the release that was fingerprinted.
