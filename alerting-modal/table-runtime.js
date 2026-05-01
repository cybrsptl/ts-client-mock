/* Alerting modal table runtime. */

const TABLE_COLUMN_LAYOUTS = {
  suricata: [
    {
      key: "select",
      label: "",
      thClass: "col-select",
      minWidth: 40,
      defaultWidth: 40,
      resizable: false,
    },
    {
      key: "led",
      label: "",
      thClass: "col-led",
      minWidth: 40,
      defaultWidth: 40,
      resizable: false,
    },
    {
      key: "sid",
      label: "SID",
      thClass: "col-sid",
      minWidth: 84,
      defaultWidth: 88,
    },
    {
      key: "action",
      label: "Action",
      thClass: "col-action",
      minWidth: 72,
      defaultWidth: 80,
    },
    {
      key: "name",
      label: "Name",
      thClass: "col-name",
      minWidth: 300,
      defaultWidth: 340,
    },
    {
      key: "class",
      label: "Class",
      thClass: "col-class",
      minWidth: 138,
      defaultWidth: 146,
    },
    {
      key: "speed",
      label: "Speed",
      thClass: "col-speed",
      minWidth: 72,
      defaultWidth: 80,
    },
    {
      key: "lastSeen",
      label: "Last Hit",
      thClass: "col-last-seen",
      minWidth: 92,
      defaultWidth: 96,
    },
    {
      key: "hits",
      label: "Hits",
      thClass: "col-hits",
      minWidth: 72,
      defaultWidth: 72,
    },
    {
      key: "created",
      label: "Created",
      thClass: "col-created",
      minWidth: 132,
      defaultWidth: 144,
    },
    {
      key: "updated",
      label: "Updated",
      thClass: "col-updated",
      minWidth: 132,
      defaultWidth: 144,
    },
    {
      key: "status",
      label: "Status",
      thClass: "col-status",
      minWidth: 220,
      defaultWidth: 232,
    },
  ],
  defaultAlerts: [
    {
      key: "name",
      label: "Name",
      thClass: "col-name",
      minWidth: 320,
      defaultWidth: 500,
    },
    {
      key: "projects",
      label: "Projects",
      thClass: "col-projects",
      minWidth: 136,
      defaultWidth: 148,
    },
    {
      key: "total",
      label: "Total Hits",
      thClass: "col-total",
      minWidth: 96,
      defaultWidth: 105,
    },
    {
      key: "status",
      label: "Status",
      thClass: "col-status",
      minWidth: 160,
      defaultWidth: 196,
    },
  ],
  variables: [
    {
      key: "varName",
      label: "Name",
      thClass: "col-var-name",
      minWidth: 220,
      defaultWidth: 280,
    },
    {
      key: "varType",
      label: "Type",
      thClass: "col-var-type",
      minWidth: 92,
      defaultWidth: 104,
    },
    {
      key: "varValues",
      label: "Values",
      thClass: "col-var-values",
      minWidth: 180,
      defaultWidth: 204,
    },
    {
      key: "varUsedBy",
      label: "Used By",
      thClass: "col-var-usedby",
      minWidth: 140,
      defaultWidth: 152,
    },
    {
      key: "varReferencedBy",
      label: "Referenced By",
      thClass: "col-var-referenced-by",
      minWidth: 160,
      defaultWidth: 176,
    },
    {
      key: "varProjects",
      label: "Projects",
      thClass: "col-var-projects",
      minWidth: 104,
      defaultWidth: 116,
    },
    {
      key: "varCreated",
      label: "Created",
      thClass: "col-var-created",
      minWidth: 132,
      defaultWidth: 144,
    },
    {
      key: "varUpdated",
      label: "Updated",
      thClass: "col-var-updated",
      minWidth: 132,
      defaultWidth: 144,
    },
    {
      key: "varActions",
      label: "",
      thClass: "col-var-actions",
      minWidth: 52,
      defaultWidth: 52,
      resizable: false,
      editOnly: true,
    },
  ],
};
const tableColumnWidths = {
  suricata: {},
  defaultAlerts: {},
  variables: {},
};
let activeTableLayoutKey = "";
let activeTableColumns = [];
let activeColumnResize = null;

function getTableLayoutColumns(layoutKey) {
  const columns = TABLE_COLUMN_LAYOUTS[layoutKey] || [];
  return columns.filter((column) => {
    if (column.editOnly && !ruleVariablesEditMode) return false;
    if (
      layoutKey === "suricata" &&
      typeof window.isSuricataColumnVisible === "function" &&
      !window.isSuricataColumnVisible(column.key)
    ) {
      return false;
    }
    return true;
  });
}

