(function initTeleseerAppData(global) {
  const favoriteProjects = [
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

  const launcherProjectRows = [
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

  const workspaceProjectCatalog = [
    { id: "teleseer-dummy", name: "teleseer-dummy" },
    { id: "site-julio", name: "Site Julio" },
    { id: "hospital-east-wing", name: "Hospital East Wing" },
    { id: "coastal-relay-mirror", name: "Coastal Relay Mirror" },
    { id: "power-plant", name: "Power Plant" },
    { id: "widget-factory", name: "Widget Factory" },
    { id: "military-base", name: "Military Base" },
  ];

  const alertingVariables = [
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

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  global.TeleseerAppData = {
    projects: {
      favorites: clone(favoriteProjects),
      launcherRows: clone(launcherProjectRows),
      catalog: clone(workspaceProjectCatalog),
    },
    alerting: {
      ruleProjectPool: workspaceProjectCatalog.map((project) => project.name),
      variables: clone(alertingVariables),
    },
  };
})(window);
