/* Alerting modal drawer runtime. */

let selectedRule = null;
let editMode = false;
const THRESHOLD_MIN = 1;
const THRESHOLD_MAX = 100;
const DEFAULT_QUOTA_MIN = 1000;
const DEFAULT_QUOTA_MAX = 20000;
const SURICATA_COUNT_MIN = 1;
const SURICATA_COUNT_MAX = 100;
const DEFAULT_RULE_CONFIG_YAML = [
  "alert http $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (",
  '  msg:"ET EXPLOIT Apache Log4j RCE Attempt";',
  "  flow:to_server,established;",
  '  content:"${jndi:"; nocase;',
  "  classtype:trojan-activity;",
  "  sid:2024847;",
  "  rev:4;",
  ")",
].join("\n");
const DEFAULT_REFERENCE_ROWS = [
  {
    title: "CVE-2021-44228",
    url: "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228",
  },
  {
    title: "NVD Advisory",
    url: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228",
  },
  {
    title: "Apache Security Advisory",
    url: "https://logging.apache.org/log4j/2.x/security.html",
  },
  {
    title: "MITRE T1190 - Exploit Public-Facing App",
    url: "https://attack.mitre.org/techniques/T1190/",
  },
  {
    title: "CISA Alert AA21-356A",
    url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-356a",
  },
];
const DEFAULT_ALERT_REFERENCE_ROWS = [
  { title: "MITRE, Commonly Used Port", url: "https://attack.mitre.org/" },
  { title: "MITRE, Non-Standard Port", url: "https://attack.mitre.org/" },
  { title: "MITRE, Protocol Tunneling", url: "https://attack.mitre.org/" },
  {
    title: "BitSight, Open Ports: are they a vulnerability?",
    url: "https://www.bitsight.com/",
  },
  {
    title:
      "Netwrix, Identifying Common Open Port Vulnerabilities in Your Network,",
    url: "https://blog.netwrix.com/",
  },
  {
    title: "Cisco, What attack is port-hopping?",
    url: "https://www.cisco.com/",
  },
];
const DRAWER_VERSION_HISTORY_SEED = [
  { label: "v4 Latest", savedAt: "Apr 21, 2026 14:18" },
  { label: "v3 729a2", savedAt: "Apr 18, 2026 09:42" },
  { label: "v2 5ea9e", savedAt: "Apr 12, 2026 17:06" },
  { label: "v1 a5e9e", savedAt: "Apr 03, 2026 08:14" },
];
const SURI_ICON_DIRECTION_UNIDIRECTIONAL_SRC = resolveIconPath(
  "ui_core/unused/icon_arrow_short_right.svg",
);
const SURI_ICON_DIRECTION_BIDIRECTIONAL_SRC = resolveIconPath(
  "ui_core/collection/icon_direction_lateral.svg",
);
const SURI_ICON_ERROR_FILL_SRC = resolveIconPath(
  "ui_core/collection/icon_error_fill.svg",
);
const SURI_PROTOCOL_ICON_MAP = {
  DNS: resolveIconPath("protocols/technical/protocol_dnscrypt.svg"),
  HTTP: resolveIconPath("protocols/technical/protocol_web_http.svg"),
  HTTP2: resolveIconPath("protocols/technical/protocol_web_http_2.svg"),
  FTP: resolveIconPath("protocols/technical/protocol_ftp.svg"),
  TLS: resolveIconPath("protocols/technical/protocol_ssl.svg"),
  SMTP: resolveIconPath("protocols/technical/protocol_smtp.svg"),
  IMAP: resolveIconPath("protocols/technical/protocol_imap.svg"),
  JABBER: resolveIconPath("protocols/general/protocol_jabber_file_transfer.svg"),
  RDP: resolveIconPath("protocols/technical/protocol_rdp.svg"),
  SMB: resolveIconPath("protocols/technical/protocol_smb_cifs.svg"),
  SSH: resolveIconPath("protocols/technical/protocol_ssh.svg"),
  IRC: resolveIconPath("protocols/technical/protocol_irc.svg"),
  MODBUS: resolveIconPath("protocols/technical/protocol_modbus.svg"),
  DNP3: resolveIconPath("protocols/technical/protocol_dnp3.svg"),
  NFS: resolveIconPath("protocols/general/protocol_nfs.svg"),
  NTP: resolveIconPath("protocols/technical/protocol_ntp.svg"),
  FTPDATA: resolveIconPath("protocols/technical/protocol_ftps_data.svg"),
  TFTP: resolveIconPath("protocols/technical/protocol_tftp.svg"),
  KRB5: resolveIconPath("protocols/general/protocol_kerberos.svg"),
  DHCP: resolveIconPath("protocols/technical/protocol_dhcp.svg"),
  SNMP: resolveIconPath("protocols/technical/protocol_snmp.svg"),
  SIP: resolveIconPath("protocols/technical/protocol_sip.svg"),
  MQTT: resolveIconPath("protocols/general/protocol_mqtt.svg"),
  BITTORRENT: resolveIconPath("protocols/general/protocol_bittorrent.svg"),
  TELNET: resolveIconPath("protocols/general/protocol_telnet.svg"),
  POSTGRES: resolveIconPath("protocols/general/protocol_postgresql.svg"),
  QUIC: resolveIconPath("protocols/general/protocol_quic.svg"),
  UNKNOWN: resolveIconPath("protocols/technical/protocol_unknown.svg"),
};
const SURICATA_PROTOCOL_OPTIONS = [
  "HTTP",
  "HTTP2",
  "FTP",
  "SMTP",
  "TLS",
  "SSH",
  "IMAP",
  "JABBER",
  "SMB",
  "DCERPC",
  "IRC",
  "DNS",
  "MODBUS",
  "ENIP",
  "DNP3",
  "NFS",
  "NTP",
  "FTPDATA",
  "TFTP",
  "IKE",
  "IKEV2",
  "KRB5",
  "DHCP",
  "SNMP",
  "SIP",
  "RFB",
  "MQTT",
  "RDP",
  "BITTORRENT",
  "TELNET",
  "POSTGRES",
  "QUIC",
].map((value) => ({
  value,
  icon: SURI_PROTOCOL_ICON_MAP[value] || SURI_PROTOCOL_ICON_MAP.UNKNOWN,
}));
const DEFAULT_ALERT_PROTOCOL_OPTIONS = [
  { value: "DNS", icon: SURI_PROTOCOL_ICON_MAP.DNS },
  { value: "HTTP", icon: SURI_PROTOCOL_ICON_MAP.HTTP },
  { value: "TLS", icon: SURI_PROTOCOL_ICON_MAP.TLS },
  { value: "RDP", icon: SURI_PROTOCOL_ICON_MAP.RDP },
  { value: "SMB", icon: SURI_PROTOCOL_ICON_MAP.SMB },
  { value: "SSH", icon: SURI_PROTOCOL_ICON_MAP.SSH },
];
const DEFAULT_ALERT_HOST_OPTIONS = [
  {
    value: "HQ-SRV-AD-01",
    meta: "Domain Controller",
    icon: resolveIconPath(
      "device_asset/server/identity_access_control_server_iso.svg",
    ),
  },
  {
    value: "DMZ-WEB-02",
    meta: "DMZ Web",
    icon: resolveIconPath("device_asset/server/web_server_iso.svg"),
  },
  {
    value: "OT-PLC-07",
    meta: "ICS Controller",
    icon: resolveIconPath(
      "device_asset/device/programmable_logic_controller_iso.svg",
    ),
  },
  {
    value: "VPN-GW-01",
    meta: "Edge Gateway",
    icon: resolveIconPath("device_asset/server/vpn_server_iso.svg"),
  },
  {
    value: "MAIL-EX-01",
    meta: "Exchange",
    icon: resolveIconPath("device_asset/server/mail_server_iso.svg"),
  },
  {
    value: "DB-PRD-01",
    meta: "Critical Database",
    icon: resolveIconPath("device_asset/server/database_server_iso.svg"),
  },
];
const DEFAULT_ALERT_PORT_OPTIONS = [
  { value: "80", meta: "HTTP" },
  { value: "443", meta: "HTTPS" },
  { value: "53", meta: "DNS" },
  { value: "123", meta: "NTP" },
  { value: "22", meta: "SSH" },
  { value: "3389", meta: "RDP" },
  { value: "445", meta: "SMB" },
  { value: "502", meta: "Modbus" },
];
const DEFAULT_ALERT_SUBNET_OPTIONS = [
  { value: "10.10.4.0/24", meta: "HQ LAN" },
  { value: "10.10.8.0/24", meta: "Server VLAN" },
  { value: "10.20.0.0/24", meta: "Engineering" },
  { value: "172.18.31.0/24", meta: "DMZ" },
  { value: "192.168.50.0/24", meta: "Branch Office" },
  { value: "198.18.12.0/23", meta: "Test Range" },
];
const DEFAULT_ALERT_FILTER_OPTIONS = {
  protocols: {
    title: "Protocols",
    emptyLabel: "Any Protocol",
    singularLabel: "Protocol",
    pluralLabel: "Protocols",
    options: DEFAULT_ALERT_PROTOCOL_OPTIONS,
  },
  hosts: {
    title: "Project Hosts",
    emptyLabel: "Any Host",
    singularLabel: "Host",
    pluralLabel: "Hosts",
    options: DEFAULT_ALERT_HOST_OPTIONS,
  },
  sourceHosts: {
    title: "Project Hosts",
    emptyLabel: "Select Hosts",
    singularLabel: "Host",
    pluralLabel: "Hosts",
    options: DEFAULT_ALERT_HOST_OPTIONS,
  },
  destinationHosts: {
    title: "Project Hosts",
    emptyLabel: "Select Hosts",
    singularLabel: "Host",
    pluralLabel: "Hosts",
    options: DEFAULT_ALERT_HOST_OPTIONS,
  },
  ports: {
    title: "Project Ports",
    emptyLabel: "Select Ports",
    singularLabel: "Port",
    pluralLabel: "Ports",
    options: DEFAULT_ALERT_PORT_OPTIONS,
  },
  sourcePorts: {
    title: "Project Ports",
    emptyLabel: "Select Ports",
    singularLabel: "Port",
    pluralLabel: "Ports",
    options: DEFAULT_ALERT_PORT_OPTIONS,
  },
  destinationPorts: {
    title: "Project Ports",
    emptyLabel: "Select Ports",
    singularLabel: "Port",
    pluralLabel: "Ports",
    options: DEFAULT_ALERT_PORT_OPTIONS,
  },
  subnets: {
    title: "Project Subnets",
    emptyLabel: "Select Subnets",
    singularLabel: "Subnet",
    pluralLabel: "Subnets",
    options: DEFAULT_ALERT_SUBNET_OPTIONS,
  },
  sourceSubnets: {
    title: "Project Subnets",
    emptyLabel: "Select Subnets",
    singularLabel: "Subnet",
    pluralLabel: "Subnets",
    options: DEFAULT_ALERT_SUBNET_OPTIONS,
  },
  destinationSubnets: {
    title: "Project Subnets",
    emptyLabel: "Select Subnets",
    singularLabel: "Subnet",
    pluralLabel: "Subnets",
    options: DEFAULT_ALERT_SUBNET_OPTIONS,
  },
};
let suricataDrawerBaseline = null;
let suricataDrawerDraft = null;
let ruleConfigEditMode = false;
let drawerVariant = "suricata";
let suricataOpenMenuKey = null;
let suricataRulePatternAddSearch = "";
let suricataProtocolSearch = "";
let defaultAlertFilterUiState = {};
let suricataMenuScrollState = {
  menus: {},
  scopeSuggestions: {},
  defaultSuggestions: {},
  scopeChipboxes: {},
  defaultChipboxes: {},
};
let simpleMenuSelectionScrollState = {
  shells: {},
  snapToBottom: {},
};
let copyRuleDialogState = {
  mode: "copy",
  sourceRuleId: null,
  targetNodeId: null,
  createMode: null,
};
let drawerRenameMode = false;
const SURICATA_ACCORDION_DEFAULT_STATE = {
  ruleScope: true,
  rulePatterns: true,
  ruleBehaviors: true,
  references: true,
};
let suricataAccordionState = { ...SURICATA_ACCORDION_DEFAULT_STATE };
const DEFAULT_ALERT_ACCORDION_DEFAULT_STATE = {
  alertParameters: true,
  alertFilters: true,
  references: true,
};
let defaultAlertAccordionState = { ...DEFAULT_ALERT_ACCORDION_DEFAULT_STATE };
const VARIABLE_ACCORDION_DEFAULT_STATE = {
  variableHistory: true,
  variableTags: true,
};
let variableAccordionState = { ...VARIABLE_ACCORDION_DEFAULT_STATE };
const SURICATA_ROW_ACCORDION_DEFAULT_STATE = {
  ruleScopeSourceSubnets: false,
  ruleScopeDestinationSubnets: false,
  ruleScopeSourcePorts: false,
  ruleScopeDestinationPorts: false,
  ruleScopeFlowCondition: true,
  rulePatternsContentMatch: true,
  rulePatternsRegex: true,
  rulePatternsHttpUri: true,
  rulePatternsDnsQuery: false,
  behaviorAdvancedSettings: false,
};
let suricataRowAccordionState = { ...SURICATA_ROW_ACCORDION_DEFAULT_STATE };
const PARAM_EDITOR_MODE_DEFAULTS = {
  ruleScope: "simple",
  defaultAlertFilters: "simple",
  rulePatterns: "simple",
  ruleBehaviors: "simple",
  thresholdSlow: "simple",
  thresholdNoisy: "simple",
  thresholdStale: "simple",
};
let paramEditorModes = { ...PARAM_EDITOR_MODE_DEFAULTS };
const THRESHOLD_SETTINGS_DEFAULT_STATE = {
  slowMultiplier: 2.0,
  slowAbsoluteMicros: 500,
  noisyPercentile: 1,
  noisyWindow: "Last 24 Hours",
  staleDays: 30,
  flagInactiveRules: true,
};
let rulePatternIdCounter = 0;
let draggedRulePatternId = null;
let armedRulePatternDragId = null;
let rulePatternPointerDragActive = false;
const RULE_PATTERN_STRING_RELATIONS = [
  "Contains",
  "Starts With",
  "Ends With",
  "Is exactly",
];
const RULE_PATTERN_COMPARE_OPERATORS = ["=", "!=", ">", ">=", "<", "<="];
const RULE_PATTERN_MATH_OPERATORS = ["+", "-", "*", "/", "<<", ">>"];
const RULE_PATTERN_ENDIAN_OPTIONS = ["big", "little"];
const RULE_PATTERN_NUMBER_TYPE_OPTIONS = ["dec", "hex", "oct"];
const RULE_PATTERN_HTTP_HEADER_FIELD_OPTIONS = [
  "User-Agent",
  "Host",
  "Referer",
  "Cookie",
  "Custom",
];
const RULE_PATTERN_HTTP_LINE_SCOPE_OPTIONS = ["Request", "Response", "Start"];
const RULE_PATTERN_IP_SCOPE_OPTIONS = ["Source", "Destination"];
const RULE_PATTERN_TLS_IDENTIFIER_OPTIONS = [
  "Serial",
  "Thumbprint",
  "Subject",
  "Issuer",
];
const RULE_PATTERN_FILE_HASH_ALGORITHM_OPTIONS = ["MD5", "SHA-1", "SHA-256"];
const RULE_PATTERN_IP_PROTOCOL_OPTIONS = ["TCP", "UDP", "ICMP", "IP"];
const RULE_PATTERN_KRB_ERROR_OPTIONS = [
  "KDC_ERR_NONE",
  "KDC_ERR_NAME_EXP",
  "KDC_ERR_SERVICE_EXP",
  "KDC_ERR_CLIENT_REVOKED",
];
const RULE_PATTERN_FTP_COMMAND_OPTIONS = ["USER", "PASS", "STOR", "RETR", "LIST"];
const RULE_PATTERN_MODBUS_FUNCTION_OPTIONS = [
  "Read Coils",
  "Read Discrete Inputs",
  "Read Holding Registers",
  "Read Input Registers",
  "Write Single Coil",
  "Write Single Register",
];
const RULE_PATTERN_DNP3_FUNCTION_OPTIONS = [
  "Confirm",
  "Read",
  "Write",
  "Select",
  "Operate",
];
const RULE_PATTERN_DNP3_INDICATOR_OPTIONS = ["DIR", "PRM", "FCB", "FCV", "ACD", "DFC"];
const RULE_PATTERN_DNP3_OBJECT_OPTIONS = ["Group 1 Var 1", "Group 30 Var 1", "Group 32 Var 1"];
const RULE_PATTERN_ETHERNET_IP_COMMAND_OPTIONS = ["SendRRData", "SendUnitData", "ListIdentity"];
const RULE_PATTERN_HTTP_FIELD_OPTIONS = [
  { value: "httpHeader", label: "HTTP Header" },
  { value: "httpMethod", label: "HTTP Method" },
  { value: "httpUri", label: "HTTP URI" },
];
const RULE_PATTERN_TRANSFORM_CATALOG = [
  { kind: "dotprefix", label: "Prepend Dot Prefix" },
  { kind: "domain", label: "Extract Domain" },
  { kind: "tld", label: "Extract TLD" },
  { kind: "strip_whitespace", label: "Strip Whitespace" },
  { kind: "compress_whitespace", label: "Compress Whitespace" },
  { kind: "to_lowercase", label: "To Lowercase" },
  { kind: "to_uppercase", label: "To Uppercase" },
  { kind: "to_md5", label: "To MD5" },
  { kind: "to_sha1", label: "To SHA1" },
  { kind: "to_sha256", label: "To SHA256" },
  { kind: "url_decode", label: "URL Decode" },
  { kind: "from_base64", label: "From Base64" },
  {
    kind: "xor",
    label: "XOR",
    requiresArg: true,
    argField: "key",
    argPlaceholder: "0d0ac8ff",
  },
  {
    kind: "header_lowercase",
    label: "HTTP Header Lowercase",
    httpHeaderOnly: true,
  },
  {
    kind: "strip_pseudo_headers",
    label: "Strip Pseudo Headers",
    httpHeaderOnly: true,
  },
  {
    kind: "pcrexform",
    label: "Regex",
    requiresArg: true,
    argField: "expr",
    argPlaceholder: "[a-zA-Z]+\\s+(.*)\\s+HTTP",
  },
  {
    kind: "luaxform",
    label: "Lua Script",
    requiresArg: true,
    argField: "script",
    argPlaceholder: "transform.lua",
  },
];
const RULE_PATTERN_TRANSFORM_OPTION_MAP = Object.fromEntries(
  RULE_PATTERN_TRANSFORM_CATALOG.map((entry) => [entry.kind, entry]),
);
const RULE_PATTERN_HTTP_HEADER_BUFFER_MAP = {
  "User-Agent": "http.user_agent",
  Host: "http.host",
  Referer: "http.referer",
  Cookie: "http.cookie",
  Custom: "http.header",
};
const RULE_PATTERN_CATALOG = [
  {
    type: "content",
    group: "Payload",
    label: "Content",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "Match bytes or text",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Raw Bytes" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
      rawBytes: false,
    },
  },
  {
    type: "regex",
    group: "Payload",
    label: "Regex",
    enabled: true,
    kind: "regex",
    defaultRelation: "Matches",
    relations: ["Matches"],
    placeholder: "/regex_here/",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "multiline", label: "Multiline" },
      { key: "dotall", label: "Dotall" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "byteTest",
    group: "Payload",
    label: "Bytes test",
    enabled: true,
    kind: "byteTest",
    defaults: {
      byteCount: 1,
      compareOperator: "=",
      numericValue: "0",
      offset: 0,
      relative: false,
      endian: "big",
      numberType: "dec",
    },
  },
  {
    type: "byteJump",
    group: "Payload",
    label: "Byte Jump",
    enabled: true,
    kind: "byteJump",
    defaults: {
      byteCount: 1,
      offset: 0,
      relative: false,
      endian: "big",
      numberType: "dec",
    },
  },
  {
    type: "byteExtract",
    group: "Payload",
    label: "Byte Extract",
    enabled: true,
    kind: "byteExtract",
    defaults: {
      byteCount: 1,
      offset: 0,
      variableName: "var_name",
      relative: false,
      endian: "big",
      numberType: "dec",
    },
  },
  {
    type: "byteMath",
    group: "Payload",
    label: "Byte Math",
    enabled: true,
    kind: "byteMath",
    defaults: {
      byteCount: 1,
      offset: 0,
      mathOperator: "+",
      numericValue: "0",
      resultVar: "result_var",
      relative: false,
      endian: "big",
      numberType: "dec",
    },
  },
  {
    type: "isDataAt",
    group: "Payload",
    label: "Is Data At",
    enabled: true,
    kind: "isDataAt",
    defaults: {
      numericValue: "0",
      relative: false,
      negate: false,
    },
  },
  {
    type: "bufferSize",
    group: "Payload",
    label: "Buffer Size",
    enabled: true,
    kind: "numberCompare",
    keyword: "bsize",
    defaults: {
      compareOperator: "=",
      numericValue: "0",
    },
  },
  {
    type: "payloadSize",
    group: "Payload",
    label: "Payload Data Size",
    enabled: true,
    kind: "numberCompare",
    keyword: "dsize",
    defaults: {
      compareOperator: "=",
      numericValue: "0",
    },
  },
  {
    type: "entropy",
    group: "Payload",
    label: "Entropy",
    enabled: true,
    kind: "entropy",
    defaults: {
      compareOperator: ">=",
      numericValue: "7.0",
    },
  },
  {
    type: "base64Decode",
    group: "Payload",
    label: "Base64 Decode",
    enabled: true,
    kind: "base64Decode",
    defaults: {
      byteCount: 8,
      offset: 0,
      relative: false,
      rfc2045: false,
      rfc4648: true,
    },
  },
  {
    type: "httpHeader",
    group: "HTTP",
    label: "Header",
    enabled: true,
    kind: "httpHeader",
    defaultRelation: "Starts With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "Header value",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpMethod",
    group: "HTTP",
    label: "Method",
    enabled: true,
    kind: "string",
    defaultRelation: "Is exactly",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "GET",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpUri",
    group: "HTTP",
    label: "URI",
    enabled: true,
    kind: "string",
    defaultRelation: "Starts With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "/admin/login",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpHost",
    group: "HTTP",
    label: "Host",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "malicious.com",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpCookie",
    group: "HTTP",
    label: "Cookie",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "/regex_here/",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpUserAgent",
    group: "HTTP",
    label: "User Agent",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "/regex_here/",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpRequestHeader",
    group: "HTTP",
    label: "Request Header",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "custom_header",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      headerName: "header_name",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpRequestBody",
    group: "HTTP",
    label: "Request Body",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "cmd=",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpStatusCode",
    group: "HTTP",
    label: "Status Code",
    enabled: true,
    kind: "numberCompare",
    keyword: "http.stat_code",
    defaults: {
      compareOperator: "=",
      numericValue: "200",
    },
  },
  {
    type: "httpUriLength",
    group: "HTTP",
    label: "URI Length",
    enabled: true,
    kind: "numberCompare",
    keyword: "http.uri_len",
    defaults: {
      compareOperator: ">",
      numericValue: "100",
    },
  },
  {
    type: "httpResponseHeader",
    group: "HTTP",
    label: "Response Header",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "custom_header",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      headerName: "header_name",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpResponseBody",
    group: "HTTP",
    label: "Response Body",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "value",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpStatusMessage",
    group: "HTTP",
    label: "Status Message",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "value",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpLine",
    group: "HTTP",
    label: "Line",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "GET / HTTP/1.1",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      lineScope: "Request",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpStart",
    group: "HTTP",
    label: "Start",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "GET / HTTP/1.1",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpProtocol",
    group: "HTTP",
    label: "Protocol",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "GET / HTTP/1.1",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpHeaderNames",
    group: "HTTP",
    label: "Header Names",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "X-Forwarded-For",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpContentType",
    group: "HTTP",
    label: "Content Type",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "application/json",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpConnection",
    group: "HTTP",
    label: "Connection",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "keep-alive",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpAccept",
    group: "HTTP",
    label: "Accept",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "application/json",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpAcceptLanguage",
    group: "HTTP",
    label: "Accept Language",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "en-US",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpReferer",
    group: "HTTP",
    label: "Referer",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "https://defence.com",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpResponseLine",
    group: "HTTP",
    label: "Response Line",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "HTTP/1.1 200 OK",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "httpResponseHeaderName",
    group: "HTTP",
    label: "Response Header Name",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "header_name",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      headerName: "header_name",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "tlsSni",
    group: "TLS",
    label: "SNI",
    enabled: true,
    kind: "string",
    defaultRelation: "Ends With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "malicious.com",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "tlsCertSubject",
    group: "TLS",
    label: "Certificate Subject",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "CN=*.example.com",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "tlsCertIssuer",
    group: "TLS",
    label: "Certificate Issuer",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "Example CA",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "fileName",
    group: "File",
    label: "Name",
    enabled: true,
    kind: "string",
    defaultRelation: "Ends With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "invoice.iso",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "fileData",
    group: "File",
    label: "Data",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "MZ",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "sshSoftware",
    group: "SSH",
    label: "Software",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "OpenSSH",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "sshProtocolVersion",
    group: "SSH",
    label: "Protocol Version",
    enabled: true,
    kind: "enumNumber",
    defaults: {
      value: "2_compat",
    },
  },
  {
    type: "dnsQuery",
    group: "DNS",
    label: "Query",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "bad-domain.com",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "dnsOpcode",
    group: "DNS",
    label: "Opcode",
    enabled: true,
    kind: "numberCompare",
    keyword: "dns.opcode",
    defaults: {
      compareOperator: "=",
      numericValue: "0",
    },
  },
  {
    type: "dnsRrtype",
    group: "DNS",
    label: "Query Type",
    enabled: true,
    kind: "numberCompare",
    keyword: "dns.rrtype",
    defaults: {
      compareOperator: "=",
      numericValue: "1",
    },
  },
  {
    type: "smtpHelo",
    group: "SMTP",
    label: "HELO/EHLO",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "mail.example.local",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "smtpMailFrom",
    group: "SMTP",
    label: "Mail From",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "sender@example.com",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "smtpRcptTo",
    group: "SMTP",
    label: "Rcpt To",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "target@example.com",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "ipTtl",
    group: "IP",
    label: "TTL",
    enabled: true,
    kind: "numberCompare",
    keyword: "ttl",
    defaults: {
      compareOperator: "=",
      numericValue: "64",
    },
  },
  {
    type: "ipOpts",
    group: "IP",
    label: "Options",
    enabled: true,
    kind: "enumOption",
    options: ["rr", "eol", "nop", "ts", "sec", "esec", "lsrr", "ssrr", "satid", "any"],
    defaults: {
      value: "ts",
    },
  },
  {
    type: "ipProtocol",
    group: "IP",
    label: "Protocol",
    enabled: true,
    kind: "enumOption",
    options: RULE_PATTERN_IP_PROTOCOL_OPTIONS,
    defaults: {
      value: "TCP",
    },
  },
  {
    type: "ipAddress",
    group: "IP",
    label: "Address",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "192.168.88.1/24",
    flags: [
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      scope: "Source",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "ipReputation",
    group: "IP",
    label: "Reputation",
    enabled: true,
    kind: "numberCompare",
    keyword: "ip.rep",
    defaults: {
      scope: "Source",
      reputationType: "Malware",
      compareOperator: ">",
      numericValue: "50",
    },
  },
  {
    type: "ipCountry",
    group: "IP",
    label: "Country",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "CN, RU",
    flags: [
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      scope: "Source",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "krb5Cname",
    group: "Kerberos",
    label: "Client Name",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "svc-backup",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "krb5MsgType",
    group: "Kerberos",
    label: "Message Type",
    enabled: true,
    kind: "enumOption",
    options: ["AS_REQ", "AS_REP", "TGS_REQ", "TGS_REP", "ERROR"],
    defaults: {
      value: "TGS_REQ",
    },
  },
  {
    type: "krb5ServiceName",
    group: "Kerberos",
    label: "Service Name",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "krbtgt",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "krb5ErrorCode",
    group: "Kerberos",
    label: "Error Code",
    enabled: true,
    kind: "enumNumber",
    options: RULE_PATTERN_KRB_ERROR_OPTIONS,
    defaults: {
      value: "KDC_ERR_NONE",
    },
  },
  {
    type: "ftpCommand",
    group: "FTP",
    label: "Command",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "PASS",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
    ],
    defaults: {},
  },
  {
    type: "ftpDataCommand",
    group: "FTP",
    label: "Data Command",
    enabled: true,
    kind: "enumOption",
    options: RULE_PATTERN_FTP_COMMAND_OPTIONS,
    defaults: {
      value: "STOR",
    },
  },
  {
    type: "modbusFunction",
    group: "Modbus",
    label: "Function",
    enabled: true,
    kind: "enumOption",
    options: RULE_PATTERN_MODBUS_FUNCTION_OPTIONS,
    defaults: {
      value: "Read Coils",
    },
  },
  {
    type: "dnp3Function",
    group: "DNP3",
    label: "Function",
    enabled: true,
    kind: "enumOption",
    options: RULE_PATTERN_DNP3_FUNCTION_OPTIONS,
    defaults: {
      value: "Confirm",
    },
  },
  {
    type: "dnp3Indicators",
    group: "DNP3",
    label: "Indicators",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "Select flags...",
    flags: [
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "dnp3Object",
    group: "DNP3",
    label: "Object",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "Enter Group number",
    flags: [
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      objectGroup: "15",
      objectVariation: "18",
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "dnp3Data",
    group: "DNP3",
    label: "Data",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "deadbeef",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "ethernetIpCommand",
    group: "EtherNet/IP",
    label: "Command",
    enabled: true,
    kind: "enumOption",
    options: RULE_PATTERN_ETHERNET_IP_COMMAND_OPTIONS,
    defaults: {
      value: "SendRRData",
    },
  },
  {
    type: "smbShare",
    group: "SMB",
    label: "Share",
    enabled: true,
    kind: "string",
    defaultRelation: "Ends With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "ADMIN$",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "smbNamedPipe",
    group: "SMB",
    label: "Named Pipe",
    enabled: true,
    kind: "string",
    defaultRelation: "Ends With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "svcctl",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "smbDceRpcInterface",
    group: "SMB",
    label: "DCE-RPC Interface",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "367abb81-9844-35f1-ad32-98f038001003",
    flags: [
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "smbDceRpcOpnum",
    group: "SMB",
    label: "DCE-RPC Operational Number",
    enabled: true,
    kind: "numberCompare",
    keyword: "smb.dcerpc.opnum",
    defaults: {
      compareOperator: ">",
      numericValue: "18",
    },
  },
  {
    type: "smbDceRpcStubData",
    group: "SMB",
    label: "DCE-RPC Stub Data",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "deadbeef",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "nfsProcedure",
    group: "NFS",
    label: "Procedure",
    enabled: true,
    kind: "enumOption",
    options: ["getattr", "lookup", "read", "write", "create", "remove"],
    defaults: {
      value: "lookup",
    },
  },
  {
    type: "nfsFileName",
    group: "NFS",
    label: "File Name",
    enabled: true,
    kind: "string",
    defaultRelation: "Ends With",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "exports",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "regionEnabled", label: "Region" },
      { key: "transformEnabled", label: "Transform" },
    ],
    defaults: {
      regionEnabled: false,
      regionBytes: 0,
      regionOffset: 0,
      regionRelative: true,
      transformEnabled: false,
      transforms: [],
    },
  },
  {
    type: "fileMagic",
    group: "File",
    label: "Magic",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "PE32 executable",
    flags: [{ key: "ignoreCase", label: "Ignore Case" }],
    defaults: {
      ignoreCase: true,
    },
  },
  {
    type: "fileSize",
    group: "File",
    label: "Size",
    enabled: true,
    kind: "numberCompare",
    keyword: "file.size",
    defaults: {
      compareOperator: ">",
      numericValue: "1048576",
      sizeUnit: "MB",
    },
  },
  {
    type: "fileHash",
    group: "File",
    label: "Hash",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "/var/lib/suricata/rules/md5s.txt",
    flags: [{ key: "negate", label: "Negate (alert if hash is NOT in list)" }],
    defaults: {
      hashAlgorithm: "SHA-256",
      negate: true,
    },
  },
  {
    type: "fileExtension",
    group: "File",
    label: "Extension",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "exe",
    flags: [{ key: "ignoreCase", label: "Ignore Case" }],
    defaults: {
      ignoreCase: true,
    },
  },
  {
    type: "tlsCertIdentifier",
    group: "TLS",
    label: "Cert Identifier",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "01:AB:CD",
    flags: [{ key: "ignoreCase", label: "Ignore Case" }],
    defaults: {
      identifierField: "Serial",
      ignoreCase: true,
    },
  },
  {
    type: "tlsVersion",
    group: "TLS",
    label: "Version",
    enabled: true,
    kind: "enumNumber",
    options: ["TLS 1.0", "TLS 1.1", "TLS 1.2", "TLS 1.3"],
    defaults: {
      value: "TLS 1.2",
    },
  },
  {
    type: "tlsCert",
    group: "TLS",
    label: "Cert",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "hex content",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "tlsCertChainLength",
    group: "TLS",
    label: "Cert Chain Length",
    enabled: true,
    kind: "numberCompare",
    keyword: "tls.cert_chain_len",
    defaults: {
      compareOperator: ">",
      numericValue: "8",
    },
  },
  {
    type: "tlsRandom",
    group: "TLS",
    label: "Random",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "deadbeef...",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
    ],
    defaults: {},
  },
  {
    type: "tlsJa3",
    group: "TLS",
    label: "JA3",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "abc123hash",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "tlsJa3s",
    group: "TLS",
    label: "JA3S",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "def456hash",
    flags: [
      { key: "ignoreCase", label: "Ignore Case" },
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "sshHassh",
    group: "SSH",
    label: "HASSH",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "abc123hasshvalue...",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "sshHasshServer",
    group: "SSH",
    label: "HASSH Server",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "abc123hasshvalue...",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "sshHasshString",
    group: "SSH",
    label: "HASSH String",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "curve25519-sha256...",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  {
    type: "sshHasshServerString",
    group: "SSH",
    label: "HASSH Server String",
    enabled: true,
    kind: "string",
    defaultRelation: "Contains",
    relations: RULE_PATTERN_STRING_RELATIONS,
    placeholder: "curve25519-sha256...",
    flags: [
      { key: "fastPattern", label: "Fast Pattern" },
      { key: "rawBytes", label: "Buffer Size" },
    ],
    defaults: {},
  },
  { type: "smbNtlmsspUser", group: "SMB", label: "NTLMSSP User", enabled: false, kind: "unsupported" },
  { type: "smbNtlmsspDomain", group: "SMB", label: "NTLMSSP Domain", enabled: false, kind: "unsupported" },
  { type: "mqttQos", group: "MQTT", label: "QoS", enabled: false, kind: "unsupported" },
  { type: "mqttConnackReturnCode", group: "MQTT", label: "CONNACK Return Code", enabled: false, kind: "unsupported" },
  { type: "mqttConnackSessionPresent", group: "MQTT", label: "CONNACK Session Present", enabled: false, kind: "unsupported" },
  { type: "mqttReasonCode", group: "MQTT", label: "Reason Code", enabled: false, kind: "unsupported" },
  { type: "mqttFlags", group: "MQTT", label: "Flags", enabled: false, kind: "unsupported" },
];
const RULE_PATTERN_TYPE_OPTIONS = RULE_PATTERN_CATALOG.map((option) => ({
  type: option.type,
  label: option.label,
  group: option.group,
  enabled: option.enabled !== false,
}));
const SURICATA_BEHAVIOR_TRIGGER_OPTIONS = ["after", "every"];
const SURICATA_BEHAVIOR_TRACK_BY_OPTIONS = [
  "Source IP",
  "Source Host",
  "Destination IP",
  "Destination Host",
  "By Rule",
];
const SURICATA_BEHAVIOR_WINDOW_UNIT_OPTIONS = ["seconds", "minutes", "hours"];
const SURICATA_BEHAVIOR_COUNT_OPTIONS = ["1", "5", "10", "25", "50", "100"];
const THRESHOLD_NOISY_WINDOW_OPTIONS = [
  "Last 24 Hours",
  "Last 7 Days",
  "Last 30 Days",
];
const SURICATA_BEHAVIOR_WINDOW_VALUE_OPTIONS = {
  seconds: ["15", "30", "60", "120", "300"],
  minutes: ["1", "5", "10", "30", "60"],
  hours: ["1", "6", "12", "24"],
};
const SURICATA_BEHAVIOR_LIMIT_OPTIONS = ["1", "2", "3", "5", "10"];
const SURICATA_BEHAVIOR_ACTION_OPTIONS = ["alert", "pass", "drop", "reject"];
const SURICATA_BEHAVIOR_PRIORITY_OPTIONS = [
  "1 · High",
  "2 · Medium-High",
  "3 · Medium",
  "4 · Low",
];
const SURICATA_BEHAVIOR_SUPPRESS_TRACK_OPTIONS = [
  "Source IP",
  "Source Host",
  "Destination IP",
  "Destination Host",
];
const SURICATA_BEHAVIOR_FLOWBITS_ACTION_OPTIONS = ["Set", "Not Set"];
const SURICATA_BEHAVIOR_FLOWBITS_FLAG_OPTIONS = [
  "is_http_login",
  "auth_attempted",
  "is_dcerpc",
  "flow_state",
];
const SURICATA_BEHAVIOR_SUPPRESS_HOST_OPTIONS = [
  "any",
  "192.168.1.0/24",
  "10.0.0.0/8",
  "172.16.0.0/12",
];
const SURICATA_BEHAVIOR_REQUIRE_STATE_OPTIONS = ["Is Set", "Is Not Set"];
const SURICATA_BEHAVIOR_RANGES = {
  count: { min: 1, max: 100 },
  seconds: { min: 1, max: 300 },
  minutes: { min: 1, max: 60 },
  hours: { min: 1, max: 24 },
  limitCount: { min: 1, max: 10 },
  behaviorWindowValue: { min: 1, max: 300 },
  slowMultiplier: { min: 1, max: 5, step: 0.1, suffix: "x" },
  slowAbsoluteMicros: { min: 100, max: 2000, step: 50, suffix: "µs" },
  noisyPercentile: { min: 1, max: 25, step: 1, suffix: "%" },
  staleDays: { min: 7, max: 180, step: 1, suffix: "days" },
};

function resetParamEditorModes() {
  paramEditorModes = { ...PARAM_EDITOR_MODE_DEFAULTS };
}

function getParamEditorMode(key) {
  return paramEditorModes[key] === "verbose" ? "verbose" : "simple";
}

function setParamEditorMode(event, key, mode) {
  event?.stopPropagation?.();
  paramEditorModes[key] = mode === "verbose" ? "verbose" : "simple";
  suricataOpenMenuKey = null;
  if (key === "defaultAlertFilters") {
    closeDefaultAlertFilterComboboxes(false);
  }
  renderSuricataDrawerContent();
}

function renderParamEditorModeToggle(key) {
  const mode = getParamEditorMode(key);
  return `
    <div class="suri-segmented suri-param-mode-toggle" role="group" aria-label="Editor mode">
      <button
        type="button"
        class="suri-segment${mode === "simple" ? " is-active" : ""}"
        onclick="setParamEditorMode(event, '${escapeJsSingleQuoted(key)}', 'simple')"
      >
        Simple
      </button>
      <button
        type="button"
        class="suri-segment${mode === "verbose" ? " is-active" : ""}"
        onclick="setParamEditorMode(event, '${escapeJsSingleQuoted(key)}', 'verbose')"
      >
        Verbose
      </button>
    </div>
  `;
}

function createRulePatternId() {
  rulePatternIdCounter += 1;
  return `rule-pattern-${rulePatternIdCounter}`;
}

function getRulePatternCatalogEntry(type) {
  return (
    RULE_PATTERN_CATALOG.find((option) => option.type === type) ||
    RULE_PATTERN_CATALOG[0]
  );
}

function getRulePatternTypeMeta(type) {
  return getRulePatternCatalogEntry(type);
}

function getRulePatternLabel(type) {
  return getRulePatternTypeMeta(type).label;
}

function getRulePatternGroupLabel(type) {
  return getRulePatternTypeMeta(type).group;
}

function getRulePatternKind(type) {
  return getRulePatternTypeMeta(type).kind || "string";
}

function isRulePatternTypeEnabled(type) {
  return getRulePatternTypeMeta(type).enabled !== false;
}

function getRulePatternRelationOptions(type) {
  const meta = getRulePatternTypeMeta(type);
  return Array.isArray(meta.relations) ? meta.relations : [];
}

function getRulePatternDefaultRelation(type) {
  return getRulePatternTypeMeta(type).defaultRelation || "";
}

function getRulePatternFlagOptions(type) {
  const meta = getRulePatternTypeMeta(type);
  return Array.isArray(meta.flags) ? meta.flags : [];
}

function getRulePatternHeaderFieldOptions(type) {
  return type === "httpHeader" ? RULE_PATTERN_HTTP_HEADER_FIELD_OPTIONS : [];
}

function getRulePatternDefaultHeaderField(type) {
  return type === "httpHeader" ? "User-Agent" : "";
}

function getRulePatternPlaceholder(type) {
  return getRulePatternTypeMeta(type).placeholder || "Enter value";
}

function getRulePatternEnumOptions(type) {
  const meta = getRulePatternTypeMeta(type);
  return Array.isArray(meta.options) ? meta.options : [];
}

function getRulePatternKeyword(type) {
  return getRulePatternTypeMeta(type).keyword || "";
}

function isRulePatternRegionEligible(type) {
  const meta = getRulePatternTypeMeta(type);
  return getRulePatternFlagOptions(type).some((flag) => flag.key === "regionEnabled") &&
    ["string", "regex", "httpHeader"].includes(meta.kind);
}

function isRulePatternTransformEligible(type) {
  const meta = getRulePatternTypeMeta(type);
  return getRulePatternFlagOptions(type).some((flag) => flag.key === "transformEnabled") &&
    ["string", "regex", "httpHeader"].includes(meta.kind);
}

function normalizeRulePatternTransforms(type, transforms = []) {
  if (!isRulePatternTransformEligible(type)) return [];
  return (Array.isArray(transforms) ? transforms : [])
    .map((transform) => {
      const kind = String(transform?.kind || "").trim();
      const meta = RULE_PATTERN_TRANSFORM_OPTION_MAP[kind];
      const args = transform?.args && typeof transform.args === "object"
        ? { ...transform.args }
        : {};
      if (!kind) return { kind: "", args: {} };
      if (!meta) return null;
      if (meta.httpHeaderOnly && type !== "httpHeader") return null;
      return { kind, args };
    })
    .filter(Boolean);
}

function getRulePatternTransformOptions(type) {
  return RULE_PATTERN_TRANSFORM_CATALOG.filter((option) =>
    !option.httpHeaderOnly || type === "httpHeader"
  );
}

function getRulePatternTransformMeta(kind) {
  return RULE_PATTERN_TRANSFORM_OPTION_MAP[String(kind || "").trim()] || null;
}

function getRulePatternTransformLabel(kind) {
  return getRulePatternTransformMeta(kind)?.label || "Select Transform...";
}

function getRulePatternTransformArgValue(transform) {
  const meta = getRulePatternTransformMeta(transform?.kind);
  if (!meta?.requiresArg) return "";
  return String(transform?.args?.[meta.argField] ?? "");
}

function normalizeRulePatternInteger(value, fallback = 0, min = 0) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, parsed);
}

