# Feeds Product Spec

## Assumptions
- The current Teleseer MVP feed feature is specifically `network capture feeds`.
- Supported live source types for this feature are:
  - `Napatech`
  - `Generic Interface`
- `Folder Watch` and `App/Integration` remain visible future states, but they are not part of the current operational model.
- The SQL `core.jobs` rows described by engineering are execution/control artifacts, not the ideal user-facing source-of-truth object for a feed.
- Napatech firmware layout management is real scope, but it belongs under device administration rather than casual per-feed editing.

## Context
- In cybersecurity, `feed` is a broad term. It can mean:
  - threat intelligence feeds
  - alert/detection feeds
  - raw network capture feeds
- For the current Teleseer feature, the correct meaning is the third one:
  - a network capture feed
- Teleseer’s current product model is:
  - `Launcher` as the workspace container
  - `Viewer` as the project investigation container
- Feeds exist to bridge those two layers:
  - capture and routing are workspace concerns
  - investigation is a project concern
- Internal material currently contains a terminology conflict:
  - some documents use `feeds` to mean capture feeds
  - some documents use `feeds` to mean external integration sources
- Product recommendation:
  - define the current feature as `Capture Feeds`
  - reserve future `integration feeds` for a separate integration architecture unless product leadership intentionally merges them later

## Constraints
- A feed must be configurable once and consumable by multiple projects.
- A project must never appear to own the capture hardware or the capture pipeline itself.
- Napatech hardware concepts are not lightweight UI toggles:
  - card model
  - port layout
  - firmware mode
  - breakout configuration
- Project unsubscribe must be forward-looking only:
  - historical project data remains
  - future delivery stops
- Filter rules and detection rules must stay separate in both UX and implementation:
  - filter rules shape what traffic enters the pipeline
  - Suricata rules detect threats in traffic that already entered the pipeline

## Proposed Interaction Model

### Core Definition
- A feed is a workspace-level capture pipeline configuration.
- Plain-language version:
  - it tells Teleseer how to listen to one input, roll traffic into files, process it, and deliver results to subscribed projects

### Object Model
- `Workspace`
  - owns feeds, devices, and projects
- `Capture Device`
  - the physical or logical source host/card
  - examples:
    - Napatech card
    - server NIC host
- `Capture Input`
  - the specific port/interface/tap on the device
- `Feed`
  - binds one device/input to one capture configuration and one delivery pipeline
- `Project Subscription`
  - links a project to a feed
  - controls whether future output from the feed is routed into that project
- `Per-project Handoff State`
  - reflects whether that project is receiving current feed output successfully

### Recommended Source-Of-Truth Shape
- `Device`
  - card/host identity
  - device type
  - available inputs
  - device-level admin state
- `Feed`
  - name
  - description
  - source category
  - source type
  - selected device
  - selected input
  - capture settings
  - filter settings
  - health/status
  - routing/subscription info
- `ProjectSubscription`
  - project id
  - subscribed at
  - last handoff
  - handoff status

### SQL Job Interpretation
- The engineering example job should be interpreted as a capture control/delivery instruction, not the feed object itself.
- Field interpretation:
  - `tenant_id` / `TenantId`
    - workspace scope
  - `ProjectId`
    - subscribed project or project receiving the capture workflow
  - `job_type = CAPTURE`
    - capture pipeline execution domain
  - `job_operation = STOP`
    - stop the relevant capture or delivery path
  - `Interfaces[].PcapDir`
    - output folder
  - `Interfaces[].InterfaceName`
    - capture input display label
  - `Interfaces[].InterfaceCaptureType`
    - backend capture type enum
  - `Interfaces[].FileSize`
    - chunk size
  - `Interfaces[].MaxFileTime`
    - force close-and-process interval
- Product implication:
  - a single feed may fan out to several project-specific jobs or delivery paths
  - therefore the job row should not become the UI’s main feed definition

