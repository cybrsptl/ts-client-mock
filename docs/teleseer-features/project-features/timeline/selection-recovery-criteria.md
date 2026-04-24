# Timeline Selection Recovery Criteria

## Purpose
- Define the behavior of the packet-carving selection ribbon, boundary lines, and recovery arrow.
- Give frontend a concrete implementation contract.
- Give Figma a clean interaction checklist to mock with real components instead of placeholder logic.

## Figma References
- Timeline shell:
  - toolbar: `2576:19286`
  - minimap + handlebar: `2576:17167`
  - time markers: `2576:17168`
  - swimlane: `2576:17169`
  - sidebar: `2576:17161`
- Selection ribbon:
  - current Viewer file does not expose a resolved ribbon node; use this criteria doc as the working source until a refreshed ribbon node is shared

## Scope
- In scope:
  - packet-carving selection boundaries
  - selection ribbon
  - clear action
  - recovery arrow behavior when selection is clipped horizontally
- Out of scope:
  - minimap zoom/viewport behavior
  - export menu contents
  - comments/annotations
  - save-worthy vs ephemeral decisions outside packet carving

## Interaction Intent
- Selection is an investigative temporary state.
- Recovery controls should help analysts recover context without interrupting exploration.
- Recovery should be lightweight and discoverable, but not noisy or persistent when it no longer helps.

## Frontend Criteria

### Selection Creation
- Dragging across timeline traffic creates a packet-carving selection.
- Selection highlights matching events inside the dragged range.
- Two vertical selection boundary lines appear:
  - one for the start of the selection
  - one for the end of the selection
- A ribbon appears near the selected range and shows:
  - selected duration
  - selected event count

### Selection Ribbon
- The ribbon is a compact chip, not a toolbar.
- The ribbon contains:
  - duration text
  - separator dot
  - event count text
  - clear action
- The clear action is:
  - a `24px` `button/secondary_icon`
  - `ghost` style
  - `X` icon only
- The clear action:
  - clears the current selection
  - does not open a menu
  - does not trigger export

### Clear Shortcut
- `Esc` remains the keyboard shortcut for clearing selection.
- `Esc` priority:
  - first close open timeline menus
  - if no timeline menu is open, clear the active selection
- The shortcut does not need visible inline text in the ribbon.
- If shortcut discoverability is needed later, use a tooltip, not a wider `Clear + Esc` button.

### Recovery Arrow
- The recovery arrow is a separate capsule, not part of the ribbon body.
- It should never visually overlap the ribbon.
- It should sit beside the ribbon with a fixed gap.
- It uses:
  - its own small floating container
  - a white chevron icon
- The arrow is icon-only.
- The arrow is a recovery affordance, not a new mode.

### When the Recovery Arrow Appears
- The recovery arrow appears when the first clipped boundary is meaningfully out of view.
- Use a threshold so it does not flicker when a line is only `1-2px` beyond the edge.
- Recommended threshold:
  - `16-24px`
- If only the left boundary is clipped:
  - show a left recovery arrow
- If only the right boundary is clipped:
  - show a right recovery arrow

### When the Recovery Arrow Hides
- Hide the recovery arrow when:
  - both boundaries are visible
  - there is no selection
  - both boundaries are offscreen because the selected range is larger than the current viewport
- This prevents the arrow from becoming a persistent false problem on very long selections.

### Recovery Arrow Click Behavior
- Clicking the recovery arrow should:
  - smoothly slide the timeline viewport
  - recenter on the selected traffic midpoint
- It should not:
  - snap instantly
  - jump boundary-to-boundary
  - toggle between left and right edges
- Arrow direction indicates which boundary is clipped.
- Arrow click behavior remains midpoint recentering.

### Boundary Lines
- Boundary lines should remain visible while selection exists.
- Their visual treatment should be subtle enough not to overpower the events.
- Boundary lines should not be the strongest element in the selection UI.
- Boundary labels should remain readable.

### Context Menu
- The packet-carving context menu should not contain `Deselect`.
- Clearing belongs to the ribbon and `Esc`.

### Footer
- There should be no footer-based selection recovery control.
- Recovery controls should stay attached to the selection area.

## Figma Mockup Checklist

### Components To Mock
- Ribbon body:
  - compact chip/floating surface
- Clear action:
  - `button/secondary_icon`
  - `S`
  - `ghost`
  - close icon
- Recovery arrow capsule:
  - separate floating chip/container
  - internal `button/secondary_icon`
  - `S`
  - likely `ghost` or `default` depending on contrast testing
  - white chevron icon

### States To Mock
- no selection
- selection fully in bounds
- selection clipped on left only
- selection clipped on right only
- long selection where both boundaries are offscreen
- hover on clear action
- hover on recovery arrow
- active/pressed state for recovery arrow

### Spacing / Behavior To Validate In Figma
- gap between recovery arrow capsule and ribbon
- arrow capsule alignment relative to ribbon
- ribbon clamping near viewport edges
- whether the recovery arrow should sit vertically centered with the ribbon
- whether boundary labels and ribbon ever visually compete

## Non-Goals
- Do not introduce `Fit Selection` for now.
- Do not auto-zoom or auto-reframe while the user is scrolling.
- Do not convert the ribbon into a large labeled action bar.

## Open Questions
- Should the recovery arrow use `ghost` or `default` style for strongest contrast in the timeline?
- Should the recovery arrow have a tooltip:
  - `Recenter selection`
  - or direction-aware copy such as `Reveal selection start/end`
- Should the threshold be fixed or scale slightly with zoom level?
