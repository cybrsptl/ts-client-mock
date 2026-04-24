# Inspector

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Inspector-specific variants: pending dedicated links

## What It's For
- Provide the validation surface for whatever the analyst currently has selected inside Viewer.

## Purpose
- Context panel that reflects current selection from workspace surfaces.
- Supports rapid validation (`Investigate -> Correlate -> Validate -> Act`) without leaving active tab context.

## Connected Features
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md), [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md), and [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Inspector should respond to their selections.
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Timeline selection should be able to drive Inspector context where useful.
- [Viewer](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/viewer.md)
  - Inspector is a Viewer companion surface, not a separate application shell.

## Current Interaction Model
- Inspector is its own surface strip (`data-surface="inspector"`).
- Width is resizable and part of panel-size state.
- Inspector summary fields change with active snapshot and selection context.
- Exists as always-available companion panel in balanced layouts.

## State Model
- Save-worthy:
  - inspector width (`panelSizes.inspectorWidth`)
  - view snapshot context fields (`inspectorEntity`, tabs)
- Ephemeral:
  - transient local interaction states inside inspector widgets
- Not yet decided:
  - per-entity pinned inspector sections

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
- Should inspector tab content be tab-specific (Hosts/Alerts/Flows) or always unified by selection type?
- Should inspector local filtering be persisted across view switches?

## Known Issues
- Inspector content is currently summary-level and not yet tied to full per-tab detail schemas.
