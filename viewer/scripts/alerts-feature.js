const ALERT_VERSION_OPTIONS = [
  {
    id: "v4",
    label: "v4 · Latest",
    shortHash: "ae2fbe",
    fullHash: "ae2fbe6f-7b1d-41cc-a8e1-38df6da0ba9f",
    releasedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "v3",
    label: "v3 · 729a2",
    shortHash: "729a2",
    fullHash: "729a2af3-ff89-4ef3-8ec6-91322d6a7f81",
    releasedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 - 22 * 60 * 1000,
  },
  {
    id: "v2",
    label: "v2 · 5ea9e",
    shortHash: "5ea9e",
    fullHash: "5ea9e490-f8aa-4ed4-9f19-5848265c5285",
    releasedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
  },
  {
    id: "v1",
    label: "v1 · a5e9e",
    shortHash: "a5e9e",
    fullHash: "a5e9e8bc-05ba-4ca1-aaf4-c7e43b2a9130",
    releasedAt: Date.now() - 19 * 24 * 60 * 60 * 1000,
  },
];

const ALERT_SCHEDULE_OPTIONS = [
  { value: "auto", label: "Auto", meta: "Live" },
  { value: "1h", label: "Every 1 Hour", meta: "60m" },
  { value: "6h", label: "Every 6 Hours", meta: "6h" },
  { value: "12h", label: "Every 12 Hours", meta: "12h" },
  { value: "24h", label: "Every 24 Hours", meta: "24h" },
  { value: "7d", label: "Every 7 Days", meta: "168h" },
  { value: "30d", label: "Every 30 Days", meta: "720h" },
  { value: "90d", label: "Every 90 Days", meta: "2160h" },
];

const ALERT_TIME_RANGE_OPTIONS = [
  { value: "auto", label: "Auto", meta: "Live" },
  { value: "1h", label: "Last 1 Hour", meta: "60m" },
  { value: "4h", label: "Last 4 Hours", meta: "4h" },
  { value: "6h", label: "Last 6 Hours", meta: "6h" },
  { value: "8h", label: "Last 8 Hours", meta: "8h" },
  { value: "12h", label: "Last 12 Hours", meta: "12h" },
  { value: "24h", label: "Last 24 Hours", meta: "24h" },
  { value: "7d", label: "Last 7 Days", meta: "168h" },
];

