# Artifacts

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Artifact-tab detailed nodes: pending

## What It's For
- Surface extracted evidence objects tied to the current project investigation.

## Purpose
- Surface extracted evidence objects (files, indicators, payload-derived artifacts) tied to the current investigation scope.

## Connected Features
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Alerts can create or point to artifacts worth preserving.
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md) and [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Traffic investigation can produce extracted payloads or evidence objects.
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
  - Inspector should help validate artifact context without forcing a tab switch for every check.

## Current Interaction Model
- Artifacts tab exists in the main tab strip.
- Uses shared tab activation and snapshot behavior.
- Dedicated artifact workflows are not yet implemented in a standalone feature module.

## State Model
- Save-worthy:
  - tab activation state in the active view
  - future persisted artifact filters/sorts
- Ephemeral:
  - temporary inspection, hover details, transient search drafts
- Not yet decided:
  - artifact pinning/bookmark behavior per view

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Open Questions
- Which artifact actions (tag/export/comment) are part of save-worthy view context vs independent artifact records?
- Should artifact filters be inherited from Alerts/Flows context when navigated from those tabs?

## Known Issues
- Artifact interactions are currently placeholder-level.
