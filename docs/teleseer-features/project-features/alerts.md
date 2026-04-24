# Alerts

## Figma References
- Table + toolbar: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=2764-46788&m=dev`
- Expanded row: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=5258-166217&t=xbM7vNfOtYG40aco-11`
- Drawer default/edit: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=6015-169131&t=EkyzFHMzIPnLZ2hh-11`, `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=6014-168153&t=EkyzFHMzIPnLZ2hh-11`
- Rule patterns detail: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=6038-178151&t=EkyzFHMzIPnLZ2hh-11`

## What It's For
- Present grouped detections for analyst triage inside the active project.
- Give analysts a path from detection summary to rule inspection and rule maintenance.

## Purpose
- Present grouped detections for analyst triage.
- Support quick expansion into event-level evidence.
- Provide rule-management controls through `Manage Rules` with provider-specific drawer behavior.

## Connected Features
- [Manage Rules](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/manage-rules.md)
  - Alerts owns the rule-operations workflow.
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md) and [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Alert entities should be explainable through host and flow evidence.
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Timeline provides event sequence validation for alert hits.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Alert quality depends on ingest quality and feed filtering.

## Current Interaction Model
- Toolbar supports alert query filtering and opens `Manage Rules`.
- Table rows show stacked name cell, meta chips, hosts chip, relative time fields, and count bar.
- Hosts chip opens searchable host menu scoped to the row.
- Row expansion renders tree-line + nested event table + collapse row.
- `Manage Rules` opens rule list + rule drawer.
- Drawer supports default/read-only mode and edit mode with scoped controls and YAML guard.
- Suricata Source/Destination Subnets use an in-list jump-overlay pattern for dense subnet lists:
  - full-width top/bottom overlay triggers inside the list shell
  - edge-aware arrow state from actual list scroll position
  - middle state explicitly shows both arrows
  - reference: [Scroll Jump Overlay Pattern](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/ui-features/patterns/scroll-jump-overlay-pattern.md)

## Provider Model (Current Assumption)
- Teleseer-native rules:
  - include editable description content in drawer
  - support Teleseer-managed parameter presets
- Suricata rules:
  - prioritize rule name + metadata + structured rule parameter blocks
  - no editable freeform description block in drawer content
- Both providers should stay synchronized with the same rule enable/disable truth source.

## State Model
- Save-worthy:
  - rule-level changes (enabled, schedule, thresholds, protocol/subnet filters)
  - selected version or provider-specific rule params
- Ephemeral:
  - table expansion state
  - hosts dropdown open/search
  - combobox open states
  - drawer local edit draft before save
- Not yet decided:
  - which toolbar filters become persisted view state vs session-only

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
  - [alert-modal.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/alerting-modal/alert-modal.html)
- CSS:
  - [alerts.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/styles/alerts.css)
  - [alerting-modal/style.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/alerting-modal/style.css)
- JS:
  - [alerts-feature.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js)
  - [alerting-modal/script.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/alerting-modal/script.js)

## Open Questions
- Should clicking a meta chip in table deep-link to exact rule drawer section/version in `Manage Rules` every time?
- Which alert query/filter chips are part of saved view snapshots?
- Should provider-specific drawer differences be strictly schema-driven in one renderer or split renderer modules?

## Known Issues
- Some drawer controls are still represented as prototype-level controls and not yet mapped to a finalized shared component contract.
