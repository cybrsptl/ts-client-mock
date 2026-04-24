# Timeline Minimap

## Figma References
- Timeline toolbar: `2576:19286`
- Timeline minimap and handlebar: `2576:17167`
- Time markers: `2576:17168`
- Swimlane: `2576:17169`
- Sidebar: `2576:17161`
- User-provided behavior reference:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/TIMELINE V3`
  - `/Users/renzdupitas/Desktop/CleanShot 2026-03-04 at 22.43.12.mp4`

## Purpose
- Provide a fixed overview of the full timeline.
- Show the visible window of the main timeline through a draggable white handlebar.
- Allow panning through the full timeline by dragging that handlebar.
- Allow zooming in and out by dragging the left and right minimap grab handles.

## Current Interaction Model
- The minimap waveform is static.
- The minimap always represents the full timeline span.
- The minimap itself must not expand or contract during zoom.
- Horizontal panning and zooming should affect the time markers and main timeline only, not the minimap waveform.
- Only the white handlebar changes size when zoom changes:
  - zoom in: handlebar shrinks
  - zoom out: handlebar grows
- Dragging the white handlebar should pan the visible main timeline window.
- Dragging the left or right grab handle should resize the white handlebar and therefore change zoom.
- The white handlebar must never leave the minimap bounds.
- Timeline toolbar controls are fixed chrome and must not move when the timeline zooms.

## State Model
- Save-worthy:
  - not decided yet for zoom level
  - not decided yet for current visible time window
- Ephemeral:
  - current packet-carving selection
  - current minimap drag state
  - temporary panning while investigating
- Not yet decided:
  - whether zoom level belongs to saved View state or remains session-only

## File Ownership
- HTML:
  - [viewer.html](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/viewer.html)
- CSS:
  - [timeline.css](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/timeline/timeline.css)
- JS:
  - [timeline-feature.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/timeline/timeline-feature.js)
  - [app-init.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/app-init.js)
  - [state-core.js](/Users/renzdupitas/Desktop/Teleseer%20Mockups/teleseer-dummy/viewer/scripts/state-core.js)

## Current Step
- Step 1:
  - minimap base should only show the waveform overview
  - remove extra circles/status dots from inside the minimap
  - no white viewport, no grab handles, no minimap interaction yet
  - normal timeline scrolling should not modify the minimap base
  - zoom should clamp instead of wrapping back to an earlier state
  - ruler markers should move inside their own inner strip so they do not resize the minimap row
- Step 2:
  - rebuild the white handlebar on top of the minimap
  - use the handlebar body plus left and right grab-handle visuals
- Step 3:
  - handlebar drag should pan the visible timeline window
- Step 4:
  - left and right grab handles should resize the white handlebar and drive zoom

## Known Issues
- The current white handlebar behavior is incorrect.
- Dragging the grab handles has been causing the minimap/viewport math to behave incorrectly.
- The current implementation needs to be rebuilt in smaller steps instead of patched further.

## Notes From User
- The circles inside the minimap are not in the mockup and should not exist.
- The waveform should stay fixed and represent traffic fluctuations across the full span.
- The handlebar is the thing that expands and contracts, not the minimap.
