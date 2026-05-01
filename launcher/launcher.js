const SIDEBAR_ITEMS = [
  {
    id: "projects",
    label: "Projects",
    icon: "../icons/icon_project_fill.svg",
    count: 8,
  },
  {
    id: "demo-projects",
    label: "Demo Projects",
    icon: "../icons/icon_project_demo.svg",
    count: 8,
  },
  {
    id: "files",
    label: "Files",
    icon: "../icons/icon_upload_sidebar.svg",
    count: 8,
  },
  {
    id: "feeds",
    label: "Feeds",
    icon: "../icons/icon_feed.svg",
    count: 8,
  },
  {
    id: "sensors",
    label: "Sensors",
    icon: "../icons/icon_sensor.svg",
    count: 8,
  },
];

const LAUNCHER_MENU_DROPDOWN_ICON_SRC = "../icons/icon_arrow_head_outline_down.svg";
const LAUNCHER_MENU_SELECT_ICON_SRC = "../icons/icon_dual_arrow_expand.svg";
const LAUNCHER_TABLE_VIEW_STORAGE_KEY = "teleseer.launcher.tableViewSettings.v1";

function loadLauncherTableViewSettings() {
  try {
    const parsed = JSON.parse(
      window.localStorage?.getItem(LAUNCHER_TABLE_VIEW_STORAGE_KEY) || "{}",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function persistLauncherTableViewSettings(value) {
  try {
    window.localStorage?.setItem(
      LAUNCHER_TABLE_VIEW_STORAGE_KEY,
      JSON.stringify(value),
    );
  } catch (error) {
    // Local file contexts can block storage; the in-memory table settings still apply.
  }
}

function getSharedLauncherProjectData() {
  return window.TeleseerAppData?.projects || {};
}

function getSharedFavoriteProjects() {
  const favorites = getSharedLauncherProjectData().favorites;
  if (Array.isArray(favorites) && favorites.length) {
    return cloneValue(favorites);
  }
  return [
    {
      id: "power-plant",
      label: "Power Plant",
      icon: "../icons/icon_place.svg",
      count: "",
    },
    {
      id: "widget-factory",
      label: "Widget Factory",
      icon: "../icons/icon_place.svg",
      count: "",
    },
    {
      id: "military-base",
      label: "Military Base",
      icon: "../icons/icon_place.svg",
      count: "",
    },
  ];
}

function getSharedLauncherProjectRows() {
  const rows = getSharedLauncherProjectData().launcherRows;
  if (Array.isArray(rows) && rows.length) {
    return cloneValue(rows);
  }
  return [
    {
      selected: false,
      name: "teleseer-dummy",
      subtext: "Hub workspace · 10.24.18.0/24",
      icon: "../icons/icon_project_fill.svg",
      viewerLink: "../viewer/viewer.html",
      files: "25",
      hosts: "25",
      subnets: "6",
      vlans: "5",
      size: "9.1 GB",
      duration: "15d 12h 12m",
      created: "Just now",
      status: {
        tone: "uploading",
        label: "Uploading 30%",
        extra: "sensor snr-phx-07",
      },
      tags: [
        { label: "Agent", tone: "agent" },
        { label: "OT-Lab", tone: "ot" },
        { label: "Hub", tone: "hub" },
      ],
    },
    {
      selected: false,
      name: "Site Julio",
      subtext: "remote-west-grid · 172.16.40.0/21",
      icon: "../icons/icon_project_fill.svg",
      files: "25",
      hosts: "21",
      subnets: "4",
      vlans: "6",
      size: "3.3 GB",
      duration: "3d 5h 6m",
      created: "30m ago",
      status: {
        tone: "queued",
        label: "Queued",
        extra: "awaiting parser slot",
      },
      tags: [
        { label: "Agent", tone: "agent" },
        { label: "Remote", tone: "remote" },
        { label: "Hub", tone: "hub" },
      ],
    },
    {
      selected: false,
      name: "Hospital East Wing",
      subtext: "remote-med-east · 192.168.44.0/24",
      icon: "../icons/icon_project_fill.svg",
      files: "25",
      hosts: "37",
      subnets: "8",
      vlans: "3",
      size: "9.5 GB",
      duration: "15d 12h 12m",
      created: "2h ago",
      status: {
        tone: "warning",
        label: "Sync delayed 14m",
        extra: "sensor heartbeat stale",
      },
      tags: [
        { label: "Agent", tone: "agent" },
        { label: "OT-Lab", tone: "ot" },
        { label: "Hub", tone: "hub" },
      ],
    },
    {
      selected: false,
      readOnly: true,
      name: "Coastal Relay Mirror",
      subtext: "remote-maritime · 10.201.70.0/24",
      icon: "../icons/icon_project_fill.svg",
      files: "12",
      hosts: "14",
      subnets: "2",
      vlans: "2",
      size: "2.7 GB",
      duration: "6h 42m",
      created: "Yesterday",
      status: {
        tone: "restricted",
        label: "Read-only mirror",
        extra: "partner workspace",
      },
      tags: [
        { label: "Remote", tone: "remote" },
        { label: "Read-only", tone: "read-only" },
        { label: "Hub", tone: "hub" },
      ],
    },
  ];
}

const FAVORITE_PROJECTS = getSharedFavoriteProjects();

function createFeedProducedFiles(prefix, entries) {
  return entries.map((entry, index) => ({
    id: `${prefix}-file-${index + 1}`,
    name: entry.name,
    size: entry.size,
    created: entry.created,
    tone: entry.tone || "ready",
    note: entry.note || "",
  }));
}

function createFeedSuricataRules(prefix, entries) {
  return entries.map((entry, index) => ({
    id: `${prefix}-rule-${index + 1}`,
    name: entry.name,
    projectCount: Number(entry.projectCount || 0),
    projects: Array.isArray(entry.projects) ? entry.projects : [],
    action: entry.action || "alert",
  }));
}

const SECTION_CONTENT = {
  projects: {
    id: "projects",
    title: "Projects",
    searchPlaceholder: "Search projects, subnets, tags, and ingest state...",
    emptyCopy:
      "No project matched this filter. Clear search or switch workspace context.",
    primaryActionLabel: "New Project",
    primaryActionDisabled: false,
    tableViewSettings: true,
    loadingMessage: "Refreshing project ingest and federation state...",
    stateChips: [
      { label: "Workspace: My Workspace (Hub)", tone: "syncing" },
      {
        label: "Federation: remote-west sync delayed 14m",
        tone: "warning",
      },
      {
        label: "RBAC: Analyst (remote projects read-only)",
        tone: "restricted",
      },
    ],
    columns: [
      {
        key: "select",
        label: "",
        type: "select",
        width: "44px",
        minWidth: 44,
        hideable: false,
        resizable: false,
      },
      {
        key: "name",
        label: "Name",
        type: "name",
        width: "330px",
        minWidth: 220,
        showSubtext: false,
        hideable: false,
      },
      {
        key: "files",
        label: "Files",
        type: "text",
        width: "90px",
        minWidth: 72,
      },
      {
        key: "hosts",
        label: "Hosts",
        type: "text",
        width: "90px",
        minWidth: 72,
      },
      {
        key: "subnets",
        label: "Subnets",
        type: "text",
        width: "96px",
        minWidth: 80,
      },
      {
        key: "vlans",
        label: "VLANs",
        type: "text",
        width: "88px",
        minWidth: 72,
      },
      {
        key: "size",
        label: "Size",
        type: "text",
        width: "100px",
        minWidth: 84,
      },
      { key: "duration", label: "Duration", type: "text", width: "130px", minWidth: 104 },
      { key: "created", label: "Created", type: "text", width: "110px", minWidth: 92 },
      { key: "status", label: "Status", type: "status", width: "220px", minWidth: 160 },
      { key: "tags", label: "Tags", type: "tags", width: "250px", minWidth: 140 },
      {
        key: "disclosure",
        label: "",
        type: "disclosure",
        width: "36px",
        hideable: false,
        resizable: false,
      },
    ],
    rows: getSharedLauncherProjectRows(),
  },
  files: {
    id: "files",
    title: "Files",
    searchPlaceholder: "Search files, hashes, projects, and ingest state...",
    emptyCopy: "No files match this filter in the current workspace scope.",
    primaryActionLabel: "Upload",
    primaryActionDisabled: false,
    utilityPrimary: {
      icon: "../icons/icon_upload_sidebar.svg",
      label: "Upload or import files",
    },
    utilitySecondary: {
      icon: "../icons/icon_sort_arrows.svg",
      label: "Sort file rows",
    },
    loadingMessage: "Refreshing file ingest queue and hash metadata...",
    stateChips: [
      { label: "Workspace: My Workspace / Files", tone: "syncing" },
      { label: "Ingest queue: 3 files", tone: "warning" },
      { label: "Restricted artifacts: 1 (remote mirror)", tone: "restricted" },
    ],
    columns: [
      { key: "select", label: "", type: "select", width: "44px" },
      { key: "name", label: "Name", type: "name", width: "360px" },
      { key: "type", label: "Type", type: "pill", width: "130px" },
      { key: "hash", label: "Hash", type: "mono", width: "160px" },
      {
        key: "size",
        label: "Size",
        type: "text",
        width: "110px",
      },
      {
        key: "entropy",
        label: "Entropy",
        type: "mono",
        width: "110px",
      },
      {
        key: "projects",
        label: "Projects",
        type: "projects",
        width: "170px",
      },
      { key: "status", label: "Status", type: "status", width: "220px" },
      { key: "disclosure", label: "", type: "disclosure", width: "36px" },
    ],
    rows: [
      {
        selected: false,
        name: "sample_plant_core.pcap",
        subtext: "sensor snr-phx-07 · queued 18s ago",
        icon: "../icons/icon_page_filled.svg",
        type: "PCAP",
        hash: "5414bc7",
        size: "9.1 MB",
        entropy: "6.28",
        projects: "8 Projects",
        status: {
          tone: "queued",
          label: "Queued",
          extra: "parser lane 2",
        },
      },
      {
        selected: false,
        name: "mysample2131.pcap",
        subtext: "manual upload · teleseer-dummy",
        icon: "../icons/icon_page_filled.svg",
        type: "PCAP",
        hash: "5414bc7",
        size: "3.3 MB",
        entropy: "2.23",
        projects: "3 Projects",
        status: {
          tone: "uploading",
          label: "Parsing 62%",
          extra: "flows extracting",
        },
      },
      {
        selected: false,
        name: "Sample_Text_ioc.txt",
        subtext: "report artifact · local upload",
        icon: "../icons/icon_page_filled.svg",
        type: "TXT",
        hash: "ec4a4d2",
        size: "1 MB",
        entropy: "1.23",
        projects: "1 Project",
        status: {
          tone: "ready",
          label: "Indexed",
          extra: "delta pack complete",
        },
      },
      {
        selected: false,
        name: "202202387_abc.csv",
        subtext: "integration dropbox · batch 77",
        icon: "../icons/icon_page_filled.svg",
        type: "CSV",
        hash: "fcb41a9",
        size: "9.5 MB",
        entropy: "7.89",
        projects: "9 Projects",
        status: {
          tone: "queued",
          label: "Queued",
          extra: "waiting checksum",
        },
      },
      {
        selected: false,
        name: "spine_capture_truncated.pcapng",
        subtext: "sensor snr-west-03 · malformed footer",
        icon: "../icons/icon_page_filled.svg",
        type: "PCAP",
        hash: "d41d8cd",
        size: "0 B",
        entropy: "0.07",
        projects: "1 Project",
        status: {
          tone: "error",
          label: "Rejected",
          extra: "truncated upload",
        },
      },
      {
        selected: false,
        readOnly: true,
        name: "remote_branch_snapshot.pcap",
        subtext: "remote-west mirror · read-only",
        icon: "../icons/icon_page_filled.svg",
        type: "PCAP",
        hash: "95ac882",
        size: "12.4 MB",
        entropy: "6.02",
        projects: "2 Projects",
        status: {
          tone: "restricted",
          label: "Read-only",
          extra: "federation policy",
        },
      },
    ],
  },
  feeds: {
    id: "feeds",
    title: "Capture Feeds",
    searchPlaceholder: "Search capture feed name or source...",
    emptyCopy:
      "No capture feeds match this filter. Adjust search, type, or status filters.",
    primaryActionLabel: "New Feed",
    primaryActionDisabled: false,
    utilityPrimary: null,
    utilitySecondary: null,
    loadingMessage:
      "Refreshing capture feed health, history windows, and subscription state...",
    stateChips: [
      { label: "Workspace capture feeds: 6", tone: "syncing" },
      { label: "No subscribed projects: 1", tone: "warning" },
      {
        label: "Capture feeds are workspace-level; projects subscribe in Viewer to analyze data",
        tone: "restricted",
      },
    ],
    filters: {
      type: ["all", "Napatech", "Generic Interface"],
      status: ["all", "active", "paused", "error", "syncing", "initializing"],
    },
    columns: [
      { key: "select", label: "", type: "select", width: "44px" },
      {
        key: "name",
        label: "Name",
        type: "name",
        width: "260px",
        sortable: true,
      },
      {
        key: "type",
        label: "Type",
        type: "feed-type",
        width: "160px",
        sortable: true,
      },
      {
        key: "source",
        label: "Source",
        type: "text",
        width: "240px",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        type: "status",
        width: "180px",
        sortable: true,
      },
      {
        key: "fileCount",
        label: "Files",
        type: "feed-file-count",
        width: "92px",
        sortable: true,
      },
      {
        key: "issueCount",
        label: "Issues",
        type: "feed-issues",
        width: "110px",
        sortable: true,
      },
      {
        key: "healthScore",
        label: "Health",
        type: "feed-health",
        width: "120px",
        sortable: true,
      },
      {
        key: "lastActivityMinutes",
        label: "Last Activity",
        type: "feed-activity",
        width: "140px",
        sortable: true,
      },
      {
        key: "subscriptionCount",
        label: "Project",
        type: "feed-subscriptions",
        width: "190px",
        sortable: true,
      },
      {
        key: "ingestSparkline",
        label: "History",
        type: "feed-sparkline",
        width: "120px",
        sortable: true,
      },
      { key: "disclosure", label: "", type: "disclosure", width: "36px" },
    ],
    rows: [
      {
        id: "feed-napatech-core-spine",
        selected: false,
        name: "Core Spine Capture",
        subtext: "Network Capture · Napatech",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Napatech",
        source: "Napatech · NT200-PHX-01 · Tap 0",
        deviceLabel: "NT200-PHX-01",
        captureInput: "Tap 0",
        portProfile: "2x100G",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 500,
        closeAndProcessSeconds: 60,
        captureRate: "312 MB/s",
        syncPercent: 64,
        status: {
          tone: "syncing",
          extra: "project handoff window at 64%",
        },
        healthScore: 91,
        lastActivityMinutes: 4,
        lastActivity: "4m ago",
        expectedIdleMinutes: 5,
        ingestSparkline: [28, 24, 25, 27, 22, 30, 32, 29, 26, 25, 23, 21],
        subscriptionCount: 3,
        description:
          "Live capture from the core spine mirror using a Napatech card profile tuned for high-throughput rollover.",
        retentionDays: 14,
        filterMode: "exclude",
        protocols: "TCP, UDP, ICMP",
        subnets: "10.24.18.0/24, 172.16.40.0/21",
        sourceSubnets: "10.24.18.0/24",
        destinationSubnets: "172.16.40.0/21",
        ports: "80, 443, 47808",
        vlanId: "103, 220",
        estimatedStorageReduction: 27,
        filterRulesCount: 4,
        rawBpf: "not (vlan 999) and (tcp or udp)",
        uptimePct: 99.41,
        files24h: 1198,
        fileErrorCount: 2,
        fileWarningCount: 3,
        volume24h: "38.7 GB",
        errorsPerDay: 1.1,
        sourceDetails: "Napatech NT200-PHX-01 · 2x100G layout · Tap 0",
        suricataRules: createFeedSuricataRules("core-spine", [
          {
            name: "ET POLICY Outbound SSH to Internet",
            projectCount: 2,
            projects: ["Power Plant", "teleseer-dummy"],
          },
          {
            name: "SURICATA TLS Cert Subject Mismatch",
            projectCount: 3,
            projects: ["Power Plant", "teleseer-dummy", "Widget Factory"],
          },
        ]),
        producedFiles: createFeedProducedFiles("core-spine", [
          {
            name: "core_spine_20260312_1035_001.pcap",
            size: "512 MB",
            created: "10:35",
            tone: "ready",
            note: "rolled cleanly",
          },
          {
            name: "core_spine_20260312_1036_002.pcap",
            size: "512 MB",
            created: "10:36",
            tone: "warning",
            note: "2.1% packet drop observed",
          },
          {
            name: "core_spine_20260312_1037_003.pcap",
            size: "511 MB",
            created: "10:37",
            tone: "ready",
            note: "queued for parser lane 4",
          },
          {
            name: "core_spine_20260312_1038_004.pcap",
            size: "509 MB",
            created: "10:38",
            tone: "error",
            note: "handoff retry required",
          },
          {
            name: "core_spine_20260312_1039_005.pcap",
            size: "512 MB",
            created: "10:39",
            tone: "ready",
            note: "suricata replay scheduled",
          },
          {
            name: "core_spine_20260312_1040_006.pcap",
            size: "508 MB",
            created: "10:40",
            tone: "warning",
            note: "late checksum confirmation",
          },
        ]),
        subscribedProjects: [
          { id: "power-plant", name: "Power Plant", sync: "synced" },
          { id: "teleseer-dummy", name: "teleseer-dummy", sync: "synced" },
          { id: "widget-factory", name: "Widget Factory", sync: "behind" },
        ],
        activityLog: [
          {
            type: "ingest",
            timestamp: "2026-03-12 10:40",
            message: "Capture rollover complete; 7 segments indexed",
          },
          {
            type: "error",
            timestamp: "2026-03-12 07:12",
            message: "Packet loss spike 2.7% resolved automatically",
          },
          {
            type: "subscription",
            timestamp: "2026-03-10 16:20",
            message: "Widget Factory sync drift flagged as behind",
          },
        ],
      },
      {
        id: "feed-generic-dmz-uplink",
        selected: false,
        name: "DMZ Uplink Mirror",
        subtext: "Network Capture · Generic Interface",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Generic Interface",
        source: "Generic Interface · snr-phx-07 · eno3",
        deviceLabel: "snr-phx-07",
        captureInput: "eno3",
        portProfile: "",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 500,
        closeAndProcessSeconds: 60,
        captureRate: "184 MB/s",
        status: {
          tone: "active",
          extra: "capture stable",
        },
        healthScore: 98,
        lastActivityMinutes: 2,
        lastActivity: "2m ago",
        expectedIdleMinutes: 5,
        ingestSparkline: [12, 14, 16, 11, 9, 13, 15, 18, 17, 14, 12, 10],
        subscriptionCount: 2,
        description:
          "Standard interface mirror capture from the DMZ uplink host for east perimeter investigations.",
        retentionDays: 14,
        filterMode: "exclude",
        protocols: "TCP, UDP",
        subnets: "10.24.18.0/24",
        sourceSubnets: "10.24.18.0/24",
        destinationSubnets: "198.51.100.0/24",
        ports: "80, 443",
        vlanId: "18",
        estimatedStorageReduction: 19,
        filterRulesCount: 3,
        rawBpf: "tcp and not host 10.24.18.9",
        uptimePct: 99.92,
        files24h: 241,
        fileErrorCount: 0,
        fileWarningCount: 1,
        volume24h: "12.4 GB",
        errorsPerDay: 0.2,
        sourceDetails: "Generic interface snr-phx-07 · eno3",
        suricataRules: createFeedSuricataRules("dmz-uplink", [
          {
            name: "ET INFO Outbound Web Session",
            projectCount: 2,
            projects: ["Power Plant", "Widget Factory"],
          },
          {
            name: "SURICATA HTTP Suspicious User-Agent",
            projectCount: 1,
            projects: ["Widget Factory"],
          },
        ]),
        producedFiles: createFeedProducedFiles("dmz-uplink", [
          {
            name: "dmz_uplink_20260312_1038_001.pcap",
            size: "498 MB",
            created: "10:38",
            tone: "ready",
            note: "ready for project replay",
          },
          {
            name: "dmz_uplink_20260312_1039_002.pcap",
            size: "500 MB",
            created: "10:39",
            tone: "ready",
            note: "stable capture handoff",
          },
          {
            name: "dmz_uplink_20260312_1040_003.pcap",
            size: "496 MB",
            created: "10:40",
            tone: "warning",
            note: "warning: source NIC jitter",
          },
          {
            name: "dmz_uplink_20260312_1041_004.pcap",
            size: "500 MB",
            created: "10:41",
            tone: "ready",
            note: "queued for parser lane 2",
          },
          {
            name: "dmz_uplink_20260312_1042_005.pcap",
            size: "500 MB",
            created: "10:42",
            tone: "ready",
            note: "export complete",
          },
        ]),
        subscribedProjects: [
          { id: "power-plant", name: "Power Plant", sync: "synced" },
          { id: "widget-factory", name: "Widget Factory", sync: "behind" },
        ],
        activityLog: [
          {
            type: "ingest",
            timestamp: "2026-03-12 10:42",
            message: "42 capture chunks ingested from the DMZ uplink mirror",
          },
          {
            type: "config",
            timestamp: "2026-03-10 18:19",
            message: "Chunk size increased from 256 MB to 500 MB",
          },
          {
            type: "subscription",
            timestamp: "2026-03-10 09:04",
            message: "Widget Factory subscribed (sync behind)",
          },
        ],
      },
      {
        id: "feed-napatech-plant-east",
        selected: false,
        name: "Plant East Capture",
        subtext: "Network Capture · Napatech",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Napatech",
        source: "Napatech · NT200-PLT-02 · Tap 1",
        deviceLabel: "NT200-PLT-02",
        captureInput: "Tap 1",
        portProfile: "8x10G",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 256,
        closeAndProcessSeconds: 45,
        captureRate: "0 MB/s",
        status: {
          tone: "paused",
          extra: "manual stop",
        },
        healthScore: 88,
        lastActivityMinutes: 57,
        lastActivity: "57m ago",
        expectedIdleMinutes: 5,
        ingestSparkline: [6, 7, 8, 6, 5, 4, 3, 4, 5, 6, 4, 3],
        subscriptionCount: 1,
        description:
          "Plant east mirror captured through a Napatech breakout profile; currently paused for maintenance validation.",
        retentionDays: 21,
        filterMode: "include",
        protocols: "TCP, UDP",
        subnets: "172.22.4.0/24",
        sourceSubnets: "172.22.4.0/24",
        destinationSubnets: "10.80.0.0/16",
        ports: "502, 44818",
        vlanId: "103",
        estimatedStorageReduction: 31,
        filterRulesCount: 1,
        rawBpf: "vlan 103 and (tcp or udp)",
        uptimePct: 98.84,
        files24h: 73,
        fileErrorCount: 0,
        fileWarningCount: 0,
        volume24h: "6.4 GB",
        errorsPerDay: 0.0,
        sourceDetails: "Napatech NT200-PLT-02 · 8x10G layout · Tap 1",
        suricataRules: createFeedSuricataRules("plant-east", [
          {
            name: "SURICATA Modbus Function Code Watch",
            projectCount: 1,
            projects: ["teleseer-dummy"],
          },
        ]),
        producedFiles: createFeedProducedFiles("plant-east", [
          {
            name: "plant_east_20260312_0828_001.pcap",
            size: "255 MB",
            created: "08:28",
            tone: "ready",
            note: "captured before stop",
          },
          {
            name: "plant_east_20260312_0830_002.pcap",
            size: "256 MB",
            created: "08:30",
            tone: "ready",
            note: "clean handoff",
          },
          {
            name: "plant_east_20260312_0832_003.pcap",
            size: "252 MB",
            created: "08:32",
            tone: "ready",
            note: "last file before maintenance",
          },
        ]),
        subscribedProjects: [
          { id: "teleseer-dummy", name: "teleseer-dummy", sync: "synced" },
        ],
        activityLog: [
          {
            type: "config",
            timestamp: "2026-03-12 09:22",
            message: "Feed stopped by Ricky Tan",
          },
          {
            type: "ingest",
            timestamp: "2026-03-12 08:36",
            message: "14 capture chunks indexed before maintenance window",
          },
        ],
      },
      {
        id: "feed-napatech-west-error",
        selected: false,
        name: "West Edge Mirror",
        subtext: "Network Capture · Napatech",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Napatech",
        source: "Napatech · NT200-WEST-01 · Tap 3",
        deviceLabel: "NT200-WEST-01",
        captureInput: "Tap 3",
        portProfile: "4x10/25G",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 500,
        closeAndProcessSeconds: 60,
        captureRate: "0 MB/s",
        status: {
          tone: "error",
          extra: "connector timeout",
        },
        healthScore: 43,
        lastActivityMinutes: 26,
        lastActivity: "26m ago",
        expectedIdleMinutes: 5,
        ingestSparkline: [9, 11, 8, 0, 0, 0, 3, 0, 0, 2, 0, 0],
        subscriptionCount: 2,
        description:
          "West edge Napatech capture is degraded due to connectivity issues between the card input and the upstream mirror path.",
        retentionDays: 21,
        filterMode: "exclude",
        protocols: "TCP, UDP, TLS",
        subnets: "10.16.0.0/16, 203.0.113.0/24",
        sourceSubnets: "10.16.0.0/16",
        destinationSubnets: "203.0.113.0/24",
        ports: "443, 8443, 17500-17600",
        vlanId: "44, 55",
        estimatedStorageReduction: 12,
        filterRulesCount: 6,
        rawBpf: "not (host 10.16.1.4 and port 443)",
        uptimePct: 92.11,
        files24h: 388,
        fileErrorCount: 12,
        fileWarningCount: 5,
        volume24h: "8.9 GB",
        errorsPerDay: 12.4,
        sourceDetails: "Napatech NT200-WEST-01 · 4x10/25G layout · Tap 3",
        errorDetails:
          "Timeout while rotating capture chunks on Tap 3. Last successful handoff was 26 minutes ago.",
        suricataRules: createFeedSuricataRules("west-edge", [
          {
            name: "ET POLICY Possible TLS Tunneling",
            projectCount: 2,
            projects: ["Widget Factory", "Military Base"],
          },
          {
            name: "SURICATA DNS Long Query Threshold",
            projectCount: 1,
            projects: ["Widget Factory"],
          },
          {
            name: "ET INFO JA3 Hash Drift",
            projectCount: 2,
            projects: ["Widget Factory", "Military Base"],
          },
        ]),
        producedFiles: createFeedProducedFiles("west-edge", [
          {
            name: "west_edge_20260312_0948_001.pcap",
            size: "500 MB",
            created: "09:48",
            tone: "ready",
            note: "last clean handoff",
          },
          {
            name: "west_edge_20260312_0951_002.pcap",
            size: "198 MB",
            created: "09:51",
            tone: "warning",
            note: "partial rollover",
          },
          {
            name: "west_edge_20260312_0954_003.pcap",
            size: "0 B",
            created: "09:54",
            tone: "error",
            note: "connector timeout",
          },
          {
            name: "west_edge_20260312_0957_004.pcap",
            size: "0 B",
            created: "09:57",
            tone: "error",
            note: "reopen failed",
          },
          {
            name: "west_edge_20260312_1000_005.pcap",
            size: "221 MB",
            created: "10:00",
            tone: "warning",
            note: "delayed checksum",
          },
          {
            name: "west_edge_20260312_1003_006.pcap",
            size: "0 B",
            created: "10:03",
            tone: "error",
            note: "capture writer fault",
          },
        ]),
        subscribedProjects: [
          { id: "widget-factory", name: "Widget Factory", sync: "behind" },
          { id: "military-base", name: "Military Base", sync: "paused" },
        ],
        activityLog: [
          {
            type: "error",
            timestamp: "2026-03-12 10:18",
            message: "Retry failed while reopening capture on Tap 3",
          },
          {
            type: "ingest",
            timestamp: "2026-03-12 09:54",
            message: "Partial ingest complete: 17/42 capture chunks",
          },
          {
            type: "subscription",
            timestamp: "2026-03-10 21:08",
            message: "Widget Factory marked behind due drift > 15m",
          },
        ],
      },
      {
        id: "feed-generic-branch-empty",
        selected: false,
        name: "Branch Intake Mirror",
        subtext: "Network Capture · Generic Interface",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Generic Interface",
        source: "Generic Interface · snr-dmz-01 · enp6s0",
        deviceLabel: "snr-dmz-01",
        captureInput: "enp6s0",
        portProfile: "",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 256,
        closeAndProcessSeconds: 90,
        captureRate: "48 MB/s",
        status: {
          tone: "active",
          extra: "no subscribed projects",
        },
        healthScore: 95,
        lastActivityMinutes: 6,
        lastActivity: "6m ago",
        expectedIdleMinutes: 5,
        ingestSparkline: [2, 3, 2, 4, 3, 2, 5, 4, 3, 2, 2, 1],
        subscriptionCount: 0,
        description:
          "Generic interface mirror for branch intake traffic. Data is flowing into the workspace but no project is subscribed yet.",
        retentionDays: 14,
        filterMode: "include",
        protocols: "TCP",
        subnets: "192.168.44.0/24",
        sourceSubnets: "192.168.44.0/24",
        destinationSubnets: "10.44.0.0/16",
        ports: "22",
        vlanId: "44",
        estimatedStorageReduction: 8,
        filterRulesCount: 2,
        rawBpf: "tcp port 22",
        uptimePct: 99.12,
        files24h: 47,
        fileErrorCount: 0,
        fileWarningCount: 2,
        volume24h: "1.2 GB",
        errorsPerDay: 0.1,
        sourceDetails: "Generic interface snr-dmz-01 · enp6s0",
        suricataRules: createFeedSuricataRules("branch-intake", []),
        producedFiles: createFeedProducedFiles("branch-intake", [
          {
            name: "branch_intake_20260312_0838_001.pcap",
            size: "254 MB",
            created: "08:38",
            tone: "ready",
            note: "workspace-only capture",
          },
          {
            name: "branch_intake_20260312_0840_002.pcap",
            size: "251 MB",
            created: "08:40",
            tone: "warning",
            note: "no project subscription",
          },
          {
            name: "branch_intake_20260312_0842_003.pcap",
            size: "248 MB",
            created: "08:42",
            tone: "warning",
            note: "awaiting project viewer subscription",
          },
        ]),
        subscribedProjects: [],
        activityLog: [
          {
            type: "subscription",
            timestamp: "2026-03-12 09:01",
            message: "Warning emitted: feed has no subscribed projects",
          },
          {
            type: "ingest",
            timestamp: "2026-03-12 08:52",
            message: "9 capture chunks ingested into workspace cache",
          },
        ],
      },
      {
        id: "feed-generic-lab-init",
        selected: false,
        name: "Lab Aggregate Capture",
        subtext: "Network Capture · Generic Interface",
        icon: "../icons/icon_feed.svg",
        category: "Network Capture",
        type: "Generic Interface",
        source: "Generic Interface · snr-lab-02 · bond0",
        deviceLabel: "snr-lab-02",
        captureInput: "bond0",
        portProfile: "",
        outputPath: "/mnt/disks/teleseer/livecaptures",
        chunkSizeMb: 500,
        closeAndProcessSeconds: 60,
        captureRate: "0 MB/s",
        status: {
          tone: "initializing",
          extra: "validating capture input",
        },
        syncPercent: 0,
        healthScore: 0,
        lastActivityMinutes: 9999,
        lastActivity: "Never",
        expectedIdleMinutes: 5,
        ingestSparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        subscriptionCount: 1,
        description:
          "New generic interface capture waiting for first successful rollover from the lab aggregate bond.",
        retentionDays: 14,
        filterMode: "include",
        protocols: "Any",
        subnets: "10.70.0.0/16",
        sourceSubnets: "10.70.0.0/16",
        destinationSubnets: "Any",
        ports: "Any",
        vlanId: "-",
        estimatedStorageReduction: 0,
        filterRulesCount: 0,
        rawBpf: "",
        uptimePct: 0,
        files24h: 0,
        fileErrorCount: 0,
        fileWarningCount: 0,
        volume24h: "0 B",
        errorsPerDay: 0,
        sourceDetails: "Generic interface snr-lab-02 · bond0",
        suricataRules: createFeedSuricataRules("lab-aggregate", [
          {
            name: "SURICATA TLS Cert Subject Mismatch",
            projectCount: 1,
            projects: ["Power Plant"],
          },
        ]),
        producedFiles: createFeedProducedFiles("lab-aggregate", []),
        subscribedProjects: [
          { id: "power-plant", name: "Power Plant", sync: "synced" },
        ],
        activityLog: [
          {
            type: "config",
            timestamp: "2026-03-12 10:40",
            message: "Feed created, waiting for first capture handoff",
          },
        ],
      },
    ],
  },
  sensors: {
    id: "sensors",
    title: "Sensors",
    searchPlaceholder:
      "Search sensor IDs, sites, interfaces, and packet-loss conditions...",
    emptyCopy:
      "No sensors match this filter. Confirm workspace scope and federation boundary.",
    primaryActionLabel: "Register Sensor",
    primaryActionDisabled: false,
    utilityPrimary: {
      icon: "../icons/icon_refresh.svg",
      label: "Refresh sensor heartbeat",
    },
    utilitySecondary: {
      icon: "../icons/icon_sort_arrows.svg",
      label: "Sort sensor rows",
    },
    loadingMessage: "Refreshing sensor heartbeat and packet-loss diagnostics...",
    stateChips: [
      { label: "Sensors online: 9 / 12", tone: "syncing" },
      { label: "Anomaly: snr-west-03 packet loss 4.9%", tone: "warning" },
      { label: "Remote sensor controls are read-only", tone: "restricted" },
    ],
    columns: [
      { key: "select", label: "", type: "select", width: "44px" },
      { key: "name", label: "Name", type: "name", width: "280px" },
      { key: "site", label: "Site", type: "text", width: "180px" },
      { key: "interface", label: "Interface", type: "text", width: "140px" },
      {
        key: "captureRate",
        label: "Capture Rate",
        type: "text",
        width: "130px",
      },
      {
        key: "packetLoss",
        label: "Packet Loss",
        type: "text",
        width: "110px",
      },
      { key: "lastBeat", label: "Last Beat", type: "text", width: "100px" },
      { key: "status", label: "Status", type: "status", width: "250px" },
      { key: "disclosure", label: "", type: "disclosure", width: "36px" },
    ],
    rows: [
      {
        selected: false,
        name: "snr-phx-07",
        subtext: "hub ingress cluster",
        icon: "../icons/icon_sensor.svg",
        site: "Power Plant",
        interface: "eth0",
        captureRate: "186 Mbps",
        packetLoss: "0.2%",
        lastBeat: "8s",
        status: {
          tone: "ready",
          label: "Online",
          extra: "capture stable",
        },
      },
      {
        selected: false,
        name: "snr-west-03",
        subtext: "federated edge collector",
        icon: "../icons/icon_sensor.svg",
        site: "Widget Factory",
        interface: "tap1",
        captureRate: "142 Mbps",
        packetLoss: "4.9%",
        lastBeat: "21s",
        status: {
          tone: "warning",
          label: "Degraded",
          extra: "drop burst detected",
        },
      },
      {
        selected: false,
        name: "snr-hospital-02",
        subtext: "east wing mirror",
        icon: "../icons/icon_sensor.svg",
        site: "Hospital East Wing",
        interface: "eth1",
        captureRate: "0 Mbps",
        packetLoss: "100%",
        lastBeat: "17m",
        status: {
          tone: "error",
          label: "Offline",
          extra: "heartbeat lost",
        },
      },
      {
        selected: false,
        readOnly: true,
        name: "snr-remote-nato-1",
        subtext: "partner workspace sensor",
        icon: "../icons/icon_sensor.svg",
        site: "Military Base",
        interface: "sp0",
        captureRate: "88 Mbps",
        packetLoss: "0.7%",
        lastBeat: "34s",
        status: {
          tone: "restricted",
          label: "Read-only",
          extra: "federation control boundary",
        },
      },
      {
        selected: false,
        name: "snr-dmz-qa",
        subtext: "staged replacement",
        icon: "../icons/icon_sensor.svg",
        site: "DMZ Sandbox",
        interface: "eth2",
        captureRate: "-",
        packetLoss: "-",
        lastBeat: "Never",
        status: {
          tone: "queued",
          label: "Provisioning",
          extra: "certificate pending",
        },
      },
    ],
  },
};

const SECTION_ALIAS = {
  "demo-projects": "projects",
};

const FEED_DEFAULT_IDLE_BY_TYPE = {
  Napatech: 5,
  "Generic Interface": 5,
  "Folder Watch": 15,
  "App/Integration": 60,
};

const FEED_UPTIME_WINDOW_MINUTES = 30 * 24 * 60;
const FEED_SUMMARY_WINDOW_HOURS = 24;

const FEED_CATEGORY_OPTIONS = [
  {
    value: "Network Capture",
    copy: "Bind a workspace feed to a live capture input and roll traffic into processable chunks.",
    enabled: true,
  },
  {
    value: "Folder Watch",
    copy: "Planned. Watch folders or shares and ingest dropped files into the workspace.",
    enabled: false,
  },
  {
    value: "App/Integration",
    copy: "Planned. Pull structured data from external systems into Teleseer.",
    enabled: false,
  },
];

const FEED_SOURCE_TYPE_OPTIONS = [
  {
    value: "Napatech",
    copy: "Use a Napatech capture card input with card-level port layout and rollover settings.",
  },
  {
    value: "Generic Interface",
    copy: "Use a standard interface on a Teleseer host or sensor when no Napatech card is involved.",
  },
];

const FEED_STATUS_ORDER = {
  active: 0,
  syncing: 1,
  paused: 2,
  error: 3,
  initializing: 4,
};

const FEED_STATUS_LABELS = {
  active: "Capture Rate",
  syncing: "Syncing",
  paused: "Stopped",
  error: "Error",
  initializing: "Starting",
};

const FEED_STATUS_DEFAULT_EXTRA = {
  active: "capture stable",
  syncing: "rolling chunk handoff in progress",
  paused: "manual stop",
  error: "attention required",
  initializing: "waiting for first capture handoff",
};

const FEED_METRIC_LABELS = {
  files: "Files",
  volume: "Volume",
  errors: "Errors",
};

const FEED_RANGE_TO_BARS = {
  "1h": 12,
  "24h": 24,
  "7d": 28,
  "30d": 32,
};

const STATUS_BADGE_CLASS_BY_TONE = {
  active: "status-active",
  online: "status-online",
  synced: "status-synced",
  ready: "status-ready",
  syncing: "status-syncing",
  uploading: "status-uploading",
  paused: "status-paused",
  warning: "status-warning",
  behind: "status-behind",
  queued: "status-queued",
  error: "status-error",
  offline: "status-offline",
  disabled: "status-disabled",
  initializing: "status-initializing",
  restricted: "status-restricted",
  "read-only": "status-read-only",
  readonly: "status-read-only",
};

const WORKSPACE_PROJECT_NAMES = Array.from(
  new Set([
    ...FAVORITE_PROJECTS.map((project) => project.label),
    ...SECTION_CONTENT.projects.rows.map((row) => row.name),
  ]),
);

const NAPATECH_LAYOUT_ACTIVE_PORTS = {
  "2x100G": 2,
  "2x40G": 2,
  "2x10/25G": 2,
  "4x10/25G": 4,
  "8x10G": 8,
  "2x1/10G": 2,
};

const NAPATECH_DEVICE_STATES = {
  "NT200-PHX-01": {
    model: "NT200A02 SmartNIC Capture",
    firmwareVersion: "3.29.38.15",
    thumbnail: "../icons/integration/general/integration_colored_napatech.svg",
    physicalPortCount: 2,
    detectedLayout: "2x100G",
    ports: [
      {
        number: 1,
        virtual: false,
        state: "assigned",
        assignedFeedId: "feed-napatech-core-spine",
        speed: "100G",
        detail: "Physical QSFP28 port 1 exposed by the current firmware profile.",
      },
      {
        number: 2,
        virtual: false,
        state: "available",
        speed: "100G",
        detail: "Physical QSFP28 port 2 is exposed and currently unused.",
      },
      {
        number: 3,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
      {
        number: 4,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
      {
        number: 5,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
      {
        number: 6,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
      {
        number: 7,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
      {
        number: 8,
        virtual: true,
        state: "unavailable",
        speed: "10/25G",
        detail: "Virtual interface is hidden by the current 2x100G firmware layout.",
      },
    ],
  },
  "NT200-PLT-02": {
    model: "NT200A02 SmartNIC Capture",
    firmwareVersion: "3.29.38.15",
    thumbnail: "../icons/integration/general/integration_colored_napatech.svg",
    physicalPortCount: 2,
    detectedLayout: "8x10G",
    ports: [
      {
        number: 1,
        virtual: true,
        state: "available",
        speed: "10G",
        detail: "Virtual interface is exposed and available for feed assignment.",
      },
      {
        number: 2,
        virtual: true,
        state: "assigned",
        assignedFeedId: "feed-napatech-plant-east",
        speed: "10G",
        detail: "Virtual interface assigned to the Plant East capture feed.",
      },
      {
        number: 3,
        virtual: true,
        state: "in-use",
        assignedFeedLabel: "SCADA Mirror Capture",
        speed: "10G",
        detail: "Virtual interface is allocated to another workspace capture feed.",
      },
      {
        number: 4,
        virtual: true,
        state: "available",
        speed: "10G",
        detail: "Virtual interface is exposed and available for feed assignment.",
      },
      {
        number: 5,
        virtual: true,
        state: "available",
        speed: "10G",
        detail: "Virtual interface is exposed and available for feed assignment.",
      },
      {
        number: 6,
        virtual: true,
        state: "unavailable",
        speed: "10G",
        detail: "Virtual interface is disabled in the current firmware profile pending plant validation.",
      },
      {
        number: 7,
        virtual: true,
        state: "available",
        speed: "10G",
        detail: "Virtual interface is exposed and available for feed assignment.",
      },
      {
        number: 8,
        virtual: true,
        state: "available",
        speed: "10G",
        detail: "Virtual interface is exposed and available for feed assignment.",
      },
    ],
  },
  "NT200-WEST-01": {
    model: "NT200A02 SmartNIC Capture",
    firmwareVersion: "3.29.38.15",
    thumbnail: "../icons/integration/general/integration_colored_napatech.svg",
    physicalPortCount: 2,
    detectedLayout: "4x10/25G",
    ports: [
      {
        number: 1,
        virtual: true,
        state: "in-use",
        assignedFeedLabel: "West DMZ Span",
        speed: "25G",
        detail: "Virtual interface is allocated to another workspace capture feed.",
      },
      {
        number: 2,
        virtual: true,
        state: "available",
        speed: "25G",
        detail: "Virtual interface is exposed and currently unused.",
      },
      {
        number: 3,
        virtual: true,
        state: "assigned",
        assignedFeedId: "feed-napatech-west-error",
        speed: "25G",
        detail: "Virtual interface assigned to the West Edge mirror feed.",
      },
      {
        number: 4,
        virtual: true,
        state: "error",
        speed: "25G",
        detail: "Virtual interface is exposed but the upstream mirror path is reporting errors.",
      },
      {
        number: 5,
        virtual: true,
        state: "unavailable",
        speed: "10G",
        detail: "Virtual interface is hidden by the current 4x10/25G firmware layout.",
      },
      {
        number: 6,
        virtual: true,
        state: "unavailable",
        speed: "10G",
        detail: "Virtual interface is hidden by the current 4x10/25G firmware layout.",
      },
      {
        number: 7,
        virtual: true,
        state: "unavailable",
        speed: "10G",
        detail: "Virtual interface is hidden by the current 4x10/25G firmware layout.",
      },
      {
        number: 8,
        virtual: true,
        state: "unavailable",
        speed: "10G",
        detail: "Virtual interface is hidden by the current 4x10/25G firmware layout.",
      },
    ],
  },
};

function cloneValue(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function createDefaultFeedDraft(type = "Napatech") {
  return {
    category: "Network Capture",
    type,
    name: "",
    description: "",
    source: "",
    deviceLabel: "",
    captureInput: "",
    portProfile: type === "Napatech" ? "2x100G" : "",
    outputPath: "/mnt/disks/teleseer/livecaptures",
    chunkSizeMb: "500",
    closeAndProcessSeconds: "60",
    retentionDays: "30",
    filterMode: "include",
    protocols: "",
    subnets: "",
    sourceSubnets: "",
    destinationSubnets: "",
    ports: "",
    vlanId: "",
    rawBpf: "",
    estimatedStorageReduction: "0",
  };
}

function getDetectedNapatechState(deviceLabel) {
  const normalized = String(deviceLabel || "").trim();
  if (!normalized) return null;
  return NAPATECH_DEVICE_STATES[normalized] || null;
}

function getDetectedNapatechLayout(deviceLabel, fallbackLayout = "") {
  return getDetectedNapatechState(deviceLabel)?.detectedLayout || fallbackLayout || "";
}

function syncNapatechDraftPortProfile(draft) {
  if (!draft || draft.type !== "Napatech") {
    if (draft) draft.portProfile = "";
    return "";
  }

  const detectedLayout = getDetectedNapatechLayout(draft.deviceLabel, "");
  if (detectedLayout) {
    draft.portProfile = detectedLayout;
    return detectedLayout;
  }

  if (!String(draft.portProfile || "").trim()) {
    draft.portProfile = "2x100G";
  }

  return draft.portProfile;
}

function getFeedSourceLabelFromDraft(draft) {
  const deviceLabel = String(draft.deviceLabel || "").trim();
  const captureInput = String(draft.captureInput || "").trim();
  if (!deviceLabel && !captureInput) return "";
  return [deviceLabel, captureInput].filter(Boolean).join(" · ");
}

function syncFeedDraftSource(draft) {
  draft.source = getFeedSourceLabelFromDraft(draft);
  return draft.source;
}

const state = {
  activeSidebarItemId: "feeds",
  activeSectionId: "feeds",
  collapsedSidebar: false,
  sidebarQuery: "",
  sectionQueryById: {
    projects: "",
    files: "",
    feeds: "",
    sensors: "",
  },
  favoriteProjectsOpen: true,
  activeFavoriteProjectId: null,
  sortModeBySectionId: {
    projects: "default",
    files: "default",
    sensors: "default",
  },
  tableViewSettingsBySectionId: loadLauncherTableViewSettings(),
  feedState: {
    rows: cloneValue(SECTION_CONTENT.feeds.rows),
    filterType: "all",
    filterStatus: "all",
    sort: {
      key: "",
      direction: "asc",
    },
    selectedIds: new Set(),
    expandedIds: new Set(),
    openFeedId: "",
    drawerMetric: "volume",
    drawerRange: "7d",
    drawerLogFilter: "all",
    drawerOpenMenuKey: "",
    drawerCardOpenByFeedId: {},
    drawerExpandedMetricKeyByFeedId: {},
    drawerSelectedPortNumberByFeedId: {},
    drawerEditCard: "",
    drawerDraft: null,
    filesFilterByFeedId: {},
    filesPaginationByFeedId: {},
    drawerProjectsPaginationByFeedId: {},
    drawerSuricataPaginationByFeedId: {},
    createFlow: {
      open: false,
      step: 0,
      editingFeedId: "",
      draft: createDefaultFeedDraft(),
    },
    pendingDeleteIds: [],
    deviceAdmin: {
      open: false,
      source: "",
      feedId: "",
      draft: null,
      selectedPortNumber: 0,
    },
  },
  loading: false,
};

let loadingTimer = null;
let userThemeHoverCloseTimer = null;
let feedRateSimulationTimer = null;
let toastSequence = 0;
let activeLauncherTooltipTarget = null;

const sidebarShellEl = document.getElementById("sidebarShell");
const toggleSidebarSideEl = document.getElementById("toggleSidebarSide");
const toggleSidebarRailEl = document.getElementById("toggleSidebarRail");
const collapsedFavoriteButtonEl = document.getElementById("collapsedFavoriteButton");
const launcherNavEl = document.getElementById("launcherNav");
const favoriteToggleButtonEl = document.getElementById("favoriteToggleButton");
const favoriteProjectListEl = document.getElementById("favoriteProjectList");
const sidebarFilterInputEl = document.getElementById("sidebarFilterInput");
const clearSidebarFilterButtonEl = document.getElementById(
  "clearSidebarFilterButton",
);
const sectionTitleEl = document.getElementById("sectionTitle");
const contentSearchInputEl = document.getElementById("contentSearchInput");
const utilityPrimaryButtonEl = document.getElementById("utilityPrimaryButton");
const utilityPrimaryIconEl = document.getElementById("utilityPrimaryIcon");
const utilitySecondaryButtonEl = document.getElementById(
  "utilitySecondaryButton",
);
const utilitySecondaryIconEl = document.getElementById("utilitySecondaryIcon");
const primaryActionButtonEl = document.getElementById("primaryActionButton");
const gridHeadEl = document.getElementById("gridHead");
const gridBodyEl = document.getElementById("gridBody");
const emptyStateEl = document.getElementById("emptyState");
const emptyStateCopyEl = document.getElementById("emptyStateCopy");
const loadingStateEl = document.getElementById("loadingState");
const loadingStateCopyEl = document.getElementById("loadingStateCopy");
const launcherContentShellEl = document.querySelector(".launcher-content-shell");
const launcherSurfaceEl = document.querySelector(".launcher-surface");
const feedsFiltersEl = document.getElementById("feedsFilters");
const feedTypeFilterTriggerEl = document.getElementById("feedTypeFilterTrigger");
const feedTypeFilterValueEl = document.getElementById("feedTypeFilterValue");
const feedTypeFilterMenuEl = document.getElementById("feedTypeFilterMenu");
const feedStatusFilterTriggerEl = document.getElementById("feedStatusFilterTrigger");
const feedStatusFilterValueEl = document.getElementById("feedStatusFilterValue");
const feedStatusFilterMenuEl = document.getElementById("feedStatusFilterMenu");
const tableViewSettingsButtonEl = document.getElementById("tableViewSettingsButton");
const tableViewSettingsMenuEl = document.getElementById("tableViewSettingsMenu");
const feedsBulkActionsEl = document.getElementById("feedsBulkActions");
const feedsBulkCountEl = document.getElementById("feedsBulkCount");
const feedsBulkPauseEl = document.getElementById("feedsBulkPause");
const feedsBulkResumeEl = document.getElementById("feedsBulkResume");
const feedsBulkDeleteEl = document.getElementById("feedsBulkDelete");
const feedDrawerShellEl = document.getElementById("feedDrawerShell");
const feedDrawerTitleEl = document.getElementById("feedDrawerTitle");
const feedDrawerSubtitleEl = document.getElementById("feedDrawerSubtitle");
const closeFeedDrawerEl = document.getElementById("closeFeedDrawer");
const feedDrawerEditEl = document.getElementById("feedDrawerEdit");
const feedDrawerMenuEl = document.getElementById("feedDrawerMenu");
const feedDrawerActionsMenuEl = document.getElementById("feedDrawerActionsMenu");
const feedDrawerCancelEl = document.getElementById("feedDrawerCancel");
const feedDrawerSaveEl = document.getElementById("feedDrawerSave");
const feedDrawerActionsViewEl = document.getElementById("feedDrawerActionsView");
const feedDrawerActionsEditEl = document.getElementById("feedDrawerActionsEdit");
const feedDrawerBodyEl = document.getElementById("feedDrawerBody");
const feedCreateModalEl = document.getElementById("feedCreateModal");
const feedCreateTitleEl = document.getElementById("feedCreateTitle");
const closeFeedCreateModalEl = document.getElementById("closeFeedCreateModal");
const feedCreateStepperEl = document.getElementById("feedCreateStepper");
const feedCreateBodyEl = document.getElementById("feedCreateBody");
const feedCreateBackEl = document.getElementById("feedCreateBack");
const feedCreateNextEl = document.getElementById("feedCreateNext");
const feedCreateConfirmEl = document.getElementById("feedCreateConfirm");
const feedDeleteModalEl = document.getElementById("feedDeleteModal");
const closeFeedDeleteModalEl = document.getElementById("closeFeedDeleteModal");
const feedDeleteAffectedProjectsEl = document.getElementById("feedDeleteAffectedProjects");
const feedDeleteCancelEl = document.getElementById("feedDeleteCancel");
const feedDeleteConfirmEl = document.getElementById("feedDeleteConfirm");
const deviceAdminModalEl = document.getElementById("deviceAdminModal");
const deviceAdminTitleEl = document.getElementById("deviceAdminTitle");
const deviceAdminSubtitleEl = document.getElementById("deviceAdminSubtitle");
const deviceAdminBodyEl = document.getElementById("deviceAdminBody");
const closeDeviceAdminModalEl = document.getElementById("closeDeviceAdminModal");
const deviceAdminCloseSecondaryEl = document.getElementById("deviceAdminCloseSecondary");
const launcherToastStackEl = document.getElementById("launcherToastStack");
const userSettingsButtonEl = document.getElementById("userSettingsButton");
const userSettingsMenuEl = document.getElementById("userSettingsMenu");
const userThemeMenuEl = document.getElementById("userThemeMenu");
const userThemeTriggerEl = document.getElementById("userThemeTrigger");
const launcherTooltipEl = document.createElement("div");
launcherTooltipEl.className = "launcher-global-tooltip hidden";
launcherTooltipEl.id = "launcherGlobalTooltip";
launcherTooltipEl.setAttribute("role", "tooltip");
document.body.appendChild(launcherTooltipEl);

const sidebarSOT = window.LauncherSidebarSOT;
const tableSOT = window.LauncherTableSOT;

if (!sidebarSOT || !tableSOT) {
  throw new Error(
    "Launcher source-of-truth components are missing. Load sidebar/table component scripts before launcher.js.",
  );
}

function setMaskIcon(iconEl, iconPath) {
  if (!iconEl) return;
  if (!iconPath) {
    iconEl.style.removeProperty("--icon-url");
    return;
  }
  iconEl.classList.remove("svg-icon", "svg-icon-ready", "svg-icon-color");
  iconEl.classList.add("launcher-svg-icon");
  iconEl.style.setProperty("--icon-url", `url("${iconPath}")`);
  iconEl.setAttribute("aria-hidden", "true");
}

function resolveSectionId(sidebarId) {
  return SECTION_ALIAS[sidebarId] || sidebarId;
}

function getActiveSection() {
  return SECTION_CONTENT[state.activeSectionId];
}

function getSectionRows(sectionId) {
  if (sectionId === "feeds") {
    return state.feedState.rows;
  }
  return SECTION_CONTENT[sectionId].rows;
}

function getFeedById(feedId) {
  return state.feedState.rows.find((row) => row.id === feedId) || null;
}

function getFeedIconPath(type) {
  if (type === "Napatech") {
    return "../icons/integration/general/integration_napatech.svg";
  }
  if (type === "Generic Interface") {
    return "../icons/icon_ethernet.svg";
  }
  return "../icons/icon_feed.svg";
}

function setSidebarCollapsed(nextCollapsed) {
  state.collapsedSidebar = nextCollapsed;
  sidebarShellEl.classList.toggle("collapsed", state.collapsedSidebar);

  const expanded = String(!state.collapsedSidebar);
  toggleSidebarSideEl.setAttribute("aria-expanded", expanded);
  toggleSidebarRailEl.setAttribute("aria-expanded", expanded);
}

function toggleSidebar() {
  setSidebarCollapsed(!state.collapsedSidebar);
}

function normalizeForSearch(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(normalizeForSearch).join(" ");
  if (typeof value === "object") {
    return Object.values(value).map(normalizeForSearch).join(" ");
  }
  return String(value);
}

function rowMatchesQuery(row, query) {
  if (!query) return true;
  return normalizeForSearch(row).toLowerCase().includes(query);
}

function applyNameSort(rows, mode) {
  if (mode === "default") return rows;

  const sorted = [...rows].sort((left, right) =>
    String(left.name || "").localeCompare(String(right.name || ""), undefined, {
      sensitivity: "base",
      numeric: true,
    }),
  );

  if (mode === "name-desc") {
    sorted.reverse();
  }

  return sorted;
}

function isFeedStale(feed) {
  const tone = feed?.status?.tone;
  if (!feed || tone === "paused" || tone === "initializing") return false;
  const idle = Number(feed.lastActivityMinutes || 0);
  const threshold = Number(feed.expectedIdleMinutes || 0);
  return threshold > 0 && idle > threshold;
}

function getFeedSparklineSortValue(feed) {
  const values = Array.isArray(feed.ingestSparkline) ? feed.ingestSparkline : [];
  if (!values.length) return 0;
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function compareFeedRows(left, right, key) {
  switch (key) {
    case "name":
    case "type":
    case "category":
    case "source": {
      return String(left[key] || "").localeCompare(String(right[key] || ""), undefined, {
        sensitivity: "base",
        numeric: true,
      });
    }
    case "status": {
      const leftTone = left.status?.tone || "initializing";
      const rightTone = right.status?.tone || "initializing";
      const delta =
        (FEED_STATUS_ORDER[leftTone] ?? 999) - (FEED_STATUS_ORDER[rightTone] ?? 999);
      if (delta !== 0) return delta;
      return String(left.status?.label || "").localeCompare(String(right.status?.label || ""));
    }
    case "healthScore":
    case "lastActivityMinutes":
    case "subscriptionCount":
    case "fileCount":
    case "issueCount":
      return Number(left[key] || 0) - Number(right[key] || 0);
    case "ingestSparkline":
      return getFeedSparklineSortValue(left) - getFeedSparklineSortValue(right);
    default:
      return 0;
  }
}

function applyFeedSort(rows) {
  const { key, direction } = state.feedState.sort;
  if (!key) return rows;

  const sorted = [...rows].sort((left, right) => {
    const delta = compareFeedRows(left, right, key);
    if (delta !== 0) {
      return direction === "desc" ? -delta : delta;
    }
    return String(left.name || "").localeCompare(String(right.name || ""), undefined, {
      sensitivity: "base",
      numeric: true,
    });
  });

  return sorted;
}

function getVisibleRows(section) {
  const query = (state.sectionQueryById[section.id] || "").trim().toLowerCase();

  if (section.id !== "feeds") {
    const rows = getSectionRows(section.id);
    const filtered = rows.filter((row) => rowMatchesQuery(row, query));
    const sortMode = state.sortModeBySectionId[section.id] || "default";
    return applyNameSort(filtered, sortMode);
  }

  const filtered = state.feedState.rows
    .filter((row) => {
      if (
        state.feedState.filterType !== "all" &&
        row.type !== state.feedState.filterType
      ) {
        return false;
      }
      if (
        state.feedState.filterStatus !== "all" &&
        (row.status?.tone || "") !== state.feedState.filterStatus
      ) {
        return false;
      }
      if (!query) return true;
      return (
        String(row.name || "").toLowerCase().includes(query) ||
        String(row.source || "").toLowerCase().includes(query)
      );
    })
    .map((row) => ({
      ...row,
      selected: state.feedState.selectedIds.has(row.id),
      expanded: state.feedState.expandedIds.has(row.id),
      staleWarning: isFeedStale(row),
      showSubtext: false,
    }));

  return applyFeedSort(filtered);
}

function renderNavigation() {
  const filter = state.sidebarQuery.trim().toLowerCase();

  const visibleItems = SIDEBAR_ITEMS.filter((item) =>
    !filter ? true : item.label.toLowerCase().includes(filter),
  );

  sidebarSOT.renderNav({
    containerEl: launcherNavEl,
    items: visibleItems,
    activeId: state.activeSidebarItemId,
    onSelect: (item) => {
      const nextSectionId = resolveSectionId(item.id);
      if (!SECTION_CONTENT[nextSectionId]) return;

      const sectionChanged = state.activeSectionId !== nextSectionId;
      const sidebarChanged = state.activeSidebarItemId !== item.id;
      if (!sectionChanged && !sidebarChanged) return;

      state.activeSidebarItemId = item.id;
      state.activeSectionId = nextSectionId;
      if (nextSectionId !== "feeds") {
        state.feedState.openFeedId = "";
      }
      render();
    },
  });
}

function renderFavorites() {
  const filter = state.sidebarQuery.trim().toLowerCase();

  const visibleProjects = FAVORITE_PROJECTS.filter((project) =>
    !filter ? true : project.label.toLowerCase().includes(filter),
  );

  sidebarSOT.renderAccordion({
    toggleButtonEl: favoriteToggleButtonEl,
    bodyEl: favoriteProjectListEl,
    open: state.favoriteProjectsOpen,
    items: visibleProjects,
    activeId: state.activeFavoriteProjectId,
    onSelect: (project) => {
      state.activeFavoriteProjectId = project.id;
      render();
    },
    rowClassName: "launcher-favorite-row",
    showCount: false,
    showAction: true,
    actionIconPath: "../icons/icon_meatball.svg",
  });
}

function toLabelCase(value) {
  if (!value || value === "all") return "All";
  const directMap = {
    paused: "Stopped",
    initializing: "Starting",
  };
  if (directMap[value]) return directMap[value];
  return String(value)
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function closeFeedFilterMenus() {
  feedTypeFilterMenuEl.classList.add("hidden");
  feedStatusFilterMenuEl.classList.add("hidden");
  feedTypeFilterTriggerEl.setAttribute("aria-expanded", "false");
  feedStatusFilterTriggerEl.setAttribute("aria-expanded", "false");
}

function openFeedFilterMenu(kind) {
  closeFeedFilterMenus();
  if (kind === "type") {
    feedTypeFilterMenuEl.classList.remove("hidden");
    feedTypeFilterTriggerEl.setAttribute("aria-expanded", "true");
    return;
  }
  if (kind === "status") {
    feedStatusFilterMenuEl.classList.remove("hidden");
    feedStatusFilterTriggerEl.setAttribute("aria-expanded", "true");
  }
}

function toggleFeedFilterMenu(kind) {
  const targetMenuEl = kind === "type" ? feedTypeFilterMenuEl : feedStatusFilterMenuEl;
  const isOpen = !targetMenuEl.classList.contains("hidden");
  if (isOpen) {
    closeFeedFilterMenus();
    return;
  }
  openFeedFilterMenu(kind);
}

function renderFeedFilterMenu(menuEl, kind, options, selectedValue) {
  menuEl.innerHTML = options
    .map((value) => {
      const isSelected = value === selectedValue;
      return `
        <button
          class="menu-item ${isSelected ? "active" : ""}"
          type="button"
          role="menuitemradio"
          aria-checked="${isSelected ? "true" : "false"}"
          data-feed-filter-kind="${kind}"
          data-feed-filter-value="${escapeHtml(value)}"
        >
          <span class="menu-item-inner">
            <span class="menu-item-label">${escapeHtml(toLabelCase(value))}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderFeedFilterControls(section) {
  const isFeeds = section.id === "feeds";
  feedsFiltersEl.classList.toggle("hidden", !isFeeds);
  if (!isFeeds) {
    closeFeedFilterMenus();
    return;
  }

  const typeOptions = section.filters?.type || ["all"];
  const statusOptions = section.filters?.status || ["all"];

  if (!typeOptions.includes(state.feedState.filterType)) {
    state.feedState.filterType = "all";
  }
  if (!statusOptions.includes(state.feedState.filterStatus)) {
    state.feedState.filterStatus = "all";
  }

  feedTypeFilterValueEl.textContent = toLabelCase(state.feedState.filterType);
  feedStatusFilterValueEl.textContent = toLabelCase(state.feedState.filterStatus);

  renderFeedFilterMenu(
    feedTypeFilterMenuEl,
    "type",
    typeOptions,
    state.feedState.filterType,
  );
  renderFeedFilterMenu(
    feedStatusFilterMenuEl,
    "status",
    statusOptions,
    state.feedState.filterStatus,
  );
}

function closeTableViewSettingsMenu() {
  tableViewSettingsMenuEl.classList.add("hidden");
  tableViewSettingsButtonEl.classList.remove("active", "is-active");
  tableViewSettingsButtonEl.setAttribute("aria-expanded", "false");
}

function getSectionColumnVisibility(sectionId) {
  const value = state.tableViewSettingsBySectionId[sectionId];
  return value && typeof value === "object" ? value : {};
}

function isSectionColumnVisible(section, column) {
  if (column.type === "disclosure") return false;
  if (column.hideable === false) return true;
  return getSectionColumnVisibility(section.id)[column.key] !== false;
}

function getSectionVisibleColumnConfig(section) {
  return getSectionColumnVisibility(section.id);
}

function getConfigurableColumns(section) {
  return (section.columns || []).filter(
    (column) => column.type !== "disclosure" && column.hideable !== false,
  );
}

function persistSectionColumnVisibility(sectionId, visibility) {
  state.tableViewSettingsBySectionId = {
    ...state.tableViewSettingsBySectionId,
    [sectionId]: visibility,
  };
  persistLauncherTableViewSettings(state.tableViewSettingsBySectionId);
}

function toggleSectionColumnVisibility(sectionId, columnKey) {
  const section = SECTION_CONTENT[sectionId];
  if (!section) return;
  const column = (section.columns || []).find((item) => item.key === columnKey);
  if (!column || column.hideable === false || column.type === "disclosure") return;

  const configurableColumns = getConfigurableColumns(section);
  const visibleConfigurableCount = configurableColumns.filter((item) =>
    isSectionColumnVisible(section, item),
  ).length;
  const isVisible = isSectionColumnVisible(section, column);
  if (isVisible && visibleConfigurableCount <= 1) return;

  const currentVisibility = getSectionColumnVisibility(sectionId);
  const nextVisibility = {
    ...currentVisibility,
    [columnKey]: !isVisible,
  };
  persistSectionColumnVisibility(sectionId, nextVisibility);
  renderContent();
}

function renderTableViewSettingsMenu(section) {
  const configurableColumns = getConfigurableColumns(section);
  if (!section.tableViewSettings || !configurableColumns.length) {
    tableViewSettingsMenuEl.innerHTML = "";
    closeTableViewSettingsMenu();
    return;
  }

  tableViewSettingsMenuEl.innerHTML = `
    <div class="menu-list launcher-view-settings-menu-body">
      <div class="launcher-menu-section-label">Columns</div>
      ${configurableColumns
        .map((column) => {
          const isVisible = isSectionColumnVisible(section, column);
          return `
            <button
              class="menu-item-toggle launcher-view-settings-item"
              type="button"
              role="menuitemcheckbox"
              aria-checked="${isVisible ? "true" : "false"}"
              data-table-view-column="${escapeHtml(column.key)}"
            >
              <span class="menu-item-label">${escapeHtml(column.label || column.key)}</span>
              <span class="toggle-switch${isVisible ? " on" : ""}" aria-hidden="true"></span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderFeedBulkActions(section) {
  if (section.id !== "feeds") {
    feedsBulkActionsEl.classList.add("hidden");
    return;
  }

  const selectedRows = state.feedState.rows.filter((row) =>
    state.feedState.selectedIds.has(row.id),
  );
  const selectedCount = selectedRows.length;
  feedsBulkActionsEl.classList.toggle("hidden", selectedCount === 0);
  feedsBulkCountEl.textContent = `${selectedCount} selected`;

  feedsBulkPauseEl.disabled = !selectedRows.some((row) =>
    canPauseFeed(row.status?.tone),
  );
  feedsBulkResumeEl.disabled = !selectedRows.some((row) =>
    canResumeFeed(row.status?.tone),
  );
  feedsBulkDeleteEl.disabled = selectedCount === 0;
}

function renderToolbar(section) {
  sectionTitleEl.textContent = section.title;
  contentSearchInputEl.placeholder = section.searchPlaceholder;
  contentSearchInputEl.value = state.sectionQueryById[section.id] || "";
  renderTableViewSettingsMenu(section);

  if (section.tableViewSettings && getConfigurableColumns(section).length) {
    tableViewSettingsButtonEl.hidden = false;
    tableViewSettingsButtonEl.disabled = false;
    tableViewSettingsButtonEl.title = "View Settings";
  } else {
    tableViewSettingsButtonEl.hidden = true;
    tableViewSettingsButtonEl.disabled = true;
    tableViewSettingsButtonEl.removeAttribute("title");
  }

  if (section.utilityPrimary) {
    utilityPrimaryButtonEl.hidden = false;
    utilityPrimaryButtonEl.disabled = false;
    setMaskIcon(utilityPrimaryIconEl, section.utilityPrimary.icon);
    utilityPrimaryButtonEl.setAttribute("aria-label", section.utilityPrimary.label);
    utilityPrimaryButtonEl.title = section.utilityPrimary.label;
  } else {
    utilityPrimaryButtonEl.hidden = true;
    utilityPrimaryButtonEl.disabled = true;
    utilityPrimaryButtonEl.removeAttribute("aria-label");
    utilityPrimaryButtonEl.removeAttribute("title");
  }

  if (section.utilitySecondary) {
    let sortModeLabel = "Sort: original";
    if (section.id === "feeds") {
      if (state.feedState.sort.key) {
        sortModeLabel = `Sort: ${state.feedState.sort.key} ${state.feedState.sort.direction.toUpperCase()}`;
      }
    } else {
      const sortMode = state.sortModeBySectionId[section.id] || "default";
      sortModeLabel =
        sortMode === "default"
          ? "Sort: original"
          : sortMode === "name-asc"
            ? "Sort: name A-Z"
            : "Sort: name Z-A";
    }

    utilitySecondaryButtonEl.hidden = false;
    utilitySecondaryButtonEl.disabled = false;
    setMaskIcon(utilitySecondaryIconEl, section.utilitySecondary.icon);
    utilitySecondaryButtonEl.setAttribute(
      "aria-label",
      `${section.utilitySecondary.label} (${sortModeLabel})`,
    );
    utilitySecondaryButtonEl.title = `${section.utilitySecondary.label} (${sortModeLabel})`;
  } else {
    utilitySecondaryButtonEl.hidden = true;
    utilitySecondaryButtonEl.disabled = true;
    utilitySecondaryButtonEl.removeAttribute("aria-label");
    utilitySecondaryButtonEl.removeAttribute("title");
  }

  primaryActionButtonEl.textContent = section.primaryActionLabel;
  primaryActionButtonEl.disabled = !!section.primaryActionDisabled;
  primaryActionButtonEl.title = section.primaryActionDisabled
    ? `${section.primaryActionLabel} (restricted)`
    : section.primaryActionLabel;

  renderFeedFilterControls(section);
}

function setFeedSort(key) {
  const current = state.feedState.sort;
  if (current.key !== key) {
    state.feedState.sort = { key, direction: "asc" };
    return;
  }
  if (current.direction === "asc") {
    state.feedState.sort.direction = "desc";
    return;
  }
  state.feedState.sort = { key: "", direction: "asc" };
}

function formatFeedVolume(valueMb) {
  const numeric = Number(valueMb || 0);
  if (numeric >= 1024) {
    return `${(numeric / 1024).toFixed(1)} GB`;
  }
  if (numeric >= 1) {
    return `${numeric.toFixed(0)} MB`;
  }
  return `${(numeric * 1024).toFixed(0)} KB`;
}

function nowFeedTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function touchFeed(feed, lastActivity = "Just now", minutes = 0) {
  feed.lastActivity = lastActivity;
  feed.lastActivityMinutes = minutes;
  feed.lastActivityTimestamp =
    Date.now() - Math.max(0, Number(minutes || 0)) * 60000;
}

function appendFeedLog(feed, type, message) {
  const nextEntry = {
    type,
    timestamp: nowFeedTimestamp(),
    message,
  };
  if (!Array.isArray(feed.activityLog)) {
    feed.activityLog = [];
  }
  feed.activityLog.unshift(nextEntry);
}

function normalizeFeedSyncPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0))));
}

function clampFeedMetric(value, min, max) {
  return Math.max(min, Math.min(max, Number(value || 0)));
}

function getFeedFilesSummary(feed) {
  const producedFiles = Array.isArray(feed.producedFiles) ? feed.producedFiles : [];
  const total = Number(feed.files24h || producedFiles.length || 0);
  const errors =
    feed.fileErrorCount != null
      ? Number(feed.fileErrorCount || 0)
      : producedFiles.filter((file) => file.tone === "error").length;
  const warnings =
    feed.fileWarningCount != null
      ? Number(feed.fileWarningCount || 0)
      : producedFiles.filter((file) => file.tone === "warning").length;
  return {
    total,
    errors,
    warnings,
    label: `${total} · ${errors}E / ${warnings}W`,
  };
}

function parseFeedTimestampValue(value) {
  if (value == null) return null;
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const rawValue = String(value || "").trim();
  if (!rawValue || rawValue.toLowerCase() === "never") {
    return null;
  }

  const normalizedValue = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(rawValue)
    ? rawValue.replace(" ", "T")
    : rawValue;
  const timestamp = Date.parse(normalizedValue);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function formatFeedActivityTooltip(value) {
  const timestamp = parseFeedTimestampValue(value);
  if (!timestamp) return "No activity recorded";

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
    date.getMonth()
  ];
  const year = String(date.getFullYear()).slice(-2);

  return `${hours}:${minutes}\u00A0\u00A0${seconds}s\u00A0\u00A0${day}-${month}-${year}`;
}

function getFeedUptimeWindowMinutes(feed) {
  const explicitWindow = Number(feed.uptimeWindowMinutes || 0);
  if (Number.isFinite(explicitWindow) && explicitWindow > 0) {
    return Math.max(1, Math.round(explicitWindow));
  }

  const createdAt = Number(feed.createdAt || 0);
  if (Number.isFinite(createdAt) && createdAt > 0) {
    const ageMinutes = Math.max(1, (Date.now() - createdAt) / 60000);
    return Math.max(1, Math.round(Math.min(ageMinutes, FEED_UPTIME_WINDOW_MINUTES)));
  }

  return FEED_UPTIME_WINDOW_MINUTES;
}

function getFeedHistoricalDowntimeMinutes(feed, windowMinutes) {
  const explicitDowntime = Number(feed.downtimeMinutesWindow);
  if (Number.isFinite(explicitDowntime) && explicitDowntime >= 0) {
    return clampFeedMetric(explicitDowntime, 0, windowMinutes);
  }

  const seededUptime = Number(feed.uptimePct);
  if (Number.isFinite(seededUptime) && seededUptime >= 0) {
    return clampFeedMetric(
      windowMinutes * (1 - clampFeedMetric(seededUptime, 0, 100) / 100),
      0,
      windowMinutes,
    );
  }

  return 0;
}

function getFeedCurrentStatusDowntimeMinutes(feed, windowMinutes) {
  const tone = feed?.status?.tone;
  if (tone !== "paused" && tone !== "error" && tone !== "initializing") {
    return 0;
  }

  const statusSince = Number(feed.statusSince || 0);
  if (!Number.isFinite(statusSince) || statusSince <= 0) {
    return 0;
  }

  const elapsedMinutes = Math.max(0, (Date.now() - statusSince) / 60000);
  return clampFeedMetric(elapsedMinutes, 0, windowMinutes);
}

function computeFeedUptimePct(feed) {
  const windowMinutes = getFeedUptimeWindowMinutes(feed);
  const historicalDowntime = getFeedHistoricalDowntimeMinutes(feed, windowMinutes);
  const currentDowntime = getFeedCurrentStatusDowntimeMinutes(feed, windowMinutes);
  const totalDowntime = clampFeedMetric(
    historicalDowntime + currentDowntime,
    0,
    windowMinutes,
  );

  return Number((100 * (1 - totalDowntime / windowMinutes)).toFixed(2));
}

function getFeedStatusHealthScore(feed) {
  const tone = feed?.status?.tone || "initializing";
  if (tone === "active") return 23;
  if (tone === "paused") return 17;
  if (tone === "error") return 0;
  if (tone === "initializing") return 0;
  if (tone === "syncing") {
    return 16 + Math.min(4, Math.floor(normalizeFeedSyncPercent(feed.syncPercent || 0) / 25));
  }
  return 0;
}

function getFeedFreshnessHealthScore(feed) {
  const tone = feed?.status?.tone || "initializing";
  if (tone === "initializing") return 0;
  if (tone === "paused") return 10;

  const expectedIdle = Math.max(1, Number(feed.expectedIdleMinutes || 1));
  const lastActivityMinutes = Math.max(0, Number(feed.lastActivityMinutes || 0));
  const ratio = lastActivityMinutes / expectedIdle;

  if (ratio <= 1) return 15;
  if (ratio <= 1.25) return 14;
  if (ratio <= 1.5) return 13;
  if (ratio <= 2) return 11;
  if (ratio <= 3) return 8;
  if (ratio <= 4) return 4;
  return 0;
}

function getFeedFileQualityHealthScore(feed) {
  const tone = feed?.status?.tone || "initializing";
  const totalFiles = Number(feed.fileCount || 0);
  if (tone === "initializing" && totalFiles === 0) {
    return 0;
  }
  if (totalFiles <= 0) {
    return tone === "active" || tone === "syncing" ? 4 : 0;
  }

  const errorRate = Number(feed.fileErrorCount || 0) / totalFiles;
  const warningRate = Number(feed.fileWarningCount || 0) / totalFiles;

  return clampFeedMetric(10 - errorRate * 120 - warningRate * 30, 0, 10);
}

function getFeedReliabilityHealthScore(feed) {
  const tone = feed?.status?.tone || "initializing";
  if (tone === "initializing") return 0;

  let score = 10;
  score -= Math.min(6, Number(feed.errorsPerDay || 0) * 0.5);
  if (Number(feed.subscriptionCount || 0) === 0) {
    score -= 2;
  }
  if (isFeedStale(feed) && tone !== "paused") {
    score -= 2;
  }
  if (tone === "error") {
    score -= 2;
  }

  return clampFeedMetric(score, 0, 10);
}

function computeFeedHealthScore(feed) {
  const tone = feed?.status?.tone || "initializing";
  if (tone === "initializing" && Number(feed.fileCount || 0) === 0) {
    return 0;
  }

  const uptimeComponent = computeFeedUptimePct(feed) * 0.4;
  const score =
    uptimeComponent +
    getFeedStatusHealthScore(feed) +
    getFeedFreshnessHealthScore(feed) +
    getFeedFileQualityHealthScore(feed) +
    getFeedReliabilityHealthScore(feed);

  return Math.round(clampFeedMetric(score, 0, 100));
}

function syncFeedDerivedMetrics(feed) {
  feed.subscriptionCount = feed.subscribedProjects.length;
  feed.icon = getFeedIconPath(feed.type);

  const derivedSource = getFeedSourceLabelFromDraft(feed);
  if (derivedSource) {
    feed.source = derivedSource;
  } else {
    const sanitizedSource = String(feed.source || "")
      .split(" · ")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => part !== "Napatech" && part !== "Generic Interface")
      .join(" · ");
    feed.source = sanitizedSource || "-";
  }

  const fileSummary = getFeedFilesSummary(feed);
  feed.fileCount = fileSummary.total;
  feed.fileErrorCount = fileSummary.errors;
  feed.fileWarningCount = fileSummary.warnings;
  feed.issueCount = fileSummary.errors + fileSummary.warnings;
  feed.filesSummary = fileSummary.label;

  const currentLastActivity = String(feed.lastActivity || "").trim();
  let lastActivityTimestamp =
    parseFeedTimestampValue(feed.lastActivityTimestamp) ||
    parseFeedTimestampValue(feed.activityLog?.[0]?.timestamp);
  if (
    !lastActivityTimestamp &&
    currentLastActivity.toLowerCase() !== "never" &&
    Number.isFinite(Number(feed.lastActivityMinutes || 0))
  ) {
    lastActivityTimestamp = Date.now() - Math.max(0, Number(feed.lastActivityMinutes || 0)) * 60000;
  }
  feed.lastActivityTimestamp = lastActivityTimestamp || null;
  feed.activityTooltip = formatFeedActivityTooltip(lastActivityTimestamp);

  if (!feed.expectedIdleMinutes) {
    feed.expectedIdleMinutes = FEED_DEFAULT_IDLE_BY_TYPE[feed.type] || 15;
  }
  if (!feed.captureRate) {
    feed.captureRate = "0 MB/s";
  }
  if (feed.syncPercent == null) {
    feed.syncPercent = 0;
  }
  if (!feed.status || !feed.status.tone) {
    feed.statusSince = Date.now();
    feed.status = buildFeedStatus(feed, "initializing");
  }
  if (
    feed.status.tone === "active" ||
    feed.status.tone === "syncing" ||
    feed.status.tone === "paused" ||
    feed.status.tone === "initializing"
  ) {
    feed.status = buildFeedStatus(feed, feed.status.tone, feed.status.extra);
  } else if (!feed.status.label) {
    feed.status.label = FEED_STATUS_LABELS[feed.status.tone] || "Unknown";
  }
  if (!feed.status.extra) {
    feed.status.extra = FEED_STATUS_DEFAULT_EXTRA[feed.status.tone] || "";
  }
  if (!feed.statusSince) {
    feed.statusSince = Date.now();
  }
  if (!feed.sourceDetails) {
    feed.sourceDetails = "-";
  }

  updateNoSubscriptionWarning(feed);

  const uptimeWindowMinutes = getFeedUptimeWindowMinutes(feed);
  feed.uptimeWindowMinutes = uptimeWindowMinutes;
  feed.downtimeMinutesWindow = getFeedHistoricalDowntimeMinutes(feed, uptimeWindowMinutes);
  feed.uptimePct = computeFeedUptimePct(feed);
  feed.healthScore = computeFeedHealthScore(feed);
}

function buildFeedStatus(feed, tone, extra) {
  const statusTone = FEED_STATUS_LABELS[tone] ? tone : "initializing";
  const status = {
    tone: statusTone,
    label: FEED_STATUS_LABELS[statusTone],
    extra: extra || FEED_STATUS_DEFAULT_EXTRA[statusTone],
  };

  if (statusTone === "active") {
    status.mode = "rate";
    status.label = feed.captureRate || "0 MB/s";
  }

  if (statusTone === "syncing") {
    status.progress = normalizeFeedSyncPercent(feed.syncPercent || 0);
    status.label = `Syncing ${status.progress}%`;
  }

  if (statusTone === "paused") {
    status.label = "Stopped";
  }

  if (statusTone === "initializing") {
    status.label = "Starting";
  }

  return status;
}

function ensureFeedShape(feed) {
  if (!Array.isArray(feed.ingestSparkline)) {
    feed.ingestSparkline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  if (!Array.isArray(feed.subscribedProjects)) {
    feed.subscribedProjects = [];
  }
  if (!Array.isArray(feed.activityLog)) {
    feed.activityLog = [];
  }
  if (!Array.isArray(feed.producedFiles)) {
    feed.producedFiles = [];
  }
  if (!Array.isArray(feed.suricataRules)) {
    feed.suricataRules = [];
  }

  syncFeedDerivedMetrics(feed);
}

function parseRateValue(rateLabel) {
  const match = String(rateLabel || "").match(/([\d.]+)\s*([A-Za-z/]+)$/);
  if (!match) return null;
  return {
    value: Number(match[1]),
    unit: match[2],
  };
}

function formatRateValue(value, unit) {
  const precision = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${Number(value).toFixed(precision)} ${unit}`;
}

function hideLauncherTooltip() {
  activeLauncherTooltipTarget = null;
  launcherTooltipEl.classList.add("hidden");
  launcherTooltipEl.textContent = "";
  launcherTooltipEl.removeAttribute("data-placement");
}

function positionLauncherTooltip() {
  if (!activeLauncherTooltipTarget || !document.contains(activeLauncherTooltipTarget)) {
    hideLauncherTooltip();
    return;
  }

  const tooltipText = String(activeLauncherTooltipTarget.getAttribute("data-tooltip") || "").trim();
  if (!tooltipText) {
    hideLauncherTooltip();
    return;
  }

  if (launcherTooltipEl.textContent !== tooltipText) {
    launcherTooltipEl.textContent = tooltipText;
  }

  const padding = 8;
  const gap = 8;
  const rect = activeLauncherTooltipTarget.getBoundingClientRect();
  const tooltipRect = launcherTooltipEl.getBoundingClientRect();
  const spaceAbove = rect.top - gap - padding;
  const spaceBelow = window.innerHeight - rect.bottom - gap - padding;
  const placeAbove = tooltipRect.height <= spaceAbove || spaceAbove >= spaceBelow;
  const top = placeAbove
    ? Math.max(padding, rect.top - tooltipRect.height - gap)
    : Math.min(window.innerHeight - padding - tooltipRect.height, rect.bottom + gap);
  const left = Math.max(
    padding,
    Math.min(
      window.innerWidth - padding - tooltipRect.width,
      rect.left + rect.width / 2 - tooltipRect.width / 2,
    ),
  );

  launcherTooltipEl.dataset.placement = placeAbove ? "top" : "bottom";
  launcherTooltipEl.style.top = `${Math.round(top)}px`;
  launcherTooltipEl.style.left = `${Math.round(left)}px`;
}

function showLauncherTooltip(target) {
  if (!target) return;
  const tooltipText = String(target.getAttribute("data-tooltip") || "").trim();
  if (!tooltipText) {
    hideLauncherTooltip();
    return;
  }

  activeLauncherTooltipTarget = target;
  launcherTooltipEl.textContent = tooltipText;
  launcherTooltipEl.classList.remove("hidden");
  positionLauncherTooltip();
}

function formatMetricNumber(value, options = {}) {
  const numeric = Number(value || 0);
  const {
    maximumFractionDigits = 1,
    minimumFractionDigits = 0,
  } = options;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numeric);
}

function formatMetricPercent(value, maximumFractionDigits = 2) {
  return `${formatMetricNumber(value, { maximumFractionDigits })}%`;
}

function parseFeedSizeBytes(value) {
  const match = String(value || "")
    .trim()
    .match(/^([\d.]+)\s*(B|KB|MB|GB|TB)$/i);
  if (!match) return 0;
  const numeric = Number(match[1] || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  const unit = String(match[2] || "B").toUpperCase();
  const multiplierByUnit = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };
  return numeric * (multiplierByUnit[unit] || 1);
}

function formatBytesCompact(bytes) {
  const numeric = Math.max(0, Number(bytes || 0));
  if (numeric >= 1024 ** 4) {
    return `${formatMetricNumber(numeric / 1024 ** 4, { maximumFractionDigits: 1 })} TB`;
  }
  if (numeric >= 1024 ** 3) {
    return `${formatMetricNumber(numeric / 1024 ** 3, { maximumFractionDigits: 1 })} GB`;
  }
  if (numeric >= 1024 ** 2) {
    return `${formatMetricNumber(numeric / 1024 ** 2, { maximumFractionDigits: 1 })} MB`;
  }
  if (numeric >= 1024) {
    return `${formatMetricNumber(numeric / 1024, { maximumFractionDigits: 1 })} KB`;
  }
  return `${formatMetricNumber(numeric, { maximumFractionDigits: 0 })} B`;
}

function formatByteRate(bytesPerSecond) {
  return `${formatBytesCompact(bytesPerSecond)}/s`;
}

function formatDurationCompact(minutes) {
  const totalMinutes = Math.max(0, Math.round(Number(minutes || 0)));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const remainderMinutes = totalMinutes % 60;
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return remainderMinutes > 0 ? `${hours}h ${remainderMinutes}m` : `${hours}h`;
  }
  return `${remainderMinutes}m`;
}

function isFeedMetricExpandable(metricKey) {
  return metricKey === "data-size" || metricKey === "uptime" || metricKey === "health";
}

function getFeedExpandedMetricKey(feedId) {
  if (!feedId) return "";
  return state.feedState.drawerExpandedMetricKeyByFeedId[feedId] || "";
}

function toggleFeedExpandedMetricKey(feedId, metricKey) {
  if (!feedId || !isFeedMetricExpandable(metricKey)) return;
  const currentKey = getFeedExpandedMetricKey(feedId);
  state.feedState.drawerExpandedMetricKeyByFeedId[feedId] =
    currentKey === metricKey ? "" : metricKey;
}

function resetFeedExpandedMetricKey(feedId) {
  if (!feedId) return;
  delete state.feedState.drawerExpandedMetricKeyByFeedId[feedId];
}

function toFeedSparklineValue(rateValue, unit) {
  if (unit === "GB/s") return Math.max(1, Math.round(rateValue * 10));
  if (unit === "MB/s") return Math.max(1, Math.round(rateValue / 12));
  if (unit === "KB/s") return Math.max(1, Math.round(rateValue / 128));
  if (unit === "Gbps") return Math.max(1, Math.round(rateValue * 8));
  if (unit === "Mbps") return Math.max(1, Math.round(rateValue / 12));
  return Math.max(1, Math.round(rateValue));
}

function updateFeedRateSimulation() {
  if (state.activeSectionId !== "feeds") return;

  let didChange = false;

  state.feedState.rows.forEach((feed) => {
    if (!feed) return;

    const previousRate = String(feed.captureRate || "");
    const previousLabel = String(feed.status?.label || "");
    const previousExtra = String(feed.status?.extra || "");
    const previousUptime = Number(feed.uptimePct || 0);
    const previousHealth = Number(feed.healthScore || 0);

    if (feed.status?.tone === "active" || feed.status?.tone === "syncing") {
      const currentRate = parseRateValue(feed.captureRate);
      if (currentRate && Number.isFinite(currentRate.value)) {
        const variance = Math.max(
          currentRate.value * 0.08,
          currentRate.unit.includes("MB") ? 6 : 10,
        );
        const nextValue = Math.max(
          0.5,
          currentRate.value + (Math.random() * variance * 2 - variance),
        );
        feed.captureRate = formatRateValue(nextValue, currentRate.unit);

        if (Array.isArray(feed.ingestSparkline) && feed.ingestSparkline.length) {
          feed.ingestSparkline = [
            ...feed.ingestSparkline.slice(-11),
            toFeedSparklineValue(nextValue, currentRate.unit),
          ];
        }
      }

      if (feed.status?.tone === "syncing") {
        feed.syncPercent = Math.min(99, Math.max(8, Number(feed.syncPercent || 0) + 1));
      }
    }

    syncFeedDerivedMetrics(feed);

    if (
      String(feed.captureRate || "") !== previousRate ||
      String(feed.status?.label || "") !== previousLabel ||
      String(feed.status?.extra || "") !== previousExtra ||
      Number(feed.uptimePct || 0) !== previousUptime ||
      Number(feed.healthScore || 0) !== previousHealth
    ) {
      didChange = true;
    }
  });

  if (!didChange) return;
  if (state.feedState.createFlow.open || state.feedState.drawerEditCard || state.feedState.openFeedId) return;
  renderContent();
}

function startFeedRateSimulation() {
  if (feedRateSimulationTimer) return;
  feedRateSimulationTimer = window.setInterval(updateFeedRateSimulation, 2600);
}

function updateNoSubscriptionWarning(feed) {
  if (!feed || !feed.status) return;
  if (feed.subscriptionCount === 0 && feed.status.tone === "active") {
    feed.status.extra = "no subscribed projects";
  } else if (
    feed.subscriptionCount > 0 &&
    feed.status.tone === "active" &&
    feed.status.extra === "no subscribed projects"
  ) {
    feed.status.extra = "capture stable";
  }
}

function setFeedStatus(feed, tone, extra) {
  feed.statusSince = Date.now();
  feed.status = buildFeedStatus(feed, tone, extra);
  syncFeedDerivedMetrics(feed);
}

function canPauseFeed(tone) {
  return tone !== "paused" && tone !== "initializing";
}

function canResumeFeed(tone) {
  return tone === "paused";
}

function pauseFeed(feed, sourceLabel) {
  if (!feed || !canPauseFeed(feed.status?.tone)) return false;
  setFeedStatus(feed, "paused", sourceLabel === "bulk" ? "stopped in bulk action" : "manual stop");
  touchFeed(feed);
  appendFeedLog(feed, "config", "Feed stopped by analyst");
  return true;
}

function resumeFeed(feed, sourceLabel) {
  if (!feed || !canResumeFeed(feed.status?.tone)) return false;
  setFeedStatus(
    feed,
    "active",
    sourceLabel === "bulk" ? "started in bulk action" : "capture resumed",
  );
  touchFeed(feed);
  appendFeedLog(feed, "config", "Feed started by analyst");
  return true;
}

function retryFeed(feed) {
  if (!feed || feed.status?.tone !== "error") return false;
  feed.syncPercent = 38;
  setFeedStatus(feed, "syncing", "retry requested");
  touchFeed(feed);
  appendFeedLog(feed, "error", "Retry initiated manually");
  showToast(`Retry started for ${feed.name}.`);
  return true;
}

function removeMissingSelectedFeedIds() {
  const validIds = new Set(state.feedState.rows.map((row) => row.id));
  const nextSelected = new Set();
  const nextExpanded = new Set();
  const nextDrawerCardOpenByFeedId = {};
  state.feedState.selectedIds.forEach((feedId) => {
    if (validIds.has(feedId)) {
      nextSelected.add(feedId);
    }
  });
  state.feedState.expandedIds.forEach((feedId) => {
    if (validIds.has(feedId)) {
      nextExpanded.add(feedId);
    }
  });
  Object.entries(state.feedState.drawerCardOpenByFeedId).forEach(([feedId, cardState]) => {
    if (validIds.has(feedId)) {
      nextDrawerCardOpenByFeedId[feedId] = cardState;
    }
  });
  state.feedState.selectedIds = nextSelected;
  state.feedState.expandedIds = nextExpanded;
  state.feedState.drawerCardOpenByFeedId = nextDrawerCardOpenByFeedId;
}

function toggleFeedExpansion(feedId) {
  if (state.feedState.expandedIds.has(feedId)) {
    state.feedState.expandedIds.delete(feedId);
    return;
  }
  state.feedState.expandedIds.add(feedId);
}

function getFeedDrawerCardState(feedId) {
  if (!state.feedState.drawerCardOpenByFeedId[feedId]) {
    state.feedState.drawerCardOpenByFeedId[feedId] = {};
  }
  return state.feedState.drawerCardOpenByFeedId[feedId];
}

function isFeedDrawerCardOpen(feedId, cardKey) {
  const cardState = getFeedDrawerCardState(feedId);
  if (Object.prototype.hasOwnProperty.call(cardState, cardKey)) {
    return cardState[cardKey];
  }
  return true;
}

function setFeedDrawerCardOpen(feedId, cardKey, isOpen) {
  const cardState = getFeedDrawerCardState(feedId);
  cardState[cardKey] = isOpen;
}

function getFeedDrawerCardKeyForEditCard(card) {
  if (card === "capture") return "capture-settings";
  if (card === "filters") return "filter-rules";
  return "";
}

function isFeedDrawerInEditMode() {
  return state.feedState.drawerEditCard === "all";
}

function openFeedDrawer(feedId) {
  if (!getFeedById(feedId)) return;
  if (state.feedState.openFeedId && state.feedState.openFeedId !== feedId) {
    resetFeedExpandedMetricKey(state.feedState.openFeedId);
  }
  state.feedState.openFeedId = feedId;
  resetFeedExpandedMetricKey(feedId);
  state.feedState.drawerLogFilter = "all";
  state.feedState.drawerMetric = "volume";
  state.feedState.drawerRange = "7d";
  state.feedState.drawerOpenMenuKey = "";
  state.feedState.drawerEditCard = "";
  state.feedState.drawerDraft = null;
  renderFeedDrawer();
}

function closeFeedDrawer() {
  resetFeedExpandedMetricKey(state.feedState.openFeedId);
  state.feedState.openFeedId = "";
  state.feedState.drawerOpenMenuKey = "";
  state.feedState.drawerEditCard = "";
  state.feedState.drawerDraft = null;
  renderFeedDrawer();
}

function beginFeedDrawerEdit(feed) {
  state.feedState.drawerOpenMenuKey = "";
  state.feedState.drawerEditCard = "all";
  state.feedState.drawerDraft = createFeedDrawerDraft(feed);
}

function saveFeedDrawerEdits(feed) {
  const captureSaved = saveFeedDrawerCardEdit(feed, "capture", { keepEditing: true });
  if (!captureSaved) return false;
  const filtersSaved = saveFeedDrawerCardEdit(feed, "filters", { keepEditing: true });
  if (!filtersSaved) return false;
  cancelFeedDrawerCardEdit();
  return true;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeStatusTone(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function getStatusBadgeClass(tone) {
  const key = normalizeStatusTone(tone);
  return STATUS_BADGE_CLASS_BY_TONE[key] || "status-disabled";
}

function renderStatusBadgeMarkup(status, options = {}) {
  const statusObject =
    status && typeof status === "object"
      ? status
      : { tone: status, label: String(status || "Unknown") };
  const label = statusObject.label || options.fallbackLabel || "-";
  const extra =
    options.includeExtra === true
      ? String(statusObject.extra || "").trim()
      : "";
  const badgeClass = getStatusBadgeClass(statusObject.tone || label);

  if (statusObject.mode === "rate") {
    return `
      <span class="launcher-status-cell">
        <span class="launcher-rate-badge">
          <span class="launcher-svg-icon launcher-icon-arrow-short-down" aria-hidden="true"></span>
          <span class="launcher-rate-badge-label">${escapeHtml(label)}</span>
        </span>
        ${extra ? `<span class="launcher-status-extra">${escapeHtml(extra)}</span>` : ""}
      </span>
    `;
  }

  return `
    <span class="launcher-status-cell">
      <span class="status-badge ${badgeClass}">
        <span class="status-badge-icon" aria-hidden="true"></span>
        <span class="status-badge-label">${escapeHtml(label)}</span>
      </span>
      ${extra ? `<span class="launcher-status-extra">${escapeHtml(extra)}</span>` : ""}
    </span>
  `;
}

function closeFeedDrawerActionMenu() {
  feedDrawerActionsMenuEl.classList.add("hidden");
  feedDrawerMenuEl.classList.remove("active", "is-active");
  feedDrawerMenuEl.setAttribute("aria-expanded", "false");
}

function renderFeedDrawerActionMenu(feed) {
  const isEditing = isFeedDrawerInEditMode();
  if (!feed || isEditing) {
    feedDrawerActionsMenuEl.innerHTML = "";
    closeFeedDrawerActionMenu();
    return;
  }

  const isPaused = feed.status?.tone === "paused";
  const isInitializing = feed.status?.tone === "initializing";
  const actionLabel = isPaused ? "Start Feed" : "Stop Feed";

  feedDrawerActionsMenuEl.innerHTML = `
    <button
      class="menu-item"
      type="button"
      role="menuitem"
      data-feed-header-action="toggle-pause"
      ${isInitializing ? "disabled" : ""}
    >
      <span class="menu-item-inner">
        <span class="menu-item-label">${escapeHtml(actionLabel)}</span>
      </span>
    </button>
  `;

  if (!feedDrawerActionsMenuEl.classList.contains("hidden")) {
    placeMenuAtAnchor(feedDrawerActionsMenuEl, feedDrawerMenuEl);
  }
}

function getDrawerProjectChoices(feed) {
  const subscribed = new Set((feed.subscribedProjects || []).map((project) => project.name));
  return WORKSPACE_PROJECT_NAMES.filter((name) => !subscribed.has(name));
}

function getChartValues(feed, metric, range) {
  const sourceValues = Array.isArray(feed.ingestSparkline) ? feed.ingestSparkline : [];
  const base = sourceValues.length ? sourceValues : [0];
  const neededBars = FEED_RANGE_TO_BARS[range] || 24;
  const denseBase = Array.from({ length: neededBars }, (_, index) => {
    if (neededBars === 1) return Number(base[0] || 0);
    const position = (index / (neededBars - 1)) * Math.max(0, base.length - 1);
    const leftIndex = Math.floor(position);
    const rightIndex = Math.min(base.length - 1, Math.ceil(position));
    const blend = position - leftIndex;
    const leftValue = Number(base[leftIndex] || 0);
    const rightValue = Number(base[rightIndex] || 0);
    return leftValue + (rightValue - leftValue) * blend;
  });

  if (metric === "files") {
    return denseBase.map((value, index) =>
      Math.max(0, Math.round(value * 7 + (index % 4) * 2)),
    );
  }

  if (metric === "volume") {
    return denseBase.map((value, index, values) => {
      const previous = values[Math.max(0, index - 1)] ?? value;
      const next = values[Math.min(values.length - 1, index + 1)] ?? value;
      return Math.max(
        0,
        Math.round((value * 0.52 + previous * 0.24 + next * 0.24) * 140 + (index % 3) * 18),
      );
    });
  }

  const ceiling = Math.max(...denseBase, 1);
  return denseBase.map((value, index) =>
    Math.max(
      0,
      Math.round((ceiling - value) * 1.7 + ((index + 1) % 5 === 0 ? 7 : 2)),
    ),
  );
}

function renderFeedChartBars(values) {
  const max = Math.max(...values, 1);
  return values
    .map((value) => {
      const height = Math.max(4, Math.round((Number(value || 0) / max) * 46));
      return `<span class="launcher-feed-chart-bar" style="height:${height}px"></span>`;
    })
    .join("");
}

function createFeedDrawerDraft(feed) {
  return {
    deviceLabel: feed.deviceLabel || "",
    captureInput: feed.captureInput || "",
    portProfile: getDetectedNapatechLayout(feed.deviceLabel, feed.portProfile || ""),
    outputPath: feed.outputPath || "",
    chunkSizeMb: String(feed.chunkSizeMb || 0),
    closeAndProcessSeconds: String(feed.closeAndProcessSeconds || 0),
    retentionDays: String(feed.retentionDays || 0),
    filterMode: feed.filterMode || "include",
    protocols: feed.protocols || "",
    subnets: feed.subnets || "",
    sourceSubnets: feed.sourceSubnets || "",
    destinationSubnets: feed.destinationSubnets || "",
    ports: feed.ports || "",
    vlanId: feed.vlanId || "",
    rawBpf: feed.rawBpf || "",
    estimatedStorageReduction: String(feed.estimatedStorageReduction || 0),
  };
}

function getFeedDrawerDraft(feed) {
  if (!state.feedState.drawerDraft) {
    state.feedState.drawerDraft = createFeedDrawerDraft(feed);
  }
  return state.feedState.drawerDraft;
}

function buildFeedLinePoints(values, width, height, padding = 12) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = Math.round(index * step);
      const normalized = (Number(value || 0) - min) / range;
      const y = Math.round(height - normalized * (height - padding * 2) - padding);
      return `${x},${y}`;
    })
    .join(" ");
}

function buildFeedAreaPath(values, width, height, padding = 12) {
  const points = buildFeedLinePoints(values, width, height, padding);
  const firstPoint = points.split(" ")[0] || `0,${height}`;
  const lastPoint = points.split(" ").slice(-1)[0] || `${width},${height}`;
  const firstX = Number(firstPoint.split(",")[0] || 0);
  const lastX = Number(lastPoint.split(",")[0] || width);
  return `M ${firstX},${height} L ${points.replace(/ /g, " L ")} L ${lastX},${height} Z`;
}

function renderFeedHistoryLines(feed) {
  const width = 482;
  const height = 140;
  const filesValues = getChartValues(feed, "files", state.feedState.drawerRange);
  const volumeValues = getChartValues(feed, "volume", state.feedState.drawerRange);
  const errorValues = getChartValues(feed, "errors", state.feedState.drawerRange);
  const focusMetric = state.feedState.drawerMetric || "volume";
  const focusClass = (metric) =>
    metric === focusMetric
      ? "launcher-feed-history-line is-focus"
      : "launcher-feed-history-line";

  return `
    <svg class="launcher-feed-history-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      <path class="launcher-feed-history-area is-volume" d="${buildFeedAreaPath(
        volumeValues,
        width,
        height,
      )}"></path>
      <path class="launcher-feed-history-area is-files" d="${buildFeedAreaPath(
        filesValues,
        width,
        height,
      )}"></path>
      <path class="${focusClass("files")} is-files" d="M ${buildFeedLinePoints(
        filesValues,
        width,
        height,
      ).replace(/ /g, " L ")}"></path>
      <path class="${focusClass("volume")} is-volume" d="M ${buildFeedLinePoints(
        volumeValues,
        width,
        height,
      ).replace(/ /g, " L ")}"></path>
      <path class="${focusClass("errors")} is-errors" d="M ${buildFeedLinePoints(
        errorValues,
        width,
        height,
      ).replace(/ /g, " L ")}"></path>
    </svg>
  `;
}

function getFeedSourceDetailsFromDraft(draft) {
  const deviceLabel = draft.deviceLabel || "unassigned device";
  const captureInput = draft.captureInput || "unassigned input";
  if (draft.type === "Napatech") {
    return `Napatech ${deviceLabel} · ${syncNapatechDraftPortProfile(draft) || "layout pending"} · ${captureInput}`;
  }
  return `Generic interface ${deviceLabel} · ${captureInput}`;
}

function getFeedListCountSummary(value, singular, plural = `${singular}s`) {
  const rawValue = String(value || "").trim();
  if (!rawValue || rawValue.toLowerCase() === "any") {
    return "Any";
  }

  const values = rawValue
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const count = values.length || 1;
  return `${count} ${count === 1 ? singular : plural}`;
}

function getFeedDrawerPresetValues(field, fallbackValues = []) {
  const seen = new Set();
  const values = [];

  [...fallbackValues, ...state.feedState.rows.map((feed) => feed?.[field])]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .forEach((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      values.push(value);
    });

  return values;
}

function getFeedDrawerDeviceOptions(type, currentValue = "") {
  const current = String(currentValue || "").trim();
  const fallback =
    type === "Napatech"
      ? Object.keys(NAPATECH_DEVICE_STATES)
      : ["sensor-phx-07", "sensor-west-02", "sensor-lab-01"];
  const values = getFeedDrawerPresetValues(
    "deviceLabel",
    current ? [current, ...fallback] : fallback,
  );
  return values.map((value) => ({ value, label: value }));
}

function getFeedDrawerFilterMenuOptions(field, draft) {
  const currentValue = String(draft?.[field] || "").trim();
  const presetsByField = {
    protocols: ["Any", "TCP", "TCP, UDP", "TCP, UDP, ICMP", "TCP, UDP, TLS"],
    subnets: ["Any", "10.24.18.0/24", "10.24.18.0/24, 172.16.40.0/21", "10.70.0.0/16"],
    sourceSubnets: ["Any", "10.24.18.0/24", "10.16.0.0/16", "192.168.44.0/24"],
    destinationSubnets: ["Any", "172.16.40.0/21", "198.51.100.0/24", "10.44.0.0/16"],
    ports: ["Any", "22", "80, 443", "80, 443, 47808", "502, 44818"],
  };
  const values = getFeedDrawerPresetValues(
    field,
    currentValue ? [currentValue, ...(presetsByField[field] || [])] : presetsByField[field] || [],
  );
  return values.map((value) => ({ value, label: value }));
}

function renderFeedStorageReductionControl(value) {
  const numericValue = Math.max(0, Math.min(100, Number(value || 0)));
  return `
    <div class="launcher-drawer-slider-field">
      <input
        class="launcher-drawer-slider"
        type="range"
        min="0"
        max="100"
        value="${escapeHtml(numericValue)}"
        data-feed-drawer-draft="estimatedStorageReduction"
      />
      <input
        class="launcher-drawer-input launcher-drawer-input--compact"
        type="number"
        min="0"
        max="100"
        value="${escapeHtml(numericValue)}"
        data-feed-drawer-draft="estimatedStorageReduction"
      />
    </div>
  `;
}

function getFeedFilterRuleCount(draft) {
  const fields = [
    draft.protocols || draft.protocol,
    draft.subnets,
    draft.sourceSubnets || draft.sourceHost,
    draft.destinationSubnets || draft.destinationHost,
    draft.ports || draft.portRange,
    draft.vlanId,
  ];
  const ruleCount = fields.filter((value) => String(value || "").trim()).length;
  return ruleCount + (String(draft.rawBpf || "").trim() ? 1 : 0);
}

function findDuplicateFeedSource(source, excludeFeedId = "") {
  const normalized = String(source || "").trim().toLowerCase();
  if (!normalized) return null;
  return (
    state.feedState.rows.find(
      (feed) =>
        feed.id !== excludeFeedId &&
        String(feed.source || "").trim().toLowerCase() === normalized,
    ) || null
  );
}

function getFeedFilesFilterValue(feedId) {
  return state.feedState.filesFilterByFeedId[feedId] || "all";
}

function getFeedFilesPagination(feedId, totalItems) {
  const pageSize = 5;
  const stored = state.feedState.filesPaginationByFeedId[feedId] || { page: 1 };
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / pageSize));
  const next = {
    page: Math.min(Math.max(1, stored.page || 1), totalPages),
    pageSize,
    totalPages,
  };
  state.feedState.filesPaginationByFeedId[feedId] = next;
  return next;
}

function getVisibleFeedFiles(feed) {
  const files = Array.isArray(feed.producedFiles) ? feed.producedFiles : [];
  const filter = getFeedFilesFilterValue(feed.id);
  if (filter === "all") return files;
  return files.filter((file) => file.tone === filter);
}

function getFeedFileToneLabel(tone) {
  if (tone === "warning") return "Warn";
  if (tone === "error") return "Error";
  return "Ready";
}

function renderFeedProducedFilesMarkup(feed) {
  const filteredFiles = getVisibleFeedFiles(feed);
  const pager = getFeedFilesPagination(feed.id, filteredFiles.length);
  const startIndex = (pager.page - 1) * pager.pageSize;
  const endIndex = Math.min(filteredFiles.length, startIndex + pager.pageSize);
  const visibleFiles = filteredFiles.slice(startIndex, endIndex);
  const displayStart = filteredFiles.length ? startIndex + 1 : 0;
  const displayEnd = filteredFiles.length ? endIndex : 0;

  const rowsMarkup = visibleFiles.length
    ? visibleFiles
        .map(
          (file) => `
            <div class="launcher-feed-files-row">
              <div class="launcher-feed-files-cell launcher-feed-files-cell-name">${escapeHtml(
                file.name,
              )}</div>
              <div class="launcher-feed-files-cell">${escapeHtml(file.size || "-")}</div>
              <div class="launcher-feed-files-cell">${escapeHtml(file.created || "-")}</div>
              <div class="launcher-feed-files-cell">${renderStatusBadgeMarkup(
                {
                  tone: file.tone,
                  label: getFeedFileToneLabel(file.tone),
                },
                { includeExtra: false },
              )}</div>
              <div class="launcher-feed-files-cell launcher-feed-files-cell-note">${escapeHtml(
                file.note || "-",
              )}</div>
            </div>
          `,
        )
        .join("")
    : `
      <div class="launcher-feed-files-empty">
        No produced files match this filter.
      </div>
    `;

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "warning", label: "Warn" },
    { value: "error", label: "Error" },
  ];

  return `
    <div class="launcher-feed-files-shell">
      <div class="launcher-feed-files-toolbar">
        <div class="launcher-feed-files-filters" role="group" aria-label="Produced file filter">
      ${filterOptions
            .map(
              (option) => `
                <button
                  class="btn-reset btn-secondary size-s style-ghost launcher-feed-files-filter ${
                    getFeedFilesFilterValue(feed.id) === option.value ? "active" : ""
                  }"
                  type="button"
                  aria-pressed="${
                    getFeedFilesFilterValue(feed.id) === option.value ? "true" : "false"
                  }"
                  data-feed-files-filter="${escapeHtml(feed.id)}"
                  data-feed-files-filter-value="${escapeHtml(option.value)}"
                >
                  ${escapeHtml(option.label)}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="launcher-feed-files-table">
        <div class="launcher-feed-files-header">
          <div class="launcher-feed-files-cell launcher-feed-files-cell-name">File</div>
          <div class="launcher-feed-files-cell">Size</div>
          <div class="launcher-feed-files-cell">Created</div>
          <div class="launcher-feed-files-cell">Status</div>
          <div class="launcher-feed-files-cell launcher-feed-files-cell-note">Notes</div>
        </div>
        <div class="launcher-feed-files-body">${rowsMarkup}</div>
      </div>
      <div class="launcher-feed-files-pagination">
        <div class="launcher-feed-files-pagination-range">
          <strong>${displayStart}-${displayEnd}</strong> of ${filteredFiles.length}
        </div>
        <div class="launcher-feed-files-pagination-nav" role="group" aria-label="Produced file pagination">
          <button
            class="btn-reset launcher-feed-files-pagination-button"
            type="button"
            data-feed-files-prev="${escapeHtml(feed.id)}"
            ${pager.page <= 1 ? "disabled" : ""}
            aria-label="Previous page"
          >
            <span class="launcher-svg-icon launcher-icon-arrow-left" aria-hidden="true"></span>
          </button>
          <span class="launcher-feed-files-pagination-divider" aria-hidden="true"></span>
          <button
            class="btn-reset launcher-feed-files-pagination-button"
            type="button"
            data-feed-files-next="${escapeHtml(feed.id)}"
            ${pager.page >= pager.totalPages ? "disabled" : ""}
            aria-label="Next page"
          >
            <span class="launcher-svg-icon launcher-icon-arrow-right" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function getFeedActivityRows(feed) {
  const logType = state.feedState.drawerLogFilter;
  const rows = Array.isArray(feed.activityLog) ? feed.activityLog : [];
  if (logType === "all") return rows;
  return rows.filter((row) => row.type === logType);
}

function getFeedActivityTypeLabel(type) {
  if (type === "ingest") return "History";
  return toLabelCase(type);
}

function renderFeedDrawerMenuControl(options) {
  const {
    field,
    value,
    menuOptions,
    control = "draft",
    kind = "select",
    size = "medium",
    summary = "",
  } = options;
  const menuKey = `${control}:${field}`;
  const isOpen = state.feedState.drawerOpenMenuKey === menuKey;
  const iconSrc =
    kind === "dropdown"
      ? LAUNCHER_MENU_DROPDOWN_ICON_SRC
      : LAUNCHER_MENU_SELECT_ICON_SRC;
  const displayValue = summary || value;
  const optionMarkup = menuOptions
    .map((option) => {
      const optionValue = typeof option === "string" ? option : option.value;
      const optionLabel = typeof option === "string" ? option : option.label;
      const selectedClass = optionValue === value ? " is-selected" : "";
      return `
        <button
          type="button"
        class="menu-item suri-menu-option${selectedClass}"
          data-feed-drawer-menu-option="${escapeHtml(menuKey)}"
          data-feed-drawer-menu-value="${escapeHtml(optionValue)}"
        >
          <span>${escapeHtml(optionLabel)}</span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="suri-menu launcher-feed-menu launcher-feed-menu--${escapeHtml(size)}${isOpen ? " is-open" : ""}">
      <button
        type="button"
        class="suri-menu-trigger ${kind === "dropdown" ? "suri-dropdown" : "suri-select"}"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? "true" : "false"}"
        data-feed-drawer-menu-trigger="${escapeHtml(menuKey)}"
      >
        <span class="suri-menu-value">${escapeHtml(displayValue)}</span>
        <img class="suri-menu-trigger-icon" src="${iconSrc}" alt="" aria-hidden="true" />
      </button>
      <div class="menu-list" role="listbox">
        ${optionMarkup}
      </div>
    </div>
  `;
}

function renderStaticField(value) {
  return `<span class="static-field suri-static-field">${escapeHtml(value)}</span>`;
}

function getNapatechTapLabel(portNumber) {
  return `Tap ${Math.max(0, Number(portNumber || 1) - 1)}`;
}

function isFeedDrawerPortSelectable(meta, editMode = false) {
  if (!meta) return false;
  return editMode ? meta.drawerSelectableEdit : meta.drawerSelectableView;
}

function canFeedDrawerPortDriveCaptureInput(meta, editMode = false) {
  if (!meta) return false;
  return meta.isCurrentFeedPort || (editMode && meta.tone === "available");
}

function getDefaultSelectedFeedDrawerPort(deviceState, currentFeedId = "", options = {}) {
  if (!Array.isArray(deviceState?.ports)) return null;
  const editMode = !!options.editMode;

  return (
    deviceState.ports.find((port) => port.assignedFeedId === currentFeedId) ||
    (editMode
      ? deviceState.ports.find((port) => getPortStateMeta(port, currentFeedId).tone === "available")
      : null) ||
    deviceState.ports.find((port) =>
      isFeedDrawerPortSelectable(getPortStateMeta(port, currentFeedId), editMode),
    ) ||
    deviceState.ports[0] ||
    null
  );
}

function getFeedDrawerSelectedPortNumber(feedId, deviceState, currentFeedId = "", options = {}) {
  const editMode = !!options.editMode;
  const stored = Number(state.feedState.drawerSelectedPortNumberByFeedId[feedId] || 0);
  if (stored && Array.isArray(deviceState?.ports)) {
    const storedPort = deviceState.ports.find((port) => port.number === stored) || null;
    const storedMeta = storedPort ? getPortStateMeta(storedPort, currentFeedId) : null;
    if (
      storedPort &&
      (storedMeta?.isCurrentFeedPort || isFeedDrawerPortSelectable(storedMeta, editMode))
    ) {
      return stored;
    }
  }

  return getDefaultSelectedFeedDrawerPort(deviceState, currentFeedId, { editMode })?.number || 0;
}

function setFeedDrawerSelectedPortNumber(feedId, portNumber) {
  if (!feedId) return;
  state.feedState.drawerSelectedPortNumberByFeedId[feedId] = Number(portNumber || 0);
}

function buildPreviewPortsForLayout(layout) {
  const activePortCount = NAPATECH_LAYOUT_ACTIVE_PORTS[layout] || 2;
  const speedLabel = layout.includes("100G")
    ? "100G"
    : layout.includes("40G")
      ? "40G"
      : layout.includes("25G")
        ? "10/25G"
        : "10G";

  return Array.from({ length: 8 }, (_, index) => {
    const number = index + 1;
    const isActive = number <= activePortCount;
    const virtual =
      activePortCount > 2 || number > 2 || layout === "2x10/25G" || layout === "2x1/10G";
    return {
      number,
      virtual,
      state: isActive ? "available" : "unavailable",
      speed: speedLabel,
      detail: isActive
        ? "Potentially exposed by the selected layout. Actual availability is detected from firmware."
        : "Not exposed by the selected layout until the firmware profile changes.",
    };
  });
}

function getPortStateMeta(port, currentFeedId = "") {
  if (port.state === "assigned" && port.assignedFeedId === currentFeedId) {
    return {
      tone: "assigned",
      visualTone: "active",
      iconClass: "launcher-icon-lightning",
      label: "Active",
      assignment: "Assigned to this feed",
      isCurrentFeedPort: true,
      drawerSelectableView: true,
      drawerSelectableEdit: true,
      deviceSelectable: true,
    };
  }

  if (port.state === "assigned" || port.state === "in-use") {
    const assignedFeed =
      port.assignedFeedId && getFeedById(port.assignedFeedId)
        ? getFeedById(port.assignedFeedId).name
        : port.assignedFeedLabel || "Another capture feed";
    return {
      tone: port.state === "assigned" ? "assigned" : "in-use",
      visualTone: "unavailable",
      iconClass: "launcher-icon-block",
      label: "In use elsewhere",
      assignment: assignedFeed,
      isCurrentFeedPort: false,
      drawerSelectableView: false,
      drawerSelectableEdit: false,
      deviceSelectable: true,
    };
  }

  if (port.state === "error") {
    return {
      tone: "error",
      visualTone: "warning",
      iconClass: "launcher-icon-warning-fill",
      label: "Warning",
      assignment: "Hardware or mirror issue",
      isCurrentFeedPort: false,
      drawerSelectableView: false,
      drawerSelectableEdit: false,
      deviceSelectable: true,
    };
  }

  if (port.state === "unavailable") {
    return {
      tone: "unavailable",
      visualTone: "unavailable",
      iconClass: "launcher-icon-block",
      label: "Unavailable",
      assignment: "Hidden by firmware layout",
      isCurrentFeedPort: false,
      drawerSelectableView: false,
      drawerSelectableEdit: false,
      deviceSelectable: true,
    };
  }

  return {
    tone: "available",
    visualTone: "available",
    iconClass: "launcher-icon-check-circle-filled",
    label: "Available",
    assignment: "Open for feed assignment",
    isCurrentFeedPort: false,
    drawerSelectableView: false,
    drawerSelectableEdit: true,
    deviceSelectable: true,
  };
}

function getDefaultSelectedPort(deviceState, currentFeedId = "") {
  if (!deviceState || !Array.isArray(deviceState.ports)) return null;
  return (
    deviceState.ports.find((port) => port.assignedFeedId === currentFeedId) ||
    deviceState.ports.find((port) => getPortStateMeta(port, currentFeedId).tone === "available") ||
    deviceState.ports[0] ||
    null
  );
}

function getPortGridType(layout = "") {
  const normalized = String(layout || "").trim().toLowerCase();
  if (
    normalized === "4x10/25g" ||
    normalized === "4x25g" ||
    normalized === "8x10g" ||
    normalized === "2x10/25g" ||
    normalized === "2x1/10g"
  ) {
    return "virtual";
  }
  return "physical";
}

function getPortGridTypeLabel(layout = "") {
  return getPortGridType(layout) === "virtual" ? "Virtual Ports" : "Physical Ports";
}

function renderPortTileMarkup(port, currentFeedId = "", options = {}) {
  const meta = getPortStateMeta(port, currentFeedId);
  const portGridType = options.gridType || (port.virtual ? "virtual" : "physical");
  const portTypeLabel = portGridType === "virtual" ? "Virtual" : "Physical";
  const isSelected = options.selectedPortNumber === port.number;
  const selectedClass = isSelected ? " is-selected" : "";
  const isFeedSelectable =
    options.interaction === "feed-select" &&
    isFeedDrawerPortSelectable(meta, !!options.editMode);
  const isInteractive =
    options.interaction === "select"
      ? meta.deviceSelectable !== false
      : options.interaction === "feed-select"
        ? isFeedSelectable
        : false;
  const interactionAttrs =
    options.interaction === "select"
      ? `type="button" data-device-port-select="${escapeHtml(port.number)}"`
      : options.interaction === "feed-select" && isFeedSelectable
        ? `type="button" data-feed-port-select="${escapeHtml(port.number)}"`
        : `type="button"${options.interaction === "feed-select" ? " disabled" : ""}`;
  const detailLabel = [
    `Port ${port.number}`,
    portTypeLabel,
    meta.label,
    port.speed || "",
    meta.assignment,
    port.detail || "",
  ]
    .filter(Boolean)
    .join(" · ");
  return `
    <button class="btn-reset launcher-port-tile launcher-port-tile--${escapeHtml(meta.visualTone)}${
      portGridType === "virtual" ? " is-virtual" : ""
    }${selectedClass}${isInteractive ? " is-interactive" : ""}" ${interactionAttrs}${
      isInteractive ? ` aria-pressed="${isSelected ? "true" : "false"}"` : ""
    } aria-label="${escapeHtml(detailLabel)}">
      <span class="launcher-port-tile-shell">
        <span class="launcher-port-tile-number">${escapeHtml(port.number)}</span>
        <span class="launcher-port-tile-speed">${escapeHtml(port.speed || "-")}</span>
        <span class="launcher-svg-icon ${escapeHtml(meta.iconClass)} launcher-port-tile-state-icon" aria-hidden="true"></span>
      </span>
    </button>
  `;
}

function renderPortPreviewMarkup(deviceState, currentFeedId = "", options = {}) {
  const thumbnail = deviceState.thumbnail || "../icons/integration/general/integration_napatech.svg";
  const layoutLabel = deviceState.detectedLayout || options.portProfile || "";
  const gridType = getPortGridType(layoutLabel);
  const gridTypeLabel = getPortGridTypeLabel(layoutLabel);
  return `
    <div class="launcher-port-preview launcher-port-preview--${escapeHtml(gridType)}">
      <div class="launcher-port-preview-thumb">
        <img src="${thumbnail}" alt="" aria-hidden="true" />
      </div>
      <div class="launcher-port-preview-card">
        <div class="launcher-port-preview-meta">${escapeHtml(gridTypeLabel)}</div>
        <div class="launcher-port-preview-grid">
          ${deviceState.ports
            .map((port) => renderPortTileMarkup(port, currentFeedId, { ...options, gridType }))
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPortLegendMarkup() {
  const items = [
    { tone: "active", label: "Active" },
    { tone: "available", label: "Available" },
    { tone: "unavailable", label: "Unavailable" },
    { tone: "warning", label: "Warning" },
  ];

  return `
    <div class="launcher-port-legend">
      ${items
        .map(
          (item) => `
            <span class="launcher-port-legend-item">
              <span class="launcher-port-legend-swatch launcher-port-legend-swatch--${escapeHtml(
                item.tone,
              )}"></span>
              <span>${escapeHtml(item.label)}</span>
            </span>
          `,
        )
        .join("")}
      <span class="launcher-port-legend-item">
        <span class="launcher-port-virtual-icon" aria-hidden="true"></span>
        <span>Virtual port</span>
      </span>
    </div>
  `;
}

function renderDevicePortTableMarkup(deviceState, currentFeedId = "") {
  const rows = deviceState.ports
    .map((port) => {
      const meta = getPortStateMeta(port, currentFeedId);
      return `
        <div class="launcher-port-table-row">
          <div class="launcher-port-table-cell launcher-port-table-cell-port">
            <span class="launcher-port-inline-indicator launcher-port-inline-indicator--${escapeHtml(
              meta.visualTone,
            )}"></span>
            <span>Port ${escapeHtml(port.number)}</span>
          </div>
          <div class="launcher-port-table-cell">${port.virtual ? "Virtual" : "Physical"}</div>
          <div class="launcher-port-table-cell">${escapeHtml(port.speed || "-")}</div>
          <div class="launcher-port-table-cell">${escapeHtml(meta.label)}</div>
          <div class="launcher-port-table-cell">${escapeHtml(
            [meta.assignment, port.detail].filter(Boolean).join(" · "),
          )}</div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="launcher-port-table">
      <div class="launcher-port-table-row launcher-port-table-row--head">
        <div class="launcher-port-table-cell">Port</div>
        <div class="launcher-port-table-cell">Type</div>
        <div class="launcher-port-table-cell">Speed</div>
        <div class="launcher-port-table-cell">State</div>
        <div class="launcher-port-table-cell">Notes</div>
      </div>
      ${rows}
    </div>
  `;
}

function buildDeviceAdminPayload(source, feedId = "", draft = null, currentFeedId = "") {
  if (source === "feed") {
    const feed = getFeedById(feedId);
    if (!feed || feed.type !== "Napatech") return null;
    const detectedState = getDetectedNapatechState(feed.deviceLabel);
    const effectiveLayout = detectedState?.detectedLayout || feed.portProfile || "2x100G";
    const layoutMismatch =
      !!detectedState &&
      !!String(feed.portProfile || "").trim() &&
      feed.portProfile !== detectedState.detectedLayout;
    return {
      title: `${feed.deviceLabel || "Napatech Device"} Port Map`,
      subtitle: `${effectiveLayout} · ${feed.captureInput || "Input pending"}`,
      feedId: feed.id,
      deviceLabel: feed.deviceLabel,
      portProfile: effectiveLayout,
      captureInput: feed.captureInput || "",
      detected: !!detectedState,
      note: layoutMismatch
        ? `The feed was saved with ${feed.portProfile}, but the device currently exposes ${detectedState.detectedLayout}. Teleseer treats firmware-backed device state as the source of truth for port exposure and availability.`
        : "Port availability and enablement come from firmware-backed device state and sensor inventory. Teleseer does not author shared card layout from this workflow.",
      layoutSource: detectedState ? "Firmware-backed device state" : "Expected layout preview",
      deviceState:
        detectedState || {
          model: "Napatech Capture Device",
          firmwareVersion: "Awaiting device report",
          thumbnail: "../icons/integration/general/integration_colored_napatech.svg",
          physicalPortCount: 2,
          detectedLayout: effectiveLayout,
          ports: buildPreviewPortsForLayout(effectiveLayout),
        },
    };
  }

  if (source === "draft" && draft && draft.type === "Napatech") {
    const effectiveLayout = syncNapatechDraftPortProfile(draft);
    const detectedState = getDetectedNapatechState(draft.deviceLabel);
    return {
      title: `${draft.deviceLabel || "Napatech Draft"} Port Map`,
      subtitle: `${effectiveLayout || "2x100G"} · ${draft.captureInput || "Input not selected"}`,
      feedId: currentFeedId || "",
      deviceLabel: draft.deviceLabel || "",
      portProfile: effectiveLayout || "2x100G",
      captureInput: draft.captureInput || "",
      detected: !!detectedState,
      note: detectedState
        ? "Current device state is shown below. Firmware layout remains a device-admin concern, even when previewing it during feed creation."
        : "This draft does not have live device state yet. The preview below reflects the selected layout profile only; actual availability will come from firmware-backed device state once the device reports in.",
      layoutSource: detectedState ? "Current device state" : "Selected profile preview",
      deviceState:
        detectedState || {
          model: "Napatech Capture Device",
          firmwareVersion: "Device report pending",
          thumbnail: "../icons/integration/general/integration_colored_napatech.svg",
          physicalPortCount: 2,
          detectedLayout: effectiveLayout || "2x100G",
          ports: buildPreviewPortsForLayout(effectiveLayout || "2x100G"),
        },
    };
  }

  return null;
}

function buildDeviceAdminBodyMarkup(payload) {
  const assignedCount = payload.deviceState.ports.filter(
    (port) => getPortStateMeta(port, payload.feedId).tone === "assigned",
  ).length;
  const availableCount = payload.deviceState.ports.filter(
    (port) => getPortStateMeta(port, payload.feedId).tone === "available",
  ).length;
  const inUseCount = payload.deviceState.ports.filter(
    (port) => getPortStateMeta(port, payload.feedId).tone === "in-use",
  ).length;
  const virtualCount = payload.deviceState.ports.filter((port) => port.virtual).length;
  const selectedPort =
    payload.deviceState.ports.find(
      (port) => port.number === state.feedState.deviceAdmin.selectedPortNumber,
    ) || getDefaultSelectedPort(payload.deviceState, payload.feedId);
  const selectedMeta = selectedPort
    ? getPortStateMeta(selectedPort, payload.feedId)
    : null;

  return `
    <div class="launcher-device-note${
      payload.detected ? "" : " is-warning"
    }">${escapeHtml(payload.note)}</div>

    ${renderPortPreviewMarkup(payload.deviceState, payload.feedId, {
      interaction: "select",
      selectedPortNumber: selectedPort?.number || 0,
    })}

    <div class="launcher-device-stat-grid">
      <div class="launcher-device-stat">
        <label>Port Layout</label>
        <span>${escapeHtml(payload.deviceState.detectedLayout || payload.portProfile || "-")}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Firmware</label>
        <span>${escapeHtml(payload.deviceState.firmwareVersion || "Unknown")}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Physical Ports</label>
        <span>${escapeHtml(payload.deviceState.physicalPortCount || 0)}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Virtual Ports</label>
        <span>${escapeHtml(virtualCount)}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Assigned To This Feed</label>
        <span>${escapeHtml(assignedCount)}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Available Now</label>
        <span>${escapeHtml(availableCount)}</span>
      </div>
      <div class="launcher-device-stat">
        <label>In Use Elsewhere</label>
        <span>${escapeHtml(inUseCount)}</span>
      </div>
      <div class="launcher-device-stat">
        <label>Model</label>
        <span>${escapeHtml(payload.deviceState.model || "Napatech")}</span>
      </div>
    </div>

    ${renderPortLegendMarkup()}

    ${
      selectedPort && selectedMeta
        ? `
          <div class="launcher-device-selected-port">
            <div class="launcher-device-selected-port-head">
              <strong>Port ${escapeHtml(selectedPort.number)}</strong>
              <span>${escapeHtml(selectedPort.virtual ? "Virtual" : "Physical")} · ${escapeHtml(
                selectedPort.speed || "-",
              )}</span>
            </div>
            <div class="launcher-device-selected-port-copy">
              <span class="launcher-port-inline-indicator launcher-port-inline-indicator--${escapeHtml(
                selectedMeta.tone,
              )}"></span>
              <span>${escapeHtml(selectedMeta.label)}</span>
              <span>${escapeHtml(
                [selectedMeta.assignment, selectedPort.detail].filter(Boolean).join(" · "),
              )}</span>
            </div>
          </div>
        `
        : ""
    }

    ${renderDevicePortTableMarkup(payload.deviceState, payload.feedId)}
  `;
}

function renderFeedMetricCardMarkup(item) {
  const progressValue = Math.max(0, Math.min(100, Number(item.progress || 0)));
  const tagName = item.expandable ? "button" : "div";
  const className = [
    item.expandable ? "btn-reset" : "",
    "card",
    "launcher-feed-metric-card",
    item.health ? "is-health" : "",
    item.wide ? " is-wide" : "",
    item.healthMode === "risk" ? " is-risk" : "",
    item.expandable ? " is-expandable" : "",
    item.expanded ? " is-expanded" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const attrs = item.expandable
    ? `type="button" data-feed-metric-card="${escapeHtml(item.key)}" aria-expanded="${
        item.expanded ? "true" : "false"
      }"`
    : "";

  return `
    <${tagName}
      class="${className}"
      ${attrs}
      data-tooltip="${escapeHtml(item.tooltip || "")}"
    >
      ${
        item.health
          ? `
            <div class="launcher-feed-metric-health-copy">
              <strong class="${escapeHtml(item.valueClass || "")}">${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </div>
            <div
              class="launcher-health-meter launcher-health-meter--card is-${escapeHtml(
                item.healthTone || "healthy",
              )}${item.healthMode === "risk" ? " is-risk" : ""}"
              aria-hidden="true"
            >
              <span class="launcher-health-meter-fill" style="width:${progressValue}%"></span>
            </div>
          `
          : `
            <div class="launcher-feed-metric-copy">
              <strong class="${escapeHtml(item.valueClass || "")}">${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </div>
          `
      }
      <span class="launcher-feed-metric-trailing" aria-hidden="true">
        <span class="launcher-svg-icon ${escapeHtml(item.iconClass)} launcher-feed-metric-icon"></span>
        ${
          item.expandable
            ? `
              <span class="launcher-feed-metric-chevron">
                <span class="launcher-svg-icon launcher-icon-arrow-outline-down"></span>
              </span>
            `
            : ""
        }
      </span>
    </${tagName}>
  `;
}

function renderFeedMetricDetailRow(label, value, valueClass = "") {
  return `
    <div class="launcher-feed-metric-detail-row">
      <span class="launcher-feed-metric-detail-key">${escapeHtml(label)}</span>
      <span class="launcher-feed-metric-detail-value${valueClass ? ` ${escapeHtml(valueClass)}` : ""}">${escapeHtml(
        value,
      )}</span>
    </div>
  `;
}

function renderFeedMetricDetailMarkup(feed, metricKey) {
  if (!isFeedMetricExpandable(metricKey)) return "";

  const filesObservedHours = FEED_SUMMARY_WINDOW_HOURS;
  const volumeBytes = parseFeedSizeBytes(feed.volume24h);
  const throughputBytesPerSecond = volumeBytes / (filesObservedHours * 3600 || 1);
  const uptimeWindowMinutes = getFeedUptimeWindowMinutes(feed);
  const uptimePct = Math.max(0, Number(feed.uptimePct || 0));
  const uptimeMinutes = Math.round((uptimeWindowMinutes * uptimePct) / 100);
  const downtimeMinutes = Math.max(0, uptimeWindowMinutes - uptimeMinutes);
  const filesSummary = getFeedFilesSummary(feed);
  const statusScore = getFeedStatusHealthScore(feed);
  const freshnessScore = getFeedFreshnessHealthScore(feed);
  const fileQualityScore = getFeedFileQualityHealthScore(feed);
  const reliabilityScore = getFeedReliabilityHealthScore(feed);
  const uptimeContribution = computeFeedUptimePct(feed) * 0.4;

  let rows = "";
  if (metricKey === "data-size") {
    rows = [
      renderFeedMetricDetailRow("Observed window", `${filesObservedHours}h`),
      renderFeedMetricDetailRow("Volume written", feed.volume24h || "0 B"),
      renderFeedMetricDetailRow("Avg throughput", formatByteRate(throughputBytesPerSecond)),
      renderFeedMetricDetailRow("Configured retention", `${Math.max(0, Number(feed.retentionDays || 0))} days`),
    ].join("");
  } else if (metricKey === "uptime") {
    rows = [
      renderFeedMetricDetailRow("Observed window", formatDurationCompact(uptimeWindowMinutes)),
      renderFeedMetricDetailRow("Total uptime", formatDurationCompact(uptimeMinutes)),
      renderFeedMetricDetailRow("Total downtime", formatDurationCompact(downtimeMinutes)),
      renderFeedMetricDetailRow(
        "Current state",
        [String(feed.status?.label || toLabelCase(feed.status?.tone || "Unknown")), String(feed.status?.extra || "")]
          .filter(Boolean)
          .join(" · "),
      ),
    ].join("");
  } else if (metricKey === "health") {
    rows = [
      renderFeedMetricDetailRow(
        "Uptime contribution",
        `${formatMetricNumber(uptimeContribution, { maximumFractionDigits: 1 })} pts`,
      ),
      renderFeedMetricDetailRow(
        "Status",
        `${toLabelCase(feed.status?.tone || "Unknown")} · ${formatMetricNumber(statusScore, {
          maximumFractionDigits: 0,
        })} pts`,
      ),
      renderFeedMetricDetailRow(
        "Freshness",
        `${feed.lastActivity || "Never"} · ${formatMetricNumber(freshnessScore, {
          maximumFractionDigits: 0,
        })} pts`,
      ),
      renderFeedMetricDetailRow(
        "File quality",
        `${filesSummary.errors}E · ${filesSummary.warnings}W · ${formatMetricNumber(fileQualityScore, {
          maximumFractionDigits: 1,
        })} pts`,
      ),
      renderFeedMetricDetailRow(
        "Reliability",
        `${formatMetricNumber(Number(feed.errorsPerDay || 0), {
          maximumFractionDigits: 1,
        })} errors/day · ${formatMetricNumber(reliabilityScore, {
          maximumFractionDigits: 1,
        })} pts`,
      ),
    ].join("");
  }

  if (!rows) return "";

  return `
    <div class="launcher-feed-metric-detail-panel">
      ${rows}
    </div>
  `;
}

function renderFeedMetricRowGroup(feed, items) {
  const expandedMetricKey = getFeedExpandedMetricKey(feed.id);
  const rowHasExpandedMetric = items.some((item) => item.key === expandedMetricKey);
  return `
    <div class="launcher-feed-metric-row-group">
      <div class="launcher-feed-metric-row${items.length === 2 ? " is-two-up" : items.length === 1 ? " is-single" : ""}">
        ${items.map((item) => renderFeedMetricCardMarkup(item)).join("")}
      </div>
      ${rowHasExpandedMetric ? renderFeedMetricDetailMarkup(feed, expandedMetricKey) : ""}
    </div>
  `;
}

function renderFeedDrawerSummarySection(feed) {
  const captureContext = getFeedDrawerCaptureContext(
    feed,
    isFeedDrawerInEditMode(),
    getFeedDrawerDraft(feed),
  );
  return renderFeedSummaryMarkup(feed, captureContext.summaryPortPreview);
}

function clearFeedMetricDetailInlineStyles(panelEl) {
  if (!panelEl) return;
  panelEl.style.removeProperty("overflow");
  panelEl.style.removeProperty("max-height");
  panelEl.style.removeProperty("opacity");
  panelEl.style.removeProperty("transform");
  panelEl.style.removeProperty("margin-top");
  panelEl.style.removeProperty("padding-top");
  panelEl.style.removeProperty("padding-bottom");
  panelEl.style.removeProperty("transition");
  panelEl.style.removeProperty("pointer-events");
}

function animateFeedMetricDetailOpen(panelEl) {
  if (!panelEl) return;
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    clearFeedMetricDetailInlineStyles(panelEl);
    return;
  }
  clearFeedMetricDetailInlineStyles(panelEl);
  const computed = window.getComputedStyle(panelEl);
  const targetMarginTop = computed.marginTop;
  const targetPaddingTop = computed.paddingTop;
  const targetPaddingBottom = computed.paddingBottom;
  const targetHeight = panelEl.scrollHeight;
  panelEl.style.overflow = "hidden";
  panelEl.style.maxHeight = "0px";
  panelEl.style.opacity = "0";
  panelEl.style.transform = "translateY(-4px)";
  panelEl.style.marginTop = "0px";
  panelEl.style.paddingTop = "0px";
  panelEl.style.paddingBottom = "0px";
  panelEl.style.pointerEvents = "none";
  panelEl.getBoundingClientRect();
  panelEl.style.transition =
    "max-height var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), opacity var(--motion-fade-duration, 180ms) ease, transform var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), margin-top var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), padding-top var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), padding-bottom var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1))";
  panelEl.style.maxHeight = `${targetHeight}px`;
  panelEl.style.opacity = "1";
  panelEl.style.transform = "translateY(0)";
  panelEl.style.marginTop = targetMarginTop;
  panelEl.style.paddingTop = targetPaddingTop;
  panelEl.style.paddingBottom = targetPaddingBottom;
  const handleEnd = (event) => {
    if (event.target !== panelEl || event.propertyName !== "max-height") return;
    panelEl.removeEventListener("transitionend", handleEnd);
    clearFeedMetricDetailInlineStyles(panelEl);
  };
  panelEl.addEventListener("transitionend", handleEnd);
}

function animateFeedMetricDetailClose(panelEl, onDone) {
  if (!panelEl) {
    onDone?.();
    return;
  }
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    clearFeedMetricDetailInlineStyles(panelEl);
    onDone?.();
    return;
  }
  clearFeedMetricDetailInlineStyles(panelEl);
  const computed = window.getComputedStyle(panelEl);
  panelEl.style.overflow = "hidden";
  panelEl.style.maxHeight = `${panelEl.scrollHeight}px`;
  panelEl.style.opacity = "1";
  panelEl.style.transform = "translateY(0)";
  panelEl.style.marginTop = computed.marginTop;
  panelEl.style.paddingTop = computed.paddingTop;
  panelEl.style.paddingBottom = computed.paddingBottom;
  panelEl.style.pointerEvents = "none";
  panelEl.getBoundingClientRect();
  panelEl.style.transition =
    "max-height var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), opacity var(--motion-fade-duration, 180ms) ease, transform var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), margin-top var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), padding-top var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), padding-bottom var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1))";
  panelEl.style.maxHeight = "0px";
  panelEl.style.opacity = "0";
  panelEl.style.transform = "translateY(-4px)";
  panelEl.style.marginTop = "0px";
  panelEl.style.paddingTop = "0px";
  panelEl.style.paddingBottom = "0px";
  const handleEnd = (event) => {
    if (event.target !== panelEl || event.propertyName !== "max-height") return;
    panelEl.removeEventListener("transitionend", handleEnd);
    clearFeedMetricDetailInlineStyles(panelEl);
    onDone?.();
  };
  panelEl.addEventListener("transitionend", handleEnd);
}

function syncFeedDrawerSummarySection(feed, previousExpandedMetricKey = "") {
  const currentBlock = feedDrawerBodyEl.querySelector(".launcher-feed-summary-block");
  if (!currentBlock) {
    renderFeedDrawer();
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = renderFeedDrawerSummarySection(feed).trim();
  const nextBlock = template.content.firstElementChild;
  if (!nextBlock) {
    renderFeedDrawer();
    return;
  }

  const nextExpandedMetricKey = getFeedExpandedMetricKey(feed.id);
  const currentPanel = currentBlock.querySelector(".launcher-feed-metric-detail-panel");
  const replaceBlock = () => {
    currentBlock.replaceWith(nextBlock);
    const nextPanel = nextBlock.querySelector(".launcher-feed-metric-detail-panel");
    if (nextPanel && nextExpandedMetricKey) {
      animateFeedMetricDetailOpen(nextPanel);
    }
  };

  if (currentPanel && previousExpandedMetricKey && !nextExpandedMetricKey) {
    animateFeedMetricDetailClose(currentPanel, replaceBlock);
    return;
  }

  replaceBlock();
}

function renderFeedMiniStatusBadge(status) {
  const label = String(status?.label || FEED_STATUS_LABELS[status?.tone] || toLabelCase(status?.tone || "Unknown"));
  const badgeClass = getStatusBadgeClass(status?.tone || label);
  return `
    <span class="status-badge ${badgeClass} launcher-feed-mini-status-badge">
      <span class="status-badge-icon" aria-hidden="true"></span>
      <span class="status-badge-label">${escapeHtml(label)}</span>
    </span>
  `;
}

function renderFeedSubscriptionBadge(subscribed) {
  return `
    <span class="launcher-feed-subscription-badge${subscribed ? " is-subscribed" : ""}">
      <span class="launcher-feed-subscription-dot" aria-hidden="true"></span>
      <span>${subscribed ? "Subscribed" : "Unsubscribed"}</span>
    </span>
  `;
}

function renderFeedMultiProjectPill(projectCount) {
  return `
    <span class="launcher-feed-project-pill">
      ${escapeHtml(`${projectCount} ${projectCount === 1 ? "Project" : "Projects"}`)}
    </span>
  `;
}

function renderFeedProjectPill(projectNames) {
  const names = (Array.isArray(projectNames) ? projectNames : [])
    .map((name) => String(name || "").trim())
    .filter(Boolean);
  if (!names.length) return "-";

  const tooltip = names.join(" · ");
  const label =
    names.length === 1
      ? names[0]
      : `${names.length} ${names.length === 1 ? "Project" : "Projects"}`;

  return `
    <span
      class="launcher-feed-project-pill"
      data-tooltip="${escapeHtml(tooltip)}"
    >
      ${escapeHtml(label)}
    </span>
  `;
}

function renderFeedMiniCardRow(label, valueMarkup) {
  return `
    <div class="launcher-feed-mini-card-row">
      <span class="launcher-feed-mini-card-label">${escapeHtml(label)}</span>
      <span class="launcher-feed-mini-card-value">${valueMarkup}</span>
    </div>
  `;
}

function normalizeProjectName(value) {
  return String(value || "").trim().toLowerCase();
}

function getFeedProjectTableRows(feed) {
  const subscribedProjectsByName = new Map(
    (Array.isArray(feed.subscribedProjects) ? feed.subscribedProjects : []).map((project) => [
      normalizeProjectName(project.name),
      project,
    ]),
  );
  const catalog = [];
  const seenNames = new Set();

  SECTION_CONTENT.projects.rows.forEach((project) => {
    const key = normalizeProjectName(project.name);
    if (!key || seenNames.has(key)) return;
    seenNames.add(key);
    catalog.push({
      name: project.name,
      lastUpdated: project.created || feed.lastActivity || "-",
      subscribed: subscribedProjectsByName.has(key),
    });
  });

  WORKSPACE_PROJECT_NAMES.forEach((projectName) => {
    const key = normalizeProjectName(projectName);
    if (!key || seenNames.has(key)) return;
    seenNames.add(key);
    const subscription = subscribedProjectsByName.get(key);
    catalog.push({
      name: projectName,
      lastUpdated: subscription ? feed.lastActivity || "Just now" : "-",
      subscribed: !!subscription,
    });
  });

  return catalog.sort((left, right) => {
    if (left.subscribed !== right.subscribed) {
      return Number(right.subscribed) - Number(left.subscribed);
    }
    return left.name.localeCompare(right.name);
  });
}

function getSuricataRuleCategory(rule) {
  if (String(rule.category || "").trim()) return String(rule.category).trim().toUpperCase();
  if (/^ET\b/i.test(rule.name || "")) return "ET EXPLOIT";
  if (/^SURICATA\b/i.test(rule.name || "")) return "SURICATA";
  return "CUSTOM";
}

function getFeedDrawerTableStore(tableKey) {
  if (tableKey === "projects") return state.feedState.drawerProjectsPaginationByFeedId;
  if (tableKey === "suricata") return state.feedState.drawerSuricataPaginationByFeedId;
  return null;
}

function getFeedDrawerTablePagination(tableKey, feedId, totalItems) {
  const store = getFeedDrawerTableStore(tableKey);
  const pageSize = 5;
  if (!store) {
    return { page: 1, pageSize, totalPages: 1 };
  }
  const stored = store[feedId] || { page: 1 };
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / pageSize));
  const next = {
    page: Math.min(Math.max(1, stored.page || 1), totalPages),
    pageSize,
    totalPages,
  };
  store[feedId] = next;
  return next;
}

function renderFeedTableFooter(feedId, tableKey, pager, totalItems) {
  const displayStart = totalItems ? (pager.page - 1) * pager.pageSize + 1 : 0;
  const displayEnd = totalItems ? Math.min(totalItems, pager.page * pager.pageSize) : 0;
  return `
    <div class="launcher-feed-table-pagination">
      <div class="launcher-feed-table-pagination-range">
        <strong>${displayStart}-${displayEnd}</strong> of ${totalItems}
      </div>
      <div class="launcher-feed-table-pagination-actions">
        <button class="btn-reset launcher-feed-table-page-size" type="button" aria-label="Rows per page">
          <span>5 per page</span>
          <span class="launcher-svg-icon launcher-icon-arrow-outline-down" aria-hidden="true"></span>
        </button>
        <div class="launcher-feed-table-pagination-nav" role="group" aria-label="${escapeHtml(tableKey)} pagination">
          <button
            class="btn-reset launcher-feed-table-pagination-button"
            type="button"
            data-feed-drawer-table-page="prev"
            data-feed-drawer-table-key="${escapeHtml(tableKey)}"
            data-feed-drawer-table-feed="${escapeHtml(feedId)}"
            ${pager.page <= 1 ? "disabled" : ""}
            aria-label="Previous page"
          >
            <span class="launcher-svg-icon launcher-icon-arrow-left" aria-hidden="true"></span>
          </button>
          <span class="launcher-feed-table-pagination-divider" aria-hidden="true"></span>
          <button
            class="btn-reset launcher-feed-table-pagination-button"
            type="button"
            data-feed-drawer-table-page="next"
            data-feed-drawer-table-key="${escapeHtml(tableKey)}"
            data-feed-drawer-table-feed="${escapeHtml(feedId)}"
            ${pager.page >= pager.totalPages ? "disabled" : ""}
            aria-label="Next page"
          >
            <span class="launcher-svg-icon launcher-icon-arrow-right" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFeedTablePlaceholderRows(variant, columnCount, count) {
  return Array.from({ length: Math.max(0, Number(count || 0)) }, () => {
    const cells = Array.from({ length: columnCount }, () =>
      '<div class="launcher-feed-table-cell">&nbsp;</div>',
    ).join("");
    return `
      <div class="launcher-feed-table-row launcher-feed-table-row--${escapeHtml(
        variant,
      )} launcher-feed-table-row--placeholder" aria-hidden="true">
        ${cells}
      </div>
    `;
  }).join("");
}

function renderFeedProjectsTableMarkup(feed) {
  const rows = getFeedProjectTableRows(feed);
  const pager = getFeedDrawerTablePagination("projects", feed.id, rows.length);
  const startIndex = (pager.page - 1) * pager.pageSize;
  const visibleRows = rows.slice(startIndex, startIndex + pager.pageSize);
  const placeholderCount = rows.length ? Math.max(0, pager.pageSize - visibleRows.length) : 0;
  const bodyMarkup = visibleRows.length
    ? visibleRows
        .map(
          (project) => `
            <div class="launcher-feed-table-row launcher-feed-table-row--projects">
              <div class="launcher-feed-table-cell launcher-feed-table-cell-name">${escapeHtml(project.name)}</div>
              <div class="launcher-feed-table-cell launcher-feed-table-cell-updated">
                <button class="btn-reset launcher-feed-table-link" type="button">${escapeHtml(project.lastUpdated)}</button>
              </div>
              <div class="launcher-feed-table-cell launcher-feed-table-cell-status">
                ${renderFeedSubscriptionBadge(project.subscribed)}
              </div>
            </div>
          `,
        )
        .join("") + renderFeedTablePlaceholderRows("projects", 3, placeholderCount)
    : `<div class="launcher-feed-empty-state">No projects are available in this workspace.</div>`;

  return `
    <div class="launcher-feed-table-shell launcher-feed-table-shell--projects">
      <div class="launcher-feed-table-head launcher-feed-table-head--projects">
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-name">Name</div>
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-updated">Last Updated</div>
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-status">Status</div>
      </div>
      <div class="launcher-feed-table-body">${bodyMarkup}</div>
      ${renderFeedTableFooter(feed.id, "projects", pager, rows.length)}
    </div>
  `;
}

function renderFeedSuricataRulesTableMarkup(feed) {
  const rows = Array.isArray(feed.suricataRules) ? feed.suricataRules : [];
  const pager = getFeedDrawerTablePagination("suricata", feed.id, rows.length);
  const startIndex = (pager.page - 1) * pager.pageSize;
  const visibleRows = rows.slice(startIndex, startIndex + pager.pageSize);
  const placeholderCount = rows.length ? Math.max(0, pager.pageSize - visibleRows.length) : 0;
  const bodyMarkup = visibleRows.length
    ? visibleRows
        .map(
          (rule) => `
            <div class="launcher-feed-table-row launcher-feed-table-row--suricata">
              <div class="launcher-feed-table-cell launcher-feed-table-cell-name">${escapeHtml(rule.name)}</div>
              <div class="launcher-feed-table-cell">${escapeHtml(getSuricataRuleCategory(rule))}</div>
              <div class="launcher-feed-table-cell launcher-feed-table-cell-project">
                ${renderFeedProjectPill(rule.projects)}
              </div>
            </div>
          `,
        )
        .join("") + renderFeedTablePlaceholderRows("suricata", 3, placeholderCount)
    : `<div class="launcher-feed-empty-state">No Suricata rules are currently mapped to this feed.</div>`;

  return `
    <div class="launcher-feed-table-shell launcher-feed-table-shell--suricata">
      <div class="launcher-feed-table-head launcher-feed-table-head--suricata">
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-name">Name</div>
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-category">Category</div>
        <div class="launcher-feed-table-head-cell launcher-feed-table-head-cell-project">Project</div>
      </div>
      <div class="launcher-feed-table-body">${bodyMarkup}</div>
      ${renderFeedTableFooter(feed.id, "suricata", pager, rows.length)}
    </div>
  `;
}

function buildFeedSummaryMetricItems(feed) {
  const filesObservedHours = FEED_SUMMARY_WINDOW_HOURS;
  const filesObservedLabel = `${filesObservedHours}h`;
  const totalFiles = Math.max(0, Number(feed.files24h || feed.fileCount || 0));
  const errorCount = Math.max(0, Number(feed.fileErrorCount || 0));
  const warningCount = Math.max(0, Number(feed.fileWarningCount || 0));
  const volumeBytes = parseFeedSizeBytes(feed.volume24h);
  const throughputBytesPerSecond = volumeBytes / (filesObservedHours * 3600 || 1);
  const uptimeWindowMinutes = getFeedUptimeWindowMinutes(feed);
  const uptimePct = Math.max(0, Number(feed.uptimePct || 0));
  const uptimeMinutes = Math.round((uptimeWindowMinutes * uptimePct) / 100);
  const downtimeMinutes = Math.max(0, uptimeWindowMinutes - uptimeMinutes);
  const healthScore = Math.max(0, Number(feed.healthScore || 0));
  const healthTone = healthScore >= 90 ? "healthy" : healthScore >= 70 ? "degraded" : "critical";
  const expandedMetricKey = getFeedExpandedMetricKey(feed.id);

  return [
    {
      key: "files",
      iconClass: "launcher-icon-file",
      value: formatMetricNumber(totalFiles, { maximumFractionDigits: 0 }),
      label: "Files",
      tooltip: `Observed over the last ${filesObservedLabel}. Total rolled capture files in this window.`,
    },
    {
      key: "errors",
      iconClass: "launcher-icon-error-fill",
      valueClass: "is-error",
      value: formatMetricNumber(errorCount, { maximumFractionDigits: 0 }),
      label: "Errors",
      tooltip: `Observed over the last ${filesObservedLabel}. Failed or unusable capture outputs in this window.`,
    },
    {
      key: "warnings",
      iconClass: "launcher-icon-warning-fill",
      valueClass: "is-warning",
      value: formatMetricNumber(warningCount, { maximumFractionDigits: 0 }),
      label: "Warnings",
      tooltip: `Observed over the last ${filesObservedLabel}. Degraded but still usable capture outputs in this window.`,
    },
    {
      key: "data-size",
      iconClass: "launcher-icon-bytes",
      expandable: true,
      expanded: expandedMetricKey === "data-size",
      value: feed.volume24h || "0 B",
      label: "Data Size",
      tooltip: `Observed over the last ${filesObservedLabel}. Total capture volume written in this window. Click to inspect throughput and retention context.`,
    },
    {
      key: "uptime",
      iconClass: "launcher-icon-duration",
      wide: true,
      expandable: true,
      expanded: expandedMetricKey === "uptime",
      value: formatMetricPercent(uptimePct, 2),
      label: "Up-time",
      tooltip: `Observed over ${formatDurationCompact(uptimeWindowMinutes)}. ${formatMetricPercent(uptimePct, 2)} means the feed was up for ${formatDurationCompact(uptimeMinutes)} and down for ${formatDurationCompact(downtimeMinutes)} in that window. Click to inspect the uptime breakdown.`,
    },
    {
      key: "health",
      iconClass: "launcher-icon-heart",
      wide: true,
      health: true,
      expandable: true,
      expanded: expandedMetricKey === "health",
      value: formatMetricPercent(healthScore, 0),
      label: "Health",
      progress: healthScore,
      healthMode: "health",
      healthTone,
      tooltip: `Health is a composite of status, freshness, file quality, and reliability. Click to inspect the score breakdown.`,
    },
  ];
}

function getFeedDrawerCaptureContext(feed, captureEdit, drawerDraft) {
  const currentPortLayout =
    feed.type === "Napatech"
      ? getDetectedNapatechLayout(
          captureEdit ? drawerDraft.deviceLabel : feed.deviceLabel,
          captureEdit ? drawerDraft.portProfile : feed.portProfile,
        ) || (captureEdit ? drawerDraft.portProfile : feed.portProfile) || "-"
      : "";
  const drawerDevicePayload =
    feed.type === "Napatech"
      ? captureEdit
        ? buildDeviceAdminPayload("draft", "", drawerDraft, feed.id)
        : buildDeviceAdminPayload("feed", feed.id)
      : null;
  const selectedDrawerPort =
    drawerDevicePayload?.deviceState?.ports.find(
      (port) =>
        port.number ===
        getFeedDrawerSelectedPortNumber(feed.id, drawerDevicePayload.deviceState, feed.id, {
          editMode: captureEdit,
        }),
    ) || getDefaultSelectedPort(drawerDevicePayload?.deviceState || null, feed.id);
  const selectedDrawerPortMeta = selectedDrawerPort
    ? getPortStateMeta(selectedDrawerPort, feed.id)
    : null;
  const selectedCaptureInput =
    selectedDrawerPort && canFeedDrawerPortDriveCaptureInput(selectedDrawerPortMeta, captureEdit)
      ? getNapatechTapLabel(selectedDrawerPort.number)
      : feed.captureInput || "-";
  const summaryPortPreview =
    drawerDevicePayload?.deviceState
      ? `
        ${renderPortPreviewMarkup(drawerDevicePayload.deviceState, feed.id, {
          interaction: "feed-select",
          selectedPortNumber: selectedDrawerPort?.number || 0,
          editMode: captureEdit,
        })}
      `
      : "";
  const captureSettingsFootnote =
    feed.type === "Napatech"
      ? `
        <div class="launcher-device-note launcher-feed-capture-note">
          <p>Napatech firmware and card layout are shared device settings. They stay outside feed editing so one feed cannot silently change a shared capture card.</p>
          <button
            class="btn-reset btn-secondary size-s style-outline"
            type="button"
            data-feed-action="device-admin"
          >
            Open Device Admin
          </button>
        </div>
      `
      : "";

  return {
    currentPortLayout,
    selectedCaptureInput,
    summaryPortPreview,
    captureSettingsFootnote,
  };
}

function renderFeedSummaryMarkup(feed, leadMarkup = "") {
  const metricItems = buildFeedSummaryMetricItems(feed);

  return `
    <section class="launcher-feed-summary-block">
      ${leadMarkup}
      <div class="launcher-feed-metric-grid">
        ${renderFeedMetricRowGroup(feed, metricItems.slice(0, 3))}
        ${renderFeedMetricRowGroup(feed, metricItems.slice(3, 5))}
        ${renderFeedMetricRowGroup(feed, metricItems.slice(5))}
      </div>
      <div class="launcher-feed-mini-card-grid">
        <div class="card launcher-feed-mini-card">
          ${renderFeedMiniCardRow("Duration", renderStaticField(`${feed.closeAndProcessSeconds || 0}s`))}
          <div class="launcher-feed-mini-card-divider" aria-hidden="true"></div>
          ${renderFeedMiniCardRow("Last Updated", renderStaticField(feed.lastActivity || "-"))}
        </div>
        <div class="card launcher-feed-mini-card">
          ${renderFeedMiniCardRow("Status", renderFeedMiniStatusBadge(feed.status))}
          <div class="launcher-feed-mini-card-divider" aria-hidden="true"></div>
          ${renderFeedMiniCardRow(
            "Errors per day",
            renderStaticField(
              Number.isFinite(Number(feed.errorsPerDay)) ? Number(feed.errorsPerDay).toFixed(1).replace(/\.0$/, "") : "-",
            ),
          )}
        </div>
      </div>
    </section>
  `;
}

function getActivityLevel(entry) {
  const message = String(entry.message || "").toLowerCase();
  if (entry.type === "error" || /error|failed|timeout|drop|degraded|retry/.test(message)) {
    return "ERROR";
  }
  if (/warn|warning|behind|stale/.test(message)) {
    return "WARN";
  }
  return "INFO";
}

function getConsoleTimeLabel(value) {
  const text = String(value || "");
  if (!text) return "--:--:--";
  const split = text.split(" ");
  return split[split.length - 1] || text;
}

function getFeedConsoleLogEntries(feed) {
  const logFilter = state.feedState.drawerLogFilter;
  const visibleActivityEntries = (Array.isArray(feed.activityLog) ? feed.activityLog : []).filter(
    (entry) => logFilter === "all" || entry.type === logFilter,
  );
  const activityEntries = visibleActivityEntries.map((entry) => ({
    timestamp: getConsoleTimeLabel(entry.timestamp),
    level: getActivityLevel(entry),
    message: entry.message,
  }));

  const fileEntries = (Array.isArray(feed.producedFiles) ? feed.producedFiles : [])
    .filter((file) => {
      if (logFilter === "all") return true;
      if (logFilter === "error") return file.tone === "error" || file.tone === "warning";
      if (logFilter === "ingest") return true;
      return false;
    })
    .slice(0, 6)
    .map((file) => ({
      timestamp: getConsoleTimeLabel(file.created),
      level: file.tone === "error" ? "ERROR" : file.tone === "warning" ? "WARN" : "INFO",
      message: `${file.name} · ${file.note || "capture file ready"}`,
    }));

  const statusEntry =
    logFilter === "all" || logFilter === "config"
      ? {
      timestamp: getConsoleTimeLabel(feed.lastActivity),
      level: feed.status?.tone === "error" ? "ERROR" : feed.status?.tone === "paused" ? "WARN" : "INFO",
      message: `${feed.name} is ${String(feed.status?.label || feed.status?.tone || "active").toLowerCase()}${feed.status?.extra ? ` · ${feed.status.extra}` : ""}`,
        }
      : null;

  return [statusEntry, ...activityEntries, ...fileEntries].filter(Boolean).slice(0, 12);
}

function renderFeedConsoleMarkup(feed) {
  const rows = getFeedConsoleLogEntries(feed);
  return `
    <div class="launcher-feed-console-shell">
      <div class="launcher-feed-console-toolbar">
        <button class="btn-reset btn-secondary size-s style-outline" type="button" data-feed-action="copy-log">Copy</button>
      </div>
      <div class="launcher-feed-console">
        ${rows
          .map(
            (row) => `
              <div class="launcher-feed-console-row launcher-feed-console-row--${escapeHtml(
                row.level.toLowerCase(),
              )}">
                <span class="launcher-feed-console-time">${escapeHtml(row.timestamp)}</span>
                <span class="launcher-feed-console-level launcher-feed-console-level--${escapeHtml(
                  row.level.toLowerCase(),
                )}">${escapeHtml(row.level)}</span>
                <span class="launcher-feed-console-message launcher-feed-console-message--${escapeHtml(
                  row.level.toLowerCase(),
                )}">${escapeHtml(row.message)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderCardAccordionHeader(title, chevronMarkup, controlsMarkup = "") {
  const tail = controlsMarkup
    ? `
        <span class="card-header-tail">
          <span class="card-header-controls">${controlsMarkup}</span>
          ${chevronMarkup}
        </span>
      `
    : chevronMarkup;
  return `
    <summary class="card-accordion-header card-header suri-card-header">
      <span class="card-title suri-card-title">${escapeHtml(title)}</span>
      ${tail}
    </summary>
  `;
}

function clearFeedDrawerAccordionInlineStyles(bodyEl) {
  if (!bodyEl) return;
  bodyEl.style.removeProperty("display");
  bodyEl.style.removeProperty("overflow");
  bodyEl.style.removeProperty("max-height");
  bodyEl.style.removeProperty("opacity");
  bodyEl.style.removeProperty("transition");
  bodyEl.style.removeProperty("pointer-events");
}

function getFeedDrawerAccordionBodyHeight(bodyEl) {
  if (!bodyEl) return 0;
  const firstChild = bodyEl.firstElementChild;
  const measuredChildHeight = firstChild
    ? Math.ceil(firstChild.getBoundingClientRect().height || firstChild.scrollHeight || 0)
    : 0;
  return Math.max(
    Math.ceil(bodyEl.scrollHeight || 0),
    Math.ceil(bodyEl.offsetHeight || 0),
    measuredChildHeight,
  );
}

function animateFeedDrawerAccordion(cardEl, expand) {
  const bodyEl = cardEl?.querySelector(".suri-card-body");
  if (!cardEl || !bodyEl) {
    if (cardEl) cardEl.open = !!expand;
    return;
  }

  if (typeof bodyEl._accordionCleanup === "function") {
    bodyEl._accordionCleanup();
  }

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    cardEl.open = !!expand;
    clearFeedDrawerAccordionInlineStyles(bodyEl);
    bodyEl._accordionCleanup = null;
    return;
  }

  const transitionValue =
    "max-height var(--motion-accordion-duration, 280ms) var(--motion-accordion-ease, cubic-bezier(0.22, 0.74, 0.18, 1)), opacity var(--motion-fade-duration, 180ms) ease";
  const transitionMs = 340;

  let finished = false;
  let fallbackTimer = 0;
  let frameId = 0;
  const finalize = () => {
    if (finished) return;
    finished = true;
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = 0;
    }
    if (!expand) {
      cardEl.open = false;
    }
    clearFeedDrawerAccordionInlineStyles(bodyEl);
    bodyEl._accordionCleanup = null;
  };

  if (expand) {
    cardEl.open = true;
    clearFeedDrawerAccordionInlineStyles(bodyEl);
    bodyEl.style.display = "flex";
    bodyEl.style.overflow = "hidden";
    bodyEl.style.maxHeight = "0px";
    bodyEl.style.opacity = "0";
    bodyEl.style.pointerEvents = "none";
    bodyEl.getBoundingClientRect();
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      const targetHeight = getFeedDrawerAccordionBodyHeight(bodyEl);
      if (targetHeight <= 0) {
        finalize();
        return;
      }
      bodyEl.style.transition = transitionValue;
      bodyEl.style.maxHeight = `${targetHeight}px`;
      bodyEl.style.opacity = "1";
    });
  } else {
    bodyEl.style.display = "flex";
    bodyEl.style.overflow = "hidden";
    const startHeight = getFeedDrawerAccordionBodyHeight(bodyEl);
    bodyEl.style.maxHeight = `${startHeight}px`;
    bodyEl.style.opacity = "1";
    bodyEl.style.pointerEvents = "none";
    bodyEl.getBoundingClientRect();
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      bodyEl.style.transition = transitionValue;
      bodyEl.style.maxHeight = "0px";
      bodyEl.style.opacity = "0";
    });
  }

  const handleTransitionEnd = (event) => {
    if (event.target !== bodyEl || event.propertyName !== "max-height") return;
    bodyEl.removeEventListener("transitionend", handleTransitionEnd);
    finalize();
  };

  bodyEl.addEventListener("transitionend", handleTransitionEnd);
  fallbackTimer = window.setTimeout(finalize, transitionMs);
  bodyEl._accordionCleanup = () => {
    bodyEl.removeEventListener("transitionend", handleTransitionEnd);
    finalize();
  };
}

function renderSuriRow(label, valueMarkup, options = {}) {
  const extraClass = options.stack ? " is-stack" : "";
  return `
    <div class="card-row suri-row${extraClass}">
      <div class="card-label suri-row-label">${escapeHtml(label)}</div>
      <div class="card-value suri-row-value">${valueMarkup}</div>
    </div>
  `;
}

function buildFeedDrawerMarkup(feed) {
  ensureFeedShape(feed);
  updateNoSubscriptionWarning(feed);

  const drawerDraft = getFeedDrawerDraft(feed);
  const captureEdit = isFeedDrawerInEditMode();
  const filterEdit = isFeedDrawerInEditMode();

  const duplicateWarning = findDuplicateFeedSource(feed.source, feed.id);
  const staleWarning = isFeedStale(feed);
  const captureContext = getFeedDrawerCaptureContext(feed, captureEdit, drawerDraft);

  const suriChevron =
    '<span class="card-header-chevron"><span class="launcher-svg-icon launcher-icon-arrow-outline-down card-header-chevron-icon suri-card-chevron-icon" aria-hidden="true"></span></span>';
  const renderDrawerCard = (cardKey, title, bodyMarkup, controlsMarkup = "") => `
    <details class="card-accordion suri-card" data-feed-drawer-card="${escapeHtml(cardKey)}"${isFeedDrawerCardOpen(feed.id, cardKey) ? " open" : ""}>
      ${renderCardAccordionHeader(title, suriChevron, controlsMarkup)}
      <div class="card-body suri-card-body">${bodyMarkup}</div>
    </details>
  `;

  const summaryWarnings = [
    duplicateWarning
      ? `<div class="launcher-feed-error-box">Source already used by ${escapeHtml(
          duplicateWarning.name,
        )}.</div>`
      : "",
    staleWarning
      ? `<div class="launcher-feed-error-box">Feed is active but hasn't produced a file in longer than expected (threshold: ${escapeHtml(
          `${feed.expectedIdleMinutes}m`,
        )}).</div>`
      : "",
    feed.status?.tone === "error"
      ? `<div class="launcher-feed-error-box">
          <div>${escapeHtml(feed.errorDetails || "Feed is currently in an error state.")}</div>
          <button class="btn-reset btn-secondary size-s style-ghost" type="button" data-feed-action="retry">Retry Now</button>
        </div>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const captureRows = [
    renderSuriRow(
      "Capture Device",
      captureEdit
        ? renderFeedDrawerMenuControl({
            field: "deviceLabel",
            value: drawerDraft.deviceLabel,
            summary: drawerDraft.deviceLabel || "Select device",
            menuOptions: getFeedDrawerDeviceOptions(feed.type, drawerDraft.deviceLabel),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.deviceLabel || "-"),
    ),
    renderSuriRow(
      "Capture Input",
      captureEdit
        ? `<input class="launcher-drawer-input" type="text" value="${escapeHtml(
            drawerDraft.captureInput,
          )}" data-feed-drawer-draft="captureInput" />`
        : renderStaticField(captureContext.selectedCaptureInput),
    ),
    ...(feed.type === "Napatech"
      ? [
          renderSuriRow(
            "Port Layout",
            renderStaticField(captureContext.currentPortLayout),
          ),
        ]
      : []),
    renderSuriRow(
      "Output Folder",
      captureEdit
        ? `
          <div class="launcher-drawer-inline-field">
            <input class="launcher-drawer-input" type="text" value="${escapeHtml(
              drawerDraft.outputPath,
            )}" data-feed-drawer-draft="outputPath" />
            <button
              class="btn-reset btn-secondary size-m style-default"
              type="button"
              data-feed-action="browse-output"
            >
              Browse
            </button>
          </div>
        `
        : renderStaticField(feed.outputPath || "-"),
    ),
    renderSuriRow(
      "Chunk Size",
      captureEdit
        ? `<input class="launcher-drawer-input" type="number" min="1" value="${escapeHtml(
            drawerDraft.chunkSizeMb,
          )}" data-feed-drawer-draft="chunkSizeMb" />`
        : renderStaticField(String(feed.chunkSizeMb || 0)),
    ),
    renderSuriRow(
      "Close & Process",
      captureEdit
        ? `<input class="launcher-drawer-input" type="number" min="1" value="${escapeHtml(
            drawerDraft.closeAndProcessSeconds,
          )}" data-feed-drawer-draft="closeAndProcessSeconds" />`
        : renderStaticField(String(feed.closeAndProcessSeconds || 0)),
    ),
    renderSuriRow(
      "Retention",
      captureEdit
        ? `<input class="launcher-drawer-input" type="number" min="1" value="${escapeHtml(
            drawerDraft.retentionDays,
          )}" data-feed-drawer-draft="retentionDays" />`
        : renderStaticField(String(feed.retentionDays || 0)),
    ),
  ].join("") + captureContext.captureSettingsFootnote;

  const filterRows = [
    renderSuriRow(
      "Rule Mode",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "filterMode",
            value: drawerDraft.filterMode,
            summary: toLabelCase(drawerDraft.filterMode),
            menuOptions: [
              { value: "include", label: "Include" },
              { value: "exclude", label: "Exclude" },
            ],
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(toLabelCase(feed.filterMode || "include")),
    ),
    renderSuriRow(
      "Protocols",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "protocols",
            value: drawerDraft.protocols,
            summary: getFeedListCountSummary(drawerDraft.protocols, "Protocol"),
            menuOptions: getFeedDrawerFilterMenuOptions("protocols", drawerDraft),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.protocols || "-"),
    ),
    renderSuriRow(
      "IP Subnets",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "subnets",
            value: drawerDraft.subnets,
            summary: getFeedListCountSummary(drawerDraft.subnets, "Subnet"),
            menuOptions: getFeedDrawerFilterMenuOptions("subnets", drawerDraft),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.subnets || "-"),
    ),
    renderSuriRow(
      "Source Subnets",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "sourceSubnets",
            value: drawerDraft.sourceSubnets,
            summary: getFeedListCountSummary(drawerDraft.sourceSubnets, "Subnet"),
            menuOptions: getFeedDrawerFilterMenuOptions("sourceSubnets", drawerDraft),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.sourceSubnets || "-"),
    ),
    renderSuriRow(
      "Destination Subnets",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "destinationSubnets",
            value: drawerDraft.destinationSubnets,
            summary: getFeedListCountSummary(drawerDraft.destinationSubnets, "Subnet"),
            menuOptions: getFeedDrawerFilterMenuOptions("destinationSubnets", drawerDraft),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.destinationSubnets || "-"),
    ),
    renderSuriRow(
      "Ports",
      filterEdit
        ? renderFeedDrawerMenuControl({
            field: "ports",
            value: drawerDraft.ports,
            summary: getFeedListCountSummary(drawerDraft.ports, "Port"),
            menuOptions: getFeedDrawerFilterMenuOptions("ports", drawerDraft),
            control: "draft",
            kind: "select",
            size: "medium",
          })
        : renderStaticField(feed.ports || "-"),
    ),
    renderSuriRow(
      "VLAN ID",
      filterEdit
        ? `<input class="launcher-drawer-input" type="text" value="${escapeHtml(
            drawerDraft.vlanId,
          )}" data-feed-drawer-draft="vlanId" />`
        : renderStaticField(feed.vlanId || "-"),
    ),
    renderSuriRow(
      "Raw BPF",
      filterEdit
        ? `<textarea class="launcher-drawer-textarea" data-feed-drawer-draft="rawBpf">${escapeHtml(
            drawerDraft.rawBpf,
          )}</textarea>`
        : renderStaticField(feed.rawBpf || "-"),
    ),
    renderSuriRow(
      "Storage Reduction",
      filterEdit
        ? renderFeedStorageReductionControl(drawerDraft.estimatedStorageReduction)
        : renderStaticField(`${feed.estimatedStorageReduction || 0}%`),
    ),
  ].join("");

  const historyControlsMarkup = `
    <span class="launcher-history-legend">
      <button class="btn-reset launcher-history-legend-item ${state.feedState.drawerMetric === "errors" ? "is-active" : ""}" type="button" data-feed-metric="errors">
        <span class="launcher-history-legend-icon is-errors" aria-hidden="true"></span>
        <span>Error</span>
      </button>
      <button class="btn-reset launcher-history-legend-item ${state.feedState.drawerMetric === "files" ? "is-active" : ""}" type="button" data-feed-metric="files">
        <span class="launcher-history-legend-icon is-files" aria-hidden="true"></span>
        <span>Files</span>
      </button>
      <button class="btn-reset launcher-history-legend-item ${state.feedState.drawerMetric === "volume" ? "is-active" : ""}" type="button" data-feed-metric="volume">
        <span class="launcher-history-legend-icon is-volume" aria-hidden="true"></span>
        <span>Bitrate</span>
      </button>
    </span>
    ${renderFeedDrawerMenuControl({
      field: "history-range",
      value: state.feedState.drawerRange,
      summary: state.feedState.drawerRange,
      menuOptions: [
        { value: "1h", label: "1h" },
        { value: "24h", label: "24h" },
        { value: "7d", label: "7d" },
        { value: "30d", label: "30d" },
      ],
      control: "control",
      kind: "select",
      size: "compact",
    })}
  `;

  const activityControlsMarkup = `
    <button class="btn-reset btn-secondary-icon size-s style-ghost launcher-feed-log-search-button" type="button" aria-label="Search activity log">
      <span class="inline-icon svg-icon svg-icon-search" aria-hidden="true"></span>
    </button>
    ${renderFeedDrawerMenuControl({
      field: "log-filter",
      value: state.feedState.drawerLogFilter,
      summary: getFeedActivityTypeLabel(state.feedState.drawerLogFilter),
      menuOptions: [
        { value: "all", label: "All" },
        { value: "ingest", label: "History" },
        { value: "error", label: "Error" },
        { value: "config", label: "Config" },
        { value: "subscription", label: "Subscription" },
      ],
      control: "control",
      kind: "select",
      size: "compact",
    })}
  `;

  return `
    ${renderFeedSummaryMarkup(feed, captureContext.summaryPortPreview)}
    ${summaryWarnings}

    ${renderDrawerCard(
      "history",
      "History",
      `<div class="launcher-feed-history-shell">${renderFeedHistoryLines(feed)}</div>`,
      historyControlsMarkup,
    )}

    ${renderDrawerCard(
      "capture-settings",
      "Capture Settings",
      captureRows,
    )}

    ${renderDrawerCard(
      "filter-rules",
      "Filter Rules",
      filterRows,
    )}

    ${renderDrawerCard(
      "subscribed-projects",
      "Projects",
      renderFeedProjectsTableMarkup(feed),
      '<button class="btn-reset btn-secondary-icon size-s style-ghost launcher-feed-table-search" type="button" aria-label="Search projects"><span class="inline-icon svg-icon svg-icon-search" aria-hidden="true"></span></button>',
    )}

    ${renderDrawerCard(
      "suricata-rules",
      "Suricata Rules",
      renderFeedSuricataRulesTableMarkup(feed),
      '<button class="btn-reset btn-secondary-icon size-s style-ghost launcher-feed-table-search" type="button" aria-label="Search Suricata rules"><span class="inline-icon svg-icon svg-icon-search" aria-hidden="true"></span></button>',
    )}

    ${renderDrawerCard("activity-log", "Activity Log", renderFeedConsoleMarkup(feed), activityControlsMarkup)}
  `;
}

