/* Alerting modal content browser runtime. */

const SURI_ICON_FOLDER_SRC = resolveIconPath(
  "ui_core/collection/icon_folder.svg",
);
const SURI_ICON_RELATED_SID_SRC = resolveIconPath(
  "ui_core/collection/icon_routing_change.svg",
);
const SURI_RULES_DELETE_ICON_SRC = resolveIconPath("icon_delete.svg");
const SURI_RULES_EXPORT_ICON_SRC = resolveIconPath("icon_export_file.svg");
const SURI_RULES_MEATBALL_ICON_SRC = resolveIconPath("icon_meatball.svg");
const RULE_SELECTION_RIBBON_MENU_ID = "multiSelectRibbonMenu";
const RULE_SELECTION_RIBBON_MENU_BUTTON_ID = "multiSelectRibbonMenuButton";

function createTreeNode(config) {
  return {
    id: config.id,
    label: config.label,
    count: config.count ?? "",
    source: config.source || "Suricata",
    kind: config.kind || "folder",
    editable: Boolean(config.editable),
    readOnly: Boolean(config.readOnly),
    allowChildren: Boolean(config.allowChildren),
    children: Array.isArray(config.children) ? config.children : [],
  };
}

const teleseerNodes = [
  createTreeNode({
    id: "teleseer-default-alerts",
    label: "Default Alerts",
    count: 8,
    source: "Teleseer",
    kind: "default-alerts",
  }),
  createTreeNode({
    id: "teleseer-untitled-alert-group",
    label: "Untitled Alert Group",
    count: 0,
    source: "Teleseer",
    kind: "default-alerts",
  }),
];

