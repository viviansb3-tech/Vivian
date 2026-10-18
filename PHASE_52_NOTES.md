# Phase 52 — Launch Candidate & Deployment Handoff

Phase 52 converts the deployment-aware portfolio into a verifiable release candidate.

## Added
- SHA-256 manifest for every public release file.
- Deterministic release ID derived from the aggregate fingerprint.
- Release-integrity QA that re-hashes the bundle before deployment.
- Launch preflight for required professional links/assets, deployment metadata and release identity.
- Homepage launch-candidate status panel.
- Expanded post-deployment audit to verify the release manifest and Phase 52 identity.
- `npm run release` as the single local release gate.
- `DEPLOY_NOW.md` provider handoff guide.

## Boundary
No fake production domain is embedded. The release becomes production-resolved only when a real host supplies a live URL or `PORTFOLIO_SITE_URL` is configured.
