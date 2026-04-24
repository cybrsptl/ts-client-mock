# Timeline Packet Carving

## Source Reference
- Interaction source:
  - `/Users/renzdupitas/Desktop/timeline-selection-wireframe.html`
- Timeline shell Figma references:
  - toolbar: `2576:19286`
  - minimap + handlebar: `2576:17167`
  - time markers: `2576:17168`
  - swimlane: `2576:17169`
  - sidebar: `2576:17161`
- Minimap behavior reference:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/TIMELINE V3`
- Separate minimap feature doc:
  - [Timeline Minimap](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/minimap.md)
- Selection recovery criteria:
  - [Timeline Selection Recovery Criteria](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/selection-recovery-criteria.md)

## Current Prototype Scope
- Timeline supports:
  - fixed toolbar controls that do not move when the timeline zooms
  - time markers that scroll horizontally with the swimlanes
  - 32px swimlanes aligned to 32px sidebar rows
  - drag marquee selection across event rows
  - selected event highlighting
  - left/right time boundaries for the selected interval
  - selection ribbon with duration, event count, inline clear action, and offscreen recovery action
  - right-click context menu for packet-carving actions
  - export dropdown with `All Traffic` and `Selection` scope

## Scope Boundary
- This doc is for packet-carving selection behavior.
- Minimap and viewport behavior now live in:
  - [Timeline Minimap](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/minimap.md)

## Current State Decision
- Packet-carving selection is treated as `ephemeral`.
- Rationale:
  - it behaves like investigative working state
  - it would create dirty-state noise if every selection triggered Save
  - export is the explicit commit action, not the selection itself

## Current UX Assumptions
- `Esc` should close packet-carving menus first, then clear the selection.
- Switching Views should clear the active packet-carving selection.
- Export scope `Selection` should only be enabled when a selection exists.
- The clear action lives on the selection ribbon, not in the context menu.
- If the selected range drifts offscreen, recovery should stay attached to the ribbon via a directional jump action instead of moving to a distant footer.
- Recovery should use a smooth slide back to the selection, not a hard snap.
- The recovery arrow should appear once the first boundary is meaningfully clipped, using a small threshold to avoid flicker.
- If both selection boundaries are offscreen because the selected range is larger than the viewport, the recovery arrow should hide instead of persisting ambiguously.
- The arrow direction indicates which boundary is clipped, but clicking it recenters on the selected traffic midpoint instead of hopping boundary-to-boundary.

## Open Questions
- Should selection also drive synchronized highlighting in Hosts, Flows, or Inspector?
- Should comments/annotations created from the selection become save-worthy artifacts?
- Should the selected time window be pin-able into a saved View as an explicit timeline filter?