const suricataRoots = [
  createTreeNode({
    id: "suricata-etp-root",
    label: "Emerging Threats Pro",
    count: "",
    source: "Emerging Threats PRO",
    readOnly: true,
    allowChildren: true,
    children: [
      createTreeNode({
        id: "suricata-etp-active-threats",
        label: "Active Threats",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-active-threats-malware", label: "Malware", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-exploit", label: "Exploit", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-exploit-kit", label: "Exploit-Kit", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-phishing", label: "Phishing", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-botcc", label: "Botcc", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-botcc-portgrouped", label: "Botcc Portgrouped", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-worm", label: "Worm", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-shellcode", label: "Shellcode", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-mobile-malware", label: "Mobile Malware", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-coinmining", label: "Coinmining", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-active-threats-compromised", label: "Compromised", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-c2-reputation",
        label: "C2 & Reputation",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-c2-ciarmy", label: "CIArmy", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-c2-drop-spamhaus", label: "Drop (Spamhaus)", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-c2-dshield", label: "Dshield", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-c2-tor", label: "TOR", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-c2-threatview-cs-c2", label: "Threatview_CS_c2", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-scanning-dos",
        label: "Scanning & DoS",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-scanning-dos-scan", label: "SCAN", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-scanning-dos-dos", label: "DOS", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-scanning-dos-attack-response", label: "Attack Response", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-web",
        label: "Web",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-web-client", label: "Web Client", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-web-server", label: "Web Server", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-web-specific-apps", label: "Web Specific Apps", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-network-services",
        label: "Network Services",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-network-services-dns", label: "DNS", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-smtp", label: "SMTP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-ftp", label: "FTP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-netbios", label: "NETBIOS", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-rpc", label: "RPC", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-voip", label: "VOIP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-sql", label: "SQL", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-snmp", label: "SNMP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-imap", label: "IMAP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-pop3", label: "POP3", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-icmp", label: "ICMP", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-telnet", label: "TELNET", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-network-services-tftp", label: "TFTP", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-policy-visibility",
        label: "Policy & Visibility",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-policy-visibility-infor", label: "Infor", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-hunting", label: "Hunting", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-p2p", label: "P2P", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-chat", label: "Chat", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-games", label: "Games", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-user-agents", label: "User Agents", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-file-sharing", label: "FILE_SHARING", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-remote-access", label: "REMOTE_ACCESS", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-dyn-dns", label: "DYN_DNS", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-abused-service", label: "TA_ABUSED_SERVICE", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-inappropriate", label: "Inappropriate", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-policy-visibility-policy", label: "Policy", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-industrial-scada",
        label: "Industrial & SCADA",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-industrial-scada-scada", label: "SCADA", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-industrial-scada-special", label: "SCADA_special", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({
        id: "suricata-etp-operational",
        label: "Operational",
        count: "",
        source: "Emerging Threats PRO",
        readOnly: true,
        allowChildren: true,
        children: [
          createTreeNode({ id: "suricata-etp-operational-current-events", label: "Current Events", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-operational-ja3", label: "JA3", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-operational-misc", label: "Misc", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-operational-activex", label: "ActiveX", count: "", source: "Emerging Threats PRO", readOnly: true }),
          createTreeNode({ id: "suricata-etp-operational-adware-pup", label: "Adware-PUP", count: "", source: "Emerging Threats PRO", readOnly: true }),
        ],
      }),
      createTreeNode({ id: "suricata-etp-inactive", label: "Inactive", count: "", source: "Emerging Threats PRO", readOnly: true }),
    ],
  }),
  createTreeNode({
    id: "suricata-custom-root",
    label: "My Custom Detections",
    count: "",
    source: "Custom Detection",
    editable: true,
    allowChildren: true,
    children: [
      createTreeNode({ id: "suricata-custom-policy-enforcement", label: "Policy Enforcement", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-rmf-compliance", label: "RMF Compliance", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-network-hygiene", label: "Network Hygiene", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-command-control", label: "Command & Control", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-dns-monitoring", label: "DNS Monitoring", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-app-performance", label: "App Performance", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
      createTreeNode({ id: "suricata-custom-operational-visibility", label: "Operational Visibility", count: "", source: "Custom Detection", editable: true, allowChildren: true }),
    ],
  }),
  createTreeNode({
    id: "suricata-imported-root",
    label: "Imported 2025-03-01",
    count: "",
    source: "Imported 2025-03-01",
    readOnly: true,
  }),
];

const sidebarData = {
  teleseer: { name: "Teleseer", items: teleseerNodes },
  suricata: { name: "Suricata", roots: suricataRoots },
};

const sidebarState = {
  teleseerExpanded: true,
  suricataExpanded: true,
  selectedCategory: "Emerging Threats Pro",
  selectedSource: "Emerging Threats PRO",
  selectedNodeId: "suricata-etp-root",
  selectedQuickAction: null,
  renameNodeId: null,
  renameDraft: "",
  expandedTreeNodes: {},
};

const toolbarState = {
  sortColumn: "none",
  sortDirection: "none", // "none" | "asc" | "desc" — "none" means no active sort
  group: "none",
};
const SURI_SORT_COLUMN_OPTIONS = [
  { value: "sid", label: "SID" },
  { value: "action", label: "Action" },
  { value: "name", label: "Name" },
  { value: "class", label: "Class" },
  { value: "speed", label: "Speed" },
  { value: "lastSeen", label: "Last Seen" },
  { value: "hits", label: "Hits" },
];
const SURI_SORT_DIRECTION_OPTIONS = [
  { value: "asc", label: "Ascending", meta: "A → Z" },
  { value: "desc", label: "Descending", meta: "Z → A" },
];
const SURI_GROUP_OPTIONS = [
  { value: "none", label: "None" },
  { value: "action", label: "Action" },
  { value: "class", label: "Class" },
  { value: "status", label: "Status" },
  { value: "folder", label: "Folder" },
];
const SURI_VIEW_SETTING_COLUMNS = [
  { key: "sid", label: "SID" },
  { key: "action", label: "Action" },
  { key: "name", label: "Name" },
  { key: "class", label: "Class" },
  { key: "speed", label: "Speed" },
  { key: "lastSeen", label: "Last Hit" },
  { key: "status", label: "Status" },
];
const suricataViewSettingsState = {
  sid: true,
  action: true,
  name: true,
  class: true,
  speed: true,
  lastSeen: true,
  hits: true,
  status: true,
};

function collectLeafTreeNodes(node) {
  if (!node) return [];
  if (!Array.isArray(node.children) || !node.children.length) return [node];
  return node.children.flatMap((child) => collectLeafTreeNodes(child));
}

function hashTreeValue(value = "") {
  return Array.from(String(value)).reduce(
    (hash, character) => ((hash * 33) + character.charCodeAt(0)) >>> 0,
    5381,
  );
}

function formatRelativeRuleAge(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) return "-";
  if (minutes === 0) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  if (minutes < 10080) return `${Math.round(minutes / 1440)}d ago`;
  return `${Math.round(minutes / 10080)}w ago`;
}

const SURI_ETP_SPECIFIC_TITLES = {
  "suricata-etp-active-threats-malware": [
    "SocGholish stager retrieval over HTTP",
    "RedLine stealer ZIP payload delivery",
  ],
  "suricata-etp-active-threats-exploit": [
    "Fortinet FortiOS SSL-VPN heap overflow probe",
    "Citrix ADC path traversal exploit attempt",
  ],
  "suricata-etp-active-threats-exploit-kit": [
    "RIG exploit kit landing page redirect",
    "Fallout exploit kit iframe delivery chain",
  ],
  "suricata-etp-active-threats-phishing": [
    "Credential-harvest redirect to fake SSO",
    "Office 365 phishing kit static asset fetch",
  ],
  "suricata-etp-active-threats-botcc": [
    "Known botnet controller check-in over TLS",
    "Fast-flux botnet command poll over HTTP",
  ],
  "suricata-etp-active-threats-botcc-portgrouped": [
    "Botnet controller reachback on grouped service ports",
    "Port-grouped command channel handshake",
  ],
  "suricata-etp-active-threats-worm": [
    "SMB worm propagation across internal subnets",
    "Mass exploitation spray from infected peer",
  ],
  "suricata-etp-active-threats-shellcode": [
    "Heap-spray shellcode fragment in HTTP response",
    "Inline shellcode marker in archive delivery stream",
  ],
  "suricata-etp-active-threats-mobile-malware": [
    "Android banker payload fetch over APK mirror",
    "Mobile spyware callback to hardcoded gateway",
  ],
  "suricata-etp-active-threats-coinmining": [
    "Stratum mining job request from workstation subnet",
    "XMRig wallet beacon over encrypted tunnel",
  ],
  "suricata-etp-active-threats-compromised": [
    "Known compromised host beacon to external relay",
    "Previously compromised asset reaching takedown sinkhole",
  ],
  "suricata-etp-c2-ciarmy": [
    "CIArmy blocklist destination reached from server tier",
    "CIArmy-listed IP contacted during outbound session",
  ],
  "suricata-etp-c2-drop-spamhaus": [
    "Spamhaus DROP address observed on egress flow",
    "DROP-listed destination matched on outbound TLS session",
  ],
  "suricata-etp-c2-dshield": [
    "DShield top attacker source seen against edge segment",
    "DShield-listed scanner contacting management plane",
  ],
  "suricata-etp-c2-tor": [
    "TOR exit node reached from protected workload",
    "TOR relay bootstrap traffic from internal host",
  ],
  "suricata-etp-c2-threatview-cs-c2": [
    "Threatview C2 infrastructure hit on outbound request",
    "Threatview C2 domain match over DNS lookup",
  ],
  "suricata-etp-scanning-dos-scan": [
    "Masscan SYN sweep across internal management segment",
    "Service enumeration burst against exposed application ports",
  ],
  "suricata-etp-scanning-dos-dos": [
    "HTTP flood pattern against public reverse proxy",
    "TCP resource exhaustion burst against VPN concentrator",
  ],
  "suricata-etp-scanning-dos-attack-response": [
    "Attack-response tool fetch detected after exploitation",
    "Operator staging command artifact retrieved post-intrusion",
  ],
  "suricata-etp-web-client": [
    "Malicious browser exploit redirect to drive-by landing page",
    "Suspicious archive download initiated from browser context",
  ],
  "suricata-etp-web-server": [
    "Apache Log4j JNDI lookup attempt against public endpoint",
    "MoveIT Transfer SQL injection probe to upload path",
  ],
  "suricata-etp-web-specific-apps": [
    "Confluence OGNL exploitation request against collaboration tier",
    "SharePoint webshell deployment pattern on admin route",
  ],
  "suricata-etp-network-services-dns": [
    "High-entropy DNS tunnel query to newly observed domain",
    "DNS TXT burst consistent with command retrieval",
  ],
  "suricata-etp-network-services-smtp": [
    "SMTP RCPT burst consistent with outbound spam relay",
    "Suspicious attachment exfiltration over authenticated SMTP",
  ],
  "suricata-etp-network-services-ftp": [
    "Anonymous FTP credential spray against legacy appliance",
    "FTP bounce-scan technique against internal service",
  ],
  "suricata-etp-network-services-netbios": [
    "NETBIOS name service sweep across workstation segment",
    "Unexpected SMB browser election traffic on server VLAN",
  ],
  "suricata-etp-network-services-rpc": [
    "MSRPC endpoint mapper abuse toward domain controller",
    "RPC interface enumeration from non-admin workstation",
  ],
  "suricata-etp-network-services-voip": [
    "SIP brute-force registration against voice gateway",
    "Suspicious RTP signaling mismatch on PBX edge",
  ],
  "suricata-etp-network-services-sql": [
    "SQL injection probe reaching internal database listener",
    "Direct MSSQL login burst against production cluster",
  ],
  "suricata-etp-network-services-snmp": [
    "SNMP community string guessing against router fabric",
    "SNMP bulk-walk from unauthorized monitoring host",
  ],
  "suricata-etp-network-services-imap": [
    "IMAP credential spray against mail access tier",
    "Suspicious mailbox sync burst from newly seen client",
  ],
  "suricata-etp-network-services-pop3": [
    "POP3 legacy auth brute-force against shared mailbox",
    "POP3 cleartext login from high-risk egress node",
  ],
  "suricata-etp-network-services-icmp": [
    "ICMP reconnaissance sweep across address pool",
    "Large ICMP payload burst consistent with tunnel test",
  ],
  "suricata-etp-network-services-telnet": [
    "Telnet credential spray against unmanaged appliance",
    "Interactive Telnet session opened from restricted segment",
  ],
  "suricata-etp-network-services-tftp": [
    "TFTP configuration pull from infrastructure device",
    "Unauthorized TFTP boot image request on server LAN",
  ],
  "suricata-etp-policy-visibility-hunting": [
    "JA4 mismatch tied to suspected red-team staging",
    "Rare outbound JA3 fingerprint on workstation fleet",
  ],
  "suricata-etp-policy-visibility-remote-access": [
    "Unexpected remote access tooling over HTTPS",
    "Admin remote-control session from unmanaged endpoint",
  ],
  "suricata-etp-policy-visibility-dyn-dns": [
    "Dynamic DNS lookup to newly registered service",
    "Frequent DDNS refresh consistent with C2 fallback",
  ],
  "suricata-etp-industrial-scada-scada": [
    "Modbus write-multiple-registers request to PLC",
    "DNP3 control relay output block command observed",
  ],
  "suricata-etp-industrial-scada-special": [
    "SCADA protocol anomaly on engineering workstation",
    "Vendor-specific control frame outside maintenance window",
  ],
  "suricata-etp-operational-current-events": [
    "Current campaign IOC hit for exposed edge service",
    "Vendor emergency bulletin signature on perimeter sensor",
  ],
  "suricata-etp-operational-ja3": [
    "Rare JA3 fingerprint associated with AsyncRAT cluster",
    "TLS client hello matched high-risk operator tooling",
  ],
};

const SURI_DUPLICATED_RULE_SOURCE_NODES = new Set([
  "suricata-etp-policy-visibility-hunting",
  "suricata-etp-web-server",
  "suricata-imported-root",
]);

function getEtpRuleProfile(nodeId) {
  if (nodeId.includes("active-threats")) {
    return { family: "active-threats", classType: "Trojan Activity", action: "Alert", rulesPerLeaf: 56, hitsBase: 120, hitsRange: 880, speedBase: 6, speedRange: 96 };
  }
  if (nodeId.includes("c2-")) {
    return { family: "c2", classType: "Bad Known", action: "Alert", rulesPerLeaf: 36, hitsBase: 80, hitsRange: 520, speedBase: 4, speedRange: 42 };
  }
  if (nodeId.includes("scanning-dos")) {
    return { family: "scanning", classType: "Attempted Recon", action: "Alert", rulesPerLeaf: 32, hitsBase: 44, hitsRange: 390, speedBase: 6, speedRange: 48 };
  }
  if (nodeId.includes("web-")) {
    return { family: "web", classType: "Web Application Attack", action: "Alert", rulesPerLeaf: 44, hitsBase: 70, hitsRange: 610, speedBase: 8, speedRange: 74 };
  }
  if (nodeId.includes("network-services")) {
    return { family: "network-services", classType: "Protocol Command Decode", action: "Alert", rulesPerLeaf: 42, hitsBase: 30, hitsRange: 240, speedBase: 5, speedRange: 38 };
  }
  if (nodeId.includes("policy-visibility")) {
    return { family: "policy", classType: "Policy Violation", action: "Alert", rulesPerLeaf: 38, hitsBase: 18, hitsRange: 190, speedBase: 6, speedRange: 34 };
  }
  if (nodeId.includes("industrial-scada")) {
    return { family: "scada", classType: "Attempted Information Leak", action: "Alert", rulesPerLeaf: 20, hitsBase: 5, hitsRange: 42, speedBase: 10, speedRange: 54 };
  }
  if (nodeId.includes("operational")) {
    return { family: "operational", classType: "Misc Activity", action: "Alert", rulesPerLeaf: 28, hitsBase: 16, hitsRange: 144, speedBase: 4, speedRange: 28 };
  }
  if (nodeId.includes("inactive")) {
    return { family: "inactive", classType: "Misc Activity", action: "Pass", rulesPerLeaf: 16, hitsBase: 1, hitsRange: 6, speedBase: 3, speedRange: 14 };
  }
  return { family: "misc", classType: "Misc Activity", action: "Alert", rulesPerLeaf: 20, hitsBase: 10, hitsRange: 80, speedBase: 5, speedRange: 20 };
}

const ETP_RULE_TITLE_PREFIXES = [
  "Managed",
  "Scoped",
  "Persistent",
  "Adaptive",
  "Correlated",
  "Escalated",
];

const ETP_RULE_TITLE_SUFFIXES = {
  "active-threats": [
    "on perimeter telemetry",
    "from restricted VLAN",
    "across approved egress",
    "toward cloud relay",
    "from managed endpoint",
    "during after-hours activity",
    "against high-value subnet",
    "with recurring operator cadence",
  ],
  c2: [
    "to watched infrastructure",
    "through sanctioned proxy path",
    "from analyst-tagged host",
    "against denylisted destination",
    "over intermittent beacon window",
    "with repeated JA3 overlap",
    "during campaign surge",
    "over newly observed tunnel",
  ],
  scanning: [
    "on exposed service group",
    "from mis-scoped maintenance host",
    "against internet-facing asset",
    "during off-window activity",
    "with lateral movement pattern",
    "on administrative interface",
    "against remote access tier",
    "from unmanaged scanner",
  ],
  web: [
    "on customer-facing path",
    "against checkout application",
    "through authentication edge",
    "on exposed API gateway",
    "against legacy application pool",
    "through partner ingress",
    "on shared reverse proxy",
    "with repeated session reuse",
  ],
  "network-services": [
    "against core service path",
    "from unmanaged appliance",
    "over east-west segment",
    "through remote branch link",
    "against privileged endpoint",
    "with repeated auth failure",
    "on monitored control plane",
    "across shared service tier",
  ],
  policy: [
    "from restricted enclave",
    "across monitored workspace boundary",
    "during exception window",
    "on analyst-owned segment",
    "over privileged admin path",
    "against approved-use baseline",
    "through monitored egress policy",
    "with known application drift",
  ],
  scada: [
    "on plant network segment",
    "against engineering workstation",
    "through historian relay",
    "from vendor support path",
    "on safety controller tier",
    "during maintenance session",
    "through field gateway",
    "on isolated OT enclave",
  ],
  operational: [
    "for campaign watchlist",
    "on triaged operator host",
    "through sanctioned jump box",
    "with repeat analyst interest",
    "on perimeter visibility feed",
    "during active investigation",
    "through mirrored sensor path",
    "for retrospective review",
  ],
  inactive: [
    "retained for retrohunt",
    "kept for archive correlation",
    "awaiting retirement approval",
    "preserved from prior feed",
    "staged for cleanup pass",
    "held under historical baseline",
    "retained for overlap check",
    "pending decommission window",
  ],
  misc: [
    "on monitored asset group",
    "during operator review",
    "within scoped network slice",
    "over shared service path",
    "against controlled baseline",
    "through mirrored traffic set",
    "for workspace tuning",
    "with recurring telemetry hit",
  ],
};

function buildEtpRuleTitle(node, family, index, specificTitles = []) {
  if (index < specificTitles.length) {
    return specificTitles[index];
  }
  const generatedIndex = index - specificTitles.length;
  const baseTitle = buildGenericEtpRuleTitle(node, family, generatedIndex % 2);
  const suffixes = ETP_RULE_TITLE_SUFFIXES[family] || ETP_RULE_TITLE_SUFFIXES.misc;
  const suffix = suffixes[generatedIndex % suffixes.length];
  const prefix = ETP_RULE_TITLE_PREFIXES[
    Math.floor(generatedIndex / suffixes.length) % ETP_RULE_TITLE_PREFIXES.length
  ];
  return `${prefix} ${baseTitle} ${suffix}`;
}

function buildGenericEtpRuleTitle(node, family, index) {
  const leaf = node.label;
  if (family === "active-threats") {
    return index === 0
      ? `${leaf} payload staging over outbound session`
      : `${leaf} beacon callback on encrypted channel`;
  }
  if (family === "c2") {
    return index === 0
      ? `${leaf} reputation hit on egress connection`
      : `${leaf} command channel reachability from internal host`;
  }
  if (family === "scanning") {
    return index === 0
      ? `${leaf} reconnaissance burst against exposed service`
      : `${leaf} service enumeration against administrative segment`;
  }
  if (family === "web") {
    return index === 0
      ? `${leaf} exploit probe against public application`
      : `${leaf} suspicious web response pattern on application tier`;
  }
  if (family === "network-services") {
    return index === 0
      ? `${leaf} protocol abuse against exposed service`
      : `${leaf} authentication burst against ${leaf.toLowerCase()} service`;
  }
  if (family === "policy") {
    return index === 0
      ? `${leaf} policy visibility match on managed traffic`
      : `${leaf} unexpected application usage from restricted segment`;
  }
  if (family === "scada") {
    return index === 0
      ? `${leaf} control-system protocol anomaly`
      : `${leaf} engineering workstation command pattern`;
  }
  if (family === "operational") {
    return index === 0
      ? `${leaf} campaign indicator on perimeter telemetry`
      : `${leaf} suspicious operator tradecraft artifact`;
  }
  if (family === "inactive") {
    return `${leaf} retired provider signature observed`;
  }
  return `${leaf} suspicious activity observed`;
}

function buildEtpRuleDescription(node, family, title) {
  const path = getNodePathLabels(node.id).slice(0, -1).join(" / ");
  const folderContext = path ? `${path} / ${node.label}` : node.label;
  if (family === "network-services") {
    return `ET Pro rule for ${folderContext} traffic. Triggered by ${title.toLowerCase()}.`;
  }
  if (family === "policy") {
    return `ET Pro visibility rule for ${folderContext}. Keeps application-policy telemetry connected to the Alerts tab.`;
  }
  if (family === "inactive") {
    return `Legacy ET Pro signature retained in ${folderContext} for retrospective search only.`;
  }
  return `ET Pro signature in ${folderContext}. Triggered by ${title.toLowerCase()}.`;
}

function getEtpRuleStateTags(node, family, seed) {
  if (family === "network-services" && seed % 19 === 0) {
    return [{ label: "Broken", tone: "danger" }];
  }
  return [];
}

function buildEtProRuleSeeds() {
  const etpRoot = suricataRoots.find((node) => node.id === "suricata-etp-root");
  const leaves = collectLeafTreeNodes(etpRoot);
  let sidCounter = 2024800;
  return leaves.flatMap((node) => {
    const profile = getEtpRuleProfile(node.id);
    const specificTitles = SURI_ETP_SPECIFIC_TITLES[node.id] || [];
    return Array.from({ length: profile.rulesPerLeaf }, (_, index) => {
      const title = buildEtpRuleTitle(node, profile.family, index, specificTitles);
      const seed = hashTreeValue(`${node.id}:${index}`);
      const minutes = profile.family === "inactive"
        ? 2880 + (seed % 12000)
        : seed % 960;
      const totalHits = profile.hitsBase + (seed % profile.hitsRange);
      const speedValue = profile.speedBase + (seed % profile.speedRange);
      const relatedSid = sidCounter++;
      const sid = sidCounter++;
      const enabled = (seed % 4) !== 0;
      return {
        id: sid,
        folderNodeId: node.id,
        originFolderNodeId: node.id,
        source: "Emerging Threats PRO",
        name: title,
        description: buildEtpRuleDescription(node, profile.family, title),
        action: profile.action,
        sid,
        relatedSid,
        classType: profile.classType,
        speed: `${speedValue}µs`,
        speedValue,
        lastSeen: formatRelativeRuleAge(minutes),
        lastSeenValue: minutes,
        totalHits,
        enabled,
        editable: false,
        ruleStateTags: getEtpRuleStateTags(node, profile.family, seed),
        statusDot: enabled ? "green" : "gray",
        folderLabel: getDisplayFolderLabel(node.id),
      };
    });
  });
}

function buildImportedRuleSeeds() {
  return [
    {
      id: 3200001,
      folderNodeId: "suricata-imported-root",
      originFolderNodeId: "suricata-imported-root",
      source: "Imported 2025-03-01",
      name: "Community DNS tunneling candidate over TXT burst",
      description: "Imported community rule retained for triage against suspicious DNS tunneling activity.",
      action: "Alert",
      sid: 3200001,
      relatedSid: 2054011,
      classType: "Potentially Bad Traffic",
      speed: "11µs",
      speedValue: 11,
      lastSeen: "3d ago",
      lastSeenValue: 4320,
      totalHits: 46,
      enabled: false,
      ruleStateTags: [],
      statusDot: "gray",
      folderLabel: "Imported 2025-03-01",
    },
    {
      id: 3200002,
      folderNodeId: "suricata-imported-root",
      originFolderNodeId: "suricata-etp-network-services-dns",
      source: "Imported 2025-03-01",
      name: "DNS beaconing pattern retained for workspace tuning",
      description: "Imported rule preserved from a managed DNS signature for workspace review and exception tracking.",
      action: "Alert",
      sid: 3200002,
      relatedSid: 2026901,
      classType: "Potentially Bad Traffic",
      speed: "17µs",
      speedValue: 17,
      lastSeen: "5h ago",
      lastSeenValue: 300,
      totalHits: 128,
      enabled: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "Imported 2025-03-01",
    },
    {
      id: 3200003,
      folderNodeId: "suricata-imported-root",
      originFolderNodeId: "suricata-etp-web-server",
      source: "Imported 2025-03-01",
      name: "IIS short-name enumeration imported for environment-specific exclusions",
      description: "Imported web rule retained from an upstream signature for workspace-specific review and exclusion planning.",
      action: "Alert",
      sid: 3200003,
      relatedSid: 2026914,
      classType: "Web Application Attack",
      speed: "23µs",
      speedValue: 23,
      lastSeen: "8m ago",
      lastSeenValue: 8,
      totalHits: 19,
      enabled: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "Imported 2025-03-01",
    },
    {
      id: 3200004,
      folderNodeId: "suricata-imported-root",
      originFolderNodeId: "suricata-imported-root",
      source: "Imported 2025-03-01",
      name: "Legacy SMB worm heuristic awaiting cleanup",
      description: "Imported rule left disabled pending review of a stale community feed set.",
      action: "Pass",
      sid: 3200004,
      relatedSid: 2100456,
      classType: "Misc Activity",
      speed: "9µs",
      speedValue: 9,
      lastSeen: "2w ago",
      lastSeenValue: 20160,
      totalHits: 7,
      enabled: false,
      ruleStateTags: [],
      statusDot: "gray",
      folderLabel: "Imported 2025-03-01",
    },
  ];
}

function buildCustomRuleSeeds() {
  return [
    {
      id: 3301001,
      folderNodeId: "suricata-custom-policy-enforcement",
      originFolderNodeId: "suricata-etp-policy-visibility-policy",
      source: "Custom Detection",
      name: "Outbound remote admin over non-standard port",
      description: "Local policy rule copied from ET visibility coverage and tuned for privileged admin subnets.",
      action: "Alert",
      sid: 3301001,
      relatedSid: 2024985,
      classType: "Policy Violation",
      speed: "29µs",
      speedValue: 29,
      lastSeen: "12m ago",
      lastSeenValue: 12,
      totalHits: 678,
      enabled: true,
      editable: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "Policy Enforcement",
    },
    {
      id: 3301002,
      folderNodeId: "suricata-custom-rmf-compliance",
      originFolderNodeId: "suricata-etp-policy-visibility-remote-access",
      source: "Custom Detection",
      name: "Unauthorized admin tooling crossing enclave boundary",
      description: "Compliance-focused rule tuned for remote administration outside approved RMF windows.",
      action: "Alert",
      sid: 3301002,
      relatedSid: 2024969,
      classType: "Policy Violation",
      speed: "34µs",
      speedValue: 34,
      lastSeen: "2h ago",
      lastSeenValue: 120,
      totalHits: 144,
      enabled: true,
      editable: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "RMF Compliance",
    },
    {
      id: 3301003,
      folderNodeId: "suricata-custom-network-hygiene",
      originFolderNodeId: "suricata-etp-scanning-dos-scan",
      source: "Custom Detection",
      name: "Exposed infrastructure scan over weekend maintenance window",
      description: "Operational hygiene rule for repeated exposure scans that violate maintenance baselines.",
      action: "Alert",
      sid: 3301003,
      relatedSid: 2024865,
      classType: "Attempted Recon",
      speed: "19µs",
      speedValue: 19,
      lastSeen: "6h ago",
      lastSeenValue: 360,
      totalHits: 221,
      enabled: true,
      editable: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "Network Hygiene",
    },
    {
      id: 3301004,
      folderNodeId: "suricata-custom-command-control",
      originFolderNodeId: "suricata-etp-c2-threatview-cs-c2",
      source: "Custom Detection",
      name: "Beacon callback to previously triaged relay",
      description: "Custom control-channel rule narrowed from an upstream C2 signature for local command-and-control detection.",
      action: "Alert",
      sid: 3301004,
      relatedSid: 2024861,
      classType: "Trojan Activity",
      speed: "21µs",
      speedValue: 21,
      lastSeen: "Just now",
      lastSeenValue: 0,
      totalHits: 933,
      enabled: true,
      editable: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "Command & Control",
    },
    {
      id: 3301005,
      folderNodeId: "suricata-custom-dns-monitoring",
      originFolderNodeId: "suricata-etp-network-services-dns",
      source: "Custom Detection",
      name: "Rare TXT-answer burst to watched domain set",
      description: "Custom DNS monitor for workspace-owned domains with repeated TXT-answer anomalies.",
      action: "Alert",
      sid: 3301005,
      relatedSid: 2024889,
      classType: "Potentially Bad Traffic",
      speed: "18µs",
      speedValue: 18,
      lastSeen: "27m ago",
      lastSeenValue: 27,
      totalHits: 412,
      enabled: true,
      editable: true,
      ruleStateTags: [],
      statusDot: "green",
      folderLabel: "DNS Monitoring",
    },
    {
      id: 3301006,
      folderNodeId: "suricata-custom-app-performance",
      originFolderNodeId: "suricata-etp-web-client",
      source: "Custom Detection",
      name: "Slow API abuse on customer checkout path",
      description: "Performance-oriented rule for abusive API patterns affecting checkout transactions.",
      action: "Pass",
      sid: 3301006,
      relatedSid: 2024877,
      classType: "Misc Activity",
      speed: "43µs",
      speedValue: 43,
      lastSeen: "1d ago",
      lastSeenValue: 1440,
      totalHits: 88,
      enabled: false,
      editable: true,
      ruleStateTags: [],
      statusDot: "gray",
      folderLabel: "App Performance",
    },
    {
      id: 3301007,
      folderNodeId: "suricata-custom-operational-visibility",
      originFolderNodeId: "suricata-etp-operational-ja3",
      source: "Custom Detection",
      name: "Rare JA3 handshake from vendor jump host",
      description: "Visibility rule for uncommon TLS fingerprints on approved operational jump hosts.",
      action: "Alert",
      sid: 3301007,
      relatedSid: 2025001,
      classType: "Misc Activity",
      speed: "16µs",
      speedValue: 16,
      lastSeen: "4h ago",
      lastSeenValue: 240,
      totalHits: 154,
      enabled: true,
      editable: true,
      ruleStateTags: [{ label: "Broken", tone: "danger" }],
      statusDot: "green",
      folderLabel: "Operational Visibility",
    },
  ];
}

const SURICATA_RULE_SEEDS = [
  ...buildEtProRuleSeeds(),
  ...buildImportedRuleSeeds(),
  ...buildCustomRuleSeeds(),
];

const DEFAULT_ALERT_RULES = [
  {
    id: 20001,
    source: "Teleseer",
    category: "Default Alerts",
    name: "Brute Force Authentication",
    description: "Rapid repeated authentication attempts across multiple services.",
    classType: "policy-violation",
    totalHits: 18200,
    enabled: true,
    editable: false,
    ruleStateTags: [],
    projects: getSharedAlertingProjectPool().slice(0, 2),
  },
  {
    id: 20002,
    source: "Teleseer",
    category: "Default Alerts",
    name: "Port Scan Wide Sweep",
    description: "Broad scan behavior traversing internal VLANs and services.",
    classType: "attempted-recon",
    totalHits: 9700,
    enabled: true,
    editable: false,
    ruleStateTags: [],
    projects: getSharedAlertingProjectPool().slice(1, 4),
  },
  {
    id: 20003,
    source: "Teleseer",
    category: "Default Alerts",
    name: "Suspicious DNS Query",
    description: "High-entropy DNS lookups associated with tunneling heuristics.",
    classType: "bad-known",
    totalHits: 7400,
    enabled: true,
    editable: false,
    ruleStateTags: [],
    projects: getSharedAlertingProjectPool().slice(0, 1),
  },
  {
    id: 20004,
    source: "Teleseer",
    category: "Default Alerts",
    name: "Outbound Data Spike",
    description: "Unusual egress volume over a compressed interval.",
    classType: "policy-violation",
    totalHits: 3200,
    enabled: true,
    editable: false,
    ruleStateTags: [],
    projects: getSharedAlertingProjectPool().slice(2, 5),
  },
];

let nextGeneratedRuleId = 4000000;
let nextCustomNodeId = 1;
let suricataRuleDb = SURICATA_RULE_SEEDS.map((rule) => normalizeSuricataRule(rule));
let teleseerRuleDb = DEFAULT_ALERT_RULES.map((rule) => ({ ...rule }));
let allRules = [];
let currentRules = [];
let activeCategory = sidebarState.selectedCategory;
const sidebarSOT = window.SidebarSOT || null;
let selectedRuleIds = new Set();
let currentRenderItems = [];
let currentRenderOffsets = [];
let currentRenderTotalHeight = 0;
let currentRenderMetrics = {
  speedMax: 1,
  hitsMax: 1,
};
let suricataVirtualRenderFrame = 0;

const SURICATA_TABLE_VIEWPORT = {
  rowHeight: 64,
  groupRowHeight: 50,
  overscanRows: 8,
};

function normalizeSuricataRule(rule) {
  const normalized = {
    description: "",
    editable: Boolean(rule.editable),
    enabled: Boolean(rule.enabled),
    projects: [],
    ruleStateTags: [],
    statusDot: "gray",
    folderNodeId: "",
    originFolderNodeId: rule.folderNodeId,
    relatedSid: rule.sid,
    speed: "-",
    speedValue: Number.POSITIVE_INFINITY,
    lastSeen: "-",
    lastSeenValue: Number.POSITIVE_INFINITY,
    action: "Alert",
    source: "Emerging Threats PRO",
    ...rule,
  };
  normalized.ruleStateTags = normalized.ruleStateTags
    .filter((tag) => String(tag?.label || "").toLowerCase() === "broken")
    .map(() => ({ label: "Broken", tone: "danger" }));
  return normalized;
}

function getSharedAlertingProjectPool() {
  const sharedProjects = window.TeleseerAppData?.projects?.catalog;
  if (Array.isArray(sharedProjects) && sharedProjects.length) {
    return sharedProjects
      .map((project) => project?.name)
      .filter((name) => typeof name === "string" && name.trim().length > 0);
  }
  return [
    "teleseer-dummy",
    "Site Julio",
    "Hospital East Wing",
    "Power Plant",
    "Widget Factory",
    "Military Base",
  ];
}

function getSearchQuery() {
  return (document.getElementById("ruleSearch")?.value || "").trim().toLowerCase();
}

function getAllSidebarNodes() {
  const queue = [...teleseerNodes, ...suricataRoots];
  const nodes = [];
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;
    nodes.push(node);
    if (Array.isArray(node.children) && node.children.length) {
      queue.unshift(...node.children);
    }
  }
  return nodes;
}

function findSidebarNode(nodeId, nodes = [...teleseerNodes, ...suricataRoots]) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children?.length) {
      const found = findSidebarNode(nodeId, node.children);
      if (found) return found;
    }
  }
  return null;
}

function findNodeByLabelAndSource(label, source) {
  return getAllSidebarNodes().find((node) => node.label === label && node.source === source) || null;
}

function collectDescendantNodeIds(node) {
  if (!node) return [];
  const ids = [node.id];
  (node.children || []).forEach((child) => ids.push(...collectDescendantNodeIds(child)));
  return ids;
}

function getNodePathLabels(nodeId) {
  const path = [];
  function visit(nodes, trail = []) {
    for (const node of nodes) {
      const nextTrail = [...trail, node.label];
      if (node.id === nodeId) {
        path.push(...nextTrail);
        return true;
      }
      if (node.children?.length && visit(node.children, nextTrail)) {
        return true;
      }
    }
    return false;
  }
  visit(suricataRoots);
  return path;
}

function getDisplayFolderLabel(nodeId) {
  const path = getNodePathLabels(nodeId);
  if (!path.length) return "Folder";
  return path[path.length - 1];
}

function getCustomRootNode() {
  return suricataRoots.find((node) => node.id === "suricata-custom-root") || null;
}

function getEditableCustomTargetNodes() {
  const nodes = [];
  function visit(node, depth = 0) {
    if (node.id !== "suricata-custom-root") {
      nodes.push({ node, depth });
    }
    (node.children || []).forEach((child) => visit(child, depth + 1));
  }
  const root = getCustomRootNode();
  if (root) visit(root, 0);
  return nodes;
}

function formatCompactCount(value) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1000) {
    const compact = value >= 100000 ? Math.round(value / 1000) : (value / 1000).toFixed(1);
    return `${compact}k`;
  }
  return String(value);
}

