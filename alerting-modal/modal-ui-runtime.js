/* Alerting modal shell UI runtime. */

let toastHideTimeout = 0;
let activeAlertingTooltipTarget = null;
const alertingTooltipEl = document.createElement("div");
alertingTooltipEl.className = "alerting-global-tooltip hidden";
alertingTooltipEl.id = "alertingGlobalTooltip";
alertingTooltipEl.setAttribute("role", "tooltip");
document.body.appendChild(alertingTooltipEl);

function alertingEventPathContains(event, selector) {
  const path =
    event && typeof event.composedPath === "function" ? event.composedPath() : [];
  return path.some(
    (node) =>
      node &&
      typeof node.matches === "function" &&
      node.matches(selector),
  );
}

function getAlertingTooltipTargetFromEvent(event) {
  const path =
    event && typeof event.composedPath === "function" ? event.composedPath() : [];
  return (
    path.find(
      (node) =>
        node &&
        typeof node.getAttribute === "function" &&
        String(node.getAttribute("data-tooltip") || "").trim(),
    ) || null
  );
}

function hideAlertingTooltip() {
  activeAlertingTooltipTarget = null;
  alertingTooltipEl.classList.add("hidden");
  alertingTooltipEl.classList.remove("is-scrollable");
  alertingTooltipEl.textContent = "";
  alertingTooltipEl.removeAttribute("data-placement");
}

function ensureAlertingTooltipMount(target) {
  const root =
    target && typeof target.getRootNode === "function" ? target.getRootNode() : null;
  const mount =
    root && root.host && typeof root.appendChild === "function"
      ? root
      : root && root.body
        ? root.body
        : document.body;
  if (mount && alertingTooltipEl.parentNode !== mount) {
    mount.appendChild(alertingTooltipEl);
  }
}

function positionAlertingTooltip() {
  if (!activeAlertingTooltipTarget || !activeAlertingTooltipTarget.isConnected) {
    hideAlertingTooltip();
    return;
  }
  const tooltipText = String(
    activeAlertingTooltipTarget.getAttribute("data-tooltip") || "",
  ).trim();
  if (!tooltipText) {
    hideAlertingTooltip();
    return;
  }
  if (alertingTooltipEl.textContent !== tooltipText) {
    alertingTooltipEl.textContent = tooltipText;
  }
  const padding = 8;
  const gap = 8;
  const rect = activeAlertingTooltipTarget.getBoundingClientRect();
  const tooltipRect = alertingTooltipEl.getBoundingClientRect();
  const spaceAbove = rect.top - gap - padding;
  const spaceBelow = window.innerHeight - rect.bottom - gap - padding;
  const placeAbove = tooltipRect.height <= spaceAbove || spaceAbove >= spaceBelow;
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
  alertingTooltipEl.dataset.placement = placeAbove ? "top" : "bottom";
  alertingTooltipEl.style.top = `${Math.round(top)}px`;
  alertingTooltipEl.style.left = `${Math.round(left)}px`;
}

function showAlertingTooltip(target) {
  if (!target) return;
  const tooltipText = String(target.getAttribute("data-tooltip") || "").trim();
  if (!tooltipText) {
    hideAlertingTooltip();
    return;
  }
  if (
    target.hasAttribute("data-tooltip-overflow") &&
    target.scrollWidth <= target.offsetWidth
  ) {
    hideAlertingTooltip();
    return;
  }
  ensureAlertingTooltipMount(target);
  activeAlertingTooltipTarget = target;
  alertingTooltipEl.textContent = tooltipText;
  alertingTooltipEl.classList.toggle(
    "is-scrollable",
    target.hasAttribute("data-tooltip-scrollable"),
  );
  alertingTooltipEl.classList.remove("hidden");
  positionAlertingTooltip();
}

function toggleAccordion(id) {
  const accordion = document.getElementById(id);
  if (!accordion) return;
  accordion.classList.toggle("open");
}

function toggleCombobox(id, event = window.event) {
  event?.stopPropagation?.();
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  const wasOpen = dropdown.classList.contains("open");
  document
    .querySelectorAll(".combobox-dropdown")
    .forEach((item) => item.classList.remove("open"));
  if (!wasOpen) {
    dropdown.classList.add("open");
  }
}

function toggleComboOption(element, event = window.event) {
  event?.stopPropagation?.();
  if (!element) return;
  element.classList.toggle("selected");
  const checkbox = element.querySelector(".combobox-checkbox");
  if (!checkbox) return;
  checkbox.innerHTML = element.classList.contains("selected")
    ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
    : "";
}

function onAlertingModalDocumentClick(event) {
  if (!alertingEventPathContains(event, ".combobox")) {
    document
      .querySelectorAll(".combobox-dropdown")
      .forEach((item) => item.classList.remove("open"));
  }
  if (
    !alertingEventPathContains(event, ".default-alert-filter-combobox") &&
    typeof closeDefaultAlertFilterComboboxes === "function"
  ) {
    closeDefaultAlertFilterComboboxes(true);
  }
  if (
    !alertingEventPathContains(event, ".dropdown-menu") &&
    !alertingEventPathContains(event, ".modal-icon-button")
  ) {
    if (typeof closeToolbarMenus === "function") closeToolbarMenus();
    document
      .querySelectorAll(".dropdown-menu:not(.toolbar-dropdown-menu)")
      .forEach((item) => item.classList.remove("open"));
  }
  if (
    !alertingEventPathContains(event, ".variable-value-menu") &&
    !alertingEventPathContains(event, ".variable-values-shell")
  ) {
    closeVariableValueMenu();
  }
  if (!alertingEventPathContains(event, ".suri-menu")) {
    closeSuricataMenu();
  }
}