function ensureTableColumnWidths(layoutKey, columns) {
  if (!tableColumnWidths[layoutKey]) tableColumnWidths[layoutKey] = {};
  const widthState = tableColumnWidths[layoutKey];
  const nextKeys = new Set();
  columns.forEach((column) => {
    nextKeys.add(column.key);
    const min = Number(column.minWidth) || 72;
    const fallback = Number(column.defaultWidth) || min;
    const current = Number(widthState[column.key]);
    widthState[column.key] = Number.isFinite(current)
      ? Math.max(min, current)
      : Math.max(min, fallback);
  });
  Object.keys(widthState).forEach((key) => {
    if (!nextKeys.has(key)) delete widthState[key];
  });
  return widthState;
}

function renderTableHeaderRow(layoutKey, columns) {
  const headerCells = columns
    .map((column) => {
      const canResize = column.resizable !== false;
      const label = column.label ? escapeHtml(column.label) : "";
      const cellClass =
        layoutKey === "suricata" && column.key === "select"
          ? `${column.thClass} col-select-combo`
          : layoutKey === "suricata" && column.key === "led"
            ? `${column.thClass} col-led-combo`
            : column.thClass;
      const customHeaderMarkup =
        layoutKey === "suricata" &&
        column.key === "select" &&
        typeof window.renderSuricataHeaderSelectionControl === "function"
          ? window.renderSuricataHeaderSelectionControl()
          : "";
      const resizeHandle = canResize
        ? `<button type="button" class="col-resize-handle" aria-label="Resize ${label || "column"} column" onmousedown="startColumnResize(event, '${layoutKey}', '${column.key}')"></button>`
        : "";
      const contentMarkup = customHeaderMarkup
        ? customHeaderMarkup
        : `<span class="col-header-label">${label}</span>`;
      return `<th class="${cellClass}${canResize ? " is-resizable" : ""}" data-layout="${layoutKey}" data-col-key="${column.key}">${contentMarkup}${resizeHandle}</th>`;
    })
    .join("");
  return `<tr>${headerCells}</tr>`;
}

function applyTableColumnLayout(layoutKey, columns) {
  const headTable = document.getElementById("rulesTableHeadTable");
  const bodyTable = document.getElementById("rulesTableBodyTable");
  const headColgroup = document.getElementById("rulesTableHeadColgroup");
  const bodyColgroup = document.getElementById("rulesTableBodyColgroup");
  if (!headTable || !bodyTable || !headColgroup || !bodyColgroup) return;
  const widthState = ensureTableColumnWidths(layoutKey, columns);
  const colMarkup = columns
    .map((column) => {
      const min = Number(column.minWidth) || 72;
      const width = Number(widthState[column.key]) || min;
      return `<col data-col-key="${column.key}" style="width:${width}px;min-width:${min}px;" />`;
    })
    .join("");
  headColgroup.innerHTML = colMarkup;
  bodyColgroup.innerHTML = colMarkup;
  activeTableLayoutKey = layoutKey;
  activeTableColumns = columns.map((column) => ({ ...column }));
  syncRulesTableWidth();
}

function syncRulesTableWidth() {
  const headTable = document.getElementById("rulesTableHeadTable");
  const bodyTable = document.getElementById("rulesTableBodyTable");
  const headerContainer = document.getElementById("rulesTableHeaderContainer");
  const container = document.getElementById("rulesTableBodyContainer");
  if (
    !headTable ||
    !bodyTable ||
    !headerContainer ||
    !container ||
    !activeTableLayoutKey ||
    !activeTableColumns.length
  )
    return;
  const widthState = tableColumnWidths[activeTableLayoutKey] || {};
  const total = activeTableColumns.reduce((sum, column) => {
    const min = Number(column.minWidth) || 72;
    const width =
      Number(widthState[column.key]) || Number(column.defaultWidth) || min;
    return sum + Math.max(min, width);
  }, 0);
  const nextWidth = total > container.clientWidth ? `${total}px` : "100%";
  headTable.style.width = nextWidth;
  bodyTable.style.width = nextWidth;
  syncTableHeaderScroll();
}

