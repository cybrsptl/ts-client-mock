# Timeline

## Figma References
- Toolbar: `2576:19286`
- Minimap + viewport: `2576:17167`
- Time markers: `2576:17168`
- Swimlane: `2576:17169`
- Sidebar: `2576:17161`

## What It's For
- Provide time-sequenced investigation, packet carving, and timeline-scoped export for the active project.

## Purpose
- Time-based investigative surface for event sequencing, packet carving, and timeline-scoped export.

## Connected Features
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Timeline validates whether alert hits correspond to real event sequences.
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md) and [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md)
  - Timeline provides the temporal view of the entities and connections those tabs expose.
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
  - Timeline selection should be available to Inspector when that helps validation.

## Current Interaction Model
- Timeline is a dedicated bottom surface with its own tab strip.
- Supports zoom, pan, selection marquee, selection ribbon, and export scope.
- Minimap and packet-carving behavior are documented in dedicated deep-dive docs.

## Deep-Dive Docs
- [Timeline Minimap](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/minimap.md)
- [Timeline Packet Carving](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/packet-carving.md)
- [Timeline Selection Recovery Criteria](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/selection-recovery-criteria.md)

## State Model
- Save-worthy:
  - panel height/width sizing
  - any future pinned timeline filters (not finalized)
- Ephemeral:
  - active packet-carving selection
  - temporary zoom drag interactions
- Not yet decided:
  - whether timeline zoom level should be persisted by default in saved view snapshots

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [timeline.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/timeline/timeline.css)
- JS:
  - [timeline-feature.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/timeline/timeline-feature.js)
  - [app-init.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/app-init.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Open Questions
- Should timeline selection synchronize with Alerts/Flows selections by default?
- Which timeline controls should be snapshot-persistent vs ephemeral?

## Known Issues
- Minimap behavior still being tuned in iterative steps.