const ALERT_SEVERITY_OPTIONS = [
  { value: "inherit", label: "Inherit Rule Severity" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ALERT_QUOTA_OPTIONS = [
  { value: "global", label: "Global Quota" },
  { value: "per-host", label: "Per Host" },
  { value: "per-subnet", label: "Per Subnet" },
  { value: "per-sensor", label: "Per Sensor" },
];

const ALERT_PROTOCOL_OPTIONS = [
  { value: "any", label: "Any Protocol" },
  { value: "tcp", label: "TCP" },
  { value: "udp", label: "UDP" },
  { value: "icmp", label: "ICMP" },
  { value: "dns", label: "DNS" },
  { value: "tls", label: "TLS" },
];

const PROJECT_SUBNET_OPTIONS = [
  { cidr: "192.168.10.0/24", count: 10 },
  { cidr: "192.168.20.0/24", count: 10 },
  { cidr: "192.168.30.0/24", count: 10 },
  { cidr: "192.168.40.0/24", count: 10 },
  { cidr: "192.168.50.0/24", count: 10 },
  { cidr: "192.168.60.0/24", count: 10 },
];

const sharedAlertingData = window.TeleseerAppData?.alerting || null;

const ALERTS_TABLE_DATA = sharedAlertingData?.viewerAlerts?.alertGroups || [
  {
    id: "grp-bruteforce-auth",
    ruleId: "rule-bruteforce-auth",
    severity: "high",
    name: "Brute Force Authentication",
    description:
      "Detects rapid multi-port connection attempts, indicating authentication scanning.",
    provider: "Teleseer",
    ruleFamily: "Default Alerts",
    hosts: [
      "core-auth-01.hula.local",
      "edge-vpn-02.hula.local",
      "10.10.4.19",
      "172.20.9.44",
    ],
    lastSeenAt: Date.now() - 5 * 60 * 1000,
    oldestAt: Date.now() - 2 * 24 * 60 * 60 * 1000 - 47 * 60 * 1000,
    count: 418,
    events: [
      {
        timestamp: Date.now() - 5 * 60 * 1000,
        host: "core-auth-01.hula.local",
        source: "185.17.91.45",
        destination: "10.10.4.19:22",
        protocol: "SSH",
        sensor: "sensor-west-03",
        status: "queued",
      },
      {
        timestamp: Date.now() - 8 * 60 * 1000,
        host: "edge-vpn-02.hula.local",
        source: "45.159.221.88",
        destination: "172.20.9.44:443",
        protocol: "TLS",
        sensor: "sensor-west-03",
        status: "ingested",
      },
      {
        timestamp: Date.now() - 11 * 60 * 1000,
        host: "10.10.4.19",
        source: "185.17.91.45",
        destination: "10.10.4.19:3389",
        protocol: "RDP",
        sensor: "sensor-west-03",
        status: "partial",
      },
    ],
  },
  {
    id: "grp-smb-lateral",
    ruleId: "rule-smb-lateral",
    severity: "critical",
    name: "SMB Lateral Movement Burst",
    description:
      "Flags sudden east-west SMB fan-out with credential reuse artifacts.",
    provider: "Suricata",
    ruleFamily: "Emerging Threats Pro",
    hosts: [
      "ws-finance-22.hula.local",
      "dc-core-01.hula.local",
      "ws-legal-04.hula.local",
      "172.18.31.77",
      "172.18.31.110",
      "172.18.31.205",
    ],
    lastSeenAt: Date.now() - 17 * 60 * 1000,
    oldestAt: Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000,
    count: 1216,
    events: [
      {
        timestamp: Date.now() - 17 * 60 * 1000,
        host: "ws-finance-22.hula.local",
        source: "172.18.31.77",
        destination: "172.18.31.205:445",
        protocol: "SMB",
        sensor: "sensor-dc-01",
        status: "ingested",
      },
      {
        timestamp: Date.now() - 18 * 60 * 1000,
        host: "dc-core-01.hula.local",
        source: "172.18.31.110",
        destination: "172.18.31.77:445",
        protocol: "SMB",
        sensor: "sensor-dc-01",
        status: "ingested",
      },
      {
        timestamp: Date.now() - 21 * 60 * 1000,
        host: "ws-legal-04.hula.local",
        source: "172.18.31.205",
        destination: "172.18.31.110:445",
        protocol: "SMB",
        sensor: "sensor-dc-01",
        status: "dropped",
      },
    ],
  },
  {
    id: "grp-dns-tunnel",
    ruleId: "rule-dns-tunnel",
    severity: "medium",
    name: "Outbound DNS Tunneling Pattern",
    description:
      "Finds high-entropy subdomain chains and anomalous TXT answer ratios.",
    provider: "Zeek",
    ruleFamily: "DNS Anomalies",
    hosts: ["dmz-proxy-06.hula.local", "host-analytics-12.hula.local"],
    lastSeenAt: Date.now() - 44 * 60 * 1000,
    oldestAt: Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000,
    count: 294,
    events: [
      {
        timestamp: Date.now() - 44 * 60 * 1000,
        host: "dmz-proxy-06.hula.local",
        source: "10.66.19.4",
        destination: "8.8.8.8:53",
        protocol: "DNS",
        sensor: "sensor-dmz-02",
        status: "ingested",
      },
      {
        timestamp: Date.now() - 56 * 60 * 1000,
        host: "host-analytics-12.hula.local",
        source: "10.66.19.85",
        destination: "1.1.1.1:53",
        protocol: "DNS",
        sensor: "sensor-dmz-02",
        status: "partial",
      },
    ],
  },
  {
    id: "grp-cred-dump",
    ruleId: "rule-credential-dump",
    severity: "high",
    name: "Credential Dumping Indicator",
    description:
      "Correlates LSASS access chains, suspicious command line telemetry, and memory reads.",
    provider: "Teleseer",
    ruleFamily: "Default Alerts",
    hosts: ["win-admin-09.hula.local", "dc-core-01.hula.local", "172.18.31.77"],
    lastSeenAt: Date.now() - 1 * 60 * 60 * 1000 - 7 * 60 * 1000,
    oldestAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    count: 83,
    events: [
      {
        timestamp: Date.now() - 1 * 60 * 60 * 1000 - 7 * 60 * 1000,
        host: "win-admin-09.hula.local",
        source: "172.18.31.77",
        destination: "172.18.31.9:445",
        protocol: "SMB",
        sensor: "sensor-dc-01",
        status: "ingested",
      },
      {
        timestamp: Date.now() - 2 * 60 * 60 * 1000 - 3 * 60 * 1000,
        host: "dc-core-01.hula.local",
        source: "172.18.31.9",
        destination: "172.18.31.1:5985",
        protocol: "WinRM",
        sensor: "sensor-dc-01",
        status: "queued",
      },
    ],
  },
  {
    id: "grp-tls-beacon",
    ruleId: "rule-tls-beacon",
    severity: "low",
    name: "TLS Beaconing to Rare ASN",
    description:
      "Detects fixed-interval TLS beaconing to uncommon autonomous systems.",
    provider: "Suricata",
    ruleFamily: "Emerging Threats Pro",
    hosts: ["edge-egress-02.hula.local"],
    lastSeenAt: Date.now() - 2 * 60 * 60 * 1000 - 29 * 60 * 1000,
    oldestAt: Date.now() - 14 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000,
    count: 41,
    events: [
      {
        timestamp: Date.now() - 2 * 60 * 60 * 1000 - 29 * 60 * 1000,
        host: "edge-egress-02.hula.local",
        source: "10.12.7.5",
        destination: "205.185.118.22:443",
        protocol: "TLS",
        sensor: "sensor-edge-01",
        status: "stale",
      },
    ],
  },
];

const ALERT_RULE_GROUPS = sharedAlertingData?.viewerAlerts?.ruleGroups || [
  {
    id: "teleseer-default",
    source: "Teleseer",
    name: "Default Alerts",
    description: "Baseline curated detections",
    count: 248,
  },
  {
    id: "suricata-emerging",
    source: "Suricata",
    name: "Emerging Threats Pro",
    description: "Community + premium signatures",
    count: 1240,
  },
  {
    id: "zeek-analytics",
    source: "Zeek",
    name: "Behavioral Analytics",
    description: "Connection and protocol anomalies",
    count: 180,
  },
  {
    id: "workspace-custom",
    source: "Workspace",
    name: "Custom Rules",
    description: "Local overrides and tests",
    count: 37,
  },
];

const ALERT_RULES = sharedAlertingData?.viewerAlerts?.rules || [
  {
    id: "rule-bruteforce-auth",
    groupId: "teleseer-default",
    name: "Brute Force Authentication",
    description:
      "Detects rapid multi-port connection attempts, indicating scanning.",
    severity: "high",
    enabled: true,
    projects: 3,
    totalHits: 418,
    sid: "2024847",
    classtype: "attempted-admin",
    versionId: "v4",
    schedule: "auto",
    timeRange: "auto",
    severityOverride: "inherit",
    threshold: 5,
    quota: "per-host",
    protocols: "tcp",
    ports: "22,3389,5985",
    subnetFilters: {
      subnets: {
        mode: "include",
        checked: [
          "192.168.10.0/24",
          "192.168.20.0/24",
          "192.168.30.0/24",
          "192.168.40.0/24",
          "192.168.50.0/24",
          "192.168.60.0/24",
        ],
        manual: ["10.0.0.0/24", "192.168.typo.0/24"],
      },
      destinationSubnets: {
        mode: "include",
        checked: ["192.168.20.0/24", "192.168.40.0/24"],
        manual: [],
      },
      sourceSubnets: {
        mode: "include",
        checked: ["192.168.10.0/24", "192.168.30.0/24"],
        manual: [],
      },
    },
    references: [
      "metadata: attack_target Server",
      "reference: mitre, T1110",
      "reference: cve, 2023-23397",
    ],
  },
  {
    id: "rule-smb-lateral",
    groupId: "suricata-emerging",
    name: "SMB Lateral Movement Burst",
    description:
      "Tracks SMB fan-out over short windows with repeated credentials.",
    severity: "critical",
    enabled: true,
    projects: 2,
    totalHits: 1216,
    sid: "2100459",
    classtype: "trojan-activity",
    versionId: "v3",
    schedule: "1h",
    timeRange: "24h",
    severityOverride: "critical",
    threshold: 8,
    quota: "global",
    protocols: "tcp",
    ports: "139,445",
    subnetFilters: {
      subnets: {
        mode: "include",
        checked: ["192.168.10.0/24", "192.168.20.0/24"],
        manual: [],
      },
      destinationSubnets: {
        mode: "exclude",
        checked: ["192.168.20.0/24", "192.168.50.0/24"],
        manual: ["10.99.0.0/16"],
      },
      sourceSubnets: {
        mode: "include",
        checked: ["192.168.30.0/24"],
        manual: [],
      },
    },
    references: ["reference: mitre, T1021", "reference: mitre, T1078"],
  },
  {
    id: "rule-dns-tunnel",
    groupId: "zeek-analytics",
    name: "Outbound DNS Tunneling Pattern",
    description: "High-entropy DNS labels and unusual TXT answer rate.",
    severity: "medium",
    enabled: true,
    projects: 4,
    totalHits: 294,
    sid: "ZK-3391",
    classtype: "dns-activity",
    versionId: "v2",
    schedule: "6h",
    timeRange: "7d",
    severityOverride: "medium",
    threshold: 16,
    quota: "per-subnet",
    protocols: "dns",
    ports: "53",
    subnetFilters: {
      subnets: {
        mode: "include",
        checked: ["192.168.40.0/24", "192.168.60.0/24"],
        manual: [],
      },
      destinationSubnets: {
        mode: "include",
        checked: ["192.168.60.0/24"],
        manual: [],
      },
      sourceSubnets: {
        mode: "include",
        checked: ["192.168.40.0/24"],
        manual: [],
      },
    },
    references: ["reference: mitre, T1071.004", "metadata: confidence medium"],
  },
  {
    id: "rule-credential-dump",
    groupId: "teleseer-default",
    name: "Credential Dumping Indicator",
    description: "LSASS handle abuse and suspicious process access chain.",
    severity: "high",
    enabled: true,
    projects: 2,
    totalHits: 83,
    sid: "2025552",
    classtype: "credential-access",
    versionId: "v4",
    schedule: "12h",
    timeRange: "24h",
    severityOverride: "high",
    threshold: 2,
    quota: "per-host",
    protocols: "any",
    ports: "445,5985",
    subnetFilters: {
      subnets: {
        mode: "include",
        checked: ["192.168.10.0/24"],
        manual: [],
      },
      destinationSubnets: {
        mode: "include",
        checked: ["192.168.10.0/24"],
        manual: [],
      },
      sourceSubnets: {
        mode: "exclude",
        checked: ["192.168.20.0/24"],
        manual: [],
      },
    },
    references: [
      "reference: mitre, T1003",
      "reference: sigma, proc_access_lsass",
    ],
  },
  {
    id: "rule-tls-beacon",
    groupId: "suricata-emerging",
    name: "TLS Beaconing to Rare ASN",
    description: "Fixed cadence outbound TLS traffic to low-reputation ASN.",
    severity: "low",
    enabled: false,
    projects: 1,
    totalHits: 41,
    sid: "2200781",
    classtype: "policy-violation",
    versionId: "v1",
    schedule: "24h",
    timeRange: "7d",
    severityOverride: "low",
    threshold: 20,
    quota: "per-sensor",
    protocols: "tls",
    ports: "443",
    subnetFilters: {
      subnets: {
        mode: "include",
        checked: ["192.168.60.0/24"],
        manual: ["172.16.300.0/24"],
      },
      destinationSubnets: {
        mode: "exclude",
        checked: [],
        manual: [],
      },
      sourceSubnets: {
        mode: "include",
        checked: ["192.168.60.0/24"],
        manual: [],
      },
    },
    references: [
      "reference: analyst-note, rare ASN watchlist",
      "metadata: stale sensor tolerated",
    ],
  },
  {
    id: "rule-custom-smb-fork",
    groupId: "workspace-custom",
    referenceSid: "2100459",
    referenceGroupId: "suricata-emerging",
    name: "SMB Lateral — Internal Only",
    description: "Forked from Emerging Threats, scoped to internal subnet segments.",
    severity: "critical",
    enabled: true,
    projects: 2,
    totalHits: 512,
    sid: "2100459-fork-01",
    classtype: "trojan-activity",
    versionId: "v3",
    schedule: "1h",
    timeRange: "24h",
    severityOverride: "critical",
    threshold: 6,
    quota: "global",
    protocols: "tcp",
    ports: "139,445",
    subnetFilters: {
      subnets: { mode: "include", checked: ["192.168.10.0/24", "192.168.20.0/24"], manual: [] },
      destinationSubnets: { mode: "include", checked: ["192.168.10.0/24"], manual: [] },
      sourceSubnets: { mode: "include", checked: ["192.168.20.0/24"], manual: [] },
    },
    references: ["reference: mitre, T1021", "reference: mitre, T1078"],
  },
  {
    id: "rule-custom-brute-strict",
    groupId: "workspace-custom",
    referenceSid: "2024847",
    referenceGroupId: "teleseer-default",
    name: "Brute Force — Strict Threshold",
    description: "Copy of Teleseer Default rule with lower threshold for high-value servers.",
    severity: "high",
    enabled: true,
    projects: 1,
    totalHits: 87,
    sid: "2024847-strict-01",
    classtype: "attempted-admin",
    versionId: "v4",
    schedule: "auto",
    timeRange: "auto",
    severityOverride: "high",
    threshold: 3,
    quota: "per-host",
    protocols: "tcp",
    ports: "22,3389,5985",
    subnetFilters: {
      subnets: { mode: "include", checked: ["192.168.10.0/24"], manual: [] },
      destinationSubnets: { mode: "include", checked: ["192.168.10.0/24"], manual: [] },
      sourceSubnets: { mode: "include", checked: [], manual: [] },
    },
    references: ["reference: mitre, T1110"],
  },
];

const alertsUiState = {
  initialized: false,
  toolbarQuery: "",
  openHostsAlertId: null,
  hostsSearchByAlert: {},
  paginationByAlert: {},
  openPaginationSizeForAlertId: null,
  expandedAlertIds: new Set(["grp-bruteforce-auth"]),
  manageModalOpen: false,
  selectedRuleGroupId: ALERT_RULE_GROUPS[0].id,
  selectedRuleId: ALERT_RULES[0].id,
  ruleSearchQuery: "",
  groupSearchQuery: "",
  drawerOpen: false,
  drawerEditMode: false,
  drawerRuleId: null,
  drawerDraft: null,
  openCombobox: null,
  openSubnetField: "subnets",
  subnetSearch: "",
  subnetManualInput: "",
  subnetScrollStateByField: {},
};
let alertingInlineMountPromise = null;

function normalizeAlertingInlineContext(context = null) {
  const surface =
    context?.surface === "workspace-variables"
      ? "workspace-variables"
      : "manage-alerts";
  return { surface };
}

function getAlertsTableRootEl() {
  if (typeof alertsTableShellEl !== "undefined") return alertsTableShellEl;
  return document.getElementById("alertsTableShell");
}

function getManageModalEl() {
  if (typeof alertsManageModalEl !== "undefined") return alertsManageModalEl;
  return document.getElementById("alertsManageModal");
}

function getManageButtonEl() {
  if (typeof alertsManageButtonEl !== "undefined") return alertsManageButtonEl;
  return document.getElementById("alertsManageButton");
}

function getDrawerEl() {
  if (typeof alertsRuleDrawerEl !== "undefined") return alertsRuleDrawerEl;
  return document.getElementById("alertsRuleDrawer");
}

function getAlertingInlineRootEl() {
  return document.getElementById("alertingInlineRoot");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function relativeTimeFromNow(timestamp) {
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${Math.max(1, months)}mo ago`;
}

function formatCountCompact(value) {
  const amount = Number(value) || 0;
  if (amount < 1000) return `${amount}`;
  const compact = (amount / 1000).toFixed(1).replace(/\.0$/, "");
  return `${compact} K`;
}

function getAlertPagination(groupId, totalItems) {
  const stored = alertsUiState.paginationByAlert[groupId] || {
    page: 1,
    pageSize: 10,
  };
  const safePageSize =
    Number(stored.pageSize) > 0 ? Number(stored.pageSize) : 10;
  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(0, totalItems) / safePageSize),
  );
  const safePage = Math.min(totalPages, Math.max(1, Number(stored.page) || 1));
  const next = { page: safePage, pageSize: safePageSize, totalPages };
  alertsUiState.paginationByAlert[groupId] = next;
  return next;
}

function formatTimeLine(timestamp, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date(timestamp));
  const read = (type) => parts.find((part) => part.type === type)?.value || "";
  const hour = read("hour");
  const minute = read("minute");
  const second = read("second");
  const day = read("day");
  const month = read("month");
  const year = read("year");
  let tz = timeZone;
  if (timeZone !== "UTC") {
    tz =
      new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(new Date(timestamp))
        .find((part) => part.type === "timeZoneName")?.value || "LOCAL";
  }
  return `${hour}:${minute} ${second}s ${day}-${month}-${year} ${tz}`;
}

function cidrIsValid(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,3}\.){3}\d{1,3}\/(\d|[12]\d|3[0-2])$/);
  if (!match) return false;
  const [ip] = text.split("/");
  return ip
    .split(".")
    .every((segment) => Number(segment) >= 0 && Number(segment) <= 255);
}

function getRuleById(ruleId) {
  return ALERT_RULES.find((rule) => String(rule.id) === String(ruleId)) || null;
}

function getVersionById(versionId) {
  return (
    ALERT_VERSION_OPTIONS.find((option) => option.id === versionId) ||
    ALERT_VERSION_OPTIONS[0]
  );
}

function getComboboxLabel(field, value) {
  const source =
    field === "schedule"
      ? ALERT_SCHEDULE_OPTIONS
      : field === "timeRange"
        ? ALERT_TIME_RANGE_OPTIONS
        : field === "severityOverride"
          ? ALERT_SEVERITY_OPTIONS
          : field === "quota"
            ? ALERT_QUOTA_OPTIONS
            : ALERT_PROTOCOL_OPTIONS;
  return source.find((item) => item.value === value)?.label || value;
}

function isSubnetComboboxField(field) {
  return (
    field === "subnets" ||
    field === "destinationSubnets" ||
    field === "sourceSubnets"
  );
}

function supportsSubnetMode(field) {
  return field === "destinationSubnets" || field === "sourceSubnets";
}

function normalizeSubnetSelection(selection = {}) {
  const value =
    selection && typeof selection === "object" ? selection : {};
  return {
    mode: value.mode === "exclude" ? "exclude" : "include",
    checked: [...new Set(value.checked || [])],
    manual: [...new Set(value.manual || [])],
  };
}

function getSubnetScrollState(field) {
  if (!alertsUiState.subnetScrollStateByField[field]) {
    alertsUiState.subnetScrollStateByField[field] = {
      projectTop: 0,
      chipTop: 0,
      projectAtBottom: false,
      jumpTarget: "applied",
    };
  }
  return alertsUiState.subnetScrollStateByField[field];
}

function getSubnetSelection(field) {
  if (!alertsUiState.drawerDraft?.subnetFilters) {
    return normalizeSubnetSelection();
  }
  return normalizeSubnetSelection(alertsUiState.drawerDraft.subnetFilters[field]);
}

function setSubnetSelection(field, nextValue) {
  if (!alertsUiState.drawerDraft?.subnetFilters) return;
  alertsUiState.drawerDraft.subnetFilters[field] = normalizeSubnetSelection(
    nextValue,
  );
}

function buildHostsMenuMarkup(group) {
  const open = alertsUiState.openHostsAlertId === group.id;
  const hosts = group.hosts || [];
  const search = alertsUiState.hostsSearchByAlert[group.id] || "";
  const filtered = hosts.filter((host) =>
    host.toLowerCase().includes(search.toLowerCase()),
  );
  return `
          <button class="alerts-host-chip" type="button" data-hosts-chip="${group.id}" aria-label="Show hosts for ${escapeHtml(group.name)}">
            ${hosts.length} Hosts
          </button>
          ${
            open
              ? `
            <div class="alerts-hosts-menu" data-hosts-menu="${group.id}">
              <div class="alerts-hosts-menu-search">
                ${svgMaskMarkup("../icons/icon_search.svg")}
                <input type="text" value="${escapeHtml(search)}" data-hosts-search-input="${group.id}" placeholder="Search hosts..." aria-label="Search hosts" />
              </div>
              <div class="alerts-hosts-menu-list">
                ${
                  filtered.length
                    ? filtered
                        .map(
                          (host) => `
                        <button class="menu-item alerts-hosts-menu-item" type="button" data-host-item="${group.id}">
                          <span>${escapeHtml(host)}</span>
                          <span class="meta">host</span>
                        </button>
                      `,
                        )
                        .join("")
                    : '<div class="alerts-hosts-menu-empty">No hosts match this query.</div>'
                }
              </div>
            </div>
          `
              : ""
          }
        `;
}

function buildProviderMetaMarkup(provider) {
  const label = escapeHtml(provider || "Unknown");
  const key = String(provider || "").toLowerCase();
  const icon = key.includes("teleseer")
    ? svgMaskMarkup("../icons/icon_teleseer_logo.svg")
    : key.includes("zeek")
      ? svgMaskMarkup("../icons/icon_zeek_logo.svg")
      : key.includes("suricata")
        ? svgMaskMarkup("../icons/icon_rule.svg")
        : "";
  if (!icon) {
    return `<span class="alerts-meta-source">${label}</span>`;
  }
  return `
          <span class="alerts-meta-source-chip">
            ${icon}
            <span>${label}</span>
          </span>
        `;
}

function wrapTableElement(type, contentMarkup) {
  return `
          <div class="alerts-tableitem-container" data-cell-type="${type}">
            <div class="alerts-checkbox-container is-hidden" aria-hidden="true"></div>
            <div class="alerts-table-element alerts-table-element-${type}">
              ${contentMarkup}
            </div>
          </div>
        `;
}

function wrapTableHeaderElement(label) {
  return wrapTableElement(
    "header",
    `<span class="alerts-column-header-label">${escapeHtml(label)}</span>`,
  );
}

function buildExpandedEventsMarkup(group) {
  if (!alertsUiState.expandedAlertIds.has(group.id)) return "";
  const totalEvents = group.events.length;
  const pager = getAlertPagination(group.id, totalEvents);
  const pageStartIndex = (pager.page - 1) * pager.pageSize;
  const pageEndIndex = Math.min(totalEvents, pageStartIndex + pager.pageSize);
  const visibleEvents = group.events.slice(pageStartIndex, pageEndIndex);
  const displayStart = totalEvents ? pageStartIndex + 1 : 0;
  const displayEnd = totalEvents ? pageEndIndex : 0;
  const canPrev = pager.page > 1;
  const canNext = pager.page < pager.totalPages;
  const perPageOptions = [10, 25, 50];
  const perPageMenuOpen =
    alertsUiState.openPaginationSizeForAlertId === group.id;

  const rows = visibleEvents
    .map((event, index) => {
      const eventIndex = pageStartIndex + index;
      const selectedClass = index === 0 ? " selected" : "";
      const runAgo = relativeTimeFromNow(event.timestamp);
      const runId =
        `${group.id.split("-").slice(-1)[0] || "run"}${String(eventIndex + 11).padStart(2, "0")}`.replace(
          /[^a-z0-9]/gi,
          "",
        );
      const detailsText = `${event.protocol} from ${event.source}`;
      const timeElement = `
              <button class="alerts-tertiary-button" type="button" data-tooltip="Event timestamp details">${escapeHtml(formatTimeLine(event.timestamp, "UTC"))}</button>
            `;
      const detailsElement = `
              <div class="alerts-event-detail-row">
                <span class="alerts-event-detail-text">${escapeHtml(detailsText)}</span>
                <button class="alerts-event-copy-button" type="button" data-tooltip="Copy event details">
                  ${svgMaskMarkup("../icons/icon_copy.svg")}
                </button>
              </div>
            `;
      const sourceElement = `<span class="alerts-inline-text">${escapeHtml(event.host)}</span>`;
      const destinationElement = `<span class="alerts-inline-text">${escapeHtml(event.destination)}</span>`;
      const runAgoElement = `
              <button class="alerts-tertiary-button" type="button" data-tooltip="Relative execution time">${escapeHtml(runAgo)}</button>
            `;
      const runIdElement = `
              <button class="alerts-tertiary-button" type="button" data-tooltip="Execution run identifier">${escapeHtml(runId.slice(0, 5))}</button>
            `;
      return `
              <div class="alerts-event-row${selectedClass}">
                <div class="alerts-event-cell">${wrapTableElement("tertiary", timeElement)}</div>
                <div class="alerts-event-cell alerts-event-cell-details">${wrapTableElement("text-label", detailsElement)}</div>
                <div class="alerts-event-cell">${wrapTableElement("text-label", sourceElement)}</div>
                <div class="alerts-event-cell">${wrapTableElement("text-label", destinationElement)}</div>
                <div class="alerts-event-cell">${wrapTableElement("tertiary", runAgoElement)}</div>
                <div class="alerts-event-cell">${wrapTableElement("tertiary", runIdElement)}</div>
              </div>
            `;
    })
    .join("");
  return `
          <div class="alerts-expanded-row" data-alert-expanded="${group.id}">
            <div class="alerts-expanded-content">
              <div class="alerts-expanded-main">
                <div class="alerts-expanded-tree" aria-hidden="true"></div>
                <div class="alerts-expanded-shell">
                  <div class="alerts-events-header">
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Time")}</div>
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Details")}</div>
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Source")}</div>
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Destination")}</div>
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Last Run")}</div>
                    <div class="alerts-event-cell">${wrapTableHeaderElement("Run ID")}</div>
                  </div>
                  ${rows}
                  <div class="alerts-events-pagination-row alerts-pagination-controls" data-alert-pagination-controls="${group.id}">
                    <div class="btn-reset btn-secondary size-m style-ghost alerts-pagination-range" aria-hidden="true">
                      <span class="btn-secondary-labelgroup">
                        <span class="btn-label"><strong>${displayStart}-${displayEnd}</strong> <span class="alerts-pagination-of">of ${totalEvents}</span></span>
                      </span>
                    </div>
                    <div class="alerts-pagination-right">
                      <div class="alerts-pagination-size-wrap">
                        <button class="btn-reset btn-secondary size-s style-ghost alerts-pagination-size" type="button" data-alert-page-size-toggle="${group.id}" aria-expanded="${perPageMenuOpen}" aria-label="Rows per page">
                          <span class="btn-secondary-labelgroup">
                            <span class="btn-label">${pager.pageSize} <span class="alerts-pagination-of">per page</span></span>
                            <span class="btn-chevron-slot" aria-hidden="true">${svgMaskMarkup("../icons/icon_arrow_head_outline_down.svg", "svg-icon-chevron-down")}</span>
                          </span>
                        </button>
                        ${
                          perPageMenuOpen
                            ? `
                          <div class="alerts-pagination-size-menu" role="menu" aria-label="Rows per page">
                            ${perPageOptions
                              .map(
                                (size) => `
                              <button class="btn-reset alerts-pagination-size-option${pager.pageSize === size ? " active" : ""}" type="button" data-alert-page-size-option="${group.id}" data-page-size="${size}" role="menuitemradio" aria-checked="${pager.pageSize === size}">
                                ${size} <span class="alerts-pagination-of">per page</span>
                              </button>
                            `,
                              )
                              .join("")}
                          </div>
                        `
                            : ""
                        }
                      </div>
                      <div class="alerts-pagination-nav" role="group" aria-label="Pagination controls">
                        <button class="btn-reset alerts-pagination-nav-button" type="button" data-alert-page-prev="${group.id}" ${canPrev ? "" : "disabled"} aria-label="Previous page">
                          ${svgMaskMarkup("../icons/icon_arrow_head_outline_left.svg")}
                        </button>
                        <span class="alerts-pagination-nav-divider" aria-hidden="true"></span>
                        <button class="btn-reset alerts-pagination-nav-button" type="button" data-alert-page-next="${group.id}" ${canNext ? "" : "disabled"} aria-label="Next page">
                          ${svgMaskMarkup("../icons/icon_arrow_head_outline_right.svg")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="alerts-expanded-footer">
                <button class="btn-reset btn-secondary size-m style-ghost alerts-collapse-row" type="button" data-alert-toggle="${group.id}">
                  <span class="btn-chevron-slot" aria-hidden="true">${svgMaskMarkup("../icons/icon_arrow_head_outline_down.svg", "svg-icon-chevron-down")}</span>
                  <span class="btn-secondary-labelgroup"><span class="btn-label">Collapse</span></span>
                </button>
              </div>
            </div>
          </div>
        `;
}

function buildAlertRowMarkup(group, maxCount) {
  const rule = getRuleById(group.ruleId);
  const version = getVersionById(rule?.versionId || "v4");
  const countWidth = Math.max(6, Math.min(100, (group.count / maxCount) * 100));
  const ageUtcLine = formatTimeLine(group.oldestAt, "UTC");
  const ageLocalLine = formatTimeLine(
    group.oldestAt,
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const alertStackedElement = `
          <button class="alerts-expand-button" type="button" data-alert-toggle="${group.id}" aria-label="Expand ${escapeHtml(group.name)} details">
            ${svgMaskMarkup("../icons/icon_arrow_head_down.svg")}
          </button>
          <div class="alerts-alert-body">
            <div class="alerts-title-line">
              <span class="alerts-title">${escapeHtml(group.name)}</span>
            </div>
            <div class="alerts-description">${escapeHtml(group.description)}</div>
            <div class="alerts-meta-row">
              ${buildProviderMetaMarkup(group.provider)}
              <span class="alerts-meta-divider">|</span>
              <button class="alerts-meta-chip alerts-meta-chip-interactive" type="button" data-open-manage-rule="${group.ruleId}" data-tooltip="Open alert rule in Manage Alerts">${escapeHtml(group.ruleFamily)}</button>
              <span class="alerts-meta-divider">|</span>
              <button class="alerts-meta-chip alerts-meta-chip-interactive" type="button" data-tooltip="Open this rule version in Manage Alerts" data-open-manage-rule="${group.ruleId}">${escapeHtml(version.label)}</button>
            </div>
          </div>
        `;
  const hostsElement = buildHostsMenuMarkup(group);
  const lastSeenElement = `
          <button class="alerts-tertiary-button alerts-time-text" type="button" data-tooltip="Relative time of the most recent alert">${escapeHtml(relativeTimeFromNow(group.lastSeenAt))}</button>
        `;
  const ageElement = `
          <button class="alerts-tertiary-button alerts-time-text" type="button" data-tooltip="Relative time of the oldest alert">${escapeHtml(relativeTimeFromNow(group.oldestAt))}</button>
          <div class="alerts-age-popover" role="tooltip">
            <div class="alerts-age-line">${escapeHtml(ageUtcLine)}</div>
            <div class="alerts-age-line">${escapeHtml(ageLocalLine)}</div>
          </div>
        `;
  const countElement = `
          <div class="alerts-count-stack">
            <span class="alerts-count-value">${formatCountCompact(group.count)}</span>
            <div class="alerts-count-track" aria-hidden="true">
              <span class="alerts-count-fill" style="width: ${countWidth.toFixed(1)}%"></span>
            </div>
          </div>
        `;
  return `
          <div class="alerts-row ${alertsUiState.expandedAlertIds.has(group.id) ? "expanded" : ""}" data-alert-group-id="${group.id}">
            <div class="alerts-cell alerts-alert-cell">
              ${wrapTableElement("stacked", alertStackedElement)}
            </div>
            <div class="alerts-cell alerts-hosts-cell">
              ${wrapTableElement("chip", hostsElement)}
            </div>
            <div class="alerts-cell alerts-time-cell">
              ${wrapTableElement("tertiary", lastSeenElement)}
            </div>
            <div class="alerts-cell alerts-time-cell">
              ${wrapTableElement("tertiary", ageElement)}
            </div>
            <div class="alerts-cell alerts-count-cell">
              ${wrapTableElement("valuebar", countElement)}
            </div>
          </div>
          ${buildExpandedEventsMarkup(group)}
        `;
}

function renderAlertsTable(snapshot, forcedActiveMainTab) {
  const rootEl = getAlertsTableRootEl();
  if (!rootEl) return;
  const activeTab =
    forcedActiveMainTab || snapshot?.activePanelTabs?.main || null;
  if (activeTab && activeTab !== "alerts") {
    rootEl.innerHTML = "";
    return;
  }

  const filter = alertsUiState.toolbarQuery.trim().toLowerCase();
  const groups = ALERTS_TABLE_DATA.filter((group) => {
    if (!filter) return true;
    const version = getVersionById(
      getRuleById(group.ruleId)?.versionId || "v4",
    );
    const values = [
      group.name,
      group.description,
      group.provider,
      group.ruleFamily,
      version.shortHash,
      ...group.hosts,
    ];
    return values.join(" ").toLowerCase().includes(filter);
  });

  if (!groups.length) {
    rootEl.innerHTML = `
            <div class="alerts-empty">
              <strong>No alerts in this scope</strong>
              <span>Search filters may be too narrow or all matching alerts are suppressed.</span>
            </div>
          `;
    return;
  }

  const maxCount = Math.max(...groups.map((group) => group.count));
  const rows = groups
    .map((group) => buildAlertRowMarkup(group, maxCount))
    .join("");
  rootEl.innerHTML = `
          <div class="alerts-table">
            <div class="alerts-table-header">
              ${wrapTableHeaderElement("Alert Group")}
              ${wrapTableHeaderElement("Hosts")}
              ${wrapTableHeaderElement("Last Seen")}
              ${wrapTableHeaderElement("Age")}
              ${wrapTableHeaderElement("Count")}
            </div>
            ${rows}
          </div>
        `;
}

function getFilteredRuleGroups() {
  const search = alertsUiState.groupSearchQuery.trim().toLowerCase();
  if (!search) return ALERT_RULE_GROUPS;
  return ALERT_RULE_GROUPS.filter((group) =>
    `${group.source} ${group.name} ${group.description}`
      .toLowerCase()
      .includes(search),
  );
}

function getFilteredRules() {
  const search = alertsUiState.ruleSearchQuery.trim().toLowerCase();
  return ALERT_RULES.filter((rule) => {
    if (rule.groupId !== alertsUiState.selectedRuleGroupId) return false;
    if (!search) return true;
    return `${rule.name} ${rule.description} ${rule.sid} ${rule.classtype} ${rule.references.join(" ")}`
      .toLowerCase()
      .includes(search);
  });
}

function ruleSeverityClass(severity) {
  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium") return "medium";
  return "low";
}

function renderRuleGroups() {
  const listEl = document.getElementById("alertsRuleGroupList");
  if (!listEl) return;
  const groups = getFilteredRuleGroups();
  listEl.innerHTML = groups.length
    ? groups
        .map(
          (group) => `
                <button class="alerts-rule-group ${group.id === alertsUiState.selectedRuleGroupId ? "active" : ""}" type="button" data-rule-group-id="${group.id}">
                  <span class="alerts-rule-group-label">
                    <strong>${escapeHtml(group.source)} · ${escapeHtml(group.name)}</strong>
                    <span>${escapeHtml(group.description)}</span>
                  </span>
                  <span class="alerts-rule-group-count">${escapeHtml(formatCountCompact(group.count))}</span>
                </button>
              `,
        )
        .join("")
    : '<div class="alerts-empty"><strong>No categories found</strong><span>Try a shorter search term.</span></div>';
}

function renderRuleTable() {
  const tableEl = document.getElementById("alertsRuleTableShell");
  const emptyEl = document.getElementById("alertsRuleEmptyState");
  if (!tableEl || !emptyEl) return;
  const rules = getFilteredRules();
  const hasRules = rules.length > 0;
  emptyEl.classList.toggle("hidden", hasRules);
  emptyEl.hidden = hasRules;
  emptyEl.setAttribute("aria-hidden", hasRules ? "true" : "false");
  if (!hasRules) {
    tableEl.innerHTML = "";
    return;
  }

  tableEl.innerHTML = `
          <div class="alerts-rule-table">
            <div class="alerts-rule-table-head">
              <div class="alerts-rule-cell">${wrapTableHeaderElement("Name")}</div>
              <div class="alerts-rule-cell">${wrapTableHeaderElement("Projects")}</div>
              <div class="alerts-rule-cell">${wrapTableHeaderElement("Total Hits")}</div>
              <div class="alerts-rule-cell">${wrapTableHeaderElement("Severity")}</div>
            </div>
            ${rules
              .map(
                (rule) => {
                  const refGroup = rule.referenceGroupId
                    ? ALERT_RULE_GROUPS.find((g) => g.id === rule.referenceGroupId)
                    : null;
                  const refGroupLabel = refGroup
                    ? `${refGroup.source} / ${refGroup.name}`
                    : rule.referenceGroupId || "";
                  return `
                  <div class="alerts-rule-table-row ${String(rule.id) === String(alertsUiState.selectedRuleId) ? "active" : ""}" data-rule-id="${rule.id}">
                    <div class="alerts-rule-cell">
                      ${wrapTableElement(
                        "stacked",
                        `
                          <div class="alerts-rule-name-cell">
                            <strong>${escapeHtml(rule.name)}</strong>
                            <span>${escapeHtml(rule.description)}</span>
                            ${rule.referenceSid ? `
                              <div class="alerts-rule-meta-ref">
                                <button class="alerts-rule-meta-btn" type="button"
                                  data-open-ref-rule-sid="${escapeHtml(rule.referenceSid)}"
                                  title="Open drawer for Rule SID ${escapeHtml(rule.referenceSid)}">SID ${escapeHtml(rule.referenceSid)}</button>
                                <span class="alerts-rule-meta-sep" aria-hidden="true">·</span>
                                <button class="alerts-rule-meta-btn" type="button"
                                  data-open-ref-group="${escapeHtml(rule.referenceGroupId)}"
                                  title="Go to folder: ${escapeHtml(refGroupLabel)}">${escapeHtml(refGroupLabel)}</button>
                              </div>
                            ` : ""}
                          </div>
                        `,
                      )}
                    </div>
                    <div class="alerts-rule-cell">
                      ${wrapTableElement("text-label", `<span class="alerts-inline-text">${escapeHtml(String(rule.projects))}</span>`)}
                    </div>
                    <div class="alerts-rule-cell">
                      ${wrapTableElement("text-label", `<span class="alerts-inline-text">${escapeHtml(rule.totalHits.toLocaleString())}</span>`)}
                    </div>
                    <div class="alerts-rule-cell">
                      ${wrapTableElement("badge", `<span class="alerts-rule-pill ${ruleSeverityClass(rule.severity)}">${escapeHtml(rule.severity)}</span>`)}
                    </div>
                  </div>
                `;
                })
              .join("")}
          </div>
        `;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function primeDrawerFromRule(ruleId) {
  const rule = getRuleById(ruleId);
  if (!rule) return;
  alertsUiState.drawerRuleId = ruleId;
  alertsUiState.drawerDraft = deepClone({
    enabled: rule.enabled,
    versionId: rule.versionId,
    schedule: rule.schedule,
    timeRange: rule.timeRange,
    severityOverride: rule.severityOverride,
    threshold: rule.threshold,
    quota: rule.quota,
    protocols: rule.protocols,
    ports: rule.ports,
    subnetFilters: rule.subnetFilters,
  });
  alertsUiState.subnetSearch = "";
  alertsUiState.subnetManualInput = "";
  alertsUiState.subnetScrollStateByField = {};
}

function renderVersionMenu() {
  const selectedVersion = getVersionById(alertsUiState.drawerDraft.versionId);
  return `
          <div class="alerts-combobox-menu" data-combobox-menu="versionId">
            ${ALERT_VERSION_OPTIONS.map(
              (option) => `
                  <div class="menu-item menu-item-check alerts-combobox-option alerts-version-option ${option.id === selectedVersion.id ? "active" : ""}" data-combobox-option="versionId" data-combobox-value="${option.id}">
                    <span>${option.id === selectedVersion.id ? "✓" : ""} ${escapeHtml(option.label)}</span>
                    <span class="meta">${escapeHtml(relativeTimeFromNow(option.releasedAt))}</span>
                    <div class="alerts-version-popout">
                      <code>${escapeHtml(option.fullHash)}</code>
                      <button class="alerts-copy-button" type="button" data-copy-version-hash="${escapeHtml(option.fullHash)}">
                        ${svgMaskMarkup("../icons/icon_export_file.svg")}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                `,
            ).join("")}
          </div>
        `;
}

function renderSimpleMenu(field, options) {
  return `
          <div class="alerts-combobox-menu" data-combobox-menu="${field}">
            ${options
              .map(
                (option) => `
                  <button class="menu-item menu-item-check alerts-combobox-option ${option.value === alertsUiState.drawerDraft[field] ? "active" : ""}" type="button" data-combobox-option="${field}" data-combobox-value="${option.value}">
                    <span>${option.value === alertsUiState.drawerDraft[field] ? "✓" : ""} ${escapeHtml(option.label)}</span>
                    ${option.meta ? `<span class="meta">${escapeHtml(option.meta)}</span>` : ""}
                  </button>
                `,
              )
              .join("")}
          </div>
        `;
}

function syncSubnetJumpButton(field) {
  const drawerEl = getDrawerEl();
  if (!drawerEl) return;
  const jumpButton = drawerEl.querySelector(`[data-subnet-jump="${field}"]`);
  if (!jumpButton) return;
  const state = getSubnetScrollState(field);
  const jumpTarget = state.jumpTarget || "applied";
  const jumpUp = jumpTarget === "top";
  jumpButton.setAttribute("data-subnet-jump-target", jumpTarget);
  jumpButton.setAttribute(
    "aria-label",
    jumpUp ? "Jump to project subnet list" : "Jump to applied subnet chips",
  );
  jumpButton.classList.toggle("up", jumpUp);
}

function restoreOpenSubnetMenuScroll() {
  if (!isSubnetComboboxField(alertsUiState.openCombobox)) return;
  const field = alertsUiState.openCombobox;
  const drawerEl = getDrawerEl();
  if (!drawerEl) return;
  const state = getSubnetScrollState(field);
  const projectList = drawerEl.querySelector(
    `[data-subnet-project-list="${field}"]`,
  );
  const chipBox = drawerEl.querySelector(`[data-subnet-chipbox="${field}"]`);
  if (projectList) projectList.scrollTop = state.projectTop || 0;
  if (chipBox) chipBox.scrollTop = state.chipTop || 0;
  syncSubnetJumpButton(field);
}

function renderSubnetMenu(field) {
  const selected = getSubnetSelection(field);
  const modeAware = supportsSubnetMode(field);
  const search = alertsUiState.subnetSearch.trim().toLowerCase();
  const visible = PROJECT_SUBNET_OPTIONS.filter((option) =>
    option.cidr.toLowerCase().includes(search),
  );
  const allVisibleSelected =
    visible.length > 0 &&
    visible.every((option) => selected.checked.includes(option.cidr));
  const invalidManual = selected.manual.filter((entry) => !cidrIsValid(entry));
  const appliedCount = selected.checked.length + selected.manual.length;
  const scrollState = getSubnetScrollState(field);

  return `
          <div class="alerts-combobox-menu alerts-subnet-menu mode-${selected.mode}" data-combobox-menu="${field}">
            ${
              modeAware
                ? `
              <div class="alerts-subnet-mode" role="group" aria-label="Subnet match mode">
                <button
                  class="alerts-subnet-mode-option ${selected.mode === "include" ? "active" : ""}"
                  type="button"
                  data-subnet-mode="${field}"
                  data-subnet-mode-value="include"
                >
                  Include
                </button>
                <button
                  class="alerts-subnet-mode-option ${selected.mode === "exclude" ? "active" : ""}"
                  type="button"
                  data-subnet-mode="${field}"
                  data-subnet-mode-value="exclude"
                >
                  Exclude
                </button>
              </div>
            `
                : ""
            }
            <div class="alerts-subnet-search">
              ${svgMaskMarkup("../icons/icon_search.svg")}
              <input type="text" value="${escapeHtml(alertsUiState.subnetSearch)}" data-subnet-search-input="${field}" placeholder="Search..." aria-label="Search subnets" />
            </div>
            <button class="alerts-subnet-select-all" type="button" data-subnet-select-all="${field}">
              <span class="alerts-subnet-checkbox ${allVisibleSelected ? "checked" : ""}">✓</span>
              <span>Select All (${visible.length})</span>
            </button>
            <div class="alerts-subnet-project-title">Subnets in Project</div>
            <div class="alerts-subnet-project-list" data-subnet-project-list="${field}">
              ${visible
                .map((option) => {
                  const isChecked = selected.checked.includes(option.cidr);
                  return `
                    <button class="alerts-subnet-project-option" type="button" data-subnet-option="${field}" data-subnet-cidr="${option.cidr}">
                      <span class="alerts-subnet-checkbox ${isChecked ? "checked" : ""}">✓</span>
                      <span>${escapeHtml(option.cidr)}</span>
                      <span class="count">${option.count}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
            <div class="alerts-subnet-jump-panel">
              <button
                class="alerts-subnet-jump-button ${scrollState.jumpTarget === "top" ? "up" : ""}"
                type="button"
                data-subnet-jump="${field}"
                data-subnet-jump-target="${scrollState.jumpTarget || "applied"}"
                aria-label="${scrollState.jumpTarget === "top" ? "Jump to project subnet list" : "Jump to applied subnet chips"}"
              >
                ${svgMaskMarkup("../icons/icon_arrow_head_outline_down.svg")}
              </button>
            </div>
            <div class="alerts-subnet-applied-title">Subnets Applied to Alert (${appliedCount})</div>
            <div class="alerts-subnet-chipbox" data-subnet-chipbox="${field}">
              ${selected.checked
                .map(
                  (cidr) =>
                    `<span class="alerts-chip project ${selected.mode}">${escapeHtml(cidr)}</span>`,
                )
                .join("")}
              ${selected.manual
                .map(
                  (cidr) => `
                    <span class="alerts-chip manual">
                      <span>${escapeHtml(cidr)}</span>
                      <button class="alerts-chip-remove" type="button" data-remove-manual-subnet="${field}" data-remove-cidr="${escapeHtml(cidr)}" aria-label="Remove subnet ${escapeHtml(cidr)}">
                        ${svgMaskMarkup("../icons/icon_close_small.svg")}
                      </button>
                    </span>
                  `,
                )
                .join("")}
              <input
                class="alerts-subnet-chipbox-input"
                type="text"
                value="${escapeHtml(alertsUiState.subnetManualInput)}"
                data-subnet-manual-input="${field}"
                placeholder="Type subnet and press Enter"
                aria-label="Type subnet and press Enter"
              />
            </div>
            <div class="alerts-subnet-warning ${invalidManual.length ? "" : "hidden"}">
              ${svgMaskMarkup("../icons/icon_alert.svg")}
              <span>${invalidManual.length} subnet${invalidManual.length === 1 ? " is" : "s are"} invalid and will be ignored</span>
            </div>
          </div>
        `;
}

function renderCombobox(field, value, options, tooltip) {
  const open = alertsUiState.openCombobox === field;
  const isSubnetField = isSubnetComboboxField(field);
  const label = isSubnetField
    ? tooltip
    : field === "versionId"
      ? getVersionById(value).label
      : getComboboxLabel(field, value);
  return `
          <div class="alerts-combobox">
            <button class="alerts-combobox-button" type="button" data-open-combobox="${field}" ${alertsUiState.drawerEditMode ? "" : "disabled"}>
              <span class="alerts-tertiary-button" data-tooltip="${escapeHtml(tooltip)}">${escapeHtml(label)}</span>
              ${svgMaskMarkup("../icons/icon_arrow_head_outline_down.svg")}
            </button>
            ${
              open
                ? field === "versionId"
                  ? renderVersionMenu()
                  : field === "schedule"
                    ? renderSimpleMenu("schedule", ALERT_SCHEDULE_OPTIONS)
                    : field === "timeRange"
                      ? renderSimpleMenu("timeRange", ALERT_TIME_RANGE_OPTIONS)
                      : field === "severityOverride"
                        ? renderSimpleMenu(
                            "severityOverride",
                            ALERT_SEVERITY_OPTIONS,
                          )
                        : field === "quota"
                          ? renderSimpleMenu("quota", ALERT_QUOTA_OPTIONS)
                          : field === "protocols"
                            ? renderSimpleMenu(
                                "protocols",
                                ALERT_PROTOCOL_OPTIONS,
                              )
                            : renderSubnetMenu(field)
                : ""
            }
          </div>
        `;
}

function renderDrawer() {
  const drawerEl = getDrawerEl();
  if (!drawerEl) return;

  if (!alertsUiState.drawerOpen || !alertsUiState.drawerRuleId) {
    drawerEl.classList.add("hidden");
    drawerEl.setAttribute("aria-hidden", "true");
    drawerEl.innerHTML = "";
    return;
  }

  const rule = getRuleById(alertsUiState.drawerRuleId);
  if (!rule || !alertsUiState.drawerDraft) {
    drawerEl.classList.add("hidden");
    drawerEl.setAttribute("aria-hidden", "true");
    drawerEl.innerHTML = "";
    return;
  }

  const draft = alertsUiState.drawerDraft;
  const version = getVersionById(draft.versionId);
  const subnetSummary = (field) => {
    const set = getSubnetSelection(field);
    const total = set.checked.length + set.manual.length;
    const scopedModePrefix = supportsSubnetMode(field)
      ? `${set.mode === "exclude" ? "Exclude" : "Include"} · `
      : "";
    if (total === 0) return `${scopedModePrefix}No subnet restrictions`;
    return `${scopedModePrefix}${total} subnet${total === 1 ? "" : "s"} selected`;
  };

  drawerEl.classList.remove("hidden");
  drawerEl.setAttribute("aria-hidden", "false");
  drawerEl.innerHTML = `
          <div class="alerts-drawer-header">
            <div class="alerts-drawer-header-main">
              <button class="alerts-drawer-back" type="button" data-drawer-action="close" aria-label="Close drawer">
                ${svgMaskMarkup("../icons/icon_arrow_head_down.svg")}
              </button>
              <div class="alerts-drawer-title">
                <strong>${escapeHtml(rule.name)}</strong>
                <span>${escapeHtml(rule.sid)} · ${escapeHtml(rule.classtype)}</span>
              </div>
            </div>
            <div class="alerts-drawer-actions">
              ${
                alertsUiState.drawerEditMode
                  ? `
                  <button class="alerts-drawer-button" type="button" data-drawer-action="cancel">Cancel</button>
                  <button class="alerts-drawer-button primary" type="button" data-drawer-action="save">Save</button>
                `
                  : `<button class="alerts-drawer-button" type="button" data-drawer-action="edit">Edit</button>`
              }
            </div>
          </div>
          <div class="alerts-drawer-content">
            <section class="alerts-drawer-card">
              <div class="alerts-drawer-card-body">
                <div class="alerts-drawer-card-description">
                  ${escapeHtml(rule.description)}
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Publisher</div>
                  <div class="alerts-drawer-value">
                    <span class="alerts-meta-chip">${escapeHtml(ALERT_RULE_GROUPS.find((group) => group.id === rule.groupId)?.source || "Unknown")}</span>
                    <span class="alerts-meta-chip">${escapeHtml(ALERT_RULE_GROUPS.find((group) => group.id === rule.groupId)?.name || "")}</span>
                    <span class="alerts-meta-chip">${escapeHtml(version.label)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="alerts-drawer-card">
              <div class="alerts-drawer-card-header">Rule Controls</div>
              <div class="alerts-drawer-card-body">
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Enabled</div>
                  <div class="alerts-drawer-value">
                    <button class="alerts-toggle ${draft.enabled ? "on" : ""}" type="button" data-drawer-action="toggle-enabled" ${alertsUiState.drawerEditMode ? "" : "disabled"}></button>
                    <span>${draft.enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Version</div>
                  <div class="alerts-drawer-value">${renderCombobox("versionId", draft.versionId, ALERT_VERSION_OPTIONS, "Rule version")}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Severity Override</div>
                  <div class="alerts-drawer-value">${renderCombobox("severityOverride", draft.severityOverride, ALERT_SEVERITY_OPTIONS, "Override severity")}</div>
                </div>
              </div>
            </section>

            <section class="alerts-drawer-card">
              <div class="alerts-drawer-card-header">Alert Parameters</div>
              <div class="alerts-drawer-card-body">
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Schedule</div>
                  <div class="alerts-drawer-value">${renderCombobox("schedule", draft.schedule, ALERT_SCHEDULE_OPTIONS, "Schedule for analysis runs")}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Time Range</div>
                  <div class="alerts-drawer-value">${renderCombobox("timeRange", draft.timeRange, ALERT_TIME_RANGE_OPTIONS, "Input lookback window")}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Threshold</div>
                  <div class="alerts-drawer-value">
                    <input class="alerts-combobox-button" style="width:120px" type="number" min="1" value="${Number(draft.threshold)}" data-drawer-input="threshold" ${alertsUiState.drawerEditMode ? "" : "disabled"} />
                  </div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Quota</div>
                  <div class="alerts-drawer-value">${renderCombobox("quota", draft.quota, ALERT_QUOTA_OPTIONS, "Quota scope")}</div>
                </div>
              </div>
            </section>

            <section class="alerts-drawer-card">
              <div class="alerts-drawer-card-header">Alert Filters</div>
              <div class="alerts-drawer-card-body">
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Subnets</div>
                  <div class="alerts-drawer-value">${renderCombobox("subnets", "subnets", [], subnetSummary("subnets"))}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Destination Subnets</div>
                  <div class="alerts-drawer-value">${renderCombobox("destinationSubnets", "destinationSubnets", [], subnetSummary("destinationSubnets"))}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Source Subnets</div>
                  <div class="alerts-drawer-value">${renderCombobox("sourceSubnets", "sourceSubnets", [], subnetSummary("sourceSubnets"))}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Protocol</div>
                  <div class="alerts-drawer-value">${renderCombobox("protocols", draft.protocols, ALERT_PROTOCOL_OPTIONS, "Protocol selector")}</div>
                </div>
                <div class="alerts-drawer-row">
                  <div class="alerts-drawer-label">Ports</div>
                  <div class="alerts-drawer-value">
                    <input class="alerts-combobox-button" type="text" value="${escapeHtml(draft.ports)}" data-drawer-input="ports" ${alertsUiState.drawerEditMode ? "" : "disabled"} />
                  </div>
                </div>
              </div>
            </section>

            <section class="alerts-drawer-card">
              <div class="alerts-drawer-card-header">References</div>
              <ul class="alerts-reference-list">
                ${rule.references.map((reference) => `<li>${escapeHtml(reference)}</li>`).join("")}
              </ul>
            </section>
          </div>
        `;
  restoreOpenSubnetMenuScroll();
}

function openManageModal(ruleId = null, openDrawer = false) {
  const modalEl = getManageModalEl();
  if (!modalEl) return;
  mountAlertingInlineModal({
    forceRemount: true,
    context: { surface: "manage-alerts" },
  }).catch((error) => {
    console.error("Failed to mount inline Alerting modal", error);
  });
  alertsUiState.manageModalOpen = true;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (ruleId && getRuleById(ruleId)) {
    alertsUiState.selectedRuleId = ruleId;
    alertsUiState.selectedRuleGroupId = getRuleById(ruleId).groupId;
  }

  renderRuleGroups();
  renderRuleTable();

  if (openDrawer && alertsUiState.selectedRuleId) {
    alertsUiState.drawerOpen = true;
    alertsUiState.drawerEditMode = false;
    alertsUiState.openCombobox = null;
    primeDrawerFromRule(alertsUiState.selectedRuleId);
    renderDrawer();
  } else {
    alertsUiState.drawerOpen = false;
    alertsUiState.drawerEditMode = false;
    alertsUiState.openCombobox = null;
    renderDrawer();
  }
}

function openWorkspaceVariablesModal() {
  const modalEl = getManageModalEl();
  if (!modalEl) return;
  mountAlertingInlineModal({
    forceRemount: true,
    context: { surface: "workspace-variables" },
  }).catch((error) => {
    console.error("Failed to mount inline Variables modal", error);
  });
  alertsUiState.manageModalOpen = true;
  alertsUiState.drawerOpen = false;
  alertsUiState.drawerEditMode = false;
  alertsUiState.openCombobox = null;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderDrawer();
}

function closeManageModal() {
  const modalEl = getManageModalEl();
  if (!modalEl) return;
  alertsUiState.manageModalOpen = false;
  alertsUiState.drawerOpen = false;
  alertsUiState.drawerEditMode = false;
  alertsUiState.openCombobox = null;
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  renderDrawer();
}

function closeDrawer() {
  alertsUiState.drawerOpen = false;
  alertsUiState.drawerEditMode = false;
  alertsUiState.openCombobox = null;
  alertsUiState.drawerRuleId = null;
  alertsUiState.drawerDraft = null;
  renderDrawer();
}

function saveDrawerChanges() {
  if (!alertsUiState.drawerRuleId || !alertsUiState.drawerDraft) return;
  const rule = getRuleById(alertsUiState.drawerRuleId);
  if (!rule) return;

  rule.enabled = alertsUiState.drawerDraft.enabled;
  rule.versionId = alertsUiState.drawerDraft.versionId;
  rule.schedule = alertsUiState.drawerDraft.schedule;
  rule.timeRange = alertsUiState.drawerDraft.timeRange;
  rule.severityOverride = alertsUiState.drawerDraft.severityOverride;
  rule.threshold = Number(alertsUiState.drawerDraft.threshold) || 1;
  rule.quota = alertsUiState.drawerDraft.quota;
  rule.protocols = alertsUiState.drawerDraft.protocols;
  rule.ports = alertsUiState.drawerDraft.ports;
  rule.subnetFilters = deepClone(alertsUiState.drawerDraft.subnetFilters);

  alertsUiState.drawerEditMode = false;
  alertsUiState.openCombobox = null;
  renderRuleTable();
  renderDrawer();
  if (typeof showToast === "function") {
    showToast(
      "Alert rule saved",
      `${rule.name} was updated for this workspace.`,
    );
  }
  renderAlertsTable(
    getEffectiveSnapshot(getCurrentView()),
    getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
  );
}

function handleAlertsEscape() {
  if (alertsUiState.openCombobox) {
    alertsUiState.openCombobox = null;
    renderDrawer();
    return true;
  }
  if (alertsUiState.openPaginationSizeForAlertId) {
    alertsUiState.openPaginationSizeForAlertId = null;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return true;
  }
  if (alertsUiState.openHostsAlertId) {
    alertsUiState.openHostsAlertId = null;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return true;
  }
  if (alertsUiState.manageModalOpen) {
    if (alertsUiState.drawerOpen) {
      closeDrawer();
      return true;
    }
    closeManageModal();
    return true;
  }
  return false;
}

function onAlertsTableClick(event) {
  const rootEl = getAlertsTableRootEl();
  if (!rootEl || !rootEl.contains(event.target)) return;

  const pageSizeToggleEl = event.target.closest(
    "[data-alert-page-size-toggle]",
  );
  if (pageSizeToggleEl) {
    const id = pageSizeToggleEl.getAttribute("data-alert-page-size-toggle");
    alertsUiState.openPaginationSizeForAlertId =
      alertsUiState.openPaginationSizeForAlertId === id ? null : id;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const pageSizeOptionEl = event.target.closest(
    "[data-alert-page-size-option]",
  );
  if (pageSizeOptionEl) {
    const id = pageSizeOptionEl.getAttribute("data-alert-page-size-option");
    const pageSize =
      Number(pageSizeOptionEl.getAttribute("data-page-size")) || 10;
    const pagination = alertsUiState.paginationByAlert[id] || {
      page: 1,
      pageSize: 10,
    };
    alertsUiState.paginationByAlert[id] = { ...pagination, page: 1, pageSize };
    alertsUiState.openPaginationSizeForAlertId = null;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const prevPageEl = event.target.closest("[data-alert-page-prev]");
  if (prevPageEl) {
    const id = prevPageEl.getAttribute("data-alert-page-prev");
    const group = ALERTS_TABLE_DATA.find((item) => item.id === id);
    if (!group) return;
    const pagination = getAlertPagination(id, group.events.length);
    alertsUiState.paginationByAlert[id] = {
      ...pagination,
      page: Math.max(1, pagination.page - 1),
    };
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const nextPageEl = event.target.closest("[data-alert-page-next]");
  if (nextPageEl) {
    const id = nextPageEl.getAttribute("data-alert-page-next");
    const group = ALERTS_TABLE_DATA.find((item) => item.id === id);
    if (!group) return;
    const pagination = getAlertPagination(id, group.events.length);
    alertsUiState.paginationByAlert[id] = {
      ...pagination,
      page: Math.min(pagination.totalPages, pagination.page + 1),
    };
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const toggleEl = event.target.closest("[data-alert-toggle]");
  if (toggleEl) {
    const id = toggleEl.getAttribute("data-alert-toggle");
    if (alertsUiState.expandedAlertIds.has(id)) {
      alertsUiState.expandedAlertIds.delete(id);
      if (alertsUiState.openPaginationSizeForAlertId === id) {
        alertsUiState.openPaginationSizeForAlertId = null;
      }
    } else {
      alertsUiState.expandedAlertIds.add(id);
    }
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const hostsChipEl = event.target.closest("[data-hosts-chip]");
  if (hostsChipEl) {
    const id = hostsChipEl.getAttribute("data-hosts-chip");
    alertsUiState.openHostsAlertId =
      alertsUiState.openHostsAlertId === id ? null : id;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
    return;
  }

  const openRuleEl = event.target.closest("[data-open-manage-rule]");
  if (openRuleEl) {
    openManageModal(openRuleEl.getAttribute("data-open-manage-rule"), true);
  }
}

function onAlertsTableInput(event) {
  const rootEl = getAlertsTableRootEl();
  if (!rootEl || !rootEl.contains(event.target)) return;

  const searchInput = event.target.closest("[data-hosts-search-input]");
  if (searchInput) {
    alertsUiState.hostsSearchByAlert[
      searchInput.getAttribute("data-hosts-search-input")
    ] = searchInput.value;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
  }
}

function onRuleSidebarInteraction(event) {
  const targetGroup = event.target.closest("[data-rule-group-id]");
  if (targetGroup) {
    alertsUiState.selectedRuleGroupId =
      targetGroup.getAttribute("data-rule-group-id");
    const firstRule = ALERT_RULES.find(
      (rule) => rule.groupId === alertsUiState.selectedRuleGroupId,
    );
    if (firstRule) {
      alertsUiState.selectedRuleId = firstRule.id;
    }
    alertsUiState.drawerOpen = false;
    alertsUiState.drawerEditMode = false;
    alertsUiState.openCombobox = null;
    renderRuleGroups();
    renderRuleTable();
    renderDrawer();
    return;
  }

  const targetRule = event.target.closest("[data-rule-id]");
  if (targetRule) {
    alertsUiState.selectedRuleId = targetRule.getAttribute("data-rule-id");
    alertsUiState.drawerOpen = true;
    alertsUiState.drawerEditMode = false;
    alertsUiState.openCombobox = null;
    primeDrawerFromRule(alertsUiState.selectedRuleId);
    renderRuleTable();
    renderDrawer();
  }
}

function addManualSubnet(field, value) {
  const next = String(value || "").trim();
  if (!next) return;
  const selected = getSubnetSelection(field);
  if (selected.manual.includes(next) || selected.checked.includes(next)) return;
  setSubnetSelection(field, {
    mode: selected.mode,
    checked: selected.checked,
    manual: [...selected.manual, next],
  });
}

function removeManualSubnet(field, cidr) {
  const selected = getSubnetSelection(field);
  setSubnetSelection(field, {
    mode: selected.mode,
    checked: selected.checked,
    manual: selected.manual.filter((value) => value !== cidr),
  });
}

function toggleSubnetOption(field, cidr) {
  const selected = getSubnetSelection(field);
  if (selected.checked.includes(cidr)) {
    setSubnetSelection(field, {
      mode: selected.mode,
      checked: selected.checked.filter((value) => value !== cidr),
      manual: selected.manual,
    });
    return;
  }
  setSubnetSelection(field, {
    mode: selected.mode,
    checked: [...selected.checked, cidr],
    manual: selected.manual,
  });
}

function toggleSelectAllSubnets(field) {
  const selected = getSubnetSelection(field);
  const visible = PROJECT_SUBNET_OPTIONS.filter((option) =>
    option.cidr
      .toLowerCase()
      .includes(alertsUiState.subnetSearch.trim().toLowerCase()),
  );
  const allVisibleSelected =
    visible.length > 0 &&
    visible.every((option) => selected.checked.includes(option.cidr));
  if (allVisibleSelected) {
    const removeSet = new Set(visible.map((option) => option.cidr));
    setSubnetSelection(field, {
      mode: selected.mode,
      checked: selected.checked.filter((value) => !removeSet.has(value)),
      manual: selected.manual,
    });
    return;
  }
  setSubnetSelection(field, {
    mode: selected.mode,
    checked: [
      ...new Set([
        ...selected.checked,
        ...visible.map((option) => option.cidr),
      ]),
    ],
    manual: selected.manual,
  });
}

function setSubnetMode(field, mode) {
  const selected = getSubnetSelection(field);
  setSubnetSelection(field, {
    mode: mode === "exclude" ? "exclude" : "include",
    checked: selected.checked,
    manual: selected.manual,
  });
}

function jumpSubnetPanels(field, target) {
  const drawerEl = getDrawerEl();
  if (!drawerEl) return;
  const projectList = drawerEl.querySelector(
    `[data-subnet-project-list="${field}"]`,
  );
  const chipBox = drawerEl.querySelector(`[data-subnet-chipbox="${field}"]`);
  if (!projectList || !chipBox) return;

  const state = getSubnetScrollState(field);
  const jumpTarget = target || state.jumpTarget || "applied";

  if (jumpTarget === "top") {
    projectList.scrollTo({ top: 0, behavior: "smooth" });
    chipBox.scrollTo({ top: 0, behavior: "smooth" });
    state.projectTop = 0;
    state.chipTop = 0;
    state.projectAtBottom = false;
    state.jumpTarget = "applied";
  } else {
    projectList.scrollTo({ top: projectList.scrollHeight, behavior: "smooth" });
    chipBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
    state.projectTop = projectList.scrollHeight;
    state.projectAtBottom = true;
    state.jumpTarget = "top";
  }
  syncSubnetJumpButton(field);
}

function onDrawerScroll(event) {
  const projectList = event.target.closest?.("[data-subnet-project-list]");
  if (projectList) {
    const field = projectList.getAttribute("data-subnet-project-list");
    const state = getSubnetScrollState(field);
    const projectAtBottom =
      projectList.scrollTop + projectList.clientHeight >=
      projectList.scrollHeight - 4;
    state.projectTop = projectList.scrollTop;
    state.projectAtBottom = projectAtBottom;
    state.jumpTarget = projectAtBottom ? "top" : "applied";
    syncSubnetJumpButton(field);
    return;
  }

  const chipBox = event.target.closest?.("[data-subnet-chipbox]");
  if (chipBox) {
    const field = chipBox.getAttribute("data-subnet-chipbox");
    getSubnetScrollState(field).chipTop = chipBox.scrollTop;
  }
}

function onDrawerInteraction(event) {
  const drawerEl = getDrawerEl();
  if (!drawerEl || !drawerEl.contains(event.target)) return;

  const actionEl = event.target.closest("[data-drawer-action]");
  if (actionEl) {
    const action = actionEl.getAttribute("data-drawer-action");
    if (action === "close") {
      closeDrawer();
      return;
    }
    if (action === "edit") {
      alertsUiState.drawerEditMode = true;
      alertsUiState.openCombobox = null;
      renderDrawer();
      return;
    }
    if (action === "cancel") {
      alertsUiState.drawerEditMode = false;
      alertsUiState.openCombobox = null;
      primeDrawerFromRule(alertsUiState.drawerRuleId);
      renderDrawer();
      return;
    }
    if (action === "save") {
      saveDrawerChanges();
      return;
    }
    if (action === "toggle-enabled" && alertsUiState.drawerEditMode) {
      alertsUiState.drawerDraft.enabled = !alertsUiState.drawerDraft.enabled;
      renderDrawer();
      return;
    }
  }

  const comboboxButton = event.target.closest("[data-open-combobox]");
  if (comboboxButton && alertsUiState.drawerEditMode) {
    const field = comboboxButton.getAttribute("data-open-combobox");
    alertsUiState.openCombobox =
      alertsUiState.openCombobox === field ? null : field;
    alertsUiState.openSubnetField = field;
    alertsUiState.subnetSearch = "";
    alertsUiState.subnetManualInput = "";
    renderDrawer();
    return;
  }

  const optionEl = event.target.closest("[data-combobox-option]");
  if (optionEl && alertsUiState.drawerEditMode) {
    const field = optionEl.getAttribute("data-combobox-option");
    const value = optionEl.getAttribute("data-combobox-value");
    if (field === "versionId") {
      alertsUiState.drawerDraft.versionId = value;
    }
    if (field === "schedule") {
      alertsUiState.drawerDraft.schedule = value;
    }
    if (field === "timeRange") {
      alertsUiState.drawerDraft.timeRange = value;
    }
    if (field === "severityOverride") {
      alertsUiState.drawerDraft.severityOverride = value;
    }
    if (field === "quota") {
      alertsUiState.drawerDraft.quota = value;
    }
    if (field === "protocols") {
      alertsUiState.drawerDraft.protocols = value;
    }
    alertsUiState.openCombobox = null;
    renderDrawer();
    return;
  }

  const copyEl = event.target.closest("[data-copy-version-hash]");
  if (copyEl) {
    const hash = copyEl.getAttribute("data-copy-version-hash");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(hash).then(() => {
        if (typeof showToast === "function") {
          showToast("Version hash copied", hash);
        }
      });
    } else if (typeof showToast === "function") {
      showToast("Copy unavailable", hash);
    }
    return;
  }

  const subnetOption = event.target.closest("[data-subnet-option]");
  if (subnetOption && alertsUiState.drawerEditMode) {
    const field = subnetOption.getAttribute("data-subnet-option");
    const cidr = subnetOption.getAttribute("data-subnet-cidr");
    toggleSubnetOption(field, cidr);
    renderDrawer();
    return;
  }

  const subnetSelectAll = event.target.closest("[data-subnet-select-all]");
  if (subnetSelectAll && alertsUiState.drawerEditMode) {
    const field = subnetSelectAll.getAttribute("data-subnet-select-all");
    toggleSelectAllSubnets(field);
    renderDrawer();
    return;
  }

  const subnetModeOption = event.target.closest("[data-subnet-mode]");
  if (subnetModeOption && alertsUiState.drawerEditMode) {
    const field = subnetModeOption.getAttribute("data-subnet-mode");
    const mode = subnetModeOption.getAttribute("data-subnet-mode-value");
    setSubnetMode(field, mode);
    renderDrawer();
    return;
  }

  const subnetJump = event.target.closest("[data-subnet-jump]");
  if (subnetJump) {
    const field = subnetJump.getAttribute("data-subnet-jump");
    const target = subnetJump.getAttribute("data-subnet-jump-target");
    jumpSubnetPanels(field, target);
    return;
  }

  const removeManual = event.target.closest("[data-remove-manual-subnet]");
  if (removeManual && alertsUiState.drawerEditMode) {
    const field = removeManual.getAttribute("data-remove-manual-subnet");
    const cidr = removeManual.getAttribute("data-remove-cidr");
    removeManualSubnet(field, cidr);
    renderDrawer();
  }
}

function onDrawerInput(event) {
  const drawerEl = getDrawerEl();
  if (!drawerEl || !drawerEl.contains(event.target)) return;
  if (!alertsUiState.drawerEditMode || !alertsUiState.drawerDraft) return;

  const draftInput = event.target.closest("[data-drawer-input]");
  if (draftInput) {
    const field = draftInput.getAttribute("data-drawer-input");
    if (field === "threshold") {
      alertsUiState.drawerDraft.threshold = Math.max(
        1,
        Number(draftInput.value) || 1,
      );
    }
    if (field === "ports") {
      alertsUiState.drawerDraft.ports = draftInput.value;
    }
    return;
  }

  const subnetSearchInput = event.target.closest("[data-subnet-search-input]");
  if (subnetSearchInput) {
    alertsUiState.subnetSearch = subnetSearchInput.value;
    renderDrawer();
    return;
  }

  const subnetManualInput = event.target.closest("[data-subnet-manual-input]");
  if (subnetManualInput) {
    alertsUiState.subnetManualInput = subnetManualInput.value;
  }
}

function onDrawerKeydown(event) {
  const manualInput = event.target.closest("[data-subnet-manual-input]");
  if (!manualInput) return;
  if (!alertsUiState.drawerEditMode) return;

  if (event.key !== "Enter" && event.key !== ",") return;
  event.preventDefault();
  const field = manualInput.getAttribute("data-subnet-manual-input");
  addManualSubnet(field, manualInput.value);
  alertsUiState.subnetManualInput = "";
  renderDrawer();
}

function closeAlertsPopoversOnOutsideClick(event) {
  if (
    alertsUiState.openHostsAlertId &&
    !event.target.closest(".alerts-hosts-cell")
  ) {
    alertsUiState.openHostsAlertId = null;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
  }

  if (
    alertsUiState.openPaginationSizeForAlertId &&
    !event.target.closest(".alerts-pagination-controls")
  ) {
    alertsUiState.openPaginationSizeForAlertId = null;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
  }

  if (alertsUiState.openCombobox && !event.target.closest(".alerts-combobox")) {
    alertsUiState.openCombobox = null;
    renderDrawer();
  }
}

function onAlertingModalMessage(event) {
  if (!event?.data || typeof event.data !== "object") return;
  if (event.data.type !== "alerting-modal-close") return;
  closeManageModal();
}

function escapeCssId(id) {
  if (window.CSS && typeof window.CSS.escape === "function")
    return window.CSS.escape(id);
  return String(id).replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g, "\\$1");
}

function rewriteCssAssetUrls(source, stylesheetUrl) {
  return String(source).replace(
    /url\((['"]?)([^)'"]+)\1\)/g,
    (match, quote, rawUrl) => {
      const url = String(rawUrl || "").trim();
      if (
        !url ||
        url.startsWith("data:") ||
        url.startsWith("http:") ||
        url.startsWith("https:") ||
        url.startsWith("file:") ||
        url.startsWith("#") ||
        url.startsWith("/")
      ) {
        return match;
      }
      const absoluteUrl = new URL(url, stylesheetUrl).toString();
      const wrappedQuote = quote || '"';
      return `url(${wrappedQuote}${absoluteUrl}${wrappedQuote})`;
    },
  );
}

const ALERTING_INLINE_HANDLER_ATTRIBUTES = [
  "onclick",
  "oninput",
  "onchange",
  "onkeydown",
  "onkeyup",
  "onmouseover",
  "onmouseout",
];

function prefixAlertingInlineHandlerExpression(expression, escapedFunctionPattern) {
  const value = String(expression ?? "");
  if (!value || !escapedFunctionPattern) return value;
  if (/window\.__alertingInlineApi\./.test(value)) return value;
  return value.replace(
    new RegExp(`(^|[;]\\s*)(${escapedFunctionPattern})(\\s*\\()`, "g"),
    `$1window.__alertingInlineApi.$2$3`,
  );
}

function syncAlertingInlineHandlerAttributes(root, escapedFunctionPattern) {
  if (!root || !escapedFunctionPattern) return;

  const syncElement = (element) => {
    if (!(element instanceof Element)) return;
    ALERTING_INLINE_HANDLER_ATTRIBUTES.forEach((attr) => {
      const currentValue = element.getAttribute(attr);
      if (!currentValue) return;
      const nextValue = prefixAlertingInlineHandlerExpression(
        currentValue,
        escapedFunctionPattern,
      );
      if (nextValue !== currentValue) {
        element.setAttribute(attr, nextValue);
      }
    });
  };

  if (root instanceof Element) {
    syncElement(root);
    root
      .querySelectorAll(
        ALERTING_INLINE_HANDLER_ATTRIBUTES.map((attr) => `[${attr}]`).join(","),
      )
      .forEach(syncElement);
    return;
  }

  if (root instanceof ShadowRoot || root instanceof DocumentFragment) {
    root
      .querySelectorAll(
        ALERTING_INLINE_HANDLER_ATTRIBUTES.map((attr) => `[${attr}]`).join(","),
      )
      .forEach(syncElement);
  }
}

async function mountAlertingInlineModal(options = {}) {
  const forceRemount = Boolean(options.forceRemount);
  const context = normalizeAlertingInlineContext(options.context);
  window.__alertingInlineContext = context;
  const hostEl = getAlertingInlineRootEl();
  if (!hostEl) return;
  if (forceRemount) {
    hostEl.__alertingInlineObserver?.disconnect?.();
    hostEl.__alertingInlineObserver = null;
    hostEl.replaceChildren();
    hostEl.dataset.mounted = "false";
  }
  if (hostEl.dataset.mounted === "true") return;
  if (alertingInlineMountPromise) {
    await alertingInlineMountPromise;
    return;
  }

  alertingInlineMountPromise = (async () => {
    const modalUrl = new URL("../alerting-modal/alert-modal.html", window.location.href);
    modalUrl.searchParams.set("surface", context.surface);
    modalUrl.searchParams.set("embed", "viewer");
    modalUrl.searchParams.set("v", "20260427-icon-colored-buttons-1");

    const iframe = document.createElement("iframe");
    iframe.className = "alerting-inline-frame";
    iframe.src = modalUrl.toString();
    iframe.setAttribute("title", context.surface === "workspace-variables" ? "Variables" : "Manage Alerts");
    iframe.setAttribute("loading", "eager");
    iframe.setAttribute("referrerpolicy", "same-origin");
    hostEl.replaceChildren(iframe);
    hostEl.dataset.mounted = "true";
  })().finally(() => {
    alertingInlineMountPromise = null;
  });

  await alertingInlineMountPromise;
}

function initAlertsFeature() {
  if (alertsUiState.initialized) return;
  alertsUiState.initialized = true;

  const toolbarSearchInput = document.getElementById(
    "alertsToolbarSearchInput",
  );
  const ruleSearchInput = document.getElementById("alertsRuleSearchInput");
  const groupSearchInput = document.getElementById(
    "alertsRuleGroupSearchInput",
  );
  const manageButton = getManageButtonEl();
  const workspaceVariablesButton = document.getElementById(
    "workspaceVariablesButton",
  );
  const modalEl = getManageModalEl();
  const tableRootEl = getAlertsTableRootEl();

  manageButton?.addEventListener("click", () =>
    openManageModal(alertsUiState.selectedRuleId, false),
  );
  workspaceVariablesButton?.addEventListener("click", () =>
    openWorkspaceVariablesModal(),
  );

  modalEl?.addEventListener("click", (event) => {
    if (event.target === modalEl) closeManageModal();
  });
  window.addEventListener("message", onAlertingModalMessage);
  mountAlertingInlineModal().catch((error) => {
    console.error("Failed to mount inline Alerting modal", error);
  });

  toolbarSearchInput?.addEventListener("input", (event) => {
    alertsUiState.toolbarQuery = event.target.value;
    renderAlertsTable(
      getEffectiveSnapshot(getCurrentView()),
      getEffectiveSnapshot(getCurrentView())?.activePanelTabs?.main,
    );
  });

  ruleSearchInput?.addEventListener("input", (event) => {
    alertsUiState.ruleSearchQuery = event.target.value;
    renderRuleTable();
  });

  groupSearchInput?.addEventListener("input", (event) => {
    alertsUiState.groupSearchQuery = event.target.value;
    renderRuleGroups();
  });

  tableRootEl?.addEventListener("click", onAlertsTableClick);
  tableRootEl?.addEventListener("input", onAlertsTableInput);

  document
    .getElementById("alertsRuleGroupList")
    ?.addEventListener("click", onRuleSidebarInteraction);
  document
    .getElementById("alertsRuleTableShell")
    ?.addEventListener("click", onRuleSidebarInteraction);

  const drawerEl = getDrawerEl();
  drawerEl?.addEventListener("click", onDrawerInteraction);
  drawerEl?.addEventListener("input", onDrawerInput);
  drawerEl?.addEventListener("keydown", onDrawerKeydown);
  drawerEl?.addEventListener("scroll", onDrawerScroll, true);

  document.addEventListener("click", closeAlertsPopoversOnOutsideClick);

  renderRuleGroups();
  renderRuleTable();
  renderDrawer();
}

window.initAlertsFeature = initAlertsFeature;
window.renderAlertsTable = renderAlertsTable;
window.handleAlertsEscape = handleAlertsEscape;
