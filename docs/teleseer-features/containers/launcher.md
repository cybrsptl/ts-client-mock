# Launcher

## What It's For
- Launcher is the workspace container of Teleseer.
- It is where analysts and administrators manage workspace-scoped objects before entering a project investigation.

## Purpose
- Expose the workspace inventory:
  - projects
  - feeds
  - sensors and ingest sources
  - role and access posture
- Provide operational control over workspace-level state before opening Viewer.

## Connected Features
- [Projects](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/projects.md)
  - Launcher lists projects and is the handoff point into Viewer.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Launcher owns feed creation, feed health, and feed management because feeds are workspace assets.
- [Viewer](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/viewer.md)
  - Viewer opens from Launcher using a selected project and inherited workspace context.
- [Roles](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/roles.md)
  - Workspace permissions should constrain which projects, feeds, and actions are visible from Launcher.

## Architectural Rule
- Launcher is not a project analysis surface.
- Anything that is workspace-wide should be owned here first unless product requirements explicitly say otherwise.