### Data Flow Model
1. A network tap or mirror sends copied traffic to a capture input.
2. Teleseer’s capture device receives packets.
3. Feed-side filter rules may discard unwanted traffic.
4. Traffic is written to PCAP chunks.
5. Files roll over by size or time.
6. Rolled files enter Teleseer processing.
7. Processed output is delivered to subscribed projects.
8. Viewer surfaces consume the results:
   - Dashboard
   - Network Map
   - Hosts
   - Flows
   - Alerts
   - Timeline
   - Artifacts
   - Inspector
9. Suricata and other detections act on traffic produced through that feed pipeline.

### Launcher vs Viewer Ownership
- `Launcher` owns:
  - feed creation
  - feed editing
  - feed operational status
  - feed health
  - feed history
  - device/input binding
  - filter behavior
  - read-only visibility into subscriptions
- `Viewer` owns:
  - project consumption of feed output
  - project-side enablement/subscription management
  - project-side investigation of resulting alerts, hosts, flows, artifacts, and timeline evidence
- `Device Admin` owns:
  - Napatech firmware profile
  - card-level port layout/mode
  - shared hardware administration
  - read-only port exposure visualization in Launcher until full device admin exists

## State Handling

### Feed Sections In Launcher
- `Overview`
  - identity and top-level action card
  - answers:
    - what feed is this
    - what source type is it
    - what input is it bound to
    - can I stop/edit/delete it
- `Status & Health`
  - trust and availability card
  - answers:
    - can I trust this feed now
    - how available has it been over time
    - is it stale, degraded, or failing
- `History`
  - short-horizon operational trend card
  - files, volume, errors, and event history
- `Capture Settings`
  - how traffic is collected and rolled
  - for Napatech, surface `Detected Layout` and an `Open Device Admin` entry point instead of pretending feed editing can rewrite shared firmware/card profiles
- `Filter Rules`
  - what traffic is kept or discarded before analysis
- `Suricata Rules`
  - which detection coverage depends on this feed
- `Subscribed Projects`
  - which projects consume new output from this feed
- `Activity Log`
  - operational event trace

### Statuses
- `initializing`
  - feed exists but has not completed first successful handoff
- `active`
  - feed is capturing and producing current output
- `syncing`
  - capture is happening but downstream handoff/processing is behind
- `paused`
  - operator deliberately stopped capture or delivery
- `error`
  - feed pipeline is unhealthy and requires action

### Health vs Uptime
- `Health`
  - operator trust score
  - answers:
    - can I trust the current output
- `Uptime`
  - availability score over time
  - answers:
    - how available has this path been over the observed window
- These must remain separate.

### Subscription Semantics
- `Subscribe`
  - future output starts flowing into the project
- `Unsubscribe`
  - future output stops
  - historical project data remains
- This must never be framed as destructive deletion.

### Filter Rules
- These are feed-side traffic shaping controls.
- They are not detection rules.
- Current meaningful fields:
  - include/exclude mode
  - protocols
  - subnets
  - source subnets
  - destination subnets
  - ports
  - VLANs
  - raw BPF
  - estimated storage reduction

### Suricata Relationship
- Suricata is downstream of capture.
- The feed provides the traffic.
- Suricata evaluates that traffic against signature rules.
- Therefore the feed detail should expose detection coverage impact, not pretend the feed is a Suricata config screen.

### Napatech Port Visualization
- Launcher may show a compact port map for `Napatech` feeds.
- That visualizer is meant to answer:
  - which ports are exposed right now
  - which are available
  - which are already in use
  - which are virtual breakout ports
  - which are degraded
- Recommended state treatment:
  - `Assigned to this feed`
  - `Available`
  - `In use elsewhere`
  - `Unavailable`
  - `Degraded`
- The visualizer must not rely on color alone:
  - keep a legend
  - keep a detail table
  - mark virtual ports with an icon