function getNodeCountValue(node) {
  if (!node) return 0;
  if (node.source === "Teleseer") {
    return teleseerRuleDb.filter((rule) => rule.category === node.label).length;
  }
  const descendantIds = new Set(collectDescendantNodeIds(node));
  return suricataRuleDb.filter((rule) => descendantIds.has(rule.folderNodeId)).length;
}

function getNodeDisplayCount(node) {
  return formatCompactCount(getNodeCountValue(node));
}

function getSectionDisplayCount(sectionKey) {
  if (sectionKey === "teleseer") {
    return formatCompactCount(
      teleseerNodes.reduce((sum, node) => sum + getNodeCountValue(node), 0),
    );
  }
  if (sectionKey === "suricata") {
    return formatCompactCount(
      suricataRoots.reduce((sum, node) => sum + getNodeCountValue(node), 0),
    );
  }
  return "";
}

function getSidebarTreeLevel(depth) {
  if (sidebarSOT && typeof sidebarSOT.rowLevelFromVariant === "function") {
    const variant = depth <= 0
      ? "item"
      : depth === 1
      ? "subitem"
      : depth === 2
      ? "subsubitem"
      : "subsubsubitem";
    return sidebarSOT.rowLevelFromVariant(variant);
  }
  if (depth <= 0) return "item";
  if (depth === 1) return "sub-item";
  if (depth === 2) return "subsub-item";
  return "subsubsub-item";
}

function getSidebarTreeTrackCount(depth) {
  return Math.max(0, depth);
}

function getSelectionRulesForNode(node) {
  if (!node) return [];
  if (node.source === "Teleseer") {
    return teleseerRuleDb.filter((rule) => rule.category === node.label);
  }
  const descendantIds = new Set(collectDescendantNodeIds(node));
  return suricataRuleDb.filter((rule) => descendantIds.has(rule.folderNodeId));
}

function isReadonlySuricataSelection(node) {
  return Boolean(node && node.source !== "Custom Detection");
}

function isReadonlySuricataRule(rule) {
  return !rule || !rule.editable;
}

function isEtProSuricataRule(rule) {
  return String(rule?.source || "") === "Emerging Threats PRO";
}

function isReadonlyStatusRule(rule) {
  const source = String(rule?.source || "");
  return source === "Emerging Threats PRO" || source === "Teleseer";
}

function getCurrentSelectionNode() {
  return findSidebarNode(sidebarState.selectedNodeId);
}

function getCurrentSelectionRules() {
  const node = getCurrentSelectionNode();
  return getSelectionRulesForNode(node);
}