function bindFeedDrawerCardToggles(feedId) {
  feedDrawerBodyEl.querySelectorAll("[data-feed-drawer-card]").forEach((cardEl) => {
    const cardKey = cardEl.getAttribute("data-feed-drawer-card");
    if (!cardKey) return;
    const summaryEl = cardEl.querySelector("summary");
    if (!summaryEl) return;
    summaryEl.addEventListener("click", (event) => {
      if (event.target.closest(".card-header-controls")) {
        return;
      }
      event.preventDefault();
      if (state.feedState.openFeedId !== feedId) return;
      const nextOpen = !isFeedDrawerCardOpen(feedId, cardKey);
      setFeedDrawerCardOpen(feedId, cardKey, nextOpen);
      animateFeedDrawerAccordion(cardEl, nextOpen);
    });
  });
}

function renderFeedDrawerHeaderControls(feed) {
  const isEditing = isFeedDrawerInEditMode();
  feedDrawerActionsViewEl.classList.toggle("hidden", isEditing);
  feedDrawerActionsEditEl.classList.toggle("hidden", !isEditing);
  feedDrawerEditEl.disabled = !feed;
  feedDrawerMenuEl.disabled = !feed || isEditing;
  feedDrawerSaveEl.disabled = !feed;
  feedDrawerCancelEl.disabled = !feed;
  renderFeedDrawerActionMenu(feed);
}

