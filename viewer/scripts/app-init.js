function activateView(viewId) {
  if (state.activeViewId === viewId) return;
  clearTimelineSelection(true);
  state.activeViewId = viewId;
  const target = getCurrentView();
  addLog("Activated view", `${target.name} applied from its autosaved state.`);
  render();
}

function saveActiveView() {
  showToast(
    "Autosave enabled",
    "Views now save automatically. Use Undo from Panel Settings to step back through edits.",
  );
}

function saveAsNewView(sourceViewId = null) {
  const source = sourceViewId ? getView(sourceViewId) : getCurrentView();
  const sourceSnapshot = source.savedSnapshot;
  const sourceMarkdown = source.savedMarkdown || "";
  const parentId = source.parentId || "collection-networks";
  const newName = prompt("Duplicate View", `${source.name} Copy`);
  if (!newName) return;
  const newId = `view-${slugify(newName)}-${Date.now().toString(36).slice(-4)}`;
  state.views[newId] = {
    id: newId,
    name: newName,
    parentId,
    savedSnapshot: cloneSnapshot(sourceSnapshot),
    savedMarkdown: sourceMarkdown,
    sourceKind: "duplicate",
    dataStatus: "aligned",
    undoStack: [],
    workingCopy: null,
    workingMarkdown: null,
    hasParkedChanges: false,
  };
  insertNodeIntoParent(parentId, { id: newId, type: "view" });
  addLog(
    "Duplicated view",
    `${newName} created under the current parent location.`,
  );
  showToast(
    "Duplicate created",
    `${newName} starts as a derived View so analysts can verify it before treating it as canonical.`,
  );
  render();
}

function revertActiveView() {
  if (!undoViewEdit(getCurrentView())) {
    showToast(
      "Nothing to undo",
      "This View has no earlier autosaved state in the current session.",
    );
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function beginPanelResize(type, event) {
  event.preventDefault();
  const snapshot = getEffectiveSnapshot(getCurrentView());
  const panelSizes = { ...defaultPanelSizes(), ...(snapshot.panelSizes || {}) };
  resizeDrag = {
    type,
    startX: event.clientX,
    startY: event.clientY,
    startSizes: {
      ...panelSizes,
      sidebarWidth: clampSidebarWidth(state.sidebarWidth),
    },
    startedViewId: state.activeViewId,
  };
  event.currentTarget.classList.add("dragging");
  document.body.classList.add("resizing-panels");
}

function handlePanelResizeMove(event) {
  if (!resizeDrag || resizeDrag.startedViewId !== state.activeViewId) return;
  if (resizeDrag.type === "sidebar-width") {
    const sidebarWidth = clampSidebarWidth(
      resizeDrag.startSizes.sidebarWidth +
        (event.clientX - resizeDrag.startX),
    );
    if (sidebarWidth !== state.sidebarWidth) {
      state.sidebarWidth = sidebarWidth;
      if (typeof syncSidebarWidth === "function") {
        syncSidebarWidth();
      }
    }
    return;
  }
  if (resizeDrag.type === "inspector") {
    const maxInspectorWidth = Math.max(
      320,
      Math.min(600, viewerTopRegionEl.clientWidth - 600 - 1),
    );
    const inspectorWidth = clamp(
      resizeDrag.startSizes.inspectorWidth +
        (resizeDrag.startX - event.clientX),
      320,
      maxInspectorWidth,
    );
    setPanelSizesPatch({ inspectorWidth });
    return;
  }
  if (resizeDrag.type === "timeline-height") {
    const maxTimelineHeight = Math.max(
      220,
      viewerCanvasEl.clientHeight - 220 - 1,
    );
    const timelineHeight = clamp(
      resizeDrag.startSizes.timelineHeight +
        (resizeDrag.startY - event.clientY),
      220,
      maxTimelineHeight,
    );
    setPanelSizesPatch({ timelineHeight });
    return;
  }
  if (resizeDrag.type === "timeline-sidebar") {
    const maxSidebarWidth = Math.max(
      240,
      Math.min(520, timelineRegionEl.clientWidth - 320 - 1),
    );
    const timelineSidebarWidth = clamp(
      resizeDrag.startSizes.timelineSidebarWidth +
        (event.clientX - resizeDrag.startX),
      240,
      maxSidebarWidth,
    );
    setPanelSizesPatch({ timelineSidebarWidth });
  }
}

function endPanelResize() {
  if (!resizeDrag) return;
  document
    .querySelectorAll(".panel-resize-handle.dragging")
    .forEach((handle) => handle.classList.remove("dragging"));
  document.body.classList.remove("resizing-panels");
  const currentSizes = getEffectiveSnapshot(getCurrentView()).panelSizes ||
    defaultPanelSizes();
  const startSizes = resizeDrag.startSizes;
  if (JSON.stringify(currentSizes) !== JSON.stringify(startSizes)) {
    addLog("Autosaved view", "Panel sizes updated through drag resize.");
  }
  resizeDrag = null;
  refreshTabOverflow();
}
workspaceInspectorResizeHandleEl.addEventListener(
  "pointerdown",
  (event) => beginPanelResize("inspector", event),
);
sidebarResizeHandleEl?.addEventListener("pointerdown", (event) =>
  beginPanelResize("sidebar-width", event)
);
sidebarFlyoutResizeHandleEl?.addEventListener("pointerdown", (event) =>
  beginPanelResize("sidebar-width", event)
);
topTimelineResizeHandleEl.addEventListener(
  "pointerdown",
  (event) => beginPanelResize("timeline-height", event),
);
timelineSidebarResizeHandleEl.addEventListener(
  "pointerdown",
  (event) => beginPanelResize("timeline-sidebar", event),
);
window.addEventListener("pointermove", handlePanelResizeMove);
window.addEventListener("pointerup", endPanelResize);
window.addEventListener("pointercancel", endPanelResize);
labCollapseEl?.addEventListener("click", () => {
  state.labPanelOpen = false;
  render();
});
panelSettingsButtonEl.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = state.panelMenuOpen ||
    !panelMenuEl.classList.contains("hidden");
  if (isOpen) {
    closeMenus();
    render();
    return;
  }
  closeMenus();
  state.panelMenuOpen = true;
  render();
});