function getRuleSearchHaystack(rule) {
  return [
    rule.name,
    rule.description,
    rule.classType,
    rule.action,
    rule.sid,
    rule.relatedSid,
    rule.folderLabel,
    getDisplayFolderLabel(rule.originFolderNodeId || rule.folderNodeId),
    (rule.projects || []).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function getFilteredRules(rules) {
  const query = getSearchQuery();
  return rules.filter((rule) => {
    if (!query) return true;
    return getRuleSearchHaystack(rule).includes(query);
  });
}

function sortRules(rules) {
  const sorted = [...rules];
  if (toolbarState.sortColumn === "none" || toolbarState.sortDirection === "none") return sorted;
  const direction = toolbarState.sortDirection === "asc" ? 1 : -1;
  sorted.sort((a, b) => {
    let result = 0;
    switch (toolbarState.sortColumn) {
      case "name":
        result = String(a.name || "").localeCompare(String(b.name || ""));
        break;
      case "sid":
        result = Number(a.sid || 0) - Number(b.sid || 0);
        break;
      case "hits":
        result = Number(a.totalHits || 0) - Number(b.totalHits || 0);
        break;
      case "action":
        result = String(a.action || "").localeCompare(String(b.action || ""));
        break;
      case "class":
        result = String(a.classType || "").localeCompare(String(b.classType || ""));
        break;
      case "speed":
        result = Number(a.speedValue || Infinity) - Number(b.speedValue || Infinity);
        break;
      case "lastSeen":
      default:
        result = Number(a.lastSeenValue || Infinity) - Number(b.lastSeenValue || Infinity);
        break;
    }
    return result * direction;
  });
  return sorted;
}

function refreshRuleCollections(options = {}) {
  allRules = getCurrentSelectionRules();
  currentRules = sortRules(getFilteredRules(allRules));
  syncSelectedRuleIds();
  activeCategory = getCurrentSelectionNode()?.label || "";
}

function syncSelectedRuleIds() {
  const validRuleIds = new Set(allRules.map((rule) => rule.id));
  selectedRuleIds = new Set(
    Array.from(selectedRuleIds).filter((ruleId) => validRuleIds.has(ruleId)),
  );
}

function clearRuleSelection() {
  if (!selectedRuleIds.size) return;
  selectedRuleIds = new Set();
}

function getSidebarContextIconClass(name = "", source = "") {
  const context = `${source} ${name}`.toLowerCase();
  if (source === "Teleseer") return "side-icon-teleseer";
  if (context.includes("alert")) return "side-icon-layout";
  if (context.includes("rule")) return "side-icon-rule";
  return "side-icon-attack";
}

function renderSidebarIcon(iconClass, slotClass = "side-icon") {
  return `<span class="${slotClass} svg-icon ${iconClass}" aria-hidden="true"></span>`;
}

function renderSidebarImageIcon(src, slotClass = "side-icon") {
  return `<span class="${slotClass} side-image-icon-wrap" aria-hidden="true"><img class="side-image-icon" src="${escapeHtml(src)}" alt="" /></span>`;
}

function renderSidebarCount(count, extraClass = "") {
  if (count === null || count === undefined || count === "") return "";
  if (sidebarSOT && typeof sidebarSOT.createCountContainer === "function") {
    const container = sidebarSOT.createCountContainer(count);
    const countEl = container.querySelector(".count");
    if (countEl && extraClass) countEl.classList.add(extraClass);
    return container.outerHTML;
  }
  const countClass = extraClass ? ` ${extraClass}` : "";
  return `<span class="count-container"><span class="count${countClass}">${escapeHtml(String(count))}</span></span>`;
}

function renderSidebarSection({
  sectionId,
  bodyId,
  title,
  isExpanded,
  toggleKey,
  bodyMarkup,
  count = null,
}) {
  return `
    <section id="${escapeHtml(sectionId)}" class="side-section${isExpanded ? "" : " is-collapsed"}">
      <div class="side-section-header sidebar-item-row sidebar-section-header${isExpanded ? " is-expanded" : ""}" data-sidebar-kind="section" data-sidebar-level="item" data-sidebar-active="false" data-sidebar-expanded="${isExpanded ? "true" : "false"}">
        <button id="sidebarSectionToggle${escapeHtml(title)}" class="side-section-toggle" type="button" onclick="toggleSideSection('${escapeJsSingleQuoted(toggleKey)}')" aria-expanded="${isExpanded ? "true" : "false"}" aria-label="Toggle ${escapeHtml(title)} section">
          <span class="row-content">
            <span class="row-main">
              <span class="collection-label-wrap">
                <span class="row-label">${escapeHtml(title)}</span>
                <span class="collection-arrow" aria-hidden="true"><span class="svg-icon side-icon-arrow-right"></span></span>
              </span>
            </span>
          </span>
        </button>
        ${renderSidebarCount(count)}
      </div>
      <div id="${escapeHtml(bodyId)}" class="side-section-body${isExpanded ? "" : " is-collapsed"}">${bodyMarkup}</div>
    </section>
  `;
}

function syncAlertingSidebarSemantics(root = document) {
  if (!sidebarSOT || typeof sidebarSOT.applyRowSemantics !== "function") return;
  root.querySelectorAll(".alerting-sidebar .sidebar-item-row").forEach((row) => {
    sidebarSOT.applyRowSemantics(row, {
      kind: row.dataset.sidebarKind === "section" ? "section" : "item",
      level: row.dataset.sidebarLevel || "item",
      active: row.dataset.sidebarActive === "true" || row.classList.contains("is-active"),
      expanded: row.dataset.sidebarExpanded === "true" || row.classList.contains("is-expanded"),
      hasHoverCta: row.dataset.sidebarHoverCta === "true",
      hasCount: row.dataset.sidebarHasCount === "true" || Boolean(row.querySelector(".count-container")),
    });
  });
}

function renderSidebarLabel(node, isRenaming) {
  if (!isRenaming) return `<span class="row-label">${escapeHtml(node.label)}</span>`;
  return `
    <input
      class="sidebar-rename-input"
      type="text"
      value="${escapeHtml(sidebarState.renameDraft || node.label)}"
      oninput="updateSidebarRenameDraft(this.value)"
      onblur="commitSidebarRename('${escapeJsSingleQuoted(node.id)}')"
      onkeydown="handleSidebarRenameKey(event, '${escapeJsSingleQuoted(node.id)}')"
      autofocus
    />
  `;
}

function renderTreeNodeIconMarkup(node, hasChildren, isRootNode) {
  const defaultIconMarkup = !isRootNode && node.source !== "Teleseer"
    ? renderSidebarImageIcon(SURI_ICON_FOLDER_SRC, "side-icon icon-default")
    : node.source === "Teleseer"
      ? renderSidebarIcon(getSidebarContextIconClass(node.label, node.source), "side-icon icon-default")
      : renderSidebarImageIcon(SURI_ICON_SURICATA_APP_SRC, "side-icon icon-default");

  if (!hasChildren) {
    return defaultIconMarkup;
  }

  return `
    <span class="icon-default-button">${defaultIconMarkup}</span>
    <button class="btn-reset icon-hover-button" type="button" aria-label="Toggle ${escapeHtml(node.label)}" onclick="handleTreeNodeArrowClick(event, '${escapeJsSingleQuoted(node.id)}')">
      ${renderSidebarIcon("side-icon-arrow-right", "side-icon icon-hover")}
    </button>
  `;
}

function handleTreeNodeRowClick(nodeId) {
  const node = findSidebarNode(nodeId);
  if (!node) return;
  selectSidebarNodeById(node.id, { skipSidebarRender: true });
}

function handleTreeNodeRowKeydown(event, nodeId) {
  if (!event) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  handleTreeNodeRowClick(nodeId);
}

function handleTreeNodeArrowClick(event, nodeId) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  toggleTreeNode(nodeId);
}

function renderTreeNode(node, depth = 0) {
  const isActive = sidebarState.selectedNodeId === node.id;
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isExpanded = hasChildren ? Boolean(sidebarState.expandedTreeNodes[node.id]) : false;
  const isRootNode = suricataRoots.some((root) => root.id === node.id);
  const iconMarkup = renderTreeNodeIconMarkup(node, hasChildren, isRootNode);
  const isRenaming = sidebarState.renameNodeId === node.id;
  const count = getNodeDisplayCount(node);
  const level = getSidebarTreeLevel(depth);
  const trackCount = getSidebarTreeTrackCount(depth);
  const tracksMarkup = trackCount
    ? `<span class="indent-tracks">${Array.from({ length: trackCount }).map(() => '<span class="indent-track" aria-hidden="true"></span>').join("")}</span>`
    : "";
  const readonlyBadge = node.readOnly &&
      depth === 0 &&
      node.id !== "suricata-etp-root" &&
      node.id !== "suricata-imported-root"
    ? '<span class="side-tree-badge">Read-only</span>'
    : '';

  return `
    <div class="side-tree-node tree-node depth-${depth}${isExpanded ? ' is-expanded' : ''}${isActive ? ' is-active' : ''}" data-node-id="${escapeHtml(node.id)}">
      <div
        class="side-row sidebar-item-row sidebar-item side-tree-row${isActive ? ' is-active' : ''}${isExpanded ? ' is-expanded' : ''}${node.readOnly ? ' is-readonly' : ''}${node.editable ? ' is-editable' : ''}${hasChildren ? ' has-children' : ''}"
        role="button"
        tabindex="0"
        data-node-row="${escapeHtml(node.id)}"
        data-sidebar-kind="item"
        data-sidebar-level="${escapeHtml(level)}"
        data-sidebar-active="${isActive ? 'true' : 'false'}"
        data-sidebar-expanded="${isExpanded ? 'true' : 'false'}"
        data-sidebar-has-count="${count ? 'true' : 'false'}"
        data-sidebar-hover-cta="${hasChildren ? 'true' : 'false'}"
        aria-expanded="${hasChildren ? (isExpanded ? 'true' : 'false') : 'false'}"
        onclick="handleTreeNodeRowClick('${escapeJsSingleQuoted(node.id)}')"
        onkeydown="handleTreeNodeRowKeydown(event, '${escapeJsSingleQuoted(node.id)}')"
        ondblclick="startSidebarRename('${escapeJsSingleQuoted(node.id)}', event)"
      >
        <span class="row-content">
          <span class="row-main${trackCount ? ' nested' : ''}">
            ${tracksMarkup}
            <span class="item-label-group with-gap">
              <span class="tree-icon"${hasChildren ? "" : ' aria-hidden="true"'}>${iconMarkup}</span>
              ${renderSidebarLabel(node, isRenaming)}
              ${readonlyBadge}
            </span>
          </span>
          ${renderSidebarCount(count)}
        </span>
      </div>
      ${
        hasChildren
          ? `<div class="side-tree-children${isExpanded ? '' : ' is-collapsed'}" data-node-children="${escapeHtml(node.id)}" aria-hidden="${isExpanded ? 'false' : 'true'}"><div class="side-tree-children-inner">${node.children.map((child) => renderTreeNode(child, depth + 1)).join("")}</div></div>`
          : ""
      }
    </div>
  `;
}

function renderSidebar() {
  const container = document.getElementById("sidebarContent");
  if (!container) return;
  if (isWorkspaceVariablesModal()) {
    container.innerHTML = "";
    return;
  }

  const teleseerRows = sidebarData.teleseer.items.map((node) => renderTreeNode(node, 0)).join("");
  const suricataRows = sidebarData.suricata.roots.map((node) => renderTreeNode(node, 0)).join("");

  container.innerHTML = `
    ${renderSidebarSection({
      sectionId: "sidebarSectionTeleseer",
      bodyId: "sidebarSectionBodyTeleseer",
      title: "Teleseer",
      isExpanded: sidebarState.teleseerExpanded,
      toggleKey: "teleseerExpanded",
      bodyMarkup: teleseerRows,
      count: getSectionDisplayCount("teleseer"),
    })}
    ${renderSidebarSection({
      sectionId: "sidebarSectionSuricata",
      bodyId: "sidebarSectionBodySuricata",
      title: "Suricata",
      isExpanded: sidebarState.suricataExpanded,
      toggleKey: "suricataExpanded",
      bodyMarkup: suricataRows,
      count: getSectionDisplayCount("suricata"),
    })}
  `;
  syncAlertingSidebarSemantics(container);
}

function renderBreadcrumb(name, source) {
  const breadcrumbEl = document.getElementById("contentBreadcrumb");
  if (!breadcrumbEl) return;
  const selectedNode = getCurrentSelectionNode();
  const count = formatCompactCount(currentRules.length);
  const subtitle = selectedNode?.source === "Custom Detection" ? '<span class="content-breadcrumb-subtitle">Editable</span>' : '';
  breadcrumbEl.innerHTML = `
    <span class="content-title-row">
      <span class="source-root">${escapeHtml(name)}</span>
      <span class="count-badge" id="ruleCount">${count}</span>
      ${subtitle}
    </span>
  `;
}

function isSuricataColumnVisible(columnKey) {
  if (columnKey === "select" || columnKey === "led" || columnKey === "hits") {
    return true;
  }
  return suricataViewSettingsState[columnKey] !== false;
}

window.isSuricataColumnVisible = isSuricataColumnVisible;

function closeToolbarMenus() {
  document.querySelectorAll(".toolbar-dropdown-menu, .multi-select-ribbon-overflow-menu").forEach((menu) => {
    menu.classList.remove("open");
  });
  document.querySelectorAll(".toolbar-menu-anchor > [aria-haspopup='menu']").forEach((button) => {
    button.classList.remove("active", "is-active");
    button.setAttribute("aria-expanded", "false");
  });
}

function getToolbarOptionLabel(options, value, fallback) {
  return options.find((option) => option.value === value)?.label || fallback;
}

function getSortButtonLabel() {
  if (toolbarState.sortDirection === "none") return "Sort";
  return `Sort by: ${getToolbarOptionLabel(SURI_SORT_COLUMN_OPTIONS, toolbarState.sortColumn, "Sort")}`;
}

function getGroupButtonLabel() {
  if (toolbarState.group === "none") return "Group";
  return `Group by: ${getToolbarOptionLabel(SURI_GROUP_OPTIONS, toolbarState.group, "Group")}`;
}

function renderToolbarMenuSectionLabel(label) {
  return `<div class="toolbar-menu-section-label">${escapeHtml(label)}</div>`;
}

function renderToolbarMenuDivider() {
  return `<div class="toolbar-menu-divider" aria-hidden="true"></div>`;
}

function renderToolbarMenuItem({
  label,
  active = false,
  onClick = "",
  extraClass = "",
  meta = "",
  iconSrc = "",
  activeIconSrc = SURI_ICON_CHECK_MENU_ITEM_SRC,
}) {
  return `
    <button
      type="button"
      class="menu-item menu-item-check${active ? " is-active" : ""}${extraClass ? ` ${extraClass}` : ""}"
      onclick="${onClick}"
    >
      <span class="menu-item-check-indicator" aria-hidden="true">
        ${active ? svgIcon(activeIconSrc, 12) : ""}
      </span>
      ${iconSrc ? `<span class="menu-item-icon">${svgIcon(iconSrc)}</span>` : ""}
      <span class="menu-item-label">${escapeHtml(label)}</span>
      ${meta ? `<span class="menu-item-trailing"><span class="menu-item-meta">${escapeHtml(meta)}</span></span>` : ""}
    </button>
  `;
}

function renderViewSettingsMenu() {
  return `
    <div class="view-settings-menu-body">
      ${SURI_VIEW_SETTING_COLUMNS.map(
        (column) => `
          <button
            type="button"
            class="menu-item menu-item-toggle"
            onclick="toggleSuricataColumnVisibility(event, '${escapeJsSingleQuoted(column.key)}')"
          >
            <span class="menu-item-label">${escapeHtml(column.label)}</span>
            <span class="toggle-switch${isSuricataColumnVisible(column.key) ? " on" : ""}" aria-hidden="true"></span>
          </button>
        `,
      ).join("")}
    </div>
  `;
}

function renderToolbarMenus() {
  const sortMenu = document.getElementById("ruleSortMenu");
  const groupMenu = document.getElementById("ruleGroupMenu");
  const viewSettingsMenu = document.getElementById("viewSettingsMenu");
  if (sortMenu) {
    sortMenu.innerHTML = `
      <div class="toolbar-dropdown-menu-body">
        ${renderToolbarMenuSectionLabel("Sort")}
        ${renderToolbarMenuItem({
          label: "None",
          active: toolbarState.sortDirection === "none",
          onClick: "setRuleSortColumn('none')",
          iconSrc: SURI_ICON_SORT_NONE_SRC,
        })}
        ${renderToolbarMenuDivider()}
        ${SURI_SORT_DIRECTION_OPTIONS.map((option) =>
          renderToolbarMenuItem({
            label: option.label,
            meta: option.meta,
            active: toolbarState.sortDirection === option.value,
            onClick: `setRuleSortDirection('${escapeJsSingleQuoted(option.value)}')`,
            iconSrc: option.value === "asc" ? SURI_ICON_SORT_ASCENDING_SRC : SURI_ICON_SORT_DESCENDING_SRC,
          })
        ).join("")}
        ${renderToolbarMenuDivider()}
        ${renderToolbarMenuSectionLabel("Column")}
        ${SURI_SORT_COLUMN_OPTIONS.map((option) =>
          renderToolbarMenuItem({
            label: option.label,
            active: toolbarState.sortColumn === option.value && toolbarState.sortDirection !== "none",
            onClick: `setRuleSortColumn('${escapeJsSingleQuoted(option.value)}')`,
          })
        ).join("")}
      </div>
    `;
  }
  if (groupMenu) {
    groupMenu.innerHTML = `
      <div class="toolbar-dropdown-menu-body">
        ${renderToolbarMenuSectionLabel("Group")}
        ${renderToolbarMenuItem({
          label: "None",
          active: toolbarState.group === "none",
          onClick: "setRuleGroup('none')",
        })}
        ${renderToolbarMenuDivider()}
        ${renderToolbarMenuSectionLabel("Group by")}
        ${SURI_GROUP_OPTIONS.filter((option) => option.value !== "none").map((option) =>
          renderToolbarMenuItem({
            label: option.label,
            active: toolbarState.group === option.value,
            onClick: `setRuleGroup('${escapeJsSingleQuoted(option.value)}')`,
          })
        ).join("")}
      </div>
    `;
  }
  if (viewSettingsMenu) {
    viewSettingsMenu.innerHTML = renderViewSettingsMenu();
  }
}

function applyToolbarUi() {
  const sortLabelEl = document.getElementById("ruleSortButtonLabel");
  const groupLabelEl = document.getElementById("ruleGroupButtonLabel");
  if (sortLabelEl) {
    sortLabelEl.textContent = getSortButtonLabel();
  }
  if (groupLabelEl) {
    groupLabelEl.textContent = getGroupButtonLabel();
  }
  renderToolbarMenus();
}

function renderSidebarFooterActions() {
  const footer = document.getElementById("sidebarFooterActions");
  if (!footer) return;
  if (isWorkspaceVariablesModal()) {
    footer.innerHTML = "";
    return;
  }
  footer.innerHTML = `
    <button class="btn-reset btn-secondary size-s style-ghost sidebar-footer-action" type="button" onclick="triggerSidebarAction('Import')">
      <span class="svg-icon side-icon-import" aria-hidden="true"></span>
      <span class="btn-label">Import</span>
    </button>
    <button class="btn-reset btn-secondary size-s style-ghost sidebar-footer-action" type="button" onclick="triggerSidebarAction('Export')">
      <span class="svg-icon side-icon-export" aria-hidden="true"></span>
      <span class="btn-label">Export</span>
    </button>
  `;
}

function updateHeaderActionState() {
  const createButton = document.getElementById("createRuleBtn");
  const thresholdButton = document.getElementById("contentThresholdBtn");
  const viewSettingsButton = document.getElementById("contentViewSettingsBtn");
  const toolbarControls = document.getElementById("modalToolbarControls");
  if (!createButton) return;
  const selectedNode = getCurrentSelectionNode();
  const isSuricataView = Boolean(selectedNode && selectedNode.source !== "Teleseer");
  if (toolbarControls) toolbarControls.classList.toggle("hidden", !isSuricataView);
  if (thresholdButton) thresholdButton.classList.toggle("hidden", !isSuricataView);
  if (viewSettingsButton) viewSettingsButton.classList.toggle("hidden", !isSuricataView);
  createButton.disabled = false;
  if (selectedNode?.source === "Teleseer") {
    createButton.classList.add("hidden");
    return;
  }
  createButton.classList.remove("hidden");
  createButton.textContent = "Create New Rule";
}

function selectSidebarNodeById(nodeId, options = {}) {
  const node = findSidebarNode(nodeId);
  if (!node) return;
  const previousNodeId = sidebarState.selectedNodeId;
  sidebarState.selectedNodeId = node.id;
  sidebarState.selectedCategory = node.label;
  sidebarState.selectedSource = node.source;
  sidebarState.selectedQuickAction = null;
  clearRuleSelection();
  activeCategory = node.label;
  resetRuleVariablesViewState();
  if (!options.keepDrawer) closeDrawer();
  refreshRuleCollections();
  if (options.skipSidebarRender) {
    syncSidebarActiveNodeDom(previousNodeId, node.id);
  } else {
    renderSidebar();
  }
  renderBreadcrumb(node.label, node.source);
  updateRuleCounts();
  updateHeaderActionState();
  renderRules({ resetScroll: true });
}

function selectCategory(name, source) {
  const node = findNodeByLabelAndSource(name, source) || findNodeByLabelAndSource(name, sidebarState.selectedSource) || findNodeByLabelAndSource(name, "Teleseer");
  if (!node) return;
  selectSidebarNodeById(node.id);
}

function expandSidebarPathToNode(nodeId, nodes = [...teleseerNodes, ...suricataRoots]) {
  for (const node of nodes) {
    if (node.id === nodeId) return true;
    if (Array.isArray(node.children) && node.children.length) {
      const found = expandSidebarPathToNode(nodeId, node.children);
      if (found) {
        sidebarState.expandedTreeNodes[node.id] = true;
        return true;
      }
    }
  }
  return false;
}

function selectQuickAction(name) {
  if (isWorkspaceVariablesModal()) return;
  if (name !== "Variables" && name !== "Variable") return;
  sidebarState.selectedCategory = "";
  sidebarState.selectedQuickAction = "Variables";
  clearRuleSelection();
  resetRuleVariablesViewState();
  renderSidebar();
  closeDrawer();
  renderRules({ resetScroll: true });
}

function toggleSideSection(sectionKey) {
  if (!(sectionKey in sidebarState)) return;
  if (typeof sidebarState[sectionKey] !== "boolean") return;
  sidebarState[sectionKey] = !sidebarState[sectionKey];
  if (syncSidebarSectionDom(sectionKey, sidebarState[sectionKey])) return;
  renderSidebar();
}

function toggleTreeNode(nodeId) {
  const nextExpanded = !Boolean(sidebarState.expandedTreeNodes[nodeId]);
  sidebarState.expandedTreeNodes[nodeId] = nextExpanded;
  if (syncSidebarTreeNodeDom(nodeId, nextExpanded)) return;
  renderSidebar();
}

function syncSidebarActiveNodeDom(previousNodeId, nextNodeId) {
  if (previousNodeId) {
    const prevWrapper = document.querySelector(`.side-tree-node[data-node-id="${CSS.escape(previousNodeId)}"]`);
    const prevRow = document.querySelector(`.side-tree-row[data-node-row="${CSS.escape(previousNodeId)}"]`);
    prevWrapper?.classList.remove("is-active");
    if (prevRow) {
      prevRow.classList.remove("is-active", "active");
      prevRow.dataset.sidebarActive = "false";
    }
  }
  if (nextNodeId) {
    const nextWrapper = document.querySelector(`.side-tree-node[data-node-id="${CSS.escape(nextNodeId)}"]`);
    const nextRow = document.querySelector(`.side-tree-row[data-node-row="${CSS.escape(nextNodeId)}"]`);
    nextWrapper?.classList.add("is-active");
    if (nextRow) {
      nextRow.classList.add("is-active", "active");
      nextRow.dataset.sidebarActive = "true";
    }
  }
}

function syncSidebarTreeNodeDom(nodeId, isExpanded) {
  const wrapper = document.querySelector(`.side-tree-node[data-node-id="${CSS.escape(nodeId)}"]`);
  const row = document.querySelector(`.side-tree-row[data-node-row="${CSS.escape(nodeId)}"]`);
  const children = document.querySelector(`.side-tree-children[data-node-children="${CSS.escape(nodeId)}"]`);
  if (!wrapper && !row && !children) return false;
  wrapper?.classList.toggle("is-expanded", isExpanded);
  if (row) {
    row.classList.toggle("is-expanded", isExpanded);
    row.dataset.sidebarExpanded = isExpanded ? "true" : "false";
    row.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  }
  if (children) {
    children.classList.toggle("is-collapsed", !isExpanded);
    children.setAttribute("aria-hidden", isExpanded ? "false" : "true");
  }
  return true;
}

function syncSidebarSectionDom(sectionKey, isExpanded) {
  const sectionRefs = {
    teleseerExpanded: {
      sectionId: "sidebarSectionTeleseer",
      bodyId: "sidebarSectionBodyTeleseer",
      toggleId: "sidebarSectionToggleTeleseer",
    },
    suricataExpanded: {
      sectionId: "sidebarSectionSuricata",
      bodyId: "sidebarSectionBodySuricata",
      toggleId: "sidebarSectionToggleSuricata",
    },
  };
  const refs = sectionRefs[sectionKey];
  if (!refs) return false;
  const sectionEl = document.getElementById(refs.sectionId);
  const bodyEl = document.getElementById(refs.bodyId);
  const toggleEl = document.getElementById(refs.toggleId);
  if (!sectionEl && !bodyEl && !toggleEl) return false;
  if (sectionEl) sectionEl.classList.toggle("is-collapsed", !isExpanded);
  if (bodyEl) bodyEl.classList.toggle("is-collapsed", !isExpanded);
  if (toggleEl) toggleEl.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  return true;
}

function updateSidebarRenameDraft(value) {
  sidebarState.renameDraft = value;
}

function startSidebarRename(nodeId, event) {
  event?.stopPropagation?.();
  const node = findSidebarNode(nodeId);
  if (!node || !node.editable || node.id === "suricata-custom-root") return;
  sidebarState.renameNodeId = nodeId;
  sidebarState.renameDraft = node.label;
  renderSidebar();
}

function handleSidebarRenameKey(event, nodeId) {
  if (event.key === "Enter") {
    event.preventDefault();
    commitSidebarRename(nodeId);
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    cancelSidebarRename();
  }
}

function cancelSidebarRename() {
  sidebarState.renameNodeId = null;
  sidebarState.renameDraft = "";
  renderSidebar();
}

function commitSidebarRename(nodeId) {
  const node = findSidebarNode(nodeId);
  if (!node) return cancelSidebarRename();
  const nextLabel = String(sidebarState.renameDraft || "").trim();
  if (nextLabel) node.label = nextLabel;
  sidebarState.renameNodeId = null;
  sidebarState.renameDraft = "";
  renderSidebar();
  renderBreadcrumb(getCurrentSelectionNode()?.label || activeCategory, getCurrentSelectionNode()?.source || sidebarState.selectedSource);
  renderRules();
}

function createNewCustomNode(parentId, name) {
  const parent = parentId ? findSidebarNode(parentId) : getCustomRootNode();
  if (!parent || !parent.editable) return null;
  const node = createTreeNode({
    id: `suricata-custom-generated-${nextCustomNodeId++}`,
    label: name,
    count: "0",
    source: "Custom Detection",
    editable: true,
    allowChildren: true,
    children: [],
  });
  parent.children = parent.children || [];
  parent.children.push(node);
  sidebarState.expandedTreeNodes[parent.id] = true;
  return node;
}

function addNewCustomRule(targetNodeId = null) {
  const targetNode = findSidebarNode(targetNodeId) || getCustomRootNode()?.children?.[0] || getCustomRootNode();
  if (!targetNode) return;
  const nextRule = normalizeSuricataRule({
    id: nextGeneratedRuleId++,
    folderNodeId: targetNode.id,
    source: "Custom Detection",
    name: `New Custom Detection ${nextGeneratedRuleId % 1000}`,
    description: "New custom detection awaiting tuning.",
    action: "Alert",
    sid: nextGeneratedRuleId,
    relatedSid: nextGeneratedRuleId,
    classType: "Attempted Admin",
    speed: "-",
    speedValue: -1,
    lastSeen: "-",
    lastSeenValue: Number.POSITIVE_INFINITY,
    totalHits: 0,
    enabled: true,
    editable: true,
    ruleStateTags: [],
    statusDot: "gray",
    folderLabel: getDisplayFolderLabel(targetNode.id),
  });
  suricataRuleDb.unshift(nextRule);
  selectSidebarNodeById(targetNode.id, { keepDrawer: true });
  openDrawer(nextRule.id);
  toggleEditMode();
}

function duplicateRuleToCustomTarget(ruleId, targetNodeId, options = {}) {
  const sourceRule =
    suricataRuleDb.find((rule) => rule.id === ruleId) ||
    teleseerRuleDb.find((rule) => rule.id === ruleId);
  const targetNode = findSidebarNode(targetNodeId);
  if (!sourceRule || !targetNode || !targetNode.editable) return null;
  const copyIndex = suricataRuleDb.filter((rule) => rule.name === sourceRule.name && rule.folderNodeId === targetNodeId).length + 1;
  const copyName = copyIndex > 1 ? `${sourceRule.name} Copy ${copyIndex}` : `${sourceRule.name} Copy`;
  const preservedTags = Array.isArray(sourceRule.ruleStateTags)
    ? sourceRule.ruleStateTags.filter((tag) => {
        const label = String(tag?.label || "").toLowerCase();
        return label === "broken";
      })
    : [];
  const duplicate = normalizeSuricataRule({
    ...sourceRule,
    id: nextGeneratedRuleId++,
    name: copyName,
    source: "Custom Detection",
    editable: true,
    enabled: true,
    folderNodeId: targetNode.id,
    originFolderNodeId: sourceRule.originFolderNodeId || sourceRule.folderNodeId,
    relatedSid: sourceRule.sid || sourceRule.relatedSid || sourceRule.id,
    sid: nextGeneratedRuleId,
    ruleStateTags: preservedTags,
    statusDot: "gray",
    folderLabel: getDisplayFolderLabel(targetNode.id),
  });
  suricataRuleDb.unshift(duplicate);
  if (options.syncSelection !== false) {
    selectSidebarNodeById(targetNode.id, { keepDrawer: true });
  }
  if (options.openDrawer !== false) {
    openDrawer(duplicate.id);
    if (options.enterEditMode !== false) toggleEditMode();
  } else if (options.render !== false) {
    renderRules();
  }
  return duplicate;
}

function triggerSidebarAction(actionName) {
  if (actionName === "Import") {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".rules,.yaml,.yml,.json,.txt,.csv";
    input.style.display = "none";
    input.onchange = () => {
      const count = input.files ? input.files.length : 0;
      if (count > 0) showToast(`Imported ${count} file${count > 1 ? "s" : ""}`);
      input.remove();
    };
    document.body.appendChild(input);
    input.click();
    return;
  }
  if (actionName === "Export") {
    showToast(`Exported ${currentRules.length} visible rule${currentRules.length === 1 ? "" : "s"}`);
    return;
  }
  showToast(`${actionName} action`);
}

function toggleToolbarMenu(event, menuId, buttonId) {
  event?.stopPropagation?.();
  const menu = document.getElementById(menuId);
  const button = document.getElementById(buttonId);
  if (!menu || !button) return;
  const willOpen = !menu.classList.contains("open");
  closeToolbarMenus();
  if (!willOpen) return;
  applyToolbarUi();
  menu.classList.add("open");
  button.classList.add("active", "is-active");
  button.setAttribute("aria-expanded", "true");
}

function getDefaultSortDirectionForColumn(column) {
  if (column === "hits" || column === "speed") return "desc";
  return "asc";
}

function setRuleSortColumn(value) {
  toolbarState.sortColumn = value || "none";
  if (toolbarState.sortColumn === "none") {
    // Clicking "None" resets the whole sort state
    toolbarState.sortDirection = "none";
  } else if (toolbarState.sortDirection === "none") {
    // Column clicked while no direction was active — auto-activate a sensible default
    toolbarState.sortDirection = getDefaultSortDirectionForColumn(toolbarState.sortColumn);
  }
  closeToolbarMenus();
  refreshRuleCollections({ preservePage: false });
  renderRules({ resetScroll: true });
}

function setRuleSortDirection(value) {
  toolbarState.sortDirection = value === "asc" ? "asc" : "desc";
  if (toolbarState.sortColumn === "none") {
    // Direction picked before a column — default to "Name"
    toolbarState.sortColumn = "name";
  }
  closeToolbarMenus();
  refreshRuleCollections({ preservePage: false });
  renderRules({ resetScroll: true });
}

function setRuleGroup(value) {
  toolbarState.group = value || "none";
  closeToolbarMenus();
  renderRules({ resetScroll: true });
}

function toggleSuricataColumnVisibility(event, columnKey) {
  event?.stopPropagation?.();
  if (!(columnKey in suricataViewSettingsState)) return;
  suricataViewSettingsState[columnKey] = !suricataViewSettingsState[columnKey];
  applyToolbarUi();
  renderRules();
}

function isRuleSelectionActive() {
  return selectedRuleIds.size > 0;
}

function getVisibleSuricataPageRules() {
  const selectedNode = getCurrentSelectionNode();
  if (selectedNode?.source === "Teleseer") return [];
  return currentRules.slice();
}

function getVisibleSuricataPageSelectionState() {
  const pageRules = getVisibleSuricataPageRules();
  const selectedCount = pageRules.filter((rule) => selectedRuleIds.has(rule.id)).length;
  const total = pageRules.length;
  return {
    total,
    selectedCount,
    allSelected: total > 0 && selectedCount === total,
    partiallySelected: selectedCount > 0 && selectedCount < total,
  };
}

function toggleVisibleRuleSelection(event) {
  event?.stopPropagation?.();
  event?.preventDefault?.();
  const pageRules = getVisibleSuricataPageRules();
  if (!pageRules.length) return;
  const selectionState = getVisibleSuricataPageSelectionState();
  const nextSelection = new Set(selectedRuleIds);
  pageRules.forEach((rule) => {
    if (selectionState.allSelected) {
      nextSelection.delete(rule.id);
    } else {
      nextSelection.add(rule.id);
    }
  });
  selectedRuleIds = nextSelection;
  if (selectedRuleIds.size) {
    closeDrawer();
  }
  renderRules();
}

function renderSuricataHeaderSelectionControl() {
  const selectionState = getVisibleSuricataPageSelectionState();
  const checkboxStateClass = selectionState.allSelected
    ? " is-checked"
    : selectionState.partiallySelected
      ? " is-mixed"
      : "";
  const ariaLabel = selectionState.allSelected
    ? "Deselect all rules in current results"
    : "Select all rules in current results";
  return `
    <button class="btn-reset rule-select-toggle rule-select-toggle--header" type="button" onclick="toggleVisibleRuleSelection(event)" aria-label="${ariaLabel}"${selectionState.total ? "" : " disabled"}>
      <span class="rule-row-checkbox sot-checkbox${checkboxStateClass}" aria-hidden="true"></span>
    </button>
  `;
}

window.renderSuricataHeaderSelectionControl = renderSuricataHeaderSelectionControl;

function getSelectedRules() {
  const selection = new Set(selectedRuleIds);
  return suricataRuleDb.filter((rule) => selection.has(rule.id));
}

function formatSelectedRuleCountLabel(count) {
  return `${count} Rule${count === 1 ? "" : "s"}`;
}

function getSelectedRuleSummary() {
  const rules = getSelectedRules();
  const editableRules = rules.filter((rule) => !isReadonlySuricataRule(rule));
  const enabledEditableRules = editableRules.filter((rule) => rule.enabled);
  const disabledEditableRules = editableRules.filter((rule) => !rule.enabled);
  const editableCount = editableRules.length;
  const disabledEditableCount = disabledEditableRules.length;
  let bulkToggleAction = null;
  let bulkToggleCount = 0;

  if (editableCount) {
    if (disabledEditableCount) {
      bulkToggleAction = "enable";
      bulkToggleCount = disabledEditableCount;
    } else {
      bulkToggleAction = "disable";
      bulkToggleCount = editableCount;
    }
  }

  return {
    rules,
    editableRules,
    count: rules.length,
    editableCount,
    readonlyCount: rules.length - editableCount,
    enabledEditableCount: enabledEditableRules.length,
    disabledEditableCount,
    allEditable: rules.length > 0 && editableCount === rules.length,
    bulkToggleAction,
    bulkToggleCount,
    singleEditableRule:
      rules.length === 1 && editableCount === 1 ? editableRules[0] : null,
  };
}

function getDefaultDuplicateTargetNodeId() {
  const selectedNode = getCurrentSelectionNode();
  if (selectedNode?.editable) return selectedNode.id;
  const customRoot = getCustomRootNode();
  return customRoot?.children?.[0]?.id || customRoot?.id || null;
}

function handleRuleRowClick(event, ruleId) {
  if (isRuleSelectionActive()) {
    toggleRuleSelection(event, ruleId);
    return;
  }
  openDrawer(ruleId);
}

function toggleRuleSelection(event, ruleId) {
  event?.stopPropagation?.();
  event?.preventDefault?.();
  const nextSelection = new Set(selectedRuleIds);
  if (nextSelection.has(ruleId)) {
    nextSelection.delete(ruleId);
  } else {
    nextSelection.add(ruleId);
  }
  selectedRuleIds = nextSelection;
  if (selectedRuleIds.size) {
    closeDrawer();
  }
  renderRules();
}

function getNextRuleSelectionRibbonState(state) {
  if (state === "full") return "compact";
  if (state === "compact") return "smallest";
  return "smallest";
}

function getRuleSelectionRibbonStateThatFits(ribbonEl, currentState) {
  const bodyEl = ribbonEl?.querySelector(".multi-select-ribbon-body");
  const labelEl = ribbonEl?.querySelector(".multi-select-ribbon-label");
  const actionsEl = ribbonEl?.querySelector(".multi-select-ribbon-actions");
  if (!bodyEl || !labelEl || !actionsEl) return currentState;
  const requiredWidth = labelEl.scrollWidth + actionsEl.scrollWidth + 12;
  return requiredWidth <= bodyEl.clientWidth
    ? currentState
    : getNextRuleSelectionRibbonState(currentState);
}

function renderRuleSelectionRibbonOverflowMenu(summary, ribbonState) {
  const menuRows = [];

  if (summary.allEditable) {
    menuRows.push(`
      <button type="button" class="menu-item is-destructive" onclick="deleteSelectedRules()">
        <span class="menu-item-label">Delete</span>
      </button>
    `);
  }

  menuRows.push(`
    <button type="button" class="menu-item" onclick="exportSelectedRules()">
      <span class="menu-item-label">Export</span>
    </button>
  `);

  if (ribbonState === "smallest" && summary.bulkToggleAction && summary.bulkToggleCount) {
    const toggleLabel = `${summary.bulkToggleAction === "enable" ? "Enable" : "Disable"} ${formatSelectedRuleCountLabel(summary.bulkToggleCount)}`;
    const toggleIsOn = summary.bulkToggleAction === "disable";
    menuRows.push(`
      <button
        type="button"
        class="menu-item menu-item-toggle"
        role="switch"
        aria-checked="${toggleIsOn ? "true" : "false"}"
        onclick="toggleSelectedRulesEnabled()"
      >
        <span class="menu-item-label">${escapeHtml(toggleLabel)}</span>
        <span class="suri-toggle${toggleIsOn ? " is-on" : ""}" aria-hidden="true">
          <span class="suri-toggle-thumb"></span>
        </span>
      </button>
    `);
  }

  return menuRows.join('\n<div class="toolbar-menu-divider" aria-hidden="true"></div>\n');
}

function renderRuleSelectionRibbonInlineToggle(summary) {
  if (!summary.bulkToggleAction || !summary.bulkToggleCount) return "";
  const toggleLabel = `${summary.bulkToggleAction === "enable" ? "Enable" : "Disable"} ${formatSelectedRuleCountLabel(summary.bulkToggleCount)}`;
  const toggleIsOn = summary.bulkToggleAction === "disable";
  return `
    <div class="multi-select-ribbon-toggle-group">
      <span class="multi-select-ribbon-toggle-label">${escapeHtml(toggleLabel)}</span>
      <button class="btn-reset suri-toggle${toggleIsOn ? " is-on" : ""}" type="button" role="switch" aria-checked="${toggleIsOn ? "true" : "false"}" aria-label="${escapeHtml(toggleLabel)}" onclick="toggleSelectedRulesEnabled()">
        <span class="suri-toggle-thumb"></span>
      </button>
    </div>
  `;
}

function renderRuleSelectionRibbonOverflowButton(summary, ribbonState) {
  return `
    <div class="toolbar-menu-anchor multi-select-ribbon-menu-anchor">
      <button
        class="btn-reset btn-secondary-icon size-m style-ghost multi-select-ribbon-overflow-button"
        id="${RULE_SELECTION_RIBBON_MENU_BUTTON_ID}"
        type="button"
        aria-label="Bulk actions"
        aria-haspopup="menu"
        aria-expanded="false"
        onclick="toggleToolbarMenu(event, '${RULE_SELECTION_RIBBON_MENU_ID}', '${RULE_SELECTION_RIBBON_MENU_BUTTON_ID}')"
      >
        <span class="btn-icon-slot" aria-hidden="true">
          ${svgIcon(SURI_RULES_MEATBALL_ICON_SRC, 16)}
        </span>
      </button>
      <div class="menu menu-list dropdown-menu multi-select-ribbon-overflow-menu" id="${RULE_SELECTION_RIBBON_MENU_ID}">
        ${renderRuleSelectionRibbonOverflowMenu(summary, ribbonState)}
      </div>
    </div>
  `;
}

function renderRuleSelectionRibbonMarkup(ribbon, summary, ribbonState) {
  const selectedCountLabel = `Selected ${formatSelectedRuleCountLabel(summary.count)}`;
  const ribbonActions = [];

  if (ribbonState === "full") {
    if (summary.allEditable) {
      ribbonActions.push(`
        <button class="btn-reset btn-secondary size-m style-ghost multi-select-ribbon-button is-danger" type="button" onclick="deleteSelectedRules()">
          <span class="btn-secondary-labelgroup">
            <span class="btn-icon-slot" aria-hidden="true">
              ${svgIcon(SURI_RULES_DELETE_ICON_SRC, 16)}
            </span>
            <span class="btn-label">Delete</span>
          </span>
        </button>
      `);
    }

    ribbonActions.push(`
      <button class="btn-reset btn-secondary size-m style-ghost multi-select-ribbon-button" type="button" onclick="exportSelectedRules()">
        <span class="btn-secondary-labelgroup">
          <span class="btn-icon-slot" aria-hidden="true">
            ${svgIcon(SURI_RULES_EXPORT_ICON_SRC, 16)}
          </span>
          <span class="btn-label">Export</span>
        </span>
      </button>
    `);

    const inlineToggle = renderRuleSelectionRibbonInlineToggle(summary);
    if (inlineToggle) {
      ribbonActions.push(inlineToggle);
    }
  } else if (ribbonState === "compact") {
    ribbonActions.push(renderRuleSelectionRibbonOverflowButton(summary, ribbonState));
    const inlineToggle = renderRuleSelectionRibbonInlineToggle(summary);
    if (inlineToggle) {
      ribbonActions.push(inlineToggle);
    }
  } else {
    ribbonActions.push(renderRuleSelectionRibbonOverflowButton(summary, ribbonState));
  }

  ribbon.innerHTML = `
    <div class="multi-select-ribbon-body" data-ribbon-state="${ribbonState}">
      <div class="multi-select-ribbon-label">${escapeHtml(selectedCountLabel)}</div>
      <div class="multi-select-ribbon-actions">
        ${ribbonActions.join('<span class="multi-select-ribbon-divider" aria-hidden="true"></span>')}
      </div>
    </div>
  `;
}

function renderRuleSelectionRibbon() {
  const ribbon = document.getElementById("multiSelectRibbon");
  const tableShell = document.querySelector(".table-shell");
  if (!ribbon) return;
  const selectedNode = getCurrentSelectionNode();
  if (!selectedNode || selectedNode.source === "Teleseer") {
    ribbon.classList.add("hidden");
    ribbon.innerHTML = "";
    tableShell?.classList.remove("has-floating-ribbon");
    return;
  }
  const summary = getSelectedRuleSummary();
  if (!summary.count) {
    ribbon.classList.add("hidden");
    ribbon.innerHTML = "";
    tableShell?.classList.remove("has-floating-ribbon");
    return;
  }
  ribbon.classList.remove("hidden");
  tableShell?.classList.add("has-floating-ribbon");
  let ribbonState = "full";
  for (let index = 0; index < 3; index += 1) {
    renderRuleSelectionRibbonMarkup(ribbon, summary, ribbonState);
    const nextState = getRuleSelectionRibbonStateThatFits(ribbon, ribbonState);
    if (nextState === ribbonState || ribbonState === "smallest") break;
    ribbonState = nextState;
  }
}

function deleteSelectedRules() {
  closeToolbarMenus();
  const { editableRules, allEditable } = getSelectedRuleSummary();
  if (!allEditable || !editableRules.length) return;
  const selectedIds = new Set(editableRules.map((rule) => rule.id));
  suricataRuleDb = suricataRuleDb.filter((rule) => !selectedIds.has(rule.id));
  selectedRuleIds = new Set();
  refreshRuleCollections({ preservePage: true });
  renderSidebar();
  renderRules();
  showToast(`Deleted ${editableRules.length} rule${editableRules.length === 1 ? "" : "s"}`);
}

function setSelectedRulesEnabled(nextEnabled) {
  const summary = getSelectedRuleSummary();
  if (!summary.bulkToggleAction || !summary.bulkToggleCount) return;
  const targetRules = summary.editableRules.filter((rule) =>
    nextEnabled ? !rule.enabled : rule.enabled
  );
  if (!targetRules.length) return;
  const selectedIds = new Set(targetRules.map((rule) => rule.id));
  suricataRuleDb = suricataRuleDb.map((rule) =>
    selectedIds.has(rule.id)
      ? { ...rule, enabled: nextEnabled, statusDot: nextEnabled ? "green" : "gray" }
      : rule
  );
  refreshRuleCollections({ preservePage: true });
  renderRules();
  showToast(
    `${nextEnabled ? "Enabled" : "Disabled"} ${targetRules.length} rule${targetRules.length === 1 ? "" : "s"}`
  );
}

function toggleSelectedRulesEnabled() {
  closeToolbarMenus();
  const { bulkToggleAction } = getSelectedRuleSummary();
  if (bulkToggleAction === "enable") {
    setSelectedRulesEnabled(true);
    return;
  }
  if (bulkToggleAction === "disable") {
    setSelectedRulesEnabled(false);
  }
}

function exportSelectedRules() {
  closeToolbarMenus();
  const { count } = getSelectedRuleSummary();
  if (!count) return;
  showToast(`Exported ${count} selected rule${count === 1 ? "" : "s"}`);
}

function copyLinkSelectedRules() {
  const { rules } = getSelectedRuleSummary();
  if (!rules.length) return;
  const payload = rules.map((rule) => `${rule.source}:${rule.sid}`).join("\n");
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(payload).then(
      () => showToast(`Copied ${rules.length} link${rules.length === 1 ? "" : "s"}`),
      () => showToast("Could not copy links"),
    );
    return;
  }
  showToast("Clipboard not available");
}