function renderFeedDrawer() {
  const activeSection = getActiveSection();
  if (activeSection.id !== "feeds" || !state.feedState.openFeedId) {
    resetFeedExpandedMetricKey(state.feedState.openFeedId);
    state.feedState.drawerOpenMenuKey = "";
    state.feedState.drawerEditCard = "";
    state.feedState.drawerDraft = null;
    feedDrawerShellEl.classList.add("hidden");
    launcherContentShellEl.classList.remove("feed-drawer-open");
    launcherSurfaceEl.classList.remove("drawer-open");
    feedDrawerBodyEl.innerHTML = "";
    renderFeedDrawerHeaderControls(null);
    return;
  }

  const feed = getFeedById(state.feedState.openFeedId);
  if (!feed) {
    resetFeedExpandedMetricKey(state.feedState.openFeedId);
    state.feedState.openFeedId = "";
    state.feedState.drawerOpenMenuKey = "";
    state.feedState.drawerEditCard = "";
    state.feedState.drawerDraft = null;
    feedDrawerShellEl.classList.add("hidden");
    launcherContentShellEl.classList.remove("feed-drawer-open");
    launcherSurfaceEl.classList.remove("drawer-open");
    feedDrawerBodyEl.innerHTML = "";
    renderFeedDrawerHeaderControls(null);
    return;
  }

  ensureFeedShape(feed);
  feedDrawerTitleEl.textContent = feed.name;
  feedDrawerSubtitleEl.textContent = "";
  feedDrawerBodyEl.innerHTML = buildFeedDrawerMarkup(feed);
  bindFeedDrawerCardToggles(feed.id);
  renderFeedDrawerHeaderControls(feed);
  feedDrawerShellEl.classList.remove("hidden");
  launcherContentShellEl.classList.add("feed-drawer-open");
  launcherSurfaceEl.classList.add("drawer-open");
}

