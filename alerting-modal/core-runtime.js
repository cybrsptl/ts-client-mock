/* Alerting modal core runtime. */

function getIconsBasePath() {
  const path = window.location.pathname || "";
  if (path.includes("/alerting-modal/")) return "../icons";
  if (path.includes("/viewer/")) return "../icons";
  if (path.includes("/launcher/")) return "../icons";
  return "../icons";
}

function resolveIconPath(iconName) {
  const iconsBase = getIconsBasePath();
  if (/^icon_[A-Za-z0-9_-]+\.svg$/i.test(iconName)) {
    return `${iconsBase}/ui_core/collection/${iconName}`;
  }
  return `${iconsBase}/${iconName}`;
}

const SURI_ARROW_ICON_DOWN_SRC = resolveIconPath(
  "icon_arrow_head_outline_down.svg",
);
const SURI_ROW_ARROW_RIGHT_SRC = resolveIconPath("icon_arrow_head_right.svg");
const SURI_MENU_DROPDOWN_ICON_SRC = resolveIconPath(
  "icon_arrow_head_outline_down.svg",
);
const SURI_MENU_SELECT_ICON_SRC = resolveIconPath("icon_dual_arrow_expand.svg");
const SURI_ICON_ADD_SRC = resolveIconPath("icon_add.svg");
const SURI_ICON_CHECK_SRC = resolveIconPath("icon_check.svg");
const SURI_ICON_CHECK_MENU_ITEM_SRC = resolveIconPath(
  "icon_check_menu_item.svg",
);
const SURI_ICON_SORT_NONE_SRC = resolveIconPath("icon_block.svg");
const SURI_ICON_SORT_ASCENDING_SRC = resolveIconPath(
  "icon_sort_ascending.svg",
);
const SURI_ICON_SORT_DESCENDING_SRC = resolveIconPath(
  "icon_sort_descending.svg",
);
const SURI_ICON_SEARCH_SRC = resolveIconPath("icon_search.svg");
const SURI_ICON_CLOSE_SRC = resolveIconPath("icon_close.svg");
const SURI_ICON_INFO_SRC = resolveIconPath("icon_info.svg");
const SURI_ICON_WARNING_SRC = resolveIconPath("icon_alert.svg");
const SURI_ICON_GRAB_HANDLE_SRC = resolveIconPath("icon_grab_handle.svg");
const SURI_ICON_SURICATA_APP_SRC = resolveIconPath("apps/app/Suricata.svg");
const SURI_ICON_TELESEER_LOGO_SRC = resolveIconPath("icon_teleseer_logo.svg");
const SURI_ICON_RENAME_SRC = resolveIconPath("icon_pencil.svg");
const SURI_ICON_COPY_SRC = resolveIconPath("icon_copy.svg");
const SURI_ICON_EXPORT_SRC = resolveIconPath("icon_export_file.svg");
const SURI_ICON_DELETE_SRC = resolveIconPath("icon_delete.svg");

/**
 * Renders a monochrome icon using the CSS mask technique so it always
 * inherits `color: currentColor`. Never use <img> for project icons.
 */
function svgIcon(iconPath, size = 16) {
  return `<span class="svg-icon" style="--icon-url: url('${iconPath}'); width: ${size}px; height: ${size}px;" aria-hidden="true"></span>`;
}

function getAlertingInlineContext() {
  const searchParams = new URLSearchParams(window.location.search || "");
  const surfaceParam = searchParams.get("surface");
  if (surfaceParam === "workspace-variables") {
    return { surface: "workspace-variables" };
  }
  if (surfaceParam === "manage-alerts") {
    return { surface: "manage-alerts" };
  }
  const context = window.__alertingInlineContext;
  if (context && typeof context === "object") {
    return context;
  }
  return { surface: "manage-alerts" };
}

function isEmbeddedAlertingModal() {
  const searchParams = new URLSearchParams(window.location.search || "");
  return searchParams.get("embed") === "viewer";
}

function getAlertingInlineSurface() {
  return getAlertingInlineContext().surface === "workspace-variables"
    ? "workspace-variables"
    : "manage-alerts";
}

function isWorkspaceVariablesModal() {
  return getAlertingInlineSurface() === "workspace-variables";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJsSingleQuoted(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");
}

function cloneDrawerState(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatTooltipItems(items, limit = 12) {
  const tokens = (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  if (!tokens.length) return "";
  if (tokens.length <= limit) return tokens.join(" · ");
  return `${tokens.slice(0, limit).join(" · ")} · +${tokens.length - limit} more`;
}

function getTooltipAttribute(text) {
  const tooltip = String(text ?? "").trim();
  return tooltip ? ` data-tooltip="${escapeHtml(tooltip)}"` : "";
}