function duplicateSelectedRules() {
  const { rules } = getSelectedRuleSummary();
  if (!rules.length) return;
  const targetNodeId = getDefaultDuplicateTargetNodeId();
  if (!targetNodeId) return;
  const duplicates = rules
    .map((rule) =>
      duplicateRuleToCustomTarget(rule.id, targetNodeId, {
        openDrawer: false,
        enterEditMode: false,
        syncSelection: false,
        render: false,
      })
    )
    .filter(Boolean);
  if (!duplicates.length) return;
  selectSidebarNodeById(targetNodeId, { keepDrawer: false });
  selectedRuleIds = new Set(duplicates.map((rule) => rule.id));
  renderRules();
  showToast(
    `Duplicated ${duplicates.length} rule${duplicates.length === 1 ? "" : "s"} to Custom Detection`
  );
}

function editSelectedRules() {
  const { singleEditableRule } = getSelectedRuleSummary();
  if (!singleEditableRule) return;
  selectedRuleIds = new Set();
  openDrawer(singleEditableRule.id);
  toggleEditMode();
}

function resolveReferencedOriginalRule(rule) {
  if (!rule) return null;
  const referenceSid = Number(rule.relatedSid ?? rule.sid);
  const originFolderNodeId = rule.originFolderNodeId || rule.folderNodeId || "";
  const candidatesBySid = suricataRuleDb.filter(
    (item) => Number(item?.sid) === referenceSid,
  );
  const candidates = candidatesBySid.length
    ? candidatesBySid
    : suricataRuleDb.filter((item) => Number(item?.relatedSid) === referenceSid);
  if (!candidates.length) return null;
  return (
    candidates.find(
      (item) =>
        item.id !== rule.id &&
        (item.folderNodeId === originFolderNodeId ||
          item.originFolderNodeId === originFolderNodeId) &&
        isReadonlySuricataRule(item),
    ) ||
    candidates.find(
      (item) =>
        item.id !== rule.id &&
        (item.folderNodeId === originFolderNodeId ||
          item.originFolderNodeId === originFolderNodeId),
    ) ||
    candidates.find((item) => item.id !== rule.id && isReadonlySuricataRule(item)) ||
    candidates.find((item) => item.id !== rule.id) ||
    candidates[0]
  );
}