function showToast(message) {
  const toastEl = document.createElement("div");
  toastEl.className = "launcher-toast";
  toastEl.textContent = message;
  toastEl.dataset.toastId = String(toastSequence++);
  launcherToastStackEl.appendChild(toastEl);

  window.setTimeout(() => {
    toastEl.remove();
  }, 3400);
}

function renderFeedDeleteModal() {
  const feedIds = state.feedState.pendingDeleteIds;
  const isOpen = feedIds.length > 0;
  feedDeleteModalEl.classList.toggle("hidden", !isOpen);
  if (!isOpen) return;

  const feedRows = feedIds
    .map((feedId) => getFeedById(feedId))
    .filter(Boolean);
  const affectedProjects = Array.from(
    new Set(
      feedRows.flatMap((feed) =>
        (feed.subscribedProjects || []).map((project) => project.name),
      ),
    ),
  );

  feedDeleteAffectedProjectsEl.innerHTML = affectedProjects.length
    ? affectedProjects
        .map((project) => `<li>${escapeHtml(project)}</li>`)
        .join("")
    : "<li>No subscribed projects.</li>";
}

function closeFeedDeleteModal() {
  state.feedState.pendingDeleteIds = [];
  renderFeedDeleteModal();
}

function openFeedDeleteModal(feedIds) {
  state.feedState.pendingDeleteIds = feedIds.filter((feedId) => !!getFeedById(feedId));
  renderFeedDeleteModal();
}

