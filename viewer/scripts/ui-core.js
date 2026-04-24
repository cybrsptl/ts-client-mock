/* Viewer global tooltip system — position: fixed so overflow:hidden ancestors never clip it. */
let activeViewerTooltipTarget = null;
let sidebarFlyoutOpenTimer = null;
let sidebarFlyoutCloseTimer = null;
const SIDEBAR_FLYOUT_OPEN_DELAY = 140;
const SIDEBAR_FLYOUT_CLOSE_DELAY = 180;
const viewerTooltipEl = document.createElement("div");
viewerTooltipEl.className = "viewer-global-tooltip hidden";
viewerTooltipEl.setAttribute("role", "tooltip");
document.body.appendChild(viewerTooltipEl);

function hideViewerTooltip() {
  activeViewerTooltipTarget = null;
  viewerTooltipEl.classList.add("hidden");
  viewerTooltipEl.textContent = "";
  viewerTooltipEl.removeAttribute("data-placement");
}

function positionViewerTooltip() {
  if (!activeViewerTooltipTarget || !activeViewerTooltipTarget.isConnected) {
    hideViewerTooltip();
    return;
  }
  const tooltipText = String(
    activeViewerTooltipTarget.getAttribute("data-tooltip") || "",
  ).trim();
  if (!tooltipText) {
    hideViewerTooltip();
    return;
  }
  if (viewerTooltipEl.textContent !== tooltipText)
    viewerTooltipEl.textContent = tooltipText;
  const padding = 8;
  const gap = 8;
  const rect = activeViewerTooltipTarget.getBoundingClientRect();
  const tooltipRect = viewerTooltipEl.getBoundingClientRect();
  const spaceAbove = rect.top - gap - padding;
  const spaceBelow = window.innerHeight - rect.bottom - gap - padding;
  const placeAbove =
    tooltipRect.height <= spaceAbove || spaceAbove >= spaceBelow;
  const top = placeAbove
    ? Math.max(padding, rect.top - tooltipRect.height - gap)
    : Math.min(
        window.innerHeight - padding - tooltipRect.height,
        rect.bottom + gap,
      );
  const left = Math.max(
    padding,
    Math.min(
      window.innerWidth - padding - tooltipRect.width,
      rect.left + rect.width / 2 - tooltipRect.width / 2,
    ),
  );
  viewerTooltipEl.dataset.placement = placeAbove ? "top" : "bottom";
  viewerTooltipEl.style.top = `${Math.round(top)}px`;
  viewerTooltipEl.style.left = `${Math.round(left)}px`;
}

function showViewerTooltip(target) {
  if (!target) return;
  const tooltipText = String(target.getAttribute("data-tooltip") || "").trim();
  if (!tooltipText) {
    hideViewerTooltip();
    return;
  }
  if (
    target.hasAttribute("data-tooltip-overflow") &&
    target.scrollWidth <= target.offsetWidth
  ) {
    hideViewerTooltip();
    return;
  }
  activeViewerTooltipTarget = target;
  viewerTooltipEl.textContent = tooltipText;
  viewerTooltipEl.classList.remove("hidden");
  positionViewerTooltip();
}

function getViewerTooltipTargetFromEvent(event) {
  const path =
    event && typeof event.composedPath === "function"
      ? event.composedPath()
      : [];
  return (
    path.find(
      (node) =>
        node &&
        typeof node.getAttribute === "function" &&
        String(node.getAttribute("data-tooltip") || "").trim(),
    ) || null
  );
}

document.addEventListener("mouseover", (event) => {
  const target = getViewerTooltipTargetFromEvent(event);
  if (!target) {
    hideViewerTooltip();
    return;
  }
  if (target === activeViewerTooltipTarget) {
    positionViewerTooltip();
    return;
  }
  showViewerTooltip(target);
});

document.addEventListener("mouseout", (event) => {
  if (!activeViewerTooltipTarget) return;
  const leaving = getViewerTooltipTargetFromEvent(event);
  if (!leaving || leaving !== activeViewerTooltipTarget) return;
  const rel = event.relatedTarget;
  if (
    rel &&
    typeof rel.closest === "function" &&
    rel.closest("[data-tooltip]") === activeViewerTooltipTarget
  )
    return;
  hideViewerTooltip();
});

