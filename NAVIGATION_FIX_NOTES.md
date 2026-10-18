# Phase 52.3 — Navigation & Homepage Start Fix

- Fixed mobile top navigation dropdown clipping caused by `.glass { overflow:hidden }`.
- Navigation now explicitly allows the menu to flow below the top panel.
- Raised navigation stacking context so later portfolio sections cannot cover it.
- Corrected the scrolled-navigation state (`header.nav-scrolled` and `#nav.scrolled`).
- Added manual browser scroll restoration. Root homepage visits now start at the hero instead of an old remembered scroll position.
- Deliberate deep links such as `#contact` are still respected.
