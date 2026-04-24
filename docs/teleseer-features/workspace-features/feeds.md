# Feeds

## Related Specs
- Detailed product/build spec:
  - [Feeds Product Spec](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/feeds-product-spec.md)

## What It's For
- Feeds are workspace-scoped ingest sources.
- They define where analysis data comes from before that data becomes project evidence.
- A feed is the operational definition of how Teleseer captures, shapes, stores, and exposes incoming data to projects.

## Purpose
- Manage live capture and source ingestion.
- Expose operational health such as paused, ready, syncing, delayed, or error states.
- Give operators a place to edit capture settings, filter rules, and source behavior without pretending those controls are project-local.

## What A Feed Is In Teleseer
- A feed is not just a file source and not just a sensor status row.
- It is the workspace-level ingest contract that combines:
  - source category
  - source type
  - capture device/input
  - rollover and retention settings
  - filter rules
  - status and health telemetry
  - project subscriptions
- In the current prototype, the active live category is `Network Capture`.
- The current source types are:
  - `Napatech`
  - `Generic Interface`
- Planned feed categories that stay visible as future structure are:
  - `Folder Watch`
  - `App/Integration`

## Current Metric Model
- `uptimePct` is now treated as a rolling availability percentage over a `30-day` window for established feeds.
- New feeds use their actual age as the uptime window until they age into the full rolling window.
- `healthScore` is now computed from multiple operational signals:
  - uptime contribution
  - current status contribution
  - freshness of last activity versus expected idle threshold
  - file quality contribution from warning/error rollover behavior
  - reliability contribution from error frequency, stale state, and no-subscription state
- This makes `healthScore` an operator trust score rather than a decorative number.

## How Feeds Work In Teleseer
1. A workspace operator creates or edits a feed in [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md).
2. The operator defines where traffic or source data comes from:
   - capture card
   - interface
   - future watched folder or external integration
3. The operator defines ingest behavior:
   - output folder
   - chunk size
   - close-and-process interval
   - retention period
4. The operator defines feed-side traffic shaping:
   - include or exclude mode
   - protocols
   - subnets
   - ports
   - VLAN
   - raw BPF
5. The feed starts producing processable output for the workspace.
6. Projects subscribe to that feed so the project can analyze the resulting evidence.
7. Downstream project surfaces consume the feed output:
   - Alerts for detections
   - Hosts for entity analysis
   - Flows for connection analysis
   - Timeline for time-sequenced evidence
   - Dashboard for summarized posture
   - Artifacts for extracted evidence objects

## Subscription Semantics
- A feed subscription is the handoff from workspace ingest into a specific project.
- If a project subscribes to a feed:
  - future feed output becomes available to that project for downstream analysis
  - the project begins receiving the feed's ongoing ingest stream or processed handoff
- If a project unsubscribes from a feed:
  - historical data already ingested into that project stays in the project
  - Teleseer does not retroactively remove already-ingested project evidence
  - new ingest from that feed stops flowing into that project from the unsubscribe point onward
- This matters because unsubscribe is a forward-looking routing change, not a destructive evidence purge.

## What Operators Manage On A Feed
- `Overview`
  - identity, source type, source, description, and top-level actions
- `Status & Health`
  - health score, uptime, last activity, filter rule count, files, delay/error state
- `History`
  - recent file, volume, and error trends plus activity history
- `Capture Settings`
  - device, input, port layout, output folder, chunking cadence, retention
- `Filter Rules`
  - include/exclude mode and traffic-shaping criteria before downstream analysis
- `Suricata Rules`
  - which rule packs or rule-linked project counts relate to this feed
- `Subscribed Projects`
  - which projects are currently consuming the feed
- `Activity Log`
  - ingest, config, error, and subscription events

## What The Feed Sections Mean
- `Overview`
  - This is the operator's first-pass identity and control card.
  - It answers:
    - what this feed is
    - where it is capturing from
    - what type of source it uses
    - whether it is currently stopped or editable
  - It is intentionally not a deep diagnostics card. Its job is orientation and immediate action.
- `Status & Health`
  - This is the operational trust card.
  - It answers whether the feed is healthy enough to trust as a live upstream for project analysis.
- `History`
  - This gives short-horizon trend context:
    - recent files
    - recent volume
    - recent errors
    - recent ingest/config/subscription events
- `Capture Settings`
  - This defines how the feed physically or logically acquires data and turns it into processable capture output.
- `Filter Rules`
  - This defines how the feed narrows or shapes data before downstream parsing and detection.
- `Suricata Rules`
  - This shows which Suricata detections or rule packs are operationally tied to data from this feed.
- `Subscribed Projects`
  - This shows which projects are actively consuming this feed and whether each handoff is current.
- `Activity Log`
  - This records operational events that explain changes in ingest, config, or subscription state.

## What Feed Health Means
- Feed health is the practical answer to: "How trustworthy is this feed as an input to investigation right now?"
- A low health score should be interpreted as elevated operational risk, such as:
  - stale ingest
  - repeated handoff failures
  - file rollover problems
  - connector or source instability
  - persistent warning/error states
- A high health score should mean the feed is consistently producing usable output with low operational friction.
- Health is shown as a percentage because it is easier to scan as a normalized confidence score across many feeds.
- It should not be read as "X percent packets are good." It is an operator-facing summary score.
- In the current implementation, the score is derived from uptime, status, freshness, file quality, and reliability signals.