function confirmFeedDelete() {
  const pendingIds = new Set(state.feedState.pendingDeleteIds);
  if (!pendingIds.size) return;

  const removedNames = [];
  state.feedState.rows = state.feedState.rows.filter((feed) => {
    if (!pendingIds.has(feed.id)) return true;
    removedNames.push(feed.name);
    return false;
  });
  state.feedState.pendingDeleteIds = [];
  state.feedState.selectedIds.forEach((feedId) => {
    if (pendingIds.has(feedId)) {
      state.feedState.selectedIds.delete(feedId);
    }
  });
  if (state.feedState.openFeedId && pendingIds.has(state.feedState.openFeedId)) {
    state.feedState.openFeedId = "";
  }
  renderContent();
  renderFeedDeleteModal();
  showToast(
    removedNames.length === 1
      ? `Deleted capture feed: ${removedNames[0]}.`
      : `Deleted ${removedNames.length} capture feeds.`,
  );
}

function closeDeviceAdminModal() {
  state.feedState.deviceAdmin.open = false;
  state.feedState.deviceAdmin.source = "";
  state.feedState.deviceAdmin.feedId = "";
  state.feedState.deviceAdmin.draft = null;
  state.feedState.deviceAdmin.selectedPortNumber = 0;
  renderDeviceAdminModal();
}

