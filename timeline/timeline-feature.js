const TIMELINE_DURATION_MINUTES = 18;
const TIMELINE_DURATION_SECONDS = TIMELINE_DURATION_MINUTES * 60;
const TIMELINE_ZOOM_FACTOR_MIN = 1;
const TIMELINE_ZOOM_FACTOR_MAX = 16;
const TIMELINE_MINIMAP_MIN_WIDTH_PCT = 3;
const TIMELINE_SELECTION_JUMP_SHELL_WIDTH = 32;
const TIMELINE_SELECTION_JUMP_GAP = 8;
const TIMELINE_SELECTION_RECOVERY_THRESHOLD_PX = 20;
const TIMELINE_EDGE_JUMP_INSET_PX = 8;
const TIMELINE_RULER_LABEL_MIN_PX = 72;

const TIMELINE_RULER_STEPS = [
  { stepSeconds: 1, labelEvery: 5 },
  { stepSeconds: 5, labelEvery: 3 },
  { stepSeconds: 10, labelEvery: 3 },
  { stepSeconds: 15, labelEvery: 2 },
  { stepSeconds: 30, labelEvery: 2 },
  { stepSeconds: 60, labelEvery: 1 },
];

function normalizeTimelineEvent(start, end) {
  const safeStart = timelineClamp(start, 0, 0.999);
  const safeEnd = timelineClamp(
    Math.max(end, safeStart + 0.0015),
    safeStart + 0.0015,
    1,
  );
  return [safeStart, safeEnd];
}

function burstTimelineEvents(
  start,
  count,
  width,
  gap,
  widthJitter = 0,
  gapJitter = 0,
) {
  const events = [];
  let cursor = start;
  for (let index = 0; index < count; index += 1) {
    const widthOffset = widthJitter ? (((index % 5) - 2) * widthJitter) / 2 : 0;
    const gapOffset = gapJitter ? (((index % 3) - 1) * gapJitter) / 2 : 0;
    const eventWidth = Math.max(0.0015, width + widthOffset);
    events.push(normalizeTimelineEvent(cursor, cursor + eventWidth));
    cursor += eventWidth + gap + gapOffset;
  }
  return events;
}

function fillTimelineRange(
  start,
  end,
  width,
  gap,
  widthJitter = 0,
  gapJitter = 0,
) {
  const events = [];
  let cursor = start;
  while (cursor < end - 0.0008) {
    const index = events.length;
    const widthOffset = widthJitter ? (((index % 5) - 2) * widthJitter) / 2 : 0;
    const gapOffset = gapJitter ? (((index % 3) - 1) * gapJitter) / 2 : 0;
    const eventWidth = Math.max(
      0.0008,
      Math.min(end - cursor, width + widthOffset),
    );
    events.push(normalizeTimelineEvent(cursor, cursor + eventWidth));
    cursor += eventWidth + Math.max(0.00004, gap + gapOffset);
  }
  return events;
}

function combineTimelineEvents(...eventGroups) {
  return eventGroups
    .flat()
    .map(([start, end]) => normalizeTimelineEvent(start, end))
    .sort((left, right) => left[0] - right[0]);
}