function openReferenceRuleMeta(event, ruleId) {
  event?.stopPropagation?.();
  event?.preventDefault?.();
  const rule = suricataRuleDb.find((item) => item.id === ruleId);
  if (!rule) return;
  const originalRule = resolveReferencedOriginalRule(rule);
  if (!originalRule) return;
  if (typeof openDrawerForRule === "function") {
    openDrawerForRule(originalRule);
    return;
  }
  openDrawer(originalRule.id);
}

function jumpToReferenceFolderMeta(event, ruleId) {
  event?.stopPropagation?.();
  event?.preventDefault?.();
  const rule = suricataRuleDb.find((item) => item.id === ruleId);
  const targetNodeId = rule?.originFolderNodeId || rule?.folderNodeId;
  if (!targetNodeId) return;
  expandSidebarPathToNode(targetNodeId);
  selectSidebarNodeById(targetNodeId);
}

function getActionToneClass(action) {
  const normalized = String(action || "Alert").toLowerCase();
  if (normalized === "pass") return "is-pass";
  if (normalized === "drop") return "is-drop";
  return "is-alert";
}

function getRuleStatusTags(rule) {
  const tags = Array.isArray(rule.ruleStateTags)
    ? rule.ruleStateTags.filter(Boolean).filter((tag) => {
        const label = String(tag?.label || "").toLowerCase();
        return label === "broken";
      })
    : [];
  return isReadonlyStatusRule(rule)
    ? [{ label: "Read-only", tone: "readonly" }, ...tags]
    : tags;
}

