// Extracted variable view runtime for the alerting modal.

const FALLBACK_RULE_VARIABLE_ROWS = [
  {
    name: "HTTP_PORTS",
    usedByAlerts: 18,
    references: 4,
    referenceItems: [
      "HOME_NET",
      "DMZ_SERVERS",
      "WEB_PORTS",
      "PROXY_PORTS",
    ],
    valueLabel: "4 Ports",
    valueItems: ["80", "81", "8080", "8888"],
    valueOptions: [
      "1 Port",
      "2 Ports",
      "4 Ports",
      "8 Ports",
      "12 Ports",
      "Any",
    ],
  },
  {
    name: "HTTPS_PORTS",
    usedByAlerts: 312,
    references: 0,
    valueLabel: "12 Ports",
    valueItems: [
      "443",
      "444",
      "5443",
      "6443",
      "7443",
      "8443",
      "9443",
      "10443",
      "11443",
      "12443",
      "13443",
      "14443",
    ],
    valueOptions: ["4 Ports", "8 Ports", "12 Ports", "24 Ports", "Any"],
  },
  {
    name: "SSH_PORTS",
    usedByAlerts: 96,
    references: 0,
    valueLabel: "435 Ports",
    valueTooltip: "22 · 2222 · 22022-22454 (435 ports total)",
    valueOptions: ["22", "22,2222", "435 Ports", "Any"],
  },
  {
    name: "MY_VAR",
    usedByAlerts: 0,
    references: 0,
    valueLabel: "1 Port",
    valueItems: ["9001"],
    valueOptions: ["1 Port", "2 Ports", "4 Ports", "Custom"],
  },
  {
    name: "HOME_NET",
    usedByAlerts: 287,
    references: 4,
    referenceItems: [
      "HTTP_PORTS",
      "HTTPS_PORTS",
      "DMZ_NET",
      "REMOTE_USERS",
    ],
    valueLabel: "4 Addresses",
    valueItems: [
      "10.24.18.0/24",
      "172.16.40.0/21",
      "192.168.44.0/24",
      "10.201.70.0/24",
    ],
    valueOptions: ["2 Addresses", "4 Addresses", "8 Addresses", "Any"],
  },
  {
    name: "HTTPS_SERVERS",
    usedByAlerts: 45,
    references: 4,
    referenceItems: [
      "HOME_NET",
      "WEB_SERVERS",
      "DMZ_SERVERS",
      "API_GATEWAYS",
    ],
    valueLabel: "4 Ports",
    valueItems: ["443", "5443", "6443", "8443"],
    valueOptions: ["1 Port", "2 Ports", "4 Ports", "8 Ports", "12 Ports"],
  },
];

const VARIABLE_DRAWER_TYPE_OPTIONS = ["Ports", "Subnets", "Hosts", "Values"];
const VARIABLE_HISTORY_PAGE_SIZE = 5;
const VARIABLE_HISTORY_ACTORS = ["Ricky Tan", "Renz Dupitas", "Ricky Tan", "Ricky Tan", "Renz Dupitas"];

function getSharedRuleVariableRows() {
  const sharedRows = window.TeleseerAppData?.alerting?.variables;
  if (Array.isArray(sharedRows) && sharedRows.length) {
    return cloneDrawerState(sharedRows);
  }
  return cloneDrawerState(FALLBACK_RULE_VARIABLE_ROWS);
}

const DEFAULT_RULE_VARIABLE_ROWS = getSharedRuleVariableRows();

let ruleVariableBaselineRows = cloneDrawerState(DEFAULT_RULE_VARIABLE_ROWS);
let ruleVariableRows = cloneDrawerState(DEFAULT_RULE_VARIABLE_ROWS);
let ruleVariablesEditMode = false;
let variableOpenMenuKey = null;
let selectedVariableRowIndex = null;
let defaultContentActionsMarkup = "";
let defaultDrawerMenuMarkup = "";
let variableDrawerUiState = createVariableDrawerUiState();

function createVariableDrawerUiState() {
  return {
    query: "",
    suggestionsOpen: false,
    historyPage: 1,
    historyQuery: "",
    historySearchOpen: false,
    isNew: false,
  };
}

function isVariablesViewActive() {
  return isWorkspaceVariablesModal() || sidebarState.selectedQuickAction === "Variables";
}

function isVariableDrawerActive() {
  return drawerVariant === "variables" && document.getElementById("drawer")?.classList.contains("open");
}

function getDefaultContentActionsMarkup() {
  if (!defaultContentActionsMarkup) {
    defaultContentActionsMarkup =
      document.querySelector(".content-actions")?.innerHTML ?? "";
  }
  return defaultContentActionsMarkup;
}

function getDefaultDrawerMenuMarkup() {
  if (!defaultDrawerMenuMarkup) {
    defaultDrawerMenuMarkup =
      document.getElementById("drawerMenu")?.innerHTML ?? "";
  }
  return defaultDrawerMenuMarkup;
}

function resetVariableDrawerUiState() {
  variableDrawerUiState = createVariableDrawerUiState();
  variableOpenMenuKey = null;
}

function restoreDefaultDrawerMenuMarkup() {
  const menu = document.getElementById("drawerMenu");
  if (!menu) return;
  const defaultMarkup = getDefaultDrawerMenuMarkup();
  if (defaultMarkup && menu.innerHTML !== defaultMarkup) {
    menu.innerHTML = defaultMarkup;
  }
}

function closeVariableDrawerState() {
  selectedVariableRowIndex = null;
  resetVariableDrawerUiState();
  restoreDefaultDrawerMenuMarkup();
}

function resetRuleVariablesViewState(options = {}) {
  const preserveSelection = Boolean(options.preserveSelection);
  ruleVariablesEditMode = false;
  variableOpenMenuKey = null;
  ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  if (!preserveSelection) {
    closeVariableDrawerState();
  } else {
    resetVariableDrawerUiState();
  }
}

function syncSharedVariableRows() {
  if (window.TeleseerAppData?.alerting) {
    window.TeleseerAppData.alerting.variables = cloneDrawerState(ruleVariableBaselineRows);
  }
}

