/* Rule Scope runtime for the alerting modal. */

const SURICATA_PROJECT_SUBNET_OPTIONS = [
  { cidr: "192.168.10.0/24", count: 38 },
  { cidr: "192.168.20.0/24", count: 17 },
  { cidr: "192.168.30.0/24", count: 51 },
  { cidr: "192.168.40.0/24", count: 24 },
  { cidr: "192.168.50.0/24", count: 64 },
  { cidr: "192.168.60.0/24", count: 29 },
  { cidr: "10.10.4.0/24", count: 72 },
  { cidr: "10.10.8.0/24", count: 42 },
  { cidr: "10.10.12.0/24", count: 35 },
  { cidr: "10.10.16.0/24", count: 11 },
  { cidr: "10.10.20.0/24", count: 88 },
  { cidr: "10.10.24.0/24", count: 14 },
  { cidr: "10.11.0.0/24", count: 27 },
  { cidr: "10.11.4.0/24", count: 9 },
  { cidr: "10.11.8.0/24", count: 31 },
  { cidr: "10.12.0.0/24", count: 56 },
  { cidr: "10.12.4.0/24", count: 22 },
  { cidr: "10.12.8.0/24", count: 47 },
  { cidr: "10.12.12.0/24", count: 18 },
  { cidr: "10.20.0.0/24", count: 95 },
  { cidr: "10.20.4.0/24", count: 43 },
  { cidr: "10.20.8.0/24", count: 52 },
  { cidr: "10.20.12.0/24", count: 25 },
  { cidr: "10.20.16.0/24", count: 6 },
  { cidr: "10.66.19.0/24", count: 33 },
  { cidr: "10.99.0.0/16", count: 12 },
  { cidr: "172.16.8.0/24", count: 28 },
  { cidr: "172.16.12.0/24", count: 15 },
  { cidr: "172.18.31.0/24", count: 112 },
  { cidr: "172.20.9.0/24", count: 20 },
  { cidr: "172.22.44.0/24", count: 5 },
  { cidr: "172.24.7.0/24", count: 49 },
  { cidr: "172.26.18.0/24", count: 7 },
  { cidr: "172.31.200.0/24", count: 16 },
  { cidr: "198.18.12.0/23", count: 3 },
  { cidr: "100.64.10.0/24", count: 8 },
  { cidr: "100.64.20.0/24", count: 4 },
  { cidr: "203.0.113.0/24", count: 2 },
  { cidr: "198.51.100.0/24", count: 1 },
];
let suricataProjectSubnetOptions = SURICATA_PROJECT_SUBNET_OPTIONS.map(
  (option) => ({ ...option }),
);
const SURICATA_SUBNET_VARIABLE_OPTIONS = [
  { name: "HOME_NET", count: 38 },
  { name: "EXTERNAL_NET", count: 38 },
  { name: "DNS_SERVERS", count: 1 },
  { name: "HTTPS_SERVERS", count: 5 },
  { name: "DMZ_NET", count: 7 },
];
const SURICATA_RULE_PORT_VARIABLE_OPTIONS = [
  { name: "HOME_PORTS", meta: "12 Ports" },
  { name: "HTTP_PORTS", meta: "12 Ports" },
  { name: "HTTPS_PORTS", meta: "12 Ports" },
  { name: "SSH_PORTS", meta: "4 Ports" },
  { name: "DB_PORTS", meta: "6 Ports" },
  { name: "OT_CONTROL_PORTS", meta: "9 Ports" },
];
const SURICATA_PROJECT_PORT_OPTIONS = [
  { token: "80", meta: "HTTP" },
  { token: "443", meta: "HTTPS" },
  { token: "22", meta: "SSH" },
  { token: "25", meta: "SMTP" },
  { token: "3389", meta: "RDP" },
  { token: "502", meta: "Modbus" },
  { token: "47808", meta: "BACnet" },
  { token: "1024:65535", meta: "Ephemeral" },
];
let suricataProjectPortOptions = SURICATA_PROJECT_PORT_OPTIONS.map((option) => ({
  ...option,
}));

let suricataSubnetUiState = {
  sourceSubnets: {
    search: "",
    manualInput: "",
    activeMode: "include",
    itemModes: {},
    activeSource: "project",
    projectTop: 0,
    chipTop: 0,
    projectAtTop: true,
    projectAtBottom: false,
    jumpSyncRaf: 0,
  },
  destinationSubnets: {
    search: "",
    manualInput: "",
    activeMode: "include",
    itemModes: {},
    activeSource: "project",
    projectTop: 0,
    chipTop: 0,
    projectAtTop: true,
    projectAtBottom: false,
    jumpSyncRaf: 0,
  },
};
let suricataPortUiState = {
  sourcePorts: {
    search: "",
    manualInput: "",
    activeMode: "include",
    itemModes: {},
    activeSource: "project",
  },
  destinationPorts: {
    search: "",
    manualInput: "",
    activeMode: "include",
    itemModes: {},
    activeSource: "project",
  },
};

function resetSuricataSubnetUiState() {
  Object.values(suricataSubnetUiState).forEach((state) => {
    if (state && state.jumpSyncRaf) {
      cancelAnimationFrame(state.jumpSyncRaf);
    }
  });
  suricataSubnetUiState = {
    sourceSubnets: {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
      projectTop: 0,
      chipTop: 0,
      projectAtTop: true,
      projectAtBottom: false,
      jumpSyncRaf: 0,
    },
    destinationSubnets: {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
      projectTop: 0,
      chipTop: 0,
      projectAtTop: true,
      projectAtBottom: false,
      jumpSyncRaf: 0,
    },
  };
  suricataPortUiState = {
    sourcePorts: {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
    },
    destinationPorts: {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
    },
  };
  if (typeof resetSimpleMenuSelectionScrollState === "function") {
    resetSimpleMenuSelectionScrollState();
  }
}

function getSuricataSubnetUiState(field) {
  if (!suricataSubnetUiState[field]) {
    suricataSubnetUiState[field] = {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
      projectTop: 0,
      chipTop: 0,
      projectAtTop: true,
      projectAtBottom: false,
      jumpSyncRaf: 0,
    };
  }
  if (suricataSubnetUiState[field].activeMode !== "exclude") {
    suricataSubnetUiState[field].activeMode = "include";
  }
  if (!suricataSubnetUiState[field].itemModes || typeof suricataSubnetUiState[field].itemModes !== "object") {
    suricataSubnetUiState[field].itemModes = {};
  }
  if (suricataSubnetUiState[field].activeSource !== "variable") {
    suricataSubnetUiState[field].activeSource = "project";
  }
  return suricataSubnetUiState[field];
}

function getSuricataPortUiState(field) {
  if (!suricataPortUiState[field]) {
    suricataPortUiState[field] = {
      search: "",
      manualInput: "",
      activeMode: "include",
      itemModes: {},
      activeSource: "project",
    };
  }
  if (suricataPortUiState[field].activeMode !== "exclude") {
    suricataPortUiState[field].activeMode = "include";
  }
  if (!suricataPortUiState[field].itemModes || typeof suricataPortUiState[field].itemModes !== "object") {
    suricataPortUiState[field].itemModes = {};
  }
  if (suricataPortUiState[field].activeSource !== "variable") {
    suricataPortUiState[field].activeSource = "project";
  }
  return suricataPortUiState[field];
}

