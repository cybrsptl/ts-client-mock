# Network Map

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Sidebar context node: `2526:55793`
- Network-map-specific interaction states: pending dedicated links

## What It's For
- Provide topology-level triage and situational orientation for the active project.

## Purpose
- Primary investigation surface for topology-level triage.
- Shows current investigation context (selection, host/flow volume, and layout mode) before deeper drilldown.

## Connected Features
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md)
  - Map selection should connect directly to host-centric investigation.
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Map gives structural context; Flows gives connection evidence.
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
  - Map-driven selection should enrich Inspector.
- [Dashboard](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/dashboard.md)
  - Dashboard can summarize posture, but Network Map is the primary structural analysis surface.

## Current Interaction Model
- Default active tab in main workspace strip.
- Displays map summary metrics and selection context.
- Participates in panel-layout toggles (`balanced`, `dashboard-focus`, `map-only`).
- Switching away preserves view-level snapshot semantics.

## State Model
- Save-worthy:
  - pinned filter
  - selection mode/selection label
  - panel visibility/layout from the active view snapshot
- Ephemeral:
  - temporary hover/inspection states
  - transient drill context not explicitly committed
- Not yet decided:
  - exact persistence behavior for map camera/zoom once map implementation is full fidelity

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)
  - [app-init.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/app-init.js)

## Open Questions
- Which map controls should be persisted per view vs session-only?
- Should map-driven selection always update Inspector immediately or only on explicit commit?

## Known Issues
- Current map panel is summary-oriented and not yet a full topology renderer.