function renderContentActions() {
  const actionsEl = document.querySelector(".content-actions");
  if (!actionsEl) return;

  if (!isVariablesViewActive()) {
    const defaultMarkup = getDefaultContentActionsMarkup();
    if (defaultMarkup && actionsEl.innerHTML !== defaultMarkup) {
      actionsEl.innerHTML = defaultMarkup;
    }
    return;
  }

  if (isVariableDrawerActive()) {
    actionsEl.innerHTML = "";
    return;
  }

  actionsEl.innerHTML = `
    <button
      class="btn-reset btn-secondary size-m style-outline"
      type="button"
      onclick="openNewVariableDrawer()"
    >
      Add Variable
    </button>
  `;
}

function renderVariablesBreadcrumb(count) {
  const breadcrumbEl = document.getElementById("contentBreadcrumb");
  if (!breadcrumbEl) return;
  breadcrumbEl.innerHTML = `<span class="source-root">Variables</span><span class="count-badge" id="ruleCount">${count}</span>`;
}

function getVariableSearchQuery() {
  return (
    document.getElementById("ruleSearch")?.value?.trim().toLowerCase() || ""
  );
}

function getFilteredRuleVariables(query = getVariableSearchQuery()) {
  return ruleVariableRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      if (!query) return true;
      const referencesText = row.references > 0 ? `${row.references} variables` : "";
      const usedByText = row.usedByAlerts > 0 ? `${row.usedByAlerts} alerts` : "not used";
      return [row.name, row.valueLabel, referencesText, usedByText]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
}

function canDeleteRuleVariable(variable) {
  return (
    Number(variable?.usedByAlerts || 0) === 0 &&
    Number(variable?.references || 0) === 0
  );
}

function normalizeVariableType(type) {
  return VARIABLE_DRAWER_TYPE_OPTIONS.includes(type) ? type : "Values";
}

function getVariableLiteralItems(variable) {
  if (Array.isArray(variable?.valueItems) && variable.valueItems.length) {
    return variable.valueItems.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
  const tooltip = String(variable?.valueTooltip || "").trim();
  if (!tooltip) return [];
  return tooltip
    .split("·")
    .map((item) => item.replace(/\s+\([^)]*\)$/, "").trim())
    .filter(Boolean);
}

function inferVariableType(variable) {
  const explicitType = normalizeVariableType(String(variable?.type || ""));
  if (explicitType !== "Values") return explicitType;
  const name = String(variable?.name || "").toUpperCase();
  const label = String(variable?.valueLabel || "");
  const literals = getVariableLiteralItems(variable);
  if (name.includes("PORT") || /Port/i.test(label)) return "Ports";
  if (name.includes("NET") || name.includes("SUBNET") || /Address|Subnet/i.test(label)) return "Subnets";
  if (name.includes("HOST") || name.includes("SERVER") || /Host|Server/i.test(label)) return "Hosts";
  if (literals.some((item) => /^!?\d{1,5}(?:-\d{1,5})?$/.test(item))) return "Ports";
  if (literals.some((item) => /^!?\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?$/.test(item))) return "Subnets";
  return "Values";
}

function inferVariableValueUnit(variable, type = inferVariableType(variable)) {
  const label = String(variable?.valueLabel || "");
  if (/Address/i.test(label)) return "Address";
  if (/Subnet/i.test(label)) return "Subnet";
  if (/Port/i.test(label)) return "Port";
  if (/Host|Server/i.test(label)) return "Host";
  switch (type) {
    case "Ports":
      return "Port";
    case "Subnets":
      return "Subnet";
    case "Hosts":
      return "Host";
    default:
      return "Value";
  }
}

function formatVariableValueCountLabel(type, count, fallbackVariable = null) {
  const safeCount = Math.max(0, Number(count) || 0);
  const unit = inferVariableValueUnit(fallbackVariable || { type, valueLabel: "" }, type);
  const plural = safeCount === 1 ? unit : `${unit}s`;
  return `${safeCount} ${plural}`;
}