function normalizeSuricataSubnetSelection(selection) {
  const value = selection && typeof selection === "object" ? selection : {};
  const includeVariables = [
    ...new Set(
      Array.isArray(value.includeVariables)
        ? value.includeVariables
        : value.mode === "exclude"
          ? []
          : Array.isArray(value.variables)
            ? value.variables
            : [],
    ),
  ];
  const excludeVariables = [
    ...new Set(
      Array.isArray(value.excludeVariables)
        ? value.excludeVariables
        : value.mode === "exclude"
          ? Array.isArray(value.variables)
            ? value.variables
            : []
          : [],
    ),
  ];
  const mode = value.mode === "exclude" ? "exclude" : "include";
  const includeChecked = [
    ...new Set(
      Array.isArray(value.includeChecked)
        ? value.includeChecked
        : mode === "include"
          ? Array.isArray(value.checked)
            ? value.checked
            : []
          : [],
    ),
  ];
  const excludeChecked = [
    ...new Set(
      Array.isArray(value.excludeChecked)
        ? value.excludeChecked
        : mode === "exclude"
          ? Array.isArray(value.checked)
            ? value.checked
            : []
          : [],
    ),
  ];
  const includeManual = [
    ...new Set(
      Array.isArray(value.includeManual)
        ? value.includeManual
        : mode === "include"
          ? Array.isArray(value.manual)
            ? value.manual
            : []
          : [],
    ),
  ];
  const excludeManual = [
    ...new Set(
      Array.isArray(value.excludeManual)
        ? value.excludeManual
        : mode === "exclude"
          ? Array.isArray(value.manual)
            ? value.manual
            : []
          : [],
    ),
  ];
  const entryOrder = normalizeScopeEntryOrder(value, {
    includeVariables,
    excludeVariables,
    includeChecked,
    excludeChecked,
    includeManual,
    excludeManual,
  });
  return {
    mode,
    variables:
      mode === "exclude" ? [...excludeVariables] : [...includeVariables],
    includeVariables,
    excludeVariables,
    includeChecked,
    excludeChecked,
    includeManual,
    excludeManual,
    entryOrder,
    checked: mode === "exclude" ? [...excludeChecked] : [...includeChecked],
    manual: mode === "exclude" ? [...excludeManual] : [...includeManual],
  };
}

function normalizeSuricataPortSelection(selection) {
  const value = selection && typeof selection === "object" ? selection : {};
  const includeVariables = [
    ...new Set(
      Array.isArray(value.includeVariables)
        ? value.includeVariables
        : value.mode === "exclude"
          ? []
          : Array.isArray(value.variables)
            ? value.variables
            : [],
    ),
  ];
  const excludeVariables = [
    ...new Set(
      Array.isArray(value.excludeVariables)
        ? value.excludeVariables
        : value.mode === "exclude"
          ? Array.isArray(value.variables)
            ? value.variables
            : []
          : [],
    ),
  ];
  const mode = value.mode === "exclude" ? "exclude" : "include";
  const includeChecked = [
    ...new Set(
      Array.isArray(value.includeChecked)
        ? value.includeChecked
        : mode === "include"
          ? Array.isArray(value.checked)
            ? value.checked
            : []
          : [],
    ),
  ];
  const excludeChecked = [
    ...new Set(
      Array.isArray(value.excludeChecked)
        ? value.excludeChecked
        : mode === "exclude"
          ? Array.isArray(value.checked)
            ? value.checked
            : []
          : [],
    ),
  ];
  const includeManual = [
    ...new Set(
      Array.isArray(value.includeManual)
        ? value.includeManual
        : mode === "include"
          ? Array.isArray(value.manual)
            ? value.manual
            : []
          : [],
    ),
  ];
  const excludeManual = [
    ...new Set(
      Array.isArray(value.excludeManual)
        ? value.excludeManual
        : mode === "exclude"
          ? Array.isArray(value.manual)
            ? value.manual
            : []
          : [],
    ),
  ];
  const entryOrder = normalizeScopeEntryOrder(value, {
    includeVariables,
    excludeVariables,
    includeChecked,
    excludeChecked,
    includeManual,
    excludeManual,
  });
  return {
    mode,
    variables:
      mode === "exclude" ? [...excludeVariables] : [...includeVariables],
    includeVariables,
    excludeVariables,
    includeChecked,
    excludeChecked,
    includeManual,
    excludeManual,
    entryOrder,
    checked: mode === "exclude" ? [...excludeChecked] : [...includeChecked],
    manual: mode === "exclude" ? [...excludeManual] : [...includeManual],
  };
}

function getScopeEntryOrderKey(bucket, value) {
  return `${bucket}::${String(value ?? "").toLowerCase()}`;
}

function normalizeScopeEntryOrder(rawValue, buckets) {
  const activeKeys = [
    ...buckets.includeVariables.map((value) =>
      getScopeEntryOrderKey("variable", value)
    ),
    ...buckets.excludeVariables.map((value) =>
      getScopeEntryOrderKey("variable", value)
    ),
    ...buckets.includeChecked.map((value) =>
      getScopeEntryOrderKey("project", value)
    ),
    ...buckets.excludeChecked.map((value) =>
      getScopeEntryOrderKey("project", value)
    ),
    ...buckets.includeManual.map((value) =>
      getScopeEntryOrderKey("manual", value)
    ),
    ...buckets.excludeManual.map((value) =>
      getScopeEntryOrderKey("manual", value)
    ),
  ];
  const activeKeySet = new Set(activeKeys);
  const rawOrder = Array.isArray(rawValue.entryOrder)
    ? rawValue.entryOrder.filter((entry) => typeof entry === "string")
    : [];
  const entryOrder = [];
  rawOrder.forEach((entry) => {
    if (!activeKeySet.has(entry) || entryOrder.includes(entry)) return;
    entryOrder.push(entry);
  });
  activeKeys.forEach((entry) => {
    if (entryOrder.includes(entry)) return;
    entryOrder.push(entry);
  });
  return entryOrder;
}

function getSuricataSubnetSelection(state, field) {
  return normalizeSuricataSubnetSelection(state?.subnetFilters?.[field]);
}

function getSuricataPortSelection(state, field) {
  return normalizeSuricataPortSelection(state?.portFilters?.[field]);
}

function setSuricataSubnetSelection(field, nextSelection) {
  if (!editMode || !suricataDrawerDraft?.subnetFilters) return;
  suricataDrawerDraft.subnetFilters[field] =
    normalizeSuricataSubnetSelection(nextSelection);
}

function setSuricataPortSelection(field, nextSelection) {
  if (!editMode || !suricataDrawerDraft?.portFilters) return;
  suricataDrawerDraft.portFilters[field] =
    normalizeSuricataPortSelection(nextSelection);
}

function cidrIsValid(value) {
  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{1,3}\.){3}\d{1,3}\/(\d|[12]\d|3[0-2])$/);
  if (!match) return false;
  const [ip] = text.split("/");
  return ip
    .split(".")
    .every((segment) => Number(segment) >= 0 && Number(segment) <= 255);
}

function portTokenIsValid(value) {
  const text = String(value ?? "").trim();
  if (!text) return false;
  if (/^\d{1,5}$/.test(text)) {
    return Number(text) >= 0 && Number(text) <= 65535;
  }
  const rangeMatch = text.match(/^(\d{1,5}):(\d{1,5})$/);
  if (!rangeMatch) return false;
  const start = Number(rangeMatch[1]);
  const end = Number(rangeMatch[2]);
  return start >= 0 && end <= 65535 && start <= end;
}

