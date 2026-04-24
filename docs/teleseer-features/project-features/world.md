# World

## Figma References
- Viewer shell root: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- World-tab-specific state links: pending

## What It's For
- Provide geographic context for project evidence that spans regions or external entities.

## Purpose
- Geographic/global context surface for traffic and entities across regions.
- Intended to complement local topology with wide-area operational posture.

## Connected Features
- [Network Map](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/network-map.md)
  - Network Map explains local structure; World explains geographic distribution.
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Geo context should be anchored by actual traffic evidence.
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md)
  - External host context often needs geographic framing.

## Current Interaction Model
- Present as a tab in main workspace strip.
- Activation routed through generic tab-strip state (`activePanelTabs.main`).
- Current prototype content is shell-level only (no dedicated world interaction module yet).

## State Model
- Save-worthy:
  - active tab selection at view level
- Ephemeral:
  - any temporary hover/popover behavior once implemented
- Not yet decided:
  - map region selections, geo layers, and geo filter persistence rules

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [base.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/base.css)
- JS:
  - [ui-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/ui-core.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Open Questions
- Should world-tab filters mirror network-map filters or remain independently scoped?
- How should federation boundaries be represented on geo overlays?

## Known Issues
- World tab is currently a structural placeholder.
