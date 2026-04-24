# Roles

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Roles-specific frame/state links: pending

## What It's For
- Provide workspace access and operational governance context.

## Purpose
- Workspace role and access context surface for operational governance.
- Intended to expose role definitions/assignment posture within the investigation workspace.

## Connected Features
- [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md)
  - Workspace role posture should be visible from the workspace container.
- [Projects](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/projects.md)
  - Roles constrain who can access or modify projects.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Roles also constrain ingest operations and feed maintenance.

## Current Interaction Model
- Roles tab exists in main tab strip (`data-panel-tab="roles"`).
- Current prototype behavior is tab activation only.
- No dedicated roles management table/form module in this prototype yet.

## State Model
- Save-worthy:
  - active tab selection in the view snapshot
- Ephemeral:
  - UI hover/menu states when implemented
- Not yet decided:
  - how role filters/search/sort should persist relative to security policy constraints

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Open Questions
- Should role edits be available in Viewer prototype scope or delegated to a separate admin surface?
- How should federation RBAC boundaries appear in this tab?

## Known Issues
- Roles tab is currently a structural placeholder only.