document.addEventListener("focusin", (event) => {
  const target =
    event.target && typeof event.target.closest === "function"
      ? event.target.closest("[data-tooltip]")
      : null;
  if (!target) {
    hideViewerTooltip();
    return;
  }
  showViewerTooltip(target);
});

document.addEventListener("focusout", (event) => {
  if (!activeViewerTooltipTarget) return;
  const leaving =
    event.target && typeof event.target.closest === "function"
      ? event.target.closest("[data-tooltip]")
      : null;
  if (!leaving || leaving !== activeViewerTooltipTarget) return;
  const rel = event.relatedTarget;
  if (
    rel &&
    typeof rel.closest === "function" &&
    rel.closest("[data-tooltip]") === activeViewerTooltipTarget
  )
    return;
  hideViewerTooltip();
});

document.addEventListener(
  "scroll",
  () => {
    if (activeViewerTooltipTarget) positionViewerTooltip();
    if (state.sidebarFlyout?.open) syncSidebarFlyoutPosition();
  },
  { passive: true, capture: true },
);

function clearSidebarFlyoutTimers() {
  if (sidebarFlyoutOpenTimer) {
    window.clearTimeout(sidebarFlyoutOpenTimer);
    sidebarFlyoutOpenTimer = null;
  }
  if (sidebarFlyoutCloseTimer) {
    window.clearTimeout(sidebarFlyoutCloseTimer);
    sidebarFlyoutCloseTimer = null;
  }
}

function syncSidebarFlyoutPosition() {
  if (!sidebarFlyoutPanelEl || !toggleSidebarTopEl) return;
  const rect = toggleSidebarTopEl.getBoundingClientRect();
  const viewportPadding = 8;
  const top = Math.max(viewportPadding, rect.bottom + 14);
  const left = Math.max(viewportPadding, rect.left - 6);
  sidebarFlyoutPanelEl.style.top = `${Math.round(top)}px`;
  sidebarFlyoutPanelEl.style.left = `${Math.round(left)}px`;
  sidebarFlyoutPanelEl.style.setProperty(
    "--sidebar-flyout-top",
    `${Math.round(top)}px`,
  );
}

function syncSidebarMountTarget() {
  if (!sidebarEl || !sidebarShellEl || !sidebarFlyoutContentEl) return;
  const targetHost =
    state.collapsedSidebar && state.sidebarFlyout.open
      ? sidebarFlyoutContentEl
      : sidebarShellEl;
  if (sidebarEl.parentElement !== targetHost) {
    targetHost.appendChild(sidebarEl);
  }
}

function syncSidebarFlyout() {
  syncSidebarMountTarget();
  if (!sidebarFlyoutEl || !toggleSidebarTopEl) return;
  const isOpen = Boolean(state.collapsedSidebar && state.sidebarFlyout.open);
  sidebarFlyoutEl.classList.toggle("is-open", isOpen);
  sidebarFlyoutEl.setAttribute("aria-hidden", isOpen ? "false" : "true");
  toggleSidebarTopEl.setAttribute(
    "aria-expanded",
    String(state.collapsedSidebar ? isOpen : !state.collapsedSidebar),
  );
  if (!isOpen) return;
  syncSidebarFlyoutPosition();
}

function openSidebarFlyout(options = {}) {
  if (!state.collapsedSidebar) return;
  const { immediate = false } = options;
  if (sidebarFlyoutCloseTimer) {
    window.clearTimeout(sidebarFlyoutCloseTimer);
    sidebarFlyoutCloseTimer = null;
  }
  if (state.sidebarFlyout.open) return;
  if (sidebarFlyoutOpenTimer) {
    window.clearTimeout(sidebarFlyoutOpenTimer);
    sidebarFlyoutOpenTimer = null;
  }
  const commitOpen = () => {
    sidebarFlyoutOpenTimer = null;
    if (!state.collapsedSidebar) return;
    if (!state.sidebarFlyout.hover && !state.sidebarFlyout.focus) return;
    state.sidebarFlyout.open = true;
    syncSidebarFlyout();
  };
  if (immediate) {
    commitOpen();
    return;
  }
  sidebarFlyoutOpenTimer = window.setTimeout(
    commitOpen,
    SIDEBAR_FLYOUT_OPEN_DELAY,
  );
}

