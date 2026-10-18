# Phase 52.2 — Speed Optimisation

This pass improves initial loading, rendering and runtime responsiveness while preserving the Phase 52 theme/layout fixes.

## Main changes
- Homepage CSS requests consolidated from 15 local stylesheets to one production bundle.
- Homepage JavaScript requests consolidated from 19 files to one deferred bundle.
- Removed the Google Fonts network dependency from the homepage; the site now uses system fallbacks when those named fonts are unavailable.
- Replaced full-size portrait delivery with responsive WebP sources at 480, 768 and 1024 px widths.
- Removed the duplicate legacy hero-image preload and legacy `<picture><source>` override that forced the larger WebP file.
- Added a responsive preload for the actual LCP portrait.
- Added width/height attributes to portraits to reserve layout space.
- Delayed the GitHub API request until the GitHub section approaches the viewport.
- Particle canvas is disabled on touch/mobile, reduced to 28 particles on desktop, capped to roughly 30 fps and paused in background tabs.
- Custom cursor animation now stops when interpolation finishes rather than running continuously.
- Scroll UI work is requestAnimationFrame-throttled.
- Heavy below-fold sections use `content-visibility:auto` to reduce initial rendering work.
- Mobile/touch mode disables costly backdrop filters on the heaviest glass surfaces while preserving the visual hierarchy.
- Production `dist/` now excludes obsolete unreferenced phase JS/CSS files.

## Measured startup resource reduction
Baseline homepage startup path: 14 local CSS files + 19 local JavaScript files + the legacy 160 KB hero WebP, plus the external Google Fonts stylesheet/font downloads. The local CSS + JS + hero path is approximately 229 KB when CSS/JS are gzip-compressed.

Optimised homepage startup path: 1 CSS bundle + 1 deferred JavaScript bundle + a responsive hero WebP. At the 768 px hero candidate, that path is approximately 94 KB with CSS/JS gzip compression; smaller displays can receive the ~19 KB 480 px portrait.

This is approximately a 59% reduction in the measured compressed local CSS/JS/hero startup payload, an 86% reduction in local CSS/JS request count, and it removes the separate Google Fonts network dependency entirely.

The 768 px hero WebP is approximately 40 KB; the 480 px variant is approximately 19 KB for smaller displays.
