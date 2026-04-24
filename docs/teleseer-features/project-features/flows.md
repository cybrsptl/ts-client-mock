# Flows

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Flows-tab detailed nodes: pending

## What It's For
- Investigate connection-level behavior, peer relationships, and lateral movement inside the active project.

## Purpose
- Investigate connection-level behavior and lateral movement evidence.
- Provide sortable, filterable flow-centric triage inside the active workspace/project context.

## Connected Features
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md)
  - Host analysis and flow analysis should reinforce each other.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Alerted behavior should be traceable to concrete flows when possible.
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Timeline validates when and how flows occurred over time.
- [Network Map](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/network-map.md)
  - Map shows topology context; Flows shows connection evidence.

## Current Interaction Model
- Flows tab is available in workspace strip (`data-panel-tab="flow"`).
- Current prototype wiring supports tab activation and view persistence primitives.
- Dedicated flow-table interactions are not yet split into a separate flow feature module.

## State Model
- Save-worthy:
  - tab visibility/selection as part of view state
  - future pinned flow filters (expected)
- Ephemeral:
  - row hover/focus, temporary sorting while exploring
- Not yet decided:
  - whether flow sort/grouping presets are persisted by default

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Open Questions
- Should flow row selection synchronize to timeline selection boundaries?
- What is the minimal persisted flow filter set for saved views?

## Known Issues
- Flow-specific UI is currently represented only at tab-shell level.