function buildVariableValueEntries(variable) {
  const referenceEntries = (Array.isArray(variable?.referenceItems) ? variable.referenceItems : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .map((value) => ({ kind: "variable", value, exclude: false }));
  const literalEntries = getVariableLiteralItems(variable).map((item) => {
    const exclude = item.startsWith("!");
    return {
      kind: "literal",
      value: exclude ? item.slice(1).trim() : item,
      exclude,
    };
  }).filter((entry) => entry.value);
  return [...referenceEntries, ...literalEntries];
}

function buildDefaultVariableHistory(variable) {
  const entries = buildVariableValueEntries(variable);
  const descriptions = [];
  entries.slice(0, 4).forEach((entry) => {
    const label = entry.exclude ? `!${entry.value}` : entry.value;
    descriptions.push(`Added value ${label}`);
  });
  descriptions.push(`Created variable ${variable.name}`);
  while (descriptions.length < 8) {
    descriptions.push(`Updated variable ${variable.name}`);
  }
  return descriptions.map((description, index) => ({
    time: `20:4${index}:19s ago`,
    user: VARIABLE_HISTORY_ACTORS[index % VARIABLE_HISTORY_ACTORS.length],
    description,
  }));
}

function buildVariableHistoryRows(variable) {
  if (Array.isArray(variable?.historyRows) && variable.historyRows.length) {
    return cloneDrawerState(variable.historyRows);
  }
  return buildDefaultVariableHistory(variable);
}

function buildVariableDrawerState(variable) {
  const type = inferVariableType(variable);
  return {
    name: String(variable?.name || "").trim() || "NEW_VARIABLE",
    type,
    usedByAlerts: Number(variable?.usedByAlerts || 0),
    references: Number(variable?.references || 0),
    referenceItems: cloneDrawerState(variable?.referenceItems || []),
    valueEntries: buildVariableValueEntries(variable),
    valueLabel: String(variable?.valueLabel || formatVariableValueCountLabel(type, 0, variable)),
    valueTooltip: String(variable?.valueTooltip || ""),
    historyRows: buildVariableHistoryRows(variable),
    tags: cloneDrawerState(variable?.tags || []),
  };
}

function renderVariableUsedByCell(variable) {
  if (!variable.usedByAlerts) {
    return '<span class="variable-empty">-</span>';
  }
  return `
    <span class="variable-usedby-cell">
      <img class="variable-used-logo" src="${SURI_ICON_SURICATA_APP_SRC}" alt="" aria-hidden="true" />
      <img class="variable-used-logo" src="${SURI_ICON_TELESEER_LOGO_SRC}" alt="" aria-hidden="true" />
      <span>${escapeHtml(String(variable.usedByAlerts))} Alerts</span>
    </span>
  `;
}

function renderVariableReferenceCell(variable) {
  if (!variable.references) {
    return '<span class="variable-empty">-</span>';
  }
  return `<span class="variable-chip rule-project-chip"${getTooltipAttribute(formatTooltipItems(variable.referenceItems))}>${escapeHtml(String(variable.references))} Variables</span>`;
}

function renderVariableValueCell(variable) {
  const tooltipText =
    variable.valueTooltip || formatTooltipItems(getVariableLiteralItems(variable));
  return `<span class="variable-chip rule-project-chip"${getTooltipAttribute(tooltipText)}>${escapeHtml(variable.valueLabel)}</span>`;
}

function renderVariablesTable(headTable, thead, bodyTable, tbody) {
  const filteredRows = getFilteredRuleVariables();
  const layoutKey = "variables";
  const columns = getTableLayoutColumns(layoutKey);
  const hasActionsColumn = columns.some((column) => column.key === "varActions");
  renderVariablesBreadcrumb(filteredRows.length);
  [headTable, bodyTable].forEach((table) => {
    table.classList.remove("default-table", "suricata-feed-table", "is-selection-active");
    table.classList.add("variables-table");
  });
  thead.innerHTML = renderTableHeaderRow(layoutKey, columns);
  applyTableColumnLayout(layoutKey, columns);

  tbody.innerHTML = filteredRows
    .map(({ row, index }) => {
      const deleteDisabled = !canDeleteRuleVariable(row);
      const deleteReason =
        "Remove all linked references and alerts before deleting this variable.";
      const rowClass = [
        "variable-row",
        selectedVariableRowIndex === index ? "selected" : "",
      ].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}" onclick="openVariableDrawer(${index})">
          <td class="col-var-name">
            <span class="variable-name">${escapeHtml(row.name)}</span>
          </td>
          <td class="col-var-usedby">
            ${renderVariableUsedByCell(row)}
          </td>
          <td class="col-var-references">
            ${renderVariableReferenceCell(row)}
          </td>
          <td class="col-var-values">
            ${renderVariableValueCell(row)}
          </td>
          ${
            hasActionsColumn
              ? `
            <td class="col-var-actions">
              <button
                type="button"
                class="btn-reset btn-secondary-icon size-m style-outline variable-delete-button"
                onclick="event.stopPropagation(); deleteRuleVariable(${index})"
                ${deleteDisabled ? "disabled" : ""}
                title="${deleteDisabled ? deleteReason : "Delete variable"}"
                aria-label="Delete variable ${escapeHtml(row.name)}"
              >
                <span class="btn-icon-slot svg-icon variable-delete-icon" aria-hidden="true"></span>
              </button>
            </td>
          `
              : ""
          }
        </tr>
      `;
    })
    .join("");
  applyTableRowHeights();
  document.querySelector(".pagination")?.classList.add("hidden");
}

function buildVariableHistoryChangeRows(previousRow, nextRow) {
  const changes = [];
  if (!previousRow) {
    changes.push(`Created variable ${nextRow.name}`);
  }
  if (previousRow && previousRow.name !== nextRow.name) {
    changes.push(`Renamed ${previousRow.name} to ${nextRow.name}`);
  }
  if (previousRow && previousRow.type !== nextRow.type) {
    changes.push(`Changed type to ${nextRow.type}`);
  }
  const previousTokens = new Set(buildVariableValueEntries(previousRow || {}).map((entry) => `${entry.kind}:${entry.exclude ? "exclude" : "include"}:${entry.value}`));
  const nextTokens = new Set((nextRow.valueEntries || []).map((entry) => `${entry.kind}:${entry.exclude ? "exclude" : "include"}:${entry.value}`));
  nextTokens.forEach((token) => {
    if (previousTokens.has(token)) return;
    const [, mode, value] = token.split(":");
    changes.push(`Added value ${mode === "exclude" ? `!${value}` : value}`);
  });
  previousTokens.forEach((token) => {
    if (nextTokens.has(token)) return;
    const [, mode, value] = token.split(":");
    changes.push(`Removed value ${mode === "exclude" ? `!${value}` : value}`);
  });
  return changes;
}

function prependVariableHistory(previousRow, nextRow) {
  const existingHistory = Array.isArray(previousRow?.historyRows)
    ? cloneDrawerState(previousRow.historyRows)
    : buildVariableHistoryRows(previousRow || nextRow);
  const changeRows = buildVariableHistoryChangeRows(previousRow, nextRow).map(
    (description, index) => ({
      time: `just now`,
      user: index % 2 === 0 ? "Renz Dupitas" : "Ricky Tan",
      description,
    }),
  );
  return [...changeRows, ...existingHistory].slice(0, 25);
}

function sanitizeVariableDrawerState(state) {
  const nextState = cloneDrawerState(state || {});
  nextState.name = String(nextState.name || "").trim() || `NEW_VAR_${ruleVariableRows.length + 1}`;
  nextState.type = normalizeVariableType(nextState.type);
  const entries = Array.isArray(nextState.valueEntries)
    ? nextState.valueEntries
        .map((entry) => ({
          kind: entry.kind === "variable" ? "variable" : "literal",
          value: String(entry.value || "").trim(),
          exclude: Boolean(entry.exclude),
        }))
        .filter((entry) => entry.value)
    : [];
  nextState.valueEntries = entries;
  nextState.referenceItems = entries
    .filter((entry) => entry.kind === "variable" && !entry.exclude)
    .map((entry) => entry.value);
  nextState.references = nextState.referenceItems.length;
  nextState.valueItems = entries
    .filter((entry) => entry.kind === "literal")
    .map((entry) => (entry.exclude ? `!${entry.value}` : entry.value));
  nextState.valueTooltip = formatTooltipItems(
    nextState.valueItems.map((item) => String(item).trim()).filter(Boolean),
    20,
  );
  nextState.valueLabel = formatVariableValueCountLabel(
    nextState.type,
    entries.length,
    nextState,
  );
  nextState.historyRows = prependVariableHistory(
    selectedVariableRowIndex !== null ? ruleVariableRows[selectedVariableRowIndex] : null,
    nextState,
  );
  nextState.tags = Array.isArray(nextState.tags) ? nextState.tags : [];
  return nextState;
}

function syncVariableDrawerMenu() {
  const menu = document.getElementById("drawerMenu");
  if (!menu) return;
  if (drawerVariant !== "variables") {
    restoreDefaultDrawerMenuMarkup();
    return;
  }
  const sourceRow =
    selectedVariableRowIndex !== null ? ruleVariableRows[selectedVariableRowIndex] : null;
  const deleteAllowed = !variableDrawerUiState.isNew && canDeleteRuleVariable(sourceRow);
  menu.innerHTML = `
    <button
      type="button"
      class="menu-item${deleteAllowed ? "" : " is-disabled"}"
      ${deleteAllowed ? 'onclick="deleteSelectedVariableFromDrawer()"' : "disabled aria-disabled=\"true\""}
      title="${deleteAllowed ? "Delete variable" : "Remove linked references and alerts before deleting this variable."}"
    >
      <span class="menu-item-icon">${svgIcon(SURI_ICON_DELETE_SRC)}</span>
      <span class="menu-item-label">Delete Variable</span>
    </button>
  `;
}

function setVariableDrawerName(value) {
  if (drawerVariant !== "variables" || !suricataDrawerDraft) return;
  suricataDrawerDraft.name = value;
  const titleEl = document.getElementById("drawerTitle");
  if (titleEl) {
    titleEl.textContent = String(value || "").trim() || "New Variable";
  }
}

function setVariableDrawerType(value) {
  if (drawerVariant !== "variables" || !suricataDrawerDraft) return;
  suricataDrawerDraft.type = normalizeVariableType(value);
  renderSuricataDrawerContent();
  restoreVariableValueInputFocus();
}

function toggleVariableDrawerTypeMenu(event) {
  event?.stopPropagation?.();
  const menuKey = "variable-drawer:type";
  suricataOpenMenuKey = suricataOpenMenuKey === menuKey ? null : menuKey;
  renderSuricataDrawerContent();
}

function selectVariableDrawerType(event, value) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  suricataOpenMenuKey = null;
  setVariableDrawerType(value);
}

function renderVariableDrawerTypeControl(state) {
  const menuKey = "variable-drawer:type";
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = VARIABLE_DRAWER_TYPE_OPTIONS.map((option) => {
    const selectedClass = option === state.type ? " is-selected" : "";
    return `
      <button
        type="button"
        class="menu-item suri-menu-option${selectedClass}"
        onclick="selectVariableDrawerType(event, '${escapeJsSingleQuoted(option)}')"
      >
        <span>${escapeHtml(option)}</span>
      </button>
    `;
  }).join("");
  return `
    <div class="suri-menu" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="suri-menu-trigger suri-dropdown"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleVariableDrawerTypeMenu(event)"
      >
        <span class="suri-menu-value">${escapeHtml(state.type)}</span>
        <img class="suri-menu-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" aria-hidden="true" />
      </button>
      <div class="menu-list" role="listbox">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderVariableDrawerUsedByLink(state) {
  if (!state.usedByAlerts) {
    return '<span class="variable-usedby-link is-empty">0 Alerts</span>';
  }
  return `<span class="variable-usedby-link"${getTooltipAttribute(`${state.usedByAlerts} alerts use this variable`)}>${escapeHtml(String(state.usedByAlerts))} Alerts</span>`;
}

function getVariableValueSuggestionPool(type) {
  const pool = new Set();
  ruleVariableRows.forEach((row) => {
    getVariableLiteralItems(row).forEach((item) => {
      const normalized = String(item || "").replace(/^!/, "").trim();
      if (!normalized) return;
      const rowType = inferVariableType(row);
      if (type === "Values" || rowType === type) {
        pool.add(normalized);
      }
    });
  });
  return Array.from(pool).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function getVariableDrawerSuggestions(state) {
  const rawQuery = String(variableDrawerUiState.query || "").trim();
  if (!rawQuery) return [];
  const exclude = rawQuery.startsWith("!");
  const normalized = exclude ? rawQuery.slice(1).trim() : rawQuery;
  const wantsVariable = normalized.startsWith("$");
  const term = wantsVariable ? normalized.slice(1).trim().toLowerCase() : normalized.toLowerCase();
  const currentTokens = new Set((state.valueEntries || []).map((entry) => `${entry.kind}:${entry.exclude ? "exclude" : "include"}:${entry.value}`));
  if (wantsVariable) {
    return ruleVariableRows
      .map((row) => row.name)
      .filter((name) => name !== state.name)
      .filter((name) => !term || name.toLowerCase().includes(term))
      .map((name) => ({
        kind: "variable",
        value: name,
        label: name,
        create: false,
        selected: currentTokens.has(`variable:include:${name}`),
      }));
  }
  const literalSuggestions = getVariableValueSuggestionPool(state.type)
    .filter((value) => !term || value.toLowerCase().includes(term))
    .map((value) => ({
      kind: "literal",
      value,
      label: value,
      create: false,
      exclude,
      selected: currentTokens.has(`literal:${exclude ? "exclude" : "include"}:${value}`),
    }));
  const exactMatch = literalSuggestions.some(
    (item) => item.value.toLowerCase() === term && item.exclude === exclude,
  );
  if (!term) return literalSuggestions;
  if (!exactMatch) {
    literalSuggestions.unshift({
      kind: "literal",
      value: normalized,
      label: `Add: ${rawQuery}`,
      create: true,
      exclude,
      selected: false,
    });
  }
  return literalSuggestions;
}

function renderVariableDrawerChip(entry, index) {
  const chipClasses = ["suri-subnet-chip"];
  if (entry.kind === "variable") {
    chipClasses.push("project", "include");
  } else if (entry.exclude) {
    chipClasses.push("project", "exclude");
  } else {
    chipClasses.push("manual");
  }
  const label = entry.exclude ? `!${entry.value}` : entry.value;
  return `
    <span class="${chipClasses.join(" ")}">
      <span>${escapeHtml(label)}</span>
      ${
        editMode
          ? `
        <button
          type="button"
          class="suri-subnet-chip-remove"
          aria-label="Remove ${escapeHtml(label)}"
          onclick="removeVariableDrawerEntry(event, ${index})"
        >
          <span class="svg-icon svg-icon-close-small" aria-hidden="true"></span>
        </button>
      `
          : ""
      }
    </span>
  `;
}

function renderVariableDrawerSuggestions(state) {
  const suggestions = getVariableDrawerSuggestions(state);
  if (!suggestions.length || !variableDrawerUiState.suggestionsOpen || !editMode) {
    return "";
  }
  const title = String(variableDrawerUiState.query || "").trim().startsWith("$")
    ? "Variables"
    : `${escapeHtml(state.type)}`;
  return `
    <div class="suri-scope-suggestion-panel" role="listbox">
      <div class="suri-subnet-title">${title}</div>
      <div class="suri-scope-suggestion-list">
        ${suggestions.map((suggestion) => {
          if (suggestion.create) {
            return `
              <div class="menu-item menu-item-cta suri-scope-suggestion-item suri-scope-suggestion-create has-mode-actions">
                <span class="value">
                  <img class="suri-scope-suggestion-icon" src="${SURI_ICON_ADD_SRC}" alt="" aria-hidden="true" />
                  <span>${escapeHtml(suggestion.label)}</span>
                </span>
                <span class="suri-option-tail">
                  <button
                    type="button"
                    class="btn-reset btn-secondary-icon size-s style-outline suri-item-action-button${suggestion.exclude ? " is-active is-exclude" : " is-active is-include"}"
                    aria-label="Add value"
                    onclick="selectVariableValueSuggestion(event, 'literal', '${escapeJsSingleQuoted(suggestion.value)}', ${suggestion.exclude ? "true" : "false"})"
                  >
                    <span class="suri-item-action-glyph" aria-hidden="true">${suggestion.exclude ? "-" : "+"}</span>
                  </button>
                </span>
              </div>
            `;
          }
          return `
            <div class="menu-item menu-item-cta suri-scope-suggestion-item has-mode-actions${suggestion.selected ? " is-selected" : ""}">
              <span class="value">${escapeHtml(suggestion.label)}</span>
              <span class="suri-option-tail">
                <button
                  type="button"
                  class="btn-reset btn-secondary-icon size-s style-outline suri-item-action-button${suggestion.kind === "variable" || !suggestion.exclude ? " is-include" : " is-exclude"}${suggestion.selected ? " is-active" : ""}"
                  aria-label="Add ${escapeHtml(suggestion.label)}"
                  onclick="selectVariableValueSuggestion(event, '${suggestion.kind}', '${escapeJsSingleQuoted(suggestion.value)}', ${suggestion.exclude ? "true" : "false"})"
                >
                  <span class="suri-item-action-glyph" aria-hidden="true">${suggestion.kind === "variable" || !suggestion.exclude ? "+" : "-"}</span>
                </button>
              </span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderVariableValuesEditor(state) {
  const entries = Array.isArray(state.valueEntries) ? state.valueEntries : [];
  const hasTypedInput = String(variableDrawerUiState.query || "").trim().length > 0;
  const showInlineHelp = entries.length === 0 && !hasTypedInput;
  const helperText = `Type a ${state.type.toLowerCase().replace(/s$/, "")} or variable. Prefix "!" to exclude`;
  return `
    <div class="suri-scope-input-shell variable-values-shell${variableDrawerUiState.suggestionsOpen && editMode ? " is-open" : ""}" data-variable-values-shell>
      <div class="suri-scope-chipbox variable-values-chipbox${!editMode ? " is-readonly" : ""}" onclick="focusVariableValueInput(event)">
        ${entries.map((entry, index) => renderVariableDrawerChip(entry, index)).join("")}
        ${
          editMode
            ? `
          <div class="suri-scope-input-indicator" data-variable-value-indicator>
            ${showInlineHelp ? `<span class="suri-scope-inline-help">${escapeHtml(helperText)}</span>` : ""}
            <input
              type="text"
              class="suri-subnet-chip-input"
              data-variable-value-input
              value="${escapeHtml(variableDrawerUiState.query)}"
              placeholder=""
              oninput="setVariableValueQuery(this.value)"
              onkeydown="onVariableValueInputKeydown(event)"
            />
          </div>
        `
            : ""
        }
      </div>
      ${editMode ? `<div class="variable-values-suggestion-anchor">${renderVariableDrawerSuggestions(state)}</div>` : ""}
    </div>
  `;
}

function renderVariableDrawerAccordionCard(title, count, bodyMarkup, options = {}) {
  const accordionId = options.accordionId;
  const accordionState = getActiveAccordionState();
  const isExpanded = accordionId ? Boolean(accordionState[accordionId]) : true;
  const countMarkup = typeof count === "number"
    ? `<span class="count-badge">${count}</span>`
    : "";
  const headerControls = options.headerControls || "";
  const info = options.info
    ? `<img class="suri-header-info" src="${SURI_ICON_INFO_SRC}" alt="" aria-hidden="true" />`
    : "";
  return `
    <section class="card-accordion suri-card is-collapsible${isExpanded ? "" : " is-collapsed"}" id="suriCard-${escapeHtml(accordionId)}">
      <div class="card-accordion-header card-header suri-card-header" role="button" tabindex="0" aria-expanded="${isExpanded ? "true" : "false"}" onclick="toggleSuricataAccordion('${escapeJsSingleQuoted(accordionId)}')" onkeydown="onSuricataAccordionHeaderKeydown(event, '${escapeJsSingleQuoted(accordionId)}')">
        <div class="card-title suri-card-title variable-card-title"><span>${escapeHtml(title)}</span>${countMarkup}${info}</div>
        <div class="card-header-tail">
          ${headerControls ? `<div class="card-header-controls">${headerControls}</div>` : ""}
          <div class="card-header-chevron">
            <img class="card-header-chevron-icon suri-card-chevron-icon${isExpanded ? " is-expanded" : ""}" src="${SURI_ARROW_ICON_DOWN_SRC}" alt="" aria-hidden="true" data-accordion-chevron="${escapeHtml(accordionId)}" />
          </div>
        </div>
      </div>
      <div class="card-body suri-card-body">${bodyMarkup}</div>
    </section>
  `;
}

function getVisibleVariableHistoryRows(state) {
  const rows = Array.isArray(state.historyRows) ? state.historyRows : [];
  const query = String(variableDrawerUiState.historyQuery || "").trim().toLowerCase();
  const filtered = query
    ? rows.filter((row) => [row.time, row.user, row.description].join(" ").toLowerCase().includes(query))
    : rows;
  const page = Math.max(1, Number(variableDrawerUiState.historyPage) || 1);
  const start = (page - 1) * VARIABLE_HISTORY_PAGE_SIZE;
  return {
    rows: filtered.slice(start, start + VARIABLE_HISTORY_PAGE_SIZE),
    total: filtered.length,
    start,
  };
}

function renderVariableHistoryDescription(text) {
  return escapeHtml(String(text || "")).replace(/(!?[A-Z0-9_]+|!?\d[^\s]*)/g, (token) => {
    if (/^(Added|Removed|Renamed|Changed|Created|variable|to)$/i.test(token)) {
      return token;
    }
    return `<span class="teletext">${escapeHtml(token)}</span>`;
  });
}

function renderVariableHistoryBody(state) {
  const visible = getVisibleVariableHistoryRows(state);
  const total = visible.total;
  const start = total ? visible.start + 1 : 0;
  const end = total ? Math.min(visible.start + VARIABLE_HISTORY_PAGE_SIZE, total) : 0;
  const searchBar = variableDrawerUiState.historySearchOpen
    ? `
      <div class="variable-history-search">
        <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
        <input type="text" value="${escapeHtml(variableDrawerUiState.historyQuery)}" placeholder="Search history" oninput="setVariableHistoryQuery(this.value)" />
      </div>
    `
    : "";
  const rowsMarkup = visible.rows.length
    ? visible.rows.map((row) => `
        <tr>
          <td class="variable-history-time"><span>${escapeHtml(row.time)}</span></td>
          <td class="variable-history-user-cell"><span class="user-avatar">${escapeHtml(row.user.split(" ").map((part) => part[0]).slice(0, 2).join(""))}</span><span>${escapeHtml(row.user)}</span></td>
          <td class="variable-history-description-cell">${renderVariableHistoryDescription(row.description)}</td>
        </tr>
      `).join("")
    : '<tr><td colspan="3" class="variable-history-empty">No history found.</td></tr>';
  return `
    ${searchBar}
    <div class="variable-history-table-wrap">
      <table class="variable-history-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${rowsMarkup}
        </tbody>
      </table>
    </div>
    <div class="variable-history-footer">
      <button type="button" class="btn-reset btn-secondary size-s style-outline variable-history-summary">${start}-${end} of ${total || 0}</button>
      <div class="variable-history-nav">
        <button type="button" class="btn-reset btn-secondary-icon size-s style-outline" ${start <= 1 ? "disabled" : ""} onclick="changeVariableHistoryPage(-1)"><span class="suri-item-action-glyph" aria-hidden="true">‹</span></button>
        <button type="button" class="btn-reset btn-secondary-icon size-s style-outline" ${end >= total ? "disabled" : ""} onclick="changeVariableHistoryPage(1)"><span class="suri-item-action-glyph" aria-hidden="true">›</span></button>
      </div>
    </div>
  `;
}

function renderVariableTagsBody(state) {
  const tags = Array.isArray(state.tags) ? state.tags : [];
  if (tags.length) {
    return `<div class="variable-tags-list">${tags.map((tag) => `<span class="variable-chip">${escapeHtml(tag)}</span>`).join("")}</div>`;
  }
  return `
    <div class="variable-tags-empty-state">
      <div class="variable-tags-empty-copy">Click to add tags</div>
      <button type="button" class="btn-reset btn-secondary size-m style-outline variable-tags-add-button" onclick="openVariableTagsEditor()">
        <img src="${SURI_ICON_ADD_SRC}" alt="" aria-hidden="true" />
        <span>Add Tags</span>
      </button>
    </div>
  `;
}

function renderVariableDrawerContent(container, state) {
  if (!container || !state) return;
  const valuesBody = renderSuricataRow("Values", renderVariableValuesEditor(state), {
    info: true,
    className: "is-inline-editor is-variable-values-row",
  });
  const historyControls = `
    <button type="button" class="btn-reset btn-secondary-icon size-m style-outline" onclick="toggleVariableHistorySearch(event)" aria-label="Search history">
      <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
    </button>
  `;
  const tagsControls = `
    <button type="button" class="btn-reset btn-secondary-icon size-m style-outline" onclick="openVariableTagsSearch(event)" aria-label="Search tags">
      <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
    </button>
    <button type="button" class="btn-reset btn-secondary size-s style-outline" onclick="openVariableTagsEditor(event)">Edit</button>
  `;
  const historyCount = Array.isArray(state.historyRows) ? state.historyRows.length : 0;
  const tagsCount = Array.isArray(state.tags) ? state.tags.length : 0;

  container.innerHTML = [
    `<section class="card suri-card"><div class="card-body suri-card-body">${[
      renderSuricataRow(
        "Name",
        editMode
          ? `<input class="suri-input-field" type="text" value="${escapeHtml(state.name)}" data-variable-name-input oninput="setVariableDrawerName(this.value)" />`
          : renderSuricataValue(state.name),
      ),
      renderSuricataRow(
        "Type",
        editMode ? renderVariableDrawerTypeControl(state) : renderSuricataValue(state.type),
      ),
      renderSuricataRow(
        "Used By",
        renderVariableDrawerUsedByLink(state),
      ),
    ].join("")}</div></section>`,
    `<section class="card suri-card"><div class="card-body suri-card-body">${valuesBody}</div></section>`,
    renderVariableDrawerAccordionCard("History", historyCount, renderVariableHistoryBody(state), {
      accordionId: "variableHistory",
      headerControls: historyControls,
    }),
    renderVariableDrawerAccordionCard("Tags", tagsCount, renderVariableTagsBody(state), {
      accordionId: "variableTags",
      headerControls: tagsControls,
    }),
  ].join("");
  requestAnimationFrame(() => {
    syncVariableDrawerMenu();
    restoreVariableValueInputFocus(false);
  });
}

function focusVariableNameInput() {
  requestAnimationFrame(() => {
    const input = document.querySelector("[data-variable-name-input]");
    if (!input) return;
    focusTextFieldWithoutScroll(input, String(input.value || "").length);
  });
}

function restoreVariableValueInputFocus(keepSelection = true) {
  if (!editMode || drawerVariant !== "variables" || !variableDrawerUiState.suggestionsOpen) return;
  requestAnimationFrame(() => {
    const input = document.querySelector("[data-variable-value-input]");
    if (!input) return;
    const cursorPosition = keepSelection
      ? String(variableDrawerUiState.query || "").length
      : 0;
    focusTextFieldWithoutScroll(input, cursorPosition);
  });
}

function focusVariableValueInput(event) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "variables") return;
  variableDrawerUiState.suggestionsOpen = true;
  renderSuricataDrawerContent();
}

function setVariableValueQuery(value) {
  if (!editMode || drawerVariant !== "variables") return;
  variableDrawerUiState.query = value;
  variableDrawerUiState.suggestionsOpen = true;
  renderSuricataDrawerContent();
}

function addVariableDrawerEntry(entry) {
  if (!editMode || drawerVariant !== "variables" || !suricataDrawerDraft) return;
  const nextEntry = {
    kind: entry.kind === "variable" ? "variable" : "literal",
    value: String(entry.value || "").trim(),
    exclude: Boolean(entry.exclude),
  };
  if (!nextEntry.value) return;
  const token = `${nextEntry.kind}:${nextEntry.exclude ? "exclude" : "include"}:${nextEntry.value}`;
  const existingTokens = new Set(
    (suricataDrawerDraft.valueEntries || []).map(
      (item) => `${item.kind}:${item.exclude ? "exclude" : "include"}:${item.value}`,
    ),
  );
  if (existingTokens.has(token)) {
    variableDrawerUiState.query = "";
    variableDrawerUiState.suggestionsOpen = false;
    renderSuricataDrawerContent();
    return;
  }
  suricataDrawerDraft.valueEntries = [...(suricataDrawerDraft.valueEntries || []), nextEntry];
  variableDrawerUiState.query = "";
  variableDrawerUiState.suggestionsOpen = false;
  renderSuricataDrawerContent();
}

function selectVariableValueSuggestion(event, kind, value, exclude = false) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  addVariableDrawerEntry({ kind, value, exclude });
}

function removeVariableDrawerEntry(event, index) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "variables" || !suricataDrawerDraft) return;
  suricataDrawerDraft.valueEntries = (suricataDrawerDraft.valueEntries || []).filter(
    (_, entryIndex) => entryIndex !== index,
  );
  renderSuricataDrawerContent();
}

