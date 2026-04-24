function defaultPanelToggles() {
  return {
    network: true,
    hosts: true,
    timeline: true,
    inspector: true,
    artifacts: true,
    dashboard: true,
    world: true,
    flow: true,
    alerts: true,
    cases: false,
    showPanelTabs: true,
  };
}

function defaultActivePanelTabs() {
  return {
    main: "network",
    inspector: "inspector",
    timeline: "timeline",
  };
}

function defaultPanelSizes() {
  return {
    inspectorWidth: 420,
    timelineHeight: 383,
    timelineSidebarWidth: 340,
  };
}

function defaultNotesPanelSize() {
  return {
    width: 392,
    height: 360,
  };
}

function normalizeSnapshot(snapshot) {
  return {
    ...snapshot,
    hostsScope: snapshot.hostsScope || "internal",
    panelSizes: { ...defaultPanelSizes(), ...(snapshot.panelSizes || {}) },
    panelToggles: {
      ...defaultPanelToggles(),
      ...(snapshot.panelToggles || {}),
    },
    activePanelTabs: {
      ...defaultActivePanelTabs(),
      ...(snapshot.activePanelTabs || {}),
    },
    closedPanelTabs: [...new Set(snapshot.closedPanelTabs || [])],
  };
}

function createViewMarkdownTemplate(viewName, snapshot) {
  const tabs = Array.isArray(snapshot.tabs) && snapshot.tabs.length
    ? snapshot.tabs.join(", ")
    : "Summary";
  return [
    `# ${viewName}`,
    "",
    "## Analyst intent",
    `Frame the investigative story for **${
      snapshot.selectionLabel || "the current context"
    }** before handing this view to another operator, a trainer, or a briefing audience.`,
    "",
    "## Saved scope",
    `- Pinned filter: \`${snapshot.pinnedFilter || "none"}\``,
    `- Selection: ${snapshot.selectionLabel || "Current selection"}`,
    `- Panels: ${snapshot.panelVisibility || "Map + Inspector + Timeline"}`,
    `- Tabs: ${tabs}`,
    `- Anchor entity: ${
      snapshot.inspectorEntity || "No anchor entity recorded"
    }`,
    "",
    "> Use this note to explain why the saved state matters, what is still unvalidated, and what the next analyst should inspect first.",
    "",
    "## Talking points",
    "- Record the main anomaly or training takeaway.",
    "- Call out missing evidence, stale feeds, or any partial ingest risk.",
    "- Keep presenter notes tight enough to scan under load.",
  ].join("\n");
}