- If a current device report exists, use the detected layout as source of truth.
- If no device report exists yet, the UI may show an expected-layout preview, but it must say clearly that actual availability comes from firmware/device detection.

## Edge Cases
- `Active with no subscribers`
  - valid workspace state
  - capture is happening but no project is consuming it
- `Paused feed`
  - no new output
  - historical project evidence stays
- `Error feed`
  - new project delivery stops or becomes stale
  - historical project evidence stays
- `Filter rules changed`
  - only future data changes shape
  - existing project evidence remains as-is
- `Feed deleted`
  - feed disappears as a future source
  - historical project evidence should remain
- `Napatech port layout changed`
  - may invalidate currently selectable inputs
  - may require reinitialization, downtime messaging, and admin permissions
- `InterfaceName` parsing based on trailing digits
  - risky and brittle
  - should be replaced with explicit backend port identity

## Risk Analysis
- Biggest terminology risk:
  - `Feeds` may later be reused for external integrations and confuse the capture model
- Biggest architecture risk:
  - treating per-project jobs as if they are the feed source-of-truth
- Biggest UX risk:
  - putting hardware administration into ordinary feed editing
- Biggest operator risk:
  - confusing `Filter Rules` with `Suricata Rules`
- Biggest prototype risk:
  - making subscriptions editable from the wrong surface and blurring Launcher/Viewer ownership

## Prototype Iteration Guidance

### Keep In Launcher Now
- Feeds table
- Feed create flow
- Feed detail drawer
- Status/health/history
- Capture and filter editing
- Read-only subscribed project visibility

### Move Or Keep Out Of Feed Editing
- Napatech firmware profile management
- Napatech port layout admin
- shared device admin
- remote sensor admin

### Add In Viewer Next
- stronger project impact messaging when a subscribed feed degrades
- deeper handoff visibility:
  - which feeds this project consumes
  - last successful handoff
  - delayed/stale/error handoff state

### Now Reflected In Prototype
- Launcher keeps feed configuration and subscribed-project visibility at workspace scope.
- Launcher shows Napatech port layout as device-admin-owned, not as casual feed editing.
- Launcher includes a read-only Napatech port map modal and compact drawer preview so analysts can inspect port exposure without implying they can reconfigure firmware from a feed.
- Viewer owns project-side feed subscription management.
- Viewer states that unsubscribe is forward-looking only:
  - future ingest stops
  - historical project evidence stays
- Viewer Inspector now shows which feeds currently route future data into the active project.

### Suggested Next Prototype Deliverables
1. Device admin placeholder for Napatech layout/firmware management
2. Explicit feed-to-project handoff status model with timestamps
3. Warnings for:
   - no subscribers
   - stale handoff
   - over-filtering
   - retention pressure
4. Replace remaining ambiguous `Feeds` copy with `Capture Feeds` where product approves

## Source References
- Internal reference:
  - `/Users/renzdupitas/Desktop/teleseer_feeds_reference.pdf`
- Internal architecture summary:
  - `/Users/renzdupitas/Desktop/Alerts/teleseer_feeds_architecture_summary.pdf`
- Internal enterprise integration summary:
  - `/Users/renzdupitas/Desktop/Alerts/teleseer_enterprise_integration_architecture_v2.pdf`
- Public Teleseer docs:
  - `https://www.cyberspatial.com/docs/overview-of-the-teleseer-user-interface`
  - `https://www.cyberspatial.com/docs/what-is-cyberspatial-teleseer`
  - `https://www.cyberspatial.com/docs/file-types`
  - `https://www.cyberspatial.com/docs/best-practices-for-collecting-data`
- Napatech references:
  - `https://docs.napatech.com/r/Reference-Documentation/Reference-Documentation-Version-3.29.38.15`
  - `https://www.napatech.com/products/nt200a02-smartnic-capture/`
  - `https://www.napatech.com/products/nt40a11-smartnic-capture/`
  - `https://www.napatech.com/products/nt50b01-smartnic-capture/`
