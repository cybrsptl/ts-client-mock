# Scroll Jump Overlay Pattern

## Purpose
- Define a stable, reusable pattern for scroll jump controls inside dense dropdown/list panels.
- Ensure arrow visibility reflects actual scrollbar position for both manual scroll and programmatic jumps.

## Interaction Contract
- `No overflow` (content fits): hide both arrows.
- `At top edge`: show only down arrow.
- `At bottom edge`: show only up arrow.
- `Between edges`: show both arrows.
- Edge state must be based on real list scroll position, not guessed timers.

## Implementation Rules
- Keep jump controls inside the scrollable list shell:
  - shell: `position: relative`
  - arrows: full-width overlay strips at top and bottom (`position: absolute`)
  - list: top/bottom padding so first/last row remains visible under overlays
- Keep logic list-scoped:
  - jump controls should only manipulate the owning list scroll
  - do not couple with unrelated containers
- Keep separators explicit:
  - use dedicated divider elements (`.suri-subnet-divider`), not item border-bottom lines

## Scroll Detection Strategy
- Compute from list metrics:
  - `maxScroll = scrollHeight - clientHeight`
  - `scrollTop = clamp(scrollTop, 0, maxScroll)`
- Determine edges with pixel epsilon:
  - `atTop = maxScroll <= epsilon || scrollTop <= epsilon`
  - `atBottom = maxScroll <= epsilon || (maxScroll - scrollTop) <= epsilon`
- Use a `requestAnimationFrame` watcher while panel is open so manual scroll (wheel, trackpad, drag) and smooth jumps keep arrow state synchronized.
- Stop watcher on close, field switch, or UI reset.

## Current Reference (Alerts Suricata Subnets)
- JS:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/script.js`
  - `syncSuricataSubnetJumpButton`
  - `syncSuricataSubnetProjectScrollState`
  - `startSuricataSubnetScrollWatch` / `stopSuricataSubnetScrollWatch`
  - `startSuricataSubnetJumpSync` / `stopSuricataSubnetJumpSync`
- CSS:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`
  - `.suri-subnet-project-shell`
  - `.suri-subnet-project-list`
  - `.suri-subnet-jump-button.up`
  - `.suri-subnet-jump-button.down`

## Apply Checklist
- Add overlay arrows inside list shell, not outside panel.
- Wire native list scroll updates to edge-state sync.
- Add/clean RAF watcher lifecycle for open/close.
- Validate all four states: no overflow, top, middle, bottom.
- Validate both input paths: manual scroll and arrow jump clicks.