document.addEventListener("click", onAlertingModalDocumentClick);
document.addEventListener("mouseover", (event) => {
  if (
    event.target &&
    typeof event.target.closest === "function" &&
    event.target.closest(".alerting-global-tooltip")
  ) {
    return;
  }
  const tooltipTarget = getAlertingTooltipTargetFromEvent(event);
  if (!tooltipTarget) {
    hideAlertingTooltip();
    return;
  }
  if (tooltipTarget === activeAlertingTooltipTarget) {
    positionAlertingTooltip();
    return;
  }
  showAlertingTooltip(tooltipTarget);
});

document.addEventListener("mouseout", (event) => {
  if (!activeAlertingTooltipTarget) return;
  const leavingTarget = getAlertingTooltipTargetFromEvent(event);
  if (!leavingTarget || leavingTarget !== activeAlertingTooltipTarget) return;
  const relatedTarget = event.relatedTarget;
  if (
    relatedTarget &&
    typeof relatedTarget.closest === "function" &&
    (relatedTarget.closest("[data-tooltip]") === activeAlertingTooltipTarget ||
      relatedTarget.closest(".alerting-global-tooltip") === alertingTooltipEl)
  ) {
    return;
  }
  hideAlertingTooltip();
});

document.addEventListener("focusin", (event) => {
  const tooltipTarget =
    event.target && typeof event.target.closest === "function"
      ? event.target.closest("[data-tooltip]")
      : null;
  if (!tooltipTarget) {
    hideAlertingTooltip();
    return;
  }
  showAlertingTooltip(tooltipTarget);
});

document.addEventListener("focusout", (event) => {
  if (!activeAlertingTooltipTarget) return;
  const leavingTarget =
    event.target && typeof event.target.closest === "function"
      ? event.target.closest("[data-tooltip]")
      : null;
  if (!leavingTarget || leavingTarget !== activeAlertingTooltipTarget) return;
  const relatedTarget = event.relatedTarget;
  if (
    relatedTarget &&
    typeof relatedTarget.closest === "function" &&
    (relatedTarget.closest("[data-tooltip]") === activeAlertingTooltipTarget ||
      relatedTarget.closest(".alerting-global-tooltip") === alertingTooltipEl)
  ) {
    return;
  }
  hideAlertingTooltip();
});

document.addEventListener(
  "scroll",
  () => {
    if (!activeAlertingTooltipTarget) return;
    positionAlertingTooltip();
  },
  true,
);

function showYamlWarning() {
  document.getElementById("yamlWarningDialog")?.classList.add("open");
}

function closeYamlWarning() {
  document.getElementById("yamlWarningDialog")?.classList.remove("open");
}

function enableYamlEdit() {
  closeYamlWarning();
  ruleConfigEditMode = true;
  renderSuricataDrawerContent();
  showToast("YAML editing enabled - be careful!");
}

async function copyYaml() {
  const yamlText =
    getActiveDrawerState()?.ruleConfig ||
    document.getElementById("yamlContent")?.textContent ||
    "";
  try {
    await navigator.clipboard.writeText(yamlText);
    showToast("YAML copied to clipboard");
  } catch {
    showToast("Unable to copy YAML");
  }
}

function toggleMoreMenu(event = window.event) {
  event?.stopPropagation?.();
  const menu = document.getElementById("moreMenu");
  if (!menu) return;
  menu.classList.toggle("open");
}

function toggleDrawerMenu(event = window.event) {
  event?.stopPropagation?.();
  if (typeof syncVariableDrawerMenu === "function") {
    syncVariableDrawerMenu();
  }
  const menu = document.getElementById("drawerMenu");
  if (!menu) return;
  menu.classList.toggle("open");
}

function publishToLibrary() {
  document.getElementById("drawerMenu")?.classList.remove("open");
  showToast("Rule published to Alert Library");
}

function assignToProject() {
  document.getElementById("drawerMenu")?.classList.remove("open");
  document.getElementById("assignProjectDialog")?.classList.add("open");
}

function closeAssignDialog() {
  document.getElementById("assignProjectDialog")?.classList.remove("open");
}

function confirmAssign() {
  closeAssignDialog();
  showToast("Rule assignment updated");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const messageEl = document.getElementById("toastMessage");
  if (!toast || !messageEl) return;
  messageEl.textContent = message;
  toast.classList.add("show");
  if (toastHideTimeout) {
    clearTimeout(toastHideTimeout);
  }
  toastHideTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
    toastHideTimeout = 0;
  }, 3000);
}

function closeModal() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "alerting-modal-close" }, "*");
    return;
  }
  showToast("Modal would close");
}

function onAlertingModalResize() {
  syncRulesTableWidth();
  applyTableRowHeights();
  const bodyTable = document.getElementById("rulesTableBodyTable");
  if (
    bodyTable?.classList.contains("suricata-feed-table") &&
    typeof renderSuricataVirtualRows === "function"
  ) {
    renderSuricataVirtualRows();
  }
  syncAllScopeSuggestionAnchors();
  if (typeof syncAllDefaultAlertFilterSuggestionAnchors === "function") {
    syncAllDefaultAlertFilterSuggestionAnchors();
  }
  if (typeof syncAllSuricataMenuPanels === "function") {
    syncAllSuricataMenuPanels();
  }
  if (typeof renderRuleSelectionRibbon === "function") {
    renderRuleSelectionRibbon();
  }
  if (activeAlertingTooltipTarget) {
    positionAlertingTooltip();
  }
}

window.addEventListener("resize", onAlertingModalResize);
window.addEventListener("blur", stopColumnResize);
