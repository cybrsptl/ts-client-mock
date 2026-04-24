function renderTopbar() {
  const current = getCurrentView();
  const statusMeta = getViewStatusMeta(current);
  saveMenuButtonEl.classList.remove("visible", "active");
  saveMenuButtonEl.hidden = true;
  if (viewNotesButtonEl) {
    viewNotesButtonEl.classList.toggle("active", state.notesPanel.open);
    viewNotesButtonEl.setAttribute(
      "aria-expanded",
      state.notesPanel.open ? "true" : "false",
    );
  }
  setStatusBadge(activeBadgeEl, statusMeta.label, statusMeta.status);

  const undoCount = current.undoStack.length;
  setStatusBadge(
    sessionBadgeEl,
    `${undoCount} undo ${undoCount === 1 ? "step" : "steps"}`,
    undoCount > 0 ? "online" : "ready",
  );
  filterViewsInputEl.value = state.filterQuery;
  clearFilterButtonEl.style.visibility = state.filterQuery
    ? "visible"
    : "hidden";
}

function setStatusBadge(element, label, status) {
  if (!element) return;
  element.className = `status-badge status-${status}`;
  const labelEl = element.querySelector(".status-badge-label");
  if (labelEl) {
    labelEl.textContent = label;
  } else {
    element.textContent = label;
  }
}

function getHostsScoreClass(value) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return "";
  if (numeric >= 75) return "high";
  if (numeric >= 45) return "medium";
  return "low";
}

