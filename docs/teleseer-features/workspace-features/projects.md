# Projects

## What It's For
- Projects are the investigation units inside a workspace.
- They give analysts a bounded case context for hosts, flows, alerts, timeline evidence, and saved views.

## Purpose
- Separate one investigation from another without losing shared workspace context.
- Provide the handoff object between Launcher and Viewer.
- Keep evidence, views, and analysis state scoped to the correct project.

## Connected Features
- [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md)
  - Projects are selected from Launcher.
- [Viewer](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/viewer.md)
  - Viewer renders one project at a time.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Feeds produce the ingest that projects analyze.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md), [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md), [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md), and [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - These surfaces are project features, not workspace features.

## Architectural Rule
- Workspace context chooses what projects exist.
- Project context chooses what evidence and analysis surfaces are visible inside Viewer.
