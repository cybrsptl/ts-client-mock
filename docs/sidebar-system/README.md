# Sidebar System

## Scope
- This documentation is only for the Viewer sidebar View-management feature.
- It covers sidebar hierarchy, row actions, restrictions, dirty/save behavior, and function ownership.
- It does not define Timeline, Alerts, Hosts, or other tab-specific UI behavior.

## Runtime Ownership
- HTML anchors:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/viewer.html`
    - `#sidebarShell`, `#tree`, `#filterViewsInput`, `#clearFilterButton`, `#toggleSidebarTop`, `#toggleSidebarSide`, `#saveMenuButton`
- CSS:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/base.css`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/buttons.css`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/sidebar.css`
- JS:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-sot.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-accordion-icons.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-tree.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-actions.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`

## Hierarchy And Restrictions
- Allowed tree shape:
  - `Collection -> Folder -> Sub Folder -> View`
- Rules:
  - Root can only contain `Collection`.
  - `Collection` can contain `Folder` or `View`.
  - `Folder` can contain `Sub Folder` or `View`.
  - `Sub Folder` can contain `View` only.
  - `View` is always a leaf.
  - The default Collection is fixed and cannot be deleted.
  - `Collection` rows are section headers, not folder rows.
  - Maximum supported nesting depth is `Collection -> Folder -> Sub Folder -> View`.

## Row Actions
- Collection:
  - `Add` menu: `New View`, `New Folder`
- Folder:
  - `Add` menu: `New View`, `New Sub Folder`
  - `More` menu: `Rename`, `Delete`
- Sub Folder:
  - `Add` menu: `New View`
  - `More` menu: `Rename`, `Delete`
- View:
  - `More` menu: `Rename`, `Duplicate`, `Save as New View`, `Delete`

## Save Model
- Library metadata is immediate-save:
  - Create, rename, delete, move/reorder operations write directly to the in-memory tree/view map and are treated as committed library changes.
- Snapshot changes are dirty-save:
  - Viewer layout, panel sizes, active tabs, and other snapshot patches create or update a working copy.
  - These require explicit `Save` or `Save as New View`.

## What Causes Dirty State
- Dirty state is created through snapshot mutation helpers:
  - `setDirtyPatch(...)`
  - `setPanelSizesPatch(...)`
- Current concrete examples:
  - panel resize drag updates
  - panel/tab visibility and active tab changes
  - save-worthy scope changes like hosts mode switches

## What Does Not Cause Dirty State
- Tree/library structure operations (create/rename/move/delete)
- Hover state, scroll, menu open state
- temporary UI state that does not patch the working snapshot

## Save Controls And Indicators
- Save control:
  - topbar save button/menu uses `Save`, `Save as New View`, `Revert Changes`
- Dirty indicator behavior:
  - when leaving a dirty active view, unsaved working copy is parked for the session
  - parked views show a blue dot in the sidebar
- Revert behavior:
  - `Revert Changes` drops the working copy and restores the saved snapshot

## Sidebar Component And Icon Contract
- Sidebar items and section headers must use source-of-truth contracts:
  - structural classes: `sidebar-item-row`, `sidebar-item`, `sidebar-section-header`
  - state flags: `is-active`, `is-expanded`, hover via CSS
  - right-side wrappers: `count-container` and `cta-container`
- CTA container contract:
  - wrapper class `cta-container` with `4px` padding and `4px` gap
  - holds one or more `24px` secondary ghost icon buttons
- Count contract:
  - count text must sit inside `count-container` to keep spacing stable across states
- Row action buttons use secondary icon button classes:
  - `btn-secondary-icon size-s style-ghost`
- Tree icons:
  - Folder/Sub Folder: `icon_folder.svg` at rest
  - Folder/Sub Folder with children: arrow-head affordance on hover (`icon_arrow_head_right.svg` or `icon_arrow_head_down.svg`)
  - View: `icon_layout_right.svg`
  - Row actions: `icon_add.svg`, `icon_meatball.svg`

## Known Constraints
- The tree currently uses prompt/confirm for some create/delete flows in prototype mode.
- Dirty working copies are session-scoped prototype behavior.
- Backend persistence and federation-aware conflicts are not implemented in this prototype.

## Related Docs
- Function ownership:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/sidebar-system/function-map.md`
- Tab/surface function coverage:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/ui-features/ownership/tab-function-map.md`
