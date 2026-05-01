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

const VARIABLE_DRAWER_TYPE_OPTIONS = ["Port", "Subnet"];
const VARIABLE_HISTORY_PAGE_SIZE = 5;
const VARIABLE_HISTORY_ACTORS = [
  "Ricky Tan",
  "Renz Dupitas",
  "Ricky Tan",
  "Ricky Tan",
  "Renz Dupitas",
];

function getCurrentVariableTimestamp() {
  return new Date().toISOString();
}

function normalizeVariableSeedRow(row = {}, index = 0) {
  const base = cloneDrawerState(row || {});
  const type = normalizeVariableType(base.type);
  const literalItems = Array.isArray(base.literalValues)
    ? base.literalValues
    : Array.isArray(base.valueItems)
      ? base.valueItems
      : [];
  const valueItems = literalItems.map((item) => String(item ?? "").trim()).filter(Boolean);
  const valueCount = Number.isFinite(Number(base.valueCount))
    ? Math.max(0, Number(base.valueCount))
    : countVariableLiteralValues(type, valueItems);
  const usedByCount = Number.isFinite(Number(base.usedByRules))
    ? Math.max(0, Number(base.usedByRules))
    : Number.isFinite(Number(base.usedByAlerts))
      ? Math.max(0, Number(base.usedByAlerts))
      : 0;
  const projectCount = Number.isFinite(Number(base.projects))
    ? Math.max(0, Number(base.projects))
    : Array.isArray(base.projectItems)
      ? base.projectItems.length
      : 0;
  const createdAt = String(base.createdAt || base.created || "").trim() || `2026-01-${String(10 + (index % 18)).padStart(2, "0")}T08:00:00Z`;
  const updatedAt = String(base.updatedAt || base.updated || "").trim() || createdAt;
  const referenceItems = Array.isArray(base.referenceItems)
    ? base.referenceItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
  const usedByRuleItems = Array.isArray(base.usedByRuleItems)
    ? base.usedByRuleItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
  const projectItems = Array.isArray(base.projectItems)
    ? base.projectItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
  const nextRow = {
    ...base,
    type,
    valueItems,
    literalValues: valueItems,
    valueCount,
    usedByRules: usedByCount,
    usedByAlerts: usedByCount,
    referencedBy: 0,
    references: 0,
    projects: projectCount,
    createdAt,
    updatedAt,
    referencedByItems: [],
    usedByRuleItems,
    projectItems,
    referenceItems,
  };
  if (!String(nextRow.valueLabel || "").trim()) {
    nextRow.valueLabel = formatVariableValueCountLabel(type, valueCount, nextRow);
  }
  if (!String(nextRow.valueTooltip || "").trim()) {
    nextRow.valueTooltip = formatVariableTooltipList(valueItems, valueCount);
  }
  return nextRow;
}

function normalizeVariableSeedRows(rows) {
  return deriveVariableReferenceState(
    (Array.isArray(rows) ? rows : []).map((row, index) =>
      normalizeVariableSeedRow(row, index),
    ),
  );
}

function buildVariableReferenceReverseIndex(rows) {
  const reverseIndex = new Map();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const sourceName = String(row?.name || "").trim();
    if (!sourceName) return;
    const references = Array.isArray(row?.referenceItems)
      ? row.referenceItems.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [];
    [...new Set(references)].forEach((targetName) => {
      if (!reverseIndex.has(targetName)) reverseIndex.set(targetName, new Set());
      reverseIndex.get(targetName).add(sourceName);
    });
  });
  return reverseIndex;
}

function deriveVariableReferenceState(rows) {
  const normalizedRows = cloneDrawerState(Array.isArray(rows) ? rows : []);
  const reverseIndex = buildVariableReferenceReverseIndex(normalizedRows);
  return normalizedRows.map((row) => {
    const name = String(row?.name || "").trim();
    const referencedByItems = name && reverseIndex.has(name)
      ? Array.from(reverseIndex.get(name)).sort((left, right) =>
          left.localeCompare(right, undefined, { sensitivity: "base" }),
        )
      : [];
    return {
      ...row,
      referenceItems: Array.isArray(row?.referenceItems)
        ? row.referenceItems.map((item) => String(item ?? "").trim()).filter(Boolean)
        : [],
      referencedByItems,
      referencedBy: referencedByItems.length,
      references: referencedByItems.length,
    };
  });
}

function getSharedRuleVariableRows() {
  const sharedRows = window.TeleseerAppData?.alerting?.variables;
  if (Array.isArray(sharedRows) && sharedRows.length) {
    return normalizeVariableSeedRows(sharedRows);
  }
  return normalizeVariableSeedRows(FALLBACK_RULE_VARIABLE_ROWS);
}

const DEFAULT_RULE_VARIABLE_ROWS = getSharedRuleVariableRows();

