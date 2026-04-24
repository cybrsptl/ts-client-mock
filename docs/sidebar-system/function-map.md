# Sidebar System Function Map

## Purpose
- Track sidebar-related runtime functions and ownership in one place.
- Prevent context loss when editing save logic, hierarchy rules, or row actions.

## Sidebar Tree Rendering (`sidebar-tree.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-tree.js`
- Core functions:
  - `renderTree()`
  - `getFilteredTree(nodes, query)`
  - `renderNode(node, depth, siblings, index)`
  - `getRowActions(node)`
  - `buildAddMenu(node)`
  - `buildContextMenu(node)`
  - `getNodeIconMarkup(node)`
  - `renderLabelContent(node)`
  - `countViews(node)`
- Responsibility:
  - Build tree DOM, apply row variants/icons, wire row-level click/drag/menu entry points.

## Sidebar Accordion Icon Primitives (`sidebar-accordion-icons.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-accordion-icons.js`
- Core functions:
  - `renderTreeFolderToggle(options)`
  - `renderAlertSidebarToggle(options)`
- Responsibility:
  - Provide shared accordion icon swap markup (default icon, hover arrow, expanded arrow direction) so sidebar icon behavior stays consistent across sidebar surfaces.

## Sidebar Component Contract Helpers (`sidebar-sot.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-sot.js`
- Core functions:
  - `applyRowSemantics(rowEl, options)`
  - `createCountContainer(value)`
  - `createCtaContainer(baseClassName)`
  - `rowLevelFromVariant(variant)`
- Responsibility:
  - Enforce source-of-truth class/state shape for sidebar rows, count wrappers, and CTA wrappers.

## Sidebar Mutations And Rules (`sidebar-actions.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-actions.js`
- Core functions:
  - `addChildNode(parentNode, actionLabel)`
  - `renameNode(nodeId)`
  - `commitInlineRename(nodeId)`
  - `deleteNode(nodeId)`
  - `duplicateView(viewId)`
  - `removeNode(nodeId, nodes)`
  - `insertNodeIntoParent(parentId, node)`
  - `canBeChildOf(childType, parentType)`
  - `canNest(dragId, targetId)`
  - `canPlaceRelative(dragId, targetId)`
  - `moveNodeInto(dragId, targetId)`
  - `moveNodeBefore(dragId, targetId, logMove)`
  - `moveNodeAfter(dragId, targetId, logMove)`
  - `detachNode(nodeId, nodes)`
  - `toggleSidebar()`
- Responsibility:
  - Enforce hierarchy constraints and execute tree mutations.

## View Activation And Save Actions (`app-init.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
- Core functions:
  - `activateView(viewId)`
  - `saveActiveView()`
  - `saveAsNewView(sourceViewId)`
  - `revertActiveView()`
- Responsibility:
  - Apply views, park unsaved changes, commit snapshots, and restore saved state.

## Sidebar State Helpers (`state-core.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `walkNodes(nodes, visitor, parent, depth)`
  - `getNodeById(id, nodes, parent)`
  - `getView(viewId)`
  - `getCurrentView()`
  - `getEffectiveSnapshot(view)`
  - `cloneSnapshot(snapshot)`
  - `isViewDirty(view)`
  - `getDirtyReasons(view)`
  - `ensureWorkingCopy(view)`
  - `setDirtyPatch(patch, reasonLabel)`
  - `setPanelSizesPatch(patch)`
- Responsibility:
  - Maintain view model, dirty logic, and snapshot patching.

## Shared Menu Wiring (`ui-core.js`)
- File:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
- Core functions used by sidebar:
  - `openMenu(anchorEl, items, saveMenu)`
  - `closeMenus()`
  - `iconImg(src)`
  - `svgMaskMarkup(src, extraClass)`
  - `collectionArrowSvg(direction)`
- Responsibility:
  - Shared menu and icon utilities consumed by sidebar tree/actions.

## Change Safety Checklist
- Before editing hierarchy rules, verify updates in:
  - `canBeChildOf`, `canNest`, `canPlaceRelative`, and add-menu options.
- Before editing save/dirty rules, verify updates in:
  - `setDirtyPatch`, `setPanelSizesPatch`, `activateView`, `saveActiveView`, `revertActiveView`.
- Before changing row actions or iconography, verify updates in:
  - `getRowActions`, `buildContextMenu`, `getNodeIconMarkup`, and relevant button/icon classes.
