# Project File Map

## Purpose
- Keep runtime ownership explicit.
- Prevent feature changes from drifting into the wrong files.

## Runtime Structure

### Entry HTML
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/viewer.html`
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/alert-modal.html`

### CSS
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/buttons.css`
  - shared button system (`btn-secondary`, `btn-secondary-icon`, `btn-primary`)
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/sidebar.css`
  - shared sidebar source-of-truth (`sidebar-item-row`, `sidebar-section-header`, `count-container`, `cta-container`)
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/ui-primitives.css`
  - shared component source-of-truth for drawer-style controls, segmented controls, tertiary buttons, chips, teletext, badges, and status badges
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/base.css`
  - viewer shell, sidebar, tabs, menus, shared layout primitives
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/styles/hosts.css`
  - hosts toolbar/table surface styles
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/styles/alerts.css`
  - alerts table, expanded rows, and inline alerts interactions
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/timeline/timeline.css`
  - timeline surface, minimap, selection ribbon, export menus
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`
  - manage-alerts modal and drawer styles
  - consumes shared sidebar SOT from `../shared/styles/components/sidebar.css` for sidebar row/section semantics

### JavaScript
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
  - canonical state model, snapshot normalization, dirty-state helpers
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - shared render/menu/tab helpers and icon utility markup
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-tree.js`
  - sidebar tree rendering and row composition
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-sot.js`
  - sidebar component contract helpers for semantic row state + count/CTA containers
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-actions.js`
  - sidebar create/rename/delete/reorder/toggle and hierarchy rules
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/viewer-hosts.js`
  - viewer topbar + workspace panel + hosts rendering
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/timeline/timeline-feature.js`
  - timeline data, selection, minimap/viewport, export/context menu behavior
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js`
  - alerts tab rendering, expanded rows, rule sidebar/drawer interactions
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
  - activation/save/revert wiring, panel resizing, global event bootstrapping
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/icon-registry.js`
  - icon hydration for `.svg-icon` markup
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/script.js`
  - alerting modal bootstrap
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/core-runtime.js`
  - shared alerting modal utilities: icon path resolution, shared icon constants, HTML escaping, and state cloning
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/table-runtime.js`
  - extracted alerting modal table layout, column resize state, and row-height measurement helpers
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`
  - extracted drawer state, accordion state, drawer field controls, and Suricata/default-alert drawer rendering lifecycle
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/rule-scope-runtime.js`
  - extracted Rule Scope data, picker state, chipbox behavior, and inline menu rendering for the alerting modal
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/variables-runtime.js`
  - extracted variable view state, content actions, table rendering, and inline variable value menu behavior
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/modal-ui-runtime.js`
  - extracted modal-level menus, combobox helpers, dialogs, toast behavior, click-away handling, and resize wiring
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/content-browser-runtime.js`
  - extracted sidebar data, category selection, rule catalog generation, content list rendering, search, and pagination state

## Documentation Structure

### Product/Figma Context
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-context.md`
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/figma-context.md`

### Teleseer Feature Coverage
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/README.md`
- container docs in `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/`
- workspace feature docs in `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/`
- project feature docs in `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/`

### UI Feature Coverage
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/ui-features/README.md`
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/ui-features/ownership/tab-function-map.md`
- UI interaction pattern docs in `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/ui-features/patterns/`

### Sidebar-Only Coverage
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/sidebar-system/README.md`
- `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/sidebar-system/function-map.md`

## Cleanup Notes
- Removed legacy runtime bundle (no active runtime references remain).
- Legacy sidebar docs were consolidated into `docs/sidebar-system/`.