function splitStatusTagsForCell(tags) {
  const visible = [];
  let estimatedWidth = 0;
  for (const tag of tags) {
    const label = String(tag?.label || "").trim();
    if (!label) continue;
    const nextWidth = estimatedWidth + label.length + 6;
    if (visible.length >= 2 || (visible.length > 0 && nextWidth > 28)) {
      break;
    }
    visible.push(tag);
    estimatedWidth = nextWidth;
  }
  return {
    visible,
    hidden: tags.slice(visible.length),
  };
}

function renderStatusTags(rule) {
  const tags = getRuleStatusTags(rule);
  if (!tags.length) return '<div class="rule-status-stack"><span class="variable-empty">-</span></div>';
  const { visible, hidden } = splitStatusTagsForCell(tags);
  const hiddenTooltip = hidden.length
    ? getTooltipAttribute(formatTooltipItems(hidden.map((tag) => tag.label)))
    : "";
  return `
    <div class="rule-status-stack">
      ${visible.map((tag) => `<span class="status-pill tone-${escapeHtml(tag.tone || "neutral")}">${escapeHtml(tag.label)}</span>`).join("")}
      ${
        hidden.length
          ? `<span class="variable-chip rule-project-chip status-pill-overflow"${hiddenTooltip}>+${hidden.length}</span>`
          : ""
      }
    </div>
  `;
}

function renderGroupedRuleRows(pageRules, metricState = currentRenderMetrics) {
  if (toolbarState.group === "none") {
    return pageRules.map((rule) => renderRuleRow(rule, metricState)).join("");
  }
  const groups = new Map();
  pageRules.forEach((rule) => {
    let key = getDisplayFolderLabel(rule.folderNodeId || "");
    if (toolbarState.group === "action") {
      key = String(rule.action || "Alert");
    } else if (toolbarState.group === "class") {
      key = String(rule.classType || "Unknown");
    } else if (toolbarState.group === "status") {
      key = getRuleStatusTags(rule)[0]?.label || "No Status";
    }
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rule);
  });
  return Array.from(groups.entries())
    .map(([groupName, rules]) => `
      <tr class="rules-group-row"><td colspan="${getTableLayoutColumns("suricata").length}">${escapeHtml(groupName)} <span>${rules.length}</span></td></tr>
      ${rules.map((rule) => renderRuleRow(rule, metricState)).join("")}
    `)
    .join("");
}

function getRuleMetricMax(metricKey) {
  const sourceRules = allRules.length ? allRules : suricataRuleDb;
  return sourceRules.reduce((max, rule) => {
    const value = Number(rule?.[metricKey]);
    if (!Number.isFinite(value) || value < 0) return max;
    return Math.max(max, value);
  }, 1);
}

function getRuleMetricFillPercent(value, maxValue) {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(maxValue) || maxValue <= 0) {
    return 0;
  }
  return Math.max(10, Math.min(100, (value / maxValue) * 100));
}

function getSuricataTableBodyContainer() {
  return document.getElementById("rulesTableBodyContainer");
}

function getSuricataTableBody() {
  return document.getElementById("rulesTableBody");
}

function getSuricataTableColumns() {
  return getTableLayoutColumns("suricata");
}

function resetSuricataVirtualWindow() {
  currentRenderItems = [];
  currentRenderOffsets = [];
  currentRenderTotalHeight = 0;
  if (suricataVirtualRenderFrame) {
    window.cancelAnimationFrame(suricataVirtualRenderFrame);
    suricataVirtualRenderFrame = 0;
  }
  const container = getSuricataTableBodyContainer();
  if (container) {
    container.scrollTop = 0;
  }
}

function buildSuricataRenderModel(pageRules) {
  const items = [];
  const groupBy = toolbarState.group;
  if (groupBy === "none") {
    pageRules.forEach((rule) => {
      items.push({
        type: "rule",
        rule,
        height: SURICATA_TABLE_VIEWPORT.rowHeight,
      });
    });
  } else {
    const groups = new Map();
    pageRules.forEach((rule) => {
      let key = getDisplayFolderLabel(rule.folderNodeId || "");
      if (groupBy === "action") {
        key = String(rule.action || "Alert");
      } else if (groupBy === "class") {
        key = String(rule.classType || "Unknown");
      } else if (groupBy === "status") {
        key = getRuleStatusTags(rule)[0]?.label || "No Status";
      }
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(rule);
    });

    for (const [label, rules] of groups.entries()) {
      items.push({
        type: "group",
        label,
        count: rules.length,
        height: SURICATA_TABLE_VIEWPORT.groupRowHeight,
      });
      rules.forEach((rule) => {
        items.push({
          type: "rule",
          rule,
          height: SURICATA_TABLE_VIEWPORT.rowHeight,
        });
      });
    }
  }

  const offsets = new Array(items.length + 1);
  offsets[0] = 0;
  for (let index = 0; index < items.length; index += 1) {
    offsets[index + 1] = offsets[index] + items[index].height;
  }
  currentRenderItems = items;
  currentRenderOffsets = offsets;
  currentRenderTotalHeight = offsets[offsets.length - 1] || 0;
}