function openDeviceAdminModalForFeed(feed, selectedPortNumber = 0) {
  if (!feed || feed.type !== "Napatech") return;
  state.feedState.deviceAdmin.open = true;
  state.feedState.deviceAdmin.source = "feed";
  state.feedState.deviceAdmin.feedId = feed.id;
  state.feedState.deviceAdmin.draft = null;
  state.feedState.deviceAdmin.selectedPortNumber = Number(selectedPortNumber || 0);
  renderDeviceAdminModal();
}

function openDeviceAdminModalForDraft(draft, selectedPortNumber = 0) {
  if (!draft || draft.type !== "Napatech") return;
  state.feedState.deviceAdmin.open = true;
  state.feedState.deviceAdmin.source = "draft";
  state.feedState.deviceAdmin.feedId = "";
  state.feedState.deviceAdmin.draft = { ...draft };
  state.feedState.deviceAdmin.selectedPortNumber = Number(selectedPortNumber || 0);
  renderDeviceAdminModal();
}

function renderDeviceAdminModal() {
  const deviceAdmin = state.feedState.deviceAdmin;
  if (!deviceAdmin.open) {
    deviceAdminModalEl.classList.add("hidden");
    deviceAdminBodyEl.innerHTML = "";
    return;
  }

  const payload = buildDeviceAdminPayload(
    deviceAdmin.source,
    deviceAdmin.feedId,
    deviceAdmin.draft,
  );

  if (!payload) {
    deviceAdminTitleEl.textContent = "Device Port Map";
    deviceAdminSubtitleEl.textContent = "Unavailable";
    deviceAdminBodyEl.innerHTML =
      '<div class="launcher-device-note is-warning">Teleseer can only visualize Napatech port maps for devices that report firmware-backed layout information.</div>';
    deviceAdminModalEl.classList.remove("hidden");
    return;
  }

  if (
    !payload.deviceState.ports.some(
      (port) => port.number === state.feedState.deviceAdmin.selectedPortNumber,
    )
  ) {
    state.feedState.deviceAdmin.selectedPortNumber =
      getDefaultSelectedPort(payload.deviceState, payload.feedId)?.number || 0;
  }

  deviceAdminTitleEl.textContent = payload.title;
  deviceAdminSubtitleEl.textContent = payload.subtitle;
  deviceAdminBodyEl.innerHTML = buildDeviceAdminBodyMarkup(payload);
  deviceAdminModalEl.classList.remove("hidden");
}

