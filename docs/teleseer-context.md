# Teleseer Context

## Source References
- Official docs index: `https://www.cyberspatial.com/teleseer-documentation`
- Attached anatomy reference: `/Users/renzdupitas/Desktop/TELESEER ANATOMY.pdf`

## Product Framing
- Teleseer is a network investigation platform rather than a generic analytics dashboard.
- The core workflow is investigative and operational: users inspect, correlate, validate, and act on network evidence.
- The UI is intentionally dense and should support rapid analyst scanning under cognitive load.

## Confirmed Surface Model
- Official docs identify the main investigation shell and companion surfaces:
  - Viewer
  - Inspector
  - Timeline
- The working product model in this repo also requires a workspace container and workspace feature layer:
  - Launcher as the workspace container
  - Projects as the project-selection layer
  - Feeds and roles as workspace-scoped operational features
- Project-scoped analysis surfaces include:
  - Network map / topology
  - Inventory / Hosts
  - Flows
  - Alerts
  - Dashboard
  - Artifacts
  - Inspector
  - Timeline
  - World / geo context

## Domain Notes From References
- Projects live within a workspace context.
- Uploads can originate from the workspace or inside a project.
- Network topology groups hosts into VLANs and subnets.
- Inventory and external host views are tabular and selection-driven.
- Inspector content updates based on the current selection.
- Timeline represents interactive event traffic within the current file set or selected hosts.
- The attached anatomy PDF suggests operational states such as queued ingestion, durations, storage usage, interfaces, and mixed data source types.

## Container Model
- `Launcher` is the workspace container.
  - It owns workspace entry, project listing, feed operations, and workspace administration posture.
- `Viewer` is the project container.
  - It owns project-scoped investigation and hosts the analysis surfaces.
- `Inspector` and `Timeline` are companion surfaces inside the Viewer investigation model.
- Workspace context must hand off into project context without blurring the boundary between them.

## Feature Relationship Model
- `Projects` connect Launcher to Viewer.
- `Feeds` supply the data that downstream project features analyze.
- `Dashboard` summarizes posture but does not replace evidence surfaces.
- `Network Map`, `Hosts`, `Flows`, `Alerts`, `Artifacts`, `World`, `Inspector`, and `Timeline` are all different lenses on the same project evidence.
- `Manage Rules` is part of the Alerts operating model:
  - it is not just a modal pattern
  - it exists because alert triage and rule maintenance are tightly connected
- `Roles` constrain which workspace and project operations are available.

## Design Implications
- Workspace context must remain explicit in navigation and page state.
- Selection state is critical because downstream panels depend on it.
- Dense tables, tree views, and inspector-driven drilldown are expected, not edge cases.
- Loading and partial-processing states are first-class product states, especially for ingest and analysis surfaces.
- Federation, sync, and RBAC should be represented as concrete state boundaries rather than implied background mechanics.

## Guidance For Future Tasks
- Prefer domain-authentic labels, metrics, and host naming.
- Include real operational imperfections in prototype data.
- Treat hidden state transitions as risks to be surfaced early.
- If behavior is not specified, choose the safest assumption that preserves workspace isolation, project scope, and analyst muscle memory.
