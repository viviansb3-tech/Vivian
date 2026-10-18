# Production QA

Phase 50 adds repeatable engineering checks around the static portfolio.

## Local checks

Run:

```bash
npm run check
```

This creates a clean `dist/` release and validates it for:

- JavaScript syntax errors.
- Invalid JSON / web manifest files.
- Missing local `href` and `src` targets.
- Broken same-site fragment anchors.
- Duplicate HTML IDs.
- Missing core HTML metadata and landmarks.
- Unsafe `target="_blank"` links without `noopener noreferrer`.
- Required production files (`404.html`, `robots.txt`, `site.webmanifest`).

Warnings do not block a build; integrity errors do.

## Release boundary

`npm run build` creates `dist/` from public pages and assets only. Internal phase notes, QA scripts and development documentation are not copied into the release directory.

## GitHub Actions

`quality.yml` runs on pushes and pull requests. It:

1. Builds `dist/`.
2. Runs the integrity audit.
3. Starts a temporary static server and smoke-tests important routes.
4. Runs Lighthouse CI against the built static site.
5. Stores Lighthouse reports as a private workflow artifact rather than publishing them to temporary public storage.

## Lighthouse gates

The baseline blocking scores are:

- Performance: 0.65
- Accessibility: 0.90
- Best Practices: 0.85
- SEO: 0.90

These are regression gates, not claims about real-user field performance. Tighten them after observing stable CI results.

## Deployment

GitHub Pages, Netlify and Vercel now deploy the generated `dist/` directory only, and the build fails if the local integrity audit fails.
