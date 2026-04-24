# Tab Function Map

## Purpose
- Keep function ownership clear per tab/surface.
- Reduce regressions when changing one tab while preserving others.

## Workspace Tabs (Main Strip)

### Network Map
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/viewer-hosts.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`
  - `renderViewerState()`

### World
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`

### Hosts
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/viewer-hosts.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `renderHostsTable(snapshot)`
  - `setStatusBadge(element, label, status)`
  - hosts scope control handler in `app-init.js` (`[data-host-scope]` click wiring)
  - `setDirtyPatch(patch, reasonLabel)`

### Flows
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`

### Artifacts
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`

### Dashboard
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`

### Alerts
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/script.js`
- Core functions:
  - `renderAlertsTable(snapshot, forcedActiveMainTab)`
  - `buildAlertRowMarkup(group, maxCount)`
  - `buildExpandedEventsMarkup(group)`
  - `openManageModal(ruleId, openDrawer)`
  - `renderRuleGroups()`
  - `renderRuleTable()`
  - `renderDrawer()`
  - `saveDrawerChanges()`
  - `initAlertsFeature()`
  - Suricata subnet jump-overlay controls (in `alerting-modal/script.js`):
  - `syncSuricataSubnetJumpButton(field)`
  - `syncSuricataSubnetProjectScrollState(field, element)`
  - `startSuricataSubnetScrollWatch(field)` / `stopSuricataSubnetScrollWatch()`
  - `startSuricataSubnetJumpSync(field, targetEdge)` / `stopSuricataSubnetJumpSync(field)`

### Roles
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/ui-core.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `setActivePanelTab(stripId, tabId)`
  - `render()`

## Companion Surfaces

### Inspector
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/viewer-hosts.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `renderViewerState()`
  - panel resize handlers in `app-init.js` (`beginPanelResize`, `handlePanelResizeMove`, `endPanelResize`)
  - `setPanelSizesPatch(patch)`

### Timeline
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/timeline/timeline-feature.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `buildTimelineData()`
  - `renderTimelineRuler()`
  - `renderTimelineTracks()`
  - selection lifecycle: `clearTimelineSelection`, `updateTimelineSelectionUI`, `finalizeTimelineSelection`
  - zoom and viewport: `setTimelineZoomLevel`, `applyTimelineZoom`, `setTimelineViewportByMinimap`, `syncTimelineViewport`
  - selection recovery: `getTimelineSelectionOffscreenDirection`, `updateTimelineSelectionJumpState`, `recenterTimelineSelection`

## Cross-Cutting View Management
- Files:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/app-init.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/state-core.js`
- Core functions:
  - `activateView(viewId)`
  - `saveActiveView()`
  - `saveAsNewView(sourceViewId)`
  - `revertActiveView()`
  - `isViewDirty(view)`
  - `setDirtyPatch(...)`
  - `setPanelSizesPatch(...)`
