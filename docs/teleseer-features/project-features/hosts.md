# Hosts

## Figma References
- Internal:
  - `https://www.figma.com/design/urN69MbazLG0PbIwphsuhw/Hosts?node-id=833-15696&m=dev`
- External:
  - `https://www.figma.com/design/urN69MbazLG0PbIwphsuhw/Hosts?node-id=835-21244&m=dev`

## What It's For
- Provide host-centric investigation for internal and external entities in the active project.

## Purpose
- Provide host-centric investigation for internal and external entities.
- Let analysts switch host scope quickly while preserving view-state behavior.

## Connected Features
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Hosts explain who is involved; Flows explains how they communicated.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Alert entities should resolve cleanly into host context.
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
  - Host selection should enrich Inspector immediately.
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Host-scoped timeline investigation is a natural downstream action.

## Current Interaction Model
- Hosts is a main workspace tab.
- Toolbar includes search/filter token shell, sort, and segmented `Internal | External` scope.
- Scope switch changes table schema and data source.

## State Model
- Save-worthy:
  - `hostsScope` (`internal` or `external`) via view snapshot patching
- Ephemeral:
  - hover states, table scroll, non-committed transient interactions
- Not yet decided:
  - whether sort order and ad-hoc local filters should persist by default

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [hosts.css](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/styles/hosts.css)
- JS:
  - [viewer-hosts.js](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/viewer-hosts.js)
  - [app-init.js](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Function Entry Points
- `renderHostsTable(snapshot)`
- `setStatusBadge(element, label, status)`
- hosts scope click handler on `[data-host-scope]` (in `app-init.js`)
- `setDirtyPatch(patch, reasonLabel)`

## Open Questions
- Should sort order be save-worthy or ephemeral?
- Should host row selection drive Inspector dirty state or stay ephemeral?
- Should toolbar filters be persisted only when explicitly pinned?

## Known Issues
- Hosts behavior is functional but still tied to shared shell rendering instead of a fully isolated feature module.
