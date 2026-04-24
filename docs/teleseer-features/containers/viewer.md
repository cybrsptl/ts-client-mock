# Viewer

## What It's For
- Viewer is the project container of Teleseer.
- It is the investigation shell analysts use after opening a project from Launcher.

## Purpose
- Hold the project-scoped analysis surfaces:
  - Dashboard
  - Network Map
  - Hosts
  - Flows
  - Alerts
  - Artifacts
  - World
  - Inspector
  - Timeline
- Preserve project context, selection context, and investigative flow while moving across those surfaces.

## Connected Features
- [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md)
  - Viewer inherits workspace and project context from Launcher.
- [Projects](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/projects.md)
  - Every Viewer session is anchored to a specific project.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md), [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md), [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md), and [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - These are the core investigative surfaces inside Viewer.
- [Inspector](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/inspector.md)
  - Inspector is the selection-driven companion surface inside Viewer, not a separate workspace.

## Architectural Rule
- Viewer must not blur workspace scope and project scope.
- Anything shown inside Viewer should be explainable in terms of the active project, project selection, or project-derived evidence.