function commitVariableValueQuery() {
  if (!editMode || drawerVariant !== "variables") return;
  const rawQuery = String(variableDrawerUiState.query || "").trim();
  if (!rawQuery) return;
  const normalized = rawQuery.startsWith("!") ? rawQuery.slice(1).trim() : rawQuery;
  if (!normalized) return;
  if (normalized.startsWith("$")) {
    const variableName = normalized.slice(1).trim();
    if (!variableName) return;
    addVariableDrawerEntry({ kind: "variable", value: variableName, exclude: false });
    return;
  }
  addVariableDrawerEntry({
    kind: "literal",
    value: normalized,
    exclude: rawQuery.startsWith("!"),
  });
}

function onVariableValueInputKeydown(event) {
  if (!editMode || drawerVariant !== "variables") return;
  if (event.key === "Enter") {
    event.preventDefault();
    commitVariableValueQuery();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    variableDrawerUiState.suggestionsOpen = false;
    renderSuricataDrawerContent();
    return;
  }
  if (
    event.key === "Backspace" &&
    !String(variableDrawerUiState.query || "").length &&
    Array.isArray(suricataDrawerDraft?.valueEntries) &&
    suricataDrawerDraft.valueEntries.length
  ) {
    event.preventDefault();
    suricataDrawerDraft.valueEntries.pop();
    renderSuricataDrawerContent();
  }
}