## Why Uptime Is Also A Percentage
- Uptime answers a different question from health.
- Health is a composite trust score.
- Uptime is availability over time.
- Uptime is expressed as a percentage because availability is inherently ratio-based:
  - how much of the observed period the feed path was up versus unavailable
- In the current implementation, established feeds use a `30-day` availability window.
- A feed can have high uptime but lower health:
  - example: it stayed up most of the time but is currently degrading, delayed, or producing error-prone handoffs
- A feed can also have lower uptime but recover into healthy current operation.
- Keeping both metrics visible prevents operators from confusing long-term availability with present operational quality.

## What The Statuses Imply
- `active`
  - The feed is currently capturing and producing live throughput.
  - In the prototype, the main status label becomes the current capture rate.
  - If there are no subscribed projects, the extra state changes to `no subscribed projects`, which means ingest is alive but not feeding any project.
- `syncing`
  - The feed is capturing, but the important operator concern is handoff/synchronization progress into downstream processing or project delivery.
  - In the prototype, this status exposes a progress percentage.
- `paused`
  - The feed was deliberately stopped or held.
  - This is not the same as a failure.
  - Historical data remains; new ingest does not continue until resumed.
- `error`
  - The feed is not in a trustworthy operating state and requires attention.
  - This usually implies failed handoff, connector timeout, partial rollover, or writer fault conditions.
- `initializing`
  - The feed exists but has not yet reached normal operating handoff.
  - This is expected for newly created feeds or feeds waiting for first successful capture rollover.

## What Capture Settings Mean
- `Capture Device`
  - The hardware or host source doing the capture.
- `Capture Input`
  - The specific interface, tap, or input path on that device.
- `Port Layout`
  - A capture-card-specific input arrangement, mainly relevant to Napatech feeds.
- `Output Folder`
  - Where Teleseer writes rolled capture output before downstream processing or project handoff.
- `Chunk Size`
  - How large each rolled output unit should be before it is closed.
- `Close & Process Every`
  - How frequently Teleseer closes the current capture chunk and hands it off for downstream processing.
- `Retention`
  - How long the feed keeps local rolled output before aging it out.
- `Source Details`
  - A human-readable summary of the current capture source wiring.

## What Filter Rules Mean
- Filter rules are feed-side traffic shaping, not alert detection logic.
- Their job is to decide what traffic the feed keeps or discards before downstream analysis.
- In the current prototype, they include:
  - include or exclude mode
  - protocols
  - IP subnets
  - source subnets
  - destination subnets
  - ports
  - VLAN
  - raw BPF
  - estimated storage reduction
- This matters because feed filtering changes the evidence surface for every downstream feature.
- If the filter rules are too narrow:
  - the project may miss evidence
- If the filter rules are too broad:
  - storage, parse cost, and noise increase

## What Suricata Has To Do With Feeds
- Suricata is not the feed itself.
- The feed supplies the traffic that Suricata-based detections can evaluate.
- The `Suricata Rules` section on a feed is there to show the relationship between:
  - the traffic source
  - the Suricata detections operating on that traffic
  - the projects affected by those detections
- In the current prototype, Suricata entries show:
  - rule name
  - how many projects that rule touches through this feed
- This is useful because it gives operators impact visibility:
  - if a feed is unhealthy, they can immediately see which detection coverage is at risk
  - if a feed is filtered incorrectly, they can reason about which Suricata detections may be degraded or silenced

## Why Feeds Live In Launcher
- Feeds are shared workspace assets, not one-project settings.
- Multiple projects may depend on the same feed.
- A feed can be healthy or unhealthy even when no one is looking at a specific project.
- Subscription is the project-level handoff:
  - feed ownership stays in Launcher
  - feed consumption happens in Viewer/project features

## Operational Meaning
- Feed health is not cosmetic.
- If a feed is paused, delayed, syncing poorly, or erroring, downstream investigation quality changes immediately.
- A project can still exist without a healthy feed, but its Alerts, Hosts, Flows, Timeline, and Dashboard become less trustworthy or stale.
- A feed with no subscribed projects is still a workspace object, but it is not yet delivering analysis value.

## Connected Features
- [Launcher](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/containers/launcher.md)
  - Feed lifecycle and health belong in Launcher because feeds are workspace assets.
- [Projects](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/workspace-features/projects.md)
  - Projects subscribe to or consume feed output.
- [Alerts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/alerts.md), [Hosts](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/hosts.md), [Flows](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/flows.md), [Dashboard](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/dashboard.md), and [Timeline](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/timeline/README.md)
  - These project features are downstream consumers of feed output.
- [Manage Rules](/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/teleseer-features/project-features/manage-rules.md)
  - Detection rules act on the data feeds produce, so rule quality depends on feed quality and filter correctness.

## File Ownership
- HTML:
  - [launcher.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/launcher/launcher.html)
- CSS:
  - [launcher.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/launcher/launcher.css)
  - [ui-primitives.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/shared/styles/components/ui-primitives.css)
- JS:
  - [launcher.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/launcher/launcher.js)

## Architectural Rule
- Feed configuration should not be treated as project-only state.
- Project surfaces may reflect feed quality, but they should not silently own the feed itself.