const initialState = () => ({
  activeViewId: "view-network-triage",
  collapsedSidebar: false,
  sidebarFlyout: {
    open: false,
    hover: false,
    focus: false,
  },
  globalScenarioIndex: 0,
  treeAccordionEphemeral: false,
  panelMenuOpen: false,
  notesPanel: {
    open: false,
    position: null,
    size: defaultNotesPanelSize(),
  },
  views: {
    "view-network-triage": {
      id: "view-network-triage",
      name: "Network Triage",
      parentId: "subfolder-subnets",
      savedSnapshot: {
        layout: "balanced",
        tabs: ["Summary", "Alerts", "Metrics"],
        pinnedFilter: "192.168.2.0/24",
        selectionMode: "subnet",
        selectionLabel: "Subnet 192.168.2.0/24",
        inspectorEntity: "core-edge-17.hula.local",
        hostsScope: "internal",
        timelineZoom: 100,
        panelVisibility: "Map + Inspector + Timeline",
      },
      savedMarkdown: [
        "# Network Triage",
        "",
        "## Purpose",
        "Use this saved view when triaging east-west activity inside `192.168.2.0/24`.",
        "",
        "## Current readout",
        "- Core focus host: `core-edge-17.hula.local`",
        "- Timeline tends to spike after authentication bursts from the engineering VLAN.",
        "- Inspector context should stay on the selected gateway unless a workstation becomes the pivot point.",
        "",
        "## Next analyst steps",
        "- Validate whether outbound TLS from this subnet is expected after 14:21 UTC.",
        "- Compare this view against `DMZ Watch` before escalating.",
        "- If the timeline is stale, confirm feed health before presenting this as evidence.",
      ].join("\n"),
      workingCopy: null,
      hasParkedChanges: false,
    },
    "view-dmz-watch": {
      id: "view-dmz-watch",
      name: "DMZ Watch",
      parentId: "subfolder-subnets",
      savedSnapshot: {
        layout: "balanced",
        tabs: ["Summary", "Flows"],
        pinnedFilter: "10.14.40.0/24",
        selectionMode: "subnet",
        selectionLabel: "Subnet 10.14.40.0/24",
        inspectorEntity: "fw-dmz-gw-01",
        hostsScope: "internal",
        timelineZoom: 110,
        panelVisibility: "Map + Inspector + Timeline",
      },
      savedMarkdown: [
        "# DMZ Watch",
        "",
        "- Keep this view centered on `10.14.40.0/24` for exposed-edge review.",
        "- Watch for repeat connections leaving the DMZ toward internal identity systems.",
        "- Treat any new egress destination as untrusted until confirmed against change control.",
      ].join("\n"),
      workingCopy: null,
      hasParkedChanges: false,
    },
    "view-iot-isolation": {
      id: "view-iot-isolation",
      name: "IoT Isolation",
      parentId: "folder-sample-title",
      savedSnapshot: {
        layout: "dashboard-focus",
        tabs: ["Summary", "Metrics"],
        pinnedFilter: "segment:iot",
        selectionMode: "segment",
        selectionLabel: "Segment IoT Devices",
        inspectorEntity: "iot-switch-05",
        hostsScope: "internal",
        timelineZoom: 95,
        panelVisibility: "Map + Inspector",
      },
      workingCopy: null,
      hasParkedChanges: false,
    },
    "view-banking-core": {
      id: "view-banking-core",
      name: "Bank Core",
      parentId: "folder-sample-title",
      savedSnapshot: {
        layout: "map-only",
        tabs: ["Summary"],
        pinnedFilter: "asset-group:bank-core",
        selectionMode: "asset-group",
        selectionLabel: "Asset Group Bank Core",
        inspectorEntity: "bank-core-agg-02",
        hostsScope: "internal",
        timelineZoom: 130,
        panelVisibility: "Map only",
      },
      workingCopy: null,
      hasParkedChanges: false,
    },
    "view-alerts-review": {
      id: "view-alerts-review",
      name: "Alerts Review",
      parentId: "collection-security",
      savedSnapshot: {
        layout: "balanced",
        tabs: ["Summary", "Alerts"],
        pinnedFilter: "severity:critical",
        selectionMode: "alert-queue",
        selectionLabel: "Critical alerts queue",
        inspectorEntity: "suricata-aggregate",
        hostsScope: "external",
        timelineZoom: 100,
        panelVisibility: "Map + Inspector + Timeline",
      },
      savedMarkdown: [
        "# Alerts Review",
        "",
        "## Queue posture",
        "- This view is tuned for critical alert triage only.",
        "- External hosts are in scope because the queue is usually dominated by remote origins.",
        "",
        "## Handoff note",
        "If this view is used in training, explain why severity alone is not enough and show the linked entity context in Inspector before acting.",
      ].join("\n"),
      workingCopy: null,
      hasParkedChanges: false,
    },
    "view-network-latency": {
      id: "view-network-latency",
      name: "Network Latency",
      parentId: "collection-dashboards",
      savedSnapshot: {
        layout: "dashboard-focus",
        tabs: ["Metrics", "Summary"],
        pinnedFilter: "dashboard:latency",
        selectionMode: "dashboard",
        selectionLabel: "Dashboard Network Latency",
        inspectorEntity: "latency-monitor",
        hostsScope: "internal",
        timelineZoom: 90,
        panelVisibility: "Map + Inspector",
      },
      workingCopy: null,
      hasParkedChanges: false,
    },
  },
  tree: [
    {
      id: "collection-networks",
      type: "collection",
      name: "Networks",
      expanded: true,
      fixed: true,
      children: [
        {
          id: "folder-sample-title",
          type: "folder",
          name: "Sample Title",
          expanded: true,
          children: [
            {
              id: "subfolder-subnets",
              type: "subfolder",
              name: "Subnets",
              expanded: true,
              children: [
                { id: "view-network-triage", type: "view" },
                { id: "view-dmz-watch", type: "view" },
              ],
            },
            { id: "view-iot-isolation", type: "view" },
            { id: "view-banking-core", type: "view" },
          ],
        },
        {
          id: "view-isolated-site",
          type: "view",
          name: "Isolated network site",
          savedSnapshot: {
            layout: "balanced",
            tabs: ["Summary", "Flows", "Artifacts"],
            pinnedFilter: "site:isolated-west",
            selectionMode: "site",
            selectionLabel: "Site Isolated West",
            inspectorEntity: "site-gateway-09",
            hostsScope: "external",
            timelineZoom: 100,
            panelVisibility: "Map + Inspector + Timeline",
          },
          workingCopy: null,
          hasParkedChanges: false,
        },
      ],
    },
    {
      id: "collection-security",
      type: "collection",
      name: "Security",
      expanded: true,
      children: [{ id: "view-alerts-review", type: "view" }],
    },
    {
      id: "collection-operations",
      type: "collection",
      name: "Operations",
      expanded: true,
      children: [],
    },
    {
      id: "collection-dashboards",
      type: "collection",
      name: "Dashboards",
      expanded: true,
      children: [{ id: "view-network-latency", type: "view" }],
    },
  ],
  ephemeral: {
    timelineZoom: 100,
    timelineZoomFactor: 4,
    nestedTreeToggle: false,
  },
  filterQuery: "",
  renameNodeId: null,
  renameValue: "",
  labPanelOpen: false,
});