function normalizeRulePatternNumberString(value, fallback = "0") {
  const token = String(value ?? "").trim();
  return token || fallback;
}

function normalizeSuricataBehaviorValue(field, value) {
  const range = SURICATA_BEHAVIOR_RANGES[field];
  if (!range) return value;
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) return range.min;
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return range.min;
  return Math.min(range.max, Math.max(range.min, parsed));
}

function getBehaviorWindowValueOptions(unit) {
  return (
    SURICATA_BEHAVIOR_WINDOW_VALUE_OPTIONS[unit] ||
    SURICATA_BEHAVIOR_WINDOW_VALUE_OPTIONS.seconds
  );
}

function syncSuricataBehaviorState(state) {
  if (!state || typeof state !== "object") return state;
  state.behaviorTriggerWord = SURICATA_BEHAVIOR_TRIGGER_OPTIONS.includes(
    String(state.behaviorTriggerWord || ""),
  )
    ? String(state.behaviorTriggerWord)
    : "after";
  state.trackBy = SURICATA_BEHAVIOR_TRACK_BY_OPTIONS.includes(
    String(state.trackBy || ""),
  )
    ? String(state.trackBy)
    : "Source Host";
  state.count = normalizeSuricataBehaviorValue("count", state.count ?? 5);
  state.seconds = normalizeSuricataBehaviorValue(
    "seconds",
    state.seconds ?? 60,
  );
  state.minutes = normalizeSuricataBehaviorValue(
    "minutes",
    state.minutes ?? 60,
  );
  state.hours = normalizeSuricataBehaviorValue("hours", state.hours ?? 12);
  state.limitEnabled = Boolean(
    state.limitEnabled ?? state.rateLimiting ?? true,
  );
  state.limitCount = normalizeSuricataBehaviorValue(
    "limitCount",
    state.limitCount ?? 1,
  );
  state.behaviorWindowUnit = SURICATA_BEHAVIOR_WINDOW_UNIT_OPTIONS.includes(
    String(state.behaviorWindowUnit || ""),
  )
    ? String(state.behaviorWindowUnit)
    : "seconds";
  const activeWindowUnit = state.behaviorWindowUnit;
  const nextWindowValue = normalizeSuricataBehaviorValue(
    activeWindowUnit,
    state.behaviorWindowValue ?? state[activeWindowUnit],
  );
  state.behaviorWindowValue = nextWindowValue;
  state[activeWindowUnit] = nextWindowValue;
  state.rateLimiting = state.limitEnabled;
  state.action = SURICATA_BEHAVIOR_ACTION_OPTIONS.includes(
    String(state.action || ""),
  )
    ? String(state.action)
    : "alert";
  state.message = String(state.message ?? "");
  state.overrideEnabled = Boolean(state.overrideEnabled ?? false);
  state.overridePriority = SURICATA_BEHAVIOR_PRIORITY_OPTIONS.includes(
    String(state.overridePriority || ""),
  )
    ? String(state.overridePriority)
    : "1 · High";
  state.suppressEnabled = Boolean(state.suppressEnabled ?? false);
  state.suppressTrackBy = SURICATA_BEHAVIOR_SUPPRESS_TRACK_OPTIONS.includes(
    String(state.suppressTrackBy || ""),
  )
    ? String(state.suppressTrackBy)
    : "Source IP";
  state.suppressHost = String(state.suppressHost ?? "");
  state.flowbitsEnabled = Boolean(state.flowbitsEnabled ?? false);
  state.flowbitsAction = SURICATA_BEHAVIOR_FLOWBITS_ACTION_OPTIONS.includes(
    String(state.flowbitsAction || ""),
  )
    ? String(state.flowbitsAction)
    : "set";
  state.flowbitsFlag = String(state.flowbitsFlag ?? "");
  state.requireEnabled = Boolean(state.requireEnabled ?? false);
  state.requireCriteriaFlag = String(state.requireCriteriaFlag ?? "");
  state.requireCriteriaState = SURICATA_BEHAVIOR_REQUIRE_STATE_OPTIONS.includes(
    String(state.requireCriteriaState || ""),
  )
    ? String(state.requireCriteriaState)
    : "isset";
  return state;
}

function stripRulePatternTokenQuotes(value) {
  const token = String(value ?? "").trim();
  if (token.length >= 2 && token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1);
  }
  return token;
}

function quoteRulePatternToken(value) {
  const token = String(value ?? "").trim();
  if (!token) return "";
  return token.startsWith('"') && token.endsWith('"') ? token : `"${token}"`;
}

function normalizeRulePattern(pattern = {}) {
  const meta = getRulePatternTypeMeta(pattern.type);
  const type = meta.type;
  const relationOptions = getRulePatternRelationOptions(type);
  const defaults = meta.defaults || {};
  const relation =
    relationOptions.length && relationOptions.includes(pattern.relation)
      ? pattern.relation
      : getRulePatternDefaultRelation(type);
  const enumOptions = getRulePatternEnumOptions(type);
  const extraFields = Object.fromEntries(
    Object.entries(defaults)
      .filter(
        ([key]) =>
          ![
            "compareOperator",
            "mathOperator",
            "numericValue",
            "offset",
            "byteCount",
            "searchStart",
            "searchDepth",
            "relative",
            "negate",
            "rawBytes",
            "searchRangeEnabled",
            "regionEnabled",
            "regionBytes",
            "regionOffset",
            "regionRelative",
            "rfc2045",
            "rfc4648",
            "variableName",
            "resultVar",
            "transformEnabled",
            "transforms",
            "endian",
            "numberType",
            "value",
          ].includes(key),
      )
      .map(([key, defaultValue]) => [key, pattern[key] ?? defaultValue]),
  );
  return {
    id: pattern.id || createRulePatternId(),
    type,
    headerField: getRulePatternHeaderFieldOptions(type).includes(
      pattern.headerField,
    )
      ? pattern.headerField
      : getRulePatternDefaultHeaderField(type),
    relation,
    value: String(pattern.value ?? ""),
    exclude: Boolean(pattern.exclude),
    ignoreCase: Boolean(pattern.ignoreCase),
    fastPattern: Boolean(pattern.fastPattern),
    multiline: Boolean(pattern.multiline),
    dotall: Boolean(pattern.dotall),
    compareOperator: RULE_PATTERN_COMPARE_OPERATORS.includes(
      pattern.compareOperator,
    )
      ? pattern.compareOperator
      : defaults.compareOperator || "=",
    mathOperator: RULE_PATTERN_MATH_OPERATORS.includes(pattern.mathOperator)
      ? pattern.mathOperator
      : defaults.mathOperator || "+",
    numericValue: normalizeRulePatternNumberString(
      pattern.numericValue,
      String(defaults.numericValue ?? "0"),
    ),
    offset: normalizeRulePatternInteger(
      pattern.offset,
      defaults.offset ?? 0,
      0,
    ),
    byteCount: normalizeRulePatternInteger(
      pattern.byteCount,
      defaults.byteCount ?? 1,
      1,
    ),
    searchStart: normalizeRulePatternInteger(
      pattern.searchStart,
      defaults.searchStart ?? defaults.regionOffset ?? 0,
      0,
    ),
    searchDepth: normalizeRulePatternInteger(
      pattern.searchDepth,
      defaults.searchDepth ?? defaults.regionBytes ?? 0,
      0,
    ),
    relative: Boolean(pattern.relative ?? defaults.relative),
    negate: Boolean(pattern.negate ?? defaults.negate),
    rawBytes: Boolean(pattern.rawBytes ?? defaults.rawBytes),
    searchRangeEnabled: Boolean(
      pattern.searchRangeEnabled ?? defaults.searchRangeEnabled,
    ),
    regionEnabled: Boolean(
      pattern.regionEnabled ??
        pattern.searchRangeEnabled ??
        defaults.regionEnabled,
    ),
    regionBytes: normalizeRulePatternInteger(
      pattern.regionBytes ?? pattern.searchDepth,
      defaults.regionBytes ?? defaults.searchDepth ?? 0,
      0,
    ),
    regionOffset: normalizeRulePatternInteger(
      pattern.regionOffset ?? pattern.searchStart,
      defaults.regionOffset ?? defaults.searchStart ?? 0,
      0,
    ),
    regionRelative:
      pattern.regionRelative === undefined
        ? defaults.regionRelative !== false
        : Boolean(pattern.regionRelative),
    rfc2045: Boolean(pattern.rfc2045 ?? defaults.rfc2045),
    rfc4648:
      pattern.rfc4648 === undefined
        ? defaults.rfc4648 !== false
        : Boolean(pattern.rfc4648),
    variableName: String(pattern.variableName ?? defaults.variableName ?? ""),
    resultVar: String(pattern.resultVar ?? defaults.resultVar ?? ""),
    transformEnabled: Boolean(
      pattern.transformEnabled ?? defaults.transformEnabled,
    ),
    transforms: normalizeRulePatternTransforms(
      type,
      pattern.transforms ?? defaults.transforms,
    ),
    endian: RULE_PATTERN_ENDIAN_OPTIONS.includes(pattern.endian)
      ? pattern.endian
      : defaults.endian || "big",
    numberType: RULE_PATTERN_NUMBER_TYPE_OPTIONS.includes(pattern.numberType)
      ? pattern.numberType
      : defaults.numberType || "dec",
    enumValue:
      enumOptions.length && enumOptions.includes(pattern.value)
        ? pattern.value
        : String(defaults.value ?? enumOptions[0] ?? ""),
    ...extraFields,
  };
}

function createEmptyRulePattern(type = "content") {
  const meta = getRulePatternTypeMeta(type);
  return normalizeRulePattern(
    Object.assign(
      {
        type,
        headerField: getRulePatternDefaultHeaderField(type),
        relation: getRulePatternDefaultRelation(type),
        value: "",
        exclude: false,
        ignoreCase: false,
        fastPattern: false,
        multiline: false,
        dotall: false,
        regionEnabled: false,
        regionBytes: 0,
        regionOffset: 0,
        regionRelative: true,
        transformEnabled: false,
        transforms: [],
      },
      meta.defaults || {},
    ),
  );
}

function buildRulePatternsFromLegacyState(state = {}) {
  const patterns = [];
  const contentTokens = Array.isArray(state.contentMatch)
    ? state.contentMatch
    : [];
  const contentValues = contentTokens
    .filter((token) => {
      const normalized = String(token ?? "")
        .trim()
        .toLowerCase();
      return (
        normalized && normalized !== "fast_pattern" && normalized !== "nocase"
      );
    })
    .map((token) => stripRulePatternTokenQuotes(token))
    .filter(Boolean);
  const contentIgnoreCase = contentTokens.some(
    (token) =>
      String(token ?? "")
        .trim()
        .toLowerCase() === "nocase",
  );
  const contentFastPattern = contentTokens.some(
    (token) =>
      String(token ?? "")
        .trim()
        .toLowerCase() === "fast_pattern",
  );

  contentValues.forEach((value, index) => {
    patterns.push(
      normalizeRulePattern({
        type: "content",
        relation: index === 0 ? "Starts With" : "Contains",
        value,
        ignoreCase: index === 0 ? contentIgnoreCase : false,
        fastPattern: index === 0 ? contentFastPattern : false,
      }),
    );
  });

  if (state.regexPattern) {
    patterns.push(
      normalizeRulePattern({
        type: "regex",
        relation: "Matches",
        value: state.regexPattern,
        ignoreCase: /i/i.test(String(state.modifiers || "")),
        multiline: /m/i.test(String(state.modifiers || "")),
        dotall: /s/i.test(String(state.modifiers || "")),
      }),
    );
  }

  if (state.httpHeader) {
    patterns.push(
      normalizeRulePattern({
        type: "httpHeader",
        headerField: state.httpHeaderField || "User-Agent",
        relation: "Starts With",
        value: state.httpHeader,
      }),
    );
  }

  if (state.httpUri) {
    patterns.push(
      normalizeRulePattern({
        type: "httpUri",
        relation: "Starts With",
        value: state.httpUri,
      }),
    );
  }

  if (state.dnsQuery) {
    patterns.push(
      normalizeRulePattern({
        type: "dnsQuery",
        relation: "Contains",
        value: state.dnsQuery,
        ignoreCase: !state.caseSensitive,
      }),
    );
  }

  return patterns.length ? patterns : [createEmptyRulePattern("content")];
}

function syncLegacyRulePatternFields(state) {
  if (!state || !Array.isArray(state.rulePatterns)) return state;
  const patterns = state.rulePatterns.map((pattern) =>
    normalizeRulePattern(pattern),
  );
  state.rulePatterns = patterns;

  const contentPatterns = patterns.filter(
    (pattern) => pattern.type === "content",
  );
  const regexPattern = patterns.find((pattern) => pattern.type === "regex");
  const httpHeaderPattern = patterns.find(
    (pattern) => pattern.type === "httpHeader",
  );
  const httpUriPattern = patterns.find((pattern) => pattern.type === "httpUri");
  const dnsQueryPattern = patterns.find(
    (pattern) => pattern.type === "dnsQuery",
  );
  const contentMatch = [];

  contentPatterns.forEach((pattern, index) => {
    const token = quoteRulePatternToken(pattern.value);
    if (token) contentMatch.push(token);
    if (index === 0 && pattern.fastPattern) contentMatch.push("fast_pattern");
    if (index === 0 && pattern.ignoreCase) contentMatch.push("nocase");
  });

  state.contentMatch = contentMatch;
  state.regexPattern = regexPattern?.value || "";
  state.modifiers = [
    regexPattern?.ignoreCase ? "i" : "",
    regexPattern?.multiline ? "m" : "",
    regexPattern?.dotall ? "s" : "",
  ].join("");
  state.ignoreCase = Boolean(regexPattern?.ignoreCase);
  state.multiline = Boolean(regexPattern?.multiline);
  state.detail = Boolean(regexPattern?.dotall);
  state.httpHeader = httpHeaderPattern?.value || "";
  state.httpHeaderField = httpHeaderPattern?.headerField || "User-Agent";
  state.httpUri = httpUriPattern?.value || "";
  state.dnsQuery = dnsQueryPattern?.value || "";
  state.caseSensitive = dnsQueryPattern ? !dnsQueryPattern.ignoreCase : false;
  return state;
}

function ensureRulePatterns(state) {
  if (!state || typeof state !== "object") return [];
  state.rulePatterns = (
    Array.isArray(state.rulePatterns) && state.rulePatterns.length
      ? state.rulePatterns
      : buildRulePatternsFromLegacyState(state)
  ).map((pattern) => normalizeRulePattern(pattern));
  syncLegacyRulePatternFields(state);
  return state.rulePatterns;
}

function isDefaultAlertsRule(rule) {
  return String(rule?.source ?? "").toLowerCase() === "teleseer";
}

function createDrawerVersionSnapshot(state) {
  const snapshot = cloneDrawerState(state || {});
  delete snapshot.versionHistory;
  delete snapshot.selectedVersionId;
  return snapshot;
}

function buildSyntheticVersionHistoryEntries(state) {
  return DRAWER_VERSION_HISTORY_SEED.map((entry, index) => {
    const snapshot = createDrawerVersionSnapshot(state);
    snapshot.version = entry.label;
    return {
      id: `version-${index + 1}`,
      label: entry.label,
      savedAt: entry.savedAt,
      isCurrent: index === 0,
      snapshot,
    };
  });
}

function normalizeDrawerVersionHistory(state) {
  if (!state || typeof state !== "object") return [];
  const sourceEntries =
    Array.isArray(state.versionHistory) && state.versionHistory.length
      ? state.versionHistory
      : buildSyntheticVersionHistoryEntries(state);
  const normalized = sourceEntries.map((entry, index) => {
    const snapshot = createDrawerVersionSnapshot(
      entry?.snapshot && typeof entry.snapshot === "object"
        ? entry.snapshot
        : state,
    );
    const label = String(
      entry?.label || snapshot.version || state.version || `v${index + 1}`,
    );
    snapshot.version = label;
    return {
      id: String(entry?.id || `version-${index + 1}`),
      label,
      savedAt: String(entry?.savedAt || ""),
      isCurrent: Boolean(entry?.isCurrent ?? index === 0),
      snapshot,
    };
  });
  if (!normalized.some((entry) => entry.isCurrent) && normalized[0]) {
    normalized[0].isCurrent = true;
  }
  state.versionHistory = normalized;
  state.selectedVersionId = String(
    state.selectedVersionId ||
      normalized.find((entry) => entry.isCurrent)?.id ||
      normalized[0]?.id ||
      "",
  );
  const activeEntry =
    normalized.find((entry) => entry.id === state.selectedVersionId) ||
    normalized[0];
  if (activeEntry?.isCurrent) {
    state.version = activeEntry.label;
  }
  return normalized;
}

function ensureDrawerVersionHistory(state) {
  normalizeDrawerVersionHistory(state);
  return state;
}

function getSelectedDrawerVersionEntry(state) {
  const entries = normalizeDrawerVersionHistory(state);
  return (
    entries.find((entry) => entry.id === state.selectedVersionId) ||
    entries.find((entry) => entry.isCurrent) ||
    entries[0] ||
    null
  );
}

function isViewingHistoricalDrawerVersion() {
  if (editMode || !suricataDrawerBaseline) return false;
  const selectedEntry = getSelectedDrawerVersionEntry(suricataDrawerBaseline);
  return Boolean(selectedEntry && !selectedEntry.isCurrent);
}

function getNextDrawerVersionLabel(currentLabel) {
  const match = String(currentLabel || "").match(/v(\d+)/i);
  const nextNumber = match ? Number(match[1]) + 1 : 1;
  return `v${nextNumber} Latest`;
}

function getCurrentDrawerTimestampLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function appendDrawerVersionHistory(previousState, nextState) {
  const previousEntries = normalizeDrawerVersionHistory(previousState).map(
    (entry) => ({
      ...cloneDrawerState(entry),
      isCurrent: false,
    }),
  );
  const nextLabel = getNextDrawerVersionLabel(
    previousState?.version || nextState?.version,
  );
  nextState.version = nextLabel;
  const currentEntry = {
    id: `version-${Date.now()}`,
    label: nextLabel,
    savedAt: getCurrentDrawerTimestampLabel(),
    isCurrent: true,
    snapshot: createDrawerVersionSnapshot({ ...nextState, version: nextLabel }),
  };
  nextState.versionHistory = [currentEntry, ...previousEntries];
  nextState.selectedVersionId = currentEntry.id;
  return nextState;
}

function createSuricataDrawerState(rule) {
  const drawerState = {
    id: rule?.id ?? null,
    name: String(rule?.name ?? ""),
    source: String(rule?.source ?? "Emerging Threats PRO"),
    editable: Boolean(rule?.editable),
    description: String(rule?.description ?? ""),
    relatedSid: String(rule?.relatedSid ?? rule?.sid ?? ""),
    folderLabel: String(rule?.folderLabel ?? ""),
    ruleStateTags: cloneDrawerState(
      Array.isArray(rule?.ruleStateTags) ? rule.ruleStateTags : [],
    ),
    enabled: Boolean(rule?.enabled),
    version: String(rule?.version ?? "v4 Latest"),
    versionHistory: cloneDrawerState(
      Array.isArray(rule?.versionHistory) ? rule.versionHistory : [],
    ),
    selectedVersionId: String(rule?.selectedVersionId ?? ""),
    priority: "1 · High",
    sid: String(rule?.sid ?? 2024847),
    classType: String(rule?.classType ?? "trojan-activity"),
    protocols: "HTTP",
    sourcePorts: "Exclude · 5 selected",
    destinationPorts: "Include · 4 selected",
    subnetFilters: {
      sourceSubnets: {
        mode: "include",
        variables: ["HOME_NET", "HTTPS_SERVERS"],
        checked: ["192.168.10.0/24", "192.168.30.0/24", "192.168.50.0/24"],
        manual: ["172.16.12.0/24"],
      },
      destinationSubnets: {
        mode: "exclude",
        variables: ["EXTERNAL_NET"],
        checked: ["192.168.20.0/24", "192.168.40.0/24"],
        manual: ["198.18.12.0/23", "10.25.typo.0/24"],
      },
    },
    portFilters: {
      sourcePorts: {
        mode: "exclude",
        variables: ["HOME_PORTS"],
        checked: ["80", "443", "22"],
        manual: ["25"],
      },
      destinationPorts: {
        mode: "include",
        variables: ["HTTPS_PORTS"],
        checked: ["443", "3389"],
        manual: ["8443"],
      },
    },
    directionality: "Unidirectional",
    flow: "To Server",
    state: "Established",
    contentMatch: cloneDrawerState(
      Array.isArray(rule?.contentMatch)
        ? rule.contentMatch
        : ['"index.php"', "fast_pattern", '"?id="', "nocase"],
    ),
    regexPattern: String(rule?.regexPattern ?? "/regex_name/"),
    modifiers: String(rule?.modifiers ?? ""),
    ignoreCase: false,
    multiline: false,
    detail: false,
    httpUri: String(rule?.httpUri ?? "/admin/login"),
    httpHeader: String(rule?.httpHeader ?? "curl"),
    httpHeaderField: String(rule?.httpHeaderField ?? "User-Agent"),
    dnsQuery: String(rule?.dnsQuery ?? "bad-domain.com"),
    caseSensitive: false,
    action: String(rule?.action ?? "Alert"),
    behaviorTriggerWord: String(rule?.behaviorTriggerWord ?? "after"),
    limitEnabled: Boolean(rule?.limitEnabled ?? rule?.rateLimiting ?? true),
    limitCount: Number(rule?.limitCount ?? 1),
    rateLimiting: Boolean(rule?.rateLimiting ?? true),
    trackBy: String(rule?.trackBy ?? "Source Host"),
    count: Number(rule?.count ?? 5),
    seconds: Number(rule?.seconds ?? 60),
    minutes: Number(rule?.minutes ?? 60),
    hours: Number(rule?.hours ?? 12),
    behaviorWindowUnit: String(rule?.behaviorWindowUnit ?? "seconds"),
    behaviorWindowValue: Number(
      rule?.behaviorWindowValue ?? rule?.seconds ?? 60,
    ),
    references: cloneDrawerState(DEFAULT_REFERENCE_ROWS),
    ruleConfig: DEFAULT_RULE_CONFIG_YAML,
  };
  drawerState.rulePatterns =
    Array.isArray(rule?.rulePatterns) && rule.rulePatterns.length
      ? cloneDrawerState(rule.rulePatterns).map((pattern) =>
          normalizeRulePattern(pattern),
        )
      : buildRulePatternsFromLegacyState(drawerState);
  return ensureDrawerVersionHistory(
    syncSuricataBehaviorState(syncLegacyRulePatternFields(drawerState)),
  );
}

function createDefaultAlertDrawerState(rule) {
  const drawerState = {
    description: String(rule?.description ?? ""),
    enabled: Boolean(rule?.enabled),
    version: String(rule?.version ?? "v4 Latest"),
    versionHistory: cloneDrawerState(
      Array.isArray(rule?.versionHistory) ? rule.versionHistory : [],
    ),
    selectedVersionId: String(rule?.selectedVersionId ?? ""),
    schedule: "Auto",
    timeRange: "Auto",
    threshold: 1,
    quota: 10000,
    protocols: "4 Protocols",
    hosts: "3 Hosts",
    sourceHosts: "Select Hosts",
    destinationHosts: "Select Hosts",
    ports: "Select Ports",
    sourcePorts: "Select Ports",
    destinationPorts: "Select Ports",
    subnets: "6 Subnets",
    sourceSubnets: "Select Subnets",
    destinationSubnets: "Select Subnets",
    filterSelections: {
      protocols: ["DNS", "HTTP", "TLS", "RDP"],
      hosts: ["HQ-SRV-AD-01", "DMZ-WEB-02", "OT-PLC-07"],
      sourceHosts: [],
      destinationHosts: [],
      ports: [],
      sourcePorts: [],
      destinationPorts: [],
      subnets: [
        "10.10.4.0/24",
        "10.10.8.0/24",
        "10.20.0.0/24",
        "172.18.31.0/24",
        "192.168.50.0/24",
        "198.18.12.0/23",
      ],
      sourceSubnets: [],
      destinationSubnets: [],
    },
    references: cloneDrawerState(DEFAULT_ALERT_REFERENCE_ROWS),
    ruleConfig: "",
  };
  return ensureDrawerVersionHistory(syncDefaultAlertFilterLabels(drawerState));
}

function createThresholdSettingsState() {
  return cloneDrawerState(THRESHOLD_SETTINGS_DEFAULT_STATE);
}

function createDrawerStateForRule(rule) {
  return drawerVariant === "default-alert"
    ? createDefaultAlertDrawerState(rule)
    : createSuricataDrawerState(rule);
}

function resetDefaultAlertFilterUiState() {
  defaultAlertFilterUiState = {};
  resetSimpleMenuSelectionScrollState();
}

function getDefaultAlertFilterUiState(field) {
  if (!defaultAlertFilterUiState[field]) {
    defaultAlertFilterUiState[field] = {
      search: "",
      open: false,
      activeMode: "include",
      itemModes: {},
    };
  }
  if (defaultAlertFilterUiState[field].activeMode !== "exclude") {
    defaultAlertFilterUiState[field].activeMode = "include";
  }
  if (
    !defaultAlertFilterUiState[field].itemModes ||
    typeof defaultAlertFilterUiState[field].itemModes !== "object"
  ) {
    defaultAlertFilterUiState[field].itemModes = {};
  }
  return defaultAlertFilterUiState[field];
}

function closeDefaultAlertFilterComboboxes(
  shouldRender = false,
  preserveField = null,
) {
  if (drawerVariant !== "default-alert") return false;
  let changed = false;
  Object.entries(defaultAlertFilterUiState).forEach(([field, uiState]) => {
    if (field === preserveField) return;
    if (!uiState || !uiState.open) return;
    uiState.open = false;
    changed = true;
  });
  if (changed && shouldRender) {
    renderSuricataDrawerContent();
  }
  return changed;
}

function getDefaultAlertFilterConfig(field) {
  return DEFAULT_ALERT_FILTER_OPTIONS[field] || null;
}

function getDefaultAlertFilterKind(field) {
  if (field.includes("Subnet") || field.includes("subnet")) return "subnet";
  if (field.includes("Port") || field.includes("port")) return "port";
  return "";
}