function getScopeVariableOptions(kind) {
  const staticOptions =
    kind === "subnet"
      ? SURICATA_SUBNET_VARIABLE_OPTIONS.map((option) => ({
          name: option.name,
          meta: String(option.count),
        }))
      : SURICATA_RULE_PORT_VARIABLE_OPTIONS.map((option) => ({
          name: option.name,
          meta: option.meta,
        }));
  const sharedRows = Array.isArray(window.TeleseerAppData?.alerting?.variables)
    ? window.TeleseerAppData.alerting.variables
    : [];
  const dynamicOptions = sharedRows
    .filter((row) => {
      const name = String(row?.name || "").trim();
      if (!name) return false;
      const isPortVariable = /PORT/i.test(name);
      return kind === "port" ? isPortVariable : !isPortVariable;
    })
    .map((row) => ({
      name: String(row.name || "").trim(),
      meta: String(row.valueLabel || row.valueTooltip || row.references || ""),
    }));
  const seen = new Set();
  return [...staticOptions, ...dynamicOptions].filter((option) => {
    const key = String(option?.name || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getScopeUiState(field, kind) {
  return kind === "subnet"
    ? getSuricataSubnetUiState(field)
    : getSuricataPortUiState(field);
}

function getScopeSelection(state, field, kind) {
  return kind === "subnet"
    ? getSuricataSubnetSelection(state, field)
    : getSuricataPortSelection(state, field);
}

function setScopeSelection(field, kind, nextSelection) {
  if (kind === "subnet") {
    setSuricataSubnetSelection(field, nextSelection);
    return;
  }
  setSuricataPortSelection(field, nextSelection);
}

function getScopeProjectOptions(kind) {
  if (kind === "subnet") {
    return suricataProjectSubnetOptions.map((option) => ({
      value: option.cidr,
      meta: String(option.count),
    }));
  }
  return suricataProjectPortOptions.map((option) => ({
    value: option.token,
    meta: option.meta,
  }));
}

function getScopeBucketKeys(bucket) {
  if (bucket === "variable") {
    return { include: "includeVariables", exclude: "excludeVariables" };
  }
  if (bucket === "project") {
    return { include: "includeChecked", exclude: "excludeChecked" };
  }
  return { include: "includeManual", exclude: "excludeManual" };
}

function getScopeBucketState(selection, bucket, value) {
  const keys = getScopeBucketKeys(bucket);
  if (selection[keys.exclude].includes(value)) return "exclude";
  if (selection[keys.include].includes(value)) return "include";
  return "";
}

function getScopeItemModeKey(type, value) {
  return `${type}:${value}`;
}

function getScopePendingMode(field, kind, type, value, selection = null) {
  const resolvedSelection =
    selection || getScopeSelection(suricataDrawerDraft, field, kind);
  const bucket = type === "variable" ? "variable" : "project";
  const selectedMode = getScopeBucketState(resolvedSelection, bucket, value);
  if (selectedMode) return selectedMode;
  const uiState = getScopeUiState(field, kind);
  const key = getScopeItemModeKey(type, value);
  return uiState.itemModes?.[key] === "exclude" ? "exclude" : "include";
}

function setScopePendingMode(field, kind, type, value, mode) {
  const uiState = getScopeUiState(field, kind);
  const key = getScopeItemModeKey(type, value);
  uiState.itemModes[key] = mode === "exclude" ? "exclude" : "include";
}

function getScopeBucketTotal(selection, bucket) {
  const keys = getScopeBucketKeys(bucket);
  return selection[keys.include].length + selection[keys.exclude].length;
}

function toggleScopeBucketOption(field, kind, bucket, value, mode) {
  const selection = getScopeSelection(suricataDrawerDraft, field, kind);
  const beforeTotal = getScopeBucketTotal(selection, bucket);
  const keys = getScopeBucketKeys(bucket);
  let includeValues = [...selection[keys.include]];
  let excludeValues = [...selection[keys.exclude]];
  const orderKey = getScopeEntryOrderKey(bucket, value);
  const entryOrder = Array.isArray(selection.entryOrder)
    ? [...selection.entryOrder]
    : [];
  const existingOrderIndex = entryOrder.indexOf(orderKey);
  if (mode === "exclude") {
    if (excludeValues.includes(value)) {
      excludeValues = excludeValues.filter((entry) => entry !== value);
    } else {
      excludeValues.push(value);
      includeValues = includeValues.filter((entry) => entry !== value);
    }
  } else if (includeValues.includes(value)) {
    includeValues = includeValues.filter((entry) => entry !== value);
  } else {
    includeValues.push(value);
    excludeValues = excludeValues.filter((entry) => entry !== value);
  }
  const stillActive =
    includeValues.includes(value) || excludeValues.includes(value);
  if (stillActive) {
    if (existingOrderIndex === -1) entryOrder.push(orderKey);
  } else if (existingOrderIndex !== -1) {
    entryOrder.splice(existingOrderIndex, 1);
  }
  setScopeSelection(field, kind, {
    ...selection,
    mode,
    [keys.include]: includeValues,
    [keys.exclude]: excludeValues,
    entryOrder,
  });
  const afterTotal = includeValues.length + excludeValues.length;
  if (
    afterTotal > beforeTotal &&
    document.querySelector(
      `[data-simple-selection-key="${getScopeSimpleSelectionKey(field, kind)}"]`,
    )
  ) {
    markSimpleMenuSelectionSnapToBottom(
      getScopeSimpleSelectionKey(field, kind),
    );
  }
}

function removeScopeBucketOption(field, kind, bucket, value) {
  const selection = getScopeSelection(suricataDrawerDraft, field, kind);
  const keys = getScopeBucketKeys(bucket);
  const orderKey = getScopeEntryOrderKey(bucket, value);
  const entryOrder = Array.isArray(selection.entryOrder)
    ? selection.entryOrder.filter((entry) => entry !== orderKey)
    : [];
  setScopeSelection(field, kind, {
    ...selection,
    [keys.include]: selection[keys.include].filter((entry) => entry !== value),
    [keys.exclude]: selection[keys.exclude].filter((entry) => entry !== value),
    entryOrder,
  });
}

function getScopeSelectedLookup(selection) {
  return new Set(
    [
      ...selection.includeVariables,
      ...selection.excludeVariables,
      ...selection.includeChecked,
      ...selection.excludeChecked,
      ...selection.includeManual,
      ...selection.excludeManual,
    ].map((value) => String(value).toLowerCase()),
  );
}

function parseScopeTypedToken(rawValue, fallbackMode) {
  const fallback = fallbackMode === "exclude" ? "exclude" : "include";
  const text = String(rawValue ?? "").trim();
  if (!text) return { mode: fallback, value: "" };
  if (text.startsWith("!")) {
    return {
      mode: "exclude",
      value: text.slice(1).trim(),
    };
  }
  return { mode: fallback, value: text };
}

function getScopeChildLabels(kind) {
  if (kind === "subnet") {
    return {
      variable: "Subnet Variables",
      project: "Project Subnets",
    };
  }
  return {
    variable: "Rule Variables",
    project: "Project Ports",
  };
}

function getScopeSourceLabels(kind) {
  return {
    project: kind === "subnet" ? "Subnets" : "Ports",
    variable: "Variables",
  };
}

function getScopeMenuKey(field, kind, menuType = "picker") {
  return `scope:${kind}:${field}:${menuType}`;
}

function getScopeSimpleSelectionKey(field, kind) {
  return `scope-${field}-${kind}`;
}

function syncSuricataMenus() {
  const menus = document.querySelectorAll(".suri-menu[data-menu-key]");
  menus.forEach((menu) => {
    const menuKey = menu.getAttribute("data-menu-key") || "";
    const isOpen = suricataOpenMenuKey === menuKey;
    menu.classList.toggle("is-open", isOpen);
    const trigger = menu.querySelector(".suri-madlib-trigger, .suri-menu-trigger");
    if (trigger) {
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  });
}

function toggleSuricataMenu(event, menuKey) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  suricataOpenMenuKey = suricataOpenMenuKey === menuKey ? null : menuKey;
  syncSuricataMenus();
  if (!suricataOpenMenuKey) return;
  requestAnimationFrame(() => {
    if (typeof syncSuricataMenuPanelPosition === "function") {
      syncSuricataMenuPanelPosition(menuKey);
    }
    const menu = document.querySelector(`.suri-menu[data-menu-key="${menuKey}"]`);
    const input = menu?.querySelector(".suri-subnet-search input");
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function closeSuricataMenu() {
  if (suricataOpenMenuKey === null) return;
  suricataOpenMenuKey = null;
  syncSuricataMenus();
}

function addProjectSubnetOption(cidr) {
  const candidate = String(cidr ?? "").trim();
  if (!cidrIsValid(candidate)) return null;
  const existing = suricataProjectSubnetOptions.find(
    (option) => option.cidr.toLowerCase() === candidate.toLowerCase(),
  );
  if (existing) return existing;
  const customOption = { cidr: candidate, count: "Custom" };
  suricataProjectSubnetOptions.push(customOption);
  return customOption;
}

function addProjectPortOption(token) {
  const candidate = String(token ?? "").trim();
  if (!portTokenIsValid(candidate)) return null;
  const existing = suricataProjectPortOptions.find(
    (option) => option.token.toLowerCase() === candidate.toLowerCase(),
  );
  if (existing) return existing;
  const customOption = { token: candidate, meta: "Custom" };
  suricataProjectPortOptions.push(customOption);
  return customOption;
}

function getScopeManualSuggestions(field, kind, state, rawInputOverride = null, modeOverride = null) {
  const uiState = getScopeUiState(field, kind);
  const parsed = parseScopeTypedToken(
    rawInputOverride === null ? uiState.manualInput : rawInputOverride,
    modeOverride || uiState.activeMode,
  );
  const mode = modeOverride === "exclude"
    ? "exclude"
    : parsed.mode === "exclude"
      ? "exclude"
      : "include";
  const rawValue = parsed.value.trim();
  const showVariables = rawValue.startsWith("$");
  const query = (showVariables ? rawValue.slice(1) : rawValue).trim().toLowerCase();
  const selection = getScopeSelection(state, field, kind);
  const selectedLookup = getScopeSelectedLookup(selection);
  const variableSuggestions = getScopeVariableOptions(kind)
    .filter((option) => {
      const name = option.name.toLowerCase();
      const meta = String(option.meta || "").toLowerCase();
      return (
        (!query || name.includes(query) || meta.includes(query)) &&
        !selectedLookup.has(name)
      );
    })
    .map((option) => ({
      type: "variable",
      value: option.name,
      meta: option.meta,
      mode,
      create: false,
    }));
  const projectSuggestions = getScopeProjectOptions(kind)
    .filter((option) => {
      const value = option.value.toLowerCase();
      const meta = String(option.meta || "").toLowerCase();
      return (
        (!query || value.includes(query) || meta.includes(query)) &&
        !selectedLookup.has(value)
      );
    })
    .map((option) => ({
      type: "project",
      value: option.value,
      meta: option.meta,
      mode,
      create: false,
    }));
  const suggestions = showVariables
    ? [...variableSuggestions]
    : query
      ? [...variableSuggestions, ...projectSuggestions]
      : [...projectSuggestions];
  const exactInProject = getScopeProjectOptions(kind).some(
    (option) => option.value.toLowerCase() === query,
  );
  const validNewValue =
    kind === "subnet" ? cidrIsValid(rawValue) : portTokenIsValid(rawValue);
  if (
    !showVariables &&
    validNewValue &&
    !exactInProject &&
    !selectedLookup.has(rawValue.toLowerCase())
  ) {
    suggestions.unshift({
      type: "addProject",
      value: rawValue,
      label: `Add: ${rawValue}`,
      mode: "include",
      create: true,
    });
  }
  return suggestions;
}

function restoreScopeInputFocus(field, options = {}) {
  const run = () => {
    const input = document.querySelector(`[data-suri-scope-input="${field}"]`);
    if (!input) return;
    const cursorPosition = input.value.length;
    focusTextFieldWithoutScroll(input, cursorPosition);
    revealScopeInputInChipbox(field);
    syncScopeSuggestionAnchor(field);
  };
  if (options.immediate) {
    run();
    return;
  }
  requestAnimationFrame(run);
}

function restoreScopeMenuSearchFocus(field, kind) {
  requestAnimationFrame(() => {
    const menu = document.querySelector(
      `.suri-menu[data-menu-key="${getScopeMenuKey(field, kind)}"]`,
    );
    const input = menu?.querySelector(".suri-subnet-search input");
    if (!input) return;
    const cursorPosition = input.value.length;
    focusTextFieldWithoutScroll(input, cursorPosition);
  });
}

function getScopeInlineHelperText(kind) {
  return kind === "subnet"
    ? 'Type a subnet or variable. Prefix "!" to exclude'
    : 'Type a port or variable. Prefix "!" to exclude';
}

function getScopeMenuSearchPlaceholder(kind) {
  return kind === "subnet"
    ? "Search by subnet or variable"
    : "Search by port or variable";
}

function focusTextFieldWithoutScroll(input, cursorPosition = null) {
  if (!input) return;
  const drawerContent = getDrawerContentEl();
  const drawerScrollTop = drawerContent ? drawerContent.scrollTop : null;
  try {
    input.focus({ preventScroll: true });
  } catch {
    input.focus();
  }
  if (
    cursorPosition !== null &&
    typeof input.setSelectionRange === "function" &&
    !input.readOnly
  ) {
    input.setSelectionRange(cursorPosition, cursorPosition);
  }
  if (drawerContent && drawerScrollTop !== null) {
    drawerContent.scrollTop = drawerScrollTop;
  }
}

function syncScopeManualInputSurface(field, kind, state = suricataDrawerDraft) {
  const shell = document.querySelector(`[data-suri-scope-shell="${field}"]`);
  const indicator = shell?.querySelector(
    `[data-suri-scope-indicator="${field}"]`,
  );
  const input = indicator?.querySelector(`[data-suri-scope-input="${field}"]`);
  const anchor = document.querySelector(
    `[data-suri-scope-suggestions="${field}"]`,
  );
  if (!shell || !indicator || !input || !anchor || !state) return;

  const selection = getScopeSelection(state, field, kind);
  const chips = getScopeAppliedEntries(selection);
  const uiState = getScopeUiState(field, kind);
  const hasTypedInput = String(uiState.manualInput || "").trim().length > 0;
  const showInlineHelp = chips.length === 0 && !hasTypedInput;
  const existingHelp = indicator.querySelector(".suri-scope-inline-help");

  if (showInlineHelp) {
    if (!existingHelp) {
      const helpEl = document.createElement("span");
      helpEl.className = "suri-scope-inline-help";
      helpEl.textContent = getScopeInlineHelperText(kind);
      indicator.insertBefore(helpEl, input);
    } else {
      existingHelp.textContent = getScopeInlineHelperText(kind);
    }
  } else if (existingHelp) {
    existingHelp.remove();
  }

  anchor.innerHTML = renderScopeManualSuggestions(field, kind, state);
}

function replaceScopeManualSuggestionPanel(
  field,
  kind,
  state = suricataDrawerDraft,
  options = {},
) {
  const anchor = document.querySelector(
    `[data-suri-scope-suggestions="${field}"]`,
  );
  if (!anchor) return;
  if (options.stableOpen) {
    anchor.classList.add("is-stable-open");
  }
  anchor.innerHTML = renderScopeManualSuggestions(field, kind, state);
  if (options.stableOpen) {
    requestAnimationFrame(() => {
      anchor.classList.remove("is-stable-open");
    });
  }
}

function renderScopeAppliedChips(field, kind, chips) {
  return chips
    .map(
      (chip) => `
        <span class="suri-subnet-chip project ${chip.mode}">
          ${chip.mode === "exclude" ? '<span class="suri-scope-chip-prefix" aria-hidden="true">!</span>' : ""}
          <span>${escapeHtml(chip.value)}</span>
          <button type="button" class="suri-subnet-chip-remove" onclick="onScopeAppliedChipRemove(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${chip.bucket}', '${escapeJsSingleQuoted(chip.value)}')">
            <span class="svg-icon svg-icon-close-small" aria-hidden="true"></span>
          </button>
        </span>
      `,
    )
    .join("");
}

function syncScopePickerTriggerLabel(field, kind, state = suricataDrawerDraft) {
  const menu = document.querySelector(
    `.suri-menu[data-menu-key="${getScopeMenuKey(field, kind)}"]`,
  );
  const labelEl = menu?.querySelector(".suri-menu-value");
  if (!menu || !labelEl || !state) return;
  const selectedCount = getScopeSelectedCount(getScopeSelection(state, field, kind));
  labelEl.textContent = selectedCount > 0 ? `${selectedCount} Selected` : "Any";
}

function syncScopeAppliedChipSurface(field, kind, state = suricataDrawerDraft) {
  const shell = document.querySelector(`[data-suri-scope-shell="${field}"]`);
  const chipBox = shell?.querySelector(".suri-scope-chipbox");
  const indicator = chipBox?.querySelector(
    `[data-suri-scope-indicator="${field}"]`,
  );
  if (!chipBox || !indicator || !state) return;

  chipBox.querySelectorAll(".suri-subnet-chip").forEach((chip) => chip.remove());
  const selection = getScopeSelection(state, field, kind);
  const chips = getScopeAppliedEntries(selection);
  indicator.insertAdjacentHTML(
    "beforebegin",
    renderScopeAppliedChips(field, kind, chips),
  );
  syncScopePickerTriggerLabel(field, kind, state);
  syncScopeManualInputSurface(field, kind, state);
}

function getScopeSuggestionBoundaryRect(shell) {
  const boundaryEl = shell?.closest(".drawer-content") || shell;
  return boundaryEl?.getBoundingClientRect() || shell?.getBoundingClientRect();
}

function revealScopeInputInChipbox(field) {
  const input = document.querySelector(`[data-suri-scope-input="${field}"]`);
  const chipBox = input?.closest(".suri-scope-chipbox");
  if (!input || !chipBox) return;
  const inputRect = input.getBoundingClientRect();
  const chipBoxRect = chipBox.getBoundingClientRect();
  const nextTop = inputRect.top - chipBoxRect.top + chipBox.scrollTop;
  const nextBottom = inputRect.bottom - chipBoxRect.top + chipBox.scrollTop;
  const padding = 8;
  const visibleTop = chipBox.scrollTop;
  const visibleBottom = chipBox.scrollTop + chipBox.clientHeight;

  if (nextBottom + padding > visibleBottom) {
    chipBox.scrollTop = Math.max(0, nextBottom - chipBox.clientHeight + padding);
    return;
  }
  if (nextTop - padding < visibleTop) {
    chipBox.scrollTop = Math.max(0, nextTop - padding);
  }
}

function syncScopeSuggestionAnchor(field, useLivePanelRect = false) {
  const shell = document.querySelector(`[data-suri-scope-shell="${field}"]`);
  const indicator =
    document.querySelector(`[data-suri-scope-input="${field}"]`) ||
    document.querySelector(`[data-suri-scope-indicator="${field}"]`);
  const anchor = document.querySelector(
    `[data-suri-scope-suggestions="${field}"]`,
  );
  if (!shell || !indicator || !anchor) return;
  const shellRect = shell.getBoundingClientRect();
  const boundaryRect = getScopeSuggestionBoundaryRect(shell);
  const indicatorRect = indicator.getBoundingClientRect();
  const panel = anchor.querySelector(".suri-scope-suggestion-panel");
  const livePanelRect = useLivePanelRect ? panel?.getBoundingClientRect() : null;
  const panelWidth = Math.round(
    livePanelRect?.width || panel?.offsetWidth || panel?.scrollWidth || 264,
  );
  const panelHeight = Math.round(
    livePanelRect?.height || panel?.offsetHeight || panel?.scrollHeight || 0,
  );
  const list = panel?.querySelector(".suri-scope-suggestion-list");
  const listHeight = Math.round(
    list?.offsetHeight || list?.scrollHeight || 0,
  );
  const viewportPadding = 8;
  const minLeft = boundaryRect.left + viewportPadding - shellRect.left;
  const maxLeft =
    boundaryRect.right - panelWidth - shellRect.left - viewportPadding;
  const preferredLeft = Math.round(indicatorRect.left - shellRect.left);
  const clampedLeft = Math.min(Math.max(preferredLeft, minLeft), maxLeft);
  const preferredTop = Math.round(indicatorRect.bottom - shellRect.top + 6);
  const availableBelow =
    boundaryRect.bottom - (shellRect.top + preferredTop) - viewportPadding;
  const nonListHeight = Math.max(0, panelHeight - listHeight);
  const panelMaxHeight = Math.max(0, Math.floor(availableBelow));
  const listMaxHeight = Math.max(0, Math.floor(panelMaxHeight - nonListHeight));
  anchor.style.setProperty(
    "--suri-scope-suggestion-top",
    `${preferredTop}px`,
  );
  anchor.style.setProperty(
    "--suri-scope-suggestion-left",
    `${clampedLeft}px`,
  );
  anchor.style.setProperty(
    "--suri-scope-suggestion-translate-y",
    "4px",
  );
  anchor.style.setProperty(
    "--suri-scope-suggestion-max-height",
    `${panelMaxHeight}px`,
  );
  anchor.style.setProperty(
    "--suri-scope-suggestion-list-max-height",
    `${listMaxHeight}px`,
  );
  if (!useLivePanelRect) {
    requestAnimationFrame(() => syncScopeSuggestionAnchor(field, true));
  }
}

function syncAllScopeSuggestionAnchors() {
  document.querySelectorAll("[data-suri-scope-suggestions]").forEach((anchor) => {
    const field = anchor.getAttribute("data-suri-scope-suggestions");
    if (!field) return;
    syncScopeSuggestionAnchor(field);
  });
}

function renderScopeModeUtility(field, kind, surface) {
  const uiState = getScopeUiState(field, kind);
  const mode = uiState.activeMode === "exclude" ? "exclude" : "include";
  const includeAction = `onScopeModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', 'include', '${surface}')`;
  const excludeAction = `onScopeModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', 'exclude', '${surface}')`;
  return `
    <div
      class="menu-item menu-item-cta suri-picker-option suri-subnet-project-option suri-scope-mode-option is-mode-utility has-mode-actions${mode === "exclude" ? " is-active is-exclude" : ""}"
    >
      <span class="value">Exclude New Selections</span>
      <span class="suri-option-tail">
        ${renderMenuItemModeButtons(includeAction, excludeAction, mode)}
      </span>
    </div>
  `;
}

function renderScopeManualSuggestions(field, kind, state) {
  const suggestions = getScopeManualSuggestions(field, kind, state);
  const uiState = getScopeUiState(field, kind);
  const rawValue = String(uiState.manualInput || "").trim();
  const showVariables = rawValue.startsWith("$");
  const title = showVariables
    ? "Variables"
    : kind === "subnet"
      ? "Project Subnets"
      : "Project Ports";
  return `
    <div class="suri-scope-suggestion-panel" role="listbox">
      <div class="suri-subnet-title">${escapeHtml(title)}</div>
      <div class="suri-scope-suggestion-list">
        ${
          suggestions.length
            ? suggestions
                .map((suggestion) => {
                  const selection = getScopeSelection(state, field, kind);
                  const selectionMode = suggestion.create
                    ? ""
                    : getScopeBucketState(
                        selection,
                        suggestion.type === "variable" ? "variable" : "project",
                        suggestion.value,
                      );
                  if (suggestion.create) {
                    return `
                      <div class="menu-item menu-item-cta suri-scope-suggestion-item suri-scope-suggestion-create has-mode-actions">
                        <span class="value">
                          <img class="suri-scope-suggestion-icon" src="${SURI_ICON_ADD_SRC}" alt="" aria-hidden="true" />
                          <span>${escapeHtml(suggestion.label || suggestion.value)}</span>
                        </span>
                        <span class="suri-option-tail">
                          ${renderMenuItemModeButtons(
                            `onScopeManualSuggestionClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${suggestion.type}', '${escapeJsSingleQuoted(suggestion.value)}', 'include', 'manual')`,
                            `onScopeManualSuggestionClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${suggestion.type}', '${escapeJsSingleQuoted(suggestion.value)}', 'exclude', 'manual')`,
                            "",
                          )}
                        </span>
                      </div>
                    `;
                  }
                  return `
                    <div class="menu-item menu-item-cta suri-scope-suggestion-item has-mode-actions${selectionMode ? ` is-selected is-${selectionMode}` : ""}">
                      <span class="value">${escapeHtml(suggestion.value)}</span>
                      <span class="suri-option-tail">
                        ${renderMenuItemModeButtons(
                          `onScopeSuggestionModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${suggestion.type}', '${escapeJsSingleQuoted(suggestion.value)}', 'include', 'manual')`,
                          `onScopeSuggestionModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${suggestion.type}', '${escapeJsSingleQuoted(suggestion.value)}', 'exclude', 'manual')`,
                          selectionMode,
                        )}
                      </span>
                    </div>
                  `;
                })
                .join("")
            : '<div class="suri-scope-empty">No Results</div>'
        }
      </div>
    </div>
  `;
}

function onScopeSuggestionModeClick(event, field, kind, type, value, mode, surface = "manual") {
  event.preventDefault();
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const nextMode = mode === "exclude" ? "exclude" : "include";
  if (type === "addProject") {
    onScopeManualSuggestionClick(event, field, kind, type, value, nextMode, surface);
    return;
  }
  const bucket = type === "variable" ? "variable" : "project";
  toggleScopeBucketOption(field, kind, bucket, value, nextMode);
  renderSuricataDrawerContent();
  if (surface === "menu") {
    restoreScopeMenuSearchFocus(field, kind);
    return;
  }
  restoreScopeInputFocus(field, { immediate: true });
}

function onScopeSuggestionToggle(event, field, kind, type, value, surface = "manual") {
  event.preventDefault();
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const mode = getScopePendingMode(field, kind, type, value);
  onScopeManualSuggestionClick(event, field, kind, type, value, mode, surface);
}

function onScopeModeClick(event, field, kind, mode, surface = "manual") {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  uiState.activeMode = mode === "exclude" ? "exclude" : "include";
  renderSuricataDrawerContent();
  if (surface === "menu") {
    restoreScopeMenuSearchFocus(field, kind);
    return;
  }
  restoreScopeInputFocus(field);
}

function onScopeVariableSearchInput(field, kind, value) {
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  uiState.search = value;
  const cursorPosition = value.length;
  renderSuricataDrawerContent();
  requestAnimationFrame(() => {
    if (!suricataOpenMenuKey) return;
    const menu = document.querySelector(
      `.suri-menu[data-menu-key="${suricataOpenMenuKey}"]`,
    );
    const input = menu?.querySelector(".suri-subnet-search input");
    if (!input) return;
    input.focus();
    input.setSelectionRange(cursorPosition, cursorPosition);
  });
}

function onScopeVariableOptionClick(event, field, kind, variableName) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  const mode = uiState.activeMode === "exclude" ? "exclude" : "include";
  toggleScopeBucketOption(field, kind, "variable", variableName, mode);
  renderSuricataDrawerContent();
  restoreScopeMenuSearchFocus(field, kind);
}

function onScopeProjectOptionClick(event, field, kind, value) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  const mode = uiState.activeMode === "exclude" ? "exclude" : "include";
  toggleScopeBucketOption(field, kind, "project", value, mode);
  renderSuricataDrawerContent();
  restoreScopeMenuSearchFocus(field, kind);
}

function onScopeManualInput(event, field, kind, value) {
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  uiState.manualInput = value;
  syncScopeManualInputSurface(field, kind, suricataDrawerDraft);
  revealScopeInputInChipbox(field);
  syncScopeSuggestionAnchor(field);
}

function onScopeManualSuggestionClick(event, field, kind, type, value, mode, surface = "manual") {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  if (type === "addProject") {
    if (kind === "subnet") {
      addProjectSubnetOption(value);
    } else {
      addProjectPortOption(value);
    }
    toggleScopeBucketOption(field, kind, "project", value, mode);
  } else if (type === "variable") {
    toggleScopeBucketOption(field, kind, "variable", value, mode);
  } else if (type === "project") {
    toggleScopeBucketOption(field, kind, "project", value, mode);
  } else {
    toggleScopeBucketOption(field, kind, "manual", value, mode);
  }
  getScopeUiState(field, kind).manualInput = "";
  renderSuricataDrawerContent();
  if (surface === "menu") {
    restoreScopeMenuSearchFocus(field, kind);
    return;
  }
  restoreScopeInputFocus(field);
}

function onScopeManualKeydown(event, field, kind) {
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  if (event.key === "Backspace" && !String(uiState.manualInput || "").trim()) {
    const selection = getScopeSelection(suricataDrawerDraft, field, kind);
    const appliedEntries = getScopeAppliedEntries(selection);
    const lastEntry = appliedEntries[appliedEntries.length - 1];
    if (!lastEntry) return;
    event.preventDefault();
    event.stopPropagation();
    removeScopeBucketOption(field, kind, lastEntry.bucket, lastEntry.value);
    syncScopeAppliedChipSurface(field, kind, suricataDrawerDraft);
    restoreScopeInputFocus(field, { immediate: true });
    return;
  }
  if (event.key !== "Enter" && event.key !== ",") return;
  event.preventDefault();
  event.stopPropagation();
  const parsed = parseScopeTypedToken(uiState.manualInput, uiState.activeMode);
  const candidate = parsed.value.trim();
  if (!candidate) return;
  const candidateLower = candidate.toLowerCase();
  const variableMatch = getScopeVariableOptions(kind).find(
    (option) => option.name.toLowerCase() === candidateLower,
  );
  if (variableMatch) {
    toggleScopeBucketOption(
      field,
      kind,
      "variable",
      variableMatch.name,
      parsed.mode,
    );
    uiState.manualInput = "";
    renderSuricataDrawerContent();
    restoreScopeInputFocus(field, { immediate: true });
    return;
  }
  const projectMatch = getScopeProjectOptions(kind).find(
    (option) => option.value.toLowerCase() === candidateLower,
  );
  if (projectMatch) {
    toggleScopeBucketOption(
      field,
      kind,
      "project",
      projectMatch.value,
      parsed.mode,
    );
    uiState.manualInput = "";
    renderSuricataDrawerContent();
    restoreScopeInputFocus(field, { immediate: true });
    return;
  }
  const validManual =
    kind === "subnet" ? cidrIsValid(candidate) : portTokenIsValid(candidate);
  if (!validManual) {
    showToast(
      kind === "subnet"
        ? "Enter a valid CIDR subnet."
        : "Enter a valid port or port range.",
    );
    return;
  }
  if (kind === "subnet") {
    addProjectSubnetOption(candidate);
    toggleScopeBucketOption(field, kind, "project", candidate, parsed.mode);
  } else {
    addProjectPortOption(candidate);
    toggleScopeBucketOption(field, kind, "project", candidate, parsed.mode);
  }
  uiState.manualInput = "";
  renderSuricataDrawerContent();
  restoreScopeInputFocus(field, { immediate: true });
}

function onScopeAppliedChipRemove(event, field, kind, bucket, value) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  removeScopeBucketOption(field, kind, bucket, value);
  const rowMenuOpen = suricataOpenMenuKey === getScopeMenuKey(field, kind);
  if (rowMenuOpen) {
    renderSuricataDrawerContent();
    restoreScopeMenuSearchFocus(field, kind);
    return;
  }
  syncScopeAppliedChipSurface(field, kind, suricataDrawerDraft);
}

function focusScopeInput(event, field) {
  if (event.target.closest(".suri-subnet-chip-remove")) return;
  const input = document.querySelector(`[data-suri-scope-input="${field}"]`);
  if (!input) return;
  focusTextFieldWithoutScroll(input, input.value.length);
  revealScopeInputInChipbox(field);
  syncScopeSuggestionAnchor(field);
}

function getScopeAppliedEntries(selection) {
  const activeEntries = [
    ...selection.includeVariables.map((value) => ({
      bucket: "variable",
      mode: "include",
      value,
    })),
    ...selection.excludeVariables.map((value) => ({
      bucket: "variable",
      mode: "exclude",
      value,
    })),
    ...selection.includeChecked.map((value) => ({
      bucket: "project",
      mode: "include",
      value,
    })),
    ...selection.excludeChecked.map((value) => ({
      bucket: "project",
      mode: "exclude",
      value,
    })),
    ...selection.includeManual.map((value) => ({
      bucket: "manual",
      mode: "include",
      value,
    })),
    ...selection.excludeManual.map((value) => ({
      bucket: "manual",
      mode: "exclude",
      value,
    })),
  ];
  const entryMap = new Map(
    activeEntries.map((entry) => [
      getScopeEntryOrderKey(entry.bucket, entry.value),
      entry,
    ]),
  );
  const orderedEntries = [];
  const orderedKeys = Array.isArray(selection.entryOrder)
    ? selection.entryOrder
    : [];
  orderedKeys.forEach((entryKey) => {
    const entry = entryMap.get(entryKey);
    if (!entry) return;
    orderedEntries.push(entry);
    entryMap.delete(entryKey);
  });
  entryMap.forEach((entry) => {
    orderedEntries.push(entry);
  });
  return orderedEntries;
}

function renderScopeMenuSelectionShell(field, kind, entries) {
  return `
    <div class="suri-simple-menu-selection-shell">
      <div
        class="suri-simple-menu-selection"
        data-simple-selection-key="${escapeHtml(getScopeSimpleSelectionKey(field, kind))}"
      >
        ${entries.length ? renderScopeAppliedChips(field, kind, entries) : ""}
      </div>
    </div>
  `;
}

function renderScopeAppliedInput(field, kind, state) {
  const selection = getScopeSelection(state, field, kind);
  const uiState = getScopeUiState(field, kind);
  const chips = getScopeAppliedEntries(selection);
  const suggestionMarkup = renderScopeManualSuggestions(field, kind, state);
  const hasTypedInput = String(uiState.manualInput || "").trim().length > 0;
  const showInlineHelp = chips.length === 0 && !hasTypedInput;
  const helperText = getScopeInlineHelperText(kind);
  return `
    <div class="suri-scope-input-shell" data-suri-scope-shell="${escapeHtml(field)}">
      <div class="suri-scope-chipbox" onclick="focusScopeInput(event, '${escapeJsSingleQuoted(field)}')">
        ${renderScopeAppliedChips(field, kind, chips)}
        <div class="suri-scope-input-indicator" data-suri-scope-indicator="${escapeHtml(field)}">
          ${
            showInlineHelp
              ? `<span class="suri-scope-inline-help">${escapeHtml(helperText)}</span>`
              : ""
          }
          <input
            type="text"
            class="suri-subnet-chip-input"
            data-suri-scope-input="${escapeHtml(field)}"
            value="${escapeHtml(uiState.manualInput)}"
            placeholder=""
            oninput="onScopeManualInput(event, '${escapeJsSingleQuoted(field)}', '${kind}', this.value)"
            onkeydown="onScopeManualKeydown(event, '${escapeJsSingleQuoted(field)}', '${kind}')"
          />
        </div>
      </div>
      <div class="suri-scope-suggestion-anchor" data-suri-scope-suggestions="${escapeHtml(field)}">${suggestionMarkup}</div>
    </div>
  `;
}

function renderScopePickerEditor(field, kind, state) {
  return `
    <div class="suri-scope-editor">
      ${renderScopeAppliedInput(field, kind, state)}
    </div>
  `;
}

function getScopeSelectedCount(selection) {
  return (
    selection.includeVariables.length +
    selection.excludeVariables.length +
    selection.includeChecked.length +
    selection.excludeChecked.length +
    selection.includeManual.length +
    selection.excludeManual.length
  );
}

function renderScopeReadonlyPopover(label, entries, mode) {
  const emptyLabel =
    mode === "include" ? "No included items." : "No excluded items.";
  return `
    <span class="suri-scope-summary-link-wrap ${mode}">
      <span class="suri-scope-summary-link ${mode}">${escapeHtml(label)}</span>
      <span class="suri-scope-summary-popover">
        ${
          entries.length
            ? entries
                .map(
                  (entry) =>
                    `<span class="suri-scope-summary-item ${mode}">${escapeHtml(entry.value)}</span>`,
                )
                .join("")
            : `<span class="suri-scope-summary-empty">${escapeHtml(emptyLabel)}</span>`
        }
      </span>
    </span>
  `;
}

function renderScopeReadonlySummary(field, kind, state) {
  const selection = getScopeSelection(state, field, kind);
  const entries = getScopeAppliedEntries(selection);
  const includedEntries = entries.filter((entry) => entry.mode === "include");
  const excludedEntries = entries.filter((entry) => entry.mode === "exclude");
  return `
    <div class="suri-scope-summary">
      ${renderScopeReadonlyPopover(`${includedEntries.length} Included`, includedEntries, "include")}
      <span class="suri-scope-summary-separator" aria-hidden="true">·</span>
      ${renderScopeReadonlyPopover(`${excludedEntries.length} Excluded`, excludedEntries, "exclude")}
    </div>
  `;
}

function getScopeReadonlyMadlibEntries(entries, kind) {
  const singular = kind === "subnet" ? "Subnet" : "Port";
  const plural = kind === "subnet" ? "Subnets" : "Ports";
  return (Array.isArray(entries) ? entries : []).map((entry) => {
    const isVariable = entry?.bucket === "variable";
    return {
      ...entry,
      categorySingular: isVariable ? "Variable" : singular,
      categoryPlural: isVariable ? "Variables" : plural,
    };
  });
}

function formatScopeMadlibLabel(field, kind, state) {
  const selection = getScopeSelection(state, field, kind);
  const kindPlural = kind === "subnet" ? "subnets" : "ports";
  const entries = getScopeReadonlyMadlibEntries(
    getScopeAppliedEntries(selection),
    kind,
  );
  const label = formatRuleConfigReadonlyMadlib(
    entries,
    kind === "port" ? "any port" : `Any ${kindPlural}`,
  ).label;
  if (kind !== "port" || entries.length !== 1) return label;
  return /^ports?\s/i.test(label) ? label : `ports ${label}`;
}

function renderScopeMadlibControl(field, kind, state) {
  const menuKey = getScopeMenuKey(field, kind);
  const isOpen = suricataOpenMenuKey === menuKey;
  const label = formatScopeMadlibLabel(field, kind, state);
  if (!editMode) {
    const selection = getScopeSelection(state, field, kind);
    const entries = getScopeReadonlyMadlibEntries(
      getScopeAppliedEntries(selection),
      kind,
    );
    return renderRuleConfigReadonlyTrigger(
      label,
      { entries, emptyLabel: label },
    );
  }
  return renderScopeInlinePickerMenu(field, kind, state, label, isOpen);
}

function onScopePickerSourceClick(event, field, kind, source) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const uiState = getScopeUiState(field, kind);
  uiState.activeSource = source === "variable" ? "variable" : "project";
  renderSuricataDrawerContent();
  restoreScopeMenuSearchFocus(field, kind);
}

function renderScopeInlinePickerMenu(field, kind, state, triggerLabel = "", isOpenOverride = null) {
  const selection = getScopeSelection(state, field, kind);
  const uiState = getScopeUiState(field, kind);
  const menuKey = getScopeMenuKey(field, kind);
  const isOpen = isOpenOverride === null
    ? suricataOpenMenuKey === menuKey
    : Boolean(isOpenOverride);
  const visibleOptions = getScopeManualSuggestions(field, kind, state, uiState.search, "include");
  const label = triggerLabel || formatScopeMadlibLabel(field, kind, state);
  const appliedEntries = getScopeAppliedEntries(selection);
  return `
    <div class="suri-menu suri-madlib-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-s style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeHtml(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(label)}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      ${renderScopeInlinePickerPanel(field, kind, state, {
        selection,
        uiState,
        appliedEntries,
        visibleOptions,
      })}
    </div>
  `;
}

function renderScopeInlinePickerPanel(
  field,
  kind,
  state,
  context = {},
) {
  const selection =
    context.selection || getScopeSelection(state, field, kind);
  const uiState = context.uiState || getScopeUiState(field, kind);
  const appliedEntries =
    context.appliedEntries || getScopeAppliedEntries(selection);
  const visibleOptions =
    context.visibleOptions ||
    getScopeManualSuggestions(field, kind, state, uiState.search, "include");
  return `
    <div class="menu-list suri-subnet-menu suri-simple-stack-menu" role="listbox">
      ${context.hideSelectionShell ? "" : `${renderScopeMenuSelectionShell(field, kind, appliedEntries)}
      <div class="suri-subnet-divider" aria-hidden="true"></div>`}
      <div class="suri-subnet-search">
        <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
        <input type="text" value="${escapeHtml(uiState.search)}" placeholder="${escapeHtml(getScopeMenuSearchPlaceholder(kind))}" aria-label="${escapeHtml(getScopeMenuSearchPlaceholder(kind))}" oninput="onScopeVariableSearchInput('${escapeJsSingleQuoted(field)}', '${kind}', this.value)" />
      </div>
      <div class="suri-subnet-divider" aria-hidden="true"></div>
      <div class="suri-subnet-project-shell">
        <div class="suri-subnet-project-list suri-scope-variable-list">
          ${
            visibleOptions.length
              ? visibleOptions.map((option) => {
                  const bucket = option.type === "variable" ? "variable" : "project";
                  const selectionMode = option.create
                    ? ""
                    : getScopeBucketState(selection, bucket, option.value);
                  const includeAction = option.create
                    ? `onScopeManualSuggestionClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${option.type}', '${escapeJsSingleQuoted(option.value)}', 'include', 'menu')`
                    : `onScopeSuggestionModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${option.type}', '${escapeJsSingleQuoted(option.value)}', 'include', 'menu')`;
                  const excludeAction = option.create
                    ? `onScopeManualSuggestionClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${option.type}', '${escapeJsSingleQuoted(option.value)}', 'exclude', 'menu')`
                    : `onScopeSuggestionModeClick(event, '${escapeJsSingleQuoted(field)}', '${kind}', '${option.type}', '${escapeJsSingleQuoted(option.value)}', 'exclude', 'menu')`;
                  return `
                    <div class="menu-item menu-item-cta suri-picker-option suri-subnet-project-option has-mode-actions${selectionMode ? ` is-selected is-${selectionMode}` : ""}">
                      ${
                        option.create
                          ? `<span class="value"><img class="suri-scope-suggestion-icon" src="${SURI_ICON_ADD_SRC}" alt="" aria-hidden="true" /><span>${escapeHtml(option.label || option.value)}</span></span>`
                          : `<span class="value">${escapeHtml(option.value)}</span>`
                      }
                      <span class="suri-option-tail">
                        ${renderMenuItemModeButtons(includeAction, excludeAction, selectionMode)}
                      </span>
                    </div>
                  `;
                }).join("")
              : '<div class="suri-scope-empty">No items match your search.</div>'
          }
        </div>
      </div>
    </div>
  `;
}

function renderScopeEditControls(field, kind, state) {
  return `
    <div class="suri-scope-row-controls">
      ${renderScopeInlinePickerMenu(field, kind, state)}
    </div>
  `;
}