function buildFeedDraftFromRow(feed) {
  const draft = {
    category: feed.category || "Network Capture",
    type: feed.type || "Napatech",
    name: feed.name || "",
    description: feed.description || "",
    source: feed.source || "",
    deviceLabel: feed.deviceLabel || "",
    captureInput: feed.captureInput || "",
    portProfile: feed.portProfile || "",
    outputPath: feed.outputPath || "/mnt/disks/teleseer/livecaptures",
    chunkSizeMb: String(feed.chunkSizeMb || 500),
    closeAndProcessSeconds: String(feed.closeAndProcessSeconds || 60),
    retentionDays: String(feed.retentionDays || 30),
    filterMode: feed.filterMode || "include",
    protocols: feed.protocols || feed.protocol || "",
    subnets: feed.subnets || "",
    sourceSubnets: feed.sourceSubnets || feed.sourceHost || "",
    destinationSubnets: feed.destinationSubnets || feed.destinationHost || "",
    ports: feed.ports || feed.portRange || "",
    vlanId: feed.vlanId || "",
    rawBpf: feed.rawBpf || "",
    estimatedStorageReduction: String(feed.estimatedStorageReduction || 0),
  };
  syncNapatechDraftPortProfile(draft);
  return draft;
}

function openFeedCreateModal(editingFeedId = "") {
  const editingFeed = editingFeedId ? getFeedById(editingFeedId) : null;
  state.feedState.createFlow.open = true;
  state.feedState.createFlow.step = editingFeed ? 1 : 0;
  state.feedState.createFlow.editingFeedId = editingFeed ? editingFeed.id : "";
  state.feedState.createFlow.draft = editingFeed
    ? buildFeedDraftFromRow(editingFeed)
    : createDefaultFeedDraft();
  syncNapatechDraftPortProfile(state.feedState.createFlow.draft);
  renderFeedCreateModal();
}

function closeFeedCreateModal() {
  state.feedState.createFlow.open = false;
  state.feedState.createFlow.step = 0;
  state.feedState.createFlow.editingFeedId = "";
  state.feedState.createFlow.draft = createDefaultFeedDraft();
  renderFeedCreateModal();
}

function validateFeedDraftForStep(step, draft) {
  syncNapatechDraftPortProfile(draft);
  syncFeedDraftSource(draft);
  if (step === 0 && (!draft.category || !draft.type)) {
    showToast("Choose the live feed category and source type before continuing.");
    return false;
  }
  if (step >= 1) {
    if (!String(draft.name || "").trim()) {
      showToast("Feed name is required.");
      return false;
    }
    if (!String(draft.deviceLabel || "").trim()) {
      showToast("Capture device is required.");
      return false;
    }
    if (!String(draft.captureInput || "").trim()) {
      showToast("Capture input is required.");
      return false;
    }
    if (!String(draft.outputPath || "").trim()) {
      showToast("Output folder is required.");
      return false;
    }
    if (Number(draft.chunkSizeMb || 0) <= 0) {
      showToast("Chunk size must be greater than zero.");
      return false;
    }
    if (Number(draft.closeAndProcessSeconds || 0) <= 0) {
      showToast("Close and process interval must be greater than zero.");
      return false;
    }
    if (draft.type === "Napatech" && !String(draft.portProfile || "").trim()) {
      showToast("Napatech feeds require a detected or expected layout.");
      return false;
    }
  }
  return true;
}

function renderFeedCreateModal() {
  const flow = state.feedState.createFlow;
  const draft = flow.draft;
  const isEditing = !!flow.editingFeedId;
  const isOpen = flow.open;
  feedCreateModalEl.classList.toggle("hidden", !isOpen);
  if (!isOpen) {
    feedCreateBodyEl.innerHTML = "";
    return;
  }

  feedCreateTitleEl.textContent = isEditing ? "Edit Capture Feed" : "New Capture Feed";
  feedCreateConfirmEl.textContent = isEditing
    ? "Save Capture Feed"
    : "Create Capture Feed";

  const stepNodes = Array.from(feedCreateStepperEl.querySelectorAll("span"));
  stepNodes.forEach((nodeEl, index) => {
    nodeEl.classList.toggle("active", index === flow.step);
  });

  feedCreateBackEl.classList.toggle("hidden", flow.step === 0);
  feedCreateNextEl.classList.toggle("hidden", flow.step >= 2);
  feedCreateConfirmEl.classList.toggle("hidden", flow.step < 2);

  syncFeedDraftSource(draft);
  const duplicateFeed = findDuplicateFeedSource(draft.source, flow.editingFeedId);
  const dedupWarning = duplicateFeed
    ? `<div class="launcher-form-warning">Dedup warning: this source is already used by ${escapeHtml(
        duplicateFeed.name,
      )}.</div>`
    : "";

  if (flow.step === 0) {
    feedCreateBodyEl.innerHTML = `
      <div class="launcher-type-section">
        <div class="launcher-type-section-head">
          <div class="launcher-type-section-title">Category</div>
          <p class="launcher-type-section-copy">Only Network Capture is live right now. Folder Watch and App/Integration stay visible as planned states so the structure stays clear.</p>
        </div>
        <div class="launcher-type-grid">
          ${FEED_CATEGORY_OPTIONS
            .map(
              (option) => `
              <button
                class="btn-reset launcher-type-option ${draft.category === option.value ? "active" : ""} ${option.enabled ? "" : "is-disabled"}"
                type="button"
                data-feed-category-option="${escapeHtml(option.value)}"
                ${option.enabled ? "" : "disabled"}
              >
                <span class="launcher-type-option-head">
                  <span class="launcher-type-option-title">${escapeHtml(option.value)}</span>
                  <span class="launcher-type-option-tag">${option.enabled ? "Live" : "Planned"}</span>
                </span>
                <span class="launcher-type-option-copy">${escapeHtml(option.copy)}</span>
              </button>`,
            )
            .join("")}
        </div>
      </div>

      <div class="launcher-type-section">
        <div class="launcher-type-section-head">
          <div class="launcher-type-section-title">Source Type</div>
          <p class="launcher-type-section-copy">Choose the capture source the workspace feed will bind to.</p>
        </div>
        <div class="launcher-type-grid launcher-type-grid-dual">
          ${FEED_SOURCE_TYPE_OPTIONS
          .map(
            (option) => `
            <button
              class="btn-reset launcher-type-option ${draft.type === option.value ? "active" : ""}"
              type="button"
              data-feed-type-option="${escapeHtml(option.value)}"
            >
              <span class="launcher-type-option-head">
                <span class="launcher-type-option-title">${escapeHtml(option.value)}</span>
              </span>
              <span class="launcher-type-option-copy">${escapeHtml(option.copy)}</span>
            </button>`,
          )
          .join("")}
        </div>
      </div>
    `;
    return;
  }

  if (flow.step === 1) {
    const portLayoutOptions = [
      "2x100G",
      "2x40G",
      "2x10/25G",
      "4x10/25G",
      "8x10G",
      "2x1/10G",
    ];
    const sourcePreview =
      draft.source || "Capture device and input will define the feed source.";
    const devicePlaceholder =
      draft.type === "Napatech" ? "NT200-PHX-01" : "sensor-phx-07";
    const inputPlaceholder = draft.type === "Napatech" ? "Tap 0" : "eno1";
    const detectedDeviceState =
      draft.type === "Napatech" ? getDetectedNapatechState(draft.deviceLabel) : null;
    const layoutLabel = detectedDeviceState
      ? detectedDeviceState.detectedLayout
      : draft.portProfile || portLayoutOptions[0];
    const napatechFields =
      draft.type === "Napatech"
        ? `
          <div class="launcher-form-field">
            <label>Port Layout</label>
            <div class="launcher-form-static">${escapeHtml(layoutLabel)}</div>
            <span class="launcher-form-hint">${
              detectedDeviceState
                ? "Read from current device state. Change card layout or firmware in Device Admin, not in feed editing."
                : "No live device state is available yet. This is only a preview of the expected layout until firmware-backed device state is detected."
            }</span>
            <button
              class="btn-reset btn-secondary size-s style-ghost launcher-form-inline-action"
              type="button"
              data-feed-create-action="device-admin"
            >
              Open Device Admin
            </button>
          </div>`
        : "";

    feedCreateBodyEl.innerHTML = `
      <div class="launcher-form-section">
        <div class="launcher-form-section-title">Feed Identity</div>
        <div class="launcher-form-grid">
          <div class="launcher-form-field">
            <label for="feedDraftName">Name</label>
            <input id="feedDraftName" data-feed-draft="name" value="${escapeHtml(
              draft.name,
            )}" placeholder="Core Spine Capture" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftRetentionDays">Retention (days)</label>
            <input id="feedDraftRetentionDays" data-feed-draft="retentionDays" value="${escapeHtml(
              draft.retentionDays,
            )}" placeholder="30" />
          </div>
          <div class="launcher-form-field full">
            <label for="feedDraftDescription">Description</label>
            <textarea id="feedDraftDescription" data-feed-draft="description" placeholder="Explain what this capture feed collects and why.">${escapeHtml(
              draft.description,
            )}</textarea>
          </div>
          <div class="launcher-form-field">
            <label>Category</label>
            <div class="launcher-form-static">${escapeHtml(draft.category)}</div>
          </div>
          <div class="launcher-form-field">
            <label>Source Type</label>
            <div class="launcher-form-static">${escapeHtml(draft.type)}</div>
          </div>
        </div>
      </div>

      <div class="launcher-form-section">
        <div class="launcher-form-section-title">Capture Settings</div>
        <div class="launcher-form-grid">
          <div class="launcher-form-field">
            <label for="feedDraftDeviceLabel">Capture Device</label>
            <input id="feedDraftDeviceLabel" data-feed-draft="deviceLabel" value="${escapeHtml(
              draft.deviceLabel,
            )}" placeholder="${escapeHtml(devicePlaceholder)}" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftCaptureInput">Capture Input</label>
            <input id="feedDraftCaptureInput" data-feed-draft="captureInput" value="${escapeHtml(
              draft.captureInput,
            )}" placeholder="${escapeHtml(inputPlaceholder)}" />
          </div>
          ${napatechFields}
          <div class="launcher-form-field">
            <label for="feedDraftOutputPath">Output Folder</label>
            <input id="feedDraftOutputPath" data-feed-draft="outputPath" value="${escapeHtml(
              draft.outputPath,
            )}" placeholder="/mnt/disks/teleseer/livecaptures" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftChunkSizeMb">Chunk Size (MB)</label>
            <input id="feedDraftChunkSizeMb" data-feed-draft="chunkSizeMb" value="${escapeHtml(
              draft.chunkSizeMb,
            )}" placeholder="500" />
            <span class="launcher-form-hint">Start a new capture chunk when this size is reached.</span>
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftCloseAndProcessSeconds">Close &amp; Process (seconds)</label>
            <input id="feedDraftCloseAndProcessSeconds" data-feed-draft="closeAndProcessSeconds" value="${escapeHtml(
              draft.closeAndProcessSeconds,
            )}" placeholder="60" />
            <span class="launcher-form-hint">Close the current chunk and hand it off for processing even if it is still small.</span>
          </div>
          <div class="launcher-form-field full">
            <label>Derived Source</label>
            <div class="launcher-form-static">${escapeHtml(sourcePreview)}</div>
          </div>
        </div>
      </div>

      <div class="launcher-form-section">
        <div class="launcher-form-section-title">Filter Rules</div>
        <div class="launcher-form-grid">
          <div class="launcher-form-field">
            <label for="feedDraftFilterMode">Filter Mode</label>
            <select id="feedDraftFilterMode" data-feed-draft="filterMode">
              <option value="include" ${draft.filterMode === "include" ? "selected" : ""}>Include</option>
              <option value="exclude" ${draft.filterMode === "exclude" ? "selected" : ""}>Exclude</option>
            </select>
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftProtocols">Protocols</label>
            <input id="feedDraftProtocols" data-feed-draft="protocols" value="${escapeHtml(
              draft.protocols,
            )}" placeholder="tcp, udp, icmp" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftSubnets">IP Subnets</label>
            <input id="feedDraftSubnets" data-feed-draft="subnets" value="${escapeHtml(
              draft.subnets,
            )}" placeholder="10.24.18.0/24, 172.16.40.0/21" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftSourceSubnets">Source Subnets</label>
            <input id="feedDraftSourceSubnets" data-feed-draft="sourceSubnets" value="${escapeHtml(
              draft.sourceSubnets,
            )}" placeholder="10.24.18.0/24" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftDestinationSubnets">Destination Subnets</label>
            <input id="feedDraftDestinationSubnets" data-feed-draft="destinationSubnets" value="${escapeHtml(
              draft.destinationSubnets,
            )}" placeholder="172.16.40.9" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftPorts">Port / Range</label>
            <input id="feedDraftPorts" data-feed-draft="ports" value="${escapeHtml(
              draft.ports,
            )}" placeholder="443 or 1024-2048" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftVlanId">VLAN ID</label>
            <input id="feedDraftVlanId" data-feed-draft="vlanId" value="${escapeHtml(
              draft.vlanId,
            )}" placeholder="103" />
          </div>
          <div class="launcher-form-field">
            <label for="feedDraftEstimatedStorageReduction">Estimated Storage Reduction (%)</label>
            <input id="feedDraftEstimatedStorageReduction" data-feed-draft="estimatedStorageReduction" value="${escapeHtml(
              draft.estimatedStorageReduction,
            )}" placeholder="18" />
          </div>
          <div class="launcher-form-field full">
            <label for="feedDraftRawBpf">Raw BPF</label>
            <textarea id="feedDraftRawBpf" data-feed-draft="rawBpf" placeholder="tcp and not host 10.24.18.9">${escapeHtml(
              draft.rawBpf,
            )}</textarea>
            <span class="launcher-form-hint">Use raw BPF only for advanced cases the rule fields do not cover.</span>
          </div>
        </div>
      </div>
      ${dedupWarning}
    `;
    return;
  }

  feedCreateBodyEl.innerHTML = `
    <div class="launcher-summary-grid">
      <div class="launcher-summary-row"><label>Category</label><span>${escapeHtml(draft.category)}</span></div>
      <div class="launcher-summary-row"><label>Source Type</label><span>${escapeHtml(draft.type)}</span></div>
      <div class="launcher-summary-row"><label>Name</label><span>${escapeHtml(draft.name)}</span></div>
      <div class="launcher-summary-row"><label>Description</label><span>${escapeHtml(
        draft.description || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Source</label><span>${escapeHtml(draft.source)}</span></div>
      <div class="launcher-summary-row"><label>Capture Device</label><span>${escapeHtml(
        draft.deviceLabel || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Capture Input</label><span>${escapeHtml(
        draft.captureInput || "-",
      )}</span></div>
      ${
        draft.type === "Napatech"
          ? `<div class="launcher-summary-row"><label>Port Layout</label><span>${escapeHtml(
              draft.portProfile || "-",
            )}</span></div>`
          : ""
      }
      <div class="launcher-summary-row"><label>Output Folder</label><span>${escapeHtml(
        draft.outputPath || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Chunk Size</label><span>${escapeHtml(
        `${draft.chunkSizeMb || "-"} MB`,
      )}</span></div>
      <div class="launcher-summary-row"><label>Close &amp; Process</label><span>${escapeHtml(
        `${draft.closeAndProcessSeconds || "-"} seconds`,
      )}</span></div>
      <div class="launcher-summary-row"><label>Retention</label><span>${escapeHtml(
        `${draft.retentionDays || 30} days`,
      )}</span></div>
      <div class="launcher-summary-row"><label>Filter Mode</label><span>${escapeHtml(
        draft.filterMode,
      )}</span></div>
      <div class="launcher-summary-row"><label>Protocols</label><span>${escapeHtml(
        draft.protocols || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>IP Subnets</label><span>${escapeHtml(
        draft.subnets || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Source Subnets</label><span>${escapeHtml(
        draft.sourceSubnets || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Destination Subnets</label><span>${escapeHtml(
        draft.destinationSubnets || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Ports</label><span>${escapeHtml(
        draft.ports || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>VLAN ID</label><span>${escapeHtml(
        draft.vlanId || "-",
      )}</span></div>
      <div class="launcher-summary-row"><label>Estimated Filter Rules</label><span>${escapeHtml(
        String(getFeedFilterRuleCount(draft)),
      )}</span></div>
      <div class="launcher-summary-row"><label>Estimated Storage Reduction</label><span>${escapeHtml(
        `${draft.estimatedStorageReduction || 0}%`,
      )}</span></div>
      <div class="launcher-summary-row"><label>Raw BPF</label><span>${escapeHtml(
        draft.rawBpf || "-",
      )}</span></div>
    </div>
    ${dedupWarning}
  `;
}

function commitFeedCreateFlow() {
  const flow = state.feedState.createFlow;
  const draft = flow.draft;
  if (!validateFeedDraftForStep(1, draft)) return;
  syncFeedDraftSource(draft);

  const editingFeed = flow.editingFeedId ? getFeedById(flow.editingFeedId) : null;
  const feed = editingFeed || {
    id: `feed-${Date.now().toString(36)}-${Math.round(Math.random() * 9999)}`,
    createdAt: Date.now(),
    icon: "../icons/icon_feed.svg",
    subtext: "",
    status: {
      tone: "initializing",
      label: "Starting",
      extra: "validating capture input",
    },
    ingestSparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    subscribedProjects: [],
    activityLog: [],
    healthScore: 0,
    files24h: 0,
    volume24h: "0 B",
    errorsPerDay: 0,
    lastActivity: "Never",
    lastActivityMinutes: 9999,
  };

  feed.category = draft.category || "Network Capture";
  feed.name = draft.name.trim();
  feed.type = draft.type;
  feed.source = draft.source.trim();
  feed.description = draft.description.trim();
  feed.deviceLabel = draft.deviceLabel.trim();
  feed.captureInput = draft.captureInput.trim();
  feed.portProfile =
    draft.type === "Napatech"
      ? getDetectedNapatechLayout(draft.deviceLabel, String(draft.portProfile || "").trim())
      : "";
  feed.outputPath = draft.outputPath.trim();
  feed.chunkSizeMb = Math.max(1, Number(draft.chunkSizeMb || 500));
  feed.closeAndProcessSeconds = Math.max(
    1,
    Number(draft.closeAndProcessSeconds || 60),
  );
  feed.retentionDays = Math.max(1, Number(draft.retentionDays || 30));
  feed.sourceDetails = getFeedSourceDetailsFromDraft(draft);
  feed.filterRulesCount = getFeedFilterRuleCount(draft);
  feed.filterMode = draft.filterMode;
  feed.protocols = String(draft.protocols || "").trim();
  feed.subnets = String(draft.subnets || "").trim();
  feed.sourceSubnets = String(draft.sourceSubnets || "").trim();
  feed.destinationSubnets = String(draft.destinationSubnets || "").trim();
  feed.ports = String(draft.ports || "").trim();
  feed.vlanId = String(draft.vlanId || "").trim();
  feed.rawBpf = draft.rawBpf.trim();
  feed.estimatedStorageReduction = Math.max(
    0,
    Math.min(100, Number(draft.estimatedStorageReduction || 0)),
  );
  feed.expectedIdleMinutes = FEED_DEFAULT_IDLE_BY_TYPE[draft.type] || 15;
  feed.subtext = `${feed.category} · ${feed.type}`;

  ensureFeedShape(feed);
  feed.subscriptionCount = Array.isArray(feed.subscribedProjects)
    ? feed.subscribedProjects.length
    : 0;

  if (editingFeed) {
    appendFeedLog(feed, "config", "Feed configuration updated");
    setFeedStatus(feed, "syncing", "applying capture configuration");
    touchFeed(feed);
    showToast(`Capture feed updated: ${feed.name}.`);
  } else {
    appendFeedLog(feed, "config", "Feed created and initializing");
    setFeedStatus(feed, "initializing", "validating capture input");
    if (!Array.isArray(feed.subscribedProjects)) {
      feed.subscribedProjects = [];
    }
    state.feedState.rows.unshift(feed);
    showToast(
      "Capture feed created. Subscribe at least one project in Viewer so data can be analyzed.",
    );
  }

  closeFeedCreateModal();
  state.activeSidebarItemId = "feeds";
  state.activeSectionId = "feeds";
  state.feedState.filterType = "all";
  state.feedState.filterStatus = "all";
  state.sectionQueryById.feeds = "";
  state.feedState.openFeedId = feed.id;
  state.feedState.selectedIds.delete(feed.id);
  render();
}

function handleFeedCreateStepForward() {
  const flow = state.feedState.createFlow;
  const draft = flow.draft;
  if (!validateFeedDraftForStep(flow.step, draft)) return;

  if (flow.step < 2) {
    flow.step += 1;
    renderFeedCreateModal();
  }
}

function handleFeedCreateStepBack() {
  const flow = state.feedState.createFlow;
  if (flow.step <= 0) return;
  flow.step -= 1;
  renderFeedCreateModal();
}

function beginFeedDrawerCardEdit(feed, card) {
  state.feedState.drawerOpenMenuKey = "";
  state.feedState.drawerEditCard = card;
  state.feedState.drawerDraft = createFeedDrawerDraft(feed);
  const cardKey = getFeedDrawerCardKeyForEditCard(card);
  if (cardKey) {
    setFeedDrawerCardOpen(feed.id, cardKey, true);
  }
}

function cancelFeedDrawerCardEdit() {
  state.feedState.drawerOpenMenuKey = "";
  state.feedState.drawerEditCard = "";
  state.feedState.drawerDraft = null;
}

function saveFeedDrawerCardEdit(feed, card, options = {}) {
  const draft = getFeedDrawerDraft(feed);

  if (card === "capture") {
    if (!String(draft.deviceLabel || "").trim()) {
      showToast("Capture device is required.");
      return false;
    }
    if (!String(draft.captureInput || "").trim()) {
      showToast("Capture input is required.");
      return false;
    }
    if (!String(draft.outputPath || "").trim()) {
      showToast("Output folder is required.");
      return false;
    }
    if (feed.type === "Napatech" && !String(draft.portProfile || "").trim()) {
      showToast("Napatech feeds require a detected or expected layout.");
      return false;
    }

    feed.deviceLabel = String(draft.deviceLabel || "").trim();
    feed.captureInput = String(draft.captureInput || "").trim();
    feed.portProfile =
      feed.type === "Napatech"
        ? getDetectedNapatechLayout(
            draft.deviceLabel,
            String(draft.portProfile || feed.portProfile || "").trim(),
          )
        : "";
    feed.outputPath = String(draft.outputPath || "").trim();
    feed.chunkSizeMb = Math.max(1, Number(draft.chunkSizeMb || feed.chunkSizeMb || 1));
    feed.closeAndProcessSeconds = Math.max(
      1,
      Number(draft.closeAndProcessSeconds || feed.closeAndProcessSeconds || 1),
    );
    feed.retentionDays = Math.max(1, Number(draft.retentionDays || feed.retentionDays || 1));
    feed.source = [feed.deviceLabel, feed.captureInput].filter(Boolean).join(" · ");
    feed.sourceDetails = getFeedSourceDetailsFromDraft({
      type: feed.type,
      deviceLabel: feed.deviceLabel,
      captureInput: feed.captureInput,
      portProfile: feed.portProfile,
    });
    appendFeedLog(feed, "config", "Capture settings updated");
  }

  if (card === "filters") {
    feed.filterMode = draft.filterMode;
    feed.protocols = String(draft.protocols || "").trim();
    feed.subnets = String(draft.subnets || "").trim();
    feed.sourceSubnets = String(draft.sourceSubnets || "").trim();
    feed.destinationSubnets = String(draft.destinationSubnets || "").trim();
    feed.ports = String(draft.ports || "").trim();
    feed.vlanId = String(draft.vlanId || "").trim();
    feed.rawBpf = String(draft.rawBpf || "").trim();
    feed.estimatedStorageReduction = Math.max(
      0,
      Math.min(100, Number(draft.estimatedStorageReduction || 0)),
    );
    feed.filterRulesCount = getFeedFilterRuleCount(draft);
    appendFeedLog(feed, "config", "Filter rules updated");
  }

  ensureFeedShape(feed);
  if (!options.keepEditing) {
    cancelFeedDrawerCardEdit();
  }
  return true;
}