function getDefaultAlertFilterOptionEntries(field) {
  const config = getDefaultAlertFilterConfig(field);
  if (!config) return [];
  const baseEntries = (Array.isArray(config.options) ? config.options : []).map(
    (option) => ({
      value: String(option.value || ""),
      meta: String(option.meta || ""),
      icon: option.icon || "",
      kind: "project",
    }),
  );
  const kind = getDefaultAlertFilterKind(field);
  if (!kind || typeof getScopeVariableOptions !== "function") {
    return baseEntries;
  }
  const variableEntries = getScopeVariableOptions(kind).map((option) => ({
    value: String(option.name || ""),
    meta: String(option.meta || ""),
    icon: "",
    kind: "variable",
  }));
  const seen = new Set();
  return [...variableEntries, ...baseEntries].filter((option) => {
    const key = String(option.value || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getDefaultAlertFilterMenuKey(field) {
  return `default-alert:${field}`;
}

function getDefaultAlertFilterSimpleSelectionKey(field) {
  return `default-alert-${field}`;
}

function getDefaultAlertFilterOrderKey(value) {
  return String(value);
}

function normalizeDefaultAlertFilterSelection(selection) {
  if (Array.isArray(selection)) {
    const includeChecked = [...new Set(selection)];
    return {
      includeChecked,
      excludeChecked: [],
      entryOrder: includeChecked.map((value) =>
        getDefaultAlertFilterOrderKey(value),
      ),
    };
  }
  const value = selection && typeof selection === "object" ? selection : {};
  const includeChecked = [
    ...new Set(Array.isArray(value.includeChecked) ? value.includeChecked : []),
  ];
  const excludeChecked = [
    ...new Set(Array.isArray(value.excludeChecked) ? value.excludeChecked : []),
  ];
  const fallbackOrder = [
    ...includeChecked.map((entry) => getDefaultAlertFilterOrderKey(entry)),
    ...excludeChecked
      .filter((entry) => !includeChecked.includes(entry))
      .map((entry) => getDefaultAlertFilterOrderKey(entry)),
  ];
  const entryOrder = Array.isArray(value.entryOrder)
    ? value.entryOrder.filter(
        (entry) =>
          fallbackOrder.includes(entry) ||
          includeChecked.some(
            (checked) => getDefaultAlertFilterOrderKey(checked) === entry,
          ) ||
          excludeChecked.some(
            (checked) => getDefaultAlertFilterOrderKey(checked) === entry,
          ),
      )
    : fallbackOrder;
  return {
    includeChecked,
    excludeChecked,
    entryOrder,
  };
}

function getDefaultAlertFilterSelection(state, field) {
  return normalizeDefaultAlertFilterSelection(state?.filterSelections?.[field]);
}

function setDefaultAlertFilterSelection(state, field, selection) {
  if (!state.filterSelections || typeof state.filterSelections !== "object") {
    state.filterSelections = {};
  }
  state.filterSelections[field] =
    normalizeDefaultAlertFilterSelection(selection);
}

function getDefaultAlertFilterValues(state, field) {
  const selection = getDefaultAlertFilterSelection(state, field);
  return [
    ...selection.includeChecked,
    ...selection.excludeChecked.filter(
      (value) => !selection.includeChecked.includes(value),
    ),
  ];
}

function getDefaultAlertFilterSelectedCount(state, field) {
  const selection = getDefaultAlertFilterSelection(state, field);
  return selection.includeChecked.length + selection.excludeChecked.length;
}

function getDefaultAlertFilterValueMode(selection, value) {
  if (selection.excludeChecked.includes(value)) return "exclude";
  if (selection.includeChecked.includes(value)) return "include";
  return "";
}

function getDefaultAlertFilterPendingMode(field, value, selection = null) {
  const resolvedSelection =
    selection || getDefaultAlertFilterSelection(suricataDrawerDraft, field);
  const selectedMode = getDefaultAlertFilterValueMode(resolvedSelection, value);
  if (selectedMode) return selectedMode;
  const uiState = getDefaultAlertFilterUiState(field);
  return uiState.itemModes?.[value] === "exclude" ? "exclude" : "include";
}

function setDefaultAlertFilterPendingMode(field, value, mode) {
  const uiState = getDefaultAlertFilterUiState(field);
  uiState.itemModes[value] = mode === "exclude" ? "exclude" : "include";
}

function getDefaultAlertFilterAppliedEntries(selection) {
  const entryOrder = Array.isArray(selection.entryOrder)
    ? selection.entryOrder
    : [];
  const orderedEntries = entryOrder
    .map((entry) => {
      const value = String(entry);
      const mode = getDefaultAlertFilterValueMode(selection, value);
      if (!mode) return null;
      return {
        bucket: "project",
        value,
        mode,
      };
    })
    .filter(Boolean);
  const seen = new Set(
    orderedEntries.map((entry) => `${entry.mode}:${entry.value}`),
  );
  [
    ...selection.includeChecked.map((value) => ({ value, mode: "include" })),
    ...selection.excludeChecked.map((value) => ({ value, mode: "exclude" })),
  ].forEach((entry) => {
    const key = `${entry.mode}:${entry.value}`;
    if (seen.has(key)) return;
    orderedEntries.push({
      bucket: "project",
      value: entry.value,
      mode: entry.mode,
    });
  });
  return orderedEntries;
}

function getDefaultAlertFilterReadonlyEntries(field, entries) {
  const config = getDefaultAlertFilterConfig(field);
  const kind = getDefaultAlertFilterKind(field);
  const variableNames =
    kind && typeof getScopeVariableOptions === "function"
      ? new Set(
          getScopeVariableOptions(kind).map((option) =>
            String(option.name || "").trim().toLowerCase(),
          ),
        )
      : new Set();
  const fallbackSingular = config?.singularLabel || "Item";
  const fallbackPlural = config?.pluralLabel || "Items";
  return (Array.isArray(entries) ? entries : []).map((entry) => {
    const value = String(entry?.value || "");
    const isVariable = variableNames.has(value.trim().toLowerCase());
    return {
      ...entry,
      categorySingular: isVariable ? "Variable" : fallbackSingular,
      categoryPlural: isVariable ? "Variables" : fallbackPlural,
    };
  });
}

function formatDefaultAlertFilterSummary(field, selectionOrValues) {
  const config = getDefaultAlertFilterConfig(field);
  if (!config) return "";
  const selection = Array.isArray(selectionOrValues)
    ? normalizeDefaultAlertFilterSelection(selectionOrValues)
    : normalizeDefaultAlertFilterSelection(selectionOrValues);
  const entries = getDefaultAlertFilterReadonlyEntries(
    field,
    getDefaultAlertFilterAppliedEntries(selection),
  );
  return formatRuleConfigReadonlyMadlib(entries, config.emptyLabel).label;
}

function syncDefaultAlertFilterLabels(state) {
  if (!state || typeof state !== "object") return state;
  Object.keys(DEFAULT_ALERT_FILTER_OPTIONS).forEach((field) => {
    state[field] = formatDefaultAlertFilterSummary(
      field,
      getDefaultAlertFilterSelection(state, field),
    );
  });
  return state;
}

function renderDefaultAlertFilterCheckbox(checked) {
  return checked
    ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
    : "";
}

function renderDefaultAlertFilterModeUtility(field) {
  const uiState = getDefaultAlertFilterUiState(field);
  const mode = uiState.activeMode === "exclude" ? "exclude" : "include";
  const includeAction = `onDefaultAlertFilterModeClick(event, '${escapeJsSingleQuoted(field)}', 'include')`;
  const excludeAction = `onDefaultAlertFilterModeClick(event, '${escapeJsSingleQuoted(field)}', 'exclude')`;
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

function getDefaultAlertFilterOption(field, value) {
  return (
    getDefaultAlertFilterOptionEntries(field).find(
      (option) => option.value === value,
    ) || null
  );
}

function getDefaultAlertFilterSearchPlaceholder(field) {
  if (field === "protocols") return "Search by protocol";
  if (
    field === "hosts" ||
    field === "sourceHosts" ||
    field === "destinationHosts"
  ) {
    return "Search by hostname, IP, or variable";
  }
  if (field.includes("Subnet") || field.includes("subnet")) {
    return "Search by subnet or variable";
  }
  if (field.includes("Port") || field.includes("port")) {
    return "Search by port or variable";
  }
  return "Search...";
}

function renderDefaultAlertFilterOptionValue(field, value) {
  const option = getDefaultAlertFilterOption(field, value);
  return renderMenuValueContent(value, option?.icon || "");
}

function renderDefaultAlertFilterMenuSelectionShell(field, entries) {
  return `
    <div class="suri-simple-menu-selection-shell">
      <div
        class="suri-simple-menu-selection"
        data-simple-selection-key="${escapeHtml(getDefaultAlertFilterSimpleSelectionKey(field))}"
      >
        ${entries.length ? renderDefaultAlertFilterAppliedChips(field, entries) : ""}
      </div>
    </div>
  `;
}

function renderDefaultAlertFilterPanelContent(field, state, searchHandler, options = {}) {
  const uiState = getDefaultAlertFilterUiState(field);
  const config = getDefaultAlertFilterConfig(field);
  if (!config) return "";
  const search = String(uiState.search || "")
    .trim()
    .toLowerCase();
  const selection = getDefaultAlertFilterSelection(state, field);
  const appliedEntries = getDefaultAlertFilterAppliedEntries(selection);
  const visibleOptions = getDefaultAlertFilterOptionEntries(field).filter((option) => {
    const valueText = String(option.value || "").toLowerCase();
    const metaText = String(option.meta || "").toLowerCase();
    return !search || valueText.includes(search) || metaText.includes(search);
  });
  return `
    ${options.hideSelectionShell ? "" : `${renderDefaultAlertFilterMenuSelectionShell(field, appliedEntries)}
    <div class="suri-subnet-divider" aria-hidden="true"></div>`}
    <div class="suri-subnet-search" onclick="event.stopPropagation()">
      <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
      <input
        type="text"
        value="${escapeHtml(uiState.search)}"
        placeholder="${escapeHtml(getDefaultAlertFilterSearchPlaceholder(field))}"
        aria-label="Search ${escapeHtml(config.title)}"
        oninput="${searchHandler}('${escapeJsSingleQuoted(field)}', this.value)"
      />
    </div>
    <div class="suri-subnet-divider" aria-hidden="true"></div>
    <div class="suri-subnet-project-shell">
      <div class="suri-subnet-project-list default-alert-filter-options">
        ${
          visibleOptions.length
            ? visibleOptions
                .map((option) => {
                  const selectionMode = getDefaultAlertFilterValueMode(
                    selection,
                    option.value,
                  );
                  return `
                    <div
                      class="menu-item menu-item-cta suri-picker-option suri-subnet-project-option default-alert-filter-option has-mode-actions${selectionMode ? ` is-selected is-${selectionMode}` : ""}"
                    >
                      <span class="value">${renderDefaultAlertFilterOptionValue(field, option.value)}</span>
                      <span class="suri-option-tail">
                        ${renderMenuItemModeButtons(
                          `onDefaultAlertFilterOptionInclude(event, '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(option.value)}')`,
                          `onDefaultAlertFilterOptionExclude(event, '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(option.value)}')`,
                          selectionMode,
                        )}
                      </span>
                    </div>
                  `;
                })
                .join("")
            : '<div class="suri-scope-empty">No items match your search.</div>'
        }
      </div>
    </div>
  `;
}

function renderDefaultAlertFilterMenuPanel(field, state) {
  return `
    <div class="menu-list suri-subnet-menu suri-simple-stack-menu" role="listbox">
      ${renderDefaultAlertFilterPanelContent(field, state, "onDefaultAlertFilterMenuSearchInput")}
    </div>
  `;
}

function renderDefaultAlertFilterChipboxPanel(field, state, options = {}) {
  const uiState = getDefaultAlertFilterUiState(field);
  return `
    <div class="suri-scope-suggestion-anchor default-alert-filter-anchor${uiState.open ? " is-stable-open" : ""}" data-default-filter-suggestions="${escapeHtml(field)}">
      <div class="menu-list suri-scope-suggestion-panel default-alert-filter-panel suri-subnet-menu" role="listbox">
        ${renderDefaultAlertFilterPanelContent(field, state, "onDefaultAlertFilterChipboxSearchInput", options)}
      </div>
    </div>
  `;
}

function renderDefaultAlertFilterSummaryControl(field, state) {
  const menuKey = getDefaultAlertFilterMenuKey(field);
  const isOpen = suricataOpenMenuKey === menuKey;
  const selection = getDefaultAlertFilterSelection(state, field);
  const appliedEntries = getDefaultAlertFilterAppliedEntries(selection);
  const summaryLabel = String(
    state?.[field] || formatDefaultAlertFilterSummary(field, []),
  );
  if (!editMode) {
    const readonlyEntries = getDefaultAlertFilterReadonlyEntries(
      field,
      appliedEntries,
    );
    return renderRuleConfigReadonlyTrigger(
      summaryLabel,
      { entries: readonlyEntries, emptyLabel: summaryLabel },
    );
  }
  return `
    <div class="suri-menu suri-madlib-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-s style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleDefaultAlertFilterRowMenu(event, '${escapeJsSingleQuoted(field)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(summaryLabel)}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      ${renderDefaultAlertFilterMenuPanel(field, state)}
    </div>
  `;
}

function renderDefaultAlertFilterEditor(field, state) {
  return `
    <div class="suri-scope-editor default-alert-filter-editor">
      ${renderDefaultAlertFilterCombobox(field, state)}
    </div>
  `;
}

function getDrawerContentEl() {
  return document.getElementById("drawerContent");
}

function syncDrawerHeaderActions() {
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const drawerMenuButton = document.getElementById("drawerMenuButton");
  if (!editBtn || !saveBtn || !cancelBtn) return;
  const activeRule =
    selectedRule !== null
      ? currentRules.find((item) => item.id === selectedRule)
      : null;

  if (drawerVariant === "threshold-settings") {
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    drawerMenuButton?.classList.add("hidden");
    document.getElementById("drawerMenu")?.classList.remove("open");
    if (typeof restoreDefaultDrawerMenuMarkup === "function") {
      restoreDefaultDrawerMenuMarkup();
    }
    return;
  }

  drawerMenuButton?.classList.remove("hidden");

  if (!editMode && isViewingHistoricalDrawerVersion()) {
    editBtn.classList.add("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    if (drawerVariant === "suricata") {
      syncReadonlySuricataDrawerMenu(activeRule);
    } else if (typeof restoreDefaultDrawerMenuMarkup === "function") {
      restoreDefaultDrawerMenuMarkup();
    }
    return;
  }

  if (drawerVariant === "variables") {
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    if (typeof restoreDefaultDrawerMenuMarkup === "function") {
      restoreDefaultDrawerMenuMarkup();
    }
    return;
  }

  if (drawerVariant === "suricata") {
    const isEditableRule = Boolean(
      activeRule && !isReadonlySuricataRule(activeRule),
    );
    if (!editMode && !isEditableRule) {
      editBtn.classList.add("hidden");
      saveBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
      syncReadonlySuricataDrawerMenu(activeRule);
      return;
    }
    syncReadonlySuricataDrawerMenu(activeRule);
  } else if (drawerVariant === "default-alert") {
    editBtn.classList.add("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    syncReadonlySuricataDrawerMenu(activeRule);
    return;
  } else if (typeof restoreDefaultDrawerMenuMarkup === "function") {
    restoreDefaultDrawerMenuMarkup();
  }

  if (editMode) {
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    return;
  }

  editBtn.classList.remove("hidden");
  saveBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");
}

function getDrawerTitleRule() {
  if (selectedRule === null) return null;
  return (
    suricataRuleDb.find((item) => item.id === selectedRule) ||
    currentRules.find((item) => item.id === selectedRule) ||
    null
  );
}

function syncDrawerTitle() {
  const titleEl = document.getElementById("drawerTitle");
  if (!titleEl) return;
  if (drawerVariant === "threshold-settings") {
    titleEl.textContent = "Set Thresholds";
    return;
  }
  const rule = getDrawerTitleRule();
  if (!rule) {
    titleEl.textContent = "";
    return;
  }
  const nextName = String(
    (suricataDrawerDraft && suricataDrawerDraft.name) || rule.name || "",
  );
  const allowRename =
    (drawerVariant !== "suricata" || !isReadonlySuricataRule(rule)) &&
    !isViewingHistoricalDrawerVersion();
  if (drawerRenameMode && allowRename) {
    titleEl.innerHTML = `
      <input
        class="drawer-title-input"
        id="drawerTitleInput"
        type="text"
        value="${escapeHtml(nextName)}"
        oninput="onDrawerTitleInput(this.value)"
        onkeydown="handleDrawerTitleKey(event)"
      />
    `;
    requestAnimationFrame(() => {
      const input = document.getElementById("drawerTitleInput");
      if (!input) return;
      input.focus();
      input.select();
    });
    return;
  }
  titleEl.textContent = nextName;
}

function onDrawerTitleInput(value) {
  if (!suricataDrawerDraft) return;
  suricataDrawerDraft.name = value;
}

function handleDrawerTitleKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    saveChanges();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    cancelEdit();
  }
}

function triggerDrawerRename() {
  const rule = getDrawerTitleRule();
  if (!rule) return;
  if (
    drawerVariant === "default-alert" ||
    (drawerVariant === "suricata" && isReadonlySuricataRule(rule))
  )
    return;
  if (!editMode) {
    editMode = true;
    suricataDrawerDraft = cloneDrawerState(
      suricataDrawerBaseline || createDrawerStateForRule(rule),
    );
  }
  drawerRenameMode = true;
  syncDrawerHeaderActions();
  syncDrawerTitle();
}

function syncReadonlySuricataDrawerMenu(rule) {
  const menu = document.getElementById("drawerMenu");
  if (!menu) return;
  if (!rule) {
    if (typeof restoreDefaultDrawerMenuMarkup === "function") {
      restoreDefaultDrawerMenuMarkup();
    }
    return;
  }
  const isReadonly =
    drawerVariant === "default-alert" ||
    (drawerVariant === "suricata" && isReadonlySuricataRule(rule));
  menu.innerHTML = `
    <button type="button" class="menu-item${isReadonly ? " is-disabled" : ""}" ${isReadonly ? 'disabled aria-disabled="true"' : 'onclick="triggerDrawerRename()"'}>
      <span class="menu-item-icon">${svgIcon(SURI_ICON_RENAME_SRC)}</span>
      <span class="menu-item-label">Rename</span>
    </button>
    <button type="button" class="menu-item" onclick="openCopyRuleDialog()">
      <span class="menu-item-icon">${svgIcon(SURI_ICON_COPY_SRC)}</span>
      <span class="menu-item-label">Make a Copy</span>
    </button>
    <div class="dropdown-divider"></div>
    <button type="button" class="menu-item" onclick="exportCurrentRule()">
      <span class="menu-item-icon">${svgIcon(SURI_ICON_EXPORT_SRC)}</span>
      <span class="menu-item-label">Export</span>
    </button>
    <div class="dropdown-divider"></div>
    <button type="button" class="menu-item${isReadonly ? " is-disabled" : ""}" ${isReadonly ? 'disabled aria-disabled="true"' : 'onclick="deleteCurrentRule()"'}>
      <span class="menu-item-icon">${svgIcon(SURI_ICON_DELETE_SRC)}</span>
      <span class="menu-item-label">Delete</span>
    </button>
  `;
}

function getSelectedDrawerRule() {
  if (selectedRule === null) return null;
  return currentRules.find((item) => item.id === selectedRule) || null;
}

function getCopySourceRuleOptions() {
  return [...suricataRuleDb, ...teleseerRuleDb]
    .slice()
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

function renderCopyRuleSourceOptions() {
  return getCopySourceRuleOptions()
    .map(
      (rule) =>
        `<option value="${escapeHtml(String(rule.id))}">${escapeHtml(rule.name)}</option>`,
    )
    .join("");
}

function renderCopyRuleTargetOptions() {
  const targets =
    typeof getEditableCustomTargetNodes === "function"
      ? getEditableCustomTargetNodes()
      : [];
  const options = targets.map(({ node, depth }) => {
    const prefix = depth > 0 ? `${"· ".repeat(depth)}` : "";
    return `<option value="${escapeHtml(node.id)}">${escapeHtml(`${prefix}${node.label}`)}</option>`;
  });
  options.push(
    '<option value="__new_custom__">+ Create New Custom Detection</option>',
  );
  options.push(
    '<option value="__new_subfolder__">+ Create New Subfolder</option>',
  );
  return options.join("");
}

function syncCopyRuleDialogFields() {
  const titleEl = document.getElementById("copyRuleDialogTitle");
  const sourceEl = document.getElementById("copyRuleSourceSelect");
  const folderEl = document.getElementById("copyRuleTargetSelect");
  const saveBtn = document.getElementById("copyRuleConfirmButton");
  const createRow = document.getElementById("copyRuleCreateRow");
  const createLabel = document.getElementById("copyRuleCreateLabel");
  const input = document.getElementById("copyRuleCreateInput");
  if (titleEl) {
    titleEl.textContent =
      copyRuleDialogState.mode === "new" ? "New Rule" : "Make a Copy";
  }
  if (sourceEl) {
    sourceEl.innerHTML = renderCopyRuleSourceOptions();
    sourceEl.value = String(copyRuleDialogState.sourceRuleId || "");
  }
  if (folderEl) {
    folderEl.innerHTML = renderCopyRuleTargetOptions();
    folderEl.value = copyRuleDialogState.targetNodeId || "";
  }
  if (saveBtn) {
    saveBtn.textContent = "Save";
  }
  if (createRow)
    createRow.classList.toggle("hidden", !copyRuleDialogState.createMode);
  if (createLabel) {
    createLabel.textContent =
      copyRuleDialogState.createMode === "child"
        ? "New Subfolder"
        : "New Custom Detection";
  }
  if (input) {
    input.placeholder =
      copyRuleDialogState.createMode === "child"
        ? "Subfolder name"
        : "Custom detection name";
  }
}

function renderCopyRuleTargetTree() {
  syncCopyRuleDialogFields();
}

function openCopyRuleDialog(ruleId = selectedRule, options = {}) {
  const rule =
    typeof ruleId === "number"
      ? suricataRuleDb.find((item) => item.id === ruleId) ||
        currentRules.find((item) => item.id === ruleId)
      : getSelectedDrawerRule();
  if (!rule) return;
  const targets =
    typeof getEditableCustomTargetNodes === "function"
      ? getEditableCustomTargetNodes()
      : [];
  copyRuleDialogState.mode = options.mode === "new" ? "new" : "copy";
  copyRuleDialogState.sourceRuleId = rule.id;
  copyRuleDialogState.targetNodeId =
    copyRuleDialogState.targetNodeId &&
    targets.some(({ node }) => node.id === copyRuleDialogState.targetNodeId)
      ? copyRuleDialogState.targetNodeId
      : targets[0]?.node?.id || null;
  copyRuleDialogState.createMode = null;
  document.getElementById("drawerMenu")?.classList.remove("open");
  document.getElementById("copyRuleDialog")?.classList.add("open");
  document.getElementById("copyRuleCreateRow")?.classList.add("hidden");
  const input = document.getElementById("copyRuleCreateInput");
  if (input) input.value = "";
  renderCopyRuleTargetTree();
}

function openNewRuleDialog() {
  const selectedDrawerRule = getSelectedDrawerRule();
  const fallbackRule =
    currentRules.find((rule) => !isDefaultAlertsRule(rule)) ||
    getCopySourceRuleOptions().find((rule) => !isDefaultAlertsRule(rule));
  const sourceRule =
    selectedDrawerRule && !isDefaultAlertsRule(selectedDrawerRule)
      ? selectedDrawerRule
      : fallbackRule;
  if (!sourceRule) return;
  openCopyRuleDialog(sourceRule.id, { mode: "new" });
}

function closeCopyRuleDialog() {
  document.getElementById("copyRuleDialog")?.classList.remove("open");
  document.getElementById("copyRuleCreateRow")?.classList.add("hidden");
  const input = document.getElementById("copyRuleCreateInput");
  if (input) input.value = "";
  copyRuleDialogState.createMode = null;
  copyRuleDialogState.mode = "copy";
}

function selectCopyRuleTarget(nodeId) {
  copyRuleDialogState.targetNodeId = nodeId;
  renderCopyRuleTargetTree();
}

function selectCopyRuleSource(ruleId) {
  copyRuleDialogState.sourceRuleId = Number(ruleId) || null;
  syncCopyRuleDialogFields();
}

function handleCopyRuleTargetChange(value) {
  if (value === "__new_custom__") {
    beginCopyRuleNodeCreation("root");
    syncCopyRuleDialogFields();
    return;
  }
  if (value === "__new_subfolder__") {
    beginCopyRuleNodeCreation("child");
    syncCopyRuleDialogFields();
    return;
  }
  copyRuleDialogState.targetNodeId = value;
  copyRuleDialogState.createMode = null;
  syncCopyRuleDialogFields();
}

function beginCopyRuleNodeCreation(mode) {
  copyRuleDialogState.createMode = mode;
  document.getElementById("copyRuleCreateRow")?.classList.remove("hidden");
  syncCopyRuleDialogFields();
  document.getElementById("copyRuleCreateInput")?.focus();
}

function handleCopyRuleCreateKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    commitCopyRuleNodeCreation();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeCopyRuleDialog();
  }
}

function commitCopyRuleNodeCreation() {
  const input = document.getElementById("copyRuleCreateInput");
  const value = String(input?.value || "").trim();
  if (!value) return;
  const parentId =
    copyRuleDialogState.createMode === "child"
      ? copyRuleDialogState.targetNodeId
      : "suricata-custom-root";
  const newNode =
    typeof createNewCustomNode === "function"
      ? createNewCustomNode(parentId, value)
      : null;
  if (!newNode) return;
  copyRuleDialogState.targetNodeId = newNode.id;
  copyRuleDialogState.createMode = null;
  if (input) input.value = "";
  document.getElementById("copyRuleCreateRow")?.classList.add("hidden");
  renderSidebar();
  renderCopyRuleTargetTree();
}

function confirmCopyRule() {
  if (copyRuleDialogState.createMode) {
    commitCopyRuleNodeCreation();
  }
  if (!copyRuleDialogState.sourceRuleId || !copyRuleDialogState.targetNodeId)
    return;
  const duplicate =
    typeof duplicateRuleToCustomTarget === "function"
      ? duplicateRuleToCustomTarget(
          copyRuleDialogState.sourceRuleId,
          copyRuleDialogState.targetNodeId,
          {
            openDrawer: true,
            enterEditMode: true,
          },
        )
      : null;
  closeCopyRuleDialog();
  if (duplicate) {
    showToast(
      copyRuleDialogState.mode === "new"
        ? "Rule created in Custom Detection"
        : "Rule copied to Custom Detection",
    );
  }
}

function exportCurrentRule() {
  const rule = getDrawerTitleRule();
  if (!rule) return;
  document.getElementById("drawerMenu")?.classList.remove("open");
  showToast(`Exported ${rule.name}`);
}

function deleteCurrentRule() {
  const rule = getDrawerTitleRule();
  if (!rule) return;
  if (drawerVariant === "default-alert") return;
  if (drawerVariant === "suricata" && isReadonlySuricataRule(rule)) return;
  document.getElementById("drawerMenu")?.classList.remove("open");
  if (drawerVariant === "default-alert") {
    teleseerRuleDb = teleseerRuleDb.filter((item) => item.id !== rule.id);
  } else {
    suricataRuleDb = suricataRuleDb.filter((item) => item.id !== rule.id);
  }
  closeDrawer();
  refreshRuleCollections({ preservePage: true });
  renderSidebar();
  renderRules();
  showToast("Rule deleted");
}

function getDefaultAlertSuggestionBoundaryRect(shell) {
  const boundaryEl = shell?.closest(".drawer-content") || shell;
  return boundaryEl?.getBoundingClientRect() || shell?.getBoundingClientRect();
}

function getSuricataMenuBoundaryRect(menu) {
  const boundaryEl = menu?.closest(".drawer-content") || menu;
  return boundaryEl?.getBoundingClientRect() || menu?.getBoundingClientRect();
}

function syncMenuPanelLayout(menu, useLivePanelRect = false) {
  if (!menu) return;
  const panel = menu.querySelector(".menu-list, .suri-menu-panel");
  if (!panel) return;
  const list = panel.querySelector(
    ".suri-subnet-project-list, .suri-scope-suggestion-list, .suri-rule-pattern-menu-options",
  );
  const menuRect = menu.getBoundingClientRect();
  const boundaryRect = getSuricataMenuBoundaryRect(menu);
  const livePanelRect = useLivePanelRect ? panel.getBoundingClientRect() : null;
  const panelWidth = Math.round(
    livePanelRect?.width || panel.offsetWidth || panel.scrollWidth || 264,
  );
  const panelHeight = Math.round(
    livePanelRect?.height || panel.offsetHeight || panel.scrollHeight || 0,
  );
  const listHeight = Math.round(list?.offsetHeight || list?.scrollHeight || 0);
  const viewportPadding = 8;
  const preferredLeft = Math.round(menuRect.width - panelWidth);
  const minLeft = boundaryRect.left + viewportPadding - menuRect.left;
  const maxLeft =
    boundaryRect.right - panelWidth - menuRect.left - viewportPadding;
  const clampedLeft = Math.min(Math.max(preferredLeft, minLeft), maxLeft);
  const availableBelow =
    boundaryRect.bottom - menuRect.bottom - 6 - viewportPadding;
  const nonListHeight = Math.max(0, panelHeight - listHeight);
  const panelMaxHeight = Math.max(0, Math.floor(availableBelow));
  const listMaxHeight = Math.max(0, Math.floor(panelMaxHeight - nonListHeight));

  panel.style.setProperty("--menu-list-left", `${clampedLeft}px`);
  panel.style.setProperty("--menu-list-right", "auto");
  panel.style.setProperty("--menu-list-max-height", `${panelMaxHeight}px`);
  panel.style.setProperty("--menu-list-list-max-height", `${listMaxHeight}px`);
  panel.style.setProperty("--suri-menu-panel-left", `${clampedLeft}px`);
  panel.style.setProperty("--suri-menu-panel-right", "auto");
  panel.style.setProperty(
    "--suri-menu-panel-max-height",
    `${panelMaxHeight}px`,
  );
  panel.style.setProperty("--suri-menu-list-max-height", `${listMaxHeight}px`);

  if (!useLivePanelRect) {
    requestAnimationFrame(() => syncMenuPanelLayout(menu, true));
  }
}

function syncSuricataMenuPanelPosition(menuKey) {
  const menu = document.querySelector(`.suri-menu[data-menu-key="${menuKey}"]`);
  if (!menu) return;
  syncMenuPanelLayout(menu);
}

function syncAllSuricataMenuPanels() {
  document
    .querySelectorAll(".suri-menu.is-open[data-menu-key]")
    .forEach((menu) => syncMenuPanelLayout(menu));
}

function captureSuricataMenuScrollState() {
  const nextState = {
    menus: {},
    scopeSuggestions: {},
    defaultSuggestions: {},
    scopeChipboxes: {},
    defaultChipboxes: {},
  };

  document.querySelectorAll(".suri-menu[data-menu-key]").forEach((menu) => {
    const menuKey = menu.getAttribute("data-menu-key");
    const list = menu.querySelector(
      ".suri-subnet-project-list, .suri-scope-suggestion-list, .suri-rule-pattern-add-results",
    );
    if (!menuKey || !list) return;
    nextState.menus[menuKey] = list.scrollTop;
  });

  document
    .querySelectorAll("[data-suri-scope-suggestions]")
    .forEach((anchor) => {
      const field = anchor.getAttribute("data-suri-scope-suggestions");
      const list = anchor.querySelector(".suri-scope-suggestion-list");
      if (!field || !list) return;
      nextState.scopeSuggestions[field] = list.scrollTop;
    });

  document
    .querySelectorAll("[data-default-filter-suggestions]")
    .forEach((anchor) => {
      const field = anchor.getAttribute("data-default-filter-suggestions");
      const list = anchor.querySelector(".suri-subnet-project-list");
      if (!field || !list) return;
      nextState.defaultSuggestions[field] = list.scrollTop;
    });

  document.querySelectorAll("[data-suri-scope-shell]").forEach((shell) => {
    const field = shell.getAttribute("data-suri-scope-shell");
    const chipBox = shell.querySelector(".suri-scope-chipbox");
    if (!field || !chipBox) return;
    nextState.scopeChipboxes[field] = chipBox.scrollTop;
  });

  document.querySelectorAll("[data-default-filter-shell]").forEach((shell) => {
    const field = shell.getAttribute("data-default-filter-shell");
    const chipBox = shell.querySelector(".default-alert-filter-chipbox");
    if (!field || !chipBox) return;
    nextState.defaultChipboxes[field] = chipBox.scrollTop;
  });

  suricataMenuScrollState = nextState;
  captureSimpleMenuSelectionScrollState();
}

function applySuricataMenuScrollState(consumeSimpleMenuSelectionSnap = false) {
  Object.entries(suricataMenuScrollState.menus || {}).forEach(
    ([menuKey, savedScrollTop]) => {
      const menu = document.querySelector(
        `.suri-menu[data-menu-key="${menuKey}"]`,
      );
      const list = menu?.querySelector(
        ".suri-subnet-project-list, .suri-scope-suggestion-list, .suri-rule-pattern-add-results",
      );
      if (!list || typeof savedScrollTop !== "number") return;
      list.scrollTop = savedScrollTop;
    },
  );

  Object.entries(suricataMenuScrollState.scopeSuggestions || {}).forEach(
    ([field, savedScrollTop]) => {
      const anchor = document.querySelector(
        `[data-suri-scope-suggestions="${field}"]`,
      );
      const list = anchor?.querySelector(".suri-scope-suggestion-list");
      if (!list || typeof savedScrollTop !== "number") return;
      list.scrollTop = savedScrollTop;
    },
  );

  Object.entries(suricataMenuScrollState.defaultSuggestions || {}).forEach(
    ([field, savedScrollTop]) => {
      const anchor = document.querySelector(
        `[data-default-filter-suggestions="${field}"]`,
      );
      const list = anchor?.querySelector(".suri-subnet-project-list");
      if (!list || typeof savedScrollTop !== "number") return;
      list.scrollTop = savedScrollTop;
    },
  );

  Object.entries(suricataMenuScrollState.scopeChipboxes || {}).forEach(
    ([field, savedScrollTop]) => {
      const shell = document.querySelector(
        `[data-suri-scope-shell="${field}"]`,
      );
      const chipBox = shell?.querySelector(".suri-scope-chipbox");
      if (!chipBox || typeof savedScrollTop !== "number") return;
      chipBox.scrollTop = savedScrollTop;
    },
  );

  Object.entries(suricataMenuScrollState.defaultChipboxes || {}).forEach(
    ([field, savedScrollTop]) => {
      const shell = document.querySelector(
        `[data-default-filter-shell="${field}"]`,
      );
      const chipBox = shell?.querySelector(".default-alert-filter-chipbox");
      if (!chipBox || typeof savedScrollTop !== "number") return;
      chipBox.scrollTop = savedScrollTop;
    },
  );

  applySimpleMenuSelectionScrollState(consumeSimpleMenuSelectionSnap);
}

function restoreSuricataSubnetMenuScroll() {
  applySuricataMenuScrollState(false);
  requestAnimationFrame(() => {
    applySuricataMenuScrollState(true);
  });
}

function resetSimpleMenuSelectionScrollState() {
  simpleMenuSelectionScrollState = {
    shells: {},
    snapToBottom: {},
  };
}

function getSimpleMenuSelectionShellKey(key) {
  return String(key || "");
}

function markSimpleMenuSelectionSnapToBottom(key) {
  const shellKey = getSimpleMenuSelectionShellKey(key);
  if (!shellKey) return;
  simpleMenuSelectionScrollState.snapToBottom[shellKey] = true;
}

function captureSimpleMenuSelectionScrollState() {
  const nextState = {
    shells: {},
    snapToBottom: {
      ...(simpleMenuSelectionScrollState.snapToBottom || {}),
    },
  };
  document.querySelectorAll("[data-simple-selection-key]").forEach((shell) => {
    const key = getSimpleMenuSelectionShellKey(
      shell.getAttribute("data-simple-selection-key"),
    );
    if (!key) return;
    nextState.shells[key] = shell.scrollTop;
  });
  simpleMenuSelectionScrollState = nextState;
}

function applySimpleMenuSelectionScrollState(consumeSnapToBottom = false) {
  const shellState = simpleMenuSelectionScrollState.shells || {};
  const snapToBottom = simpleMenuSelectionScrollState.snapToBottom || {};
  document.querySelectorAll("[data-simple-selection-key]").forEach((shell) => {
    const key = getSimpleMenuSelectionShellKey(
      shell.getAttribute("data-simple-selection-key"),
    );
    if (!key) return;
    if (snapToBottom[key]) {
      shell.scrollTop = Math.max(0, shell.scrollHeight - shell.clientHeight);
    } else if (typeof shellState[key] === "number") {
      shell.scrollTop = shellState[key];
    }
    if (consumeSnapToBottom) {
      delete snapToBottom[key];
    }
  });
}

function getActiveDrawerState() {
  if (drawerVariant === "threshold-settings") {
    return suricataDrawerDraft || suricataDrawerBaseline;
  }
  if (editMode) {
    return suricataDrawerDraft;
  }
  if (!suricataDrawerBaseline) return null;
  const selectedEntry = getSelectedDrawerVersionEntry(suricataDrawerBaseline);
  if (!selectedEntry || selectedEntry.isCurrent) {
    return suricataDrawerBaseline;
  }
  const snapshot = createDrawerVersionSnapshot(selectedEntry.snapshot);
  snapshot.versionHistory = cloneDrawerState(suricataDrawerBaseline.versionHistory);
  snapshot.selectedVersionId = suricataDrawerBaseline.selectedVersionId;
  snapshot.version = selectedEntry.label;
  snapshot.versionSavedAt = selectedEntry.savedAt;
  return snapshot;
}

function renderSuricataMenuControl(kind, field, value, options) {
  const menuKey = `drawer:${kind}:${field}`;
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = options
    .map((option) => {
      const selectedClass = option === value ? " is-selected" : "";
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onclick="selectSuricataMenuOption(event, '${escapeJsSingleQuoted(menuKey)}', '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(option)}')"
        >
          <span>${escapeHtml(option)}</span>
        </button>
      `;
    })
    .join("");
  const triggerIcon =
    kind === "select" ? SURI_MENU_SELECT_ICON_SRC : SURI_MENU_DROPDOWN_ICON_SRC;
  return `
    <div class="suri-menu" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="suri-menu-trigger ${kind === "select" ? "suri-select" : "suri-dropdown"}"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="suri-menu-value">${escapeHtml(value)}</span>
        <img class="suri-menu-trigger-icon" src="${triggerIcon}" alt="" aria-hidden="true" />
      </button>
      <div class="menu-list" role="listbox">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderSuricataSubnetCheckbox(checked, mode = "include") {
  const selectionMode = mode === "exclude" ? "mode-exclude" : "mode-include";
  return `
    <span class="suri-subnet-checkbox-wrap">
      <span class="suri-subnet-checkbox ${checked ? `checked ${selectionMode}` : ""}">
        <img class="suri-subnet-checkbox-icon" src="${SURI_ICON_CHECK_SRC}" alt="" aria-hidden="true" />
      </span>
    </span>
  `;
}

function renderSuricataValue(value) {
  return `<span class="static-field suri-static-field">${escapeHtml(value)}</span>`;
}

function getSuricataMadlibOptionIcon(field, value) {
  if (field === "protocols") {
    return SURI_PROTOCOL_ICON_MAP[String(value || "").toUpperCase()] || "";
  }
  if (field === "directionality") {
    return String(value || "") === "Bidirectional"
      ? SURI_ICON_DIRECTION_BIDIRECTIONAL_SRC
      : SURI_ICON_DIRECTION_UNIDIRECTIONAL_SRC;
  }
  return "";
}

function renderMenuValueContent(label, iconSrc = "") {
  return `
    <span class="suri-menu-value-content${iconSrc ? " has-leading-icon" : ""}">
      ${iconSrc ? `<img class="suri-option-leading-icon" src="${iconSrc}" alt="" aria-hidden="true" />` : ""}
      <span class="suri-menu-value-label">${escapeHtml(label)}</span>
    </span>
  `;
}

function renderSuricataSelect(field, value, options) {
  return renderSuricataMenuControl("select", field, value, options);
}

function getSuricataMadlibDisplayLabel(field, value) {
  const text = String(value ?? "").trim();
  if (field === "directionality") {
    return text === "Bidirectional" ? "bidirectional" : "one-way";
  }
  if (field === "state") {
    return text ? text.toLowerCase() : "established";
  }
  if (field === "protocols" && !text) {
    return "Any protocol";
  }
  return text || "—";
}

function normalizeSuricataProtocolSelection(value) {
  const validProtocols = new Set(
    SURICATA_PROTOCOL_OPTIONS.map((option) => option.value),
  );
  const rawValues = Array.isArray(value)
    ? value
    : String(value ?? "")
        .split(",")
        .map((entry) => entry.trim());
  const selected = [];
  rawValues.forEach((entry) => {
    const protocol = String(entry || "").trim().toUpperCase();
    if (
      !protocol ||
      protocol === "ANY" ||
      protocol === "ANY PROTOCOL" ||
      /\d+\s+PROTOCOLS?/i.test(protocol) ||
      !validProtocols.has(protocol) ||
      selected.includes(protocol)
    ) {
      return;
    }
    selected.push(protocol);
  });
  return selected;
}

function formatSuricataProtocolSummary(value) {
  const selected = normalizeSuricataProtocolSelection(value);
  if (!selected.length) return "Any protocol";
  if (selected.length === 1) return selected[0];
  return `${selected.length} Protocols`;
}

function getSuricataConfigProtocolToken(state) {
  const selected = normalizeSuricataProtocolSelection(state?.protocols);
  if (selected.length === 1) return selected[0].toLowerCase();
  return "any";
}

function getSuricataProtocolMenuKey() {
  return "drawer:protocols:picker";
}

function renderSuricataProtocolPicker(state) {
  const menuKey = getSuricataProtocolMenuKey();
  const isOpen = suricataOpenMenuKey === menuKey;
  const selected = normalizeSuricataProtocolSelection(state?.protocols);
  const selectedSet = new Set(selected);
  const query = String(suricataProtocolSearch || "").trim().toLowerCase();
  const visibleOptions = SURICATA_PROTOCOL_OPTIONS.filter((option) =>
    option.value.toLowerCase().includes(query),
  );
  const renderedRows = visibleOptions.length
    ? visibleOptions
        .map((option) => {
          const checked = selectedSet.has(option.value);
          return `
            <button
              type="button"
              class="menu-item menu-item-checkbox suri-protocol-option${checked ? " is-selected" : ""}"
              role="option"
              aria-selected="${checked ? "true" : "false"}"
              onclick="toggleSuricataProtocolOption(event, '${escapeJsSingleQuoted(option.value)}')"
            >
              <span class="sot-checkbox${checked ? " is-checked" : ""}" aria-hidden="true"></span>
              <span class="suri-protocol-option-content">
                <img class="suri-option-leading-icon suri-protocol-option-icon" src="${escapeHtml(option.icon)}" alt="" aria-hidden="true" />
                <span class="suri-protocol-option-label">${escapeHtml(option.value)}</span>
              </span>
            </button>
          `;
        })
        .join("")
    : '<div class="suri-scope-empty">No protocols match your search.</div>';

  if (!editMode) {
    return renderRuleConfigReadonlyTrigger(formatSuricataProtocolSummary(state?.protocols));
  }

  return `
    <div class="suri-menu suri-madlib-menu suri-protocol-picker${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-s style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
        data-suri-protocol-trigger
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(formatSuricataProtocolSummary(state?.protocols))}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_SELECT_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list suri-protocol-menu-list" role="listbox">
        <div class="suri-subnet-search suri-protocol-search">
          <img src="${SURI_ICON_SEARCH_SRC}" alt="" aria-hidden="true" />
          <input
            type="text"
            value="${escapeHtml(suricataProtocolSearch)}"
            placeholder="Search..."
            aria-label="Search protocols"
            oninput="onSuricataProtocolSearchInput(this.value)"
          />
        </div>
        <div class="suri-subnet-divider" aria-hidden="true"></div>
        <div class="suri-protocol-option-list">
          ${renderedRows}
        </div>
      </div>
    </div>
  `;
}

function renderSuricataMadlibSelect(field, value, options, readonlyVariant = "teletext") {
  const menuKey = `drawer:select:${field}`;
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = options
    .map((option) => {
      const selectedClass = option === value ? " is-selected" : "";
      const iconSrc = getSuricataMadlibOptionIcon(field, option);
      const optionLabel = getSuricataMadlibDisplayLabel(field, option);
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onclick="selectSuricataMenuOption(event, '${escapeJsSingleQuoted(menuKey)}', '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(option)}')"
        >
          ${renderMenuValueContent(optionLabel, iconSrc)}
        </button>
      `;
    })
    .join("");
  const selectedLabel = getSuricataMadlibDisplayLabel(field, value);
  if (!editMode) {
    return readonlyVariant === "rule-config"
      ? renderRuleConfigReadonlyTrigger(selectedLabel, selectedLabel)
      : renderMadlibReadonlyTrigger(selectedLabel);
  }
  const selectedIconSrc = getSuricataMadlibOptionIcon(field, value);
  return `
    <div class="suri-menu suri-madlib-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-s style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">
            ${renderMenuValueContent(selectedLabel, selectedIconSrc)}
          </span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_SELECT_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list" role="listbox">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderSuricataMadlibCombobox(field, value, options, placeholder = "") {
  const menuKey = `drawer:combobox:${field}`;
  const isOpen = suricataOpenMenuKey === menuKey;
  if (!editMode) {
    return renderRuleConfigReadonlyTrigger(value || "—");
  }
  const renderedOptions = options
    .map((option) => {
      const selectedClass = option === value ? " is-selected" : "";
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onmousedown="event.preventDefault()"
          onclick="selectSuricataMenuOption(event, '${escapeJsSingleQuoted(menuKey)}', '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(option)}')"
        >
          ${renderMenuValueContent(option, "")}
        </button>
      `;
    })
    .join("");
  return `
    <div class="suri-menu suri-madlib-combobox${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <div class="suri-madlib-combobox-shell">
        <input
          type="text"
          class="suri-madlib-combobox-input"
          value="${escapeHtml(value || "")}"
          placeholder="${escapeHtml(placeholder)}"
          oninput="setSuricataField('${escapeJsSingleQuoted(field)}', this.value)"
          onfocus="if(suricataOpenMenuKey!=='${escapeJsSingleQuoted(menuKey)}'){suricataOpenMenuKey='${escapeJsSingleQuoted(menuKey)}';syncSuricataMenus();}"
          onblur="setTimeout(function(){if(suricataOpenMenuKey==='${escapeJsSingleQuoted(menuKey)}'){suricataOpenMenuKey=null;syncSuricataMenus();}},150)"
        />
        <button
          type="button"
          class="btn-reset suri-madlib-combobox-chevron"
          tabindex="-1"
          onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
          aria-label="Show options"
        >
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </button>
      </div>
      <div class="menu-list" role="listbox">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderSuricataDropdown(field, value, options) {
  return renderSuricataMenuControl("dropdown", field, value, options);
}

function renderSuricataInput(field, value, placeholder = "") {
  return `<input class="suri-input-field" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" onchange="setSuricataField('${field}', this.value)" />`;
}

function renderSuricataToggle(field, enabled, disabled) {
  const stateClass = enabled ? " is-on" : "";
  const disabledClass = disabled ? " is-disabled" : "";
  const disabledAttrs = disabled ? ' disabled aria-disabled="true"' : "";
  const clickHandler = disabled
    ? ""
    : ` onclick="toggleSuricataToggle('${field}')"`;
  return `<button type="button" class="suri-toggle${stateClass}${disabledClass}"${disabledAttrs}${clickHandler}><span class="suri-toggle-thumb"></span></button>`;
}

function renderSuricataRow(label, rightMarkup, options = {}) {
  const muted = options.muted ? "is-muted" : "";
  const disclosureId = options.disclosureId;
  const isDisclosure = Boolean(disclosureId);
  const isExpanded = isDisclosure
    ? Boolean(suricataRowAccordionState[disclosureId])
    : false;
  const indentationClass = options.indentLevel
    ? `is-indent-${options.indentLevel}`
    : "";
  const customClass = options.className || "";
  const rowClass = [
    "card-row",
    "suri-row",
    muted,
    isDisclosure ? "is-disclosure" : "",
    indentationClass,
    customClass,
  ]
    .filter(Boolean)
    .join(" ");
  const indentSpacer =
    options.indentLevel && !isDisclosure
      ? '<span class="suri-row-indent-spacer" aria-hidden="true"></span>'
      : "";
  const disclosure = isDisclosure
    ? `<span class="suri-row-disclosure" aria-hidden="true"><img class="suri-row-disclosure-icon${isExpanded ? " is-expanded" : ""}" src="${SURI_ROW_ARROW_RIGHT_SRC}" alt="" /></span>`
    : "";
  const info = options.info
    ? `<img class="suri-inline-info" src="${SURI_ICON_INFO_SRC}" alt="" aria-hidden="true" />`
    : "";
  const rowDomId = isDisclosure
    ? ` id="suriDisclosureRow-${escapeHtml(disclosureId)}"`
    : "";
  const rowAttrs = isDisclosure
    ? ` role="button" tabindex="0" aria-expanded="${isExpanded ? "true" : "false"}" onclick="toggleSuricataRowAccordion('${disclosureId}')" onkeydown="onSuricataRowAccordionKeydown(event, '${disclosureId}')"`
    : "";
  return `
    <div class="${rowClass}"${rowDomId}${rowAttrs}>
      <div class="card-label suri-row-label">${disclosure}${indentSpacer}${escapeHtml(label)}${info}</div>
      <div class="card-value suri-row-value">${rightMarkup}</div>
    </div>
  `;
}

function renderSuricataRowExpansion(contentMarkup, options = {}) {
  const isExpanded = options.expanded !== false;
  const indentationClass = options.indentLevel
    ? ` is-indent-${options.indentLevel}`
    : "";
  const rowGroupClass = options.rowGroup ? " is-row-group" : "";
  const customClass = options.className ? ` ${options.className}` : "";
  const collapsedClass = isExpanded ? "" : " is-collapsed";
  const disclosureId = options.disclosureId;
  const rowDomId = disclosureId
    ? ` id="suriRowExpansion-${escapeHtml(disclosureId)}"`
    : "";
  return `
    <div class="suri-row suri-row-expansion${indentationClass}${rowGroupClass}${customClass}${collapsedClass}"${rowDomId} aria-hidden="${isExpanded ? "false" : "true"}">
      <div class="suri-row-expansion-body">${contentMarkup}</div>
    </div>
  `;
}

function getActiveAccordionState() {
  if (drawerVariant === "variables") {
    return variableAccordionState;
  }
  return drawerVariant === "default-alert"
    ? defaultAlertAccordionState
    : suricataAccordionState;
}

function renderSuricataCard(title, bodyMarkup, options = {}) {
  const info = options.info
    ? `<img class="suri-header-info" src="${SURI_ICON_INFO_SRC}" alt="" aria-hidden="true" />`
    : "";
  const accordionId = options.accordionId;
  const isCollapsible = Boolean(accordionId);
  const accordionState = getActiveAccordionState();
  const isExpanded = isCollapsible
    ? Boolean(accordionState[accordionId])
    : true;
  const defaultChevron = isCollapsible
    ? `
        <div class="card-header-chevron">
          <img class="card-header-chevron-icon suri-card-chevron-icon${isExpanded ? " is-expanded" : ""}" src="${SURI_ARROW_ICON_DOWN_SRC}" alt="" aria-hidden="true" data-accordion-chevron="${escapeHtml(accordionId)}" />
        </div>
      `
    : "";
  const headerControls = options.headerControls ?? "";
  const cardClasses = [
    isCollapsible ? "card-accordion" : "card",
    "suri-card",
    isCollapsible ? "is-collapsible" : "",
    isCollapsible && !isExpanded ? "is-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const cardDomId = isCollapsible
    ? ` id="suriCard-${escapeHtml(accordionId)}"`
    : "";
  const headerAttrs = isCollapsible
    ? ` role="button" tabindex="0" aria-expanded="${isExpanded ? "true" : "false"}" onclick="toggleSuricataAccordion('${accordionId}')" onkeydown="onSuricataAccordionHeaderKeydown(event, '${accordionId}')"`
    : "";
  const headerTail =
    headerControls || defaultChevron
      ? `
        <div class="card-header-tail">
          ${headerControls ? `<div class="card-header-controls">${headerControls}</div>` : ""}
          ${defaultChevron}
        </div>
      `
      : "";
  return `
    <section class="${cardClasses}"${cardDomId}>
      <div class="card-accordion-header card-header suri-card-header"${headerAttrs}>
        <div class="card-title suri-card-title">${escapeHtml(title)}${info}</div>
        ${headerTail}
      </div>
      <div class="card-body suri-card-body">${bodyMarkup}</div>
    </section>
  `;
}

function renderParamInlineControl(markup, className = "") {
  return `<span class="suri-param-inline-control ${className}">${markup}</span>`;
}

function renderParamSentence(markup, className = "") {
  return `<div class="suri-param-sentence ${className}">${markup}</div>`;
}

function renderMadlibReadonlyTrigger(label) {
  return renderTeletextToken(label);
}

function formatRuleConfigReadonlyConjunction(items) {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (normalizedItems.length <= 1) return normalizedItems[0] || "";
  if (normalizedItems.length === 2) {
    return `${normalizedItems[0]} and ${normalizedItems[1]}`;
  }
  return `${normalizedItems.slice(0, -1).join(", ")}, and ${
    normalizedItems[normalizedItems.length - 1]
  }`;
}

function getRuleConfigReadonlyEntryCategory(entry) {
  const singular = String(entry?.categorySingular || entry?.category || "Item")
    .trim();
  const plural = String(entry?.categoryPlural || `${singular}s`).trim();
  return {
    singular: singular || "Item",
    plural: plural || "Items",
  };
}

function formatRuleConfigReadonlyMadlib(entries, emptyLabel = "") {
  const normalizedEntries = Array.isArray(entries) ? entries : [];
  const fallbackLabel = String(emptyLabel || "").trim();
  if (!normalizedEntries.length) {
    return {
      entries: [],
      hasPopover: false,
      label: fallbackLabel || "—",
    };
  }
  const values = normalizedEntries.map((entry) => String(entry?.value || "").trim());
  if (normalizedEntries.length === 1) {
    const entry = normalizedEntries[0];
    const value = values[0] || fallbackLabel || "—";
    return {
      entries: normalizedEntries,
      hasPopover: false,
      label: entry?.mode === "exclude" ? `Not ${value}` : value,
    };
  }
  if (normalizedEntries.length === 2) {
    return {
      entries: normalizedEntries,
      hasPopover: true,
      label: formatRuleConfigReadonlyConjunction(values),
    };
  }
  const groupedCounts = [];
  const groupIndexByPlural = new Map();
  normalizedEntries.forEach((entry) => {
    const category = getRuleConfigReadonlyEntryCategory(entry);
    const key = category.plural.toLowerCase();
    const existingIndex = groupIndexByPlural.get(key);
    if (existingIndex !== undefined) {
      groupedCounts[existingIndex].count += 1;
      return;
    }
    groupIndexByPlural.set(key, groupedCounts.length);
    groupedCounts.push({
      count: 1,
      singular: category.singular,
      plural: category.plural,
    });
  });
  return {
    entries: normalizedEntries,
    hasPopover: true,
    label: formatRuleConfigReadonlyConjunction(
      groupedCounts.map((group) =>
        `${group.count} ${group.count === 1 ? group.singular : group.plural}`,
      ),
    ),
  };
}

function formatRuleConfigReadonlyTooltip(entries, emptyLabel = "") {
  return formatRuleConfigReadonlyMadlib(entries, emptyLabel).label;
}

function renderRuleConfigReadonlyPopover(entries) {
  const normalizedEntries = Array.isArray(entries) ? entries : [];
  if (normalizedEntries.length <= 1) return "";
  return `
    <span class="suri-madlib-readonly-popover" role="tooltip">
      ${normalizedEntries
        .map((entry) => {
          const isExcluded = entry?.mode === "exclude";
          return `
            <span class="suri-madlib-readonly-popover-item${isExcluded ? " is-excluded" : ""}">
              ${isExcluded ? '<span class="suri-madlib-readonly-popover-bang" aria-hidden="true">!</span>' : '<span class="suri-madlib-readonly-popover-bang" aria-hidden="true"></span>'}
              <span class="suri-madlib-readonly-popover-value">${escapeHtml(entry?.value || "")}</span>
            </span>
          `;
        })
        .join("")}
    </span>
  `;
}

function renderRuleConfigReadonlyTrigger(label, config = "") {
  const normalizedConfig =
    config && typeof config === "object" && !Array.isArray(config)
      ? config
      : {};
  const readonlyMeta = Array.isArray(config)
    ? formatRuleConfigReadonlyMadlib(config, label)
    : normalizedConfig.entries
      ? formatRuleConfigReadonlyMadlib(
          normalizedConfig.entries,
          normalizedConfig.emptyLabel || label,
        )
      : {
          entries: [],
          hasPopover: false,
          label: String(label ?? "").trim() || "—",
        };
  const resolvedLabel = String(readonlyMeta.label || label || "—").trim() || "—";
  const popoverMarkup = readonlyMeta.hasPopover
    ? renderRuleConfigReadonlyPopover(readonlyMeta.entries)
    : "";
  const affordanceClass = readonlyMeta.hasPopover ? " has-popover" : "";
  const focusAttr = readonlyMeta.hasPopover ? ' tabindex="0"' : "";
  return `
    <span class="suri-madlib-trigger is-readonly${affordanceClass}"${focusAttr}>
      <span class="suri-madlib-trigger-label">${escapeHtml(resolvedLabel)}</span>
      ${popoverMarkup}
    </span>
  `;
}

function renderMenuItemModeButtons(
  includeAction,
  excludeAction,
  activeMode = "",
) {
  const resolvedMode =
    activeMode === "exclude"
      ? "exclude"
      : activeMode === "include"
        ? "include"
        : "";
  return `
    <span class="suri-item-action-buttons" onclick="event.stopPropagation()">
      <button
        type="button"
        class="btn-reset btn-secondary-icon size-s style-outline suri-item-action-button is-include${resolvedMode === "include" ? " is-active" : ""}"
        aria-label="Include"
        onclick="${includeAction}"
        onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); ${includeAction}; }"
      >
        <span class="suri-item-action-glyph" aria-hidden="true">+</span>
      </button>
      <button
        type="button"
        class="btn-reset btn-secondary-icon size-s style-outline suri-item-action-button is-exclude${resolvedMode === "exclude" ? " is-active" : ""}"
        aria-label="Exclude"
        onclick="${excludeAction}"
        onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); ${excludeAction}; }"
      >
        <span class="suri-item-action-glyph" aria-hidden="true">-</span>
      </button>
    </span>
  `;
}

function getRulePatternMenuKey(patternId) {
  return `rule-pattern:${patternId}`;
}

function getRulePatternFieldMenuKey(patternId) {
  return `rule-pattern:${patternId}:field`;
}

function getRulePatternAddMenuKey() {
  return "rule-pattern:add";
}

function getRulePatternInputPlaceholder(type) {
  return getRulePatternPlaceholder(type);
}

function formatRulePatternRelationLabel(pattern, relation = pattern.relation) {
  return String(relation || getRulePatternDefaultRelation(pattern.type));
}

function formatRulePatternMenuRelationLabel(
  pattern,
  relation = pattern.relation,
) {
  const baseRelation = formatRulePatternRelationLabel(pattern, relation);
  if (!pattern.exclude) return baseRelation;
  switch (baseRelation) {
    case "Contains":
      return "does not Contain";
    case "Starts With":
      return "does not Start With";
    case "Ends With":
      return "does not End With";
    case "Matches":
      return "does not Match";
    case "Is exactly":
      return "does not Equal";
    default:
      return `does not ${baseRelation}`;
  }
}

function renderRulePatternInfo(type) {
  if (!editMode) return "";
  return type === "httpHeader" ||
    type === "dnsQuery" ||
    !isRulePatternTypeEnabled(type)
    ? `<img class="suri-inline-info" src="${SURI_ICON_INFO_SRC}" alt="" aria-hidden="true" />`
    : "";
}

function renderRulePatternRelationMenu(pattern) {
  const relationOptions = getRulePatternRelationOptions(pattern.type);
  if (!relationOptions.length) return "";
  const menuKey = getRulePatternMenuKey(pattern.id);
  const isOpen = suricataOpenMenuKey === menuKey;
  const relationLabel = formatRulePatternRelationLabel(pattern);
  const relationOptionsMarkup = relationOptions
    .map((relation) => {
      const selected = relation === pattern.relation;
      return `
        <button
          type="button"
          class="suri-rule-pattern-menu-option${selected ? " is-selected" : ""}"
          onclick="selectRulePatternRelation(event, '${escapeJsSingleQuoted(pattern.id)}', '${escapeJsSingleQuoted(relation)}')"
        >
          <span class="suri-rule-pattern-menu-check" aria-hidden="true">
            ${selected ? `<img src="${SURI_ICON_CHECK_MENU_ITEM_SRC}" alt="" />` : ""}
          </span>
          <span class="suri-rule-pattern-menu-label">${escapeHtml(formatRulePatternMenuRelationLabel(pattern, relation))}</span>
        </button>
      `;
    })
    .join("");
  if (!editMode) {
    return `<span class="suri-rule-pattern-relation-static">${escapeHtml(relationLabel)}</span>`;
  }
  return `
    <div class="suri-menu suri-rule-pattern-relation-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger suri-rule-pattern-relation-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(relationLabel)}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list suri-rule-pattern-menu-panel" role="listbox" onclick="event.stopPropagation()">
        <div class="suri-rule-pattern-menu-utility">
          <span class="suri-rule-pattern-menu-utility-label">Exclude Selection</span>
          <button
            type="button"
            class="suri-toggle${pattern.exclude ? " is-on" : ""}"
            onclick="toggleRulePatternExclude(event, '${escapeJsSingleQuoted(pattern.id)}')"
          >
            <span class="suri-toggle-thumb"></span>
          </button>
        </div>
        <div class="suri-subnet-divider" aria-hidden="true"></div>
        <div class="suri-rule-pattern-menu-options">
          ${relationOptionsMarkup}
        </div>
      </div>
    </div>
  `;
}

function renderRulePatternHeaderFieldMenu(pattern) {
  if (pattern.type !== "httpHeader") return "";
  const menuKey = getRulePatternFieldMenuKey(pattern.id);
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = getRulePatternHeaderFieldOptions(pattern.type)
    .map((option) => {
      const selectedClass =
        option === pattern.headerField ? " is-selected" : "";
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onclick="selectRulePatternHeaderField(event, '${escapeJsSingleQuoted(pattern.id)}', '${escapeJsSingleQuoted(option)}')"
        >
          <span>${escapeHtml(option)}</span>
        </button>
      `;
    })
    .join("");
  if (!editMode) {
    return `<div class="suri-rule-pattern-relation-static">${escapeHtml(pattern.headerField || "User-Agent")}</div>`;
  }
  return `
    <div class="suri-menu suri-madlib-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger suri-rule-pattern-field-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(pattern.headerField || "User-Agent")}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list suri-rule-pattern-menu-panel" role="listbox" onclick="event.stopPropagation()">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderRulePatternValueControl(pattern) {
  if (!editMode) {
    return `<div class="suri-input-field suri-rule-pattern-input is-readonly">${escapeHtml(pattern.value || "—")}</div>`;
  }
  return `
    <input
      class="suri-input-field suri-rule-pattern-input"
      type="text"
      value="${escapeHtml(pattern.value)}"
      placeholder="${escapeHtml(getRulePatternInputPlaceholder(pattern.type))}"
      data-rule-pattern-input="${escapeHtml(pattern.id)}"
      oninput="updateRulePatternValue('${escapeJsSingleQuoted(pattern.id)}', this.value)"
    />
  `;
}

function renderRulePatternTextInput(pattern, overrideValue = pattern.value) {
  if (!editMode) {
    return `<div class="suri-input-field suri-rule-pattern-input is-readonly">${escapeHtml(overrideValue || "—")}</div>`;
  }
  return `
    <input
      class="suri-input-field suri-rule-pattern-input"
      type="text"
      value="${escapeHtml(overrideValue || "")}"
      placeholder="${escapeHtml(getRulePatternInputPlaceholder(pattern.type))}"
      data-rule-pattern-input="${escapeHtml(pattern.id)}"
      oninput="updateRulePatternValue('${escapeJsSingleQuoted(pattern.id)}', this.value)"
    />
  `;
}

function renderRulePatternFieldTextInput(
  pattern,
  field,
  value,
  placeholder = "Enter value",
  widthClass = "",
) {
  if (!editMode) {
    return `<div class="suri-input-field suri-rule-pattern-input is-readonly${widthClass ? ` ${widthClass}` : ""}">${escapeHtml(value || "—")}</div>`;
  }
  return `
    <input
      class="suri-input-field suri-rule-pattern-input${widthClass ? ` ${widthClass}` : ""}"
      type="text"
      value="${escapeHtml(String(value ?? ""))}"
      placeholder="${escapeHtml(placeholder)}"
      oninput="updateRulePatternField('${escapeJsSingleQuoted(pattern.id)}', '${escapeJsSingleQuoted(field)}', this.value)"
    />
  `;
}

function renderRulePatternStringLikeBody(pattern, options = {}) {
  const leadingControls = Array.isArray(options.leadingControls)
    ? options.leadingControls.filter(Boolean).join("")
    : String(options.leadingControls || "");
  const includeRelation = options.includeRelation !== false;
  const includeTransformChain =
    options.includeTransformChain !== false && isRulePatternTransformEligible(pattern.type);
  const controlsClass = options.controlsClass ? ` ${options.controlsClass}` : "";
  const valueInput =
    options.valueInput === false
      ? ""
      : renderRulePatternTextInput(
          pattern,
          options.valueOverride === undefined ? pattern.value : options.valueOverride,
        );
  return `
    <div class="suri-rule-pattern-grid two-line">
      ${includeTransformChain ? renderRulePatternTransformChain(pattern) : ""}
      <div class="suri-rule-pattern-controls-row${controlsClass}">
        ${leadingControls}
        ${includeRelation ? renderRulePatternRelationMenu(pattern) : ""}
        ${valueInput}
      </div>
    </div>
  `;
}

function renderRulePatternNumberCompareBody(pattern, widthClass = "") {
  return `
    <div class="suri-rule-pattern-controls-row has-compare${widthClass ? ` ${widthClass}` : ""}">
      ${renderRulePatternSelect(pattern.id, "compareOperator", pattern.compareOperator, RULE_PATTERN_COMPARE_OPERATORS)}
      ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue)}
    </div>
  `;
}

function renderRulePatternNumberInput(patternId, field, value, widthClass = "") {
  const className = ["suri-input-field", "suri-rule-pattern-input", "suri-rule-pattern-number-input", widthClass]
    .filter(Boolean)
    .join(" ");
  return `
    <input
      class="${className}"
      type="number"
      value="${escapeHtml(String(value ?? ""))}"
      oninput="updateRulePatternField('${escapeJsSingleQuoted(patternId)}', '${escapeJsSingleQuoted(field)}', this.value)"
    />
  `;
}

function renderRulePatternSelect(patternId, field, value, options, widthClass = "") {
  const menuKey = `rule-pattern:${patternId}:${field}`;
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = options
    .map((option) => {
      const optionValue =
        typeof option === "string" ? option : String(option.value ?? "");
      const optionLabel =
        typeof option === "string" ? option : String(option.label ?? optionValue);
      const selectedClass = optionValue === value ? " is-selected" : "";
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onclick="updateRulePatternField(event, '${escapeJsSingleQuoted(patternId)}', '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(optionValue)}', '${escapeJsSingleQuoted(menuKey)}')"
        >
          <span>${escapeHtml(optionLabel)}</span>
        </button>
      `;
    })
    .join("");
  return `
    <div class="suri-menu suri-madlib-menu ${widthClass}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(value || "—")}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list suri-rule-pattern-menu-panel" role="listbox" onclick="event.stopPropagation()">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderRulePatternFieldValue(pattern) {
  return pattern.enumValue || pattern.value;
}

function renderRulePatternTransformArgInput(pattern, transform, index) {
  const meta = getRulePatternTransformMeta(transform?.kind);
  if (!meta?.requiresArg) return "";
  if (!editMode) {
    return `<div class="suri-input-field suri-rule-pattern-input is-readonly">${escapeHtml(getRulePatternTransformArgValue(transform) || "—")}</div>`;
  }
  return `
    <input
      class="suri-input-field suri-rule-pattern-input"
      type="text"
      value="${escapeHtml(getRulePatternTransformArgValue(transform))}"
      placeholder="${escapeHtml(meta.argPlaceholder || "")}"
      oninput="updateRulePatternTransformArg('${escapeJsSingleQuoted(pattern.id)}', ${index}, this.value)"
    />
  `;
}

function renderRulePatternTransformMenu(pattern, transform, index) {
  const menuKey = `rule-pattern:${pattern.id}:transform:${index}`;
  const isOpen = suricataOpenMenuKey === menuKey;
  const options = getRulePatternTransformOptions(pattern.type);
  const renderedOptions = [
    transform?.kind
      ? `
        <button
          type="button"
          class="suri-rule-pattern-menu-option"
          onclick="removeRulePatternTransform(event, '${escapeJsSingleQuoted(pattern.id)}', ${index}, '${escapeJsSingleQuoted(menuKey)}')"
        >
          <span class="suri-rule-pattern-menu-check" aria-hidden="true">×</span>
          <span class="suri-rule-pattern-menu-label">Remove Transform</span>
        </button>
        <div class="suri-subnet-divider" aria-hidden="true"></div>
      `
      : "",
    ...options.map((option) => {
      const selected = option.kind === transform?.kind;
      return `
        <button
          type="button"
          class="suri-rule-pattern-menu-option${selected ? " is-selected" : ""}"
          onclick="selectRulePatternTransform(event, '${escapeJsSingleQuoted(pattern.id)}', ${index}, '${escapeJsSingleQuoted(option.kind)}', '${escapeJsSingleQuoted(menuKey)}')"
        >
          <span class="suri-rule-pattern-menu-check" aria-hidden="true">
            ${selected ? `<img src="${SURI_ICON_CHECK_MENU_ITEM_SRC}" alt="" />` : ""}
          </span>
          <span class="suri-rule-pattern-menu-label">${escapeHtml(option.label)}</span>
          ${option.kind === "luaxform" ? `<img class="suri-inline-info" src="${SURI_ICON_INFO_SRC}" alt="" aria-hidden="true" />` : ""}
        </button>
      `;
    }),
  ].join("");
  return `
    <div class="suri-menu suri-madlib-menu suri-rule-pattern-transform-menu" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(getRulePatternTransformLabel(transform?.kind))}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list suri-rule-pattern-transform-panel" role="listbox" onclick="event.stopPropagation()">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderRulePatternTransformChain(pattern) {
  if (!isRulePatternTransformEligible(pattern.type) || !pattern.transformEnabled) {
    return "";
  }
  const transforms = Array.isArray(pattern.transforms) && pattern.transforms.length
    ? pattern.transforms
    : [{ kind: "", args: {} }];
  const disableAdd = !transforms.every((transform) => String(transform?.kind || "").trim());
  return `
    <div class="suri-rule-pattern-transform-row">
      ${transforms
        .map(
          (transform, index) => `
            ${index > 0 ? '<span class="suri-rule-pattern-transform-arrow" aria-hidden="true">→</span>' : ""}
            ${renderRulePatternTransformMenu(pattern, transform, index)}
            ${renderRulePatternTransformArgInput(pattern, transform, index)}
          `,
        )
        .join("")}
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-default suri-rule-pattern-transform-add${disableAdd ? " is-disabled" : ""}"
        ${disableAdd ? 'disabled aria-disabled="true"' : `onclick="addRulePatternTransform(event, '${escapeJsSingleQuoted(pattern.id)}')"` }
      >
        Add
      </button>
      ${pattern.exclude ? '<span class="suri-rule-pattern-exclude">does not</span>' : ""}
    </div>
  `;
}

function renderRulePatternRegionRow(pattern) {
  if (!isRulePatternRegionEligible(pattern.type) || !pattern.regionEnabled) return "";
  return `
    <div class="suri-rule-pattern-inline-row">
      <span class="suri-rule-pattern-inline-label">Search</span>
      ${renderRulePatternNumberInput(pattern.id, "regionBytes", pattern.regionBytes, "is-short")}
      <span class="suri-rule-pattern-inline-label">bytes from offset</span>
      ${renderRulePatternNumberInput(pattern.id, "regionOffset", pattern.regionOffset, "is-short")}
      <span class="suri-rule-pattern-inline-label">after previous match</span>
    </div>
  `;
}

function renderRulePatternControlBody(pattern) {
  switch (pattern.type) {
    case "content":
    case "regex":
    case "httpMethod":
    case "httpUri":
    case "httpHost":
    case "httpCookie":
    case "httpUserAgent":
    case "httpRequestBody":
    case "httpResponseBody":
    case "httpStatusMessage":
    case "httpStart":
    case "httpProtocol":
    case "httpHeaderNames":
    case "httpContentType":
    case "httpConnection":
    case "httpAccept":
    case "httpAcceptLanguage":
    case "httpReferer":
    case "tlsSni":
    case "tlsCertSubject":
    case "tlsCertIssuer":
    case "tlsCert":
    case "tlsRandom":
    case "sshSoftware":
    case "sshHassh":
    case "sshHasshServer":
    case "sshHasshString":
    case "sshHasshServerString":
    case "dnsQuery":
    case "smtpHelo":
    case "smtpMailFrom":
    case "smtpRcptTo":
    case "krb5Cname":
    case "krb5ServiceName":
    case "ftpCommand":
    case "smbShare":
    case "smbNamedPipe":
    case "smbDceRpcInterface":
    case "smbDceRpcStubData":
    case "dnp3Indicators":
    case "nfsFileName":
    case "fileMagic":
    case "fileExtension":
    case "dnp3Data":
      return renderRulePatternStringLikeBody(pattern);
    case "httpHeader":
      return `
        <div class="suri-rule-pattern-grid two-line">
          ${renderRulePatternTransformChain(pattern)}
          <div class="suri-rule-pattern-controls-row has-header-field">
            ${renderRulePatternHeaderFieldMenu(pattern)}
            ${renderRulePatternRelationMenu(pattern)}
            ${renderRulePatternTextInput(pattern)}
          </div>
        </div>
      `;
    case "httpRequestHeader":
    case "httpResponseHeader":
      return renderRulePatternStringLikeBody(pattern, {
        leadingControls: renderRulePatternFieldTextInput(
          pattern,
          "headerName",
          pattern.headerName,
          "Header Name",
          "is-compact",
        ),
      });
    case "httpLine":
      return renderRulePatternStringLikeBody(pattern, {
        leadingControls: renderRulePatternSelect(
          pattern.id,
          "lineScope",
          pattern.lineScope || "Request",
          RULE_PATTERN_HTTP_LINE_SCOPE_OPTIONS,
          "is-compact",
        ),
      });
    case "tlsCertIdentifier":
      return renderRulePatternStringLikeBody(pattern, {
        leadingControls: renderRulePatternSelect(
          pattern.id,
          "identifierField",
          pattern.identifierField || "Serial",
          RULE_PATTERN_TLS_IDENTIFIER_OPTIONS,
          "is-compact",
        ),
      });
    case "fileHash":
      return `
        <div class="suri-rule-pattern-grid two-line">
          <div class="suri-rule-pattern-controls-row has-header-field">
            ${renderRulePatternSelect(pattern.id, "hashAlgorithm", pattern.hashAlgorithm || "SHA-256", RULE_PATTERN_FILE_HASH_ALGORITHM_OPTIONS)}
            ${renderRulePatternRelationMenu(pattern)}
            ${renderRulePatternTextInput(pattern)}
          </div>
        </div>
      `;
    case "fileSize":
      return `
        <div class="suri-rule-pattern-controls-row has-compare">
          ${renderRulePatternSelect(pattern.id, "compareOperator", pattern.compareOperator, RULE_PATTERN_COMPARE_OPERATORS)}
          ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue)}
          ${renderRulePatternSelect(pattern.id, "sizeUnit", pattern.sizeUnit || "MB", ["bytes", "KB", "MB", "GB"])}
        </div>
      `;
    case "tlsVersion":
      return `
        <div class="suri-rule-pattern-controls-row">
          ${renderRulePatternSelect(pattern.id, "value", renderRulePatternFieldValue(pattern), ["TLS 1.0", "TLS 1.1", "TLS 1.2", "TLS 1.3"])}
        </div>
      `;
    case "ipProtocol":
      return `
        <div class="suri-rule-pattern-controls-row">
          ${renderRulePatternSelect(pattern.id, "value", renderRulePatternFieldValue(pattern), RULE_PATTERN_IP_PROTOCOL_OPTIONS)}
        </div>
      `;
    case "ipAddress":
    case "ipCountry":
      return renderRulePatternStringLikeBody(pattern, {
        leadingControls: renderRulePatternSelect(
          pattern.id,
          "scope",
          pattern.scope || "Source",
          RULE_PATTERN_IP_SCOPE_OPTIONS,
          "is-compact",
        ),
      });
    case "ipReputation":
      return `
        <div class="suri-rule-pattern-controls-row has-compare">
          ${renderRulePatternSelect(pattern.id, "scope", pattern.scope || "Source", RULE_PATTERN_IP_SCOPE_OPTIONS)}
          ${renderRulePatternSelect(pattern.id, "reputationType", pattern.reputationType || "Malware", ["Malware", "Phishing", "Scanner"])}
          ${renderRulePatternSelect(pattern.id, "compareOperator", pattern.compareOperator, RULE_PATTERN_COMPARE_OPERATORS)}
          ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue)}
        </div>
      `;
    case "dnp3Object":
      return `
        <div class="suri-rule-pattern-controls-row">
          ${renderRulePatternFieldTextInput(pattern, "objectGroup", pattern.objectGroup, "Enter Group number", "is-short")}
          <span class="suri-rule-pattern-inline-label">-</span>
          ${renderRulePatternFieldTextInput(pattern, "objectVariation", pattern.objectVariation, "Enter Variation number", "is-short")}
        </div>
      `;
    case "krb5MsgType":
    case "ftpDataCommand":
    case "modbusFunction":
    case "dnp3Function":
    case "ethernetIpCommand":
      return `
        <div class="suri-rule-pattern-controls-row">
          ${renderRulePatternSelect(pattern.id, "value", renderRulePatternFieldValue(pattern), getRulePatternEnumOptions(pattern.type))}
        </div>
      `;
    case "krb5ErrorCode":
      return `
        <div class="suri-rule-pattern-controls-row">
          ${renderRulePatternSelect(pattern.id, "value", renderRulePatternFieldValue(pattern), RULE_PATTERN_KRB_ERROR_OPTIONS)}
        </div>
      `;
    case "dnsOpcode":
    case "dnsRrtype":
    case "ipTtl":
    case "httpStatusCode":
    case "httpUriLength":
    case "tlsCertChainLength":
    case "smbDceRpcOpnum":
      return renderRulePatternNumberCompareBody(pattern);
    case "byteTest":
      return `
        <div class="suri-rule-pattern-grid two-line">
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">Read</span>
            ${renderRulePatternNumberInput(pattern.id, "byteCount", pattern.byteCount, "is-short")}
            <span class="suri-rule-pattern-inline-label">bytes and compare</span>
            ${renderRulePatternSelect(pattern.id, "compareOperator", pattern.compareOperator, RULE_PATTERN_COMPARE_OPERATORS, "is-compact")}
            ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue, "is-compact")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">at offset</span>
            ${renderRulePatternNumberInput(pattern.id, "offset", pattern.offset, "is-short")}
          </div>
        </div>
      `;
    case "byteJump":
      return `
        <div class="suri-rule-pattern-grid two-line">
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">Read</span>
            ${renderRulePatternNumberInput(pattern.id, "byteCount", pattern.byteCount, "is-short")}
            <span class="suri-rule-pattern-inline-label">bytes at offset</span>
            ${renderRulePatternNumberInput(pattern.id, "offset", pattern.offset, "is-short")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">interpret as</span>
            ${renderRulePatternSelect(pattern.id, "numberType", pattern.numberType, RULE_PATTERN_NUMBER_TYPE_OPTIONS, "is-compact")}
          </div>
        </div>
      `;
    case "byteExtract":
      return `
        <div class="suri-rule-pattern-grid three-line">
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">Read</span>
            ${renderRulePatternNumberInput(pattern.id, "byteCount", pattern.byteCount, "is-short")}
            <span class="suri-rule-pattern-inline-label">bytes at offset</span>
            ${renderRulePatternNumberInput(pattern.id, "offset", pattern.offset, "is-short")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">and store result as</span>
            ${renderRulePatternFieldTextInput(pattern, "variableName", pattern.variableName, "var_name")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">and interpret as</span>
            ${renderRulePatternSelect(pattern.id, "numberType", pattern.numberType, RULE_PATTERN_NUMBER_TYPE_OPTIONS, "is-compact")}
          </div>
        </div>
      `;
    case "byteMath":
      return `
        <div class="suri-rule-pattern-grid three-line">
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">Read</span>
            ${renderRulePatternNumberInput(pattern.id, "byteCount", pattern.byteCount, "is-short")}
            <span class="suri-rule-pattern-inline-label">bytes at offset</span>
            ${renderRulePatternNumberInput(pattern.id, "offset", pattern.offset, "is-short")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">perform</span>
            ${renderRulePatternSelect(pattern.id, "mathOperator", pattern.mathOperator, RULE_PATTERN_MATH_OPERATORS, "is-compact")}
            ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue, "is-compact")}
            <span class="suri-rule-pattern-inline-label">and store as</span>
            ${renderRulePatternFieldTextInput(pattern, "resultVar", pattern.resultVar, "result_var")}
          </div>
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">interpret as</span>
            ${renderRulePatternSelect(pattern.id, "numberType", pattern.numberType, RULE_PATTERN_NUMBER_TYPE_OPTIONS, "is-compact")}
          </div>
        </div>
      `;
    case "isDataAt":
      return `
        <div class="suri-rule-pattern-inline-row">
          <span class="suri-rule-pattern-inline-label">Offset</span>
          ${renderRulePatternNumberInput(pattern.id, "numericValue", pattern.numericValue, "is-short")}
        </div>
      `;
    case "entropy":
      return `
        <div class="suri-rule-pattern-inline-row">
          ${renderRulePatternSelect(pattern.id, "compareOperator", pattern.compareOperator, RULE_PATTERN_COMPARE_OPERATORS, "is-compact")}
          ${renderRulePatternFieldTextInput(pattern, "numericValue", pattern.numericValue, "7.0")}
        </div>
      `;
    case "base64Decode":
      return `
        <div class="suri-rule-pattern-grid two-line">
          <div class="suri-rule-pattern-inline-row">
            <span class="suri-rule-pattern-inline-label">Search</span>
            ${renderRulePatternNumberInput(pattern.id, "byteCount", pattern.byteCount, "is-short")}
            <span class="suri-rule-pattern-inline-label">from offset</span>
            ${renderRulePatternNumberInput(pattern.id, "offset", pattern.offset, "is-short")}
          </div>
          <div class="suri-rule-pattern-flags">
            ${renderRulePatternFlagToggle(pattern, { key: "relative", label: "Relative" })}
            ${renderRulePatternFlagToggle(pattern, { key: "rfc2045", label: "RFC2045 (ignore whitespace)" })}
            ${renderRulePatternFlagToggle(pattern, { key: "rfc4648", label: "RFC4648 (strict)" })}
          </div>
        </div>
      `;
    default:
      return renderRulePatternStringLikeBody(pattern);
  }
}

function renderRulePatternFlagToggle(pattern, flag) {
  if (flag.key === "regionEnabled" || flag.key === "transformEnabled") {
    const disabledAttrs = editMode ? "" : ' disabled aria-disabled="true"';
    const clickHandler = editMode
      ? ` onclick="toggleRulePatternFlag(event, '${escapeJsSingleQuoted(pattern.id)}', '${flag.key}')"`
      : "";
    const stateClass = Boolean(pattern[flag.key]) ? " is-on" : "";
    const disabledClass = editMode ? "" : " is-disabled";
    return `
      <div class="suri-rule-pattern-flag-row is-toggle">
        <span>${escapeHtml(flag.label)}</span>
        <button
          type="button"
          class="suri-toggle${stateClass}${disabledClass}"
          ${disabledAttrs}${clickHandler}
        >
          <span class="suri-toggle-thumb"></span>
        </button>
      </div>
    `;
  }
  const isActive = Boolean(pattern[flag.key]);
  const disabledAttrs = editMode ? "" : ' disabled aria-disabled="true"';
  const clickHandler = editMode
    ? ` onclick="toggleRulePatternFlag(event, '${escapeJsSingleQuoted(pattern.id)}', '${flag.key}')"`
    : "";
  return `
    <button
      type="button"
      class="suri-rule-pattern-flag${isActive ? " is-active" : ""}"
      ${disabledAttrs}${clickHandler}
    >
      ${renderSuricataSubnetCheckbox(isActive, "include")}
      <span>${escapeHtml(flag.label)}</span>
    </button>
  `;
}

function renderRulePatternFlags(pattern) {
  const flags = getRulePatternFlagOptions(pattern.type);
  const rightSideFlags = flags.filter((flag) =>
    flag.key === "regionEnabled" || flag.key === "transformEnabled"
  );
  const leftSideFlags = flags.filter((flag) =>
    flag.key !== "regionEnabled" && flag.key !== "transformEnabled"
  );
  if (!leftSideFlags.length && !rightSideFlags.length) return "";
  return `
    <div class="suri-rule-pattern-flags-stack">
      <div class="suri-rule-pattern-flags">
        <div class="suri-rule-pattern-flags-group">
          ${leftSideFlags.map((flag) => renderRulePatternFlagToggle(pattern, flag)).join("")}
        </div>
        <div class="suri-rule-pattern-flags-right">
          ${rightSideFlags.map((flag) => renderRulePatternFlagToggle(pattern, flag)).join("")}
        </div>
      </div>
      ${renderRulePatternRegionRow(pattern)}
    </div>
  `;
}

function renderTeletextToken(text) {
  return `<span class="teletext">${escapeHtml(text)}</span>`;
}

function renderTeletextList(tokens) {
  const visibleTokens = (Array.isArray(tokens) ? tokens : [])
    .map((token) => String(token ?? "").trim())
    .filter(Boolean);
  if (!visibleTokens.length) return "";
  return `<span class="teletext-list">${visibleTokens.map((token) => renderTeletextToken(token)).join("")}</span>`;
}

function getRulePatternActiveFlags(pattern) {
  return getRulePatternFlagOptions(pattern.type)
    .filter((flag) => Boolean(pattern[flag.key]))
    .map((flag) => flag.label);
}

function formatRulePatternReadonlyRelationText(pattern) {
  return String(formatRulePatternRelationLabel(pattern, pattern.relation) || "")
    .trim()
    .toLowerCase();
}

function formatRulePatternReadonlyHeaderField(pattern) {
  return String(pattern.headerField || "User-Agent")
    .trim()
    .toLowerCase();
}

function formatRulePatternReadonlyContextText(pattern) {
  switch (pattern.type) {
    case "httpRequestHeader":
    case "httpResponseHeader":
      return String(pattern.headerName || "header_name").trim().toLowerCase();
    case "httpLine":
      return String(pattern.lineScope || "Request").trim().toLowerCase();
    case "tlsCertIdentifier":
      return String(pattern.identifierField || "Serial").trim().toLowerCase();
    case "ipAddress":
    case "ipCountry":
    case "ipReputation":
      return String(pattern.scope || "Source").trim().toLowerCase();
    case "fileHash":
      return String(pattern.hashAlgorithm || "SHA-256").trim().toLowerCase();
    case "fileSize":
      return String(pattern.sizeUnit || "MB").trim().toLowerCase();
    case "dnp3Object":
      return `${String(pattern.objectGroup || "15").trim()} · ${String(pattern.objectVariation || "18").trim()}`;
    default:
      return "";
  }
}

function getRulePatternReadonlyFlagTokens(pattern) {
  const tokens = [];
  if (pattern.ignoreCase) tokens.push("nocase");
  if (pattern.fastPattern) tokens.push("fast_pattern");
  if (pattern.multiline) tokens.push("multiline");
  if (pattern.dotall) tokens.push("dotall");
  if (pattern.rawBytes) tokens.push("raw bytes");
  if (pattern.relative) tokens.push("relative");
  if (pattern.negate) tokens.push("negated");
  return tokens;
}

function getRulePatternReadonlyRegionTokens(pattern) {
  if (!isRulePatternRegionEligible(pattern.type) || !pattern.regionEnabled)
    return [];
  return [
    `region ${pattern.regionBytes} bytes`,
    `offset ${pattern.regionOffset}`,
    pattern.regionRelative ? "relative" : "absolute",
  ];
}

function getRulePatternReadonlyTransformTokens(pattern) {
  if (!isRulePatternTransformEligible(pattern.type) || !pattern.transformEnabled)
    return [];
  return (Array.isArray(pattern.transforms) ? pattern.transforms : [])
    .map((transform) => {
      const label = getRulePatternTransformLabel(transform?.kind);
      if (!transform?.kind || label === "Select Transform...") return "";
      const arg = getRulePatternTransformArgValue(transform);
      return arg ? `${label}: ${arg}` : label;
    })
    .filter(Boolean);
}

function getRulePatternReadonlyBaseTokens(pattern) {
  switch (pattern.type) {
    case "ipReputation":
      return [
        pattern.reputationType || "Malware",
        pattern.compareOperator,
        pattern.numericValue,
      ];
    case "dnp3Object":
      return [
        `group ${pattern.objectGroup || "15"}`,
        `variation ${pattern.objectVariation || "18"}`,
      ];
    case "fileSize":
      return [pattern.compareOperator, pattern.numericValue, pattern.sizeUnit || "MB"];
    default:
      break;
  }

  const kind = getRulePatternKind(pattern.type);
  switch (kind) {
    case "numberCompare":
      return [pattern.compareOperator, pattern.numericValue];
    case "enumOption":
    case "enumNumber":
      return [renderRulePatternFieldValue(pattern) || "—"];
    case "byteTest":
      return [
        `${pattern.byteCount} bytes`,
        pattern.compareOperator,
        pattern.numericValue,
        `offset ${pattern.offset}`,
        pattern.endian,
        pattern.numberType,
      ];
    case "byteJump":
      return [
        `${pattern.byteCount} bytes`,
        `offset ${pattern.offset}`,
        pattern.endian,
        pattern.numberType,
      ];
    case "byteExtract":
      return [
        `${pattern.byteCount} bytes`,
        `offset ${pattern.offset}`,
        pattern.variableName || "var_name",
        pattern.endian,
        pattern.numberType,
      ];
    case "byteMath":
      return [
        `${pattern.byteCount} bytes`,
        `offset ${pattern.offset}`,
        pattern.mathOperator,
        pattern.numericValue,
        pattern.resultVar || "result_var",
        pattern.endian,
        pattern.numberType,
      ];
    case "isDataAt":
      return [pattern.numericValue];
    case "entropy":
      return [pattern.compareOperator, pattern.numericValue];
    case "base64Decode":
      return [`${pattern.byteCount} bytes`, `offset ${pattern.offset}`];
    default:
      return [pattern.value || "—"];
  }
}

function getRulePatternReadonlyValueTokens(pattern) {
  return [
    ...getRulePatternReadonlyBaseTokens(pattern),
    ...getRulePatternReadonlyTransformTokens(pattern),
    ...getRulePatternReadonlyRegionTokens(pattern),
    ...getRulePatternReadonlyFlagTokens(pattern),
  ];
}

function renderRulePatternReadonlySentence(pattern, index) {
  const headerPrefix =
    index > 0 ? '<span class="suri-rule-pattern-prefix">then</span>' : "";
  const excludeSuffix = pattern.exclude && !pattern.transformEnabled
    ? '<span class="suri-rule-pattern-exclude">does not</span>'
    : "";
  const relationText = formatRulePatternReadonlyRelationText(pattern);
  const headerFieldText =
    pattern.type === "httpHeader"
      ? `<span class="suri-rule-pattern-readonly-tertiary">${escapeHtml(formatRulePatternReadonlyHeaderField(pattern))}</span>`
      : "";
  const contextText = formatRulePatternReadonlyContextText(pattern);
  const valueTokens = renderTeletextList(getRulePatternReadonlyValueTokens(pattern));
  return `
    <div class="suri-rule-pattern-item is-readonly-layout" data-rule-pattern-id="${escapeHtml(pattern.id)}">
      <div class="suri-rule-pattern-sentence suri-rule-pattern-readonly-row">
        <span class="suri-rule-pattern-readonly-copy">
          ${headerPrefix}
          <span class="suri-rule-pattern-title">${escapeHtml(getRulePatternLabel(pattern.type))}</span>
          ${headerFieldText}
          ${contextText ? `<span class="suri-rule-pattern-readonly-tertiary">${escapeHtml(contextText)}</span>` : ""}
          ${excludeSuffix}
          ${relationText ? `<span class="suri-rule-pattern-readonly-tertiary">${escapeHtml(relationText)}</span>` : ""}
        </span>
        <span class="suri-rule-pattern-readonly-values">
          ${valueTokens}
        </span>
      </div>
    </div>
  `;
}

function renderRulePatternItem(pattern, index) {
  if (!editMode) {
    return renderRulePatternReadonlySentence(pattern, index);
  }
  const headerPrefix =
    index > 0 ? '<span class="suri-rule-pattern-prefix">then</span>' : "";
  const excludeSuffix = pattern.exclude && !pattern.transformEnabled
    ? '<span class="suri-rule-pattern-exclude">does not</span>'
    : "";
  const grabSlot = editMode
    ? `
      <div class="suri-rule-pattern-grab-slot">
        <button
          type="button"
          class="btn-reset suri-rule-pattern-grab"
          aria-label="Reorder pattern"
          onpointerdown="armRulePatternDrag(event, '${escapeJsSingleQuoted(pattern.id)}')"
          onpointerup="disarmRulePatternDrag()"
          onpointercancel="disarmRulePatternDrag()"
          onclick="event.preventDefault(); event.stopPropagation();"
        >
          <img src="${SURI_ICON_GRAB_HANDLE_SRC}" alt="" aria-hidden="true" />
        </button>
      </div>
    `
    : "";
  const removeButton = editMode
    ? `
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-default suri-rule-pattern-remove"
        onclick="removeRulePattern(event, '${escapeJsSingleQuoted(pattern.id)}')"
      >
        Remove
      </button>
    `
    : "";
  return `
    <div
      class="suri-rule-pattern-item${editMode ? "" : " is-readonly-layout"}"
      data-rule-pattern-id="${escapeHtml(pattern.id)}"
      ${editMode ? 'draggable="true"' : ""}
      ondragstart="onRulePatternDragStart(event, '${escapeJsSingleQuoted(pattern.id)}')"
      ondragend="onRulePatternDragEnd(event)"
      ondragover="onRulePatternDragOver(event, '${escapeJsSingleQuoted(pattern.id)}')"
      ondrop="onRulePatternDrop(event, '${escapeJsSingleQuoted(pattern.id)}')"
      onpointerenter="onRulePatternPointerEnter(event, '${escapeJsSingleQuoted(pattern.id)}')"
    >
      ${grabSlot}
      <div class="suri-rule-pattern-body">
        <div class="suri-rule-pattern-header-row">
          <div class="suri-rule-pattern-heading">
            ${headerPrefix}
            <span class="suri-rule-pattern-title">${escapeHtml(getRulePatternLabel(pattern.type))}</span>
            ${renderRulePatternInfo(pattern.type)}
            ${excludeSuffix}
          </div>
          ${removeButton}
        </div>
        ${renderRulePatternControlBody(pattern)}
        ${renderRulePatternFlags(pattern)}
      </div>
    </div>
  `;
}

function renderRulePatternsAddControl() {
  const menuKey = getRulePatternAddMenuKey();
  const isOpen = suricataOpenMenuKey === menuKey;
  const filteredOptions = RULE_PATTERN_TYPE_OPTIONS.filter((option) => {
    const haystack = `${option.group} ${option.label}`.toLowerCase();
    return haystack.includes(String(suricataRulePatternAddSearch || "").trim().toLowerCase());
  });
  return `
    <div class="suri-menu suri-rule-pattern-add-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger suri-rule-pattern-add-button"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label">Add Pattern</span>
        </span>
      </button>
      <div class="menu-list suri-rule-pattern-add-panel" role="listbox" onclick="event.stopPropagation()">
        <div class="suri-rule-pattern-add-search">
          <input
            type="text"
            value="${escapeHtml(suricataRulePatternAddSearch)}"
            placeholder="Search..."
            oninput="setRulePatternAddSearch(this.value)"
            onclick="event.stopPropagation()"
          />
        </div>
        <div class="suri-subnet-divider" aria-hidden="true"></div>
        <div class="suri-rule-pattern-add-results">
        ${filteredOptions.map(
          (option) => `
          <button
            type="button"
            class="menu-item suri-menu-option${option.enabled ? "" : " is-disabled"}"
            ${option.enabled ? `onclick="addRulePattern(event, '${escapeJsSingleQuoted(option.type)}')"` : 'disabled aria-disabled="true"'}
          >
            <span class="suri-rule-pattern-option-text">
              <span class="suri-rule-pattern-option-group">${escapeHtml(option.group)}</span>
              <span class="suri-rule-pattern-option-separator" aria-hidden="true">⋅</span>
              <span class="suri-rule-pattern-option-label">${escapeHtml(option.label)}</span>
            </span>
          </button>
        `,
        ).join("") || '<div class="suri-rule-pattern-empty">No patterns found.</div>'}
        </div>
      </div>
    </div>
  `;
}

function renderRulePatternsBody(state) {
  const patterns = ensureRulePatterns(state);
  return `
    <div class="suri-rule-pattern-list">
      ${
        patterns.length
          ? patterns
              .map((pattern, index) => renderRulePatternItem(pattern, index))
              .join("")
          : '<div class="suri-rule-pattern-empty">No patterns configured.</div>'
      }
    </div>
  `;
}

function getRulePatternById(state, patternId) {
  const patterns = ensureRulePatterns(state);
  return patterns.find((pattern) => pattern.id === patternId) || null;
}

function updateRulePatternState(mutator) {
  if (!editMode || drawerVariant !== "suricata" || !suricataDrawerDraft) return;
  ensureRulePatterns(suricataDrawerDraft);
  mutator(suricataDrawerDraft.rulePatterns);
  syncLegacyRulePatternFields(suricataDrawerDraft);
  renderSuricataDrawerContent();
}

function rerenderDrawerPreservingMenuScroll(menuKey, callback) {
  const menu = document.querySelector(`.suri-menu[data-menu-key="${menuKey}"]`);
  const list = menu?.querySelector(
    ".suri-subnet-project-list, .suri-scope-suggestion-list, .suri-rule-pattern-add-results",
  );
  const savedScrollTop = list?.scrollTop ?? null;

  renderSuricataDrawerContent();

  requestAnimationFrame(() => {
    if (typeof savedScrollTop === "number") {
      const nextMenu = document.querySelector(
        `.suri-menu[data-menu-key="${menuKey}"]`,
      );
      const nextList = nextMenu?.querySelector(
        ".suri-subnet-project-list, .suri-scope-suggestion-list, .suri-rule-pattern-add-results",
      );
      if (nextList) nextList.scrollTop = savedScrollTop;
    }
    callback?.();
  });
}

function setRulePatternAddSearch(value) {
  suricataRulePatternAddSearch = String(value ?? "");
  rerenderDrawerPreservingMenuScroll(getRulePatternAddMenuKey(), () => {
    const input = document.querySelector(".suri-rule-pattern-add-search input");
    if (!input) return;
    const position = suricataRulePatternAddSearch.length;
    focusTextFieldWithoutScroll(input, position);
  });
}

function focusRulePatternInput(patternId) {
  requestAnimationFrame(() => {
    const input = document.querySelector(
      `[data-rule-pattern-input="${patternId}"]`,
    );
    if (!input) return;
    const position = input.value.length;
    focusTextFieldWithoutScroll(input, position);
  });
}

function addRulePattern(event, type = "content") {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "suricata" || !suricataDrawerDraft) return;
  if (!isRulePatternTypeEnabled(type)) return;
  const nextPattern = createEmptyRulePattern(type);
  ensureRulePatterns(suricataDrawerDraft);
  suricataDrawerDraft.rulePatterns.push(nextPattern);
  syncLegacyRulePatternFields(suricataDrawerDraft);
  suricataOpenMenuKey = null;
  suricataRulePatternAddSearch = "";
  renderSuricataDrawerContent();
  focusRulePatternInput(nextPattern.id);
}

function removeRulePattern(event, patternId) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const nextPatterns = patterns.filter((pattern) => pattern.id !== patternId);
    suricataDrawerDraft.rulePatterns = nextPatterns.length
      ? nextPatterns
      : [createEmptyRulePattern("content")];
  });
}

function updateRulePatternValue(patternId, value) {
  if (!editMode || drawerVariant !== "suricata" || !suricataDrawerDraft) return;
  ensureRulePatterns(suricataDrawerDraft);
  const pattern = getRulePatternById(suricataDrawerDraft, patternId);
  if (!pattern) return;
  pattern.value = value;
  syncLegacyRulePatternFields(suricataDrawerDraft);
}

function updateRulePatternField(eventOrPatternId, patternIdOrField, fieldOrValue, maybeValue, maybeMenuKey) {
  let patternId = eventOrPatternId;
  let field = patternIdOrField;
  let value = fieldOrValue;
  let menuKey = maybeValue;
  if (typeof eventOrPatternId !== "string") {
    eventOrPatternId?.preventDefault?.();
    eventOrPatternId?.stopPropagation?.();
    patternId = patternIdOrField;
    field = fieldOrValue;
    value = maybeValue;
    menuKey = maybeMenuKey;
  }
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern) return;
    pattern[field] = value;
    if (field === "value") {
      pattern.enumValue = value;
    }
    if (typeof menuKey === "string") {
      suricataOpenMenuKey = null;
    }
  });
}

function addRulePatternTransform(event, patternId) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern || !Array.isArray(pattern.transforms)) return;
    pattern.transforms.push({ kind: "", args: {} });
  });
}

function selectRulePatternTransform(event, patternId, index, kind, menuKey) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern || !Array.isArray(pattern.transforms) || !pattern.transforms[index]) return;
    const meta = getRulePatternTransformMeta(kind);
    if (!meta) return;
    pattern.transforms[index] = {
      kind,
      args: meta.requiresArg ? { [meta.argField]: "" } : {},
    };
    suricataOpenMenuKey = null;
  });
}

function removeRulePatternTransform(event, patternId, index, menuKey) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern || !Array.isArray(pattern.transforms)) return;
    pattern.transforms.splice(index, 1);
    if (!pattern.transforms.length) {
      pattern.transforms = [{ kind: "", args: {} }];
    }
    suricataOpenMenuKey = null;
  });
}

function updateRulePatternTransformArg(patternId, index, value) {
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    const transform = pattern?.transforms?.[index];
    const meta = getRulePatternTransformMeta(transform?.kind);
    if (!transform || !meta?.requiresArg) return;
    transform.args = {
      ...(transform.args || {}),
      [meta.argField]: value,
    };
  });
}

function toggleRulePatternFlag(event, patternId, flagKey) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern) return;
    pattern[flagKey] = !pattern[flagKey];
    if (flagKey === "transformEnabled") {
      if (pattern.transformEnabled) {
        if (!Array.isArray(pattern.transforms) || !pattern.transforms.length) {
          pattern.transforms = [{ kind: "", args: {} }];
        }
      }
    }
    if (flagKey === "regionEnabled" && !pattern.regionEnabled) {
      pattern.regionBytes = 0;
      pattern.regionOffset = 0;
    }
  });
}

function toggleRulePatternExclude(event, patternId) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern) return;
    pattern.exclude = !pattern.exclude;
    suricataOpenMenuKey = getRulePatternMenuKey(patternId);
  });
}

function selectRulePatternHeaderField(event, patternId, headerField) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern || pattern.type !== "httpHeader") return;
    if (!getRulePatternHeaderFieldOptions(pattern.type).includes(headerField)) {
      return;
    }
    pattern.headerField = headerField;
    suricataOpenMenuKey = null;
  });
}

function selectRulePatternRelation(event, patternId, relation) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  updateRulePatternState((patterns) => {
    const pattern = patterns.find((item) => item.id === patternId);
    if (!pattern) return;
    if (getRulePatternRelationOptions(pattern.type).includes(relation)) {
      pattern.relation = relation;
    }
    suricataOpenMenuKey = null;
  });
}

function clearRulePatternDropTargets() {
  document
    .querySelectorAll(
      ".suri-rule-pattern-item.is-drop-target, .suri-rule-pattern-item.is-dragging",
    )
    .forEach((item) => item.classList.remove("is-drop-target", "is-dragging"));
}

function armRulePatternDrag(event, patternId) {
  if (!editMode || drawerVariant !== "suricata") return;
  event?.preventDefault?.();
  event?.stopPropagation?.();
  draggedRulePatternId = patternId;
  armedRulePatternDragId = patternId;
  rulePatternPointerDragActive = true;
  clearRulePatternDropTargets();
  requestAnimationFrame(() => {
    const item = document.querySelector(
      `[data-rule-pattern-id="${patternId}"]`,
    );
    item?.classList.add("is-dragging");
  });
}

function disarmRulePatternDrag() {
  armedRulePatternDragId = null;
}

function finishRulePatternPointerDrag() {
  rulePatternPointerDragActive = false;
  draggedRulePatternId = null;
  armedRulePatternDragId = null;
  clearRulePatternDropTargets();
}

function moveRulePattern(sourcePatternId, targetPatternId) {
  if (
    !editMode ||
    drawerVariant !== "suricata" ||
    !suricataDrawerDraft ||
    !sourcePatternId ||
    !targetPatternId ||
    sourcePatternId === targetPatternId
  ) {
    return false;
  }
  ensureRulePatterns(suricataDrawerDraft);
  const nextPatterns = [...suricataDrawerDraft.rulePatterns];
  const sourceIndex = nextPatterns.findIndex(
    (pattern) => pattern.id === sourcePatternId,
  );
  const targetIndex = nextPatterns.findIndex(
    (pattern) => pattern.id === targetPatternId,
  );
  if (sourceIndex === -1 || targetIndex === -1) return false;
  const [movedPattern] = nextPatterns.splice(sourceIndex, 1);
  nextPatterns.splice(targetIndex, 0, movedPattern);
  suricataDrawerDraft.rulePatterns = nextPatterns;
  syncLegacyRulePatternFields(suricataDrawerDraft);
  renderSuricataDrawerContent();
  if (rulePatternPointerDragActive) {
    requestAnimationFrame(() => {
      const item = document.querySelector(
        `[data-rule-pattern-id="${sourcePatternId}"]`,
      );
      item?.classList.add("is-dragging");
    });
  }
  return true;
}

function onRulePatternDragStart(event, patternId) {
  if (!editMode || drawerVariant !== "suricata") return;
  if (armedRulePatternDragId !== patternId) {
    event?.preventDefault?.();
    return false;
  }
  draggedRulePatternId = patternId;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", patternId);
  clearRulePatternDropTargets();
  requestAnimationFrame(() => {
    const item = document.querySelector(
      `[data-rule-pattern-id="${patternId}"]`,
    );
    item?.classList.add("is-dragging");
  });
}

function onRulePatternDragOver(event, patternId) {
  if (
    !editMode ||
    !draggedRulePatternId ||
    draggedRulePatternId === patternId
  ) {
    return;
  }
  event.preventDefault();
  clearRulePatternDropTargets();
  const item = document.querySelector(`[data-rule-pattern-id="${patternId}"]`);
  item?.classList.add("is-drop-target");
}

function onRulePatternPointerEnter(event, patternId) {
  if (
    !rulePatternPointerDragActive ||
    !draggedRulePatternId ||
    draggedRulePatternId === patternId
  ) {
    return;
  }
  event?.preventDefault?.();
  clearRulePatternDropTargets();
  moveRulePattern(draggedRulePatternId, patternId);
}

function onRulePatternDrop(event, patternId) {
  if (!editMode || !draggedRulePatternId || !suricataDrawerDraft) return;
  event.preventDefault();
  event.stopPropagation();
  moveRulePattern(draggedRulePatternId, patternId);
  draggedRulePatternId = null;
  armedRulePatternDragId = null;
  clearRulePatternDropTargets();
}

function onRulePatternDragEnd() {
  finishRulePatternPointerDrag();
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerup", finishRulePatternPointerDrag);
  window.addEventListener("pointercancel", finishRulePatternPointerDrag);
}

function formatSelectionTokenList(tokens, fallback = "any") {
  const values = Array.isArray(tokens) ? tokens.filter(Boolean) : [];
  return values.length ? values.join(", ") : fallback;
}

function formatRulePatternRelationSuffix(pattern) {
  if (pattern.relation === "Starts With") return " startswith;";
  if (pattern.relation === "Ends With") return " endswith;";
  if (pattern.relation === "Is exactly") return " startswith; endswith;";
  return "";
}

function serializeRulePatternTransforms(pattern) {
  if (!pattern.transformEnabled || !Array.isArray(pattern.transforms)) return [];
  return pattern.transforms
    .filter((transform) => String(transform?.kind || "").trim())
    .map((transform) => {
      const meta = getRulePatternTransformMeta(transform.kind);
      if (!meta) return "";
      if (!meta.requiresArg) return meta.kind;
      const argValue = getRulePatternTransformArgValue(transform).trim();
      return argValue ? `${meta.kind}:"${argValue}"` : "";
    })
    .filter(Boolean);
}

function formatRulePatternRegionSuffix(pattern, index, rawValue = "") {
  if (!pattern.regionEnabled || Number(pattern.regionBytes) <= 0) return "";
  const offset = Number(pattern.regionOffset) || 0;
  const bytes = Number(pattern.regionBytes) || 0;
  if (index > 0 && pattern.regionRelative !== false) {
    return ` distance:${offset}; within:${bytes};`;
  }
  return ` offset:${offset}; depth:${bytes};`;
}

function getRulePatternBufferKeyword(pattern) {
  switch (pattern.type) {
    case "httpHeader":
      return RULE_PATTERN_HTTP_HEADER_BUFFER_MAP[pattern.headerField] || "http.header";
    case "httpMethod":
      return "http.method";
    case "httpUri":
      return "http.uri";
    case "httpHost":
      return "http.host";
    case "httpCookie":
      return "http.cookie";
    case "httpUserAgent":
      return "http.user_agent";
    case "httpRequestHeader":
      return "http.request_header";
    case "httpRequestBody":
      return "http.request_body";
    case "httpStatusMessage":
      return "http.status_msg";
    case "httpResponseHeader":
      return "http.response_header";
    case "httpResponseBody":
      return "http.response_body";
    case "httpStart":
      return "http.start";
    case "httpLine":
      return "http.line";
    case "httpProtocol":
      return "http.protocol";
    case "httpHeaderNames":
      return "http.header_names";
    case "httpContentType":
      return "http.content_type";
    case "httpConnection":
      return "http.connection";
    case "httpAccept":
      return "http.accept";
    case "httpAcceptLanguage":
      return "http.accept_language";
    case "httpReferer":
      return "http.referer";
    case "httpResponseLine":
      return "http.response_line";
    case "httpRequestMethod":
      return "http.request_method";
    case "httpResponseHeaderName":
      return "http.response_header_name";
    case "tlsSni":
      return "tls.sni";
    case "tlsCertSubject":
      return "tls.cert_subject";
    case "tlsCertIssuer":
      return "tls.cert_issuer";
    case "tlsCertIdentifier":
      return `tls.cert_${String(pattern.identifierField || "serial").toLowerCase()}`;
    case "tlsCert":
      return "tls.cert";
    case "tlsRandom":
      return "tls.random";
    case "tlsJa3":
      return "tls.ja3";
    case "tlsJa3s":
      return "tls.ja3s";
    case "fileName":
    case "nfsFileName":
      return "file.name";
    case "fileData":
      return "file.data";
    case "fileMagic":
      return "file.magic";
    case "fileHash":
      return "file.hash";
    case "sshSoftware":
      return "ssh.software";
    case "sshHassh":
      return "ssh.hassh";
    case "sshHasshServer":
      return "ssh.hassh_server";
    case "sshHasshString":
      return "ssh.hassh_string";
    case "sshHasshServerString":
      return "ssh.hassh_server_string";
    case "dnsQuery":
      return "dns.query";
    case "smtpHelo":
      return "smtp.helo";
    case "smtpMailFrom":
      return "smtp.mail_from";
    case "smtpRcptTo":
      return "smtp.rcpt_to";
    case "krb5Cname":
      return "krb5_cname";
    case "krb5ServiceName":
      return "krb5_service_name";
    case "smbShare":
      return "smb.share";
    case "smbNamedPipe":
      return "smb.named_pipe";
    case "smbDceRpcInterface":
      return "smb.dcerpc.iface";
    case "smbDceRpcStubData":
      return "smb.dcerpc.stub_data";
    case "ipAddress":
      return "ip.addr";
    case "ipCountry":
      return "ip.country";
    case "ftpCommand":
      return "ftp.command";
    case "dnp3Indicators":
      return "dnp3.indicators";
    case "dnp3Object":
      return "dnp3.object";
    case "dnp3Data":
      return "dnp3.data";
    default:
      return "";
  }
}

function formatRulePatternContentClause(pattern, keyword, index = 0, value = pattern.value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  const negatedValue = pattern.exclude ? "!" : "";
  const relationSuffix = formatRulePatternRelationSuffix(pattern);
  const nocaseSuffix = pattern.ignoreCase ? " nocase;" : "";
  const fastPatternSuffix = pattern.fastPattern ? " fast_pattern;" : "";
  const transformPrefix = serializeRulePatternTransforms(pattern)
    .map((transform) => `  ${transform};`)
    .join("\n");
  const regionSuffix = formatRulePatternRegionSuffix(pattern, index, rawValue);
  const bufferLine = keyword ? `  ${keyword};\n` : "";
  return `${bufferLine}${transformPrefix ? `${transformPrefix}\n` : ""}  content:${negatedValue}"${rawValue}";${relationSuffix}${nocaseSuffix}${fastPatternSuffix}${pattern.rawBytes ? " rawbytes;" : ""}${regionSuffix}`;
}

function serializeRulePattern(pattern, index = 0) {
  const rawValue = String(pattern.value || "").trim();
  switch (pattern.type) {
    case "content": {
      const relationSuffix = formatRulePatternRelationSuffix(pattern);
      if (!rawValue) return "";
      const transforms = serializeRulePatternTransforms(pattern)
        .map((transform) => `  ${transform};`)
        .join("\n");
      const regionSuffix = formatRulePatternRegionSuffix(pattern, index, rawValue);
      return `${transforms ? `${transforms}\n` : ""}  content:${pattern.exclude ? "!" : ""}"${rawValue}";${relationSuffix}${pattern.ignoreCase ? " nocase;" : ""}${pattern.fastPattern ? " fast_pattern;" : ""}${pattern.rawBytes ? " rawbytes;" : ""}${regionSuffix}`;
    }
    case "regex": {
      if (!rawValue) return "";
      const modifiers = [
        pattern.ignoreCase ? "i" : "",
        pattern.multiline ? "m" : "",
        pattern.dotall ? "s" : "",
      ].join("");
      const normalizedPattern = /^\/.*\/[A-Za-z]*$/.test(rawValue)
        ? rawValue.replace(/\/[A-Za-z]*$/, `/${modifiers}`)
        : rawValue;
      const transforms = serializeRulePatternTransforms(pattern)
        .map((transform) => `  ${transform};`)
        .join("\n");
      const regionPrefix =
        pattern.regionEnabled && index > 0 && pattern.regionRelative !== false
          ? "R"
          : "";
      const normalizedRegex = /^\/.*\/[A-Za-z]*$/.test(normalizedPattern)
        ? normalizedPattern.replace(/\/([A-Za-z]*)$/, `/$1${regionPrefix}`)
        : normalizedPattern;
      return `${transforms ? `${transforms}\n` : ""}  pcre:${pattern.exclude ? "!" : ""}${normalizedRegex};`;
    }
    case "httpHeader":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "httpMethod":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "httpUri":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "httpHost":
    case "httpCookie":
    case "httpUserAgent":
    case "httpRequestHeader":
    case "httpRequestBody":
    case "httpStatusMessage":
    case "httpResponseHeader":
    case "httpResponseBody":
    case "httpLine":
    case "httpStart":
    case "httpProtocol":
    case "httpHeaderNames":
    case "httpContentType":
    case "httpConnection":
    case "httpAccept":
    case "httpAcceptLanguage":
    case "httpReferer":
    case "httpResponseLine":
    case "httpRequestMethod":
    case "httpResponseHeaderName":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "tlsSni":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "tlsCertSubject":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "tlsCertIssuer":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "tlsCertIdentifier":
    case "tlsCert":
    case "tlsRandom":
    case "tlsJa3":
    case "tlsJa3s":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "fileName":
    case "nfsFileName":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "fileData":
    case "fileMagic":
    case "fileHash":
    case "fileExtension":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "sshSoftware":
    case "sshHassh":
    case "sshHasshServer":
    case "sshHasshString":
    case "sshHasshServerString":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "sshProtocolVersion":
      return pattern.enumValue ? `  ssh.protoversion:${pattern.enumValue};` : "";
    case "dnsQuery":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "dnsOpcode":
    case "dnsRrtype":
    case "ipTtl":
      return pattern.numericValue
        ? `  ${getRulePatternKeyword(pattern.type)}:${pattern.compareOperator}${pattern.numericValue};`
        : "";
    case "smtpHelo":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "smtpMailFrom":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "smtpRcptTo":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "ipProtocol":
      return pattern.enumValue ? `  ip.proto:${String(pattern.enumValue).toLowerCase()};` : "";
    case "ipOpts":
      return pattern.enumValue ? `  ipopts:${pattern.enumValue};` : "";
    case "ipAddress":
    case "ipCountry":
    case "dnp3Data":
    case "dnp3Indicators":
    case "krb5ServiceName":
    case "smbDceRpcInterface":
    case "smbDceRpcStubData":
    case "ftpCommand":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "dnp3Object":
      return pattern.objectGroup || pattern.objectVariation
        ? `  dnp3.object:${pattern.objectGroup || "15"}.${pattern.objectVariation || "18"};`
        : "";
    case "ipReputation":
      return pattern.numericValue
        ? `  ip.rep:${pattern.compareOperator}${pattern.numericValue};`
        : "";
    case "krb5Cname":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "krb5MsgType":
      return pattern.enumValue ? `  krb5_msg_type:${pattern.enumValue};` : "";
    case "krb5ErrorCode":
      return pattern.enumValue ? `  krb5_error_code:${pattern.enumValue};` : "";
    case "smbShare":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "smbNamedPipe":
      return formatRulePatternContentClause(pattern, getRulePatternBufferKeyword(pattern), index);
    case "smbDceRpcOpnum":
      return pattern.numericValue
        ? `  smb.dcerpc.opnum:${pattern.compareOperator}${pattern.numericValue};`
        : "";
    case "nfsProcedure":
      return pattern.enumValue ? `  nfs_procedure:${pattern.enumValue};` : "";
    case "ftpDataCommand":
      return pattern.enumValue ? `  ftp.data_command:${pattern.enumValue};` : "";
    case "modbusFunction":
      return pattern.enumValue ? `  modbus.func:${pattern.enumValue};` : "";
    case "dnp3Function":
      return pattern.enumValue ? `  dnp3.func:${pattern.enumValue};` : "";
    case "ethernetIpCommand":
      return pattern.enumValue ? `  ethernetip.command:${pattern.enumValue};` : "";
    case "tlsVersion":
      return pattern.enumValue ? `  tls.version:${pattern.enumValue};` : "";
    case "fileSize":
      return pattern.numericValue
        ? `  file.size:${pattern.compareOperator}${pattern.numericValue}${pattern.sizeUnit ? `,${String(pattern.sizeUnit).toLowerCase()}` : ""};`
        : "";
    case "byteTest":
      return `  byte_test:${pattern.byteCount},${pattern.compareOperator},${pattern.numericValue},${pattern.offset}${pattern.relative ? ",relative" : ""},${pattern.endian},string,${pattern.numberType};`;
    case "byteJump":
      return `  byte_jump:${pattern.byteCount},${pattern.offset}${pattern.relative ? ",relative" : ""},${pattern.endian},string,${pattern.numberType};`;
    case "byteExtract":
      return `  byte_extract:${pattern.byteCount},${pattern.offset},${pattern.variableName || "var_name"}${pattern.relative ? ",relative" : ""},${pattern.endian},string,${pattern.numberType};`;
    case "byteMath":
      return `  byte_math:bytes ${pattern.byteCount}, offset ${pattern.offset}, oper ${pattern.mathOperator}, rvalue ${pattern.numericValue}, result ${pattern.resultVar || "result_var"}${pattern.relative ? ", relative" : ""}, endian ${pattern.endian}, string ${pattern.numberType};`;
    case "isDataAt":
      return pattern.numericValue
        ? `  isdataat:${pattern.negate ? "!" : ""}${pattern.numericValue}${pattern.relative ? ",relative" : ""};`
        : "";
    case "bufferSize":
    case "payloadSize":
      return pattern.numericValue
        ? `  ${getRulePatternKeyword(pattern.type)}:${pattern.compareOperator}${pattern.numericValue};`
        : "";
    case "entropy":
      return pattern.numericValue
        ? `  entropy: value ${pattern.compareOperator}${pattern.numericValue};`
        : "";
    case "base64Decode":
      return `  base64_decode:bytes ${pattern.byteCount}, offset ${pattern.offset}${pattern.relative ? ", relative" : ""};\n  base64_data;`;
    default:
      return "";
  }
}

function buildSuricataDerivedConfig(state) {
  const patterns = ensureRulePatterns(state);
  const srcSubnets = getScopeAppliedEntries(
    getScopeSelection(state, "sourceSubnets", "subnet"),
  )
    .map((entry) => `${entry.mode === "exclude" ? "!" : ""}${entry.value}`)
    .join(", ");
  const srcPorts = getScopeAppliedEntries(
    getScopeSelection(state, "sourcePorts", "port"),
  )
    .map((entry) => `${entry.mode === "exclude" ? "!" : ""}${entry.value}`)
    .join(", ");
  const dstSubnets = getScopeAppliedEntries(
    getScopeSelection(state, "destinationSubnets", "subnet"),
  )
    .map((entry) => `${entry.mode === "exclude" ? "!" : ""}${entry.value}`)
    .join(", ");
  const dstPorts = getScopeAppliedEntries(
    getScopeSelection(state, "destinationPorts", "port"),
  )
    .map((entry) => `${entry.mode === "exclude" ? "!" : ""}${entry.value}`)
    .join(", ");
  const protocolToken = getSuricataConfigProtocolToken(state);
  return [
    `${String(state.action || "alert").toLowerCase()} ${protocolToken} ${srcSubnets || "any"} ${srcPorts || "any"} -> ${dstSubnets || "any"} ${dstPorts || "any"} (`,
    `  flow:${String(state.flow || "to_server")
      .toLowerCase()
      .replace(/\s+/g, "_")},${String(state.state || "established")
      .toLowerCase()
      .replace(/\s+/g, "_")};`,
    `  # behavior: ${String(state.behaviorTriggerWord || "after")} ${String(state.count || 5)} matches per ${String(
      state.trackBy || "Source Host",
    )
      .toLowerCase()
      .replace(
        /\s+/g,
        "_",
      )} within ${String(state.behaviorWindowValue || state.seconds || 60)} ${String(state.behaviorWindowUnit || "seconds")};`,
    state.limitEnabled
      ? `  # limit: ${String(state.limitCount || 1)} alert per time window;`
      : "  # limit: disabled;",
    ...patterns.map((pattern, index) => serializeRulePattern(pattern, index)).filter(Boolean),
    `  classtype:${String(state.classType || "trojan-activity")};`,
    `  sid:${String(state.sid || "2024847")};`,
    `  rev:4;`,
    ")",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildDefaultAlertDerivedConfig(state) {
  const fields = [
    "protocols",
    "hosts",
    "sourceHosts",
    "destinationHosts",
    "ports",
    "sourcePorts",
    "destinationPorts",
    "subnets",
    "sourceSubnets",
    "destinationSubnets",
  ];
  const lines = fields.map((field) => {
    const selection = getDefaultAlertFilterSelection(state, field);
    const applied = getDefaultAlertFilterAppliedEntries(selection).map(
      (entry) => `${entry.mode === "exclude" ? "!" : ""}${entry.value}`,
    );
    return `  ${field}: [${applied.join(", ")}]`;
  });
  return [
    "default_alert:",
    `  schedule: ${String(state.schedule || "Auto")}`,
    `  time_range: ${String(state.timeRange || "Auto")}`,
    `  threshold: ${String(state.threshold || 1)}`,
    `  quota: ${String(state.quota || 10000)}`,
    ...lines,
  ].join("\n");
}

function toggleSuricataAccordion(sectionKey) {
  const accordionState = getActiveAccordionState();
  if (!(sectionKey in accordionState)) return;
  accordionState[sectionKey] = !accordionState[sectionKey];
  if (syncSuricataAccordionDom(sectionKey, accordionState[sectionKey])) return;
  renderSuricataDrawerContent();
}

function onSuricataAccordionHeaderKeydown(event, sectionKey) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  toggleSuricataAccordion(sectionKey);
}

function toggleSuricataRowAccordion(sectionKey) {
  if (!(sectionKey in suricataRowAccordionState)) return;
  suricataRowAccordionState[sectionKey] =
    !suricataRowAccordionState[sectionKey];
  if (
    syncSuricataRowAccordionDom(
      sectionKey,
      suricataRowAccordionState[sectionKey],
    )
  ) {
    return;
  }
  renderSuricataDrawerContent();
}

function syncSuricataAccordionDom(sectionKey, isExpanded) {
  const cardEl = document.getElementById(`suriCard-${sectionKey}`);
  if (!cardEl) return false;

  cardEl.classList.toggle("is-collapsed", !isExpanded);
  const headerEl = cardEl.querySelector(
    ".card-accordion-header, .suri-card-header",
  );
  if (headerEl) {
    headerEl.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  }

  const chevronEl = cardEl.querySelector(
    ".card-header-chevron-icon, .suri-card-chevron-icon",
  );
  if (chevronEl) {
    chevronEl.classList.toggle("is-expanded", isExpanded);
  }
  return true;
}

function syncSuricataRowAccordionDom(sectionKey, isExpanded) {
  const rowEl = document.getElementById(`suriDisclosureRow-${sectionKey}`);
  const expansionEl = document.getElementById(`suriRowExpansion-${sectionKey}`);
  if (!rowEl && !expansionEl) return false;

  if (rowEl) {
    rowEl.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    const disclosureIcon = rowEl.querySelector(".suri-row-disclosure-icon");
    if (disclosureIcon) {
      disclosureIcon.classList.toggle("is-expanded", isExpanded);
    }
  }

  if (expansionEl) {
    expansionEl.classList.toggle("is-collapsed", !isExpanded);
    expansionEl.setAttribute("aria-hidden", isExpanded ? "false" : "true");
  }

  return true;
}

function onSuricataRowAccordionKeydown(event, sectionKey) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  toggleSuricataRowAccordion(sectionKey);
}

function getFillPercent(value, min, max) {
  return ((value - min) / (max - min)) * 100;
}

function getCountFillPercent(value) {
  return getFillPercent(value, SURICATA_COUNT_MIN, SURICATA_COUNT_MAX);
}

function clampSuricataCount(value) {
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) return SURICATA_COUNT_MIN;
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return SURICATA_COUNT_MIN;
  return Math.min(SURICATA_COUNT_MAX, Math.max(SURICATA_COUNT_MIN, parsed));
}

function setSuricataCount(value) {
  if (!suricataDrawerDraft) return;
  const nextValue = clampSuricataCount(value);
  suricataDrawerDraft.count = nextValue;
  const slider = document.getElementById("suriCountSlider");
  const input = document.getElementById("suriCountInput");
  if (slider) {
    slider.value = String(nextValue);
    slider.style.setProperty(
      "--suri-count-fill",
      `${getCountFillPercent(nextValue)}%`,
    );
  }
  if (input) {
    input.value = String(nextValue);
  }
}

function syncRateCountFromSlider(value) {
  if (!editMode) return;
  setSuricataCount(value);
}

function syncRateCountFromInput(value) {
  if (!editMode) return;
  const input = document.getElementById("suriCountInput");
  if (!input) return;
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) {
    input.value = "";
    return;
  }
  setSuricataCount(normalized);
}

function commitRateCountInput() {
  if (!editMode) return;
  setSuricataCount(document.getElementById("suriCountInput")?.value);
}

function setSuricataBehaviorNumericField(field, value) {
  if (!suricataDrawerDraft || drawerVariant !== "suricata") return;
  const range = SURICATA_BEHAVIOR_RANGES[field];
  if (!range) return;
  const nextValue = normalizeSuricataBehaviorValue(field, value);
  suricataDrawerDraft[field] = nextValue;
  if (field === suricataDrawerDraft.behaviorWindowUnit) {
    suricataDrawerDraft.behaviorWindowValue = nextValue;
  }
  const slider = document.getElementById(`suriBehaviorSlider-${field}`);
  const input = document.getElementById(`suriBehaviorInput-${field}`);
  if (slider) {
    slider.value = String(nextValue);
    slider.style.setProperty(
      "--suri-count-fill",
      `${getFillPercent(nextValue, range.min, range.max)}%`,
    );
  }
  if (input) {
    input.value = String(nextValue);
  }
}

function syncSuricataBehaviorFieldFromSlider(field, value) {
  if (!editMode) return;
  setSuricataBehaviorNumericField(field, value);
}

function syncSuricataBehaviorFieldFromInput(field, value) {
  if (!editMode) return;
  const input = document.getElementById(`suriBehaviorInput-${field}`);
  if (!input) return;
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) {
    input.value = "";
    return;
  }
  setSuricataBehaviorNumericField(field, normalized);
}

function commitSuricataBehaviorFieldInput(field) {
  if (!editMode) return;
  setSuricataBehaviorNumericField(
    field,
    document.getElementById(`suriBehaviorInput-${field}`)?.value,
  );
}

function clampDefaultThreshold(value) {
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) return THRESHOLD_MIN;
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return THRESHOLD_MIN;
  return Math.min(THRESHOLD_MAX, Math.max(THRESHOLD_MIN, parsed));
}

function setDefaultThreshold(value) {
  if (!suricataDrawerDraft) return;
  const nextValue = clampDefaultThreshold(value);
  suricataDrawerDraft.threshold = nextValue;
  const slider = document.getElementById("defaultThresholdSlider");
  const input = document.getElementById("defaultThresholdInput");
  if (slider) {
    slider.value = String(nextValue);
    slider.style.setProperty(
      "--suri-count-fill",
      `${getFillPercent(nextValue, THRESHOLD_MIN, THRESHOLD_MAX)}%`,
    );
  }
  if (input) {
    input.value = String(nextValue);
  }
}

function clampDefaultQuota(value) {
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) return DEFAULT_QUOTA_MIN;
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return DEFAULT_QUOTA_MIN;
  return Math.min(DEFAULT_QUOTA_MAX, Math.max(DEFAULT_QUOTA_MIN, parsed));
}

function formatNumberCompact(value) {
  return Number(value).toLocaleString("en-US");
}

function setDefaultQuota(value) {
  if (!suricataDrawerDraft) return;
  const nextValue = clampDefaultQuota(value);
  suricataDrawerDraft.quota = nextValue;
  const slider = document.getElementById("defaultQuotaSlider");
  const input = document.getElementById("defaultQuotaInput");
  if (slider) {
    slider.value = String(nextValue);
    slider.style.setProperty(
      "--suri-count-fill",
      `${getFillPercent(nextValue, DEFAULT_QUOTA_MIN, DEFAULT_QUOTA_MAX)}%`,
    );
  }
  if (input) {
    input.value = formatNumberCompact(nextValue);
  }
}

function syncDefaultThresholdFromSlider(value) {
  if (!editMode || drawerVariant !== "default-alert") return;
  setDefaultThreshold(value);
}

function syncDefaultThresholdFromInput(value) {
  if (!editMode || drawerVariant !== "default-alert") return;
  const input = document.getElementById("defaultThresholdInput");
  if (!input) return;
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) {
    input.value = "";
    return;
  }
  setDefaultThreshold(normalized);
}

function commitDefaultThresholdInput() {
  if (!editMode || drawerVariant !== "default-alert") return;
  setDefaultThreshold(document.getElementById("defaultThresholdInput")?.value);
}

function syncDefaultQuotaFromSlider(value) {
  if (!editMode || drawerVariant !== "default-alert") return;
  setDefaultQuota(value);
}

function syncDefaultQuotaFromInput(value) {
  if (!editMode || drawerVariant !== "default-alert") return;
  const input = document.getElementById("defaultQuotaInput");
  if (!input) return;
  const normalized = String(value ?? "").replace(/[^\d]/g, "");
  if (!normalized) {
    input.value = "";
    return;
  }
  setDefaultQuota(normalized);
}

function commitDefaultQuotaInput() {
  if (!editMode || drawerVariant !== "default-alert") return;
  setDefaultQuota(document.getElementById("defaultQuotaInput")?.value);
}

function setSuricataField(field, value) {
  if (!editMode || !suricataDrawerDraft) return;
  if (drawerVariant === "threshold-settings") {
    if (field === "noisyWindow") {
      suricataDrawerDraft.noisyWindow = THRESHOLD_NOISY_WINDOW_OPTIONS.includes(
        String(value),
      )
        ? String(value)
        : THRESHOLD_NOISY_WINDOW_OPTIONS[0];
      return;
    }
    if (field === "flagInactiveRules") {
      suricataDrawerDraft.flagInactiveRules =
        String(value) === "flag inactive rules";
      return;
    }
    if (
      field === "slowMultiplier" ||
      field === "slowAbsoluteMicros" ||
      field === "noisyPercentile" ||
      field === "staleDays"
    ) {
      const normalized = String(value).replace(/[^\d.]/g, "");
      setThresholdSetting(field, normalized);
      return;
    }
  }
  if (field === "behaviorWindowUnit") {
    const nextUnit = SURICATA_BEHAVIOR_WINDOW_UNIT_OPTIONS.includes(
      String(value),
    )
      ? String(value)
      : "seconds";
    suricataDrawerDraft.behaviorWindowUnit = nextUnit;
    suricataDrawerDraft.behaviorWindowValue = normalizeSuricataBehaviorValue(
      nextUnit,
      suricataDrawerDraft[nextUnit],
    );
    return;
  }
  if (field === "behaviorWindowValue") {
    const activeUnit = suricataDrawerDraft.behaviorWindowUnit || "seconds";
    const nextValue = normalizeSuricataBehaviorValue(activeUnit, value);
    suricataDrawerDraft.behaviorWindowValue = nextValue;
    suricataDrawerDraft[activeUnit] = nextValue;
    return;
  }
  if (field in SURICATA_BEHAVIOR_RANGES) {
    const nextValue = normalizeSuricataBehaviorValue(field, value);
    suricataDrawerDraft[field] = nextValue;
    if (field === suricataDrawerDraft.behaviorWindowUnit) {
      suricataDrawerDraft.behaviorWindowValue = nextValue;
    }
    return;
  }
  suricataDrawerDraft[field] = value;
}

function restoreDefaultAlertFilterSearchFocus(field) {
  requestAnimationFrame(() => {
    const input = document.querySelector(
      `[data-default-filter-input="${field}"]`,
    );
    if (!input) return;
    const cursorPosition = input.value.length;
    focusTextFieldWithoutScroll(input, cursorPosition);
    revealDefaultAlertFilterInputInChipbox(field);
    syncDefaultAlertFilterSuggestionAnchor(field);
  });
}

function restoreDefaultAlertFilterMenuSearchFocus(field) {
  requestAnimationFrame(() => {
    const input = document.querySelector(
      `.suri-menu[data-menu-key="${getDefaultAlertFilterMenuKey(field)}"] .suri-subnet-search input`,
    );
    if (!input) return;
    const cursorPosition = input.value.length;
    focusTextFieldWithoutScroll(input, cursorPosition);
  });
}

function onDefaultAlertFilterChipboxSearchInput(field, value) {
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft)
    return;
  const uiState = getDefaultAlertFilterUiState(field);
  uiState.search = value;
  uiState.open = true;
  suricataOpenMenuKey = null;
  renderSuricataDrawerContent();
  restoreDefaultAlertFilterSearchFocus(field);
}

function revealDefaultAlertFilterInputInChipbox(field) {
  const input = document.querySelector(
    `[data-default-filter-input="${field}"]`,
  );
  const chipBox = input?.closest(".default-alert-filter-chipbox");
  if (!input || !chipBox) return;
  const inputRect = input.getBoundingClientRect();
  const chipBoxRect = chipBox.getBoundingClientRect();
  const nextTop = inputRect.top - chipBoxRect.top + chipBox.scrollTop;
  const nextBottom = inputRect.bottom - chipBoxRect.top + chipBox.scrollTop;
  const padding = 8;
  const visibleTop = chipBox.scrollTop;
  const visibleBottom = chipBox.scrollTop + chipBox.clientHeight;

  if (nextBottom + padding > visibleBottom) {
    chipBox.scrollTop = Math.max(
      0,
      nextBottom - chipBox.clientHeight + padding,
    );
    return;
  }
  if (nextTop - padding < visibleTop) {
    chipBox.scrollTop = Math.max(0, nextTop - padding);
  }
}

function syncDefaultAlertFilterSuggestionAnchor(
  field,
  useLivePanelRect = false,
) {
  const shell = document.querySelector(
    `[data-default-filter-shell="${field}"]`,
  );
  const indicator =
    document.querySelector(`[data-default-filter-input="${field}"]`) ||
    document.querySelector(`[data-default-filter-indicator="${field}"]`);
  const anchor = document.querySelector(
    `[data-default-filter-suggestions="${field}"]`,
  );
  if (!shell || !indicator || !anchor) return;
  const shellRect = shell.getBoundingClientRect();
  const boundaryRect = getDefaultAlertSuggestionBoundaryRect(shell);
  const indicatorRect = indicator.getBoundingClientRect();
  const panel = anchor.querySelector(".menu-list, .suri-scope-suggestion-panel");
  const livePanelRect = useLivePanelRect
    ? panel?.getBoundingClientRect()
    : null;
  const panelWidth = Math.round(
    livePanelRect?.width || panel?.offsetWidth || panel?.scrollWidth || 264,
  );
  const panelHeight = Math.round(
    livePanelRect?.height || panel?.offsetHeight || panel?.scrollHeight || 0,
  );
  const list = panel?.querySelector(".suri-subnet-project-list");
  const listHeight = Math.round(list?.offsetHeight || list?.scrollHeight || 0);
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
  anchor.style.setProperty("--suri-scope-suggestion-top", `${preferredTop}px`);
  anchor.style.setProperty("--suri-scope-suggestion-left", `${clampedLeft}px`);
  anchor.style.setProperty("--suri-scope-suggestion-translate-y", "4px");
  anchor.style.setProperty(
    "--suri-scope-suggestion-max-height",
    `${panelMaxHeight}px`,
  );
  anchor.style.setProperty(
    "--suri-scope-suggestion-list-max-height",
    `${listMaxHeight}px`,
  );
  if (!useLivePanelRect) {
    requestAnimationFrame(() =>
      syncDefaultAlertFilterSuggestionAnchor(field, true),
    );
  }
}

function syncAllDefaultAlertFilterSuggestionAnchors() {
  document
    .querySelectorAll("[data-default-filter-suggestions]")
    .forEach((anchor) => {
      const field = anchor.getAttribute("data-default-filter-suggestions");
      if (!field) return;
      syncDefaultAlertFilterSuggestionAnchor(field);
    });
}

function onDefaultAlertFilterMenuSearchInput(field, value) {
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft)
    return;
  const uiState = getDefaultAlertFilterUiState(field);
  uiState.search = value;
  uiState.open = false;
  suricataOpenMenuKey = getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  restoreDefaultAlertFilterMenuSearchFocus(field);
}

function setDefaultAlertFilterValueMode(field, value, mode) {
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft)
    return false;
  const selection = getDefaultAlertFilterSelection(suricataDrawerDraft, field);
  const beforeCount = getDefaultAlertFilterSelectedCount(
    suricataDrawerDraft,
    field,
  );
  const nextSelection = {
    ...selection,
    includeChecked: [...selection.includeChecked],
    excludeChecked: [...selection.excludeChecked],
    entryOrder: [...selection.entryOrder],
  };
  const orderKey = getDefaultAlertFilterOrderKey(value);
  const existingOrderIndex = nextSelection.entryOrder.indexOf(orderKey);
  if (mode === "exclude") {
    if (nextSelection.excludeChecked.includes(value)) {
      nextSelection.excludeChecked = nextSelection.excludeChecked.filter(
        (entry) => entry !== value,
      );
    } else {
      nextSelection.excludeChecked.push(value);
      nextSelection.includeChecked = nextSelection.includeChecked.filter(
        (entry) => entry !== value,
      );
    }
  } else if (nextSelection.includeChecked.includes(value)) {
    nextSelection.includeChecked = nextSelection.includeChecked.filter(
      (entry) => entry !== value,
    );
  } else {
    nextSelection.includeChecked.push(value);
    nextSelection.excludeChecked = nextSelection.excludeChecked.filter(
      (entry) => entry !== value,
    );
  }
  const stillSelected =
    nextSelection.includeChecked.includes(value) ||
    nextSelection.excludeChecked.includes(value);
  if (stillSelected) {
    if (existingOrderIndex === -1) nextSelection.entryOrder.push(orderKey);
  } else if (existingOrderIndex !== -1) {
    nextSelection.entryOrder.splice(existingOrderIndex, 1);
  }
  setDefaultAlertFilterSelection(suricataDrawerDraft, field, nextSelection);
  syncDefaultAlertFilterLabels(suricataDrawerDraft);
  if (
    getDefaultAlertFilterSelectedCount(suricataDrawerDraft, field) > beforeCount &&
    document.querySelector(
      `[data-simple-selection-key="${getDefaultAlertFilterSimpleSelectionKey(field)}"]`,
    )
  ) {
    markSimpleMenuSelectionSnapToBottom(
      getDefaultAlertFilterSimpleSelectionKey(field),
    );
  }
  return true;
}

function onDefaultAlertFilterOptionInclude(event, field, value) {
  event.preventDefault();
  event.stopPropagation();
  if (!setDefaultAlertFilterValueMode(field, value, "include")) return;
  const rowMenuOpen =
    suricataOpenMenuKey === getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  if (rowMenuOpen) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  } else {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function onDefaultAlertFilterOptionExclude(event, field, value) {
  event.preventDefault();
  event.stopPropagation();
  if (!setDefaultAlertFilterValueMode(field, value, "exclude")) return;
  const rowMenuOpen =
    suricataOpenMenuKey === getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  if (rowMenuOpen) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  } else {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function onDefaultAlertFilterOptionToggle(event, field, value) {
  event.preventDefault();
  event.stopPropagation();
  const mode = getDefaultAlertFilterPendingMode(field, value);
  if (!setDefaultAlertFilterValueMode(field, value, mode)) return;
  const rowMenuOpen =
    suricataOpenMenuKey === getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  if (rowMenuOpen) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  } else {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function onDefaultAlertFilterOptionModeSelect(event, field, value, mode) {
  event.preventDefault();
  event.stopPropagation();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  const selection = getDefaultAlertFilterSelection(suricataDrawerDraft, field);
  const selectionMode = getDefaultAlertFilterValueMode(selection, value);
  const nextMode = mode === "exclude" ? "exclude" : "include";
  if (selectionMode) {
    if (!setDefaultAlertFilterValueMode(field, value, nextMode)) return;
  } else {
    setDefaultAlertFilterPendingMode(field, value, nextMode);
  }
  const rowMenuOpen =
    suricataOpenMenuKey === getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  if (rowMenuOpen) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  } else {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function onDefaultAlertFilterChipRemove(event, field, value) {
  event.stopPropagation();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  const selection = getDefaultAlertFilterSelection(suricataDrawerDraft, field);
  setDefaultAlertFilterSelection(suricataDrawerDraft, field, {
    ...selection,
    includeChecked: selection.includeChecked.filter((entry) => entry !== value),
    excludeChecked: selection.excludeChecked.filter((entry) => entry !== value),
    entryOrder: selection.entryOrder.filter(
      (entry) => entry !== getDefaultAlertFilterOrderKey(value),
    ),
  });
  syncDefaultAlertFilterLabels(suricataDrawerDraft);
  const rowMenuOpen =
    suricataOpenMenuKey === getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  if (rowMenuOpen) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  } else if (getDefaultAlertFilterUiState(field).open) {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function openDefaultAlertFilterMenu(field, event = null) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  closeDefaultAlertFilterComboboxes(false);
  suricataOpenMenuKey = getDefaultAlertFilterMenuKey(field);
  renderSuricataDrawerContent();
  restoreDefaultAlertFilterMenuSearchFocus(field);
}

function toggleDefaultAlertFilterRowMenu(event, field) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  closeDefaultAlertFilterComboboxes(false);
  const menuKey = getDefaultAlertFilterMenuKey(field);
  suricataOpenMenuKey = suricataOpenMenuKey === menuKey ? null : menuKey;
  renderSuricataDrawerContent();
  if (suricataOpenMenuKey) {
    restoreDefaultAlertFilterMenuSearchFocus(field);
  }
}

function openDefaultAlertFilterCombobox(field, event = null) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  const uiState = getDefaultAlertFilterUiState(field);
  if (uiState.open) {
    restoreDefaultAlertFilterSearchFocus(field);
    return;
  }
  closeSuricataMenu();
  closeDefaultAlertFilterComboboxes(false, field);
  uiState.open = true;
  renderSuricataDrawerContent();
  restoreDefaultAlertFilterSearchFocus(field);
}

function toggleDefaultAlertFilterCombobox(field, event) {
  event?.stopPropagation?.();
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  const uiState = getDefaultAlertFilterUiState(field);
  const willOpen = !uiState.open;
  closeSuricataMenu();
  closeDefaultAlertFilterComboboxes(false, field);
  uiState.open = willOpen;
  renderSuricataDrawerContent();
  if (willOpen) {
    restoreDefaultAlertFilterSearchFocus(field);
  }
}

function focusDefaultAlertFilterInput(event, field) {
  event?.stopPropagation?.();
  openDefaultAlertFilterCombobox(field);
}

function onDefaultAlertFilterInputKeydown(event, field) {
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft) {
    return;
  }
  const uiState = getDefaultAlertFilterUiState(field);
  const inputValue = String(uiState.search || "").trim();
  if (event.key === "Backspace" && !inputValue) {
    const selection = getDefaultAlertFilterSelection(
      suricataDrawerDraft,
      field,
    );
    const appliedEntries = getDefaultAlertFilterAppliedEntries(selection);
    const lastEntry = appliedEntries[appliedEntries.length - 1];
    if (!lastEntry) return;
    event.preventDefault();
    event.stopPropagation();
    onDefaultAlertFilterChipRemove(event, field, lastEntry.value);
    return;
  }
  if (event.key !== "Enter" && event.key !== " " && event.key !== "ArrowDown") {
    return;
  }
  if (event.target?.tagName?.toLowerCase() === "input" && event.key === " ") {
    return;
  }
  event.preventDefault();
  openDefaultAlertFilterCombobox(field, event);
}

function renderDefaultAlertFilterAppliedChips(field, entries) {
  return entries
    .map(
      (chip) => `
        <span class="suri-subnet-chip project ${chip.mode} default-alert-filter-chip">
          ${chip.mode === "exclude" ? '<span class="suri-scope-chip-prefix" aria-hidden="true">!</span>' : ""}
          ${renderDefaultAlertFilterOptionValue(field, chip.value)}
          <button
            type="button"
            class="suri-subnet-chip-remove"
            onclick="onDefaultAlertFilterChipRemove(event, '${escapeJsSingleQuoted(field)}', '${escapeJsSingleQuoted(chip.value)}')"
          >
            <span class="svg-icon svg-icon-close-small" aria-hidden="true"></span>
          </button>
        </span>
      `,
    )
    .join("");
}

function renderDefaultAlertFilterCombobox(field, state) {
  const config = getDefaultAlertFilterConfig(field);
  if (!config) return renderSuricataValue(state?.[field] ?? "");
  const selection = getDefaultAlertFilterSelection(state, field);
  const uiState = getDefaultAlertFilterUiState(field);
  const selectedCount = getDefaultAlertFilterSelectedCount(state, field);
  const appliedEntries = getDefaultAlertFilterAppliedEntries(selection);
  const helperText = selectedCount > 0 ? "" : config.emptyLabel;
  return `
    <div class="default-alert-filter-combobox" data-default-filter-field="${escapeHtml(field)}">
      <div class="suri-scope-input-shell default-alert-filter-shell" data-default-filter-shell="${escapeHtml(field)}">
        <div
          class="suri-scope-chipbox default-alert-filter-chipbox"
          onclick="focusDefaultAlertFilterInput(event, '${escapeJsSingleQuoted(field)}')"
        >
          ${renderDefaultAlertFilterAppliedChips(field, appliedEntries)}
          <div class="suri-scope-input-indicator" data-default-filter-indicator="${escapeHtml(field)}">
            ${
              helperText && !uiState.search
                ? `<span class="suri-scope-inline-help default-alert-filter-placeholder">${escapeHtml(helperText)}</span>`
                : ""
            }
            <input
              class="suri-subnet-chip-input default-alert-filter-input"
              type="text"
              value="${escapeHtml(uiState.search)}"
              data-default-filter-input="${escapeHtml(field)}"
              placeholder=""
              aria-label="Search ${escapeHtml(config.title)}"
              onclick="event.stopPropagation()"
              onfocus="openDefaultAlertFilterCombobox('${escapeJsSingleQuoted(field)}', event)"
              oninput="onDefaultAlertFilterChipboxSearchInput('${escapeJsSingleQuoted(field)}', this.value)"
              onkeydown="onDefaultAlertFilterInputKeydown(event, '${escapeJsSingleQuoted(field)}')"
            />
          </div>
        </div>
        ${renderDefaultAlertFilterChipboxPanel(field, state, { hideSelectionShell: true })}
      </div>
    </div>
  `;
}

function selectSuricataMenuOption(event, menuKey, field, value) {
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  setSuricataField(field, value);
  suricataOpenMenuKey = null;
  renderSuricataDrawerContent();
}

function restoreSuricataProtocolSearchFocus() {
  requestAnimationFrame(() => {
    const menu = document.querySelector(
      `.suri-menu[data-menu-key="${getSuricataProtocolMenuKey()}"]`,
    );
    const input = menu?.querySelector(".suri-protocol-search input");
    if (!input) return;
    const cursorPosition = input.value.length;
    focusTextFieldWithoutScroll(input, cursorPosition);
  });
}

function onSuricataProtocolSearchInput(value) {
  if (!editMode || !suricataDrawerDraft) return;
  suricataProtocolSearch = String(value ?? "");
  renderSuricataDrawerContent();
  restoreSuricataProtocolSearchFocus();
}

function toggleSuricataProtocolOption(event, protocol) {
  event.preventDefault();
  event.stopPropagation();
  if (!editMode || !suricataDrawerDraft) return;
  const selected = normalizeSuricataProtocolSelection(suricataDrawerDraft.protocols);
  const normalizedProtocol = String(protocol || "").trim().toUpperCase();
  if (!SURICATA_PROTOCOL_OPTIONS.some((option) => option.value === normalizedProtocol)) {
    return;
  }
  suricataDrawerDraft.protocols = selected.includes(normalizedProtocol)
    ? selected.filter((entry) => entry !== normalizedProtocol)
    : [...selected, normalizedProtocol];
  renderSuricataDrawerContent();
}

function selectDrawerVersion(event, versionId, menuKey) {
  event.stopPropagation();
  if (editMode || !suricataDrawerBaseline) return;
  suricataDrawerBaseline.selectedVersionId = versionId;
  suricataOpenMenuKey = null;
  syncDrawerHeaderActions();
  syncDrawerTitle();
  renderSuricataDrawerContent();
}

function onDefaultDescriptionInput(value) {
  if (!editMode || drawerVariant !== "default-alert" || !suricataDrawerDraft)
    return;
  suricataDrawerDraft.description = value;
  renderRules();
}

function toggleSuricataToggle(field) {
  if (!suricataDrawerBaseline) return;
  const canToggleWithoutEdit = field === "enabled";
  if (!editMode && !canToggleWithoutEdit) return;
  if (!editMode && isViewingHistoricalDrawerVersion()) return;

  const target =
    editMode && suricataDrawerDraft
      ? suricataDrawerDraft
      : suricataDrawerBaseline;
  target[field] = !target[field];
  if (field === "limitEnabled") {
    target.rateLimiting = target.limitEnabled;
  }

  if (field === "enabled") {
    suricataDrawerBaseline.enabled = target.enabled;
    if (suricataDrawerDraft) suricataDrawerDraft.enabled = target.enabled;
    if (selectedRule) {
      const rule = currentRules.find((item) => item.id === selectedRule);
      if (rule) {
        rule.enabled = target.enabled;
      }
      const dbRule = suricataRuleDb.find((item) => item.id === selectedRule);
      if (dbRule) {
        dbRule.enabled = target.enabled;
      }
      refreshRuleCollections({ preservePage: true });
      renderRules();
    }
  }

  renderSuricataDrawerContent();
  syncDrawerTitle();
}

function updateSuricataReference(index, field, value) {
  if (!editMode || !suricataDrawerDraft) return;
  if (!suricataDrawerDraft.references[index]) return;
  suricataDrawerDraft.references[index][field] = value;
}

function addSuricataReference() {
  if (!editMode || !suricataDrawerDraft) return;
  suricataDrawerDraft.references.push({ title: "New Reference", url: "" });
  renderSuricataDrawerContent();
}

function removeSuricataReference(index) {
  if (!editMode || !suricataDrawerDraft) return;
  suricataDrawerDraft.references.splice(index, 1);
  renderSuricataDrawerContent();
}

function onRuleConfigInput(value) {
  const target =
    editMode && suricataDrawerDraft
      ? suricataDrawerDraft
      : suricataDrawerBaseline;
  if (!target) return;
  target.ruleConfig = value;
}

function onSuricataContentMatchInput(value) {
  if (!editMode || drawerVariant !== "suricata" || !suricataDrawerDraft) return;
  suricataDrawerDraft.contentMatch = String(value || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function renderSuricataScopeVerboseBody(state) {
  return [
    renderSuricataRow(
      "Action",
      editMode
        ? renderSuricataSelect("action", state.action, [
            "Alert",
            "Drop",
            "Reject",
          ])
        : renderSuricataValue(state.action),
      { muted: true },
    ),
    renderSuricataRow(
      "Protocols",
      editMode
        ? renderSuricataSelect("protocols", state.protocols, [
            "HTTP",
            "DNS",
            "TLS",
            "SMTP",
          ])
        : renderSuricataValue(state.protocols),
      { muted: true },
    ),
    renderSuricataRow(
      "Direction",
      editMode
        ? renderSuricataSelect(
            "directionality",
            state.directionality || "Unidirectional",
            ["Unidirectional", "Bidirectional"],
          )
        : renderSuricataValue(state.directionality || "Unidirectional"),
      { muted: true },
    ),
    renderSuricataRow(
      "Flow",
      editMode
        ? renderSuricataSelect("flow", state.flow || "To Server", [
            "To Server",
            "To Client",
          ])
        : renderSuricataValue(state.flow || "To Server"),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "State",
      editMode
        ? renderSuricataSelect("state", state.state, [
            "Established",
            "Not Established",
            "Stateless",
          ])
        : renderSuricataValue(state.state),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Source Subnets",
      editMode
        ? renderScopeAppliedInput("sourceSubnets", "subnet", state)
        : renderScopeReadonlySummary("sourceSubnets", "subnet", state),
      {
        muted: true,
        info: true,
        className: editMode ? "is-inline-editor is-param-editor-row" : "",
      },
    ),
    renderSuricataRow(
      "Source Ports",
      editMode
        ? renderScopeAppliedInput("sourcePorts", "port", state)
        : renderScopeReadonlySummary("sourcePorts", "port", state),
      {
        muted: true,
        info: true,
        className: editMode ? "is-inline-editor is-param-editor-row" : "",
      },
    ),
    renderSuricataRow(
      "Destination Subnets",
      editMode
        ? renderScopeAppliedInput("destinationSubnets", "subnet", state)
        : renderScopeReadonlySummary("destinationSubnets", "subnet", state),
      {
        muted: true,
        info: true,
        className: editMode ? "is-inline-editor is-param-editor-row" : "",
      },
    ),
    renderSuricataRow(
      "Destination Ports",
      editMode
        ? renderScopeAppliedInput("destinationPorts", "port", state)
        : renderScopeReadonlySummary("destinationPorts", "port", state),
      {
        muted: true,
        info: true,
        className: editMode ? "is-inline-editor is-param-editor-row" : "",
      },
    ),
  ].join("");
}

function renderSuricataScopeSimpleBody(state) {
  return renderParamSentence(`
    ${renderParamInlineControl(
      renderSuricataProtocolPicker(state),
    )}
    <span class="suri-param-text">from</span>
    ${renderParamInlineControl(
      renderScopeMadlibControl("sourceSubnets", "subnet", state),
    )}
    <span class="suri-param-text">on</span>
    ${renderParamInlineControl(
      renderScopeMadlibControl("sourcePorts", "port", state),
    )}
    <span class="suri-param-text">going</span>
    ${renderParamInlineControl(
      renderSuricataMadlibSelect(
        "directionality",
        state.directionality || "Unidirectional",
        ["Unidirectional", "Bidirectional"],
        "rule-config",
      ),
    )}
    <span class="suri-param-text">to</span>
    ${renderParamInlineControl(
      renderScopeMadlibControl("destinationSubnets", "subnet", state),
    )}
    <span class="suri-param-text">on</span>
    ${renderParamInlineControl(
      renderScopeMadlibControl("destinationPorts", "port", state),
    )}
    <span class="suri-param-text">and inspect full transactions for</span>
    ${renderParamInlineControl(
      renderSuricataMadlibSelect("state", state.state, [
        "Established",
        "Not Established",
        "Stateless",
      ], "rule-config"),
    )}
    <span class="suri-param-text">connections</span>
  `);
}

function renderDefaultAlertFiltersVerboseBody(state) {
  const alertFilterRows = [
    ["Protocols", "protocols"],
    ["Hosts", "hosts"],
    ["Source Hosts", "sourceHosts"],
    ["Destination Hosts", "destinationHosts"],
    ["Ports", "ports"],
    ["Source Ports", "sourcePorts"],
    ["Destination Ports", "destinationPorts"],
    ["Subnets", "subnets"],
    ["Source Subnets", "sourceSubnets"],
    ["Destination Subnets", "destinationSubnets"],
  ];
  return alertFilterRows
    .map(([label, field]) =>
      renderSuricataRow(
        label,
        editMode
          ? renderDefaultAlertFilterCombobox(field, state)
          : renderDefaultAlertFilterSummaryControl(field, state),
        {
          muted: true,
          info: true,
          className: editMode ? "is-inline-editor is-param-editor-row" : "",
        },
      ),
    )
    .join("");
}

function renderDefaultAlertFiltersSimpleBody(state) {
  return [
    renderParamSentence(`
      <span class="suri-param-text">Look for</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("protocols", state),
      )}
      <span class="suri-param-text">across</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("hosts", state),
      )}
      <span class="suri-param-text">.</span>
    `),
    renderParamSentence(`
      <span class="suri-param-text">From</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("sourceHosts", state),
      )}
      <span class="suri-param-text">on</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("sourcePorts", state),
      )}
      <span class="suri-param-text">within</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("sourceSubnets", state),
      )}
      <span class="suri-param-text">.</span>
    `),
    renderParamSentence(`
      <span class="suri-param-text">To</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("destinationHosts", state),
      )}
      <span class="suri-param-text">on</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("destinationPorts", state),
      )}
      <span class="suri-param-text">within</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("destinationSubnets", state),
      )}
      <span class="suri-param-text">.</span>
    `),
    renderParamSentence(`
      <span class="suri-param-text">Also match ports</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("ports", state),
      )}
      <span class="suri-param-text">and subnets</span>
      ${renderParamInlineControl(
        renderDefaultAlertFilterSummaryControl("subnets", state),
      )}
      <span class="suri-param-text">.</span>
    `),
  ].join("");
}

function renderRulePatternsSimpleBody(state) {
  return [
    renderParamSentence(
      `
      <span class="suri-param-text">Content contains</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput(
              "contentMatchText",
              state.contentMatch.join(", "),
            ).replace(
              `onchange="setSuricataField('contentMatchText', this.value)"`,
              `onchange="onSuricataContentMatchInput(this.value)"`,
            )
          : `<div class="teletext-list">${state.contentMatch.map((token) => `<span class="teletext">${escapeHtml(token)}</span>`).join("")}</div>`,
        "is-wide",
      )}
      <span class="suri-param-text">.</span>
    `,
      "is-block",
    ),
    renderParamSentence(`
      <span class="suri-param-text">Regex matches</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("regexPattern", state.regexPattern)
          : renderSuricataValue(state.regexPattern),
      )}
      <span class="suri-param-text">with modifiers</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("modifiers", state.modifiers || "")
          : renderSuricataValue(state.modifiers || "—"),
      )}
      <span class="suri-param-text">.</span>
    `),
    renderParamSentence(`
      <span class="suri-param-text">HTTP URI contains</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("httpUri", state.httpUri)
          : renderSuricataValue(state.httpUri),
      )}
      <span class="suri-param-text">and header</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("httpHeader", state.httpHeader)
          : renderSuricataValue(state.httpHeader),
      )}
      <span class="suri-param-text">.</span>
    `),
    renderParamSentence(`
      <span class="suri-param-text">DNS query contains</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("dnsQuery", state.dnsQuery)
          : renderSuricataValue(state.dnsQuery),
      )}
      <span class="suri-param-text">.</span>
    `),
  ].join("");
}

function renderRuleBehaviorsSimpleBody(state) {
  const currentWindowUnit = state.behaviorWindowUnit || "seconds";
  const currentWindowValue =
    state.behaviorWindowValue || state[currentWindowUnit] || 60;

  const advancedActiveCount = [
    state.limitEnabled,
    state.overrideEnabled,
    state.suppressEnabled,
    state.flowbitsEnabled,
    state.requireEnabled,
  ].filter(Boolean).length;

  const limitSentence = editMode
    ? `
      <span class="suri-param-text">Limit</span>
      ${renderParamInlineControl(
        renderSuricataToggle("limitEnabled", state.limitEnabled, !editMode),
      )}
      ${
        state.limitEnabled
          ? `
            <span class="suri-param-text">to</span>
            ${renderParamInlineControl(
              renderSuricataMadlibSelect(
                "limitCount",
                String(state.limitCount),
                SURICATA_BEHAVIOR_LIMIT_OPTIONS,
                "rule-config",
              ),
            )}
            <span class="suri-param-text">alert per time window</span>
          `
          : ""
      }
    `
    : state.limitEnabled
      ? `
        <span class="suri-param-text">Limit to</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(String(state.limitCount)),
        )}
        <span class="suri-param-text">alert per time window</span>
      `
      : `<span class="suri-param-text">Limit disabled.</span>`;

  const overrideSentence = editMode
    ? `
      <span class="suri-param-text">Override</span>
      ${renderParamInlineControl(
        renderSuricataToggle("overrideEnabled", state.overrideEnabled, !editMode),
      )}
      ${
        state.overrideEnabled
          ? `
            <span class="suri-param-text">with priority</span>
            ${renderParamInlineControl(
              renderSuricataMadlibSelect(
                "overridePriority",
                state.overridePriority,
                SURICATA_BEHAVIOR_PRIORITY_OPTIONS,
                "rule-config",
              ),
            )}
          `
          : ""
      }
    `
    : state.overrideEnabled
      ? `
        <span class="suri-param-text">Override with priority</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.overridePriority),
        )}
      `
      : `<span class="suri-param-text">Override disabled.</span>`;

  const suppressSentence = editMode
    ? `
      <span class="suri-param-text">Suppress</span>
      ${renderParamInlineControl(
        renderSuricataToggle("suppressEnabled", state.suppressEnabled, !editMode),
      )}
      ${
        state.suppressEnabled
          ? `
            ${renderParamInlineControl(
              renderSuricataMadlibSelect(
                "suppressTrackBy",
                state.suppressTrackBy,
                SURICATA_BEHAVIOR_SUPPRESS_TRACK_OPTIONS,
                "rule-config",
              ),
            )}
            <span class="suri-param-text">is</span>
            ${renderParamInlineControl(
              renderSuricataMadlibCombobox(
                "suppressHost",
                state.suppressHost,
                SURICATA_BEHAVIOR_SUPPRESS_HOST_OPTIONS,
                "host / subnet",
              ),
            )}
          `
          : ""
      }
    `
    : state.suppressEnabled
      ? `
        <span class="suri-param-text">Suppress</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.suppressTrackBy),
        )}
        <span class="suri-param-text">is</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.suppressHost || "—"),
        )}
      `
      : `<span class="suri-param-text">Suppress disabled.</span>`;

  const flowbitsSentence = editMode
    ? `
      <span class="suri-param-text">On match</span>
      ${renderParamInlineControl(
        renderSuricataToggle("flowbitsEnabled", state.flowbitsEnabled, !editMode),
      )}
      ${
        state.flowbitsEnabled
          ? `
            ${renderParamInlineControl(
              renderSuricataMadlibSelect(
                "flowbitsAction",
                state.flowbitsAction,
                SURICATA_BEHAVIOR_FLOWBITS_ACTION_OPTIONS,
                "rule-config",
              ),
            )}
            <span class="suri-param-text">flag</span>
            ${renderParamInlineControl(
              renderSuricataMadlibCombobox(
                "flowbitsFlag",
                state.flowbitsFlag,
                SURICATA_BEHAVIOR_FLOWBITS_FLAG_OPTIONS,
                "flag name",
              ),
            )}
          `
          : ""
      }
    `
    : state.flowbitsEnabled
      ? `
        <span class="suri-param-text">On match</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.flowbitsAction),
        )}
        <span class="suri-param-text">flag</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.flowbitsFlag || "—"),
        )}
      `
      : `<span class="suri-param-text">Flowbits disabled.</span>`;

  const requireSentence = editMode
    ? `
      <span class="suri-param-text">Require</span>
      ${renderParamInlineControl(
        renderSuricataToggle("requireEnabled", state.requireEnabled, !editMode),
      )}
      ${
        state.requireEnabled
          ? `
            ${renderParamInlineControl(
              renderSuricataMadlibCombobox(
                "requireCriteriaFlag",
                state.requireCriteriaFlag,
                SURICATA_BEHAVIOR_FLOWBITS_FLAG_OPTIONS,
                "flag name",
              ),
            )}
            ${renderParamInlineControl(
              renderSuricataMadlibSelect(
                "requireCriteriaState",
                state.requireCriteriaState,
                SURICATA_BEHAVIOR_REQUIRE_STATE_OPTIONS,
                "rule-config",
              ),
            )}
          `
          : ""
      }
    `
    : state.requireEnabled
      ? `
        <span class="suri-param-text">Require</span>
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.requireCriteriaFlag || "—"),
        )}
        ${renderParamInlineControl(
          renderRuleConfigReadonlyTrigger(state.requireCriteriaState),
        )}
      `
      : `<span class="suri-param-text">Require disabled.</span>`;

  return [
    renderParamSentence(`
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "action",
          state.action,
          SURICATA_BEHAVIOR_ACTION_OPTIONS,
          "rule-config",
        ),
      )}
      <span class="suri-param-text">with message:</span>
      ${renderParamInlineControl(
        editMode
          ? renderSuricataInput("message", state.message, "Enter message…")
          : renderRuleConfigReadonlyTrigger(state.message || "—"),
        "is-wide",
      )}
    `),
    renderParamSentence(`
      <span class="suri-param-text">Trigger</span>
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "behaviorTriggerWord",
          state.behaviorTriggerWord,
          SURICATA_BEHAVIOR_TRIGGER_OPTIONS,
          "rule-config",
        ),
      )}
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "count",
          String(state.count),
          SURICATA_BEHAVIOR_COUNT_OPTIONS,
          "rule-config",
        ),
      )}
      <span class="suri-param-text">matches per</span>
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "trackBy",
          state.trackBy,
          SURICATA_BEHAVIOR_TRACK_BY_OPTIONS,
          "rule-config",
        ),
      )}
      <span class="suri-param-text">within</span>
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "behaviorWindowValue",
          String(currentWindowValue),
          getBehaviorWindowValueOptions(currentWindowUnit),
          "rule-config",
        ),
      )}
      ${renderParamInlineControl(
        renderSuricataMadlibSelect(
          "behaviorWindowUnit",
          currentWindowUnit,
          SURICATA_BEHAVIOR_WINDOW_UNIT_OPTIONS,
          "rule-config",
        ),
      )}
    `),
    renderSuricataRow(
      `Advanced Settings (${advancedActiveCount} of 5)`,
      "",
      { disclosureId: "behaviorAdvancedSettings", info: true },
    ),
    renderSuricataRowExpansion(
      editMode
        ? [
            renderParamSentence(limitSentence, "tree-indent"),
            renderParamSentence(overrideSentence, "tree-indent"),
            renderParamSentence(suppressSentence, "tree-indent"),
            renderParamSentence(flowbitsSentence, "tree-indent"),
            renderParamSentence(requireSentence, "tree-indent"),
          ].join("")
        : renderParamSentence(
            [
              state.limitEnabled
                ? `<span class="suri-param-text">Limit alerts to</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(String(state.limitCount)))}
                   <span class="suri-param-text">per time window.</span>`
                : "",
              state.overrideEnabled
                ? `<span class="suri-param-text">Override the priority to</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.overridePriority))}
                   <span class="suri-param-text">instead of the default classtype.</span>`
                : "",
              state.suppressEnabled
                ? `<span class="suri-param-text">Suppress alerts when the</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.suppressTrackBy))}
                   <span class="suri-param-text">is</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.suppressHost || "—"))}`
                : "",
              state.flowbitsEnabled
                ? `<span class="suri-param-text">On match,</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.flowbitsAction))}
                   <span class="suri-param-text">the flag</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.flowbitsFlag || "—"))}`
                : "",
              state.requireEnabled
                ? `<span class="suri-param-text">Require</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.requireCriteriaFlag || "—"))}
                   <span class="suri-param-text">to be</span>
                   ${renderParamInlineControl(renderRuleConfigReadonlyTrigger(state.requireCriteriaState))}`
                : "",
            ]
              .filter(Boolean)
              .join(" ") ||
              `<span class="suri-param-text">No advanced settings enabled.</span>`,
            "tree-indent",
          ),
      {
        expanded: suricataRowAccordionState.behaviorAdvancedSettings,
        disclosureId: "behaviorAdvancedSettings",
        className: editMode ? "" : "is-readonly",
      },
    ),
  ].join("");
}

function formatThresholdValue(field, value) {
  if (field === "slowMultiplier") return `${Number(value).toFixed(1)}x`;
  if (field === "slowAbsoluteMicros") return `${Math.round(Number(value))}µs`;
  if (field === "noisyPercentile") return `${Math.round(Number(value))}%`;
  if (field === "staleDays") return `${Math.round(Number(value))} days`;
  return String(value ?? "");
}

function setThresholdSetting(field, rawValue) {
  if (drawerVariant !== "threshold-settings" || !suricataDrawerDraft) return;
  const range = SURICATA_BEHAVIOR_RANGES[field];
  let nextValue = rawValue;
  if (range) {
    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) return;
    const step = Number(range.step) || 1;
    const rounded = Math.round(numeric / step) * step;
    nextValue = step < 1 ? Number(rounded.toFixed(1)) : rounded;
    nextValue = Math.max(range.min, Math.min(range.max, nextValue));
  }
  suricataDrawerDraft[field] = nextValue;
  renderSuricataDrawerContent();
}

function renderThresholdSliderControl(field, value) {
  const range = SURICATA_BEHAVIOR_RANGES[field];
  if (!range) return renderSuricataValue(formatThresholdValue(field, value));
  const numericValue = Number(value);
  const sliderValue = Number.isFinite(numericValue) ? numericValue : range.min;
  return `
    <div class="suri-count-control suri-threshold-slider-control">
      <input
        class="suri-count-slider is-behavior"
        type="range"
        min="${range.min}"
        max="${range.max}"
        step="${range.step || 1}"
        value="${escapeHtml(String(sliderValue))}"
        style="--suri-count-fill:${getFillPercent(sliderValue, range.min, range.max)}%;"
        oninput="setThresholdSetting('${escapeJsSingleQuoted(field)}', this.value)"
      />
      <input
        class="suri-count-input is-behavior"
        type="text"
        inputmode="decimal"
        value="${escapeHtml(String(field === "slowMultiplier" ? sliderValue.toFixed(1) : sliderValue))}"
        onchange="setThresholdSetting('${escapeJsSingleQuoted(field)}', this.value)"
      />
    </div>
  `;
}

function renderThresholdSettingsDrawerContent(state) {
  const slowMode = getParamEditorMode("thresholdSlow");
  const noisyMode = getParamEditorMode("thresholdNoisy");
  const staleMode = getParamEditorMode("thresholdStale");
  const slowBody =
    slowMode === "verbose"
      ? [
          renderSuricataRow(
            "Median Multiplier",
            renderThresholdSliderControl(
              "slowMultiplier",
              state.slowMultiplier,
            ),
            { muted: true, info: true },
          ),
          renderSuricataRow(
            "Absolute Time",
            renderThresholdSliderControl(
              "slowAbsoluteMicros",
              state.slowAbsoluteMicros,
            ),
            { muted: true, info: true },
          ),
        ].join("")
      : renderParamSentence(`
        <span class="suri-param-text">Flag slow rules whose avg match time exceeds</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "slowMultiplier",
            formatThresholdValue("slowMultiplier", state.slowMultiplier),
            ["1.5x", "2.0x", "2.5x", "3.0x", "4.0x"],
          ),
        )}
        <span class="suri-param-text">the median, or exceeds</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "slowAbsoluteMicros",
            formatThresholdValue(
              "slowAbsoluteMicros",
              state.slowAbsoluteMicros,
            ),
            ["250µs", "500µs", "750µs", "1000µs", "1500µs"],
          ),
        )}
        <span class="suri-param-text">absolute time.</span>
      `);
  const noisyBody =
    noisyMode === "verbose"
      ? [
          renderSuricataRow(
            "Top Percentile",
            renderThresholdSliderControl(
              "noisyPercentile",
              state.noisyPercentile,
            ),
            { muted: true, info: true },
          ),
          renderSuricataRow(
            "Time Window",
            renderSuricataMadlibSelect(
              "noisyWindow",
              state.noisyWindow,
              THRESHOLD_NOISY_WINDOW_OPTIONS,
            ),
            { muted: true, info: true },
          ),
        ].join("")
      : renderParamSentence(`
        <span class="suri-param-text">Flag noisy rules in the top</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "noisyPercentile",
            formatThresholdValue("noisyPercentile", state.noisyPercentile),
            ["1%", "5%", "10%", "15%", "25%"],
          ),
        )}
        <span class="suri-param-text">by alert volume over</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "noisyWindow",
            state.noisyWindow,
            THRESHOLD_NOISY_WINDOW_OPTIONS,
          ),
        )}
        <span class="suri-param-text">.</span>
      `);
  const staleBody =
    staleMode === "verbose"
      ? [
          renderSuricataRow(
            "No Hits For",
            renderThresholdSliderControl("staleDays", state.staleDays),
            { muted: true, info: true },
          ),
          renderSuricataRow(
            "Flag Inactive Rules",
            renderSuricataToggle(
              "flagInactiveRules",
              state.flagInactiveRules,
              false,
            ),
            { muted: true, info: true },
          ),
        ].join("")
      : renderParamSentence(`
        <span class="suri-param-text">Flag stale rules that haven’t fired in</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "staleDays",
            formatThresholdValue("staleDays", state.staleDays),
            ["7 days", "14 days", "30 days", "60 days", "90 days", "180 days"],
          ),
        )}
        <span class="suri-param-text">or more, and</span>
        ${renderParamInlineControl(
          renderSuricataMadlibSelect(
            "flagInactiveRules",
            state.flagInactiveRules
              ? "flag inactive rules"
              : "ignore inactive rules",
            ["flag inactive rules", "ignore inactive rules"],
          ),
        )}
        <span class="suri-param-text">.</span>
      `);
  return [
    renderSuricataCard("Slow Performance", slowBody, {
      info: true,
      accordionId: "thresholdSlow",
      headerControls: renderParamEditorModeToggle("thresholdSlow"),
    }),
    renderSuricataCard("Noisy Volume", noisyBody, {
      info: true,
      accordionId: "thresholdNoisy",
      headerControls: renderParamEditorModeToggle("thresholdNoisy"),
    }),
    renderSuricataCard("Staleness", staleBody, {
      info: true,
      accordionId: "thresholdStale",
      headerControls: renderParamEditorModeToggle("thresholdStale"),
    }),
  ].join("");
}

const SURI_DRAWER_STATUS_BANNER_META = {
  "read-only": {
    tone: "readonly",
    title: "Read-only",
    description: "To customize, duplicate it and edit the copy.",
    icon: "info",
  },
  broken: {
    tone: "danger",
    title: "Broken",
    description:
      "This rule contains errors or invalid logic and will not function correctly.",
    icon: "broken",
  },
};

function renderSuricataBannerIcon(iconKind) {
  if (iconKind === "broken") {
    return `<span class="svg-icon suri-drawer-banner-svg-icon" style="--icon-url: url('${escapeHtml(SURI_ICON_ERROR_FILL_SRC)}')" aria-hidden="true"></span>`;
  }
  return `
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.1" stroke="currentColor" stroke-width="1.8"></circle>
      <path d="M10 8.15v4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <circle cx="10" cy="5.85" r="1.05" fill="currentColor"></circle>
    </svg>
  `;
}

function getSuricataDrawerOperationalTags(rule) {
  return Array.isArray(rule?.ruleStateTags)
    ? rule.ruleStateTags.filter(Boolean).filter((tag) => {
        const label = String(tag?.label || "").toLowerCase();
        return label === "broken";
      })
    : [];
}

function renderSuricataDrawerBanner(metaKey, rule = null) {
  const meta = SURI_DRAWER_STATUS_BANNER_META[metaKey];
  if (!meta) return "";
  return `
    <div class="suri-drawer-banner tone-${escapeHtml(meta.tone)}">
      <span class="suri-drawer-banner-icon" aria-hidden="true">${renderSuricataBannerIcon(meta.icon)}</span>
      <span class="suri-drawer-banner-copy"><strong>${escapeHtml(meta.title)}:</strong> ${escapeHtml(meta.description)}</span>
    </div>
  `;
}

function renderHistoricalVersionBanner(state) {
  const selectedEntry = getSelectedDrawerVersionEntry(suricataDrawerBaseline);
  if (!selectedEntry || selectedEntry.isCurrent) return "";
  const savedAt = selectedEntry.savedAt
    ? ` Saved ${selectedEntry.savedAt}.`
    : "";
  return `
    <div class="suri-drawer-banner tone-readonly">
      <span class="suri-drawer-banner-icon" aria-hidden="true">${renderSuricataBannerIcon("info")}</span>
      <span class="suri-drawer-banner-copy"><strong>Older Version:</strong> Viewing ${escapeHtml(selectedEntry.label)}.${escapeHtml(savedAt)} Older versions are read-only.</span>
    </div>
  `;
}

function renderSuricataDrawerBannerStack(rule) {
  if (!rule) return "";
  const banners = [];
  const historicalBanner = renderHistoricalVersionBanner(rule);
  if (historicalBanner) {
    banners.push(historicalBanner);
  }
  if (
    String(rule.source || "") === "Emerging Threats PRO" ||
    drawerVariant === "default-alert"
  ) {
    banners.push(renderSuricataDrawerBanner("read-only"));
  }
  getSuricataDrawerOperationalTags(rule).forEach((tag) => {
    const metaKey = String(tag?.label || "")
      .trim()
      .toLowerCase();
    if (SURI_DRAWER_STATUS_BANNER_META[metaKey]) {
      banners.push(renderSuricataDrawerBanner(metaKey, rule));
    }
  });
  if (!banners.length) return "";
  return `<div class="suri-drawer-banner-stack">${banners.join("")}</div>`;
}

function renderDrawerVersionSelector(state) {
  const entries = normalizeDrawerVersionHistory(state);
  const selectedEntry = getSelectedDrawerVersionEntry(state);
  if (editMode || !selectedEntry) {
    return renderSuricataValue(state.version);
  }
  const menuKey = "drawer:version-history";
  const isOpen = suricataOpenMenuKey === menuKey;
  const renderedOptions = entries
    .map((entry) => {
      const selectedClass = entry.id === state.selectedVersionId ? " is-selected" : "";
      const savedAt = entry.savedAt ? ` · ${entry.savedAt}` : "";
      return `
        <button
          type="button"
          class="menu-item suri-menu-option${selectedClass}"
          onclick="selectDrawerVersion(event, '${escapeJsSingleQuoted(entry.id)}', '${escapeJsSingleQuoted(menuKey)}')"
        >
          ${renderMenuValueContent(`${entry.label}${savedAt}`, "")}
        </button>
      `;
    })
    .join("");
  return `
    <div class="suri-menu suri-madlib-menu${isOpen ? " is-open" : ""}" data-menu-key="${escapeHtml(menuKey)}">
      <button
        type="button"
        class="btn-reset btn-secondary size-m style-outline suri-madlib-trigger"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        onclick="toggleSuricataMenu(event, '${escapeJsSingleQuoted(menuKey)}')"
      >
        <span class="btn-secondary-labelgroup">
          <span class="btn-label suri-madlib-trigger-label">${escapeHtml(selectedEntry.label)}</span>
        </span>
        <span class="btn-chevron-slot" aria-hidden="true">
          <img class="suri-madlib-trigger-icon" src="${SURI_MENU_DROPDOWN_ICON_SRC}" alt="" />
        </span>
      </button>
      <div class="menu-list" role="listbox">
        ${renderedOptions}
      </div>
    </div>
  `;
}

function renderSuricataBehaviorSliderControl(field, value) {
  const range = SURICATA_BEHAVIOR_RANGES[field];
  if (!range) return renderSuricataValue(value);
  if (!editMode) {
    return renderSuricataValue(String(value));
  }
  return `
    <div class="suri-count-control suri-behavior-slider-control">
      <input
        id="suriBehaviorSlider-${escapeHtml(field)}"
        class="suri-count-slider is-behavior"
        type="range"
        min="${range.min}"
        max="${range.max}"
        value="${escapeHtml(String(value))}"
        style="--suri-count-fill:${getFillPercent(Number(value), range.min, range.max)}%;"
        oninput="syncSuricataBehaviorFieldFromSlider('${escapeJsSingleQuoted(field)}', this.value)"
      />
      <input
        id="suriBehaviorInput-${escapeHtml(field)}"
        class="suri-count-input is-behavior"
        type="text"
        inputmode="numeric"
        value="${escapeHtml(String(value))}"
        oninput="syncSuricataBehaviorFieldFromInput('${escapeJsSingleQuoted(field)}', this.value)"
        onblur="commitSuricataBehaviorFieldInput('${escapeJsSingleQuoted(field)}')"
      />
    </div>
  `;
}

function renderDerivedConfigBlock(content) {
  return `
    <div class="suri-rule-config-shell is-derived is-standalone">
      <pre class="suri-rule-config-code is-derived">${escapeHtml(content)}</pre>
    </div>
  `;
}

function toggleRuleConfigEdit() {
  if (ruleConfigEditMode) {
    ruleConfigEditMode = false;
    renderSuricataDrawerContent();
    return;
  }
  showYamlWarning();
}

function renderDefaultAlertDrawerContent(container, state) {
  syncDefaultAlertFilterLabels(state);
  const historicalReadOnly = isViewingHistoricalDrawerVersion();
  const defaultAlertReadOnly = true;
  const descriptionBox = editMode
    ? `
      <div class="drawer-description-shell">
        <textarea
          class="drawer-description-input"
          oninput="onDefaultDescriptionInput(this.value)"
        >${escapeHtml(state.description ?? "")}</textarea>
      </div>
    `
    : `
      <div class="drawer-description-shell">
        <div class="drawer-description-text">${escapeHtml(state.description ?? "")}</div>
      </div>
    `;

  const enabledBody = [
    renderSuricataRow(
      "Enabled",
      renderSuricataToggle(
        "enabled",
        state.enabled,
        historicalReadOnly || defaultAlertReadOnly,
      ),
      { className: "is-borderless" },
    ),
  ].join("");

  const versionBody = [
    renderSuricataRow(
      "Version",
      renderDrawerVersionSelector(state),
      { className: "is-borderless" },
    ),
  ].join("");

  const thresholdControl = editMode
    ? `
      <div class="suri-count-control default-slider-control">
        <input
          id="defaultThresholdSlider"
          class="suri-count-slider is-default"
          type="range"
          min="${THRESHOLD_MIN}"
          max="${THRESHOLD_MAX}"
          value="${state.threshold}"
          style="--suri-count-fill:${getFillPercent(state.threshold, THRESHOLD_MIN, THRESHOLD_MAX)}%;"
          oninput="syncDefaultThresholdFromSlider(this.value)"
        />
        <input
          id="defaultThresholdInput"
          class="suri-count-input is-threshold"
          type="text"
          inputmode="numeric"
          value="${escapeHtml(String(state.threshold))}"
          oninput="syncDefaultThresholdFromInput(this.value)"
          onblur="commitDefaultThresholdInput()"
        />
      </div>
    `
    : renderSuricataValue(state.threshold);

  const quotaControl = editMode
    ? `
      <div class="suri-count-control default-slider-control">
        <input
          id="defaultQuotaSlider"
          class="suri-count-slider is-default"
          type="range"
          min="${DEFAULT_QUOTA_MIN}"
          max="${DEFAULT_QUOTA_MAX}"
          value="${state.quota}"
          style="--suri-count-fill:${getFillPercent(state.quota, DEFAULT_QUOTA_MIN, DEFAULT_QUOTA_MAX)}%;"
          oninput="syncDefaultQuotaFromSlider(this.value)"
        />
        <input
          id="defaultQuotaInput"
          class="suri-count-input is-quota"
          type="text"
          inputmode="numeric"
          value="${escapeHtml(formatNumberCompact(state.quota))}"
          oninput="syncDefaultQuotaFromInput(this.value)"
          onblur="commitDefaultQuotaInput()"
        />
      </div>
    `
    : renderSuricataValue(formatNumberCompact(state.quota));

  const alertParametersBody = [
    renderSuricataRow(
      "Schedule",
      editMode
        ? renderSuricataSelect("schedule", state.schedule, [
            "Auto",
            "Every 1 Hour",
            "Every 6 Hours",
            "Every 12 Hours",
            "Every 24 Hours",
            "Every 7 days",
            "Every 30 days",
            "Every 90 days",
          ])
        : renderSuricataValue(state.schedule),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Time Range",
      editMode
        ? renderSuricataSelect("timeRange", state.timeRange, [
            "Auto",
            "Last 1 Hour",
            "Last 4 Hours",
            "Last 6 Hours",
            "Last 8 Hours",
            "Last 12 Hours",
            "Last 24 Hours",
            "Last 7 days",
          ])
        : renderSuricataValue(state.timeRange),
      { muted: true, info: true },
    ),
    renderSuricataRow("Threshold", thresholdControl, {
      muted: true,
      info: true,
    }),
    renderSuricataRow("Quota", quotaControl, { muted: true, info: true }),
  ].join("");

  const defaultAlertFiltersMode = getParamEditorMode("defaultAlertFilters");
  const alertFiltersBody =
    defaultAlertFiltersMode === "simple"
      ? renderDefaultAlertFiltersSimpleBody(state)
      : renderDefaultAlertFiltersVerboseBody(state);

  const referencesBody = state.references
    .map(
      (ref) => `
        <a class="suri-reference-link" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">
          <span class="svg-icon suri-reference-link-icon" aria-hidden="true"></span>
          <span>${escapeHtml(ref.title)}</span>
        </a>
      `,
    )
    .join("");
  const configBody = buildDefaultAlertDerivedConfig(state);

  container.innerHTML = [
    renderSuricataDrawerBannerStack(state),
    descriptionBox,
    `<section class="card suri-card"><div class="card-body suri-card-body">${enabledBody}</div></section>`,
    `<section class="card suri-card"><div class="card-body suri-card-body">${versionBody}</div></section>`,
    renderSuricataCard("Alert Parameters", alertParametersBody, {
      info: true,
      accordionId: "alertParameters",
    }),
    renderSuricataCard("Alert Filters", alertFiltersBody, {
      info: true,
      accordionId: "alertFilters",
      headerControls: editMode
        ? renderParamEditorModeToggle("defaultAlertFilters")
        : "",
    }),
    renderSuricataCard("References", referencesBody, {
      info: true,
      accordionId: "references",
    }),
    renderDerivedConfigBlock(configBody),
  ].join("");
  requestAnimationFrame(() => {
    syncAllScopeSuggestionAnchors();
    syncAllDefaultAlertFilterSuggestionAnchors();
    syncAllSuricataMenuPanels();
  });
}

function renderSuricataDrawerContent() {
  const container = getDrawerContentEl();
  const state = getActiveDrawerState();
  if (!container || !state) return;
  captureSuricataMenuScrollState();

  if (drawerVariant === "threshold-settings") {
    container.innerHTML = renderThresholdSettingsDrawerContent(state);
    return;
  }

  if (drawerVariant === "variables") {
    renderVariableDrawerContent(container, state);
    return;
  }

  if (drawerVariant === "default-alert") {
    renderDefaultAlertDrawerContent(container, state);
    restoreSuricataSubnetMenuScroll();
    return;
  }

  const basicBody = [
    renderSuricataRow(
      "Enabled",
      renderSuricataToggle("enabled", state.enabled, isViewingHistoricalDrawerVersion()),
      { className: "is-borderless" },
    ),
  ].join("");

  const versionPriorityBody = [
    renderSuricataRow(
      "Version",
      renderDrawerVersionSelector(state),
      { muted: true },
    ),
    renderSuricataRow(
      "Priority",
      editMode
        ? renderSuricataSelect("priority", state.priority, [
            "1 · High",
            "2 · Medium",
            "3 · Low",
          ])
        : renderSuricataValue(state.priority),
      { muted: true, className: "is-borderless" },
    ),
  ].join("");

  const sidClassBody = [
    renderSuricataRow(
      "SID",
      editMode
        ? renderSuricataInput("sid", state.sid)
        : renderSuricataValue(state.sid),
      { muted: true },
    ),
    renderSuricataRow(
      "Class",
      editMode
        ? renderSuricataSelect("classType", state.classType, [
            "trojan-activity",
            "attempted-admin",
            "policy-violation",
          ])
        : renderSuricataValue(state.classType),
      { muted: true, className: "is-borderless" },
    ),
  ].join("");

  const metadataCardGrid = `
    <div class="suri-card-grid">
      <section class="card suri-card"><div class="card-body suri-card-body">${versionPriorityBody}</div></section>
      <section class="card suri-card"><div class="card-body suri-card-body">${sidClassBody}</div></section>
    </div>
  `;

  const basicCardsMarkup = [
    `<section class="card suri-card"><div class="card-body suri-card-body">${basicBody}</div></section>`,
    metadataCardGrid,
  ].join("");

  const ruleScopeBody =
    getParamEditorMode("ruleScope") === "simple"
      ? renderSuricataScopeSimpleBody(state)
      : renderSuricataScopeVerboseBody(state);

  ensureRulePatterns(state);
  const rulePatternsBody = renderRulePatternsBody(state);

  const countControl = renderSuricataBehaviorSliderControl(
    "count",
    state.count,
  );
  const secondsControl = renderSuricataBehaviorSliderControl(
    "seconds",
    state.seconds,
  );
  const minutesControl = renderSuricataBehaviorSliderControl(
    "minutes",
    state.minutes,
  );
  const hoursControl = renderSuricataBehaviorSliderControl(
    "hours",
    state.hours,
  );
  const limitCountControl = renderSuricataBehaviorSliderControl(
    "limitCount",
    state.limitCount,
  );

  const behaviorAdvancedVerboseExpansion = [
    renderSuricataRow(
      "Limit",
      renderSuricataToggle("limitEnabled", state.limitEnabled, !editMode),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Number of Alerts",
      limitCountControl,
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Override",
      renderSuricataToggle("overrideEnabled", state.overrideEnabled, !editMode),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Priority",
      editMode
        ? renderSuricataSelect(
            "overridePriority",
            state.overridePriority,
            SURICATA_BEHAVIOR_PRIORITY_OPTIONS,
          )
        : renderSuricataValue(state.overridePriority),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Suppress",
      renderSuricataToggle("suppressEnabled", state.suppressEnabled, !editMode),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Track By",
      editMode
        ? renderSuricataSelect(
            "suppressTrackBy",
            state.suppressTrackBy,
            SURICATA_BEHAVIOR_SUPPRESS_TRACK_OPTIONS,
          )
        : renderSuricataValue(state.suppressTrackBy),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Host or Subnet",
      editMode
        ? renderSuricataInput(
            "suppressHost",
            state.suppressHost,
            "e.g. 192.168.1.0/24",
          )
        : renderSuricataValue(state.suppressHost || "—"),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Flowbits",
      renderSuricataToggle("flowbitsEnabled", state.flowbitsEnabled, !editMode),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Action on Match",
      editMode
        ? renderSuricataSelect(
            "flowbitsAction",
            state.flowbitsAction,
            SURICATA_BEHAVIOR_FLOWBITS_ACTION_OPTIONS,
          )
        : renderSuricataValue(state.flowbitsAction),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Flag",
      editMode
        ? renderSuricataMadlibCombobox(
            "flowbitsFlag",
            state.flowbitsFlag,
            SURICATA_BEHAVIOR_FLOWBITS_FLAG_OPTIONS,
            "flag name",
          )
        : renderSuricataValue(state.flowbitsFlag || "—"),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Require",
      renderSuricataToggle("requireEnabled", state.requireEnabled, !editMode),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Flag",
      editMode
        ? renderSuricataMadlibCombobox(
            "requireCriteriaFlag",
            state.requireCriteriaFlag,
            SURICATA_BEHAVIOR_FLOWBITS_FLAG_OPTIONS,
            "e.g. auth_attempted",
          )
        : renderSuricataValue(state.requireCriteriaFlag || "—"),
      { muted: true, indentLevel: 1 },
    ),
    renderSuricataRow(
      "Criteria to Match",
      editMode
        ? renderSuricataSelect(
            "requireCriteriaState",
            state.requireCriteriaState,
            SURICATA_BEHAVIOR_REQUIRE_STATE_OPTIONS,
          )
        : renderSuricataValue(state.requireCriteriaState),
      { muted: true, indentLevel: 1, className: "is-borderless" },
    ),
  ].join("");

  const ruleBehaviorsVerboseBody = [
    renderSuricataRow(
      "Action",
      editMode
        ? renderSuricataSelect(
            "action",
            state.action,
            SURICATA_BEHAVIOR_ACTION_OPTIONS,
          )
        : renderSuricataValue(state.action),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Message",
      editMode
        ? renderSuricataInput("message", state.message, "Enter message…")
        : renderSuricataValue(state.message || "—"),
      { muted: true, info: true },
    ),
    renderSuricataRow(
      "Track By",
      editMode
        ? renderSuricataSelect(
            "trackBy",
            state.trackBy,
            SURICATA_BEHAVIOR_TRACK_BY_OPTIONS,
          )
        : renderSuricataValue(state.trackBy),
      { muted: true, info: true },
    ),
    renderSuricataRow("Count", countControl, { muted: true, info: true }),
    renderSuricataRow("Seconds", secondsControl, { muted: true, info: true }),
    renderSuricataRow("Minutes", minutesControl, { muted: true, info: true }),
    renderSuricataRow("Hours", hoursControl, { muted: true, info: true }),
    renderSuricataRow("Advanced Settings", "", {
      disclosureId: "behaviorAdvancedSettings",
      info: true,
    }),
    renderSuricataRowExpansion(behaviorAdvancedVerboseExpansion, {
      expanded: suricataRowAccordionState.behaviorAdvancedSettings,
      disclosureId: "behaviorAdvancedSettings",
      rowGroup: true,
    }),
  ].join("");

  const ruleBehaviorsBody =
    getParamEditorMode("ruleBehaviors") === "simple"
      ? renderRuleBehaviorsSimpleBody(state)
      : ruleBehaviorsVerboseBody;

  const referencesHeaderControls = editMode
    ? `<button class="suri-inline-action" type="button" onclick="event.stopPropagation();addSuricataReference()">Add</button>`
    : "";
  const referencesBody = editMode
    ? state.references
        .map(
          (ref, index) => `
        <div class="suri-reference-edit-row">
          <input class="suri-reference-name" type="text" value="${escapeHtml(ref.title)}" onchange="updateSuricataReference(${index}, 'title', this.value)" />
          <input class="suri-reference-url" type="text" value="${escapeHtml(ref.url)}" onchange="updateSuricataReference(${index}, 'url', this.value)" />
          <button type="button" class="suri-reference-delete" onclick="removeSuricataReference(${index})">
            <span class="svg-icon suri-delete-icon" aria-hidden="true"></span>
          </button>
        </div>
      `,
        )
        .join("")
    : state.references
        .map(
          (ref) =>
            `<a class="suri-reference-link" href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">↗ ${escapeHtml(ref.title)}</a>`,
        )
        .join("");

  const configBody = buildSuricataDerivedConfig(state);

  container.innerHTML = [
    renderSuricataDrawerBannerStack(state),
    basicCardsMarkup,
    renderSuricataCard("Scope", ruleScopeBody, {
      info: true,
      accordionId: "ruleScope",
      headerControls: editMode ? renderParamEditorModeToggle("ruleScope") : "",
    }),
    renderSuricataCard("Pattern", rulePatternsBody, {
      info: true,
      accordionId: "rulePatterns",
      headerControls: editMode ? renderRulePatternsAddControl() : "",
    }),
    renderSuricataCard("Behavior", ruleBehaviorsBody, {
      info: true,
      accordionId: "ruleBehaviors",
      headerControls: editMode
        ? renderParamEditorModeToggle("ruleBehaviors")
        : "",
    }),
    renderSuricataCard("References", referencesBody, {
      info: true,
      accordionId: "references",
      headerControls: referencesHeaderControls,
    }),
    renderDerivedConfigBlock(configBody),
  ].join("");
  restoreSuricataSubnetMenuScroll();
  requestAnimationFrame(() => {
    syncAllScopeSuggestionAnchors();
    syncAllDefaultAlertFilterSuggestionAnchors();
    syncAllSuricataMenuPanels();
  });
}

function openDrawerForRule(rule) {
  if (!rule) return;
  selectedRule = rule.id;
  drawerVariant = isDefaultAlertsRule(rule) ? "default-alert" : "suricata";
  suricataDrawerBaseline = createDrawerStateForRule(rule);
  suricataDrawerDraft = cloneDrawerState(suricataDrawerBaseline);
  drawerRenameMode = false;
  ruleConfigEditMode = false;
  suricataAccordionState = { ...SURICATA_ACCORDION_DEFAULT_STATE };
  defaultAlertAccordionState = { ...DEFAULT_ALERT_ACCORDION_DEFAULT_STATE };
  suricataRowAccordionState = { ...SURICATA_ROW_ACCORDION_DEFAULT_STATE };
  suricataOpenMenuKey = null;
  resetParamEditorModes();
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  syncDrawerHeaderActions();

  syncDrawerTitle();
  document.getElementById("drawer").classList.add("open");
  document.querySelector(".modal-body").classList.add("drawer-open");
  renderSuricataDrawerContent();
  renderRules();
}

function openDrawer(ruleId) {
  const rule =
    currentRules.find((item) => item.id === ruleId) ||
    (typeof suricataRuleDb !== "undefined"
      ? suricataRuleDb.find((item) => item.id === ruleId)
      : null) ||
    (typeof teleseerRuleDb !== "undefined"
      ? teleseerRuleDb.find((item) => item.id === ruleId)
      : null);
  if (!rule) return;
  openDrawerForRule(rule);
}

function openThresholdSettingsDrawer() {
  closeCopyRuleDialog();
  selectedRule = null;
  drawerVariant = "threshold-settings";
  suricataDrawerBaseline = createThresholdSettingsState();
  suricataDrawerDraft = cloneDrawerState(suricataDrawerBaseline);
  editMode = true;
  drawerRenameMode = false;
  ruleConfigEditMode = false;
  suricataOpenMenuKey = null;
  suricataAccordionState = {
    ...SURICATA_ACCORDION_DEFAULT_STATE,
    thresholdSlow: true,
    thresholdNoisy: true,
    thresholdStale: true,
  };
  resetParamEditorModes();
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  syncDrawerHeaderActions();
  syncDrawerTitle();
  document.getElementById("drawer").classList.add("open");
  document.querySelector(".modal-body").classList.add("drawer-open");
  renderSuricataDrawerContent();
}

function closeDrawer() {
  const wasVariableDrawer = drawerVariant === "variables";
  closeCopyRuleDialog();
  document.getElementById("drawer").classList.remove("open");
  document.querySelector(".modal-body").classList.remove("drawer-open");
  selectedRule = null;
  suricataOpenMenuKey = null;
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  editMode = false;
  drawerRenameMode = false;
  if (wasVariableDrawer && typeof onVariableDrawerClosed === "function") {
    onVariableDrawerClosed();
  }
  drawerVariant = "suricata";
  syncDrawerHeaderActions();
  syncDrawerTitle();
  renderRules();
}

function toggleEditMode() {
  if (drawerVariant === "default-alert") {
    return;
  }
  if (drawerVariant === "variables" || drawerVariant === "threshold-settings") {
    return;
  }
  if (isViewingHistoricalDrawerVersion()) {
    return;
  }
  editMode = true;
  drawerRenameMode = false;
  syncDrawerHeaderActions();
  suricataDrawerDraft = cloneDrawerState(
    suricataDrawerBaseline || createDrawerStateForRule(currentRules[0]),
  );
  ruleConfigEditMode = false;
  suricataOpenMenuKey = null;
  resetParamEditorModes();
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  syncDrawerTitle();
  renderSuricataDrawerContent();
}

function cancelEdit() {
  if (drawerVariant === "threshold-settings") {
    suricataDrawerDraft = cloneDrawerState(
      suricataDrawerBaseline || createThresholdSettingsState(),
    );
    closeDrawer();
    return;
  }
  if (
    drawerVariant === "variables" &&
    typeof cancelVariableDrawerEditMode === "function"
  ) {
    cancelVariableDrawerEditMode();
    return;
  }
  editMode = false;
  drawerRenameMode = false;
  syncDrawerHeaderActions();
  suricataDrawerDraft = cloneDrawerState(
    suricataDrawerBaseline || createDrawerStateForRule(currentRules[0]),
  );
  ruleConfigEditMode = false;
  suricataOpenMenuKey = null;
  resetParamEditorModes();
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  syncDrawerTitle();
  renderSuricataDrawerContent();
  renderRules();
}

function saveChanges() {
  if (drawerVariant === "threshold-settings") {
    suricataDrawerBaseline = cloneDrawerState(
      suricataDrawerDraft ||
        suricataDrawerBaseline ||
        createThresholdSettingsState(),
    );
    showToast("Threshold settings saved");
    closeDrawer();
    return;
  }
  if (
    drawerVariant === "variables" &&
    typeof saveVariableDrawerChangesImpl === "function"
  ) {
    saveVariableDrawerChangesImpl();
    return;
  }
  const previousBaseline = cloneDrawerState(
    suricataDrawerBaseline || createDrawerStateForRule(currentRules[0]),
  );
  if (suricataDrawerDraft) {
    suricataDrawerBaseline = cloneDrawerState(suricataDrawerDraft);
    appendDrawerVersionHistory(previousBaseline, suricataDrawerBaseline);
  }
  if (selectedRule && suricataDrawerBaseline) {
    const rule = currentRules.find((item) => item.id === selectedRule);
    if (rule) {
      rule.enabled = Boolean(suricataDrawerBaseline.enabled);
      rule.version = suricataDrawerBaseline.version;
      rule.versionHistory = cloneDrawerState(suricataDrawerBaseline.versionHistory);
      rule.selectedVersionId = suricataDrawerBaseline.selectedVersionId;
      if (typeof suricataDrawerBaseline.name === "string") {
        rule.name = suricataDrawerBaseline.name;
      }
      if (drawerVariant === "suricata") {
        rule.rulePatterns = cloneDrawerState(
          ensureRulePatterns(suricataDrawerBaseline),
        );
        rule.contentMatch = cloneDrawerState(
          suricataDrawerBaseline.contentMatch,
        );
        rule.regexPattern = suricataDrawerBaseline.regexPattern;
        rule.httpHeader = suricataDrawerBaseline.httpHeader;
        rule.httpHeaderField = suricataDrawerBaseline.httpHeaderField;
        rule.httpUri = suricataDrawerBaseline.httpUri;
        rule.dnsQuery = suricataDrawerBaseline.dnsQuery;
        rule.behaviorTriggerWord = suricataDrawerBaseline.behaviorTriggerWord;
        rule.trackBy = suricataDrawerBaseline.trackBy;
        rule.count = suricataDrawerBaseline.count;
        rule.seconds = suricataDrawerBaseline.seconds;
        rule.minutes = suricataDrawerBaseline.minutes;
        rule.hours = suricataDrawerBaseline.hours;
        rule.behaviorWindowUnit = suricataDrawerBaseline.behaviorWindowUnit;
        rule.behaviorWindowValue = suricataDrawerBaseline.behaviorWindowValue;
        rule.limitEnabled = suricataDrawerBaseline.limitEnabled;
        rule.limitCount = suricataDrawerBaseline.limitCount;
        rule.rateLimiting = suricataDrawerBaseline.limitEnabled;
      }
      if (
        drawerVariant === "default-alert" &&
        typeof suricataDrawerBaseline.description === "string"
      ) {
        rule.name = suricataDrawerBaseline.name;
        rule.description = suricataDrawerBaseline.description;
      }
    }
    const dbRule = suricataRuleDb.find((item) => item.id === selectedRule);
    if (dbRule) {
      dbRule.name = suricataDrawerBaseline.name;
      dbRule.enabled = Boolean(suricataDrawerBaseline.enabled);
      dbRule.version = suricataDrawerBaseline.version;
      dbRule.versionHistory = cloneDrawerState(suricataDrawerBaseline.versionHistory);
      dbRule.selectedVersionId = suricataDrawerBaseline.selectedVersionId;
    }
    const teleseerRule =
      typeof teleseerRuleDb !== "undefined"
        ? teleseerRuleDb.find((item) => item.id === selectedRule)
        : null;
    if (teleseerRule) {
      teleseerRule.name = suricataDrawerBaseline.name;
      teleseerRule.enabled = Boolean(suricataDrawerBaseline.enabled);
      teleseerRule.version = suricataDrawerBaseline.version;
      teleseerRule.versionHistory = cloneDrawerState(
        suricataDrawerBaseline.versionHistory,
      );
      teleseerRule.selectedVersionId = suricataDrawerBaseline.selectedVersionId;
      if (typeof suricataDrawerBaseline.description === "string") {
        teleseerRule.description = suricataDrawerBaseline.description;
      }
    }
  }
  editMode = false;
  drawerRenameMode = false;
  syncDrawerHeaderActions();
  ruleConfigEditMode = false;
  suricataOpenMenuKey = null;
  resetParamEditorModes();
  resetSuricataSubnetUiState();
  resetDefaultAlertFilterUiState();
  syncDrawerTitle();
  renderSuricataDrawerContent();
  renderRules();
  showToast("Changes saved successfully");
}

function toggleEnabled() {
  toggleSuricataToggle("enabled");
}