const TIMELINE_LANE_MODELS = [
  {
    key: "throughput",
    color: "#dfe3eb",
    height: 3,
    events: combineTimelineEvents(
      fillTimelineRange(0.0, 1.0, 0.0032, 0.00035, 0.0008, 0.00012),
      [
        [0.126, 0.139],
        [0.153, 0.166],
        [0.379, 0.392],
        [0.447, 0.461],
        [0.546, 0.56],
        [0.572, 0.585],
        [0.671, 0.684],
        [0.726, 0.739],
        [0.998, 1.0],
      ],
    ),
  },
  {
    key: "control",
    color: "#35548e",
    height: 2,
    events: combineTimelineEvents(
      [
        [0.0, 0.058],
        [0.072, 0.146],
        [0.172, 0.244],
        [0.258, 0.344],
        [0.372, 0.416],
        [0.43, 0.502],
        [0.516, 0.546],
        [0.56, 0.62],
        [0.634, 0.648],
        [0.662, 0.72],
        [0.734, 0.756],
        [0.772, 0.786],
        [0.804, 0.828],
        [0.87, 0.884],
        [0.896, 0.924],
        [0.94, 1.0],
      ],
      burstTimelineEvents(0.084, 4, 0.002, 0.19, 0.0005, 0.01),
    ),
  },
  {
    key: "transfer",
    color: "#f0d34e",
    height: 8,
    events: combineTimelineEvents(
      burstTimelineEvents(0.038, 4, 0.012, 0.08, 0.003, 0.008),
      fillTimelineRange(0.324, 1.0, 0.0038, 0.00014, 0.0005, 0.00005),
    ),
  },
  {
    key: "session",
    color: "#67c8db",
    height: 12,
    events: combineTimelineEvents(
      fillTimelineRange(0.0, 0.304, 0.0064, 0.00008, 0.0008, 0.00004),
      fillTimelineRange(0.318, 1.0, 0.0062, 0.0001, 0.0007, 0.00004),
      [
        [0.304, 0.318],
        [0.437, 0.447],
        [0.816, 0.824],
        [0.858, 0.866],
        [0.946, 0.956],
      ],
    ),
  },
  {
    key: "activity",
    color: "#d58c20",
    height: 2,
    events: combineTimelineEvents(
      burstTimelineEvents(0.0, 9, 0.002, 0.028, 0.0008, 0.006),
      burstTimelineEvents(0.352, 8, 0.0022, 0.062, 0.0008, 0.008),
      burstTimelineEvents(0.868, 7, 0.002, 0.021, 0.0008, 0.004),
      [[0.586, 0.594], [0.99, 0.993]],
    ),
  },
  {
    key: "baseline",
    color: "#d8dbe2",
    height: 8,
    events: combineTimelineEvents(
      fillTimelineRange(0.0, 1.0, 0.006, 0.00022, 0.0016, 0.00008),
      burstTimelineEvents(0.016, 18, 0.0018, 0.028, 0.0007, 0.004),
    ),
  },
  {
    key: "flags",
    color: "#35548e",
    height: 2,
    events: combineTimelineEvents(
      burstTimelineEvents(0.084, 5, 0.0014, 0.22, 0.0005, 0.01),
      burstTimelineEvents(0.758, 4, 0.0014, 0.08, 0.0005, 0.008),
    ),
  },
  {
    key: "markers",
    color: "#62d56c",
    height: 5,
    events: combineTimelineEvents(
      burstTimelineEvents(0.156, 3, 0.0018, 0.012, 0.0005, 0.001),
      burstTimelineEvents(0.642, 2, 0.0018, 0.014, 0.0005, 0.001),
      [[0.986, 0.988], [0.9895, 0.991]],
    ),
  },
  {
    key: "incidents",
    color: "#8f84ff",
    height: 4,
    events: combineTimelineEvents(
      burstTimelineEvents(0.04, 6, 0.0012, 0.038, 0.0003, 0.004),
      burstTimelineEvents(0.452, 4, 0.0012, 0.028, 0.0003, 0.004),
      burstTimelineEvents(0.714, 11, 0.0012, 0.022, 0.0003, 0.003),
    ),
  },
  {
    key: "tail",
    color: "#4ed6d8",
    height: 2,
    events: combineTimelineEvents(
      burstTimelineEvents(0.468, 3, 0.0009, 0.29, 0.0002, 0.02),
    ),
  },
];

function timelineClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTimelineSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function formatTimelineRulerLabel(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  if (seconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function getTimelineBaseWidth() {
  return Math.max(
    timelineTrackAreaEl.clientWidth ||
      timelineMinimapTrackEl.clientWidth ||
      timelineTrackCanvasEl.offsetWidth ||
      1,
    1,
  );
}

function getTimelineRulerConfig(contentWidth = getTimelineContentWidth()) {
  const pixelsPerSecond = contentWidth / TIMELINE_DURATION_SECONDS;
  return (
    TIMELINE_RULER_STEPS.find(
      ({ stepSeconds, labelEvery }) =>
        pixelsPerSecond * stepSeconds * labelEvery >=
          TIMELINE_RULER_LABEL_MIN_PX,
    ) || TIMELINE_RULER_STEPS[TIMELINE_RULER_STEPS.length - 1]
  );
}

function getTimelineSelectionOffscreenDirection(
  minX = timelineSelection.minX,
  maxX = timelineSelection.maxX,
) {
  if (!timelineSelection.hasSelection) return null;
  const visibleLeft = timelineTrackAreaEl.scrollLeft;
  const visibleRight = visibleLeft + (timelineTrackAreaEl.clientWidth || 0);
  const overflowLeft = Math.max(0, visibleLeft - minX);
  const overflowRight = Math.max(0, maxX - visibleRight);
  const leftClipped = overflowLeft > TIMELINE_SELECTION_RECOVERY_THRESHOLD_PX;
  const rightClipped = overflowRight > TIMELINE_SELECTION_RECOVERY_THRESHOLD_PX;
  if (!leftClipped && !rightClipped) return null;
  if (leftClipped && rightClipped) return null;
  return leftClipped ? "left" : "right";
}

function updateTimelineSelectionJumpState(
  minX = timelineSelection.minX,
  maxX = timelineSelection.maxX,
) {
  if (!timelineJumpSelectionButtonEl || !timelineJumpSelectionShellEl) return;
  const direction = timelineSelection.hasSelection
    ? getTimelineSelectionOffscreenDirection(minX, maxX)
    : null;
  timelineJumpSelectionShellEl.hidden = !direction;
  timelineJumpSelectionShellEl.classList.toggle("active", Boolean(direction));
  if (direction) {
    const tooltipLabel = "Recenter selection";
    const visibleLeft = timelineTrackAreaEl.scrollLeft;
    const visibleRight = visibleLeft + (timelineTrackAreaEl.clientWidth || 0);
    const shellHeight = timelineJumpSelectionShellEl.offsetHeight || 32;
    const centeredTop = timelineTrackAreaEl.scrollTop +
      Math.max(
        TIMELINE_EDGE_JUMP_INSET_PX,
        ((timelineTrackAreaEl.clientHeight || 0) - shellHeight) / 2,
      );
    const shellLeft = direction === "left"
      ? visibleLeft + TIMELINE_EDGE_JUMP_INSET_PX
      : visibleRight -
        TIMELINE_SELECTION_JUMP_SHELL_WIDTH -
        TIMELINE_EDGE_JUMP_INSET_PX;
    timelineJumpSelectionButtonEl.dataset.direction = direction;
    timelineJumpSelectionButtonEl.setAttribute("aria-label", tooltipLabel);
    timelineJumpSelectionButtonEl.setAttribute("title", tooltipLabel);
    timelineJumpSelectionShellEl.style.left = `${Math.max(0, shellLeft)}px`;
    timelineJumpSelectionShellEl.style.top = `${Math.max(0, centeredTop)}px`;
  } else {
    delete timelineJumpSelectionButtonEl.dataset.direction;
    timelineJumpSelectionButtonEl.setAttribute(
      "aria-label",
      "Jump to selection",
    );
    timelineJumpSelectionButtonEl.removeAttribute("title");
    timelineJumpSelectionShellEl.style.left = "";
    timelineJumpSelectionShellEl.style.top = "";
  }
}

function recenterTimelineSelection() {
  if (!timelineSelection.hasSelection) return;
  const viewportWidth = timelineTrackAreaEl.clientWidth || 0;
  const maxScroll = Math.max(
    0,
    (timelineTrackCanvasEl.offsetWidth || 0) - viewportWidth,
  );
  const selectionCenter = (timelineSelection.minX + timelineSelection.maxX) / 2;
  const targetLeft = timelineClamp(
    selectionCenter - viewportWidth / 2,
    0,
    maxScroll,
  );

  if (typeof timelineTrackAreaEl.scrollTo === "function") {
    timelineTrackAreaEl.scrollTo({
      left: targetLeft,
      top: timelineTrackAreaEl.scrollTop,
      behavior: "smooth",
    });
    return;
  }

  timelineTrackAreaEl.scrollLeft = targetLeft;
  syncTimelineScroll();
}

function getTimelineZoomFactor() {
  const stored = Number(state.ephemeral.timelineZoomFactor);
  if (Number.isFinite(stored)) {
    return timelineClamp(
      stored,
      TIMELINE_ZOOM_FACTOR_MIN,
      TIMELINE_ZOOM_FACTOR_MAX,
    );
  }
  return 4;
}

function setTimelineZoomFactor(value) {
  const factor = timelineClamp(
    value,
    TIMELINE_ZOOM_FACTOR_MIN,
    TIMELINE_ZOOM_FACTOR_MAX,
  );
  state.ephemeral.timelineZoomFactor = factor;
  state.ephemeral.timelineZoom = Math.round(factor * 100);
  return factor;
}

function getTimelineContentWidth(factor = getTimelineZoomFactor()) {
  return Math.round(getTimelineBaseWidth() * factor);
}

function getTimelineViewportWidthPct(contentWidth = getTimelineContentWidth()) {
  const visibleWidth = timelineTrackAreaEl.clientWidth || 1;
  return timelineClamp(
    (visibleWidth / contentWidth) * 100,
    TIMELINE_MINIMAP_MIN_WIDTH_PCT,
    100,
  );
}

function getTimelineViewportMinWidthPct() {
  const trackWidth = timelineMinimapTrackEl.clientWidth || 1;
  const handlebarMinPx = 18;
  return Math.max(
    TIMELINE_MINIMAP_MIN_WIDTH_PCT,
    (handlebarMinPx / trackWidth) * 100,
  );
}

function renderTimelineRuler() {
  const contentWidth = getTimelineContentWidth();
  const { stepSeconds, labelEvery } = getTimelineRulerConfig(contentWidth);
  timelineRulerTicksEl.innerHTML = "";
  timelineRulerTicksEl.style.width = `${contentWidth}px`;

  const fragment = document.createDocumentFragment();
  const cellCount = Math.ceil(TIMELINE_DURATION_SECONDS / stepSeconds);
  const cellWidth = (contentWidth / TIMELINE_DURATION_SECONDS) * stepSeconds;
  for (let index = 0; index < cellCount; index += 1) {
    const offsetSeconds = (index + 1) * stepSeconds;
    const cellEl = document.createElement("div");
    cellEl.className = "timeline-ruler-cell";
    cellEl.style.width = `${cellWidth}px`;
    const isLabelTick = index % labelEvery === labelEvery - 1;
    cellEl.classList.toggle("minor", !isLabelTick);
    if (isLabelTick) {
      cellEl.textContent = formatTimelineRulerLabel(offsetSeconds);
    } else {
      cellEl.setAttribute("aria-hidden", "true");
    }
    fragment.appendChild(cellEl);
  }
  timelineRulerTicksEl.appendChild(fragment);
}

function renderTimelineTracks() {
  const contentWidth = getTimelineContentWidth();
  timelineTrackCanvasEl.style.width = `${contentWidth}px`;
  const trackEls = Array.from(
    timelineTrackCanvasEl.querySelectorAll(".timeline-track"),
  );
  timelineEvents = [];
  TIMELINE_LANE_MODELS.forEach((laneModel, laneIndex) => {
    const trackEl = trackEls[laneIndex];
    if (!trackEl) return;
    trackEl.innerHTML = "";

    laneModel.events.forEach(([startRatio, endRatio], eventIndex) => {
      const eventEl = document.createElement("div");
      const widthRatio = Math.max(0.0008, endRatio - startRatio);
      const id = `timeline-event-${laneIndex}-${eventIndex}`;
      eventEl.className = "timeline-event";
      eventEl.style.left = `${startRatio * 100}%`;
      eventEl.style.width = `${widthRatio * 100}%`;
      eventEl.style.setProperty("--timeline-event-color", laneModel.color);
      eventEl.style.setProperty(
        "--timeline-event-height",
        `${laneModel.height || 8}px`,
      );
      eventEl.classList.toggle("aggregated", widthRatio >= 0.02);
      eventEl.classList.toggle("hairline", (laneModel.height || 8) <= 3);
      eventEl.dataset.timelineEventId = id;
      trackEl.appendChild(eventEl);
      timelineEvents.push({
        id,
        laneKey: laneModel.key,
        startRatio,
        endRatio,
        el: eventEl,
      });
    });
  });
}

function getTimelineViewportState(contentWidth = getTimelineContentWidth()) {
  const visibleWidth = timelineTrackAreaEl.clientWidth || 1;
  const minWidthPct = getTimelineViewportMinWidthPct();
  const widthPct = timelineClamp(
    (visibleWidth / contentWidth) * 100,
    minWidthPct,
    100,
  );
  const maxScroll = Math.max(0, contentWidth - visibleWidth);
  const leftPx = timelineClamp(timelineTrackAreaEl.scrollLeft, 0, maxScroll);
  const maxLeftPct = Math.max(0, 100 - widthPct);
  const leftPct = contentWidth > 0
    ? timelineClamp((leftPx / contentWidth) * 100, 0, maxLeftPct)
    : 0;

  return {
    contentWidth,
    visibleWidth,
    widthPct,
    minWidthPct,
    leftPx,
    leftPct,
    maxLeftPct,
    maxScroll,
  };
}

function syncMinimapFromScroll() {
  if (!timelineMinimapViewportEl) return;
  const { widthPct, leftPct } = getTimelineViewportState();
  timelineMinimapViewportEl.style.width = `${widthPct}%`;
  timelineMinimapViewportEl.style.left = `${leftPct}%`;
}

function syncTimelineScroll() {
  if (timelineSidebarListEl.scrollTop !== timelineTrackAreaEl.scrollTop) {
    timelineSidebarListEl.scrollTop = timelineTrackAreaEl.scrollTop;
  }
  timelineRulerTicksEl.style.transform = `translateX(${-timelineTrackAreaEl
    .scrollLeft}px)`;
  syncMinimapFromScroll();
  if (timelineSelection.hasSelection) {
    updateTimelineSelectionUI(true);
  } else {
    updateTimelineSelectionJumpState();
  }
}

function applyTimelineZoom(nextFactor, anchorClientX = null) {
  const clampedFactor = timelineClamp(
    nextFactor,
    TIMELINE_ZOOM_FACTOR_MIN,
    TIMELINE_ZOOM_FACTOR_MAX,
  );
  const previousContentWidth = getTimelineContentWidth();
  const referenceOffset = anchorClientX === null
    ? (timelineTrackAreaEl.clientWidth || 1) / 2
    : timelineClamp(
      anchorClientX - timelineTrackAreaEl.getBoundingClientRect().left,
      0,
      timelineTrackAreaEl.clientWidth || 1,
    );
  const focusRatio = previousContentWidth > 0
    ? (timelineTrackAreaEl.scrollLeft + referenceOffset) /
      previousContentWidth
    : 0;

  const factor = setTimelineZoomFactor(clampedFactor);
  const nextContentWidth = getTimelineContentWidth(factor);
  timelineTrackCanvasEl.style.width = `${nextContentWidth}px`;
  renderTimelineRuler();

  const targetFocusPx = focusRatio * nextContentWidth;
  const targetScrollLeft = targetFocusPx - referenceOffset;
  const maxScroll = Math.max(
    0,
    nextContentWidth - timelineTrackAreaEl.clientWidth,
  );
  timelineTrackAreaEl.scrollLeft = timelineClamp(
    targetScrollLeft,
    0,
    maxScroll,
  );
  syncTimelineScroll();
}

function setTimelineZoomLevel(nextZoom, anchorClientX = null) {
  const safeZoom = Number(nextZoom);
  const factor = safeZoom > 100 ? safeZoom / 100 : safeZoom;
  applyTimelineZoom(factor, anchorClientX);
}

function setTimelineViewportByMinimap(leftPct, widthPct) {
  if (!timelineMinimapViewportEl) return;
  const visibleWidth = timelineTrackAreaEl.clientWidth || 1;
  const minWidthPct = getTimelineViewportMinWidthPct();
  const requestedWidthPct = timelineClamp(widthPct, minWidthPct, 100);
  const requestedContentWidth = visibleWidth / (requestedWidthPct / 100);
  const factor = setTimelineZoomFactor(
    requestedContentWidth / getTimelineBaseWidth(),
  );

  const actualContentWidth = getTimelineContentWidth(factor);
  const actualWidthPct = timelineClamp(
    (visibleWidth / actualContentWidth) * 100,
    minWidthPct,
    100,
  );
  const maxLeftPct = Math.max(0, 100 - actualWidthPct);
  const actualLeftPct = timelineClamp(leftPct, 0, maxLeftPct);
  const maxScroll = Math.max(0, actualContentWidth - visibleWidth);
  const nextScrollLeft = timelineClamp(
    (actualLeftPct / 100) * actualContentWidth,
    0,
    maxScroll,
  );

  timelineTrackCanvasEl.style.width = `${actualContentWidth}px`;
  renderTimelineRuler();
  timelineTrackAreaEl.scrollLeft = nextScrollLeft;
  syncTimelineScroll();
}

function getTimelineEventRect(eventEl) {
  const trackRect = timelineTrackAreaEl.getBoundingClientRect();
  const eventRect = eventEl.getBoundingClientRect();
  return {
    left: eventRect.left - trackRect.left + timelineTrackAreaEl.scrollLeft,
    right: eventRect.right - trackRect.left + timelineTrackAreaEl.scrollLeft,
    top: eventRect.top - trackRect.top + timelineTrackAreaEl.scrollTop,
    bottom: eventRect.bottom - trackRect.top + timelineTrackAreaEl.scrollTop,
  };
}

function timelineRectsOverlap(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function getTimelineDurationSeconds(minX, maxX) {
  const totalWidth = timelineTrackCanvasEl.offsetWidth ||
    timelineTrackAreaEl.clientWidth || 1;
  const startSeconds = (minX / totalWidth) * TIMELINE_DURATION_SECONDS;
  const endSeconds = (maxX / totalWidth) * TIMELINE_DURATION_SECONDS;
  return {
    startSeconds,
    endSeconds,
    durationSeconds: Math.max(0, endSeconds - startSeconds),
  };
}

function hideTimelineMenus() {
  timelineContextMenuEl.classList.add("hidden");
  timelineExportMenuEl.classList.add("hidden");
  timelineExportButtonEl.classList.remove("active");
  timelineExportButtonEl.setAttribute("aria-expanded", "false");
  if (timelineSelectionExportButtonEl) {
    timelineSelectionExportButtonEl.classList.remove("active");
    timelineSelectionExportButtonEl.setAttribute("aria-expanded", "false");
  }
}

function clearTimelineSelection(silent = false) {
  timelineSelection.hasSelection = false;
  timelineSelection.selectedIds = [];
  timelineSelection.minX = 0;
  timelineSelection.maxX = 0;
  timelineSelection.exportScope = "all";
  timelineTrackCanvasEl
    .querySelectorAll(".timeline-event.selected")
    .forEach((eventEl) => {
      eventEl.classList.remove("selected");
    });
  timelineBoundaryLeftEl.classList.remove("active");
  timelineBoundaryRightEl.classList.remove("active");
  timelineSelectionRibbonEl.classList.remove("active");
  if (timelineSelectionExportShellEl) {
    timelineSelectionExportShellEl.hidden = true;
    timelineSelectionExportShellEl.classList.remove("active");
  }
  if (timelineJumpSelectionShellEl) {
    timelineJumpSelectionShellEl.hidden = true;
    timelineJumpSelectionShellEl.classList.remove("active");
  }
  timelineExportSelectionScopeEl.classList.add("disabled");
  updateTimelineSelectionJumpState();
  document.querySelectorAll(".timeline-scope-button").forEach((buttonEl) => {
    buttonEl.classList.toggle("active", buttonEl.dataset.scope === "all");
  });
  hideTimelineMenus();
  if (!silent) {
    showToast("Timeline selection", "Selection cleared.");
  }
}

function updateTimelineSelectionExportState(
  ribbonTop,
  ribbonCenter,
  ribbonHalfWidth,
) {
  if (!timelineSelectionExportShellEl || !timelineSelectionExportButtonEl) {
    return;
  }
  if (!timelineSelection.hasSelection) {
    timelineSelectionExportShellEl.hidden = true;
    timelineSelectionExportShellEl.classList.remove("active");
    timelineSelectionExportButtonEl.setAttribute("aria-expanded", "false");
    return;
  }

  timelineSelectionExportShellEl.hidden = false;
  timelineSelectionExportShellEl.classList.add("active");

  const contentWidth = timelineTrackCanvasEl.offsetWidth ||
    timelineTrackAreaEl.clientWidth || 0;
  const contentPadding = 8;
  const shellWidth = timelineSelectionExportShellEl.offsetWidth || 92;
  const minLeft = contentPadding;
  const maxLeft = Math.max(minLeft, contentWidth - contentPadding - shellWidth);
  const preferredRight = ribbonCenter + ribbonHalfWidth +
    TIMELINE_SELECTION_JUMP_GAP;
  const preferredLeft = ribbonCenter - ribbonHalfWidth -
    TIMELINE_SELECTION_JUMP_GAP - shellWidth;
  const shellLeft = preferredRight <= maxLeft
    ? preferredRight
    : timelineClamp(preferredLeft, minLeft, maxLeft);

  timelineSelectionExportShellEl.style.left = `${shellLeft}px`;
  timelineSelectionExportShellEl.style.top = `${Math.max(0, ribbonTop)}px`;
}

function updateTimelineSelectionUI(silent = true) {
  const selectedEvents = timelineEvents.filter((timelineEvent) =>
    timelineEvent.el.classList.contains("selected")
  );
  if (!selectedEvents.length) {
    clearTimelineSelection(silent);
    return;
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = 0;
  let maxBottom = 0;
  timelineSelection.selectedIds = [];

  selectedEvents.forEach((timelineEvent) => {
    const rect = getTimelineEventRect(timelineEvent.el);
    minX = Math.min(minX, rect.left);
    maxX = Math.max(maxX, rect.right);
    maxBottom = Math.max(maxBottom, rect.bottom);
    timelineSelection.selectedIds.push(timelineEvent.id);
  });

  timelineSelection.hasSelection = true;
  timelineSelection.minX = minX;
  timelineSelection.maxX = maxX;

  const { startSeconds, endSeconds, durationSeconds } =
    getTimelineDurationSeconds(minX, maxX);
  timelineBoundaryLeftEl.style.left = `${minX}px`;
  timelineBoundaryRightEl.style.left = `${maxX}px`;
  timelineBoundaryLeftLabelEl.textContent = formatTimelineSeconds(startSeconds);
  timelineBoundaryRightLabelEl.textContent = formatTimelineSeconds(endSeconds);
  timelineBoundaryLeftEl.classList.add("active");
  timelineBoundaryRightEl.classList.add("active");

  timelineSelectionDurationEl.textContent = formatTimelineSeconds(
    durationSeconds,
  );
  timelineSelectionCountEl.textContent = `${selectedEvents.length} Events`;
  const ribbonTop = maxBottom + 8;
  timelineSelectionRibbonEl.style.left = `${(minX + maxX) / 2}px`;
  timelineSelectionRibbonEl.style.top = `${ribbonTop}px`;
  timelineSelectionRibbonEl.classList.add("active");
  const contentWidth = timelineTrackCanvasEl.offsetWidth ||
    timelineTrackAreaEl.clientWidth || 0;
  const ribbonHalfWidth = (timelineSelectionRibbonEl.offsetWidth || 0) / 2;
  const contentPadding = 8;
  const minRibbonCenter = contentPadding + ribbonHalfWidth;
  const maxRibbonCenter = Math.max(
    minRibbonCenter,
    contentWidth - contentPadding - ribbonHalfWidth,
  );
  const idealRibbonCenter = (minX + maxX) / 2;
  const clampedRibbonCenter = timelineClamp(
    idealRibbonCenter,
    minRibbonCenter,
    maxRibbonCenter,
  );
  timelineSelectionRibbonEl.style.left = `${clampedRibbonCenter}px`;
  updateTimelineSelectionExportState(
    ribbonTop,
    clampedRibbonCenter,
    ribbonHalfWidth,
  );
  updateTimelineSelectionJumpState(minX, maxX);
  if (timelineContextDownloadSizeEl) {
    timelineContextDownloadSizeEl.textContent = `${
      Math.max(
        1,
        Math.round((durationSeconds / TIMELINE_DURATION_SECONDS) * 897),
      )
    } MB`;
  }
  timelineExportSelectionScopeEl.classList.remove("disabled");
}

function finalizeTimelineSelection() {
  const selectedEvents = timelineEvents.filter((timelineEvent) =>
    timelineEvent.el.classList.contains("selected")
  );
  if (!selectedEvents.length) {
    clearTimelineSelection(true);
    return;
  }

  updateTimelineSelectionUI(true);
  showToast(
    "Packet carving",
    `${selectedEvents.length} events selected across ${timelineSelectionDurationEl.textContent}.`,
  );
}

function placeTimelineMenu(menuEl, preferredLeft, preferredTop) {
  requestAnimationFrame(() => {
    const rect = menuEl.getBoundingClientRect();
    const maxLeft = Math.max(10, window.innerWidth - rect.width - 10);
    const maxTop = Math.max(10, window.innerHeight - rect.height - 10);
    menuEl.style.left = `${timelineClamp(preferredLeft, 10, maxLeft)}px`;
    menuEl.style.top = `${timelineClamp(preferredTop, 10, maxTop)}px`;
  });
}

function showTimelineContextMenu(x, y) {
  hideTimelineMenus();
  timelineContextMenuEl.classList.remove("hidden");
  timelineContextMenuEl.style.left = `${x}px`;
  timelineContextMenuEl.style.top = `${y}px`;
  placeTimelineMenu(timelineContextMenuEl, x, y);
}

function showTimelineContextMenuFromAnchor(anchorEl) {
  const isAlreadyOpen = !timelineContextMenuEl.classList.contains("hidden") &&
    anchorEl.classList.contains("active");
  if (isAlreadyOpen) {
    hideTimelineMenus();
    return;
  }
  hideTimelineMenus();
  const rect = anchorEl.getBoundingClientRect();
  timelineContextMenuEl.classList.remove("hidden");
  anchorEl.classList.add("active");
  anchorEl.setAttribute("aria-expanded", "true");
  timelineContextMenuEl.style.left = `${rect.left}px`;
  timelineContextMenuEl.style.top = `${rect.bottom + 6}px`;
  placeTimelineMenu(timelineContextMenuEl, rect.left, rect.bottom + 6);
}

function showTimelineExportMenu(anchorEl = timelineExportButtonEl) {
  const isAlreadyOpen = !timelineExportMenuEl.classList.contains("hidden") &&
    anchorEl.classList.contains("active");
  if (isAlreadyOpen) {
    hideTimelineMenus();
    return;
  }
  hideTimelineMenus();
  const rect = anchorEl.getBoundingClientRect();
  timelineExportMenuEl.classList.remove("hidden");
  anchorEl.classList.add("active");
  anchorEl.setAttribute("aria-expanded", "true");
  timelineExportMenuEl.style.left = `${rect.left}px`;
  timelineExportMenuEl.style.top = `${rect.bottom + 6}px`;
  placeTimelineMenu(timelineExportMenuEl, rect.left, rect.bottom + 6);
}

function syncTimelineViewport(
  snapshot = getEffectiveSnapshot(getCurrentView()),
) {
  if (timelineSurfaceEl.style.display === "none") {
    return;
  }

  const previousContentWidth = timelineTrackCanvasEl.offsetWidth ||
    getTimelineContentWidth();
  const previousVisibleWidth = timelineTrackAreaEl.clientWidth || 1;
  const previousFocusRatio = previousContentWidth > 0
    ? (timelineTrackAreaEl.scrollLeft + previousVisibleWidth / 2) /
      previousContentWidth
    : 0.5;
  const factor = setTimelineZoomFactor(getTimelineZoomFactor());
  const nextContentWidth = getTimelineContentWidth(factor);
  timelineTrackCanvasEl.style.width = `${nextContentWidth}px`;
  renderTimelineRuler();
  const maxScroll = Math.max(
    0,
    nextContentWidth - (timelineTrackAreaEl.clientWidth || 0),
  );
  timelineTrackAreaEl.scrollLeft = timelineClamp(
    previousFocusRatio * nextContentWidth -
      (timelineTrackAreaEl.clientWidth || 0) / 2,
    0,
    maxScroll,
  );
  timelineRulerTicksEl.style.transform = `translateX(${-timelineTrackAreaEl
    .scrollLeft}px)`;
  syncMinimapFromScroll();

  if (timelineBoundaryLeftEl.classList.contains("active")) {
    updateTimelineSelectionUI(true);
  }

  document.getElementById("timelineMeta").textContent = `Zoom: ${
    Math.round(factor * 100)
  }%, ${
    state.ephemeral.nestedTreeToggle
      ? "nested tree expanded temporarily"
      : "grouped by host cluster"
  }, ${snapshot.selectionMode} focus.`;
  ephemeralStateEl.textContent = `Timeline zoom ${
    Math.round(factor * 100)
  }%, nested tree ${
    state.ephemeral.nestedTreeToggle ? "expanded" : "unchanged"
  }.`;
}

function buildTimelineData() {
  renderTimelineTracks();
  renderTimelineRuler();
  syncTimelineViewport();
}