function renderHostsTable(snapshot) {
  const scope = snapshot.hostsScope || "internal";
  const config = HOSTS_TABLES[scope];
  document.querySelectorAll("[data-host-scope]").forEach((buttonEl) => {
    const isActive = buttonEl.getAttribute("data-host-scope") === scope;
    buttonEl.classList.toggle("active", isActive);
    buttonEl.setAttribute("aria-selected", String(isActive));
  });
  const headerMarkup = config.columns
    .map((label) => `<div class="hosts-table-cell">${label}</div>`)
    .join("");
  const rowMarkup = config.rows
    .map((row) => {
      if (scope === "internal") {
        return `
                <div class="hosts-table-row" style="grid-template-columns: ${config.gridTemplate}">
                  <div class="hosts-table-cell">
                    <span class="hosts-name-cell">
                      <span class="hosts-checkbox" aria-hidden="true"></span>
                      ${
          svgMaskMarkup("../icons/icon_host.svg", "hosts-device-icon")
        }
                      <span class="hosts-name-text">${row.hostname}</span>
                    </span>
                  </div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.address}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.mac}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-os-badge">${row.os}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.devices}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-score ${
          getHostsScoreClass(row.riskScore)
        }">${row.riskScore}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-score ${
          getHostsScoreClass(row.valueScore)
        }">${row.valueScore}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-score ${
          getHostsScoreClass(row.networkScore)
        }">${row.networkScore}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.valueRank}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.cves}</span></div>
                  <div class="hosts-table-cell"><span class="hosts-value-text">${row.apps}</span></div>
                  <div class="hosts-table-cell">
                    <span class="hosts-tag-list">
                      ${
          row.tags.map((tag) =>
            `<span class="hosts-tag ${
              /vulnerable/i.test(tag)
                ? "alert"
                : /agent/i.test(tag)
                ? "agent"
                : ""
            }">${tag}</span>`
          ).join("")
        }
                    </span>
                  </div>
                </div>
              `;
      }
      return `
              <div class="hosts-table-row" style="grid-template-columns: ${config.gridTemplate}">
                <div class="hosts-table-cell">
                  <span class="hosts-name-cell">
                    <span class="hosts-checkbox" aria-hidden="true"></span>
                    ${
        svgMaskMarkup("../icons/icon_external_hosts.svg", "hosts-device-icon")
      }
                    <span class="hosts-name-text">${row.name}</span>
                  </span>
                </div>
                <div class="hosts-table-cell">
                  <span class="hosts-country-pill">US</span>
                  <span class="hosts-value-text">${row.address}</span>
                </div>
                <div class="hosts-table-cell">
                  <span class="hosts-tag-list">
                    ${
        row.tags.map((tag) =>
          `<span class="hosts-tag ${
            /benign/i.test(tag) ? "benign" : ""
          }">${tag}</span>`
        ).join("")
      }
                  </span>
                </div>
                <div class="hosts-table-cell">
                  ${
        svgMaskMarkup("../icons/icon_world.svg", "hosts-inline-icon")
      }
                  <span class="hosts-value-text">${row.context}</span>
                </div>
                <div class="hosts-table-cell"><span class="hosts-value-text">${row.type}</span></div>
                <div class="hosts-table-cell">
                  <span class="hosts-assignee">
                    <span class="hosts-avatar">${row.assignee.initials}</span>
                    <span class="hosts-value-text">${row.assignee.name}</span>
                  </span>
                </div>
                <div class="hosts-table-cell"><span class="hosts-value-text">${row.hopCount}</span></div>
              </div>
            `;
    })
    .join("");
  hostsTableShellEl.innerHTML = `
          <div class="hosts-table" data-hosts-table="${scope}">
            <div class="hosts-table-header" style="grid-template-columns: ${config.gridTemplate}">
              ${headerMarkup}
            </div>
            ${rowMarkup}
          </div>
        `;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderViewerState() {
  const current = getCurrentView();
  const snapshot = getEffectiveSnapshot(current);
  const dirtyReasons = getDirtyReasons(current);
  const statusMeta = getViewStatusMeta(current);
  const collection = getCollectionForView(current.id);
  const toggles = snapshot.panelToggles || defaultPanelToggles();
  const closedTabs = new Set(snapshot.closedPanelTabs || []);
  const resolvedActiveTabs = {};
  const panelSizes = { ...defaultPanelSizes(), ...(snapshot.panelSizes || {}) };

  currentViewNameEl.textContent = current.name;
  snapshotStatusEl.textContent = statusMeta.detail;
  dirtyReasonsEl.textContent = dirtyReasons.length
    ? dirtyReasons.join(", ")
    : "None";
  notesStateEl.textContent = hasViewNotes(current)
    ? "Notes are autosaved with this View."
    : "No notes saved for this View.";
  ephemeralStateEl.textContent =
    `Timeline zoom ${state.ephemeral.timelineZoom}%, nested tree ${
      state.ephemeral.nestedTreeToggle ? "expanded" : "unchanged"
    }.`;
  activeCollectionLabelEl.textContent = `Collection: ${
    collection ? collection.name : "Unknown"
  }`;

  viewerCanvasEl.className = `viewer-canvas ${snapshot.layout}`;
  viewerCanvasEl.classList.toggle("no-inspector", !toggles.inspector);
  viewerCanvasEl.classList.toggle("no-timeline", !toggles.timeline);
  viewerCanvasEl.classList.toggle("no-tabs", !toggles.showPanelTabs);
  if (snapshot.layout === "balanced" && toggles.timeline) {
    viewerCanvasEl.style.gridTemplateRows =
      `minmax(0, 1fr) 1px ${panelSizes.timelineHeight}px`;
    topTimelineResizeHandleEl.style.display = "";
  } else {
    viewerCanvasEl.style.gridTemplateRows = "minmax(0, 1fr)";
    topTimelineResizeHandleEl.style.display = "none";
  }
  if (toggles.inspector) {
    viewerTopRegionEl.style.gridTemplateColumns =
      `minmax(600px, 1fr) 1px ${panelSizes.inspectorWidth}px`;
    inspectorSurfaceEl.style.display = "";
    workspaceInspectorResizeHandleEl.style.display = "";
  } else {
    viewerTopRegionEl.style.gridTemplateColumns = "minmax(600px, 1fr)";
    inspectorSurfaceEl.style.display = "none";
    workspaceInspectorResizeHandleEl.style.display = "none";
  }
  timelineSurfaceEl.style.display = toggles.timeline ? "" : "none";
  timelineRegionEl.style.gridTemplateColumns =
    `${panelSizes.timelineSidebarWidth}px 1px minmax(0, 1fr)`;
  timelineSidebarResizeHandleEl.style.display = toggles.timeline ? "" : "none";
  document.querySelectorAll("[data-tab-strip]").forEach((stripEl) => {
    const stripId = stripEl.getAttribute("data-tab-strip");
    const tabEls = Array.from(stripEl.querySelectorAll("[data-panel-tab]"));
    const visibleTabEls = tabEls.filter((tabEl) => {
      const key = tabEl.getAttribute("data-panel-tab");
      const toggleVisible =
        !Object.prototype.hasOwnProperty.call(toggles, key) || toggles[key];
      const visible = toggleVisible && !closedTabs.has(key);
      tabEl.style.display = visible ? "" : "none";
      return visible;
    });
    const preferredActiveId = snapshot.activePanelTabs[stripId];
    const activeId = visibleTabEls.some(
        (tabEl) => tabEl.getAttribute("data-panel-tab") === preferredActiveId,
      )
      ? preferredActiveId
      : visibleTabEls[0]?.getAttribute("data-panel-tab") || null;
    visibleTabEls.forEach((tabEl) => {
      tabEl.classList.toggle(
        "active",
        tabEl.getAttribute("data-panel-tab") === activeId,
      );
    });
    resolvedActiveTabs[stripId] = activeId;
    stripEl.style.display = toggles.showPanelTabs && visibleTabEls.length
      ? ""
      : "none";
  });
  const activeMainTab = resolvedActiveTabs.main || "network";
  workspaceDefaultPanelEl.classList.toggle(
    "hidden",
    activeMainTab === "hosts" || activeMainTab === "alerts",
  );
  workspaceHostsPanelEl.classList.toggle("hidden", activeMainTab !== "hosts");
  if (workspaceAlertsPanelEl) {
    workspaceAlertsPanelEl.classList.toggle(
      "hidden",
      activeMainTab !== "alerts",
    );
  }
  renderHostsTable(snapshot);
  if (typeof renderAlertsTable === "function") {
    renderAlertsTable(snapshot, activeMainTab);
  }
  document.getElementById("networkMeta").textContent =
    `Pinned filter: ${snapshot.pinnedFilter}`;
  document.getElementById("inspectorMeta").textContent = `Open tabs: ${
    snapshot.tabs.join(", ")
  }`;
  document.getElementById("selectedEntity").textContent =
    snapshot.inspectorEntity;
  document.getElementById("selectionState").textContent =
    snapshot.selectionLabel;
  document.getElementById("panelVisibility").textContent =
    summarizePanelVisibility(snapshot);
  document.getElementById("layoutModeLabel").textContent = layoutLabel(
    snapshot.layout,
  );
  document.getElementById("timelineMeta").textContent =
    `Zoom: ${state.ephemeral.timelineZoom}%, ${
      state.ephemeral.nestedTreeToggle
        ? "nested tree expanded temporarily"
        : "grouped by host cluster"
    }, ${snapshot.selectionMode} focus.`;
  syncTimelineViewport(snapshot);
  document.getElementById("hostCount").textContent = getHostCount(snapshot);
  document.getElementById("flowCount").textContent = getFlowCount(snapshot);
  refreshTabOverflow();
}

function layoutLabel(layout) {
  if (layout === "map-only") return "Map only";
  if (layout === "dashboard-focus") return "Dashboard focus";
  return "Balanced triage";
}

function getHostCount(snapshot) {
  if (snapshot.selectionMode === "subnet") return "187";
  if (snapshot.selectionMode === "segment") return "92";
  if (snapshot.selectionMode === "dashboard") return "216";
  if (snapshot.selectionMode === "alert-queue") return "41";
  return "128";
}

function getFlowCount(snapshot) {
  if (snapshot.pinnedFilter.includes("severity")) return "6.2k in 60m";
  if (snapshot.pinnedFilter.includes("iot")) return "3.7k in 60m";
  if (snapshot.pinnedFilter.includes("bank")) return "1.9k in 60m";
  return "18.4k in 60m";
}

function getCollectionForView(viewId) {
  let parentId = getView(viewId).parentId;
  while (parentId) {
    const found = getNodeById(parentId);
    if (!found) return null;
    if (found.node.type === "collection") return found.node;
    parentId = found.parent ? found.parent.id : null;
  }
  return null;
}

function getAnchoredViewNotesPosition() {
  const size = {
    ...defaultNotesPanelSize(),
    ...(state.notesPanel.size || {}),
  };
  const rect = viewNotesButtonEl?.getBoundingClientRect();
  const preferredLeft = rect
    ? rect.right - size.width
    : window.innerWidth - size.width - 16;
  const preferredTop = rect ? rect.bottom + 8 : 56;
  return clampViewNotesPosition(
    { left: preferredLeft, top: preferredTop },
    size,
  );
}

function clampViewNotesPosition(position, size = state.notesPanel.size) {
  const nextSize = {
    ...defaultNotesPanelSize(),
    ...(size || {}),
  };
  const maxLeft = Math.max(12, window.innerWidth - nextSize.width - 12);
  const maxTop = Math.max(52, window.innerHeight - nextSize.height - 12);
  return {
    left: clamp(position?.left ?? 12, 12, maxLeft),
    top: clamp(position?.top ?? 52, 52, maxTop),
  };
}

function applyViewNotesFrame() {
  if (!viewNotesFloatEl) return;
  const size = {
    ...defaultNotesPanelSize(),
    ...(state.notesPanel.size || {}),
  };
  const position = clampViewNotesPosition(
    state.notesPanel.position || getAnchoredViewNotesPosition(),
    size,
  );
  state.notesPanel.size = size;
  state.notesPanel.position = position;
  viewNotesFloatEl.style.width = `${size.width}px`;
  viewNotesFloatEl.style.height = `${size.height}px`;
  viewNotesFloatEl.style.left = `${position.left}px`;
  viewNotesFloatEl.style.top = `${position.top}px`;
}

function renderViewNotesPane() {
  if (!viewNotesFloatEl || !viewNotesEditorEl) return;
  const current = getCurrentView();
  const markdown = getEffectiveMarkdown(current);

  viewNotesFloatEl.classList.toggle("hidden", !state.notesPanel.open);
  viewNotesFloatEl.setAttribute(
    "aria-hidden",
    state.notesPanel.open ? "false" : "true",
  );
  if (!state.notesPanel.open) return;
  const shouldSyncEditor = viewNotesEditorEl.dataset.viewId !== current.id ||
    document.activeElement !== viewNotesEditorEl;
  if (shouldSyncEditor) {
    viewNotesEditorEl.value = markdown;
  }
  viewNotesEditorEl.dataset.viewId = current.id;
  viewNotesEditorEl.setAttribute(
    "aria-label",
    `Edit notes for ${current.name}`,
  );
  applyViewNotesFrame();
  syncViewNotesDraftState();
}

function syncViewNotesDraftState() {
  if (!viewNotesEditorEl) return;
  viewNotesEditorEl.dataset.hasContent = hasViewNotes(getCurrentView())
    ? "true"
    : "false";
}