const HOSTS_TABLES = {
  internal: {
    gridTemplate:
      "250px 167px 117px 134px 118px 118px 93px 118px 118px 145px 172px 230px",
    columns: [
      "Hostname",
      "Address",
      "MAC",
      "OS",
      "Devices",
      "Risk Score",
      "Value Score",
      "Network Score",
      "Value Rank",
      "CVEs",
      "Apps",
      "Tags",
    ],
    rows: [
      {
        hostname: "FG10003G16841141",
        address: "172.16.0.1",
        mac: "00:1c:73:ee:92:b1",
        os: "Linux Linux",
        devices: "Linux Appliance",
        riskScore: "78.9",
        valueScore: "78.9",
        networkScore: "78.9",
        valueRank: "4",
        cves: "CVE-2016-3236",
        apps: "OpenSSH",
        tags: ["VMware Workstation"],
      },
      {
        hostname: "UBUNTU64A",
        address: "192.168.10.2",
        mac: "b8:ac:6f:36:04:a1",
        os: "Linux/Unix 6.1",
        devices: "Workstation",
        riskScore: "97.5",
        valueScore: "97.5",
        networkScore: "97.5",
        valueRank: "5",
        cves: "CVE-2016-3236",
        apps: "Debian APT-HTTP v1.1",
        tags: ["Agent", "Agent", "Agent"],
      },
      {
        hostname: "MITACS-PC4",
        address: "192.168.10.15",
        mac: "00:1e:4f:d4:ca:af",
        os: "Windows 10",
        devices: "Desktop",
        riskScore: "99.1",
        valueScore: "99.1",
        networkScore: "99.1",
        valueRank: "3",
        cves: "CVE-2016-3236",
        apps: "Firefox v54.0",
        tags: ["Public IP", "Web Browser"],
      },
      {
        hostname: "photo-01",
        address: "192.168.10.16",
        mac: "02:03:3e:90:8a:ba",
        os: "Linux/Unix 6.1",
        devices: "Printer Gateway",
        riskScore: "76.5",
        valueScore: "76.5",
        networkScore: "76.5",
        valueRank: "12",
        cves: "CVE-2016-3236",
        apps: "Debian APT-HTTP v1.1",
        tags: ["Agent", "Agent", "Agent"],
      },
      {
        hostname: "UBUNTU14-64",
        address: "192.168.10.17",
        mac: "00:25:90:10:c5:f8",
        os: "Linux/Unix 6.1",
        devices: "Workstation",
        riskScore: "32.7",
        valueScore: "32.7",
        networkScore: "32.7",
        valueRank: "2",
        cves: "none observed",
        apps: "Debian APT-HTTP v1.1",
        tags: ["Vulnerability", "Scan Target"],
      },
      {
        hostname: "UBUNTU14-32",
        address: "192.168.10.19",
        mac: "08:25:00:0a:77:10",
        os: "Linux/Unix 6.1",
        devices: "Workstation",
        riskScore: "85.7",
        valueScore: "85.7",
        networkScore: "85.7",
        valueRank: "1",
        cves: "none observed",
        apps: "Firefox v31.0",
        tags: ["Vulnerable", "Firefox"],
      },
      {
        hostname: "SWIC",
        address: "192.168.10.2",
        mac: "00:0c:66:d1:db:b5",
        os: "Cisco IOS Soft",
        devices: "Cisco WS-C3560",
        riskScore: "67.3",
        valueScore: "67.3",
        networkScore: "67.3",
        valueRank: "9",
        cves: "CFNetwork v43816",
        apps: "CFNetwork v43816",
        tags: [],
      },
      {
        hostname: "CIC-MacBook-Pro.local",
        address: "192.168.10.25",
        mac: "00:25:00:a8:8c:a4",
        os: "Linux/Unix 4.9",
        devices: "Apple Mac",
        riskScore: "88.8",
        valueScore: "88.8",
        networkScore: "88.8",
        valueRank: "6",
        cves: "IE v11.0",
        apps: "IE v11.0",
        tags: [],
      },
      {
        hostname: "DC",
        address: "192.168.10.3",
        mac: "18:66:da:9b:e3:7f",
        os: "Windows 10",
        devices: "Domain Controller",
        riskScore: "23.4",
        valueScore: "23.4",
        networkScore: "23.4",
        valueRank: "7",
        cves: "Firefox v31.0",
        apps: "Firefox v31.0",
        tags: ["Vulnerable"],
      },
      {
        hostname: "CIC-WEBSERVER",
        address: "10.9.19.0:60:00",
        mac: "00:19:b9:0a:69",
        os: "Linux 16.04",
        devices: "Spider Desktop",
        riskScore: "92.8",
        valueScore: "92.8",
        networkScore: "92.8",
        valueRank: "8",
        cves: "Debian APT-HTTP v1.1",
        apps: "Debian APT-HTTP v1.1",
        tags: ["Vulnerability", "Scan Target"],
      },
      {
        hostname: "ubuntu12srv.local",
        address: "192.168.10.51",
        mac: "b8:ac:6f:36:0b:c2",
        os: "Ubuntu",
        devices: "Spider Desktop",
        riskScore: "45.6",
        valueScore: "45.6",
        networkScore: "45.6",
        valueRank: "11",
        cves: "Firefox v31.0",
        apps: "Firefox v31.0",
        tags: ["Public IP", "Web Browser"],
      },
      {
        hostname: "MITACS-PC2",
        address: "192.168.10.8",
        mac: "b8:ac:6f:36:0b:e4",
        os: "Windows Vista",
        devices: "Desktop",
        riskScore: "12.3",
        valueScore: "12.3",
        networkScore: "12.3",
        valueRank: "10",
        cves: "Firefox v31.0",
        apps: "Firefox v31.0",
        tags: ["Firefox", "Web Browser"],
      },
    ],
  },
  external: {
    gridTemplate: "225px 180px 251px 172px 160px 404px 404px",
    columns: [
      "Name",
      "Address",
      "Tags",
      "Context",
      "Type",
      "Assignee",
      "Hop Count",
    ],
    rows: [
      {
        name: "CHINANET Jiangsu",
        address: "222.185.67.42",
        tags: ["GREYNOISE", "Private IP"],
        context: "My Home Office",
        type: "Project Changes",
        assignee: { initials: "RT", name: "Ricky Tan" },
        hopCount: "25",
      },
      {
        name: "time.google.com",
        address: "216.239.35.12",
        tags: ["GREYNOISE"],
        context: "My Home Office",
        type: "IP Address",
        assignee: { initials: "RT", name: "Ricky Tan" },
        hopCount: "25",
      },
      {
        name: "time.google.com",
        address: "216.239.35.8",
        tags: ["Benign Actors"],
        context: "My Home Office",
        type: "IP Address",
        assignee: { initials: "RT", name: "Ricky Tan" },
        hopCount: "25",
      },
      {
        name: "time.google.com",
        address: "216.239.35.4",
        tags: ["Benign Actors"],
        context: "My Home Office",
        type: "IP Address",
        assignee: { initials: "RT", name: "Ricky Tan" },
        hopCount: "25",
      },
      {
        name: "Hurricane Electric Ltd.",
        address: "216.239.35.88",
        tags: ["Benign Actors"],
        context: "My Home Office",
        type: "Data Exports",
        assignee: { initials: "CC", name: "Charlie Crail" },
        hopCount: "25",
      },
      {
        name: "Netminders Server",
        address: "198.144.159.104",
        tags: ["Benign Actors"],
        context: "My Home Office",
        type: "Data Deletion",
        assignee: { initials: "AF", name: "Aubrey Falconer" },
        hopCount: "25",
      },
      {
        name: "Netminders Server",
        address: "198.144.159.68",
        tags: ["Benign Actors"],
        context: "My Home Office",
        type: "Data Deletion",
        assignee: { initials: "AF", name: "Aubrey Falconer" },
        hopCount: "25",
      },
    ],
  },
};

