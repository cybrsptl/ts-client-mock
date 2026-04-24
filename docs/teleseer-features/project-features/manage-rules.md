# Manage Rules

## What It's For
- Manage Rules is the rule-operations surface behind Alerts.
- It exists so analysts can inspect, enable, disable, and edit detection logic without leaving the alert workflow.

## Purpose
- Bridge alert triage and detection maintenance.
- Keep detection ownership close enough to the evidence to be actionable, but still structured enough to prevent ad hoc rule editing chaos.
- Support provider-aware rule handling such as Teleseer-native rules and Suricata rules.

## Connected Features
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md)
  - Alerts is the parent feature. Manage Rules exists to maintain what generates those alerts.
- [Feeds](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds.md)
  - Rule effectiveness depends on the feed data being captured and filtered correctly.
- [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md) and [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md)
  - Rule changes should be validated against the host and flow evidence those rules are meant to detect.
- [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - Timeline helps validate whether rule hits correspond to real traffic sequences.

## Architectural Rule
- Manage Rules is a Teleseer feature, not a generic modal pattern.
- The drawer and card components used there are UI primitives, but the rule workflow itself belongs to the Alerts domain.