function handleSidebarFlyoutRegionEnter() {
  if (!state.collapsedSidebar) return;
  state.sidebarFlyout.hover = true;
  if (typeof openSidebarFlyout === "function") {
    openSidebarFlyout();
  }
}

function handleSidebarFlyoutRegionLeave() {
  if (!state.collapsedSidebar) return;
  if (document.body.classList.contains("resizing-panels")) return;
  state.sidebarFlyout.hover = false;
  if (typeof closeSidebarFlyout === "function") {
    closeSidebarFlyout();
  }
}

function handleSidebarFlyoutFocusIn() {
  if (!state.collapsedSidebar) return;
  state.sidebarFlyout.focus = true;
  if (typeof openSidebarFlyout === "function") {
    openSidebarFlyout({ immediate: true });
  }
}

function handleSidebarFlyoutFocusOut(event) {
  if (!state.collapsedSidebar) return;
  const nextTarget = event.relatedTarget;
  const withinTrigger = toggleSidebarTopEl?.contains(nextTarget);
  const withinFlyout = sidebarFlyoutEl?.contains(nextTarget);
  if (withinTrigger || withinFlyout) return;
  state.sidebarFlyout.focus = false;
  if (typeof closeSidebarFlyout === "function") {
    closeSidebarFlyout();
  }
}

toggleSidebarTopEl?.setAttribute("aria-controls", "sidebarFlyout");
toggleSidebarTopEl?.addEventListener("mouseenter", handleSidebarFlyoutRegionEnter);
toggleSidebarTopEl?.addEventListener("mouseleave", handleSidebarFlyoutRegionLeave);
toggleSidebarTopEl?.addEventListener("focusin", handleSidebarFlyoutFocusIn);
toggleSidebarTopEl?.addEventListener("focusout", handleSidebarFlyoutFocusOut);
sidebarFlyoutPanelEl?.addEventListener("mouseenter", handleSidebarFlyoutRegionEnter);
sidebarFlyoutPanelEl?.addEventListener("mouseleave", handleSidebarFlyoutRegionLeave);
sidebarFlyoutPanelEl?.addEventListener("focusin", handleSidebarFlyoutFocusIn);
sidebarFlyoutPanelEl?.addEventListener("focusout", handleSidebarFlyoutFocusOut);

let viewNotesDrag = null;
let viewNotesResize = null;
let sidebarNotesResize = null;