function handleFeedDrawerClick(event) {
  const feed = getFeedById(state.feedState.openFeedId);
  if (!feed) return;

  const menuOption = event.target.closest("[data-feed-drawer-menu-option]");
  if (menuOption) {
    event.preventDefault();
    event.stopPropagation();
    const menuKey = menuOption.getAttribute("data-feed-drawer-menu-option");
    const value = menuOption.getAttribute("data-feed-drawer-menu-value") || "";
    if (menuKey?.startsWith("draft:")) {
      const key = menuKey.slice("draft:".length);
      const draft = getFeedDrawerDraft(feed);
      draft[key] = value;
      if (key === "deviceLabel") {
        syncNapatechDraftPortProfile(draft);
      }
    } else if (menuKey === "control:log-filter") {
      state.feedState.drawerLogFilter = value;
    } else if (menuKey === "control:history-range") {
      state.feedState.drawerRange = value;
    }
    state.feedState.drawerOpenMenuKey = "";
    renderFeedDrawer();
    return;
  }

  const menuTrigger = event.target.closest("[data-feed-drawer-menu-trigger]");
  if (menuTrigger) {
    event.preventDefault();
    event.stopPropagation();
    const menuKey = menuTrigger.getAttribute("data-feed-drawer-menu-trigger") || "";
    state.feedState.drawerOpenMenuKey =
      state.feedState.drawerOpenMenuKey === menuKey ? "" : menuKey;
    renderFeedDrawer();
    return;
  }

  const portPreviewButton = event.target.closest("[data-feed-port-select]");
  if (portPreviewButton) {
    event.preventDefault();
    const selectedPortNumber = Number(portPreviewButton.getAttribute("data-feed-port-select") || 0);
    const devicePayload = isFeedDrawerInEditMode()
      ? buildDeviceAdminPayload("draft", "", getFeedDrawerDraft(feed), feed.id)
      : buildDeviceAdminPayload("feed", feed.id);
    const selectedPort =
      devicePayload?.deviceState?.ports.find((port) => port.number === selectedPortNumber) || null;

    setFeedDrawerSelectedPortNumber(feed.id, selectedPortNumber);

    if (selectedPort && isFeedDrawerInEditMode()) {
      const portMeta = getPortStateMeta(selectedPort, feed.id);
      if (canFeedDrawerPortDriveCaptureInput(portMeta, true)) {
        const draft = getFeedDrawerDraft(feed);
        draft.captureInput = getNapatechTapLabel(selectedPort.number);
        syncFeedDraftSource(draft);
      }
    }
    renderFeedDrawer();
    return;
  }

  const tablePageButton = event.target.closest("[data-feed-drawer-table-page]");
  if (tablePageButton) {
    event.preventDefault();
    const tableKey = tablePageButton.getAttribute("data-feed-drawer-table-key") || "";
    const targetFeedId = tablePageButton.getAttribute("data-feed-drawer-table-feed") || "";
    const direction = tablePageButton.getAttribute("data-feed-drawer-table-page") || "next";
    const paginationStore = getFeedDrawerTableStore(tableKey);
    if (!paginationStore || !targetFeedId) return;

    const totalItems =
      tableKey === "projects"
        ? getFeedProjectTableRows(feed).length
        : (Array.isArray(feed.suricataRules) ? feed.suricataRules.length : 0);
    const pagination = getFeedDrawerTablePagination(tableKey, targetFeedId, totalItems);
    paginationStore[targetFeedId] = {
      ...pagination,
      page:
        direction === "prev"
          ? Math.max(1, pagination.page - 1)
          : Math.min(pagination.totalPages, pagination.page + 1),
    };
    renderFeedDrawer();
    return;
  }

  const metricCardButton = event.target.closest("[data-feed-metric-card]");
  if (metricCardButton) {
    event.preventDefault();
    const metricKey = metricCardButton.getAttribute("data-feed-metric-card") || "";
    if (!metricKey) return;
    const previousExpandedMetricKey = getFeedExpandedMetricKey(feed.id);
    toggleFeedExpandedMetricKey(feed.id, metricKey);
    syncFeedDrawerSummarySection(feed, previousExpandedMetricKey);
    return;
  }

  const actionButton = event.target.closest("[data-feed-action]");
  if (actionButton) {
    event.preventDefault();
    const action = actionButton.getAttribute("data-feed-action");
    if (action === "delete") {
      openFeedDeleteModal([feed.id]);
    } else if (action === "retry") {
      retryFeed(feed);
    } else if (action === "device-admin") {
      if (isFeedDrawerInEditMode()) {
        openDeviceAdminModalForDraft(getFeedDrawerDraft(feed));
      } else {
        openDeviceAdminModalForFeed(feed);
      }
      return;
    } else if (action === "browse-output") {
      showToast("Output folder browsing is not wired in this prototype.");
      return;
    } else if (action === "copy-log") {
      const consoleText = getFeedConsoleLogEntries(feed)
        .map((row) => `${row.timestamp} ${row.level} ${row.message}`)
        .join("\n");
      navigator.clipboard?.writeText(consoleText);
      showToast(`Copied activity log for ${feed.name}.`);
      return;
    }
    renderContent();
    return;
  }

  const metricButton = event.target.closest("[data-feed-metric]");
  if (metricButton) {
    event.preventDefault();
    state.feedState.drawerMetric = metricButton.getAttribute("data-feed-metric");
    renderFeedDrawer();
    return;
  }

  const rangeButton = event.target.closest("[data-feed-range]");
  if (rangeButton) {
    event.preventDefault();
    state.feedState.drawerRange = rangeButton.getAttribute("data-feed-range");
    renderFeedDrawer();
    return;
  }
}

function handleFeedDrawerChange(event) {
  const feed = getFeedById(state.feedState.openFeedId);
  if (!feed) return;

  const control = event.target.closest("[data-feed-control]");
  if (control) {
    const controlName = control.getAttribute("data-feed-control");
    if (controlName === "range") {
      state.feedState.drawerRange = control.value;
      renderFeedDrawer();
    } else if (controlName === "log-filter") {
      state.feedState.drawerLogFilter = control.value;
      renderFeedDrawer();
    }
    return;
  }

  const draftInput = event.target.closest("[data-feed-drawer-draft]");
  if (draftInput) {
    const key = draftInput.getAttribute("data-feed-drawer-draft");
    const draft = getFeedDrawerDraft(feed);
    draft[key] = draftInput.value;
    if (key === "deviceLabel") {
      syncNapatechDraftPortProfile(draft);
    }
    if (key === "estimatedStorageReduction") {
      feedDrawerBodyEl
        .querySelectorAll('[data-feed-drawer-draft="estimatedStorageReduction"]')
        .forEach((inputEl) => {
          if (inputEl === draftInput) return;
          inputEl.value = draftInput.value;
        });
    }
    if (event.type === "change" && (key === "deviceLabel" || key === "captureInput")) {
      renderFeedDrawer();
    }
  }
}

function handleFeedCreateInput(event) {
  const draftInput = event.target.closest("[data-feed-draft]");
  if (!draftInput) return;
  const key = draftInput.getAttribute("data-feed-draft");
  const draft = state.feedState.createFlow.draft;
  draft[key] = draftInput.value;
  if (key === "deviceLabel" || key === "captureInput") {
    syncNapatechDraftPortProfile(draft);
    syncFeedDraftSource(draft);
  }
  if (event.type === "change" && ["deviceLabel", "captureInput"].includes(key)) {
    renderFeedCreateModal();
  }
}

function handleFeedCreateBodyClick(event) {
  const deviceAdminButton = event.target.closest("[data-feed-create-action='device-admin']");
  if (deviceAdminButton) {
    openDeviceAdminModalForDraft(state.feedState.createFlow.draft);
    return;
  }

  const categoryButton = event.target.closest("[data-feed-category-option]");
  if (categoryButton && !categoryButton.disabled) {
    const category = categoryButton.getAttribute("data-feed-category-option");
    state.feedState.createFlow.draft.category = category;
    renderFeedCreateModal();
    return;
  }

  const typeButton = event.target.closest("[data-feed-type-option]");
  if (!typeButton) return;
  const type = typeButton.getAttribute("data-feed-type-option");
  state.feedState.createFlow.draft.type = type;
  syncNapatechDraftPortProfile(state.feedState.createFlow.draft);
  renderFeedCreateModal();
}

function handleGridBodyClick(event) {
  if (getActiveSection().id !== "feeds") return;

  const filesFilterButton = event.target.closest("[data-feed-files-filter]");
  if (filesFilterButton) {
    const feedId = filesFilterButton.getAttribute("data-feed-files-filter");
    const value = filesFilterButton.getAttribute("data-feed-files-filter-value");
    state.feedState.filesFilterByFeedId[feedId] = value || "all";
    state.feedState.filesPaginationByFeedId[feedId] = { page: 1 };
    renderContent();
    return;
  }

  const prevButton = event.target.closest("[data-feed-files-prev]");
  if (prevButton) {
    const feedId = prevButton.getAttribute("data-feed-files-prev");
    const feed = getFeedById(feedId);
    if (!feed) return;
    const pagination = getFeedFilesPagination(feedId, getVisibleFeedFiles(feed).length);
    state.feedState.filesPaginationByFeedId[feedId] = {
      ...pagination,
      page: Math.max(1, pagination.page - 1),
    };
    renderContent();
    return;
  }

  const nextButton = event.target.closest("[data-feed-files-next]");
  if (nextButton) {
    const feedId = nextButton.getAttribute("data-feed-files-next");
    const feed = getFeedById(feedId);
    if (!feed) return;
    const pagination = getFeedFilesPagination(feedId, getVisibleFeedFiles(feed).length);
    state.feedState.filesPaginationByFeedId[feedId] = {
      ...pagination,
      page: Math.min(pagination.totalPages, pagination.page + 1),
    };
    renderContent();
  }
}

function renderContent() {
  const section = getActiveSection();
  renderToolbar(section);
  removeMissingSelectedFeedIds();

  const visibleRows = getVisibleRows(section);
  if (section.id === "feeds") {
    const selectedVisibleCount = visibleRows.filter((row) =>
      state.feedState.selectedIds.has(row.id),
    ).length;
    const allRowsSelected =
      visibleRows.length > 0 && selectedVisibleCount === visibleRows.length;
    const someRowsSelected =
      selectedVisibleCount > 0 && selectedVisibleCount < visibleRows.length;

    tableSOT.renderFixedTable({
      headEl: gridHeadEl,
      bodyEl: gridBodyEl,
      tableKey: section.id,
      columns: section.columns,
      rows: visibleRows,
      columnVisibility: getSectionVisibleColumnConfig(section),
      sort: {
        key: state.feedState.sort.key,
        direction: state.feedState.sort.direction,
        onSort: (key) => {
          setFeedSort(key);
          renderContent();
        },
      },
      onRowClick: (row) => openFeedDrawer(row.id),
      onToggleRowSelect: (row) => {
        if (state.feedState.selectedIds.has(row.id)) {
          state.feedState.selectedIds.delete(row.id);
        } else {
          state.feedState.selectedIds.add(row.id);
        }
        renderContent();
      },
      onToggleAllRows: (checked) => {
        visibleRows.forEach((row) => {
          if (checked) {
            state.feedState.selectedIds.add(row.id);
          } else {
            state.feedState.selectedIds.delete(row.id);
          }
        });
        renderContent();
      },
      onToggleDisclosure: (row) => {
        toggleFeedExpansion(row.id);
        renderContent();
      },
      getExpandedRowMarkup: (row) =>
        row.expanded ? renderFeedProducedFilesMarkup(row) : "",
      allRowsSelected,
      someRowsSelected,
    });
  } else {
    tableSOT.renderFixedTable({
      headEl: gridHeadEl,
      bodyEl: gridBodyEl,
      tableKey: section.id,
      columns: section.columns,
      rows: visibleRows,
      columnVisibility: getSectionVisibleColumnConfig(section),
    });
  }

  if (section.id === "feeds" && state.feedState.rows.length === 0) {
    emptyStateCopyEl.textContent =
      "No feeds configured yet. Create a feed, then subscribe one or more projects so workspace data can be analyzed.";
  } else {
    emptyStateCopyEl.textContent = section.emptyCopy;
  }
  emptyStateEl.classList.toggle("hidden", visibleRows.length > 0);

  loadingStateCopyEl.textContent = section.loadingMessage;
  loadingStateEl.classList.toggle("hidden", !state.loading);

  renderFeedBulkActions(section);
  renderFeedDrawer();
}

function cycleSortMode() {
  const sectionId = state.activeSectionId;
  if (sectionId === "feeds") {
    if (!state.feedState.sort.key) {
      state.feedState.sort = { key: "name", direction: "asc" };
    } else if (state.feedState.sort.direction === "asc") {
      state.feedState.sort.direction = "desc";
    } else {
      state.feedState.sort = { key: "", direction: "asc" };
    }
    renderContent();
    return;
  }

  const currentMode = state.sortModeBySectionId[sectionId] || "default";
  const nextMode =
    currentMode === "default"
      ? "name-asc"
      : currentMode === "name-asc"
        ? "name-desc"
        : "default";

  state.sortModeBySectionId[sectionId] = nextMode;
  renderContent();
}

function beginRefresh() {
  if (state.loading) return;

  state.loading = true;
  renderContent();

  if (loadingTimer) {
    window.clearTimeout(loadingTimer);
  }

  loadingTimer = window.setTimeout(() => {
    state.loading = false;
    renderContent();
    if (state.activeSectionId === "feeds") {
      showToast("Feed status and health refreshed.");
    }
  }, 900);
}

function placeMenuAtAnchor(menuEl, anchorEl) {
  if (!menuEl || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const menuWidth = menuEl.offsetWidth || 0;
  const menuHeight = menuEl.offsetHeight || 0;
  const viewportPadding = 10;
  const menuGap = 6;
  const minLeft = viewportPadding;
  const maxLeft = window.innerWidth - menuWidth - viewportPadding;
  const preferredLeft = rect.right - menuWidth;
  const nextLeft = Math.max(minLeft, Math.min(maxLeft, preferredLeft));
  const preferredTop = rect.bottom + menuGap;
  const aboveTop = rect.top - menuHeight - menuGap;
  const nextTop =
    preferredTop + menuHeight <= window.innerHeight - viewportPadding
      ? preferredTop
      : Math.max(
          viewportPadding,
          aboveTop >= viewportPadding
            ? aboveTop
            : window.innerHeight - menuHeight - viewportPadding,
        );

  menuEl.style.position = "fixed";
  menuEl.style.left = `${nextLeft}px`;
  menuEl.style.top = `${nextTop}px`;
}

function placeFlyoutMenuAtAnchor(menuEl, anchorEl) {
  if (!menuEl || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const menuWidth = menuEl.offsetWidth || 0;
  const menuHeight = menuEl.offsetHeight || 0;
  const viewportPadding = 10;
  const flyoutGap = 6;
  const minLeft = window.scrollX + viewportPadding;
  const maxLeft = window.scrollX + window.innerWidth - menuWidth - viewportPadding;
  const minTop = window.scrollY + viewportPadding;
  const maxTop = window.scrollY + window.innerHeight - menuHeight - viewportPadding;
  let nextLeft = rect.right + window.scrollX + flyoutGap;

  if (nextLeft + menuWidth > window.scrollX + window.innerWidth - viewportPadding) {
    nextLeft = rect.left + window.scrollX - menuWidth - flyoutGap;
  }

  const nextTop = rect.top + window.scrollY - 4;
  menuEl.style.left = `${Math.max(minLeft, Math.min(maxLeft, nextLeft))}px`;
  menuEl.style.top = `${Math.max(minTop, Math.min(maxTop, nextTop))}px`;
}

function clearUserThemeHoverCloseTimer() {
  if (!userThemeHoverCloseTimer) return;
  clearTimeout(userThemeHoverCloseTimer);
  userThemeHoverCloseTimer = null;
}

function closeUserMenus() {
  clearUserThemeHoverCloseTimer();
  userSettingsMenuEl.classList.add("hidden");
  userThemeMenuEl.classList.add("hidden");
  userSettingsButtonEl.classList.remove("active", "is-active");
  userSettingsButtonEl.setAttribute("aria-expanded", "false");
  userThemeTriggerEl.classList.remove("active");
  userThemeTriggerEl.setAttribute("aria-expanded", "false");
}

function openUserThemeSubmenu() {
  if (userSettingsMenuEl.classList.contains("hidden")) return;
  clearUserThemeHoverCloseTimer();
  userThemeMenuEl.classList.remove("hidden");
  userThemeTriggerEl.classList.add("active");
  userThemeTriggerEl.setAttribute("aria-expanded", "true");
  placeFlyoutMenuAtAnchor(userThemeMenuEl, userThemeTriggerEl);
}

function closeUserThemeSubmenu() {
  clearUserThemeHoverCloseTimer();
  userThemeMenuEl.classList.add("hidden");
  userThemeTriggerEl.classList.remove("active");
  userThemeTriggerEl.setAttribute("aria-expanded", "false");
}

function scheduleUserThemeSubmenuClose() {
  clearUserThemeHoverCloseTimer();
  userThemeHoverCloseTimer = window.setTimeout(() => {
    userThemeHoverCloseTimer = null;
    const triggerHovered = userThemeTriggerEl.matches(":hover");
    const menuHovered = userThemeMenuEl.matches(":hover");
    if (triggerHovered || menuHovered) return;
    closeUserThemeSubmenu();
  }, 140);
}

function applyAppTheme(theme) {
  const themeKeys = ["space", "midnight", "cadet"];
  const themeClasses = themeKeys.map((themeKey) => `theme-${themeKey}`);
  const nextTheme = themeKeys.includes(theme) ? theme : "midnight";
  document.body.classList.remove(...themeClasses);
  document.body.classList.add(`theme-${nextTheme}`);

  userThemeMenuEl.querySelectorAll("[data-theme-option]").forEach((optionEl) => {
    optionEl.classList.toggle(
      "active",
      optionEl.getAttribute("data-theme-option") === nextTheme,
    );
  });
}

function bindEvents() {
  toggleSidebarSideEl.addEventListener("click", toggleSidebar);
  toggleSidebarRailEl.addEventListener("click", toggleSidebar);
  closeFeedDrawerEl.addEventListener("click", closeFeedDrawer);

  collapsedFavoriteButtonEl.addEventListener("click", () => {
    state.activeSidebarItemId = "projects";
    state.activeSectionId = "projects";
    render();
  });

  favoriteToggleButtonEl.addEventListener("click", () => {
    state.favoriteProjectsOpen = !state.favoriteProjectsOpen;
    renderFavorites();
  });

  sidebarFilterInputEl.addEventListener("input", (event) => {
    state.sidebarQuery = event.target.value;
    renderNavigation();
    renderFavorites();
  });

  clearSidebarFilterButtonEl.addEventListener("click", () => {
    state.sidebarQuery = "";
    sidebarFilterInputEl.value = "";
    renderNavigation();
    renderFavorites();
  });

  contentSearchInputEl.addEventListener("input", (event) => {
    const section = getActiveSection();
    state.sectionQueryById[section.id] = event.target.value;
    renderContent();
  });

  feedTypeFilterTriggerEl.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFeedFilterMenu("type");
  });

  feedStatusFilterTriggerEl.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFeedFilterMenu("status");
  });

  feedsFiltersEl.addEventListener("click", (event) => {
    const optionEl = event.target.closest("[data-feed-filter-kind]");
    if (!optionEl) return;
    event.stopPropagation();
    const kind = optionEl.getAttribute("data-feed-filter-kind");
    const value = optionEl.getAttribute("data-feed-filter-value") || "all";
    if (kind === "type") {
      state.feedState.filterType = value;
    } else if (kind === "status") {
      state.feedState.filterStatus = value;
    } else {
      return;
    }
    closeFeedFilterMenus();
    renderContent();
  });

  feedsBulkPauseEl.addEventListener("click", () => {
    let changedCount = 0;
    state.feedState.rows.forEach((feed) => {
      if (!state.feedState.selectedIds.has(feed.id)) return;
      if (pauseFeed(feed, "bulk")) {
        changedCount += 1;
      }
    });
    if (changedCount) {
      showToast(`Stopped ${changedCount} feed${changedCount > 1 ? "s" : ""}.`);
    }
    renderContent();
  });

  feedsBulkResumeEl.addEventListener("click", () => {
    let changedCount = 0;
    state.feedState.rows.forEach((feed) => {
      if (!state.feedState.selectedIds.has(feed.id)) return;
      if (resumeFeed(feed, "bulk")) {
        changedCount += 1;
      }
    });
    if (changedCount) {
      showToast(`Started ${changedCount} feed${changedCount > 1 ? "s" : ""}.`);
    }
    renderContent();
  });

  feedsBulkDeleteEl.addEventListener("click", () => {
    const selectedFeedIds = Array.from(state.feedState.selectedIds);
    if (!selectedFeedIds.length) return;
    openFeedDeleteModal(selectedFeedIds);
  });

  tableViewSettingsButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    const section = getActiveSection();
    if (!section.tableViewSettings) return;
    const willOpen = tableViewSettingsMenuEl.classList.contains("hidden");
    closeTableViewSettingsMenu();
    if (!willOpen) return;
    renderTableViewSettingsMenu(section);
    tableViewSettingsMenuEl.classList.remove("hidden");
    tableViewSettingsButtonEl.classList.add("active", "is-active");
    tableViewSettingsButtonEl.setAttribute("aria-expanded", "true");
    placeMenuAtAnchor(tableViewSettingsMenuEl, tableViewSettingsButtonEl);
  });

  tableViewSettingsMenuEl.addEventListener("click", (event) => {
    const columnButtonEl = event.target.closest("[data-table-view-column]");
    if (!columnButtonEl) return;
    event.stopPropagation();
    toggleSectionColumnVisibility(
      state.activeSectionId,
      columnButtonEl.getAttribute("data-table-view-column") || "",
    );
    placeMenuAtAnchor(tableViewSettingsMenuEl, tableViewSettingsButtonEl);
  });

  utilityPrimaryButtonEl.addEventListener("click", beginRefresh);
  utilitySecondaryButtonEl.addEventListener("click", cycleSortMode);

  primaryActionButtonEl.addEventListener("click", () => {
    if (primaryActionButtonEl.disabled) return;
    if (state.activeSectionId === "feeds") {
      openFeedCreateModal();
      return;
    }
    beginRefresh();
  });

  feedDrawerEditEl.addEventListener("click", () => {
    const feed = getFeedById(state.feedState.openFeedId);
    if (!feed) return;
    beginFeedDrawerEdit(feed);
    renderFeedDrawer();
  });

  feedDrawerCancelEl.addEventListener("click", () => {
    cancelFeedDrawerCardEdit();
    renderFeedDrawer();
  });

  feedDrawerSaveEl.addEventListener("click", () => {
    const feed = getFeedById(state.feedState.openFeedId);
    if (!feed) return;
    if (!saveFeedDrawerEdits(feed)) return;
    renderContent();
  });

  feedDrawerMenuEl.addEventListener("click", (event) => {
    event.stopPropagation();
    const feed = getFeedById(state.feedState.openFeedId);
    if (!feed || isFeedDrawerInEditMode()) return;
    const willOpen = feedDrawerActionsMenuEl.classList.contains("hidden");
    closeFeedDrawerActionMenu();
    if (!willOpen) return;
    renderFeedDrawerActionMenu(feed);
    feedDrawerActionsMenuEl.classList.remove("hidden");
    feedDrawerMenuEl.classList.add("active", "is-active");
    feedDrawerMenuEl.setAttribute("aria-expanded", "true");
    placeMenuAtAnchor(feedDrawerActionsMenuEl, feedDrawerMenuEl);
  });

  feedDrawerActionsMenuEl.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-feed-header-action]");
    if (!actionEl) return;
    event.stopPropagation();
    const feed = getFeedById(state.feedState.openFeedId);
    if (!feed) return;
    const action = actionEl.getAttribute("data-feed-header-action");
    closeFeedDrawerActionMenu();
    if (action === "toggle-pause") {
      const paused = feed.status?.tone === "paused";
      const changed = paused ? resumeFeed(feed, "drawer-menu") : pauseFeed(feed, "drawer-menu");
      if (!changed) return;
      showToast(`${feed.name} ${paused ? "started" : "stopped"}.`);
      renderContent();
    }
  });

  feedDrawerBodyEl.addEventListener("click", handleFeedDrawerClick);
  feedDrawerBodyEl.addEventListener("input", handleFeedDrawerChange);
  feedDrawerBodyEl.addEventListener("change", handleFeedDrawerChange);

  feedCreateBodyEl.addEventListener("click", handleFeedCreateBodyClick);
  feedCreateBodyEl.addEventListener("input", handleFeedCreateInput);
  feedCreateBodyEl.addEventListener("change", handleFeedCreateInput);
  gridBodyEl.addEventListener("click", handleGridBodyClick);

  closeFeedCreateModalEl.addEventListener("click", closeFeedCreateModal);
  feedCreateBackEl.addEventListener("click", handleFeedCreateStepBack);
  feedCreateNextEl.addEventListener("click", handleFeedCreateStepForward);
  feedCreateConfirmEl.addEventListener("click", commitFeedCreateFlow);

  closeFeedDeleteModalEl.addEventListener("click", closeFeedDeleteModal);
  feedDeleteCancelEl.addEventListener("click", closeFeedDeleteModal);
  feedDeleteConfirmEl.addEventListener("click", confirmFeedDelete);
  closeDeviceAdminModalEl.addEventListener("click", closeDeviceAdminModal);
  deviceAdminCloseSecondaryEl.addEventListener("click", closeDeviceAdminModal);

  feedCreateModalEl.addEventListener("click", (event) => {
    if (event.target === feedCreateModalEl) {
      closeFeedCreateModal();
    }
  });

  feedDeleteModalEl.addEventListener("click", (event) => {
    if (event.target === feedDeleteModalEl) {
      closeFeedDeleteModal();
    }
  });

  deviceAdminModalEl.addEventListener("click", (event) => {
    if (event.target === deviceAdminModalEl) {
      closeDeviceAdminModal();
    }
  });

  deviceAdminBodyEl.addEventListener("click", (event) => {
    const portSelectButton = event.target.closest("[data-device-port-select]");
    if (!portSelectButton) return;
    state.feedState.deviceAdmin.selectedPortNumber = Number(
      portSelectButton.getAttribute("data-device-port-select") || 0,
    );
    renderDeviceAdminModal();
  });

  userSettingsButtonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = userSettingsMenuEl.classList.contains("hidden");
    closeUserMenus();
    if (!willOpen) return;
    userSettingsMenuEl.classList.remove("hidden");
    userSettingsButtonEl.classList.add("active", "is-active");
    userSettingsButtonEl.setAttribute("aria-expanded", "true");
    placeMenuAtAnchor(userSettingsMenuEl, userSettingsButtonEl);
  });

  userThemeTriggerEl.addEventListener("click", (event) => {
    event.stopPropagation();
    openUserThemeSubmenu();
  });

  userThemeTriggerEl.addEventListener("mouseenter", openUserThemeSubmenu);
  userThemeTriggerEl.addEventListener("mouseleave", scheduleUserThemeSubmenuClose);
  userThemeMenuEl.addEventListener("mouseenter", clearUserThemeHoverCloseTimer);
  userThemeMenuEl.addEventListener("mouseleave", scheduleUserThemeSubmenuClose);

  userThemeMenuEl.addEventListener("click", (event) => {
    const optionEl = event.target.closest("[data-theme-option]");
    if (!optionEl) return;
    event.stopPropagation();
    applyAppTheme(optionEl.getAttribute("data-theme-option"));
  });

  document.addEventListener("mouseover", (event) => {
    const tooltipTarget = event.target.closest("[data-tooltip]");
    if (!tooltipTarget) {
      hideLauncherTooltip();
      return;
    }
    if (tooltipTarget === activeLauncherTooltipTarget) {
      positionLauncherTooltip();
      return;
    }
    showLauncherTooltip(tooltipTarget);
  });

  document.addEventListener("mouseout", (event) => {
    if (!activeLauncherTooltipTarget) return;
    const leavingTarget = event.target.closest("[data-tooltip]");
    if (!leavingTarget || leavingTarget !== activeLauncherTooltipTarget) return;
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget &&
      typeof relatedTarget.closest === "function" &&
      relatedTarget.closest("[data-tooltip]") === activeLauncherTooltipTarget
    ) {
      return;
    }
    hideLauncherTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const tooltipTarget = event.target.closest("[data-tooltip]");
    if (!tooltipTarget) {
      hideLauncherTooltip();
      return;
    }
    showLauncherTooltip(tooltipTarget);
  });

  document.addEventListener("focusout", (event) => {
    if (!activeLauncherTooltipTarget) return;
    const leavingTarget = event.target.closest("[data-tooltip]");
    if (!leavingTarget || leavingTarget !== activeLauncherTooltipTarget) return;
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget &&
      typeof relatedTarget.closest === "function" &&
      relatedTarget.closest("[data-tooltip]") === activeLauncherTooltipTarget
    ) {
      return;
    }
    hideLauncherTooltip();
  });

  document.addEventListener(
    "scroll",
    () => {
      if (!activeLauncherTooltipTarget) return;
      positionLauncherTooltip();
    },
    true,
  );

  window.addEventListener("resize", () => {
    if (userSettingsMenuEl.classList.contains("hidden")) return;
    placeMenuAtAnchor(userSettingsMenuEl, userSettingsButtonEl);
    if (!userThemeMenuEl.classList.contains("hidden")) {
      placeFlyoutMenuAtAnchor(userThemeMenuEl, userThemeTriggerEl);
    }
  });

  window.addEventListener("resize", () => {
    if (feedDrawerActionsMenuEl.classList.contains("hidden")) return;
    placeMenuAtAnchor(feedDrawerActionsMenuEl, feedDrawerMenuEl);
  });

  window.addEventListener("resize", () => {
    if (tableViewSettingsMenuEl.classList.contains("hidden")) return;
    placeMenuAtAnchor(tableViewSettingsMenuEl, tableViewSettingsButtonEl);
  });

  window.addEventListener("resize", () => {
    if (!activeLauncherTooltipTarget) return;
    positionLauncherTooltip();
  });

  document.addEventListener("click", (event) => {
    const withinUserMenu =
      event.target.closest("#userSettingsButton") ||
      event.target.closest("#userSettingsMenu") ||
      event.target.closest("#userThemeMenu");
    if (!withinUserMenu) {
      closeUserMenus();
    }

    const withinFeedDrawerActionsMenu =
      event.target.closest("#feedDrawerMenu") || event.target.closest("#feedDrawerActionsMenu");
    if (!withinFeedDrawerActionsMenu) {
      closeFeedDrawerActionMenu();
    }

    if (!event.target.closest("#feedsFilters")) {
      closeFeedFilterMenus();
    }

    const withinTableViewSettings =
      event.target.closest("#tableViewSettingsButton") ||
      event.target.closest("#tableViewSettingsMenu");
    if (!withinTableViewSettings) {
      closeTableViewSettingsMenu();
    }

    if (!event.target.closest("[data-tooltip]")) {
      hideLauncherTooltip();
    }

    if (
      state.feedState.drawerOpenMenuKey &&
      !event.target.closest(".launcher-feed-drawer")
    ) {
      state.feedState.drawerOpenMenuKey = "";
      renderFeedDrawer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    hideLauncherTooltip();
    if (!feedDrawerActionsMenuEl.classList.contains("hidden")) {
      closeFeedDrawerActionMenu();
      return;
    }
    if (state.feedState.drawerOpenMenuKey) {
      state.feedState.drawerOpenMenuKey = "";
      renderFeedDrawer();
      return;
    }
    if (
      !feedTypeFilterMenuEl.classList.contains("hidden") ||
      !feedStatusFilterMenuEl.classList.contains("hidden")
    ) {
      closeFeedFilterMenus();
      return;
    }
    if (!tableViewSettingsMenuEl.classList.contains("hidden")) {
      closeTableViewSettingsMenu();
      return;
    }
    if (!feedDeleteModalEl.classList.contains("hidden")) {
      closeFeedDeleteModal();
      return;
    }
    if (!deviceAdminModalEl.classList.contains("hidden")) {
      closeDeviceAdminModal();
      return;
    }
    if (!feedCreateModalEl.classList.contains("hidden")) {
      closeFeedCreateModal();
      return;
    }
    if (!feedDrawerShellEl.classList.contains("hidden")) {
      closeFeedDrawer();
      return;
    }
    closeUserMenus();
  });
}

function render() {
  setSidebarCollapsed(state.collapsedSidebar);
  renderNavigation();
  renderFavorites();
  renderFeedCreateModal();
  renderFeedDeleteModal();
  renderDeviceAdminModal();
  renderContent();
}

state.feedState.rows.forEach((feed) => {
  ensureFeedShape(feed);
  updateNoSubscriptionWarning(feed);
});

bindEvents();
applyAppTheme("midnight");
startFeedRateSimulation();
render();