function closeVariableValueMenu() {
  if (drawerVariant === "variables" && variableDrawerUiState.suggestionsOpen) {
    variableDrawerUiState.suggestionsOpen = false;
    renderSuricataDrawerContent();
    return;
  }
  if (variableOpenMenuKey === null) return;
  variableOpenMenuKey = null;
}

function onVariableMenuPointerEnter() {}
function onVariableMenuPointerDown() {}
function onVariableMenuPointerLeave() {}
function syncVariableValueMenus() {}
function syncVariableValueLabel() {}
function toggleVariableValueMenu() {}
function selectVariableValueOption() {}

function openVariableDrawer(rowIndex, options = {}) {
  const variable = ruleVariableRows[rowIndex];
  if (!variable) return;
  selectedVariableRowIndex = rowIndex;
  drawerVariant = "variables";
  suricataDrawerBaseline = buildVariableDrawerState(variable);
  suricataDrawerDraft = cloneDrawerState(suricataDrawerBaseline);
  variableAccordionState = { ...VARIABLE_ACCORDION_DEFAULT_STATE };
  resetVariableDrawerUiState();
  variableDrawerUiState.isNew = false;
  suricataOpenMenuKey = null;
  editMode = options.startEditing !== false;
  document.getElementById("drawerTitle").textContent = variable.name;
  document.getElementById("drawer")?.classList.add("open");
  document.querySelector(".modal-body")?.classList.add("drawer-open");
  syncDrawerHeaderActions();
  renderSuricataDrawerContent();
  renderRules();
  syncVariableDrawerMenu();
}