function buildNotesExportFilename(view) {
  const baseName = (view?.name || "view-notes")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${baseName || "view-notes"}.md`;
}

function closeViewNotesPanel() {
  if (!state.notesPanel.open && !state.sidebarNotes?.open) return;
  closeMenus();
  state.notesPanel.open = false;
  state.sidebarNotes.open = false;
  render();
}

function closeSidebarNotesPanel() {
  if (!state.sidebarNotes?.open) return;
  closeMenus();
  state.sidebarNotes.open = false;
  render();
}

function toggleSidebarNotesPanel() {
  if (state.notesPanel.open) {
    dockViewNotesPanel();
    return;
  }
  if (state.sidebarNotes.open) {
    closeSidebarNotesPanel();
    return;
  }
  openSidebarNotesForActiveView();
}

function exportCurrentViewNote() {
  const current = getCurrentView();
  const markdown = getEffectiveMarkdown(current);
  const filename = buildNotesExportFilename(current);
  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  addLog("Exported notes", `${current.name} exported as ${filename}.`);
  showToast("Notes exported", filename);
}

function openViewNotesExportMenu(event) {
  event.stopPropagation();
  const isDockedNotesMenu = event.currentTarget === sidebarNotesMenuButtonEl;
  openMenu(
    event.currentTarget || viewNotesMenuButtonEl,
    [{
      label: "Export Markdown",
      icon: "../icons/ui_core/collection/icon_export_file.svg",
      onClick: exportCurrentViewNote,
    }],
    false,
    {
      horizontal: "end",
      vertical: isDockedNotesMenu ? "top" : "auto",
    },
  );
}

function toggleViewNotesPanel() {
  toggleSidebarNotesPanel();
}

function openSidebarNotesForActiveView() {
  closeMenus();
  state.notesPanel.open = false;
  state.sidebarNotes.open = true;
  state.sidebarNotes.height = clampSidebarNotesHeight(
    state.sidebarNotes.height,
    getSidebarNotesHostHeight(),
  );
  render();
  window.setTimeout(() => sidebarNotesEditorEl?.focus(), 0);
}

function openFloatingNotesPanel() {
  closeMenus();
  state.sidebarNotes.open = false;
  state.notesPanel.open = true;
  if (!state.notesPanel.position) {
    state.notesPanel.position = getAnchoredViewNotesPosition();
  }
  render();
  window.setTimeout(() => viewNotesEditorEl?.focus(), 0);
}

function dockViewNotesPanel() {
  closeMenus();
  state.notesPanel.open = false;
  state.sidebarNotes.open = true;
  state.sidebarNotes.height = clampSidebarNotesHeight(
    state.sidebarNotes.height,
    getSidebarNotesHostHeight(),
  );
  render();
  window.setTimeout(() => sidebarNotesEditorEl?.focus(), 0);
}

const VIEW_NOTES_RESIZE_EDGE = 8;

function getViewNotesResizeDirection(event) {
  if (!state.notesPanel.open || !viewNotesFloatEl) return null;
  const rect = viewNotesFloatEl.getBoundingClientRect();
  const nearLeft = event.clientX - rect.left <= VIEW_NOTES_RESIZE_EDGE;
  const nearRight = rect.right - event.clientX <= VIEW_NOTES_RESIZE_EDGE;
  const nearTop = event.clientY - rect.top <= VIEW_NOTES_RESIZE_EDGE;
  const nearBottom = rect.bottom - event.clientY <= VIEW_NOTES_RESIZE_EDGE;

  const vertical = nearTop ? "n" : nearBottom ? "s" : "";
  const horizontal = nearLeft ? "w" : nearRight ? "e" : "";
  const direction = `${vertical}${horizontal}`;
  return direction || null;
}

function syncViewNotesResizeCursor(event) {
  if (!viewNotesFloatEl) return;
  if (viewNotesResize) {
    viewNotesFloatEl.dataset.resizeDirection = viewNotesResize.direction;
    return;
  }
  if (!state.notesPanel.open) {
    delete viewNotesFloatEl.dataset.resizeDirection;
    return;
  }
  const direction = getViewNotesResizeDirection(event);
  if (direction) {
    viewNotesFloatEl.dataset.resizeDirection = direction;
  } else {
    delete viewNotesFloatEl.dataset.resizeDirection;
  }
}

function beginViewNotesResize(event, direction = getViewNotesResizeDirection(event)) {
  if (!state.notesPanel.open || !viewNotesFloatEl || !direction) return;
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  viewNotesResize = {
    pointerId: event.pointerId,
    direction,
    startX: event.clientX,
    startY: event.clientY,
    startPosition: {
      ...(state.notesPanel.position || getAnchoredViewNotesPosition()),
    },
    startSize: {
      ...defaultNotesPanelSize(),
      ...(state.notesPanel.size || {}),
    },
  };
  viewNotesFloatEl.dataset.resizeDirection = direction;
  if (typeof event.currentTarget?.setPointerCapture === "function") {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
}

function beginViewNotesDrag(event) {
  if (!state.notesPanel.open || !viewNotesFloatEl) return;
  if (!event.isPrimary || event.button !== 0) return;
  if (getViewNotesResizeDirection(event)) return;
  if (event.target.closest("button")) return;
  event.preventDefault();
  const currentPosition = state.notesPanel.position ||
    getAnchoredViewNotesPosition();
  viewNotesDrag = {
    pointerId: event.pointerId,
    offsetX: event.clientX - currentPosition.left,
    offsetY: event.clientY - currentPosition.top,
  };
  if (typeof event.currentTarget.setPointerCapture === "function") {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
}

function beginSidebarNotesResize(event) {
  if (!state.sidebarNotes?.open || !sidebarNotesTrayEl) return;
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  sidebarNotesResize = {
    pointerId: event.pointerId,
    startY: event.clientY,
    startHeight: clampSidebarNotesHeight(
      state.sidebarNotes.height,
      getSidebarNotesHostHeight(),
    ),
  };
  if (typeof event.currentTarget.setPointerCapture === "function") {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
}

function handleViewNotesPointerMove(event) {
  if (viewNotesDrag && event.pointerId === viewNotesDrag.pointerId) {
    state.notesPanel.position = clampViewNotesPosition(
      {
        left: event.clientX - viewNotesDrag.offsetX,
        top: event.clientY - viewNotesDrag.offsetY,
      },
      state.notesPanel.size,
    );
    applyViewNotesFrame();
    return;
  }
  if (viewNotesResize && event.pointerId === viewNotesResize.pointerId) {
    const dx = event.clientX - viewNotesResize.startX;
    const dy = event.clientY - viewNotesResize.startY;
    const direction = viewNotesResize.direction;
    const startPosition = viewNotesResize.startPosition;
    const startSize = viewNotesResize.startSize;
    const startRight = startPosition.left + startSize.width;
    const startBottom = startPosition.top + startSize.height;
    let nextLeft = startPosition.left;
    let nextTop = startPosition.top;
    let nextWidth = startSize.width;
    let nextHeight = startSize.height;

    if (direction.includes("e")) {
      nextWidth = clamp(
        startSize.width + dx,
        300,
        Math.min(560, window.innerWidth - startPosition.left - 12),
      );
    }

    if (direction.includes("w")) {
      nextWidth = clamp(
        startSize.width - dx,
        300,
        Math.min(560, startRight - 12),
      );
      nextLeft = startRight - nextWidth;
    }

    if (direction.includes("s")) {
      nextHeight = clamp(
        startSize.height + dy,
        220,
        window.innerHeight - startPosition.top - 12,
      );
    }

    if (direction.includes("n")) {
      nextHeight = clamp(
        startSize.height - dy,
        220,
        startBottom - 52,
      );
      nextTop = startBottom - nextHeight;
    }

    state.notesPanel.size = {
      width: nextWidth,
      height: nextHeight,
    };
    state.notesPanel.position = {
      left: nextLeft,
      top: nextTop,
    };
    applyViewNotesFrame();
  }
}

function handleSidebarNotesPointerMove(event) {
  if (!sidebarNotesResize || event.pointerId !== sidebarNotesResize.pointerId) {
    return;
  }
  event.preventDefault();
  state.sidebarNotes.height = clampSidebarNotesHeight(
    sidebarNotesResize.startHeight +
      (sidebarNotesResize.startY - event.clientY),
    getSidebarNotesHostHeight(),
  );
  applySidebarNotesFrame();
}

function endViewNotesPointerInteraction(event) {
  if (
    viewNotesDrag && (!event || event.pointerId === viewNotesDrag.pointerId)
  ) {
    viewNotesDrag = null;
  }
  if (
    viewNotesResize &&
    (!event || event.pointerId === viewNotesResize.pointerId)
  ) {
    viewNotesResize = null;
    delete viewNotesFloatEl?.dataset.resizeDirection;
  }
}

function endSidebarNotesPointerInteraction(event) {
  if (
    sidebarNotesResize &&
    (!event || event.pointerId === sidebarNotesResize.pointerId)
  ) {
    sidebarNotesResize = null;
  }
}

sidebarNotesToggleEl?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeMenus();
  toggleSidebarNotesPanel();
});

sidebarNotesToggleEl?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  event.stopPropagation();
  closeMenus();
  toggleSidebarNotesPanel();
});

document.querySelectorAll("[data-notes-tool]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const tool = button.getAttribute("data-notes-tool");
    const label =
      tool === "image"
        ? "Image insertion"
        : tool === "attach"
        ? "Attachments"
        : "Emoji picker";
    showToast("Coming soon", `${label} is not wired yet in this prototype.`);
  });
});

viewNotesCloseButtonEl?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeViewNotesPanel();
});

viewNotesDockButtonEl?.addEventListener("click", (event) => {
  event.stopPropagation();
  dockViewNotesPanel();
});

viewNotesMenuButtonEl?.addEventListener("click", openViewNotesExportMenu);
sidebarNotesFloatButtonEl?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (state.notesPanel.open) {
    dockViewNotesPanel();
    return;
  }
  openFloatingNotesPanel();
});
sidebarNotesMenuButtonEl?.addEventListener("click", openViewNotesExportMenu);

viewNotesToolbarEl?.addEventListener("pointerdown", beginViewNotesDrag);
viewNotesFloatEl?.addEventListener("pointerdown", (event) => {
  beginViewNotesResize(event);
});
viewNotesFloatEl?.addEventListener("pointermove", syncViewNotesResizeCursor);
viewNotesFloatEl?.addEventListener("pointerleave", () => {
  if (!viewNotesResize && viewNotesFloatEl) {
    delete viewNotesFloatEl.dataset.resizeDirection;
  }
});
sidebarNotesResizeHandleEl?.addEventListener(
  "pointerdown",
  beginSidebarNotesResize,
);
window.addEventListener("pointermove", handleViewNotesPointerMove);
window.addEventListener("pointermove", handleSidebarNotesPointerMove);
window.addEventListener("pointerup", endViewNotesPointerInteraction);
window.addEventListener("pointerup", endSidebarNotesPointerInteraction);
window.addEventListener("pointercancel", endViewNotesPointerInteraction);
window.addEventListener("pointercancel", endSidebarNotesPointerInteraction);

const APP_THEME_CLASS_MAP = {
  space: "theme-space",
  midnight: "theme-midnight",
  cadet: "theme-cadet",
};

function applyAppTheme(themeKey) {
  const nextTheme = APP_THEME_CLASS_MAP[themeKey] ? themeKey : "midnight";
  document.body.classList.remove(
    APP_THEME_CLASS_MAP.space,
    APP_THEME_CLASS_MAP.midnight,
    APP_THEME_CLASS_MAP.cadet,
  );
  document.body.classList.add(APP_THEME_CLASS_MAP[nextTheme]);
  if (userThemeMenuEl) {
    userThemeMenuEl.querySelectorAll("[data-theme-option]").forEach(
      (optionEl) => {
        const isActive =
          optionEl.getAttribute("data-theme-option") === nextTheme;
        optionEl.classList.toggle("active", isActive);
        optionEl.setAttribute("aria-checked", isActive ? "true" : "false");
      },
    );
  }
}

function placeMenuAtAnchor(menuEl, anchorEl) {
  if (!menuEl || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const minLeft = window.scrollX + 10;
  const menuWidth = menuEl.offsetWidth || 0;
  const maxLeft = window.scrollX + window.innerWidth - menuWidth - 10;
  const preferredLeft = rect.right + window.scrollX - menuWidth;
  menuEl.style.top = `${rect.bottom + window.scrollY + 6}px`;
  menuEl.style.left = `${
    Math.max(minLeft, Math.min(maxLeft, preferredLeft))
  }px`;
}

function placeFlyoutMenuAtAnchor(menuEl, anchorEl) {
  if (!menuEl || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const viewportPadding = 10;
  const flyoutGap = 6;
  const menuWidth = menuEl.offsetWidth || 0;
  const menuHeight = menuEl.offsetHeight || 0;
  const minLeft = window.scrollX + viewportPadding;
  const maxLeft = window.scrollX + window.innerWidth - menuWidth -
    viewportPadding;
  const minTop = window.scrollY + viewportPadding;
  const maxTop = window.scrollY + window.innerHeight - menuHeight -
    viewportPadding;
  let nextLeft = rect.right + window.scrollX + flyoutGap;
  if (nextLeft > maxLeft) {
    nextLeft = rect.left + window.scrollX - menuWidth - flyoutGap;
  }
  let nextTop = rect.top + window.scrollY - 6;
  if (nextTop > maxTop) {
    nextTop = maxTop;
  }
  menuEl.style.left = `${Math.max(minLeft, Math.min(maxLeft, nextLeft))}px`;
  menuEl.style.top = `${Math.max(minTop, Math.min(maxTop, nextTop))}px`;
}

let userThemeHoverCloseTimer = null;

function clearUserThemeHoverCloseTimer() {
  if (!userThemeHoverCloseTimer) return;
  clearTimeout(userThemeHoverCloseTimer);
  userThemeHoverCloseTimer = null;
}

function openUserThemeSubmenu() {
  if (!userThemeTriggerEl || !userThemeMenuEl || !userSettingsMenuEl) return;
  if (userSettingsMenuEl.classList.contains("hidden")) return;
  clearUserThemeHoverCloseTimer();
  userThemeMenuEl.classList.remove("hidden");
  userThemeTriggerEl.classList.add("active");
  userThemeTriggerEl.setAttribute("aria-expanded", "true");
  placeFlyoutMenuAtAnchor(userThemeMenuEl, userThemeTriggerEl);
}

function closeUserThemeSubmenu() {
  if (!userThemeTriggerEl || !userThemeMenuEl) return;
  clearUserThemeHoverCloseTimer();
  userThemeMenuEl.classList.add("hidden");
  userThemeTriggerEl.classList.remove("active");
  userThemeTriggerEl.setAttribute("aria-expanded", "false");
}

function scheduleUserThemeSubmenuClose() {
  if (!userThemeTriggerEl || !userThemeMenuEl) return;
  clearUserThemeHoverCloseTimer();
  userThemeHoverCloseTimer = window.setTimeout(() => {
    userThemeHoverCloseTimer = null;
    const triggerHovered = userThemeTriggerEl.matches(":hover");
    const menuHovered = userThemeMenuEl.matches(":hover");
    if (triggerHovered || menuHovered) return;
    closeUserThemeSubmenu();
  }, 140);
}

if (userSettingsButtonEl && userSettingsMenuEl) {
  userSettingsButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !userSettingsMenuEl.classList.contains("hidden") &&
      userSettingsButtonEl.classList.contains("active");
    if (isOpen) {
      closeMenus();
      return;
    }
    closeMenus();
    userSettingsMenuEl.classList.remove("hidden");
    userSettingsButtonEl.classList.add("active", "is-active");
    userSettingsButtonEl.setAttribute("aria-expanded", "true");
    placeMenuAtAnchor(userSettingsMenuEl, userSettingsButtonEl);
    if (userThemeMenuEl) userThemeMenuEl.classList.add("hidden");
    if (userThemeTriggerEl) {
      userThemeTriggerEl.classList.remove("active");
      userThemeTriggerEl.setAttribute("aria-expanded", "false");
    }
  });
}

if (userThemeTriggerEl && userThemeMenuEl && userSettingsMenuEl) {
  userThemeTriggerEl.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!userThemeMenuEl.classList.contains("hidden")) {
      closeUserThemeSubmenu();
      return;
    }
    openUserThemeSubmenu();
  });

  userThemeTriggerEl.addEventListener("mouseenter", openUserThemeSubmenu);
  userThemeTriggerEl.addEventListener(
    "mouseleave",
    scheduleUserThemeSubmenuClose,
  );
  userThemeMenuEl.addEventListener("mouseenter", clearUserThemeHoverCloseTimer);
  userThemeMenuEl.addEventListener("mouseleave", scheduleUserThemeSubmenuClose);
}

if (userThemeMenuEl) {
  userThemeMenuEl.addEventListener("click", (event) => {
    const optionEl = event.target.closest("[data-theme-option]");
    if (!optionEl) return;
    event.stopPropagation();
    applyAppTheme(optionEl.getAttribute("data-theme-option"));
  });
}

applyAppTheme("midnight");

buildTimelineData();
let timelineViewportDrag = null;

function beginTimelineSelection(event) {
  if (
    (event.pointerType === "mouse" && event.button !== 0) || !event.isPrimary
  ) {
    return;
  }
  if (
    event.target.closest(".timeline-selection-ribbon") ||
    event.target.closest(".timeline-selection-jump-shell") ||
    event.target.closest(".timeline-selection-export-shell")
  ) {
    return;
  }
  event.preventDefault();

  const rect = timelineTrackAreaEl.getBoundingClientRect();
  timelineSelection.dragging = true;
  timelineSelection.pointerId = event.pointerId;
  timelineSelection.startX = event.clientX - rect.left +
    timelineTrackAreaEl.scrollLeft;
  timelineSelection.startY = event.clientY - rect.top +
    timelineTrackAreaEl.scrollTop;
  timelineMarqueeEl.style.left = `${timelineSelection.startX}px`;
  timelineMarqueeEl.style.top = `${timelineSelection.startY}px`;
  timelineMarqueeEl.style.width = "0px";
  timelineMarqueeEl.style.height = "0px";
  timelineMarqueeEl.classList.add("active");
  clearTimelineSelection(true);
  hideTimelineMenus();

  if (typeof timelineTrackAreaEl.setPointerCapture === "function") {
    timelineTrackAreaEl.setPointerCapture(event.pointerId);
  }
}

function updateTimelineSelection(event) {
  if (!timelineSelection.dragging) return;
  const rect = timelineTrackAreaEl.getBoundingClientRect();
  const currentX = event.clientX - rect.left + timelineTrackAreaEl.scrollLeft;
  const currentY = event.clientY - rect.top + timelineTrackAreaEl.scrollTop;
  const x1 = Math.max(0, Math.min(timelineSelection.startX, currentX));
  const y1 = Math.max(0, Math.min(timelineSelection.startY, currentY));
  const x2 = Math.max(timelineSelection.startX, currentX);
  const y2 = Math.max(timelineSelection.startY, currentY);
  timelineMarqueeEl.style.left = `${x1}px`;
  timelineMarqueeEl.style.top = `${y1}px`;
  timelineMarqueeEl.style.width = `${x2 - x1}px`;
  timelineMarqueeEl.style.height = `${y2 - y1}px`;
  const marqueeRect = { left: x1, right: x2, top: y1, bottom: y2 };
  timelineEvents.forEach(({ el }) => {
    const overlaps = timelineRectsOverlap(
      marqueeRect,
      getTimelineEventRect(el),
    );
    el.classList.toggle("selected", overlaps);
  });
}

function endTimelineSelection(event) {
  if (!timelineSelection.dragging) return;
  if (
    event &&
    timelineSelection.pointerId !== undefined &&
    event.pointerId !== undefined &&
    event.pointerId !== timelineSelection.pointerId
  ) {
    return;
  }

  if (
    timelineSelection.pointerId !== undefined &&
    typeof timelineTrackAreaEl.releasePointerCapture === "function" &&
    timelineTrackAreaEl.hasPointerCapture?.(timelineSelection.pointerId)
  ) {
    timelineTrackAreaEl.releasePointerCapture(timelineSelection.pointerId);
  }

  timelineSelection.dragging = false;
  timelineSelection.pointerId = null;
  timelineMarqueeEl.classList.remove("active");
  finalizeTimelineSelection();
}

timelineTrackAreaEl.addEventListener("pointerdown", beginTimelineSelection);
timelineTrackAreaEl.addEventListener("pointermove", updateTimelineSelection);
window.addEventListener("pointerup", endTimelineSelection);
window.addEventListener("pointercancel", endTimelineSelection);

timelineTrackAreaEl.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (!timelineSelection.hasSelection) return;
  showTimelineContextMenu(event.clientX, event.clientY);
});

timelineTrackAreaEl.addEventListener("scroll", syncTimelineScroll, {
  passive: true,
});
timelineSidebarListEl.addEventListener(
  "scroll",
  () => {
    if (timelineTrackAreaEl.scrollTop !== timelineSidebarListEl.scrollTop) {
      timelineTrackAreaEl.scrollTop = timelineSidebarListEl.scrollTop;
    }
  },
  { passive: true },
);

timelineTrackAreaEl.addEventListener(
  "wheel",
  (event) => {
    const wantsZoom = event.metaKey || event.ctrlKey;
    if (!wantsZoom) return;
    if (event.deltaY === 0) return;
    event.preventDefault();
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    setTimelineZoomLevel(getTimelineZoomFactor() * factor, event.clientX);
  },
  { passive: false },
);

function beginTimelineViewportDrag(mode, event) {
  if (!timelineMinimapViewportEl || !timelineMinimapTrackEl) return;
  event.preventDefault();
  event.stopPropagation();

  const currentLeftPct =
    parseFloat(timelineMinimapViewportEl.style.left || "0") || 0;
  const currentWidthPct =
    parseFloat(timelineMinimapViewportEl.style.width || "100") || 100;

  timelineViewportDrag = {
    mode,
    pointerId: event.pointerId,
    startX: event.clientX,
    trackWidth: timelineMinimapTrackEl.getBoundingClientRect().width || 1,
    startLeftPct: currentLeftPct,
    startWidthPct: currentWidthPct,
    minWidthPct: getTimelineViewportMinWidthPct(),
  };

  if (mode === "pan") {
    timelineMinimapViewportEl.classList.add("dragging");
  }

  if (typeof event.currentTarget.setPointerCapture === "function") {
    event.currentTarget.setPointerCapture(event.pointerId);
  }
}

timelineMinimapViewportEl?.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".timeline-minimap-handle")) return;
  beginTimelineViewportDrag("pan", event);
});

timelineMinimapHandleStartEl?.addEventListener(
  "pointerdown",
  (event) => beginTimelineViewportDrag("start", event),
);
timelineMinimapHandleEndEl?.addEventListener(
  "pointerdown",
  (event) => beginTimelineViewportDrag("end", event),
);

window.addEventListener("pointermove", (event) => {
  if (!timelineViewportDrag) return;
  if (event.pointerId !== timelineViewportDrag.pointerId) return;

  const deltaPct = ((event.clientX - timelineViewportDrag.startX) /
    timelineViewportDrag.trackWidth) *
    100;

  if (timelineViewportDrag.mode === "pan") {
    const nextLeftPct = timelineClamp(
      timelineViewportDrag.startLeftPct + deltaPct,
      0,
      100 - timelineViewportDrag.startWidthPct,
    );
    setTimelineViewportByMinimap(
      nextLeftPct,
      timelineViewportDrag.startWidthPct,
    );
    return;
  }

  if (timelineViewportDrag.mode === "start") {
    const rightEdgePct = timelineViewportDrag.startLeftPct +
      timelineViewportDrag.startWidthPct;
    const nextLeftPct = timelineClamp(
      timelineViewportDrag.startLeftPct + deltaPct,
      0,
      rightEdgePct - timelineViewportDrag.minWidthPct,
    );
    setTimelineViewportByMinimap(nextLeftPct, rightEdgePct - nextLeftPct);
    return;
  }

  if (timelineViewportDrag.mode === "end") {
    const nextWidthPct = timelineClamp(
      timelineViewportDrag.startWidthPct + deltaPct,
      timelineViewportDrag.minWidthPct,
      100 - timelineViewportDrag.startLeftPct,
    );
    setTimelineViewportByMinimap(
      timelineViewportDrag.startLeftPct,
      nextWidthPct,
    );
  }
});

window.addEventListener("pointerup", (event) => {
  if (!timelineViewportDrag) return;
  if (event.pointerId !== timelineViewportDrag.pointerId) return;
  timelineMinimapViewportEl?.classList.remove("dragging");
  timelineViewportDrag = null;
});

window.addEventListener("pointercancel", () => {
  if (!timelineViewportDrag) return;
  timelineMinimapViewportEl?.classList.remove("dragging");
  timelineViewportDrag = null;
});

timelineExportButtonEl.addEventListener("click", (event) => {
  event.stopPropagation();
  showTimelineExportMenu();
});

if (timelineSelectionExportShellEl) {
  timelineSelectionExportShellEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
}

if (timelineSelectionExportButtonEl) {
  timelineSelectionExportButtonEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  timelineSelectionExportButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    showTimelineContextMenuFromAnchor(timelineSelectionExportButtonEl);
  });
}

if (timelineJumpSelectionShellEl) {
  timelineJumpSelectionShellEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
}

if (timelineJumpSelectionButtonEl) {
  timelineJumpSelectionButtonEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  timelineJumpSelectionButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    recenterTimelineSelection();
  });
}

if (timelineSelectionClearButtonEl) {
  timelineSelectionClearButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    clearTimelineSelection();
  });
}

document.querySelectorAll(".timeline-scope-button").forEach((buttonEl) => {
  buttonEl.addEventListener("click", () => {
    if (buttonEl.classList.contains("disabled")) return;
    timelineSelection.exportScope = buttonEl.dataset.scope;
    document
      .querySelectorAll(".timeline-scope-button")
      .forEach((scopeButtonEl) => {
        scopeButtonEl.classList.toggle("active", scopeButtonEl === buttonEl);
      });
    showToast(
      "Packet carving",
      `Export scope set to ${
        buttonEl.dataset.scope === "selection"
          ? "selection only"
          : "all traffic"
      }.`,
    );
  });
});

timelineContextMenuEl
  .querySelectorAll("[data-timeline-action]")
  .forEach((buttonEl) => {
    buttonEl.addEventListener("click", () => {
      const action = buttonEl.dataset.timelineAction;
      showToast(
        "Packet carving",
        `${action} exported for the current carved selection.`,
      );
      hideTimelineMenus();
    });
  });

timelineExportMenuEl
  .querySelectorAll("[data-export-action]")
  .forEach((buttonEl) => {
    buttonEl.addEventListener("click", () => {
      const action = buttonEl.dataset.exportAction;
      const scopeLabel = timelineSelection.exportScope === "selection"
        ? "selection"
        : "all traffic";
      showToast("Packet carving", `${action} exported for ${scopeLabel}.`);
      hideTimelineMenus();
    });
  });

document.querySelectorAll("[data-host-scope]").forEach((buttonEl) => {
  buttonEl.addEventListener("click", () => {
    const scope = buttonEl.getAttribute("data-host-scope");
    if (getEffectiveSnapshot(getCurrentView()).hostsScope === scope) return;
    setDirtyPatch({ hostsScope: scope }, `Hosts scope switched to ${scope}.`);
  });
});

document.querySelectorAll("[data-tab-strip]").forEach((stripEl) => {
  const stripId = stripEl.getAttribute("data-tab-strip");
  stripEl.addEventListener("click", (event) => {
    const overflowEl = event.target.closest("[data-tab-overflow]");
    if (overflowEl) {
      event.stopPropagation();
      openTabOverflowMenu(stripId, overflowEl);
      return;
    }
    const closeEl = event.target.closest(".tab-close");
    if (closeEl) {
      event.stopPropagation();
      const tabEl = closeEl.closest("[data-panel-tab]");
      if (tabEl) {
        closePanelTab(stripId, tabEl.getAttribute("data-panel-tab"));
      }
      return;
    }
    const tabEl = event.target.closest("[data-panel-tab]");
    if (tabEl && stripEl.contains(tabEl)) {
      setActivePanelTab(stripId, tabEl.getAttribute("data-panel-tab"));
    }
  });
  stripEl.addEventListener("scroll", refreshTabOverflow, { passive: true });
});

window.addEventListener("resize", () => {
  refreshTabOverflow();
  hideTimelineMenus();
  syncTimelineViewport(getEffectiveSnapshot(getCurrentView()));
  const nextSidebarWidth = clampSidebarWidth(state.sidebarWidth);
  if (nextSidebarWidth !== state.sidebarWidth) {
    state.sidebarWidth = nextSidebarWidth;
  }
  if (typeof syncSidebarWidth === "function") {
    syncSidebarWidth();
  }
  if (state.sidebarFlyout.open && typeof syncSidebarFlyoutPosition === "function") {
    syncSidebarFlyoutPosition();
  }
  if (state.notesPanel.open) {
    applyViewNotesFrame();
  }
  if (state.sidebarNotes.open) {
    applySidebarNotesFrame();
  }
});

document
  .getElementById("saveAsNewButton")
  .addEventListener("click", () => saveAsNewView(null));
document
  .getElementById("revertButton")
  .addEventListener("click", revertActiveView);
document.getElementById("resetButton").addEventListener("click", () => {
  state = hydrateViews(initialState());
  addLog("Reset", "Prototype returned to its baseline scenario.");
  render();
});

filterViewsInputEl.addEventListener("input", (event) => {
  state.filterQuery = event.target.value;
  render();
});

clearFilterButtonEl.addEventListener("click", () => {
  state.filterQuery = "";
  render();
  filterViewsInputEl.focus();
});

function handleViewNotesEditorInput(event) {
  setViewMarkdownDraft(event.target.value, { render: false, group: "notes" });
  renderTree();
  renderTopbar();
  renderViewerState();
  if (typeof syncViewNotesDraftState === "function") {
    syncViewNotesDraftState();
  }
  if (typeof syncSidebarNotesDraftState === "function") {
    syncSidebarNotesDraftState();
  }
}

viewNotesEditorEl?.addEventListener("input", handleViewNotesEditorInput);
sidebarNotesEditorEl?.addEventListener("input", handleViewNotesEditorInput);

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "layout") {
      const current = getEffectiveSnapshot(getCurrentView()).layout;
      const next = current === "balanced"
        ? "dashboard-focus"
        : current === "dashboard-focus"
        ? "map-only"
        : "balanced";
      const visibility = next === "map-only"
        ? "Map only"
        : next === "dashboard-focus"
        ? "Map + Inspector"
        : "Map + Inspector + Timeline";
      setDirtyPatch(
        { layout: next, panelVisibility: visibility },
        `Layout changed to ${layoutLabel(next)}.`,
      );
    }
    if (action === "tabs") {
      const currentTabs = [...getEffectiveSnapshot(getCurrentView()).tabs];
      const nextTabs = currentTabs.filter((tab) => tab !== "Alerts");
      if (nextTabs.length === currentTabs.length) nextTabs.push("Metrics");
      setDirtyPatch(
        { tabs: nextTabs },
        `Persistent tab set updated to ${nextTabs.join(", ")}.`,
      );
    }
    if (action === "filter") {
      setDirtyPatch(
        {
          pinnedFilter: "192.168.22.0/24",
          selectionLabel: "Subnet 192.168.22.0/24",
          selectionMode: "subnet",
        },
        "Pinned subnet filter changed to 192.168.22.0/24.",
      );
    }
    if (action === "selection") {
      setDirtyPatch(
        {
          selectionLabel: "Host sensor-west-22",
          selectionMode: "host",
          inspectorEntity: "sensor-west-22",
        },
        "Explicit selected-entity context saved into the View.",
      );
    }
    if (action === "zoom") {
      setTimelineZoomLevel(state.ephemeral.timelineZoom * 1.2);
      addLog(
        "Ephemeral change",
        `Timeline zoom moved to ${state.ephemeral.timelineZoom}%. View autosave remains unchanged because zoom is session-local.`,
      );
      render();
    }
    if (action === "accordion") {
      setEphemeralPatch(
        { nestedTreeToggle: !state.ephemeral.nestedTreeToggle },
        "Temporary tree expansion changed. View autosave remains unchanged.",
      );
    }
    if (action === "switchDirty") {
      activateView("view-alerts-review");
    }
    if (action === "returnDirty") {
      activateView("view-network-triage");
    }
  });
});

document.addEventListener("click", (event) => {
  const clickedSidebarFlyoutTrigger = toggleSidebarTopEl?.contains(event.target);
  const clickedSidebarFlyoutPanel = sidebarFlyoutPanelEl?.contains(event.target);
  if (
    state.collapsedSidebar &&
    state.sidebarFlyout.open &&
    !clickedSidebarFlyoutTrigger &&
    !clickedSidebarFlyoutPanel &&
    typeof closeSidebarFlyout === "function"
  ) {
    closeSidebarFlyout({ immediate: true, clearInteraction: true });
  }
  if (
    !contextMenuEl.contains(event.target) &&
    !saveMenuEl.contains(event.target) &&
    !panelMenuEl.contains(event.target) &&
    (!userSettingsMenuEl || !userSettingsMenuEl.contains(event.target)) &&
    (!userThemeMenuEl || !userThemeMenuEl.contains(event.target)) &&
    !event.target.closest(".menu-anchor-button")
  ) {
    closeMenus();
  }
});

document.addEventListener("keydown", (event) => {
  const isUndoShortcut = (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "z";
  const isEditableTarget = event.target instanceof HTMLElement &&
    Boolean(event.target.closest("input, textarea, [contenteditable='true']"));
  if (isUndoShortcut && !isEditableTarget) {
    event.preventDefault();
    if (!undoViewEdit(getCurrentView())) {
      showToast(
        "Nothing to undo",
        "This View has no earlier autosaved state in the current session.",
      );
    }
    return;
  }
  if (event.key !== "Escape") return;
  if (state.sidebarFlyout.open && typeof closeSidebarFlyout === "function") {
    closeSidebarFlyout({
      immediate: true,
      restoreFocus: true,
      clearInteraction: true,
    });
    return;
  }
  if (state.sidebarNotes.open) {
    closeSidebarNotesPanel();
    sidebarNotesToggleEl?.focus();
    return;
  }
  if (state.notesPanel.open) {
    closeViewNotesPanel();
    sidebarNotesToggleEl?.focus();
    return;
  }
  if (typeof handleAlertsEscape === "function" && handleAlertsEscape()) {
    return;
  }
  if (
    !timelineContextMenuEl.classList.contains("hidden") ||
    !timelineExportMenuEl.classList.contains("hidden")
  ) {
    hideTimelineMenus();
    return;
  }
  if (timelineSelection.hasSelection) {
    clearTimelineSelection();
  }
});

if (typeof initAlertsFeature === "function") {
  initAlertsFeature();
}
render();
syncTimelineScroll();
addLog(
  "Prototype ready",
  "Test autosaved View edits, Undo, floating notes, drag-and-drop, and duplicate indicators.",
);
