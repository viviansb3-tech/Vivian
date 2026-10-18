# Theme + Philosophy Layout Stability Fix

## Corrected
- Closed the Philosophy quote grid and section at the correct point in `index.html`.
- Removed the duplicate delayed Philosophy closing markup that had nested later homepage modules inside the first quote card.
- Confirmed Accessibility Preferences, Research Directory, Honours Research and About are now siblings of Philosophy rather than descendants of it.
- Added `theme-fixes.css` as the final stylesheet so late phase styles cannot override light/dark visibility rules unexpectedly.
- Synchronized legacy theme variables (`--bg`, `--text`, `--muted`, `--line`, `--blue`) with the newer `--theme-*` variables.
- Corrected light-mode contrast for navigation, glass cards, project/research panels, Philosophy, Research Intelligence, Honours Research, forms, Code Proof, deployment status and launch status.
- Corrected light-mode form `color-scheme` and input/select/textarea contrast.
- Added a pre-paint saved-theme bootstrap to reduce theme flashing.
- Updated the theme controller to update browser `theme-color` and `color-scheme` when toggling.

## Verification
- Production QA: PASS
- Broken local references: 0
- Fragment errors: 0
- JavaScript syntax failures: 0
- CSS parse errors in the stability stylesheet: 0
- Duplicate IDs: 0
- Release SHA-256 verification: PASS