let state = hydrateViews(initialState());
let dragging = null;
let dragPreviewKey = null;
let suppressTreeClickUntil = 0;
let dragGhostEl = null;
let menuAnchorId = null;
let resizeDrag = null;

const treeEl = document.getElementById("tree");
const filterViewsInputEl = document.getElementById("filterViewsInput");
const clearFilterButtonEl = document.getElementById("clearFilterButton");
const currentViewNameEl = document.getElementById("currentViewName");
const snapshotStatusEl = document.getElementById("snapshotStatus");
const dirtyReasonsEl = document.getElementById("dirtyReasons");
const notesStateEl = document.getElementById("notesState");
const ephemeralStateEl = document.getElementById("ephemeralState");
const topbarEl = document.getElementById("topbar");
const chromeSidebarSlotEl = document.getElementById("chromeSidebarSlot");
const sidebarShellEl = document.getElementById("sidebarShell");
const sidebarEl = document.getElementById("viewerSidebar");
const sidebarFlyoutEl = document.getElementById("sidebarFlyout");
const sidebarFlyoutPanelEl = document.getElementById("sidebarFlyoutPanel");
const sidebarFlyoutContentEl = document.getElementById("sidebarFlyoutContent");
const toggleSidebarTopEl = document.getElementById("toggleSidebarTop");
const toggleSidebarSideEl = document.getElementById("toggleSidebarSide");
const labPanelEl = document.getElementById("labPanel");
const labToggleEl = document.getElementById("labToggle");
const labCollapseEl = document.getElementById("labCollapse");
const viewNotesButtonEl = document.getElementById("viewNotesButton");
const panelSettingsButtonEl = document.getElementById("panelSettingsButton");
const activeBadgeEl = document.getElementById("activeViewBadge");
const sessionBadgeEl = document.getElementById("sessionBadge");
const activeCollectionLabelEl = document.getElementById(
  "activeCollectionLabel",
);
const saveMenuButtonEl = document.getElementById("saveMenuButton");
const userSettingsButtonEl = document.getElementById("userSettingsButton");
const logEl = document.getElementById("log");
const contextMenuEl = document.getElementById("contextMenu");
const saveMenuEl = document.getElementById("saveMenu");
const panelMenuEl = document.getElementById("panelMenu");
const viewNotesFloatEl = document.getElementById("viewNotesFloat");
const viewNotesToolbarEl = document.getElementById("viewNotesToolbar");
const viewNotesCloseButtonEl = document.getElementById("viewNotesCloseButton");
const viewNotesMenuButtonEl = document.getElementById("viewNotesMenuButton");
const viewNotesEditorWrapEl = document.getElementById("viewNotesEditorWrap");
const viewNotesEditorEl = document.getElementById("viewNotesEditor");
const viewNotesResizeHandleEl = document.getElementById(
  "viewNotesResizeHandle",
);
const userSettingsMenuEl = document.getElementById("userSettingsMenu");
const userThemeMenuEl = document.getElementById("userThemeMenu");
const userThemeTriggerEl = document.getElementById("userThemeTrigger");
const viewerCanvasEl = document.getElementById("viewerCanvas");
const viewerTopRegionEl = document.getElementById("viewerTopRegion");
const timelineRegionEl = document.querySelector(".timeline-region");
const timelineSurfaceEl = document.querySelector('[data-surface="timeline"]');
const inspectorSurfaceEl = document.querySelector('[data-surface="inspector"]');
const workspaceInspectorResizeHandleEl = document.getElementById(
  "workspaceInspectorResizeHandle",
);
const topTimelineResizeHandleEl = document.getElementById(
  "topTimelineResizeHandle",
);
const timelineSidebarResizeHandleEl = document.getElementById(
  "timelineSidebarResizeHandle",
);
const timelineSidebarListEl = document.getElementById("timelineSidebarList");
const timelineTrackAreaEl = document.getElementById("timelineTrackArea");
const timelineTrackCanvasEl = document.getElementById("timelineTrackCanvas");
const timelineMarqueeEl = document.getElementById("timelineMarquee");
const timelineBoundaryLeftEl = document.getElementById("timelineBoundaryLeft");
const timelineBoundaryRightEl = document.getElementById(
  "timelineBoundaryRight",
);
const timelineBoundaryLeftLabelEl = document.getElementById(
  "timelineBoundaryLeftLabel",
);
const timelineBoundaryRightLabelEl = document.getElementById(
  "timelineBoundaryRightLabel",
);
const timelineSelectionRibbonEl = document.getElementById(
  "timelineSelectionRibbon",
);
const timelineSelectionDurationEl = document.getElementById(
  "timelineSelectionDuration",
);
const timelineSelectionCountEl = document.getElementById(
  "timelineSelectionCount",
);
const timelineSelectionClearButtonEl = document.getElementById(
  "timelineSelectionClearButton",
);
const timelineSelectionExportShellEl = document.getElementById(
  "timelineSelectionExportShell",
);
const timelineSelectionExportButtonEl = document.getElementById(
  "timelineSelectionExportButton",
);
const timelineJumpSelectionShellEl = document.getElementById(
  "timelineSelectionJumpShell",
);
const timelineJumpSelectionButtonEl = document.getElementById(
  "timelineJumpSelectionButton",
);
const timelineRulerTicksEl = document.getElementById("timelineRulerTicks");
const timelineMinimapEl = document.getElementById("timelineMinimap");
const timelineMinimapTrackEl = document.getElementById("timelineMinimapTrack");
const timelineMinimapViewportEl = document.getElementById(
  "timelineMinimapViewport",
);
const timelineMinimapHandleStartEl = document.getElementById(
  "timelineMinimapHandleStart",
);
const timelineMinimapHandleEndEl = document.getElementById(
  "timelineMinimapHandleEnd",
);
const timelineContextMenuEl = document.getElementById("timelineContextMenu");
const timelineExportMenuEl = document.getElementById("timelineExportMenu");
const timelineExportButtonEl = document.getElementById("timelineExportButton");
const timelineExportSelectionScopeEl = document.getElementById(
  "timelineExportSelectionScope",
);
const timelineContextDownloadSizeEl = document.getElementById(
  "timelineContextDownloadSize",
);
const toastEl = document.getElementById("toast");
const hostsTableShellEl = document.getElementById("hostsTableShell");
const alertsTableShellEl = document.getElementById("alertsTableShell");
const workspaceDefaultPanelEl = document.querySelector(
  '[data-workspace-panel="default"]',
);
const workspaceHostsPanelEl = document.querySelector(
  '[data-workspace-panel="hosts"]',
);
const workspaceAlertsPanelEl = document.querySelector(
  '[data-workspace-panel="alerts"]',
);
const alertsManageButtonEl = document.getElementById("alertsManageButton");
const alertsManageModalEl = document.getElementById("alertsManageModal");
const alertsRuleDrawerEl = document.getElementById("alertsRuleDrawer");

