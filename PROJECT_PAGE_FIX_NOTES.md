# Project Page Rendering Fix

This stability pass repairs project-detail rendering across all 15 project pages.

## Root causes corrected

- `projects/hotelling-t2.html` used `phase33-project-*` classes without a page-specific layout layer, while the shared homepage stylesheet applied a generic fixed `header` rule to the project hero.
- `projects/cointegration-bitcoin.html` used the generic class `flow`, which collided with a homepage `.flow` flex rule.
- 14 project pages loaded `phase43-case-studies.css` at the end of the document body instead of in the document head.
- Project templates were inconsistent: archive pages, Phase 27 workflow pages, the Hotelling research page, and the financial time-series page used different hard-coded dark-mode assumptions.
- Most project pages did not inherit the saved portfolio light/dark preference.

## Repairs

- Added `project-pages.css` as a final project-page override layer.
- Added `project-pages.js` to synchronise the saved `vivian-theme` preference and expose a consistent theme toggle.
- Added a common project navigation bar and return path.
- Moved all project-page stylesheet links into `<head>`.
- Reset generic homepage class collisions for `header`, `.flow`, `.hero`, and project shells.
- Normalised project cards, evidence panels, source-proof panels, typography, light mode, mobile layout, and spacing.
- Updated the release builder so the new project-page assets are included in `dist/`.

## QA

- Project HTML pages checked: 15
- One H1 per project page: PASS
- One main landmark per project page: PASS
- Stylesheet links remaining in body: 0
- Missing project-page CSS/JS: 0
- Duplicate IDs: 0
- Broken local project references: 0
- Production build: PASS
- Deployment intelligence QA: PASS
- SHA-256 release verification: PASS
