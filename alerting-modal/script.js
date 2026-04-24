/* Alerting modal bootstrap. */

const alertingModalTitleEl = document.querySelector(".modal-title");
const alertingModalShellEl = document.querySelector(".modal");
const alertingSearchInputEl = document.getElementById("ruleSearch");

if (isEmbeddedAlertingModal()) {
  document.body.classList.add("alerting-inline-embedded");
}

if (isWorkspaceVariablesModal()) {
  alertingModalShellEl?.classList.add("is-workspace-variables");
  if (alertingModalTitleEl) alertingModalTitleEl.textContent = "Variables";
  if (alertingSearchInputEl) {
    alertingSearchInputEl.placeholder = "Search variables";
    alertingSearchInputEl.setAttribute("aria-label", "Search variables");
  }
  sidebarState.selectedCategory = "";
  sidebarState.selectedQuickAction = "Variables";
  resetRuleVariablesViewState();
  renderSidebar();
  renderRules();
} else {
  alertingModalShellEl?.classList.remove("is-workspace-variables");
  if (alertingModalTitleEl) alertingModalTitleEl.textContent = "Manage Alerts";
  if (alertingSearchInputEl) {
    alertingSearchInputEl.placeholder = "Search...";
    alertingSearchInputEl.setAttribute("aria-label", "Search");
  }
  selectCategory(sidebarState.selectedCategory, "Emerging Threats PRO");
}