const TIMELINE_EVENT_COLORS = [
  "rgba(147, 112, 255, 0.72)",
  "rgba(242, 162, 76, 0.76)",
  "rgba(98, 124, 255, 0.78)",
  "rgba(65, 154, 255, 0.74)",
  "rgba(245, 121, 69, 0.78)",
  "rgba(71, 193, 142, 0.76)",
  "rgba(39, 192, 199, 0.76)",
  "rgba(230, 86, 155, 0.76)",
  "rgba(235, 95, 95, 0.76)",
  "rgba(173, 102, 255, 0.78)",
];

let timelineEvents = [];
let timelineSelection = {
  dragging: false,
  startX: 0,
  startY: 0,
  hasSelection: false,
  selectedIds: [],
  minX: 0,
  maxX: 0,
  exportScope: "all",
};

function hydrateViews(snapshot) {
  Object.values(snapshot.views).forEach((view) => {
    view.savedSnapshot = normalizeSnapshot(view.savedSnapshot);
    view.savedMarkdown = typeof view.savedMarkdown === "string"
      ? view.savedMarkdown
      : "";
    view.sourceKind =
      view.sourceKind === "duplicate" || view.sourceKind === "imported"
        ? view.sourceKind
        : "native";
    view.dataStatus = view.dataStatus === "mismatch" ? "mismatch" : "aligned";
    view.undoStack = Array.isArray(view.undoStack) ? view.undoStack : [];
    view.workingCopy = null;
    view.workingMarkdown = null;
    view.hasParkedChanges = false;
  });
  const treeViews = {};
  walkNodes(snapshot.tree, (node) => {
    if (node.type === "view" && !snapshot.views[node.id]) {
      const savedSnapshot = normalizeSnapshot(node.savedSnapshot);
      treeViews[node.id] = {
        id: node.id,
        name: node.name,
        parentId: null,
        savedSnapshot,
        savedMarkdown: typeof node.savedMarkdown === "string"
          ? node.savedMarkdown
          : "",
        sourceKind:
          node.sourceKind === "duplicate" || node.sourceKind === "imported"
            ? node.sourceKind
            : "native",
        dataStatus: node.dataStatus === "mismatch" ? "mismatch" : "aligned",
        undoStack: Array.isArray(node.undoStack) ? node.undoStack : [],
        workingCopy: null,
        workingMarkdown: null,
        hasParkedChanges: false,
      };
    }
  });
  snapshot.views = { ...snapshot.views, ...treeViews };
  snapshot.notesPanel = {
    open: snapshot.notesPanel?.open || false,
    position: snapshot.notesPanel?.position || null,
    size: {
      ...defaultNotesPanelSize(),
      ...(snapshot.notesPanel?.size || {}),
    },
  };
  syncParentIds(snapshot);
  return snapshot;
}

