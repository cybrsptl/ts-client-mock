(function initLauncherTableSOT(global) {
  const COLUMN_WIDTH_STORAGE_KEY = "teleseer.launcher.tableColumnWidths.v1";

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
    "icon_view_settings.svg": "svg-icon-view-settings",
  };

  function loadColumnWidths() {
    try {
      const parsed = JSON.parse(
        global.localStorage?.getItem(COLUMN_WIDTH_STORAGE_KEY) || "{}",
      );
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  const columnWidthsByTable = loadColumnWidths();
  let activeColumnResize = null;

  function persistColumnWidths() {
    try {
      global.localStorage?.setItem(
        COLUMN_WIDTH_STORAGE_KEY,
        JSON.stringify(columnWidthsByTable),
      );
    } catch (error) {
      // Storage may be unavailable in local file contexts; resizing still works in-memory.
    }
  }

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

  function escapeCssIdentifier(value) {
    if (global.CSS && typeof global.CSS.escape === "function") {
      return global.CSS.escape(String(value));
    }
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function resolveStatusBadgeClass(tone) {
    const key = normalizeClassSuffix(tone);
    return STATUS_TONE_TO_BADGE_CLASS[key] || "status-disabled";
  }

  function parseColumnWidth(value, fallback = 96) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "string") return fallback;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getColumnDefaultWidth(column) {
    return parseColumnWidth(column.defaultWidth ?? column.width, 96);
  }

  function getColumnMinWidth(column) {
    return parseColumnWidth(column.minWidth, Math.min(getColumnDefaultWidth(column), 96));
  }

  function getColumnWidth(tableKey, column) {
    const tableWidths = columnWidthsByTable[tableKey] || {};
    const stored = Number(tableWidths[column.key]);
    const min = getColumnMinWidth(column);
    const fallback = getColumnDefaultWidth(column);
    return Math.max(min, Number.isFinite(stored) ? stored : fallback);
  }

  function setColumnWidth(tableKey, columnKey, width) {
    if (!columnWidthsByTable[tableKey]) columnWidthsByTable[tableKey] = {};
    columnWidthsByTable[tableKey][columnKey] = width;
    persistColumnWidths();
  }

  function applyColumnWidth(tableEl, columnKey, width) {
    if (!tableEl) return;
    tableEl
      .querySelectorAll(`col[data-col-key="${escapeCssIdentifier(columnKey)}"]`)
      .forEach((colEl) => {
        colEl.style.width = `${width}px`;
      });
    tableEl
      .querySelectorAll(`[data-col-key="${escapeCssIdentifier(columnKey)}"]`)
      .forEach((cellEl) => {
        cellEl.style.width = `${width}px`;
        cellEl.style.minWidth = `${width}px`;
      });
  }

  function isColumnVisible(column, columnVisibility) {
    if (column.type === "disclosure") return false;
    if (column.hideable === false) return true;
    if (!columnVisibility || typeof columnVisibility !== "object") return true;
    return columnVisibility[column.key] !== false;
  }

  function getDisplayColumns(columns, columnVisibility) {
    return columns.filter((column) => isColumnVisible(column, columnVisibility));
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

    if (options.showSubtext !== false && row.showSubtext !== false && row.subtext) {
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
          showSubtext: column.showSubtext,
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

  function createResizeHandle(tableKey, column, width, tableEl) {
    if (column.resizable === false) return null;
    const handleEl = document.createElement("button");
    handleEl.type = "button";
    handleEl.className = "btn-reset launcher-col-resize-handle";
    handleEl.setAttribute("aria-label", `Resize ${column.label || "column"} column`);
    handleEl.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      activeColumnResize = {
        tableKey,
        columnKey: column.key,
        startX: event.clientX,
        startWidth: width,
        minWidth: getColumnMinWidth(column),
        tableEl,
      };
      document.body.classList.add("launcher-column-resize-active");
      event.currentTarget.closest("th")?.classList.add("is-resizing");
      global.addEventListener("mousemove", onColumnResizeDrag);
      global.addEventListener("mouseup", stopColumnResize);
      event.preventDefault();
      event.stopPropagation();
    });
    handleEl.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    return handleEl;
  }

  function onColumnResizeDrag(event) {
    if (!activeColumnResize) return;
    const { tableKey, columnKey, startX, startWidth, minWidth } = activeColumnResize;
    const nextWidth = Math.max(
      minWidth,
      Math.round(startWidth + (event.clientX - startX)),
    );
    setColumnWidth(tableKey, columnKey, nextWidth);
    applyColumnWidth(activeColumnResize.tableEl, columnKey, nextWidth);
  }

  function stopColumnResize() {
    if (!activeColumnResize) return;
      activeColumnResize.tableEl
      ?.querySelector(`th[data-col-key="${escapeCssIdentifier(activeColumnResize.columnKey)}"]`)
      ?.classList.remove("is-resizing");
    activeColumnResize = null;
    document.body.classList.remove("launcher-column-resize-active");
    global.removeEventListener("mousemove", onColumnResizeDrag);
    global.removeEventListener("mouseup", stopColumnResize);
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
      tableKey = "default",
      columnVisibility = {},
    } = options;

    const displayColumns = getDisplayColumns(columns, columnVisibility);
    const hasDisclosure = columns.some((column) => column.type === "disclosure");
    const tableEl = headEl.closest("table") || bodyEl.closest("table");

    if (tableEl) {
      let colgroupEl = tableEl.querySelector("colgroup");
      if (!colgroupEl) {
        colgroupEl = document.createElement("colgroup");
        tableEl.insertBefore(colgroupEl, headEl);
      } else if (colgroupEl.nextSibling !== headEl) {
        tableEl.insertBefore(colgroupEl, headEl);
      }
      colgroupEl.innerHTML = "";
      displayColumns.forEach((column) => {
        const width = getColumnWidth(tableKey, column);
        const colEl = document.createElement("col");
        colEl.dataset.colKey = column.key;
        colEl.style.width = `${width}px`;
        colgroupEl.appendChild(colEl);
      });
    }

    headEl.innerHTML = "";
    bodyEl.innerHTML = "";

    const headerRowEl = document.createElement("tr");
    displayColumns.forEach((column) => {
      const thEl = document.createElement("th");
      const isSelectColumn = column.type === "select";
      const width = getColumnWidth(tableKey, column);
      thEl.dataset.colKey = column.key;

      thEl.style.width = `${width}px`;
      thEl.style.minWidth = `${width}px`;

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

      const resizeHandleEl = createResizeHandle(tableKey, column, width, tableEl);
      if (resizeHandleEl) {
        thEl.classList.add("is-resizable");
        thEl.appendChild(resizeHandleEl);
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
        const width = getColumnWidth(tableKey, column);
        cellEl.dataset.colKey = column.key;

        cellEl.style.width = `${width}px`;
        cellEl.style.minWidth = `${width}px`;

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