function openNewVariableDrawer() {
  const draft = buildVariableDrawerState({
    name: `NEW_VAR_${ruleVariableRows.length + 1}`,
    type: "Values",
    usedByAlerts: 0,
    references: 0,
    referenceItems: [],
    valueItems: [],
    tags: [],
    historyRows: [],
  });
  selectedVariableRowIndex = null;
  drawerVariant = "variables";
  suricataDrawerBaseline = cloneDrawerState(draft);
  suricataDrawerDraft = cloneDrawerState(draft);
  variableAccordionState = { ...VARIABLE_ACCORDION_DEFAULT_STATE };
  resetVariableDrawerUiState();
  variableDrawerUiState.isNew = true;
  suricataOpenMenuKey = null;
  editMode = true;
  document.getElementById("drawerTitle").textContent = draft.name;
  document.getElementById("drawer")?.classList.add("open");
  document.querySelector(".modal-body")?.classList.add("drawer-open");
  syncDrawerHeaderActions();
  renderSuricataDrawerContent();
  renderRules();
  syncVariableDrawerMenu();
  focusVariableNameInput();
}

function onVariableDrawerClosed() {
  closeVariableDrawerState();
}

function cancelVariableDrawerEditMode() {
  if (drawerVariant !== "variables") return;
  closeDrawer();
}

