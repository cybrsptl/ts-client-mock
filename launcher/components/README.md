# Launcher Source Of Truth Components

## Scope
- `sidebar-components.js`
  - Source of truth renderer for Launcher sidebar rows and sidebar accordion behavior.
  - Exposes `renderNav` and `renderAccordion`.
  - Applies to Launcher sidebar items only.
  - Does **not** apply to Timeline sidebar items.
- `table-components.js`
  - Source of truth fixed-table renderer used by Launcher surfaces.
  - Current consumers: Projects, Files, Feeds, Sensors.

## Contract
- Launcher runtime calls these through `window.LauncherSidebarSOT` and `window.LauncherTableSOT`.
- Section data remains in `launcher/launcher.js`.
- Visual semantics can be changed later without duplicating rendering logic per section.
