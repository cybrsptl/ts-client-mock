(function initLauncherTableSOT(global) {
  const ICON_CLASS_BY_KEY = {
    "icon_arrow_head_down.svg": "launcher-icon-arrow-down",
    "icon_sort_arrows.svg": "launcher-icon-sort-arrows",
    "icon_warning.svg": "launcher-icon-warning",
    "icon_alert.svg": "launcher-icon-alert",
    "icon_project_fill.svg": "launcher-icon-project-fill",
    "icon_demo_mode.svg": "launcher-icon-demo-mode",
    "icon_project_demo.svg": "launcher-icon-project-demo",
    "icon_upload_sidebar.svg": "launcher-icon-upload-sidebar",
    "icon_publish.svg": "launcher-icon-publish",
    "icon_feed.svg": "launcher-icon-feed",
    "icon_sensor.svg": "launcher-icon-sensor",
    "icon_place.svg": "launcher-icon-place",
    "icon_page_filled.svg": "launcher-icon-page-filled",
    "icon_pause.svg": "launcher-icon-pause",
    "icon_play.svg": "launcher-icon-play",
    "icon_download.svg": "launcher-icon-download",
    "icon_arrow_short_down.svg": "launcher-icon-arrow-short-down",
  };

  const STATUS_TONE_TO_BADGE_CLASS = {
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

  function extractIconKey(iconPath) {
    if (typeof iconPath !== "string") return "";
    const match = iconPath.match(/icon_[A-Za-z0-9_-]+\.svg/i);
    return match ? match[0].toLowerCase() : "";
  }

  function createMaskIcon(iconPath, className) {
    const iconEl = document.createElement("span");
    const iconKey = extractIconKey(iconPath);
    const knownClass = ICON_CLASS_BY_KEY[iconKey] || "";
    iconEl.className = ["launcher-svg-icon", className, knownClass]
      .filter(Boolean)
      .join(" ");
    if (knownClass) {
      iconEl.style.removeProperty("--icon-url");
    } else {
      iconEl.style.setProperty("--icon-url", `url("${iconPath}")`);
    }
    iconEl.setAttribute("aria-hidden", "true");
    return iconEl;
  }

  function normalizeClassSuffix(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  }

  function resolveStatusBadgeClass(tone) {
    const key = normalizeClassSuffix(tone);
    return STATUS_TONE_TO_BADGE_CLASS[key] || "status-disabled";
  }

  function createDisclosureButton(row, onToggleDisclosure) {
    if (typeof onToggleDisclosure !== "function") return null;

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.className = [
      "btn-reset",
      "launcher-cell-control",
      "launcher-disclosure-button",
      "launcher-name-disclosure",
      row.expanded ? "is-expanded" : "",
    ]
      .filter(Boolean)
      .join(" ");
    buttonEl.setAttribute("aria-label", `Toggle ${row.name || "row"} details`);
    buttonEl.setAttribute("aria-expanded", row.expanded ? "true" : "false");
    buttonEl.appendChild(createMaskIcon("../icons/icon_arrow_head_down.svg"));
    buttonEl.addEventListener("click", (event) => {
      event.stopPropagation();
      onToggleDisclosure(row);
    });
    return buttonEl;
  }

  function createNameCellContent(cellEl, row, options = {}) {
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-name-cell";

    const disclosureButtonEl = options.includeDisclosure
      ? createDisclosureButton(row, options.onToggleDisclosure)
      : null;
    if (disclosureButtonEl) {
      shellEl.appendChild(disclosureButtonEl);
    }

    if (row.type === "Napatech") {
      const logoEl = document.createElement("img");
      logoEl.className = "launcher-name-logo";
      logoEl.src = "../icons/integration/general/integration_colored_napatech.svg";
      logoEl.alt = "";
      logoEl.setAttribute("aria-hidden", "true");
      shellEl.appendChild(logoEl);
    } else {
      const iconPath = row.icon || "../icons/icon_page_filled.svg";
      shellEl.appendChild(createMaskIcon(iconPath, "launcher-name-icon"));
    }

    const stackEl = document.createElement("span");
    stackEl.className = "launcher-name-stack";

    if (row.viewerLink) {
      const linkEl = document.createElement("a");
      linkEl.className = "launcher-link launcher-name-text";
      linkEl.href = row.viewerLink;
      linkEl.textContent = row.name;
      stackEl.appendChild(linkEl);
    } else {
      const nameEl = document.createElement("span");
      nameEl.className = "launcher-name-text";
      nameEl.textContent = row.name;
      stackEl.appendChild(nameEl);
    }

    if (row.showSubtext !== false && row.subtext) {
      const subtextEl = document.createElement("span");
      subtextEl.className = "launcher-subtext";
      subtextEl.textContent = row.subtext;
      stackEl.appendChild(subtextEl);
    }

    shellEl.appendChild(stackEl);
    cellEl.appendChild(shellEl);
  }

  function createStatusCellContent(cellEl, status) {
    const value =
      status && typeof status === "object"
        ? status
        : { tone: status, label: String(status || "Unknown") };

    const shellEl = document.createElement("span");
    shellEl.className = "launcher-status-cell";

    if (value.mode === "rate") {
      const rateEl = document.createElement("span");
      rateEl.className = "launcher-rate-badge";
      rateEl.appendChild(createMaskIcon("../icons/icon_arrow_short_down.svg"));

      const labelEl = document.createElement("span");
      labelEl.className = "launcher-rate-badge-label";
      labelEl.textContent = value.label || "0 MB/s";
      rateEl.appendChild(labelEl);

      shellEl.appendChild(rateEl);
      cellEl.appendChild(shellEl);
      return;
    }

    const statusEl = document.createElement("span");
    statusEl.className = [
      "status-badge",
      resolveStatusBadgeClass(value.tone || value.label),
    ].join(" ");

    const iconEl = document.createElement("span");
    iconEl.className = "status-badge-icon";
    iconEl.setAttribute("aria-hidden", "true");
    statusEl.appendChild(iconEl);

    const labelEl = document.createElement("span");
    labelEl.className = "status-badge-label";
    labelEl.textContent = value.label || "-";
    statusEl.appendChild(labelEl);
    shellEl.appendChild(statusEl);

    cellEl.appendChild(shellEl);
  }

  function createFeedTypeCellContent(cellEl, row) {
    const typeLabel = String(row.type || "-");
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-feed-type-text";

    const textEl = document.createElement("span");
    textEl.textContent = typeLabel;
    shellEl.appendChild(textEl);
    cellEl.appendChild(shellEl);
  }

  function createTagsCellContent(cellEl, tags) {
    const listEl = document.createElement("span");
    listEl.className = "launcher-tag-list";

    (tags || []).forEach((tag) => {
      const tagEl = document.createElement("span");
      const tone = typeof tag === "object" ? tag.tone : "";
      const label = typeof tag === "object" ? tag.label : String(tag);
      tagEl.className = ["launcher-tag", tone].filter(Boolean).join(" ");
      tagEl.textContent = label;
      listEl.appendChild(tagEl);
    });

    cellEl.appendChild(listEl);
  }

  function createProjectsCellContent(cellEl, value) {
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-project-link";

    const textEl = document.createElement("span");
    textEl.textContent = value || "0 Projects";
    shellEl.appendChild(textEl);

    shellEl.appendChild(createMaskIcon("../icons/icon_arrow_head_down.svg"));

    cellEl.appendChild(shellEl);
  }

  function createFeedHealthCellContent(cellEl, row) {
    const score = Number(row.healthScore ?? 0);
    const tone = score >= 90 ? "healthy" : score >= 70 ? "degraded" : "critical";
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-feed-health";

    const labelEl = document.createElement("span");
    labelEl.className = "launcher-feed-health-label";
    labelEl.textContent = `${score}%`;

    const meterEl = document.createElement("span");
    meterEl.className = `launcher-health-meter launcher-health-meter--table is-${tone}`;

    const fillEl = document.createElement("span");
    fillEl.className = "launcher-health-meter-fill";
    fillEl.style.width = `${Math.max(0, Math.min(100, score))}%`;
    meterEl.appendChild(fillEl);

    shellEl.appendChild(labelEl);
    shellEl.appendChild(meterEl);
    cellEl.appendChild(shellEl);
  }

  function createFeedSparklineCellContent(cellEl, row) {
    const values = Array.isArray(row.ingestSparkline) ? row.ingestSparkline : [];
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-feed-sparkline";

    if (!values.length) {
      shellEl.textContent = "-";
      cellEl.appendChild(shellEl);
      return;
    }

    const maxValue = Math.max(...values, 1);
    values.forEach((value) => {
      const barEl = document.createElement("span");
      barEl.className = "launcher-feed-sparkline-bar";
      const scaled = Math.round((Number(value || 0) / maxValue) * 18);
      barEl.style.height = `${Math.max(3, scaled)}px`;
      shellEl.appendChild(barEl);
    });

    cellEl.appendChild(shellEl);
  }

  function createFeedSubscriptionCellContent(cellEl, row) {
    const projects = Array.isArray(row.subscribedProjects)
      ? row.subscribedProjects
          .map((project) =>
            typeof project === "string" ? project : String(project?.name || "").trim(),
          )
          .filter(Boolean)
      : [];
    const shellEl = document.createElement("button");
    shellEl.type = "button";
    shellEl.className = "btn-reset launcher-feed-project-pill";
    shellEl.textContent = `${projects.length} ${projects.length === 1 ? "Project" : "Projects"}`;
    if (projects.length) {
      const tooltip = projects.join(", ");
      shellEl.dataset.tooltip = tooltip;
    } else {
      shellEl.disabled = true;
      shellEl.classList.add("is-empty");
    }
    cellEl.appendChild(shellEl);
  }

  function createFeedActivityCellContent(cellEl, row) {
    const shellEl = document.createElement("span");
    const isStale = Boolean(row.staleWarning);
    shellEl.className = [
      "launcher-feed-activity",
      isStale ? "is-stale" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.className = "btn-reset btn-tertiary btn-tertiary--info launcher-feed-activity-link";
    buttonEl.textContent = row.lastActivity || "-";
    if (row.activityTooltip) {
      buttonEl.dataset.tooltip = row.activityTooltip;
    }
    shellEl.appendChild(buttonEl);

    if (isStale) {
      const iconEl = document.createElement("span");
      iconEl.className = "launcher-svg-icon";
      iconEl.setAttribute("aria-label", "Delayed — no recent activity");
      iconEl.setAttribute("title", "Delayed — no recent activity");
      shellEl.appendChild(iconEl);
    }

    cellEl.appendChild(shellEl);
  }

  function createSelectCellContent(cellEl, config) {
    const { checked = false, mixed = false, onToggle, label = "Toggle row" } =
      config || {};
    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.className = "btn-reset launcher-cell-control launcher-checkbox-toggle";
    buttonEl.setAttribute("aria-label", label);

    const boxEl = document.createElement("span");
    boxEl.className = [
      "sot-checkbox",
      checked ? "is-checked" : "",
      mixed ? "is-mixed" : "",
    ]
      .filter(Boolean)
      .join(" ");
    buttonEl.appendChild(boxEl);

    if (typeof onToggle === "function") {
      buttonEl.addEventListener("click", (event) => {
        event.stopPropagation();
        onToggle();
      });
    }

    cellEl.appendChild(buttonEl);
  }

  function createFeedFileCountCellContent(cellEl, row) {
    const shellEl = document.createElement("span");
    shellEl.className = "launcher-feed-file-count";

    const totalEl = document.createElement("span");
    totalEl.className = "launcher-feed-file-count-value";
    totalEl.textContent = String(Number(row.fileCount || 0));
    shellEl.appendChild(totalEl);

    cellEl.appendChild(shellEl);
  }

  function createFeedIssuesCellContent(cellEl, row) {
    const errorCount = Number(row.fileErrorCount || 0);
    const warningCount = Number(row.fileWarningCount || 0);

    const shellEl = document.createElement("span");
    shellEl.className = "launcher-feed-issues";

    const errorEl = document.createElement("span");
    errorEl.className = "launcher-feed-issues-value is-error";
    errorEl.textContent = `${errorCount}E`;
    shellEl.appendChild(errorEl);

    const separatorEl = document.createElement("span");
    separatorEl.className = "launcher-feed-issues-separator";
    separatorEl.textContent = "·";
    shellEl.appendChild(separatorEl);

    const warningEl = document.createElement("span");
    warningEl.className = "launcher-feed-issues-value is-warning";
    warningEl.textContent = `${warningCount}W`;
    shellEl.appendChild(warningEl);

    cellEl.appendChild(shellEl);
  }

  function populateCell(cellEl, column, row, options) {
    const callbacks = options || {};

    switch (column.type) {
      case "select": {
        createSelectCellContent(cellEl, {
          checked: !!row.selected,
          onToggle: () => {
            if (typeof callbacks.onToggleRowSelect === "function") {
              callbacks.onToggleRowSelect(row);
            }
          },
          label: `Select ${row.name || "row"}`,
        });
        return;
      }
      case "name":
        createNameCellContent(cellEl, row, {
          includeDisclosure: !!callbacks.hasDisclosure,
          onToggleDisclosure: callbacks.onToggleDisclosure,
        });
        return;
      case "pill": {
        const value = String(row[column.key] || "");
        const pillEl = document.createElement("span");
        pillEl.className = ["launcher-pill", normalizeClassSuffix(value)]
          .filter(Boolean)
          .join(" ");
        pillEl.textContent = value;
        cellEl.appendChild(pillEl);
        return;
      }
      case "feed-type":
        createFeedTypeCellContent(cellEl, row);
        return;
      case "mono": {
        const monoEl = document.createElement("span");
        monoEl.className = "launcher-mono";
        monoEl.textContent = String(row[column.key] || "-");
        cellEl.appendChild(monoEl);
        return;
      }
      case "status":
        createStatusCellContent(cellEl, row.status);
        return;
      case "tags":
        createTagsCellContent(cellEl, row.tags);
        return;
      case "projects":
        createProjectsCellContent(cellEl, row[column.key]);
        return;
      case "feed-health":
        createFeedHealthCellContent(cellEl, row);
        return;
      case "feed-file-count":
        createFeedFileCountCellContent(cellEl, row);
        return;
      case "feed-issues":
        createFeedIssuesCellContent(cellEl, row);
        return;
      case "feed-sparkline":
        createFeedSparklineCellContent(cellEl, row);
        return;
      case "feed-subscriptions":
        createFeedSubscriptionCellContent(cellEl, row);
        return;
      case "feed-activity":
        createFeedActivityCellContent(cellEl, row);
        return;
      case "disclosure": {
        return;
      }
      default:
        cellEl.textContent = String(row[column.key] ?? "-");
    }
  }

  function renderHeaderCell(thEl, column, options) {
    const sort = options?.sort;
    const canSort = !!(column.sortable && sort && typeof sort.onSort === "function");

    if (!canSort) {
      thEl.textContent = column.label;
      return;
    }

    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.className = "btn-reset launcher-th-button";

    const labelEl = document.createElement("span");
    labelEl.className = "launcher-th-label";
    labelEl.textContent = column.label;
    buttonEl.appendChild(labelEl);

    const iconEl = createMaskIcon("../icons/icon_sort_arrows.svg", "launcher-th-sort-icon");
    buttonEl.appendChild(iconEl);

    const isActive = sort.key === column.key;
    buttonEl.classList.toggle("active", isActive);
    buttonEl.dataset.direction = isActive ? sort.direction || "asc" : "none";

    buttonEl.addEventListener("click", () => {
      sort.onSort(column.key);
    });

    thEl.appendChild(buttonEl);
  }

  function renderFixedTable(options) {
    const {
      headEl,
      bodyEl,
      columns,
      rows,
      sort,
      onRowClick,
      onToggleRowSelect,
      onToggleAllRows,
      onToggleDisclosure,
      getExpandedRowMarkup,
      allRowsSelected = false,
      someRowsSelected = false,
    } = options;

    const displayColumns = columns.filter((column) => column.type !== "disclosure");
    const hasDisclosure = displayColumns.length !== columns.length;

    headEl.innerHTML = "";
    bodyEl.innerHTML = "";

    const headerRowEl = document.createElement("tr");
    displayColumns.forEach((column) => {
      const thEl = document.createElement("th");
      const isSelectColumn = column.type === "select";
      const selectCellWidth = "28px";

      if (isSelectColumn) {
        thEl.style.width = selectCellWidth;
        thEl.style.minWidth = selectCellWidth;
        thEl.style.padding = "0 4px";
      } else if (column.width) {
        thEl.style.width = column.width;
        thEl.style.minWidth = column.width;
      }

      if (column.align) {
        thEl.style.textAlign = column.align;
      }

      if (isSelectColumn) {
        createSelectCellContent(thEl, {
          checked: allRowsSelected,
          mixed: someRowsSelected,
          onToggle: () => {
            if (typeof onToggleAllRows === "function") {
              onToggleAllRows(!allRowsSelected || someRowsSelected);
            }
          },
          label: "Select all rows",
        });
      } else {
        renderHeaderCell(thEl, column, { sort });
      }

      headerRowEl.appendChild(thEl);
    });
    headEl.appendChild(headerRowEl);

    rows.forEach((row) => {
      const rowEl = document.createElement("tr");
      if (row.selected) rowEl.classList.add("selected");
      if (typeof onRowClick === "function") {
        rowEl.classList.add("clickable");
      }

      displayColumns.forEach((column) => {
        const cellEl = document.createElement("td");
        const isSelectColumn = column.type === "select";
        const selectCellWidth = "28px";

        if (isSelectColumn) {
          cellEl.style.width = selectCellWidth;
          cellEl.style.minWidth = selectCellWidth;
          cellEl.style.padding = "0 4px";
        } else if (column.width) {
          cellEl.style.width = column.width;
          cellEl.style.minWidth = column.width;
        }

        if (column.align) {
          cellEl.style.textAlign = column.align;
        }

        populateCell(cellEl, column, row, {
          onToggleRowSelect,
          onToggleDisclosure,
          hasDisclosure,
        });
        rowEl.appendChild(cellEl);
      });

      if (typeof onRowClick === "function") {
        rowEl.addEventListener("click", (event) => {
          if (event.target.closest(".launcher-cell-control")) return;
          onRowClick(row);
        });
      }

      bodyEl.appendChild(rowEl);

      if (typeof getExpandedRowMarkup === "function") {
        const expandedMarkup = getExpandedRowMarkup(row);
        if (expandedMarkup) {
          const expandedRowEl = document.createElement("tr");
          expandedRowEl.className = "launcher-expanded-row";

          const expandedCellEl = document.createElement("td");
          expandedCellEl.colSpan = displayColumns.length;
          expandedCellEl.className = "launcher-expanded-cell";
          expandedCellEl.innerHTML = expandedMarkup;

          expandedRowEl.appendChild(expandedCellEl);
          bodyEl.appendChild(expandedRowEl);
        }
      }
    });
  }

  global.LauncherTableSOT = {
    renderFixedTable,
  };
})(window);