function syncParentIds(snapshot) {
  walkNodes(snapshot.tree, (node, parent) => {
    if (node.type === "view") {
      snapshot.views[node.id].parentId = parent ? parent.id : null;
    }
  });
}

function walkNodes(nodes, visitor, parent = null, depth = 0) {
  nodes.forEach((node, index) => {
    visitor(node, parent, depth, index);
    if (node.children) {
      walkNodes(node.children, visitor, node, depth + 1);
    }
  });
}

function getNodeById(id, nodes = state.tree, parent = null) {
  for (const node of nodes) {
    if (node.id === id) {
      return { node, parent };
    }
    if (node.children) {
      const found = getNodeById(id, node.children, node);
      if (found) return found;
    }
  }
  return null;
}

function getView(viewId) {
  return state.views[viewId];
}

function getCurrentView() {
  return getView(state.activeViewId);
}

function getEffectiveSnapshot(view) {
  return view.savedSnapshot;
}

function getEffectiveMarkdown(view) {
  return view.savedMarkdown || "";
}

function cloneSnapshot(snapshot) {
  return JSON.parse(JSON.stringify(snapshot));
}

function isViewSnapshotDirty(view) {
  return false;
}

function isViewMarkdownDirty(view) {
  return false;
}

function isViewDirty(view) {
  return hasViewAttention(view);
}