function saveVariableDrawerChangesImpl() {
  if (drawerVariant !== "variables" || !suricataDrawerDraft) return false;
  const sanitized = sanitizeVariableDrawerState(suricataDrawerDraft);
  if (selectedVariableRowIndex === null) {
    ruleVariableBaselineRows = [...ruleVariableBaselineRows, cloneDrawerState(sanitized)];
    ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
    selectedVariableRowIndex = ruleVariableRows.length - 1;
    variableDrawerUiState.isNew = false;
  } else {
    ruleVariableBaselineRows[selectedVariableRowIndex] = cloneDrawerState(sanitized);
    ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  }
  syncSharedVariableRows();
  suricataDrawerBaseline = buildVariableDrawerState(ruleVariableRows[selectedVariableRowIndex]);
  suricataDrawerDraft = cloneDrawerState(suricataDrawerBaseline);
  document.getElementById("drawerTitle").textContent = suricataDrawerBaseline.name;
  editMode = true;
  resetVariableDrawerUiState();
  syncDrawerHeaderActions();
  renderSuricataDrawerContent();
  renderRules();
  syncVariableDrawerMenu();
  showToast("Variable changes saved successfully");
  return true;
}

function deleteSelectedVariableFromDrawer() {
  if (selectedVariableRowIndex === null) {
    closeDrawer();
    return;
  }
  const variable = ruleVariableRows[selectedVariableRowIndex];
  if (!variable || !canDeleteRuleVariable(variable)) {
    showToast("Remove linked references and alerts before deleting this variable");
    return;
  }
  ruleVariableBaselineRows.splice(selectedVariableRowIndex, 1);
  ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  syncSharedVariableRows();
  closeDrawer();
  renderRules();
  showToast("Variable deleted");
}

