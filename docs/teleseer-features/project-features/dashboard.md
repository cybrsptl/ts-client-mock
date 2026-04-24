# Dashboard

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Dashboard-specific nodes: pending

## What It's For
- Provide a fast posture read for the active project before analysts drill into evidence-heavy tabs.

## Purpose
- Provide high-signal summary metrics for operator posture and trend checks.
- Acts as a monitoring-first surface, complementary to deep investigative tabs.

## Connected Features
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Dashboard summaries are downstream of ingest health and volume.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md), [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md), and [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Dashboard summarizes what those deeper features explain in detail.
- [Viewer](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/viewer.md)
  - Dashboard is a project surface inside Viewer, not a standalone workspace page.

## Current Interaction Model
- Dashboard tab exists in workspace tab strip.
- View snapshots already include dashboard-oriented presets (`layout: dashboard-focus`, pinned filter examples in state).
- No dedicated dashboard module yet; current behavior is shell/state driven.

## State Model
- Save-worthy:
  - dashboard-focused layout presets
  - pinned dashboard filters from saved views
- Ephemeral:
  - hover/tooltips and temporary chart cursor states
- Not yet decided:
  - which dashboard widget customizations are persisted per view

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)

## Open Questions
- Should dashboard widget arrangement be view-specific or global workspace preference?
- Should dashboard filters sync bidirectionally with map/alerts filters?

## Known Issues
- Dashboard implementation is currently limited to state presets and shell-level placeholders.