function findSuricataRenderStartIndex(startY) {
  let low = 0;
  let high = currentRenderItems.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (currentRenderOffsets[mid + 1] <= startY) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

function findSuricataRenderEndIndex(endY) {
  let low = 0;
  let high = currentRenderItems.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (currentRenderOffsets[mid] < endY) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return Math.max(0, low - 1);
}

function renderSpacerRow(spacerHeight, columnsLength, spacerClass = "") {
  if (spacerHeight <= 0) return "";
  const className = spacerClass ? `rules-table-spacer ${spacerClass}` : "rules-table-spacer";
  return `
    <tr class="${className}" aria-hidden="true" style="height:${spacerHeight}px">
      <td colspan="${columnsLength}" style="height:${spacerHeight}px;padding:0;border:0;line-height:0;font-size:0"></td>
    </tr>
  `;
}

function renderSuricataVirtualRows() {
  const tbody = getSuricataTableBody();
  const container = getSuricataTableBodyContainer();
  if (!tbody || !container) return;
  const columns = getSuricataTableColumns();
  if (!currentRenderItems.length) {
    tbody.innerHTML = "";
    const paginationStartEl = document.getElementById("paginationStart");
    const paginationEndEl = document.getElementById("paginationEnd");
    if (paginationStartEl) paginationStartEl.textContent = "0";
    if (paginationEndEl) paginationEndEl.textContent = "0";
    return;
  }

  const viewportHeight = Math.max(0, container.clientHeight || 0);
  const maxScrollTop = Math.max(0, currentRenderTotalHeight - viewportHeight);
  if (container.scrollTop > maxScrollTop) {
    container.scrollTop = maxScrollTop;
  }
  const scrollTop = Math.max(0, container.scrollTop || 0);
  const overscan = SURICATA_TABLE_VIEWPORT.overscanRows * SURICATA_TABLE_VIEWPORT.rowHeight;
  const startY = Math.max(0, scrollTop - overscan);
  const endY = Math.min(currentRenderTotalHeight, scrollTop + viewportHeight + overscan);
  const startIndex = findSuricataRenderStartIndex(startY);
  const endIndex = findSuricataRenderEndIndex(endY);
  const firstIndex = Math.min(startIndex, currentRenderItems.length - 1);
  const lastIndex = Math.max(firstIndex, Math.min(endIndex, currentRenderItems.length - 1));
  const topSpacer = currentRenderOffsets[firstIndex] || 0;
  const bottomSpacer = Math.max(
    0,
    currentRenderTotalHeight - (currentRenderOffsets[lastIndex + 1] || currentRenderTotalHeight),
  );

  const visibleMarkup = currentRenderItems
    .slice(firstIndex, lastIndex + 1)
    .map((item) => {
      if (item.type === "group") {
        return `
          <tr class="rules-group-row" style="height:${SURICATA_TABLE_VIEWPORT.groupRowHeight}px">
            <td colspan="${columns.length}">${escapeHtml(item.label)} <span>${escapeHtml(String(item.count || 0))}</span></td>
          </tr>
        `;
      }
      return renderRuleRow(item.rule, currentRenderMetrics);
    })
    .join("");

  tbody.innerHTML = [
    renderSpacerRow(topSpacer, columns.length, "is-top"),
    visibleMarkup,
    renderSpacerRow(bottomSpacer, columns.length, "is-bottom"),
  ]
    .filter(Boolean)
    .join("");

  const paginationStartEl = document.getElementById("paginationStart");
  const paginationEndEl = document.getElementById("paginationEnd");
  if (paginationStartEl) paginationStartEl.textContent = String(currentRules.length ? 1 : 0);
  if (paginationEndEl) paginationEndEl.textContent = String(currentRules.length);
}

function scheduleSuricataVirtualRowsRender() {
  if (suricataVirtualRenderFrame) return;
  suricataVirtualRenderFrame = window.requestAnimationFrame(() => {
    suricataVirtualRenderFrame = 0;
    renderSuricataVirtualRows();
  });
}

function renderRuleMetricPill(label, fillPercent, extraClass = "") {
  if (label === "-" || label === "") {
    return `<span class="rule-metric-pill is-empty${extraClass ? ` ${extraClass}` : ""}"><span class="rule-metric-value">-</span></span>`;
  }
  return `
    <span class="rule-metric-pill${extraClass ? ` ${extraClass}` : ""}">
      <span class="rule-metric-fill" style="width:${fillPercent.toFixed(1)}%"></span>
      <span class="rule-metric-value">${escapeHtml(label)}</span>
    </span>
  `;
}

function renderRuleRow(rule, metricState = currentRenderMetrics) {
  const secondaryFolder = getDisplayFolderLabel(rule.originFolderNodeId || rule.folderNodeId);
  const speedMax = Number(metricState?.speedMax) || getRuleMetricMax("speedValue");
  const hitsMax = Number(metricState?.hitsMax) || getRuleMetricMax("totalHits");
  const speedLabel = rule.speed || "-";
  const speedFill = getRuleMetricFillPercent(Number(rule.speedValue), speedMax);
  const hitsLabel = formatHitCount(rule.totalHits || 0);
  const hitsFill = getRuleMetricFillPercent(Number(rule.totalHits), hitsMax);
  const isBulkSelected = selectedRuleIds.has(rule.id);
  const statusTone = rule.enabled ? "is-green" : "is-gray";
  const nameTooltip = (rule.name || "")
    ? `${getTooltipAttribute(rule.name)} data-tooltip-overflow`
    : "";
  const showDerivedMeta = !isReadonlySuricataRule(rule);
  const metaLine = showDerivedMeta
    ? `
          <span class="rule-meta-line">
            <button class="btn-reset rule-meta-item rule-meta-action" type="button" onclick="openReferenceRuleMeta(event, ${rule.id})" aria-label="Open original rule ${escapeHtml(String(rule.relatedSid || rule.sid || "-"))}">
              <span class="rule-meta-icon svg-icon" style="--icon-url: url('${escapeHtml(SURI_ICON_RELATED_SID_SRC)}')" aria-hidden="true"></span>${escapeHtml(String(rule.relatedSid || rule.sid || "-"))}
            </button>
            <span class="rule-meta-divider" aria-hidden="true"></span>
            <button class="btn-reset rule-meta-item rule-meta-action" type="button" onclick="jumpToReferenceFolderMeta(event, ${rule.id})" aria-label="Jump to original folder ${escapeHtml(secondaryFolder)}">
              <span class="rule-meta-icon svg-icon" style="--icon-url: url('${escapeHtml(SURI_ICON_FOLDER_SRC)}')" aria-hidden="true"></span>${escapeHtml(secondaryFolder)}
            </button>
          </span>
        `
    : "";
  const cells = [
    `
      <td class="col-select col-select-combo">
        <button class="btn-reset rule-select-toggle${isBulkSelected ? " is-selected" : ""}" type="button" onclick="toggleRuleSelection(event, ${rule.id})" aria-label="${isBulkSelected ? "Deselect" : "Select"} rule ${escapeHtml(rule.name || "")}">
          <span class="rule-row-checkbox sot-checkbox${isBulkSelected ? " is-checked" : ""}" aria-hidden="true"></span>
        </button>
      </td>
    `,
    `
      <td class="col-led col-led-combo">
        <span class="rule-status-dot ${statusTone}" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="4.5" fill="currentColor"/></svg>
        </span>
      </td>
    `,
  ];
  if (isSuricataColumnVisible("sid")) {
    cells.push(`<td class="col-sid">${escapeHtml(String(rule.sid || "-"))}</td>`);
  }
  if (isSuricataColumnVisible("action")) {
    cells.push(`<td class="col-action"><span class="rule-action-pill ${getActionToneClass(rule.action)}">${escapeHtml(rule.action || "Alert")}</span></td>`);
  }
  if (isSuricataColumnVisible("name")) {
    cells.push(`
      <td class="col-name">
        <div class="rule-name-stack">
          <span class="rule-name rule-name-primary"${nameTooltip}>${escapeHtml(rule.name)}</span>
          ${metaLine}
        </div>
      </td>
    `);
  }
  if (isSuricataColumnVisible("class")) {
    cells.push(`<td class="col-class"><span class="rule-class">${escapeHtml(rule.classType || "-")}</span></td>`);
  }
  if (isSuricataColumnVisible("speed")) {
    cells.push(`<td class="col-speed">${renderRuleMetricPill(speedLabel, speedFill, "is-speed")}</td>`);
  }
  if (isSuricataColumnVisible("lastSeen")) {
    cells.push(`<td class="col-last-seen">${escapeHtml(rule.lastSeen || "-")}</td>`);
  }
  cells.push(`<td class="col-hits">${renderRuleMetricPill(hitsLabel, hitsFill, "is-hits")}</td>`);
  if (isSuricataColumnVisible("status")) {
    cells.push(`<td class="col-status">${renderStatusTags(rule)}</td>`);
  }
  return `
    <tr class="${selectedRule === rule.id ? "selected" : ""}${isBulkSelected ? " is-bulk-selected" : ""}" onclick="handleRuleRowClick(event, ${rule.id})">
      ${cells.join("")}
    </tr>
  `;
}

function renderDefaultAlertRow(rule) {
  const projects = Array.isArray(rule.projects) ? rule.projects.filter(Boolean) : [];
  const projectsLabel = projects.length
    ? `${projects.length} ${projects.length === 1 ? "Project" : "Projects"}`
    : "-";
  const projectTooltip = getTooltipAttribute(formatTooltipItems(projects));
  const projectChip = projects.length
    ? `<span class="variable-chip rule-project-chip"${projectTooltip}>${escapeHtml(projectsLabel)}</span>`
    : '<span class="variable-empty">-</span>';
  const hitsMax = getRuleMetricMax("totalHits");
  const hitsLabel = formatHitCount(rule.totalHits || 0);
  const hitsFill = getRuleMetricFillPercent(Number(rule.totalHits), hitsMax);
  return `
    <tr class="${selectedRule === rule.id ? "selected" : ""}" onclick="openDrawer(${rule.id})">
      <td class="col-name">
        <div class="default-name-stack">
          <span class="rule-name">${escapeHtml(rule.name)}</span>
          <span class="default-rule-description">${escapeHtml(rule.description || "")}</span>
        </div>
      </td>
      <td class="col-projects">${projectChip}</td>
      <td class="col-total">${renderRuleMetricPill(hitsLabel, hitsFill)}</td>
      <td class="col-status">${renderStatusTags(rule)}</td>
    </tr>
  `;
}

function updateRuleCounts() {
  const ruleCountEl = document.getElementById("ruleCount");
  if (ruleCountEl) ruleCountEl.textContent = formatCompactCount(currentRules.length);
  const totalEl = document.getElementById("paginationTotal");
  if (totalEl) totalEl.textContent = formatCompactCount(currentRules.length);
}

function renderRules(options = {}) {
  const resetScroll = Boolean(options.resetScroll);
  const headTable = document.getElementById("rulesTableHeadTable");
  const bodyTable = document.getElementById("rulesTableBodyTable");
  const thead = document.getElementById("rulesTableHead");
  const tbody = document.getElementById("rulesTableBody");
  if (!tbody || !thead || !headTable || !bodyTable) return;
  renderContentActions();
  renderSidebarFooterActions();
  applyToolbarUi();
  updateHeaderActionState();

  if (isVariablesViewActive()) {
    renderVariablesTable(headTable, thead, bodyTable, tbody);
    return;
  }

  const selectedNode = getCurrentSelectionNode();
  refreshRuleCollections({ preservePage: true });
  renderBreadcrumb(selectedNode?.label || activeCategory, selectedNode?.source || sidebarState.selectedSource);
  updateRuleCounts();

  const isDefaultAlertsTable = selectedNode?.source === "Teleseer";
  const layoutKey = isDefaultAlertsTable ? "defaultAlerts" : "suricata";
  const columns = getTableLayoutColumns(layoutKey);
  const bodyContainer = getSuricataTableBodyContainer();
  [headTable, bodyTable].forEach((table) => {
    table.classList.toggle("default-table", isDefaultAlertsTable);
    table.classList.toggle("suricata-feed-table", !isDefaultAlertsTable);
    table.classList.toggle("variables-table", false);
  });
  if (!isDefaultAlertsTable && resetScroll && bodyContainer) {
    bodyContainer.scrollTop = 0;
  }
  bodyTable.classList.toggle("is-selection-active", !isDefaultAlertsTable && isRuleSelectionActive());
  thead.innerHTML = renderTableHeaderRow(layoutKey, columns);
  applyTableColumnLayout(layoutKey, columns);
  renderRuleSelectionRibbon();

  const pageRules = currentRules;
  if (isDefaultAlertsTable) {
    currentRenderItems = [];
    currentRenderOffsets = [];
    currentRenderTotalHeight = 0;
    currentRenderMetrics = { speedMax: 1, hitsMax: 1 };
    tbody.innerHTML = pageRules.map((rule) => renderDefaultAlertRow(rule)).join("");
    applyTableRowHeights();
  } else {
    currentRenderMetrics = {
      speedMax: getRuleMetricMax("speedValue"),
      hitsMax: getRuleMetricMax("totalHits"),
    };
    buildSuricataRenderModel(pageRules);
    renderSuricataVirtualRows();
  }

  const paginationStartEl = document.getElementById("paginationStart");
  const paginationEndEl = document.getElementById("paginationEnd");
  const prevPageEl = document.getElementById("prevPage");
  const nextPageEl = document.getElementById("nextPage");
  if (paginationStartEl) paginationStartEl.textContent = String(currentRules.length ? 1 : 0);
  if (paginationEndEl) paginationEndEl.textContent = String(currentRules.length);
  if (prevPageEl) prevPageEl.disabled = true;
  if (nextPageEl) nextPageEl.disabled = true;
}

function formatHitCount(value) {
  return formatCompactCount(value);
}

function changePage(delta) {
  renderRules();
}

function filterRules() {
  renderRules({ resetScroll: true });
}

function applyTableRowHeights() {
  const bodyTable = document.getElementById("rulesTableBodyTable");
  if (bodyTable?.classList.contains("suricata-feed-table")) return;
  const rows = document.querySelectorAll("#rulesTableBody tr");
  rows.forEach((row) => {
    if (row.classList.contains("rules-group-row")) return;
    if (row.classList.contains("rules-table-spacer")) return;
    const lines = row.querySelector(".rule-meta-line") ? 2 : 1;
    row.classList.toggle("row-lines-2", lines === 2);
    row.classList.toggle("row-lines-3", false);
  });
}

syncAlertingSidebarSemantics();
refreshRuleCollections();