function closeSidebarFlyout(options = {}) {
  const {
    immediate = false,
    restoreFocus = false,
    clearInteraction = false,
  } = options;
  if (sidebarFlyoutOpenTimer) {
    window.clearTimeout(sidebarFlyoutOpenTimer);
    sidebarFlyoutOpenTimer = null;
  }
  const commitClose = () => {
    sidebarFlyoutCloseTimer = null;
    if (
      !clearInteraction &&
      state.collapsedSidebar &&
      (state.sidebarFlyout.hover || state.sidebarFlyout.focus)
    ) {
      return;
    }
    if (clearInteraction) {
      state.sidebarFlyout.hover = false;
      state.sidebarFlyout.focus = false;
    }
    if (!state.sidebarFlyout.open) {
      if (restoreFocus) {
        window.setTimeout(() => toggleSidebarTopEl?.focus(), 0);
      }
      return;
    }
    state.sidebarFlyout.open = false;
    syncSidebarFlyout();
    if (restoreFocus) {
      window.setTimeout(() => toggleSidebarTopEl?.focus(), 0);
    }
  };
  if (immediate) {
    commitClose();
    return;
  }
  if (sidebarFlyoutCloseTimer) {
    window.clearTimeout(sidebarFlyoutCloseTimer);
  }
  sidebarFlyoutCloseTimer = window.setTimeout(
    commitClose,
    SIDEBAR_FLYOUT_CLOSE_DELAY,
  );
}

window.clearSidebarFlyoutTimers = clearSidebarFlyoutTimers;
window.openSidebarFlyout = openSidebarFlyout;
window.closeSidebarFlyout = closeSidebarFlyout;
window.syncSidebarFlyoutPosition = syncSidebarFlyoutPosition;

function render() {
  syncParentIds(state);
  const sidebarOpen = !state.collapsedSidebar;
  chromeSidebarSlotEl.classList.toggle("collapsed", state.collapsedSidebar);
  sidebarShellEl.classList.toggle("collapsed", state.collapsedSidebar);
  toggleSidebarTopEl.classList.toggle("hidden", sidebarOpen);
  toggleSidebarSideEl.classList.toggle("hidden", !sidebarOpen);
  toggleSidebarSideEl.setAttribute("aria-expanded", String(sidebarOpen));
  labPanelEl.classList.toggle("open", state.labPanelOpen);
  labToggleEl.setAttribute("aria-expanded", String(state.labPanelOpen));
  labToggleEl.classList.toggle("is-active", state.labPanelOpen);
  panelSettingsButtonEl.classList.toggle("active", state.panelMenuOpen);
  renderTree();
  renderTopbar();
  renderViewerState();
  if (typeof renderViewNotesPane === "function") {
    renderViewNotesPane();
  }
  renderPanelMenu();
  syncSidebarFlyout();
}