function startColumnResize(event, layoutKey, columnKey) {
  if (event.button !== 0) return;
  const columns =
    activeTableLayoutKey === layoutKey && activeTableColumns.length
      ? activeTableColumns
      : getTableLayoutColumns(layoutKey);
  const column = columns.find((item) => item.key === columnKey);
  if (!column || column.resizable === false) return;
  const widthState = ensureTableColumnWidths(layoutKey, columns);
  activeColumnResize = {
    layoutKey,
    columnKey,
    startX: event.clientX,
    startWidth:
      Number(widthState[columnKey]) || Number(column.defaultWidth) || 72,
    minWidth: Number(column.minWidth) || 72,
  };
  const th = document.querySelector(
    `.rules-table-head th[data-layout="${layoutKey}"][data-col-key="${columnKey}"]`,
  );
  th?.classList.add("is-resizing");
  document.body.classList.add("column-resize-active");
  window.addEventListener("mousemove", onColumnResizeDrag);
  window.addEventListener("mouseup", stopColumnResize);
  event.preventDefault();
}

function onColumnResizeDrag(event) {
  if (!activeColumnResize) return;
  const { layoutKey, columnKey, startX, startWidth, minWidth } =
    activeColumnResize;
  const nextWidth = Math.max(
    minWidth,
    Math.round(startWidth + (event.clientX - startX)),
  );
  if (!tableColumnWidths[layoutKey]) tableColumnWidths[layoutKey] = {};
  tableColumnWidths[layoutKey][columnKey] = nextWidth;
  document.querySelectorAll(
    `#rulesTableHeadColgroup col[data-col-key="${columnKey}"], #rulesTableBodyColgroup col[data-col-key="${columnKey}"]`,
  ).forEach((colElement) => {
    colElement.style.width = `${nextWidth}px`;
  });
  syncRulesTableWidth();
  applyTableRowHeights();
}

function stopColumnResize() {
  if (!activeColumnResize) return;
  const { layoutKey, columnKey } = activeColumnResize;
  const th = document.querySelector(
    `.rules-table-head th[data-layout="${layoutKey}"][data-col-key="${columnKey}"]`,
  );
  th?.classList.remove("is-resizing");
  activeColumnResize = null;
  document.body.classList.remove("column-resize-active");
  window.removeEventListener("mousemove", onColumnResizeDrag);
  window.removeEventListener("mouseup", stopColumnResize);
  applyTableRowHeights();
}

function getVisibleLineCount(element) {
  if (!element) return 0;
  const style = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(style.lineHeight);
  if (!Number.isFinite(lineHeight) || lineHeight <= 0) return 1;
  return Math.max(
    1,
    Math.round(element.getBoundingClientRect().height / lineHeight),
  );
}

function clampTableRowLineCount(lineCount) {
  return Math.max(1, Math.min(3, Math.round(lineCount || 1)));
}

function getTableRowLineCount(row) {
  const defaultStack = row.querySelector(".default-name-stack");
  if (defaultStack) {
    const titleLines = getVisibleLineCount(
      defaultStack.querySelector(".rule-name"),
    );
    const descriptionLines = getVisibleLineCount(
      defaultStack.querySelector(".default-rule-description"),
    );
    return clampTableRowLineCount(titleLines + descriptionLines);
  }

  const nameLines = getVisibleLineCount(
    row.querySelector(".rule-name, .variable-name"),
  );
  return clampTableRowLineCount(nameLines);
}

function applyTableRowHeights() {
  const rows = document.querySelectorAll(".rules-table-body tbody tr");
  rows.forEach((row) => {
    row.classList.remove("row-lines-1", "row-lines-2", "row-lines-3");
    row.classList.add(`row-lines-${getTableRowLineCount(row)}`);
  });
}

function syncTableHeaderScroll() {
  const headerContainer = document.getElementById("rulesTableHeaderContainer");
  const bodyContainer = document.getElementById("rulesTableBodyContainer");
  if (!headerContainer || !bodyContainer) return;
  headerContainer.scrollLeft = bodyContainer.scrollLeft;
}

function handleRulesTableBodyScroll() {
  syncTableHeaderScroll();
  const bodyTable = document.getElementById("rulesTableBodyTable");
  if (bodyTable?.classList.contains("suricata-feed-table")) {
    if (typeof scheduleSuricataVirtualRowsRender === "function") {
      scheduleSuricataVirtualRowsRender();
    } else if (typeof renderSuricataVirtualRows === "function") {
      renderSuricataVirtualRows();
    }
  }
}
