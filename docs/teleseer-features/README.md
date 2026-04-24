# Teleseer Features

## Purpose
- Separate actual Teleseer product features from reusable UI behavior docs.
- Make container scope explicit:
  - `Launcher` is the workspace container.
  - `Viewer` is the project container.
- Explain what each feature is for, why it exists, and which other Teleseer features it depends on.

## Container Layer
- [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md)
  - Workspace entry point for projects, feeds, role posture, and workspace-level operations.
- [Viewer](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/viewer.md)
  - Project investigation shell that hosts the analysis surfaces.

## Workspace Features
- [Projects](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/projects.md)
  - Defines the investigation units analysts open from Launcher into Viewer.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Defines the ingest sources that power downstream project analysis.
- [Feeds Product Spec](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds-product-spec.md)
  - Concrete object model, ownership boundaries, and prototype iteration rules for capture feeds.
- [Roles](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/roles.md)
  - Defines workspace access and operator boundaries.

## Project Features
- [Dashboard](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/dashboard.md)
- [Network Map](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/network-map.md)
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md)
- [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
- [Manage Rules](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/manage-rules.md)
- [Artifacts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/artifacts.md)
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
- [World](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/world.md)

## Feature Relationship Model
- Launcher owns workspace context. Viewer must never exist without a project launched from that workspace.
- Projects connect workspace-level ingest and permissions to project-level investigation surfaces.
- Feeds provide the data supply chain for Alerts, Hosts, Flows, Timeline, Dashboard, and Artifacts.
- Alerts depend on detections and rule logic; Manage Rules is an Alert-owned operational feature for controlling that logic.
- Hosts, Flows, Network Map, World, Timeline, and Inspector are selection-linked surfaces:
  - selection in one surface should be treated as meaningful context for the others.
- Dashboard summarizes posture; it should never replace the investigative surfaces that validate the underlying evidence.

## Working Rule
- Product behavior belongs under `docs/teleseer-features/`.
- Reusable UI behavior, interaction patterns, and ownership maps belong under `docs/ui-features/`.