function openMenu(anchorEl, items, saveMenu = false) {
  const menu = saveMenu ? saveMenuEl : contextMenuEl;
  const isAlreadyOpen =
    !menu.classList.contains("hidden") &&
    anchorEl &&
    anchorEl.classList &&
    (anchorEl.classList.contains("active") ||
      anchorEl.classList.contains("is-active"));
  if (isAlreadyOpen) {
    closeMenus();
    return;
  }

  closeMenus();
  const rowAnchorEl =
    anchorEl && typeof anchorEl.closest === "function"
      ? anchorEl.closest(".row")
      : null;
  if (rowAnchorEl && rowAnchorEl.dataset.id) {
    menuAnchorId = rowAnchorEl.dataset.id;
    rowAnchorEl.classList.add("context-open");
  }
  if (anchorEl && anchorEl.classList) {
    anchorEl.classList.add("active", "is-active");
    if (anchorEl.hasAttribute("aria-expanded")) {
      anchorEl.setAttribute("aria-expanded", "true");
    }
  }
  menu.innerHTML = "";
  menu.classList.remove("hidden");
  if (saveMenu) {
    saveMenuButtonEl.classList.add("active");
  }
  items.forEach((item) => {
    if (item.type === "divider") {
      const divider = document.createElement("div");
      divider.className = "divider";
      menu.appendChild(divider);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-item";
    button.innerHTML = `
            <span class="menu-item-inner">
              ${
                item.icon
                  ? `<span class="menu-item-icon">${svgMaskMarkup(item.icon)}</span>`
                  : ""
              }
              <span class="menu-item-label">${item.label}</span>
              ${
                item.trailing === "right"
                  ? `<span class="menu-item-trailing">${collectionArrowSvg(
                      "right",
                    )}</span>`
                  : ""
              }
            </span>
          `;
    button.addEventListener("click", () => {
      item.onClick();
      closeMenus();
    });
    menu.appendChild(button);
  });
  const rect = anchorEl.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
  menu.style.left = `${Math.max(10, rect.left + window.scrollX - 6)}px`;
}

function panelOptionMeta() {
  return [
    { key: "network", label: "Network", icon: "../icons/icon_network.svg" },
    { key: "hosts", label: "Hosts", icon: "../icons/icon_host.svg" },
    { key: "timeline", label: "Timeline", icon: "../icons/icon_timeline.svg" },
    {
      key: "inspector",
      label: "Inspector",
      icon: "../icons/icon_layout_right.svg",
    },
    { type: "divider" },
    {
      key: "artifacts",
      label: "Artifacts",
      icon: "../icons/icon_artifact.svg",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: "../icons/icon_dashboard.svg",
    },
    { key: "world", label: "World", icon: "../icons/icon_world.svg" },
    { type: "divider" },
    { key: "flow", label: "Flow", icon: "../icons/icon_connection.svg" },
    { type: "divider" },
    { key: "alerts", label: "Alerts", icon: "../icons/icon_alert.svg" },
    { key: "cases", label: "Cases", icon: "../icons/icon_briefcase.svg" },
    { type: "divider" },
    {
      key: "showPanelTabs",
      label: "Show Panel Tabs",
      icon: "../icons/icon_sidebar.svg",
    },
  ];
}

function renderPanelMenu() {
  if (!state.panelMenuOpen) {
    panelMenuEl.classList.add("hidden");
    return;
  }

  const current = getCurrentView();
  const snapshot = getEffectiveSnapshot(current);
  const toggles = snapshot.panelToggles || defaultPanelToggles();
  panelMenuEl.innerHTML = "";
  panelMenuEl.classList.remove("hidden");

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "menu-item";
  undoButton.disabled = !current.undoStack.length;
  undoButton.innerHTML = `
          <span class="menu-item-inner">
            <span class="menu-item-icon">${svgMaskMarkup(
              "../icons/icon_undo.svg",
            )}</span>
            <span class="menu-item-label">Undo</span>
          </span>
          <span class="menu-item-shortcut">
            <span class="menu-item-shortcut-chip">${
              navigator.platform.includes("Mac") ? "⌘Z" : "Ctrl+Z"
            }</span>
          </span>
        `;
  undoButton.addEventListener("click", () => {
    if (!current.undoStack.length) return;
    undoViewEdit(current);
    state.panelMenuOpen = true;
  });
  panelMenuEl.appendChild(undoButton);

  const undoDivider = document.createElement("div");
  undoDivider.className = "divider";
  panelMenuEl.appendChild(undoDivider);

  const section = document.createElement("div");
  section.className = "menu-section-label";
  section.textContent = "Panels";
  panelMenuEl.appendChild(section);

  panelOptionMeta().forEach((item) => {
    if (item.type === "divider") {
      const divider = document.createElement("div");
      divider.className = "divider";
      panelMenuEl.appendChild(divider);
      return;
    }

    const row = document.createElement("button");
    row.type = "button";
    row.className = "panel-toggle-row";
    row.innerHTML = `
            <span class="panel-toggle-main">
              ${svgMaskMarkup(item.icon)}
              <span class="panel-toggle-label">${item.label}</span>
            </span>
            <span class="toggle-switch ${toggles[item.key] ? "on" : ""}"></span>
          `;
    row.addEventListener("click", () => togglePanelSetting(item.key));
    panelMenuEl.appendChild(row);
  });

  const rect = panelSettingsButtonEl.getBoundingClientRect();
  panelMenuEl.style.top = `${rect.bottom + window.scrollY + 6}px`;
  const menuWidth = panelMenuEl.offsetWidth || 0;
  const viewportPadding = 10;
  const minLeft = window.scrollX + viewportPadding;
  const maxLeft =
    window.scrollX + window.innerWidth - menuWidth - viewportPadding;
  const preferredLeft = rect.right + window.scrollX - menuWidth;
  panelMenuEl.style.left = `${Math.max(
    minLeft,
    Math.min(maxLeft, preferredLeft),
  )}px`;
}

function closeMenus() {
  contextMenuEl.classList.add("hidden");
  saveMenuEl.classList.add("hidden");
  panelMenuEl.classList.add("hidden");
  if (userSettingsMenuEl) userSettingsMenuEl.classList.add("hidden");
  if (userThemeMenuEl) userThemeMenuEl.classList.add("hidden");
  if (typeof clearUserThemeHoverCloseTimer === "function") {
    clearUserThemeHoverCloseTimer();
  }
  hideTimelineMenus();
  state.panelMenuOpen = false;
  panelSettingsButtonEl.classList.remove("active");
  if (userSettingsButtonEl) {
    userSettingsButtonEl.setAttribute("aria-expanded", "false");
  }
  if (userThemeTriggerEl) {
    userThemeTriggerEl.classList.remove("active");
    userThemeTriggerEl.setAttribute("aria-expanded", "false");
  }
  saveMenuButtonEl.classList.remove("active");
  menuAnchorId = null;
  document
    .querySelectorAll(
      ".menu-anchor-button.active, .menu-anchor-button.is-active",
    )
    .forEach((button) => {
      button.classList.remove("active", "is-active");
      if (button.hasAttribute("aria-expanded")) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  if (viewNotesButtonEl && state.notesPanel.open) {
    viewNotesButtonEl.classList.add("active");
  }
  document
    .querySelectorAll(".row.context-open")
    .forEach((row) => row.classList.remove("context-open"));
}

function summarizePanelVisibility(snapshot) {
  const visible = [];
  if (snapshot.panelToggles.network) visible.push("Map");
  if (snapshot.panelToggles.inspector) visible.push("Inspector");
  if (snapshot.panelToggles.timeline) visible.push("Timeline");
  return visible.length ? visible.join(" + ") : "No primary panels";
}

function isManagedPanelToggleKey(key) {
  return (
    Object.prototype.hasOwnProperty.call(defaultPanelToggles(), key) &&
    key !== "showPanelTabs"
  );
}

function getStripIdForTab(tabId) {
  const tabEl = document.querySelector(`[data-panel-tab="${tabId}"]`);
  const stripEl = tabEl ? tabEl.closest("[data-tab-strip]") : null;
  return stripEl ? stripEl.getAttribute("data-tab-strip") : null;
}

function syncActiveTabForStrip(working, stripId) {
  if (!stripId) return;
  const nextActive = getTabStripOrder(stripId).find((id) => {
    const toggleVisible =
      !Object.prototype.hasOwnProperty.call(working.panelToggles, id) ||
      working.panelToggles[id];
    return toggleVisible && !working.closedPanelTabs.includes(id);
  });
  working.activePanelTabs = {
    ...working.activePanelTabs,
    [stripId]: nextActive || null,
  };
}

function togglePanelSetting(key) {
  state.panelMenuOpen = true;
  commitViewMutation(
    (view) => {
      const snapshot = cloneSnapshot(view.savedSnapshot);
      const nextToggles = {
        ...snapshot.panelToggles,
        [key]: !snapshot.panelToggles[key],
      };
      snapshot.panelToggles = nextToggles;
      if (isManagedPanelToggleKey(key)) {
        if (nextToggles[key]) {
          snapshot.closedPanelTabs = snapshot.closedPanelTabs.filter(
            (id) => id !== key,
          );
          const stripId = getStripIdForTab(key);
          if (stripId && !snapshot.activePanelTabs[stripId]) {
            snapshot.activePanelTabs = {
              ...snapshot.activePanelTabs,
              [stripId]: key,
            };
          }
        } else if (!snapshot.closedPanelTabs.includes(key)) {
          snapshot.closedPanelTabs = [...snapshot.closedPanelTabs, key];
        }
        syncActiveTabForStrip(snapshot, getStripIdForTab(key));
      }
      snapshot.panelVisibility = summarizePanelVisibility(snapshot);
      view.savedSnapshot = snapshot;
    },
    `${key === "showPanelTabs" ? "Panel tabs" : "Panel visibility"} toggled.`,
    { group: "panel-menu" },
  );
}

function getTabStripOrder(stripId) {
  const stripEl = document.querySelector(`[data-tab-strip="${stripId}"]`);
  if (!stripEl) return [];
  return Array.from(stripEl.querySelectorAll("[data-panel-tab]")).map((tabEl) =>
    tabEl.getAttribute("data-panel-tab"),
  );
}

function getOverflowedTabs(stripEl) {
  const overflowButton = stripEl.querySelector("[data-tab-overflow]");
  const stripRect = stripEl.getBoundingClientRect();
  const reservedRight =
    overflowButton && !overflowButton.classList.contains("hidden")
      ? overflowButton.getBoundingClientRect().width
      : 0;
  return Array.from(stripEl.querySelectorAll("[data-panel-tab]"))
    .filter((tabEl) => tabEl.style.display !== "none")
    .filter((tabEl) => {
      const rect = tabEl.getBoundingClientRect();
      return (
        rect.left < stripRect.left ||
        rect.right > stripRect.right - reservedRight
      );
    });
}

function refreshTabOverflow() {
  document.querySelectorAll("[data-tab-strip]").forEach((stripEl) => {
    const overflowButton = stripEl.querySelector("[data-tab-overflow]");
    if (!overflowButton) return;
    overflowButton.classList.add("hidden");
    overflowButton.querySelector(".tab-overflow-label").textContent = "+0";
    const tabs = Array.from(
      stripEl.querySelectorAll("[data-panel-tab]"),
    ).filter((tabEl) => tabEl.style.display !== "none");
    if (!tabs.length) return;
    const hasOverflow = stripEl.scrollWidth > stripEl.clientWidth + 1;
    if (!hasOverflow) return;
    overflowButton.classList.remove("hidden");
    const hiddenTabs = getOverflowedTabs(stripEl);
    overflowButton.querySelector(".tab-overflow-label").textContent =
      `+${hiddenTabs.length}`;
  });
}

function openTabOverflowMenu(stripId, anchorEl) {
  const stripEl = document.querySelector(`[data-tab-strip="${stripId}"]`);
  if (!stripEl) return;
  const hiddenTabs = getOverflowedTabs(stripEl);
  if (!hiddenTabs.length) return;
  const items = hiddenTabs.map((tabEl) => ({
    label: tabEl.querySelector(".tab-label").textContent,
    icon:
      tabEl
        .querySelector(".tab-icon")
        ?.style.getPropertyValue("--icon-url")
        ?.replace(/^url\(["']?/, "")
        .replace(/["']?\)$/, "") || null,
    onClick: () =>
      setActivePanelTab(stripId, tabEl.getAttribute("data-panel-tab")),
  }));
  openMenu(anchorEl, items, false);
}

function setActivePanelTab(stripId, tabId) {
  commitViewMutation(
    (view) => {
      const snapshot = cloneSnapshot(view.savedSnapshot);
      if (snapshot.closedPanelTabs.includes(tabId)) {
        snapshot.closedPanelTabs = snapshot.closedPanelTabs.filter(
          (id) => id !== tabId,
        );
      }
      if (isManagedPanelToggleKey(tabId)) {
        snapshot.panelToggles = { ...snapshot.panelToggles, [tabId]: true };
      }
      snapshot.activePanelTabs = {
        ...snapshot.activePanelTabs,
        [stripId]: tabId,
      };
      view.savedSnapshot = snapshot;
    },
    `${tabId} moved into focus in the ${stripId} panel.`,
    { group: "panel-tabs" },
  );
}

function closePanelTab(stripId, tabId) {
  commitViewMutation(
    (view) => {
      const snapshot = cloneSnapshot(view.savedSnapshot);
      if (!snapshot.closedPanelTabs.includes(tabId)) {
        snapshot.closedPanelTabs = [...snapshot.closedPanelTabs, tabId];
      }
      if (isManagedPanelToggleKey(tabId)) {
        snapshot.panelToggles = { ...snapshot.panelToggles, [tabId]: false };
      }
      syncActiveTabForStrip(snapshot, stripId);
      view.savedSnapshot = snapshot;
    },
    `${tabId} closed from the ${stripId} panel.`,
    { group: "panel-tabs" },
  );
}

function iconImg(src) {
  return svgMaskMarkup(src);
}

function svgMaskMarkup(src, extraClass = "") {
  if (typeof window.getInlineSvgIcon === "function") {
    return window.getInlineSvgIcon(src, extraClass);
  }
  const className = extraClass ? `svg-icon ${extraClass}` : "svg-icon";
  return `<span class="${className}" style="--icon-url: url('${src}')" aria-hidden="true"></span>`;
}

function collectionArrowSvg(direction) {
  if (direction === "right") {
    return `
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M6 4L11 8L6 12V4Z" fill="currentColor"></path>
            </svg>
          `;
  }
  return `
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 6L8 11L12 6H4Z" fill="currentColor"></path>
          </svg>
        `;
}