function toggleVariableHistorySearch(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  variableDrawerUiState.historySearchOpen = !variableDrawerUiState.historySearchOpen;
  if (!variableDrawerUiState.historySearchOpen) {
    variableDrawerUiState.historyQuery = "";
  }
  variableDrawerUiState.historyPage = 1;
  renderSuricataDrawerContent();
}

function setVariableHistoryQuery(value) {
  variableDrawerUiState.historyQuery = value;
  variableDrawerUiState.historyPage = 1;
  renderSuricataDrawerContent();
}

function changeVariableHistoryPage(delta) {
  const state = getActiveDrawerState();
  if (!state) return;
  const visible = getVisibleVariableHistoryRows(state);
  const maxPage = Math.max(1, Math.ceil(visible.total / VARIABLE_HISTORY_PAGE_SIZE));
  const nextPage = Math.max(1, Math.min(maxPage, (Number(variableDrawerUiState.historyPage) || 1) + delta));
  if (nextPage === variableDrawerUiState.historyPage) return;
  variableDrawerUiState.historyPage = nextPage;
  renderSuricataDrawerContent();
}

function openVariableTagsEditor(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  showToast("Tag editing is not implemented in this prototype");
}

function openVariableTagsSearch(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  showToast("Tag search is not implemented in this prototype");
}

function enterRuleVariablesEditMode() {
  openNewVariableDrawer();
}

function cancelRuleVariableChanges() {
  resetRuleVariablesViewState();
  renderRules();
}

function saveRuleVariableChanges() {
  syncSharedVariableRows();
  resetRuleVariablesViewState();
  renderRules();
  showToast("Variable changes saved successfully");
}

function addRuleVariableRow() {
  openNewVariableDrawer();
}

function deleteRuleVariable(index) {
  const variable = ruleVariableRows[index];
  if (!variable) return;
  if (!canDeleteRuleVariable(variable)) {
    showToast("Remove linked references and alerts before deleting this variable");
    return;
  }
  ruleVariableBaselineRows.splice(index, 1);
  ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  syncSharedVariableRows();
  if (selectedVariableRowIndex === index) {
    closeDrawer();
  }
  renderRules();
}