let ruleVariableBaselineRows = cloneDrawerState(DEFAULT_RULE_VARIABLE_ROWS);
let ruleVariableRows = cloneDrawerState(DEFAULT_RULE_VARIABLE_ROWS);
let ruleVariablesEditMode = false;
let variableOpenMenuKey = null;
let variableDrawerTypeChangePending = null;
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
  variableDrawerTypeChangePending = null;
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
  ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  selectedVariableRowIndex = null;
  resetVariableDrawerUiState();
  restoreDefaultDrawerMenuMarkup();
}

function syncVariableTableRowFromDraft() {
  if (
    selectedVariableRowIndex === null ||
    !suricataDrawerDraft ||
    drawerVariant !== "variables"
  ) return;
  const entries = Array.isArray(suricataDrawerDraft.valueEntries)
    ? suricataDrawerDraft.valueEntries.filter((e) => String(e.value || "").trim())
    : [];
  const valueItems = entries
    .filter((e) => e.kind === "literal")
    .map((e) => (e.exclude ? `!${e.value}` : e.value));
  const referenceItems = entries
    .filter((e) => e.kind === "variable" && !e.exclude)
    .map((e) => e.value);
  const type = suricataDrawerDraft.type || "port";
  const valueCount = countVariableLiteralValues(type, valueItems);
  const row = ruleVariableRows[selectedVariableRowIndex];
  if (!row) return;
  row.name = String(suricataDrawerDraft.name || row.name || "").trim() || row.name;
  row.type = type;
  row.valueItems = valueItems;
  row.literalValues = valueItems;
  row.valueCount = valueCount;
  row.valueLabel = formatVariableValueCountLabel(type, valueCount, { valueItems, referenceItems });
  row.valueTooltip = formatVariableTooltipList(
    valueItems.map((v) => String(v).trim()).filter(Boolean),
    valueCount,
  );
  row.referenceItems = referenceItems;
  ruleVariableRows = deriveVariableReferenceState(ruleVariableRows);
  if (typeof renderRules === "function") renderRules();
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
    const sharedRows = cloneDrawerState(
      ruleVariableBaselineRows.map((row) => {
        const nextRow = { ...row };
        delete nextRow.referencedBy;
        delete nextRow.references;
        delete nextRow.referencedByItems;
        delete nextRow.usedByRules;
        delete nextRow.usedByAlerts;
        delete nextRow.usedByRuleItems;
        delete nextRow.projects;
        delete nextRow.projectItems;
        delete nextRow.valueCount;
        return nextRow;
      }),
    );
    window.TeleseerAppData.alerting.variables = sharedRows;
    if (window.TeleseerAppData.alerting.graph?.variables) {
      window.TeleseerAppData.alerting.graph.variables = sharedRows.map((row) => ({
        name: row.name,
        type: row.type,
        literalValues: cloneDrawerState(row.valueItems || row.literalValues || []),
        referenceItems: cloneDrawerState(row.referenceItems || []),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
    }
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

function getVariableValueItems(variable) {
  if (Array.isArray(variable?.literalValues) && variable.literalValues.length) {
    return variable.literalValues.map((item) => String(item ?? "").trim()).filter(Boolean);
  }
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

function countVariableLiteralValues(type, valueItems) {
  const normalizedType = normalizeVariableType(type);
  const items = Array.isArray(valueItems)
    ? valueItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
  if (normalizedType === "Subnet") {
    return items.length;
  }
  return items.reduce((sum, item) => {
    const clean = item.replace(/^!/, "");
    const rangeMatch = clean.match(/^(\d{1,5})-(\d{1,5})$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        return sum + ((end - start) + 1);
      }
      return sum;
    }
    return sum + (/^\d{1,5}$/.test(clean) ? 1 : 0);
  }, 0);
}

function getVariableUsedByCount(variable) {
  const explicitCount = Number(variable?.usedByRules ?? variable?.usedByAlerts);
  if (Number.isFinite(explicitCount) && explicitCount >= 0) return explicitCount;
  return Array.isArray(variable?.usedByRuleItems) ? variable.usedByRuleItems.length : 0;
}

function getVariableReferencedByCount(variable) {
  return Array.isArray(variable?.referencedByItems) ? variable.referencedByItems.length : 0;
}

function getVariableProjectCount(variable) {
  const explicitCount = Number(variable?.projects);
  if (Number.isFinite(explicitCount) && explicitCount >= 0) return explicitCount;
  return Array.isArray(variable?.projectItems) ? variable.projectItems.length : 0;
}

function getVariableValueCount(variable) {
  const explicitCount = Number(variable?.valueCount);
  if (Number.isFinite(explicitCount) && explicitCount >= 0) return explicitCount;
  return countVariableLiteralValues(inferVariableType(variable), getVariableValueItems(variable));
}

function getVariableUsedByItems(variable) {
  return Array.isArray(variable?.usedByRuleItems)
    ? variable.usedByRuleItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
}

function getVariableReferencedByItems(variable) {
  return Array.isArray(variable?.referencedByItems)
    ? variable.referencedByItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
}

function getVariableProjectItems(variable) {
  return Array.isArray(variable?.projectItems)
    ? variable.projectItems.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
}

function getFilteredRuleVariables(query = getVariableSearchQuery()) {
  return ruleVariableRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      if (!query) return true;
      const searchableFields = [
        row.name,
        row.type,
        row.valueLabel,
        formatVariableValueCountLabel(
          row.type || inferVariableType(row),
          row.valueCount ?? getVariableValueItems(row).length,
          row,
        ),
        `${getVariableUsedByCount(row)} rules`,
        `${getVariableReferencedByCount(row)} variables`,
        `${getVariableProjectCount(row)} projects`,
        ...(Array.isArray(row.valueItems) ? row.valueItems : []),
        ...(Array.isArray(row.usedByRuleItems) ? row.usedByRuleItems : []),
        ...(Array.isArray(row.referencedByItems) ? row.referencedByItems : []),
        ...(Array.isArray(row.projectItems) ? row.projectItems : []),
        row.createdAt,
        row.updatedAt,
      ];
      return searchableFields.filter(Boolean).join(" ").toLowerCase().includes(query);
    });
}

function canDeleteRuleVariable(variable) {
  return (
    getVariableUsedByCount(variable) === 0 &&
    getVariableReferencedByCount(variable) === 0 &&
    getVariableProjectCount(variable) === 0
  );
}

function normalizeVariableType(type) {
  const normalized = String(type || "").trim().toLowerCase();
  if (normalized.startsWith("subnet") || normalized.startsWith("address")) {
    return "Subnet";
  }
  if (normalized.startsWith("port")) {
    return "Port";
  }
  return "";
}

function getVariableLiteralItems(variable) {
  return getVariableValueItems(variable);
}

function inferVariableType(variable) {
  const explicitType = normalizeVariableType(String(variable?.type || ""));
  if (explicitType) return explicitType;
  const name = String(variable?.name || "").toUpperCase();
  const label = String(variable?.valueLabel || "");
  const literals = getVariableLiteralItems(variable);
  if (name.includes("NET") || name.includes("SUBNET") || /Address|Subnet/i.test(label)) return "Subnet";
  if (name.includes("PORT") || /Port/i.test(label)) return "Port";
  if (literals.some((item) => /^!?\d{1,5}(?:-\d{1,5})?$/.test(item))) return "Port";
  if (literals.some((item) => /^!?\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?$/.test(item))) return "Subnet";
  return "Port";
}

function inferVariableValueUnit(variable, type = inferVariableType(variable)) {
  return normalizeVariableType(type) === "Subnet" ? "Address" : "Port";
}

function formatVariableValueCountLabel(type, count, fallbackVariable = null) {
  const safeCount = Math.max(0, Number(count) || 0);
  const unit = inferVariableValueUnit(fallbackVariable || { type, valueLabel: "" }, type);
  const plural =
    safeCount === 1
      ? unit
      : unit === "Address"
        ? "Addresses"
        : `${unit}s`;
  return `${safeCount} ${plural}`;
}

function formatVariableMetricCountLabel(count, singularLabel) {
  const safeCount = Math.max(0, Number(count) || 0);
  const plural = safeCount === 1 ? singularLabel : `${singularLabel}s`;
  return `${safeCount} ${plural}`;
}

function formatVariableTooltipList(items, totalCount = null, limit = 12) {
  const tokens = (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  const visibleTokens = limit > 0 ? tokens.slice(0, limit) : tokens;
  if (!visibleTokens.length) return "";
  const lines = [...visibleTokens];
  const numericTotal = Number(totalCount);
  if (Number.isFinite(numericTotal) && numericTotal > visibleTokens.length) {
    lines.push(`+${numericTotal - visibleTokens.length} more`);
  }
  return lines.join("\n");
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
  const valueCount = getVariableValueCount(variable);
  return {
    name: String(variable?.name || "").trim() || "NEW_VARIABLE",
    type,
    valueCount,
    usedByRules: getVariableUsedByCount(variable),
    usedByAlerts: getVariableUsedByCount(variable),
    usedByRuleItems: cloneDrawerState(getVariableUsedByItems(variable)),
    referencedBy: getVariableReferencedByCount(variable),
    references: getVariableReferencedByCount(variable),
    referencedByItems: cloneDrawerState(getVariableReferencedByItems(variable)),
    projects: getVariableProjectCount(variable),
    projectItems: cloneDrawerState(getVariableProjectItems(variable)),
    referenceItems: cloneDrawerState(variable?.referenceItems || []),
    valueEntries: buildVariableValueEntries(variable),
    valueItems: cloneDrawerState(getVariableValueItems(variable)),
    literalValues: cloneDrawerState(getVariableValueItems(variable)),
    valueLabel: String(variable?.valueLabel || formatVariableValueCountLabel(type, valueCount, variable)),
    valueTooltip: String(variable?.valueTooltip || formatVariableTooltipList(getVariableValueItems(variable), valueCount)),
    createdAt: String(variable?.createdAt || getCurrentVariableTimestamp()),
    updatedAt: String(variable?.updatedAt || variable?.createdAt || getCurrentVariableTimestamp()),
    description: String(variable?.description || "").trim(),
    historyRows: buildVariableHistoryRows(variable),
    author: (() => { const rows = buildVariableHistoryRows(variable); return rows.length ? rows[rows.length - 1].user : ""; })(),
    editor: (() => { const rows = buildVariableHistoryRows(variable); return rows.length ? rows[0].user : ""; })(),
    tags: cloneDrawerState(variable?.tags || []),
  };
}

function renderVariableUsedByCell(variable) {
  const count = getVariableUsedByCount(variable);
  const items = getVariableUsedByItems(variable);
  const label = formatVariableMetricCountLabel(count, "Rule");
  return renderVariableMetricPill({
    label,
    count,
    tooltipItems: items,
    tooltipCount: count,
    singularLabel: "Rule",
    extraClass: "is-used-by",
  });
}

function renderVariableReferenceCell(variable) {
  const count = getVariableReferencedByCount(variable);
  const items = getVariableReferencedByItems(variable);
  const label = formatVariableMetricCountLabel(count, "Variable");
  return renderVariableMetricPill({
    label,
    count,
    tooltipItems: items,
    tooltipCount: count,
    singularLabel: "Variable",
    extraClass: "is-referenced-by",
  });
}

function renderVariableValueCell(variable) {
  const count = getVariableValueCount(variable);
  const type = inferVariableType(variable);
  const label = formatVariableValueCountLabel(type, count, variable);
  const tooltipText = variable.valueTooltip || formatVariableTooltipList(getVariableValueItems(variable), count);
  return renderVariableMetricPill({
    label,
    count,
    tooltipText,
    tooltipCount: count,
    singularLabel: inferVariableValueUnit(variable, type),
    extraClass: "is-values",
  });
}

function renderVariableProjectCell(variable) {
  const count = getVariableProjectCount(variable);
  const items = getVariableProjectItems(variable);
  return renderVariableMetricPill({
    label: formatVariableMetricCountLabel(count, "Project"),
    count,
    tooltipItems: items,
    tooltipCount: count,
    singularLabel: "Project",
    extraClass: "is-projects",
  });
}

function formatVariableTimestampLabel(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp || "-");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatVariableTimestampTooltip(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp || "-");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function renderVariableTimestampButton(timestamp, labelPrefix) {
  const tooltipText = formatVariableTimestampTooltip(timestamp);
  const label = formatVariableTimestampLabel(timestamp);
  return `
    <button
      type="button"
      class="btn-reset alerts-tertiary-button btn-tertiary--info variable-timestamp-button"
      onclick="event.stopPropagation()"
      ${getTooltipAttributes(tooltipText)}
      aria-label="${escapeHtml(`${labelPrefix}: ${tooltipText}`)}"
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function renderVariableMetricPill({
  label,
  count,
  tooltipText = "",
  tooltipItems = [],
  tooltipCount = null,
  singularLabel = "",
  extraClass = "",
}) {
  const safeCount = Math.max(0, Number(count) || 0);
  const numericTotal = Number(tooltipCount);
  const tooltip = tooltipText || formatVariableTooltipList(tooltipItems, Number.isFinite(numericTotal) ? numericTotal : safeCount);
  const tooltipTokens = (tooltip || "").split("\n").filter(Boolean);
  const maxCount = getVariableMetricMaxCount(singularLabel);
  const fillPercent = safeCount > 0 ? getVariableMetricFillPercent(safeCount, maxCount) : 0;
  const emptyClass = safeCount === 0 ? " is-empty" : "";
  return `
    <span class="variable-chip variable-metric-pill${extraClass ? ` ${escapeHtml(extraClass)}` : ""}${emptyClass}"${getTooltipAttributes(tooltip, { scrollable: safeCount > 8 || tooltipTokens.length > 8 })}>
      <span class="variable-metric-fill" style="width:${fillPercent.toFixed(1)}%"></span>
      <span class="variable-metric-value">${escapeHtml(label)}</span>
    </span>
  `;
}

function getVariableMetricMaxCount(singularLabel) {
  const rows = ruleVariableRows.length ? ruleVariableRows : ruleVariableBaselineRows;
  return rows.reduce((max, row) => {
    let value = 0;
    if (singularLabel === "Rule") {
      value = getVariableUsedByCount(row);
    } else if (singularLabel === "Variable") {
      value = getVariableReferencedByCount(row);
    } else if (singularLabel === "Project") {
      value = getVariableProjectCount(row);
    } else {
      value = getVariableValueCount(row);
    }
    if (!Number.isFinite(value) || value < 0) return max;
    return Math.max(max, value);
  }, 1);
}

function getVariableMetricFillPercent(value, maxValue) {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(maxValue) || maxValue <= 0) {
    return 0;
  }
  return Math.max(10, Math.min(100, (value / maxValue) * 100));
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

  if (!filteredRows.length) {
    const emptyMessage = getVariableSearchQuery() && ruleVariableRows.length
      ? "No variables match search"
      : "No variables";
    tbody.innerHTML = renderVariablesEmptyStateRow(columns.length, emptyMessage);
    applyTableRowHeights();
    document.querySelector(".pagination")?.classList.add("hidden");
    return;
  }

  tbody.innerHTML = filteredRows
    .map(({ row, index }) => {
      const deleteDisabled = !canDeleteRuleVariable(row);
      const deleteReason =
        "Remove linked rules, variables, and projects before deleting this variable.";
      const rowClass = [
        "variable-row",
        selectedVariableRowIndex === index ? "selected" : "",
      ].filter(Boolean).join(" ");
      return `
        <tr class="${rowClass}" onclick="openVariableDrawer(${index})">
          <td class="col-var-name">
            <span class="variable-name">${escapeHtml(row.name)}</span>
          </td>
          <td class="col-var-type">
            <span class="variable-type">${escapeHtml(inferVariableType(row))}</span>
          </td>
          <td class="col-var-values">
            ${renderVariableValueCell(row)}
          </td>
          <td class="col-var-usedby">
            ${renderVariableUsedByCell(row)}
          </td>
          <td class="col-var-referenced-by">
            ${renderVariableReferenceCell(row)}
          </td>
          <td class="col-var-projects">
            ${renderVariableProjectCell(row)}
          </td>
          <td class="col-var-created">
            ${renderVariableTimestampButton(row.createdAt, "Created")}
          </td>
          <td class="col-var-updated">
            ${renderVariableTimestampButton(row.updatedAt, "Updated")}
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

function renderVariablesEmptyStateRow(columnCount, message) {
  return `
    <tr class="alerting-table-empty-row">
      <td colspan="${columnCount}">
        <div class="alerting-table-empty-copy">${escapeHtml(message)}</div>
      </td>
    </tr>
  `;
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
  const isNewVariable = variableDrawerUiState.isNew || selectedVariableRowIndex === null;
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
  nextState.referencedByItems = [];
  nextState.referencedBy = 0;
  nextState.references = 0;
  nextState.usedByRuleItems = Array.isArray(nextState.usedByRuleItems)
    ? cloneDrawerState(nextState.usedByRuleItems)
    : [];
  nextState.usedByRules = Number.isFinite(Number(nextState.usedByRules))
    ? Math.max(0, Number(nextState.usedByRules))
    : Number.isFinite(Number(nextState.usedByAlerts))
      ? Math.max(0, Number(nextState.usedByAlerts))
      : nextState.usedByRuleItems.length;
  nextState.usedByAlerts = nextState.usedByRules;
  nextState.projectItems = Array.isArray(nextState.projectItems)
    ? cloneDrawerState(nextState.projectItems)
    : [];
  nextState.projects = Number.isFinite(Number(nextState.projects))
    ? Math.max(0, Number(nextState.projects))
    : nextState.projectItems.length;
  nextState.valueItems = entries
    .filter((entry) => entry.kind === "literal")
    .map((entry) => (entry.exclude ? `!${entry.value}` : entry.value));
  nextState.literalValues = cloneDrawerState(nextState.valueItems);
  nextState.valueCount = countVariableLiteralValues(nextState.type, nextState.valueItems);
  nextState.referenceItems = entries
    .filter((entry) => entry.kind === "variable" && !entry.exclude)
    .map((entry) => entry.value);
  nextState.valueTooltip = formatVariableTooltipList(
    nextState.valueItems.map((item) => String(item).trim()).filter(Boolean),
    nextState.valueCount,
  );
  nextState.valueLabel = formatVariableValueCountLabel(
    nextState.type,
    nextState.valueCount,
    nextState,
  );
  nextState.updatedAt = getCurrentVariableTimestamp();
  if (!String(nextState.createdAt || "").trim()) {
    nextState.createdAt = nextState.updatedAt;
  }
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
      title="${deleteAllowed ? "Delete variable" : "Remove linked rules, variables, and projects before deleting this variable."}"
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
  syncVariableTableRowFromDraft();
}

function setVariableDrawerType(value) {
  if (drawerVariant !== "variables" || !suricataDrawerDraft) return;
  suricataDrawerDraft.type = normalizeVariableType(value);
  suricataDrawerDraft.valueEntries = (suricataDrawerDraft.valueEntries || []).filter(
    (e) => e.kind !== "literal",
  );
  variableDrawerTypeChangePending = null;
  renderSuricataDrawerContent();
  syncVariableTableRowFromDraft();
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
  if (!suricataDrawerDraft) return;
  const newType = normalizeVariableType(value);
  const hasLiterals = (suricataDrawerDraft.valueEntries || []).some((e) => e.kind === "literal");
  if (hasLiterals && newType !== suricataDrawerDraft.type) {
    variableDrawerTypeChangePending = newType;
    renderSuricataDrawerContent();
    return;
  }
  setVariableDrawerType(value);
}

function confirmVariableTypeChange() {
  if (!variableDrawerTypeChangePending) return;
  setVariableDrawerType(variableDrawerTypeChangePending);
}

function cancelVariableTypeChange() {
  variableDrawerTypeChangePending = null;
  renderSuricataDrawerContent();
}

function renderVariableDrawerTypeControl(state) {
  if (variableDrawerTypeChangePending) {
    const literalCount = (state.valueEntries || []).filter((e) => e.kind === "literal").length;
    const noun = literalCount === 1 ? "value" : "values";
    return `
      <div class="variable-type-change-confirm">
        <span class="variable-type-change-warning">
          ${svgIcon(SURI_ICON_WARNING_SRC, 14)}
          Changing to <strong>${escapeHtml(variableDrawerTypeChangePending)}</strong> will clear ${literalCount} ${noun}. Continue?
        </span>
        <span class="variable-type-change-actions">
          <button type="button" class="btn-reset btn-secondary size-s style-outline" onclick="confirmVariableTypeChange()">Change &amp; Clear</button>
          <button type="button" class="btn-reset btn-secondary size-s style-outline" onclick="cancelVariableTypeChange()">Cancel</button>
        </span>
      </div>
    `;
  }
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
    <div class="suri-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
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
  const count = getVariableUsedByCount(state);
  const label = formatVariableMetricCountLabel(count, "Rule");
  const tooltipText = formatVariableTooltipList(getVariableUsedByItems(state), count);
  if (!count) return `<button type="button" class="variable-usedby-link is-empty" disabled>${escapeHtml(label)}</button>`;
  return `<button type="button" class="variable-usedby-link"${getTooltipAttributes(tooltipText, { scrollable: count > 8 })}>${escapeHtml(label)}</button>`;
}

function renderVariableDrawerReferencedByLink(state) {
  const count = Math.max(0, Number(state.referencedBy || state.references || 0));
  const items = Array.isArray(state.referencedByItems) ? state.referencedByItems : [];
  const label = count === 0 ? "No Variables" : formatVariableMetricCountLabel(count, "Variable");
  const tooltipText = count > 0 ? formatVariableTooltipList(items, count) : "";
  if (!count) return `<button type="button" class="variable-usedby-link is-empty" disabled>${escapeHtml(label)}</button>`;
  return `<button type="button" class="variable-usedby-link"${tooltipText ? getTooltipAttributes(tooltipText, { scrollable: count > 8 }) : ""}>${escapeHtml(label)}</button>`;
}

function setVariableDrawerDescription(value) {
  if (drawerVariant !== "variables" || !suricataDrawerDraft) return;
  suricataDrawerDraft.description = String(value || "");
}

function getVariableValueSuggestionPool(type) {
  const pool = new Set();
  ruleVariableRows.forEach((row) => {
    getVariableLiteralItems(row).forEach((item) => {
      const normalized = String(item || "").replace(/^!/, "").trim();
      if (!normalized) return;
      const rowType = inferVariableType(row);
      if (!type || rowType === type) {
        pool.add(normalized);
      }
    });
  });
  return Array.from(pool).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function getVariableDrawerSuggestions(state) {
  const rawQuery = String(variableDrawerUiState.query || "").trim();
  const term = rawQuery.toLowerCase();
  const entryLookup = new Map();
  (state.valueEntries || []).forEach((entry) => {
    entryLookup.set(`${entry.kind}:${entry.value}`, entry.exclude ? "exclude" : "include");
  });
  const variableSuggestions = ruleVariableRows
    .map((row) => row.name)
    .filter((name) => name !== state.name)
    .filter((name) => !term || name.toLowerCase().includes(term))
    .map((name) => ({
      kind: "variable",
      value: name,
      label: name,
      create: false,
      selectionMode: entryLookup.get(`variable:${name}`) || "",
    }));
  const literalSuggestions = getVariableValueSuggestionPool(state.type)
    .filter((value) => !term || value.toLowerCase().includes(term))
    .map((value) => ({
      kind: "literal",
      value,
      label: value,
      create: false,
      selectionMode: entryLookup.get(`literal:${value}`) || "",
    }));
  const exactMatch = literalSuggestions.some((item) => item.value.toLowerCase() === term);
  if (!exactMatch) {
    literalSuggestions.unshift({
      kind: "literal",
      value: rawQuery,
      label: `Add: ${rawQuery}`,
      create: true,
      selectionMode: "",
    });
  }
  return [...variableSuggestions, ...literalSuggestions];
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
  if (!editMode) return "";
  const suggestions = getVariableDrawerSuggestions(state);
  if (!suggestions.length) return "";
  return `
    <div class="suri-scope-suggestion-panel" role="listbox">
      <div class="suri-scope-suggestion-list">
        ${suggestions.map((suggestion) => {
          const includeAction = `selectVariableValueSuggestion(event, '${suggestion.kind}', '${escapeJsSingleQuoted(suggestion.value)}', false)`;
          const excludeAction = `selectVariableValueSuggestion(event, '${suggestion.kind}', '${escapeJsSingleQuoted(suggestion.value)}', true)`;
          if (suggestion.create) {
            return `
              <div class="menu-item menu-item-cta suri-scope-suggestion-item suri-scope-suggestion-create has-mode-actions">
                <span class="value">
                  <img class="suri-scope-suggestion-icon" src="${SURI_ICON_ADD_SRC}" alt="" aria-hidden="true" />
                  <span>${escapeHtml(suggestion.label)}</span>
                </span>
                <span class="suri-option-tail">${renderMenuItemModeButtons(includeAction, excludeAction, "")}</span>
              </div>
            `;
          }
          return `
            <div class="menu-item menu-item-cta suri-scope-suggestion-item has-mode-actions${suggestion.selectionMode ? ` is-selected is-${suggestion.selectionMode}` : ""}">
              <span class="value">${escapeHtml(suggestion.label)}</span>
              <span class="suri-option-tail">${renderMenuItemModeButtons(includeAction, excludeAction, suggestion.selectionMode)}</span>
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
  const helperUnit = inferVariableValueUnit(state, state.type).toLowerCase();
  const helperArticle = /^[aeiou]/i.test(helperUnit) ? "an" : "a";
  const helperText = `Type ${helperArticle} ${helperUnit} or variable name to search`;
  return `
    <div class="suri-scope-input-shell variable-values-shell" data-variable-values-shell>
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
              onfocus="syncVariableValueSuggestions()"
              onkeydown="onVariableValueInputKeydown(event)"
            />
          </div>
        `
            : ""
        }
      </div>
      ${editMode ? `<div class="suri-scope-suggestion-anchor variable-values-suggestion-anchor" data-variable-values-suggestions>${renderVariableDrawerSuggestions(state)}</div>` : ""}
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
  const valuesLabel = `${state.type} Values`;
  const valuesBody = renderSuricataRow(valuesLabel, renderVariableValuesEditor(state), {
    info: true,
    className: "is-inline-editor is-variable-values-row",
  });
  const descriptionRight = editMode
    ? `<textarea class="drawer-description-input variable-description-input" oninput="setVariableDrawerDescription(this.value)" placeholder="Add a description...">${escapeHtml(state.description || "")}</textarea>`
    : (state.description
        ? `<div class="drawer-description-text">${escapeHtml(state.description)}</div>`
        : renderSuricataValue("—"));

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
      renderSuricataRow("Description", descriptionRight, { className: "is-variable-description-row" }),
    ].join("")}</div></section>`,
    `<div class="variable-drawer-meta-row">${[
      `<section class="card suri-card"><div class="card-body suri-card-body">${[
        renderSuricataRow("Updated", renderVariableTimestampButton(state.updatedAt, "Updated")),
        renderSuricataRow("Editor", renderSuricataValue(state.editor || "—")),
        renderSuricataRow("Used By", renderVariableDrawerUsedByLink(state)),
      ].join("")}</div></section>`,
      `<section class="card suri-card"><div class="card-body suri-card-body">${[
        renderSuricataRow("Created", renderVariableTimestampButton(state.createdAt, "Created")),
        renderSuricataRow("Author", renderSuricataValue(state.author || "—")),
        renderSuricataRow("Referenced By", renderVariableDrawerReferencedByLink(state)),
      ].join("")}</div></section>`,
    ].join("")}</div>`,
    `<section class="card suri-card"><div class="card-body suri-card-body">${valuesBody}</div></section>`,
  ].join("");
  requestAnimationFrame(() => {
    syncVariableDrawerMenu();
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
  if (!editMode || drawerVariant !== "variables") return;
  requestAnimationFrame(() => {
    const input = document.querySelector("[data-variable-value-input]");
    if (!input) return;
    const cursorPosition = keepSelection
      ? String(variableDrawerUiState.query || "").length
      : 0;
    focusTextFieldWithoutScroll(input, cursorPosition);
  });
}

function syncVariableValueSuggestions() {
  const anchor = document.querySelector("[data-variable-values-suggestions]");
  if (!anchor || !suricataDrawerDraft) return;
  anchor.innerHTML = renderVariableDrawerSuggestions(suricataDrawerDraft);
}

function focusVariableValueInput(event) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "variables") return;
  const input = document.querySelector("[data-variable-value-input]");
  if (!input) return;
  focusTextFieldWithoutScroll(input, input.value.length);
}

function setVariableValueQuery(value) {
  if (!editMode || drawerVariant !== "variables") return;
  variableDrawerUiState.query = value;
  syncVariableValueSuggestions();
}

function addVariableDrawerEntry(entry) {
  if (!editMode || drawerVariant !== "variables" || !suricataDrawerDraft) return;
  const nextEntry = {
    kind: entry.kind === "variable" ? "variable" : "literal",
    value: String(entry.value || "").trim(),
    exclude: Boolean(entry.exclude),
  };
  if (!nextEntry.value) return;
  const sameToken = `${nextEntry.kind}:${nextEntry.exclude ? "exclude" : "include"}:${nextEntry.value}`;
  const existingTokens = new Set(
    (suricataDrawerDraft.valueEntries || []).map(
      (item) => `${item.kind}:${item.exclude ? "exclude" : "include"}:${item.value}`,
    ),
  );
  const withoutThisValue = (suricataDrawerDraft.valueEntries || []).filter(
    (item) => !(item.kind === nextEntry.kind && item.value === nextEntry.value),
  );
  if (existingTokens.has(sameToken)) {
    suricataDrawerDraft.valueEntries = withoutThisValue;
  } else {
    suricataDrawerDraft.valueEntries = [...withoutThisValue, nextEntry];
  }
  variableDrawerUiState.query = "";
  variableDrawerUiState.suggestionsOpen = false;
  renderSuricataDrawerContent();
  syncVariableTableRowFromDraft();
  restoreVariableValueInputFocus(false);
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
  syncVariableTableRowFromDraft();
  restoreVariableValueInputFocus(false);
}

function commitVariableValueQuery() {
  if (!editMode || drawerVariant !== "variables") return;
  const rawQuery = String(variableDrawerUiState.query || "").trim();
  if (!rawQuery) return;
  addVariableDrawerEntry({ kind: "literal", value: rawQuery, exclude: false });
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
    document.querySelector("[data-variable-value-input]")?.blur();
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
    syncVariableTableRowFromDraft();
    restoreVariableValueInputFocus(false);
  }
}

function closeVariableValueMenu() {
  if (drawerVariant === "variables") {
    const input = document.querySelector("[data-variable-value-input]");
    if (input && document.activeElement === input) {
      input.blur();
      return;
    }
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
  if (typeof setRuleViewState === "function") setRuleViewState("drawer");
  drawerVariant = "variables";
  suricataDrawerBaseline = buildVariableDrawerState(variable);
  suricataDrawerDraft = cloneDrawerState(suricataDrawerBaseline);
  variableAccordionState = { ...VARIABLE_ACCORDION_DEFAULT_STATE };
  resetVariableDrawerUiState();
  variableDrawerUiState.isNew = false;
  suricataOpenMenuKey = null;
  editMode = options.startEditing !== false;
  document.getElementById("drawerTitle").textContent = variable.name;
  if (typeof syncRuleViewChrome === "function") syncRuleViewChrome();
  syncDrawerHeaderActions();
  renderSuricataDrawerContent();
  renderRules();
  syncVariableDrawerMenu();
}

function openNewVariableDrawer() {
  const draft = buildVariableDrawerState({
    name: `NEW_VAR_${ruleVariableRows.length + 1}`,
    type: "Port",
    valueCount: 0,
    usedByRules: 0,
    usedByAlerts: 0,
    usedByRuleItems: [],
    referencedBy: 0,
    references: 0,
    referencedByItems: [],
    projects: 0,
    projectItems: [],
    referenceItems: [],
    valueItems: [],
    valueTooltip: "",
    tags: [],
    historyRows: [],
    createdAt: getCurrentVariableTimestamp(),
    updatedAt: getCurrentVariableTimestamp(),
    description: "",
    author: VARIABLE_HISTORY_ACTORS[1] || "",
    editor: VARIABLE_HISTORY_ACTORS[1] || "",
  });
  selectedVariableRowIndex = null;
  if (typeof setRuleViewState === "function") setRuleViewState("drawer");
  drawerVariant = "variables";
  suricataDrawerBaseline = cloneDrawerState(draft);
  suricataDrawerDraft = cloneDrawerState(draft);
  variableAccordionState = { ...VARIABLE_ACCORDION_DEFAULT_STATE };
  resetVariableDrawerUiState();
  variableDrawerUiState.isNew = true;
  suricataOpenMenuKey = null;
  editMode = true;
  document.getElementById("drawerTitle").textContent = draft.name;
  if (typeof syncRuleViewChrome === "function") syncRuleViewChrome();
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
    ruleVariableBaselineRows = deriveVariableReferenceState([
      ...ruleVariableBaselineRows,
      cloneDrawerState(sanitized),
    ]);
    ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
    selectedVariableRowIndex = ruleVariableRows.length - 1;
    variableDrawerUiState.isNew = false;
  } else {
    ruleVariableBaselineRows[selectedVariableRowIndex] = cloneDrawerState(sanitized);
    ruleVariableBaselineRows = deriveVariableReferenceState(ruleVariableBaselineRows);
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
    showToast("Remove linked rules, variables, and projects before deleting this variable");
    return;
  }
  ruleVariableBaselineRows.splice(selectedVariableRowIndex, 1);
  ruleVariableBaselineRows = deriveVariableReferenceState(ruleVariableBaselineRows);
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
    showToast("Remove linked rules, variables, and projects before deleting this variable");
    return;
  }
  ruleVariableBaselineRows.splice(index, 1);
  ruleVariableBaselineRows = deriveVariableReferenceState(ruleVariableBaselineRows);
  ruleVariableRows = cloneDrawerState(ruleVariableBaselineRows);
  syncSharedVariableRows();
  if (selectedVariableRowIndex === index) {
    closeDrawer();
  }
  renderRules();
}