function getDirtyReasons(view) {
  const reasons = [];
  if (view.sourceKind === "duplicate") {
    reasons.push("Derived from another View");
  }
  if (view.sourceKind === "imported" && view.dataStatus === "mismatch") {
    reasons.push("Imported data no longer matches this project");
  }
  return reasons;
}

function ensureWorkingCopy(view) {
  return view.savedSnapshot;
}

function serializeViewState(view) {
  return JSON.stringify({
    name: view.name,
    savedSnapshot: normalizeSnapshot(view.savedSnapshot),
    savedMarkdown: view.savedMarkdown || "",
  });
}

function createUndoEntry(view, group, timestamp = Date.now()) {
  return {
    group,
    timestamp,
    name: view.name,
    savedSnapshot: cloneSnapshot(view.savedSnapshot),
    savedMarkdown: view.savedMarkdown || "",
    serialized: serializeViewState(view),
  };
}

function commitUndoEntry(view, entry, options = {}) {
  const stack = Array.isArray(view.undoStack) ? view.undoStack : [];
  const lastEntry = stack[stack.length - 1];
  const coalesceMs = options.coalesceMs ?? 700;
  if (lastEntry && lastEntry.serialized === entry.serialized) {
    return;
  }
  if (
    lastEntry &&
    lastEntry.group === entry.group &&
    entry.timestamp - lastEntry.timestamp < coalesceMs
  ) {
    return;
  }
  stack.push(entry);
  while (stack.length > 48) {
    stack.shift();
  }
  view.undoStack = stack;
}

function commitViewMutation(mutator, reasonLabel, options = {}) {
  const view = options.view || getCurrentView();
  const previousState = createUndoEntry(view, options.group || "view-edit");
  mutator(view);
  view.savedSnapshot = normalizeSnapshot(view.savedSnapshot);
  view.savedMarkdown = typeof view.savedMarkdown === "string"
    ? view.savedMarkdown
    : "";
  view.workingCopy = null;
  view.workingMarkdown = null;
  view.hasParkedChanges = false;
  const changed = previousState.serialized !== serializeViewState(view);
  if (!changed) {
    if (options.render !== false) render();
    return false;
  }
  commitUndoEntry(view, previousState, options);
  if (reasonLabel) {
    addLog("Autosaved view", reasonLabel);
  }
  if (options.render !== false) {
    render();
  }
  return true;
}

function setDirtyPatch(patch, reasonLabel, options = {}) {
  return commitViewMutation(
    (view) => {
      view.savedSnapshot = {
        ...view.savedSnapshot,
        ...patch,
      };
    },
    reasonLabel,
    { ...options, group: options.group || "view-edit" },
  );
}

function setViewMarkdownDraft(markdown, options = {}) {
  const view = options.view || getCurrentView();
  const nextMarkdown = typeof markdown === "string" ? markdown : "";
  return commitViewMutation(
    (targetView) => {
      targetView.savedMarkdown = nextMarkdown;
    },
    options.reasonLabel,
    {
      ...options,
      view,
      group: options.group || "notes",
      coalesceMs: options.coalesceMs ?? 900,
    },
  );
}

function setPanelSizesPatch(patch, options = {}) {
  return commitViewMutation(
    (view) => {
      view.savedSnapshot = {
        ...view.savedSnapshot,
        panelSizes: {
          ...defaultPanelSizes(),
          ...(view.savedSnapshot.panelSizes || {}),
          ...patch,
        },
      };
    },
    options.reasonLabel,
    {
      ...options,
      group: options.group || "panel-size",
      coalesceMs: options.coalesceMs ?? 900,
    },
  );
}

function undoViewEdit(view = getCurrentView()) {
  if (!view || !Array.isArray(view.undoStack) || !view.undoStack.length) {
    return false;
  }
  const entry = view.undoStack.pop();
  view.name = entry.name;
  view.savedSnapshot = normalizeSnapshot(cloneSnapshot(entry.savedSnapshot));
  view.savedMarkdown = entry.savedMarkdown || "";
  view.workingCopy = null;
  view.workingMarkdown = null;
  view.hasParkedChanges = false;
  addLog(
    "Undo view edit",
    `${view.name} restored to its previous autosaved state.`,
  );
  render();
  return true;
}

function hasViewNotes(view) {
  return Boolean((view.savedMarkdown || "").trim());
}

function hasViewAttention(view) {
  return getDirtyReasons(view).length > 0;
}

function getViewStatusMeta(view) {
  if (view.sourceKind === "imported" && view.dataStatus === "mismatch") {
    return {
      label: "Data mismatch",
      status: "warning",
      detail: "Imported View data no longer matches the current project.",
    };
  }
  if (view.sourceKind === "duplicate") {
    return {
      label: "Duplicate",
      status: "paused",
      detail: "This View was duplicated and may need validation before reuse.",
    };
  }
  return {
    label: "Autosaved",
    status: "ready",
    detail: "Viewer changes save automatically to this View.",
  };
}

function setEphemeralPatch(patch, reasonLabel) {
  Object.assign(state.ephemeral, patch);
  addLog("Ephemeral change", reasonLabel);
  render();
}

function addLog(title, detail) {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  state.globalScenarioIndex += 1;
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML =
    `<strong>${timestamp} · ${title}</strong><div>${detail}</div>`;
  logEl.prepend(entry);
  while (logEl.children.length > 7) {
    logEl.removeChild(logEl.lastChild);
  }
}

function showToast(title, message) {
  toastEl.innerHTML = `<strong>${title}</strong><div>${message}</div>`;
  toastEl.classList.add("visible");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(
    () => toastEl.classList.remove("visible"),
    2200,
  );
}
