"""
generate-tokens.py
Reads figma-color-tokens.json and generates shared/styles/tokens.css.
Also outputs rename-map.txt showing old CSS var → new CSS var.
"""
import json, re, os, math
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).parent.parent
FIGMA_JSON = ROOT / "shared/styles/figma-color-tokens.json"
OUTPUT_CSS  = ROOT / "shared/styles/tokens.css"
OUTPUT_MAP  = ROOT / "tmp/rename-map.txt"

# ─── 1. Parse JSON ─────────────────────────────────────────────────────────────

with open(FIGMA_JSON) as f:
    data = json.load(f)

# ─── 2. Build flat reference map (dot-path → raw value) ───────────────────────

ref_map: dict[str, str] = {}

def flatten_refs(d, path_parts: list[str]):
    if isinstance(d, dict):
        if "value" in d:
            key = ".".join(path_parts)
            ref_map[key] = d["value"]
        else:
            for k, v in d.items():
                if k.startswith("$"):
                    continue
                flatten_refs(v, path_parts + [k])

for section_key, section_val in data.items():
    if section_key.startswith("$"):
        continue
    if isinstance(section_val, dict):
        flatten_refs(section_val, [])

# ─── 3. Resolve references recursively ────────────────────────────────────────

def resolve(value: str, depth: int = 0) -> str:
    if depth > 20:
        return value
    m = re.fullmatch(r"\{(.+)\}", value.strip())
    if not m:
        return value
    ref = m.group(1)
    if ref in ref_map:
        return resolve(ref_map[ref], depth + 1)
    for k, v in ref_map.items():
        if k.endswith(ref) or k == ref:
            return resolve(v, depth + 1)
    return value

resolved_map: dict[str, str] = {}
for k, v in ref_map.items():
    resolved_map[k] = resolve(v)

# ─── 4. Hex helpers ───────────────────────────────────────────────────────────

def hex_to_rgba(h: str) -> tuple | None:
    h = h.strip().lstrip("#")
    if len(h) == 6:
        return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), 1.0)
    if len(h) == 8:
        return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), int(h[6:8],16)/255.0)
    return None

def color_dist(a: tuple, b: tuple) -> float:
    dr, dg, db = (a[0]-b[0])/255, (a[1]-b[1])/255, (a[2]-b[2])/255
    da = (a[3] - b[3])
    return math.sqrt(dr*dr + dg*dg + db*db + da*da)

# ─── 5. CSS var naming from dot-path ──────────────────────────────────────────

def pascal_to_kebab(s: str) -> str:
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", s).lower()

def path_to_css_var(dot_path: str) -> str:
    parts = dot_path.split(".")
    segs = []
    for p in parts:
        p2 = p.replace(" - ", "-").replace(" ", "-")
        p2 = pascal_to_kebab(p2)
        p2 = re.sub(r"-+", "-", p2).strip("-")
        segs.append(p2.lower())
    return "--" + "-".join(segs)

# ─── 6. Collect tokens by category ────────────────────────────────────────────

# Semantic (Colors/DarkMode)
dark_semantic: list[tuple[str, str, str]] = []  # (dot_path, css_var, resolved_hex)

def collect_dark(d, path_parts: list[str]):
    if isinstance(d, dict):
        if "value" in d:
            dot_path = ".".join(path_parts)
            resolved = resolve(d["value"])
            if resolved.startswith("#"):
                dark_semantic.append((dot_path, path_to_css_var(dot_path), resolved))
        else:
            for k, v in d.items():
                if k.startswith("$"):
                    continue
                collect_dark(v, path_parts + [k])

collect_dark(data.get("Colors/DarkMode", {}), [])

# Base palette (Base Colors/DarkMode)
base_palette: list[tuple[str, str, str]] = []

def collect_base(d, path_parts: list[str]):
    if isinstance(d, dict):
        if "value" in d:
            dot_path = ".".join(path_parts)
            resolved = resolve(d["value"])
            if resolved.startswith("#"):
                base_palette.append((dot_path, path_to_css_var(dot_path), resolved))
        else:
            for k, v in d.items():
                if k.startswith("$"):
                    continue
                collect_base(v, path_parts + [k])

bcd = data.get("Base Colors/DarkMode", {})
for family in ("Military", "Cyber", "Greynoise"):
    if family in bcd:
        collect_base(bcd[family], [family])

# ─── 7. Build search pools for nearest-color matching ─────────────────────────
#
#   Priority pool: Material + base palette (Military, Cyber) — used for invented vars.
#   Full semantic pool: all Colors/DarkMode tokens — fallback.
#   Excluded from search: Topology, Chart, Gradient, WIP, Timeline specific sub-tokens.

EXCLUDED_PREFIXES = (
    "Topology.", "Chart.", "Gradient.", "WIP.", "Timeline.",
    "Effects.", "Asset", "Packets",
)

def is_excluded(dot_path: str) -> bool:
    return any(dot_path.startswith(p) for p in EXCLUDED_PREFIXES)

# Priority pool: Material semantic + base palette
priority_pool: list[tuple[str, str, tuple]] = []  # (css_var, hex, rgba)
for dot_path, css_var, hex_val in dark_semantic:
    if dot_path.startswith("Material."):
        rgba = hex_to_rgba(hex_val)
        if rgba:
            priority_pool.append((css_var, hex_val, rgba))
for dot_path, css_var, hex_val in base_palette:
    rgba = hex_to_rgba(hex_val)
    if rgba:
        priority_pool.append((css_var, hex_val, rgba))

# Secondary pool: all semantic tokens (excluding topology/chart/etc.)
secondary_pool: list[tuple[str, str, tuple]] = []
for dot_path, css_var, hex_val in dark_semantic:
    if not is_excluded(dot_path):
        rgba = hex_to_rgba(hex_val)
        if rgba:
            secondary_pool.append((css_var, hex_val, rgba))

# Full figma var set (name without --)
figma_var_set: set[str] = set()
all_figma_map: dict[str, str] = {}  # css_var (no --) → hex
for _, css_var, hex_val in dark_semantic + base_palette:
    name = css_var.lstrip("-")
    figma_var_set.add(name)
    all_figma_map[name] = hex_val

# Reverse hex → css_var (prefer semantic over base)
hex_to_var: dict[str, str] = {}
for _, css_var, hex_val in base_palette:
    if hex_val not in hex_to_var:
        hex_to_var[hex_val] = css_var
for _, css_var, hex_val in dark_semantic:
    # overwrite base with semantic
    hex_to_var[hex_val] = css_var

def nearest_in_pool(rgba: tuple, pool: list) -> tuple[str, float]:
    best_name, best_dist = "", float("inf")
    for css_var, _, crgba in pool:
        d = color_dist(rgba, crgba)
        if d < best_dist:
            best_dist = d
            best_name = css_var.lstrip("-")
    return best_name, best_dist

# ─── 8. Explicit material rename patterns ─────────────────────────────────────
#   Old abbreviation pattern → figma-correct name

MATERIAL_RENAMES = {
    "material-w-ultra-thin":  "material-ultra-thin-white",
    "material-w-xtra-thin":   "material-xtra-thin-white",
    "material-w-semi-thin":   "material-semi-thin-white",
    "material-w-thin":        "material-thin-white",
    "material-w-medium":      "material-medium-white",
    "material-w-thick":       "material-thick-white",
    "material-w-xtra-thick":  "material-xtra-thick-white",
    "material-w-ultra-thick": "material-ultra-thick-white",
    "material-w-intense":     "material-intense-white",
    "material-k-ultra-thin":  "material-ultra-thin-black",
    "material-k-xtra-thin":   "material-xtra-thin-black",
    "material-k-semi-thin":   "material-semi-thin-black",
    "material-k-thin":        "material-thin-black",
    "material-k-medium":      "material-medium-black",
    "material-k-28":          "material-medium-black",    # closest: medium-black #09090b3d ≈ 0.24
    "material-k-35":          "material-thick-black",     # closest: thick-black #09090b66 ≈ 0.4
    "material-k-thick":       "material-thick-black",
    "material-k-48":          "material-xtra-thick-black",# closest: xtra-thick #09090ba3 ≈ 0.64
    "material-k-xtra-thick":  "material-xtra-thick-black",
    "material-k-ultra-thick": "material-ultra-thick-black",
    "material-k-intense":     "material-intense-black",
    # off-scale material-w-* → nearest named stop
    "material-w-10":  "material-thin-white",      # 0.10 → thin=0.078 (closest)
    "material-w-14":  "material-thin-white",      # 0.14 → thin=0.078 vs medium=0.122 → medium closer
    "material-w-20":  "material-medium-white",    # 0.20 → medium=0.122 vs thick=0.18 → thick closer
    "material-w-22":  "material-thick-white",     # 0.22 → thick=0.18
    "material-w-26":  "material-xtra-thick-white",# 0.26 → xtra-thick=0.24
    "material-w-28":  "material-xtra-thick-white",# 0.28 → xtra-thick=0.24
    "material-w-38":  "material-ultra-thick-white",# 0.38 → ultra-thick=0.32
    "material-w-46":  "material-ultra-thick-white",# 0.46 → ultra-thick=0.32 vs intense=0.52 → intense closer
    # scale-light-* (rgba(224,228,240, alpha)) → material-*-white
    "scale-light-2":   "material-ultra-thin-white",
    "scale-light-3":   "material-ultra-thin-white",
    "scale-light-4":   "material-xtra-thin-white",
    "scale-light-5":   "material-xtra-thin-white",
    "scale-light-6":   "material-semi-thin-white",
    "scale-light-8":   "material-thin-white",
    "scale-light-10":  "material-thin-white",
    "scale-light-12":  "material-medium-white",
    "scale-light-16":  "material-thick-white",    # 0.16 → thick=0.18 closer than medium=0.12
    "scale-light-18":  "material-thick-white",
    "scale-light-24":  "material-xtra-thick-white",
    # scale-deep-* (rgba(9,9,11, alpha)) → material-*-black
    "scale-deep-4":    "material-ultra-thin-black",
    "scale-deep-12":   "material-semi-thin-black",
    "scale-deep-18":   "material-thin-black",
    "scale-deep-48":   "material-xtra-thick-black",
    "scale-deep-72":   "material-ultra-thick-black",
    "scale-deep-92":   "material-intense-black",
    "scale-deep-98":   "material-intense-black",
    # scale-white-* (rgba(255,255,255, alpha)) → nearest material-*-white (approximation)
    "scale-white-2":    "material-ultra-thin-white",
    "scale-white-4":    "material-xtra-thin-white",
    "scale-white-6":    "material-semi-thin-white",
    "scale-white-015":  "material-ultra-thin-white",
    "scale-white-008":  "material-ultra-thin-white",
    # scale-black-* (rgba(0,0,0, alpha)) → nearest overlay/material-black
    "scale-black-45":   "material-xtra-thick-black",
    "scale-black-55":   "material-ultra-thick-black",
    "scale-black-62":   "material-ultra-thick-black",
    "scale-black-80":   "material-intense-black",
    # overlay-k-* (rgba(0,0,0, alpha)) → nearest material-*-black
    "overlay-k-5":    "material-ultra-thin-black",
    "overlay-k-8":    "material-xtra-thin-black",
    "overlay-k-18":   "material-thin-black",
    "overlay-k-20":   "material-thin-black",
    "overlay-k-25":   "material-medium-black",
    "overlay-k-32":   "material-thick-black",
    "overlay-k-35":   "material-thick-black",
    "overlay-k-40":   "material-thick-black",
    "overlay-k-45":   "material-xtra-thick-black",
    "overlay-k-48":   "material-xtra-thick-black",
    "overlay-k-50":   "material-xtra-thick-black",
    "overlay-k-55":   "material-xtra-thick-black",
    "overlay-k-62":   "material-ultra-thick-black",
    "overlay-k-70":   "material-ultra-thick-black",
    "overlay-k-80":   "material-intense-black",
    # glow-w-* (rgba(255,255,255, alpha)) → nearest material-*-white
    "glow-w-1":    "material-ultra-thin-white",
    "glow-w-2":    "material-ultra-thin-white",
    "glow-w-2-5":  "material-ultra-thin-white",
    "glow-w-3":    "material-ultra-thin-white",
    "glow-w-4":    "material-xtra-thin-white",
    "glow-w-6":    "material-semi-thin-white",
    "glow-w-8":    "material-thin-white",
    "glow-w-18":   "material-thick-white",
}

# Semantic overrides for specific well-known variables
SEMANTIC_OVERRIDES = {
    # Theme backgrounds
    "theme-midnight":  "theme-midnight",
    "theme-cadet":     "theme-cadet",
    "theme-space":     "theme-space",
    "app-theme-bg":    "theme-midnight",
    "bg":              "theme-midnight",
    "panel":           "theme-midnight",
    # Surface
    "surface-drawer":  "surface-drawer",
    "surface-deep":    "surface-tooltip-host-background",
    "surface-dim":     "surface-timeline",
    "surface-dark":    "surface-navbar-launcher",
    "surface-black":   "surface-tooltip-host-background",
    "modal":           "surface-modal",
    "bg-primary":      "surface-tooltip-host-background",
    "bg-hover":        "fill-menu-item-hover",
    "bg-selected":     "fill-table-active",
    "border-subtle":   "stroke-faint",
    # Text semantics
    "text": "text-secondary",
    "muted": "text-tertiary",
    "faint": "text-quaternary",
    "text-near-white": "text-primary",
    "text-solid-white": "stroke-intense",
    "text-solid-black": "text-invert",
    # Error/success/warning → text semantic tokens
    "error": "text-error",
    "success": "text-positive",
    "warning": "text-highlight",
    "link": "text-link",
    "link-hover": "text-hover",
    "danger": "text-error",
    # Accent
    "accent": "accent-blue",
    "accent-blue": "stroke-active",  # #217dff matches stroke-active
    "focus-ring-color": "stroke-active",
    "focus-ring": "fill-table-active",
    # Primary/secondary
    "toggle-on": "primary",
    "btn-primary-bg": "primary",
    "btn-primary-hover": "primary",
    # Borders — Material white equivalents
    "border": "material-thick-white",
    "border-strong": "material-thick-white",
    "border-color": "fill-table-active",
    # Item states
    "item-hover-bg": "fill-menu-item-hover",
    "item-active-bg": "fill-menu-item-active",
    "row-drag-source-bg": "material-ultra-thin-white",
    "row-drag-source-border": "material-medium-white",
    # Tab
    "tab-pill-active": "fill-tab-active",
    "tab-strip-bg": "material-ultra-thin-white",
    "tab-pill-hover-bg": "material-xtra-thin-white",
    "tab-close-hover-bg": "material-thin-white",
    # Chip/badge
    "ui-chip-gray-outline":   "tag-chip-label-gray-outline-strong",
    "ui-chip-orange-outline": "tag-chip-label-orange-outline-strong",
    "ui-chip-pink-outline":   "tag-chip-label-pink-outline-strong",
    "ui-chip-yellow-outline": "tag-chip-label-yellow-outline-strong",
    "ui-chip-teal-outline":   "tag-chip-label-teal-outline-strong",
    "ui-chip-blue-outline":   "tag-chip-label-blue-outline-strong",
    "ui-badge-gray-fill":     "tag-chip-label-gray-fill",
    "ui-badge-green-fill":    "tag-chip-label-green-fill",
    "ui-badge-teal-fill":     "tag-chip-label-teal-fill",
    "ui-badge-cyan-fill":     "tag-chip-label-cyan-fill",
    "ui-badge-purple-fill":   "tag-chip-label-indigo-fill",
    "ui-badge-blue-fill":     "tag-chip-label-blue-fill",
    "ui-badge-brown-fill":    "tag-chip-label-brown-fill",
    "ui-badge-pink-fill":     "tag-chip-label-pink-fill",
    "ui-badge-yellow-fill":   "tag-chip-label-yellow-fill",
    # Secondary icon
    "secondary-icon-bg":    "material-thin-white",
    "secondary-icon-hover": "material-medium-white",
    # Status badge
    "status-badge-gray-bg":    "tag-chip-label-gray-alpha-fill",
    "status-badge-online-bg":  "tag-chip-label-teal-alpha-fill",
    "status-badge-ready-bg":   "tag-chip-label-blue-alpha-fill",
    "status-badge-paused-bg":  "tag-chip-label-indigo-alpha-fill",
    "status-badge-warning-bg": "tag-chip-label-yellow-alpha-fill",
    "status-badge-error-bg":   "tag-chip-label-pink-alpha-fill",
    "status-badge-bg":         "tag-chip-label-gray-alpha-fill",
    # Orange
    "orange": "cyber-orange-200",
    "orange-soft": "tag-chip-label-orange-alpha-fill",
    # Teletext
    "teletext-bg":     "fill-teletext-default",
    "teletext-border": "border-teletext",
    # Toggle
    "toggle-idle": "secondary",
    "toggle-thumb": "text-primary",
    # UI card / control
    "ui-card-border":   "material-medium-white",
    "ui-card-divider":  "fill-menu-item-active",
    "ui-control-fill":  "material-thin-black",
    "ui-control-border": "material-medium-white",
    "ui-menu-option-hover":  "fill-menu-item-hover",
    "ui-menu-option-active": "fill-menu-item-active",
    "ui-focus-ring":    "fill-table-active",
    "ui-toggle-active": "primary",
    "ui-toggle-idle":   "secondary",
    # Toolbar
    "toolbar-action-border": "material-thin-white",
    "toolbar-action-bg":     "material-ultra-thin-white",
    "toolbar-token-border":  "material-thin-white",
    "toolbar-token-bg":      "material-ultra-thin-white",
    # Topbar chip
    "topbar-chip-border":       "material-thin-white",
    "topbar-chip-hover-bg":     "material-xtra-thin-white",
    "topbar-chip-hover-border": "material-thick-white",
    "topbar-divider-color":     "material-medium-white",
    # Menu chip
    "menu-chip-border": "tag-chip-label-gray-outline-strong",
    # Tree line
    "tree-line": "material-thin-white",
    # Panel
    "panel-2": "surface-navbar-launcher",
    "panel-3": "surface-sidebar",
    # Search borders
    "border-search-default": "border-search-default",
    "border-search-hover":   "material-thick-white",
    "border-search-active":  "stroke-active",
    "border-search-error":   "stroke-error",
    "sidebar-search-border": "stroke-active",
    "sidebar-search-glow":   "fill-menu-item-hover",
    # Fill search
    "fill-search-default": "fill-search-default",
    "fill-search-strong":  "fill-search-strong",
    # Rename input
    "rename-input-bg":     "material-xtra-thin-white",
    "rename-input-border": "stroke-active",
    "rename-input-glow":   "fill-menu-item-hover",
    # Dot indicator
    "dot-glow": "material-ultra-thin-white",
    # Focus
    "focus-ring": "fill-table-active",
    # Scenario
    "scenario-primary-border": "stroke-active",
    "scenario-primary-bg":     "fill-menu-item-hover",
    "scenario-warn-border":    "tag-chip-label-orange-outline-strong",
    "scenario-warn-bg":        "tag-chip-label-orange-alpha-fill",
    # Split btn
    "split-btn-ring": "tag-chip-label-orange-outline-strong",
    # Gray
    "gray-dark":     "cyber-black-300",
    "gray-light":    "cyber-white-400",
    "gray-subtle":   "cyber-white-850",
    "gray-xtra-light": "cyber-white-300",
    # Teal
    "teal-green": "cyber-teal-300",
    # Accent / blue variants - map to base palette
    "accent-indigo": "cyber-indigo-300",
    "accent-cyan-blue": "cyber-cyan-200",
    "blue-xlight": "cyber-indigo-50",
    # Chip yellow
    "chip-yellow-strong": "text-highlight",
    # Checkbox
    "checkbox-mark-color": "text-primary",
    "hosts-checkbox-border": "material-thin-white",
    # Dialog
    "dialog-icon-warning-bg": "tag-chip-label-yellow-alpha-fill",
    # Yellow bright
    "yellow-bright": "tag-chip-label-yellow-alpha-fill",
    "yellow-bright-90": "text-highlight",
    # Collection bar
    "collection-bar-bg": "tag-chip-label-ultra-alpha-fill",
    "collection-bar-border": "material-medium-white",
    # Tag colors
    "tag-alert-border": "tag-chip-label-pink-alpha-fill-hover",
    "tag-alert-bg":     "tag-chip-label-pink-alpha-fill",
    "tag-agent-border": "tag-chip-label-blue-alpha-fill-hover",
    "tag-agent-bg":     "tag-chip-label-blue-alpha-fill",
    "tag-benign-border": "tag-chip-label-teal-alpha-fill-hover",
    "tag-benign-bg":     "tag-chip-label-teal-alpha-fill",
    # Text near-white variants
    "text-near-white-90": "text-primary",
    "text-faint-8":  "text-quaternary",
    "text-faint-12": "material-medium-white",
    "text-faint-16": "stroke-disabled",
    "text-40": "text-tertiary",
    "text-72": "text-secondary",
    "text-warning-bright": "text-highlight",
    # Alerts subnet
    "alerts-subnet-chip-outline":         "tag-chip-label-blue-outline-strong",
    "alerts-subnet-chip-fill":            "tag-chip-label-ultra-alpha-fill-hover",
    "alerts-subnet-chip-include-outline": "tag-chip-label-blue-outline-strong",
    "alerts-subnet-chip-include-fill":    "tag-chip-label-ultra-alpha-fill-hover",
    "alerts-subnet-chip-exclude-outline": "tag-chip-label-orange-outline-strong",
    "alerts-subnet-chip-exclude-fill":    "tag-chip-label-orange-alpha-fill-hover",
    "alerts-subnet-chip-exclude-text":    "cyber-orange-50",
    "alerts-subnet-chip-text":            "text-active",
    # Suri / subnet chip (alerting-modal and ui-primitives)
    "suri-subnet-chip-outline":  "tag-chip-label-blue-outline-strong",
    "suri-subnet-chip-fill":     "tag-chip-label-ultra-alpha-fill-hover",
    "suri-subnet-chip-text":     "text-primary",
    # Status badge icon
    "status-badge-icon-color": "text-secondary",
    # Surface variants
    "surface-mid-92":       "surface-navbar-launcher",
    "surface-modal-dark":   "surface-modal",
    "surface-drawer":       "surface-drawer",
    "surface-dim":          "surface-timeline",
    "surface-menu-bg":      "surface-popover",
    "surface-toast-bg":     "fill-toast-default",
    "surface-note-bg":      "surface-tooltip-host-background",
    "surface-floating-bg":  "surface-tooltip-host-background",
    "surface-nav-dark":     "surface-sidebar-launcher",
    "surface-backdrop":     "surface-tooltip-host-background",
    # Panel surface variants
    "surface-panel-74":   "surface-navbar-launcher",
    "surface-panel-90":   "surface-navbar-launcher",
    "surface-panel-96":   "surface-navbar-launcher",
    "surface-panel-96b":  "surface-navbar-launcher",
    "surface-panel-98":   "surface-navbar-launcher",
    "surface-timeline-dark":   "surface-timeline",
    "surface-timeline-92":     "surface-timeline",
    "surface-timeline-95":     "surface-timeline",
    "surface-timeline-panel":  "surface-timeline",
    "surface-overlay":         "surface-tooltip",
    "surface-alerts-dark":     "surface-tooltip-host-background",
    "surface-alerts-6-98":     "surface-tooltip-host-background",
    "surface-alerts-8-99":     "surface-tooltip-host-background",
    "surface-table-header":    "surface-navbar-launcher",
    # Inspector / network panel
    "inspector-panel-bg":  "material-thin-white",
    "network-panel-bg":    "material-ultra-thin-black",
    # Floating lab
    "floating-lab-bg": "surface-tooltip-host-background",
    # Button warning
    "btn-warning-border":       "cyber-orange-600",
    "btn-warning-fill":         "tag-chip-label-orange-alpha-fill",
    "btn-warning-fill-hover":   "tag-chip-label-orange-alpha-fill-hover",
    "btn-warning-fill-active":  "tag-chip-label-orange-alpha-fill",
    "orange-soft-border": "cyber-orange-800",
    # Note editor
    "note-editor-bg":          "surface-tooltip-host-background",
    "note-editor-text":        "text-primary",
    "note-editor-placeholder": "text-quaternary",
    "note-resize-handle-border": "material-thick-white",
    # View notes
    "view-notes-bg":                  "surface-board",
    "view-notes-border":              "material-medium-white",
    "view-notes-shadow":              "material-intense-black",
    "view-notes-toolbar-bg":          "material-xtra-thin-white",
    "view-notes-toolbar-border":      "material-thin-white",
    "view-notes-editor-border":       "material-thin-white",
    "view-notes-editor-focus-border": "material-thick-white",
    "view-notes-editor-focus-glow":   "material-thin-white",
    # Scenario (again, ensure consistent)
    "accent-orange": "cyber-orange-200",
    "accent-purple": "cyber-purple-300",
    "accent-navy-solid": "primary",
    "orange-solid": "cyber-orange-200",
    # Blue vars
    "blue-dot": "cyber-blue-100",
    "blue-navy-deep": "cyber-blue-700",
    "blue-navy-xdark": "cyber-black-650",
    "blue-navy-dark-40": "material-thick-black",
    # Dbe7ff light blue
    "dbe7ff-light-blue": "cyber-blue-50",
    # Chip yellow warn
    "chip-yellow-warn-42": "tag-chip-label-yellow-alpha-fill-hover",
    # Threshold fill
    "threshold-fill": "fill-table-active",
    # Surface deep overlay
    "surface-deep-overlay": "material-ultra-thick-black",
    "surface-dark-98": "material-intense-black",
    "surface-dark-92": "material-intense-black",
    # Panel overlay (gradient vars — not pure colors, but map to closest)
    "panel": "theme-midnight",
    # View notes width (not a color)
    # Teletext bg
    "teletext-bg": "fill-teletext-default",
    # Row bg
    "row-bg": "material-ultra-thin-white",
    # Error/pink variants
    "error-bright-11":  "tag-chip-label-pink-alpha-fill",
    "error-bright-24":  "tag-chip-label-pink-alpha-fill-hover",
    "error-pink-alt":   "text-error",
    "error-pink-light": "text-error",
    "error-pink-30":    "tag-chip-label-pink-alpha-fill-hover",
    "error-pink-42":    "tag-chip-label-pink-alpha-fill-hover",
    "error-tint-8":     "tag-chip-label-pink-alpha-fill",
    # Success
    "success": "text-positive",
    "success-alpha-10": "tag-chip-label-teal-alpha-fill",
    "success-alpha-24": "tag-chip-label-teal-alpha-fill-hover",
    "success-bright": "text-portal-highlight",
    # Teal border variants
    "teal-border-8":  "tag-chip-label-teal-alpha-fill",
    "teal-border-18": "tag-chip-label-teal-alpha-fill-hover",
    "teal-border-42": "tag-chip-label-teal-outline-strong",
    "teal-border-86": "stroke-active",
    # Teal alpha
    "teal-alpha-20": "tag-chip-label-teal-alpha-fill",
    "teal-alpha-36": "tag-chip-label-teal-alpha-fill-hover",
    # Gray muted
    "gray-muted-18": "material-thin-white",
    "gray-muted-48": "material-xtra-thick-white",
    "gray-muted-90": "cyber-black-250",
    "gray-mid-90":   "cyber-black-400",
    "gray-light-48": "cyber-white-500",
    "gray-timeline-16": "material-thick-white",
    "gray-timeline-90": "cyber-white-500",
    "gray-timeline-92": "cyber-white-500",
    "gray-storage-start": "cyber-white-850",
    "gray-storage-end":   "cyber-white-200",
    "gray-text-light":    "cyber-white-150",
    # Orange alpha variants
    "orange-alpha-11": "tag-chip-label-orange-alpha-fill",
    "orange-alpha-24": "tag-chip-label-orange-alpha-fill-hover",
    "orange-alpha-34": "tag-chip-label-orange-alpha-fill-hover",
    "orange-alpha-46": "tag-chip-label-orange-outline-strong",
    "orange-warm-20": "tag-chip-label-brown-alpha-fill",
    "orange-warm-22": "tag-chip-label-brown-alpha-fill",
    "orange-solid-alt": "cyber-orange-200",
    "orange-alpha-14": "tag-chip-label-orange-alpha-fill",
    "orange-alpha-42": "tag-chip-label-orange-outline-strong",
    "orange-alpha-48": "tag-chip-label-orange-outline-strong",
    # Blue alpha variants
    "accent-alpha-10": "tag-chip-label-ultra-alpha-fill",
    "accent-alpha-20": "tag-chip-label-ultra-alpha-fill-hover",
    "accent-alpha-24": "fill-menu-item-hover",
    "accent-alpha-26": "fill-menu-item-hover",
    "accent-alpha-36": "fill-menu-item-hover",
    "accent-alpha-38": "fill-menu-item-hover",
    "accent-alpha-48": "fill-table-active",
    "accent-soft":     "tag-chip-label-indigo-alpha-fill-hover",
    "accent-soft-12":  "tag-chip-label-indigo-alpha-fill-hover",
    "accent-soft-blue": "tag-chip-label-ultra-alpha-fill",
    "accent-item-8":   "tag-chip-label-ultra-alpha-fill",
    "accent-item-18":  "fill-menu-item-hover",
    "accent-item-28":  "fill-menu-item-hover",
    "accent-item-32":  "fill-menu-item-hover",
    "accent-focus":    "fill-table-active",
    "accent-glow-34":  "fill-menu-item-hover",
    "accent-glow-40":  "fill-menu-item-hover",
    "accent-glow-44":  "fill-menu-item-hover",
    "accent-glow-58":  "fill-table-active",
    "accent-glow-90":  "stroke-active",
    "accent-glow-92":  "stroke-active",
    "accent-navy-12":  "tag-chip-label-ultra-alpha-fill",
    "accent-navy-14":  "tag-chip-label-ultra-alpha-fill-hover",
    "accent-navy-20":  "fill-table-active",
    "accent-navy-96":  "primary",
    "accent-navy-96s": "tag-chip-label-ultra-alpha-fill",
    "accent-blue-36":  "fill-menu-item-hover",
    "accent-blue-42":  "fill-menu-item-hover",
    "accent-blue-58":  "fill-table-active",
    # Blue misc
    "blue-33-38":  "fill-menu-item-hover",
    "blue-33-85":  "tag-chip-label-blue-alpha-fill-hover",
    "blue-33-85b": "stroke-active",
    "blue-59-18":  "fill-menu-item-hover",
    "blue-59-85":  "stroke-active",
    "blue-inset-24": "material-medium-black",
    "blue-inset-32": "material-thick-black",
    "blue-med-82":   "stroke-active",
    "blue-vivid-32": "tag-chip-label-ultra-alpha-fill-hover",
    "blue-vivid-82": "stroke-active",
    "accent-navy-solid": "primary",
    "indigo-alpha-20": "tag-chip-label-indigo-alpha-fill",
    "indigo-alt-20":   "tag-chip-label-indigo-alpha-fill",
    "indigo-soft-24":  "tag-chip-label-indigo-alpha-fill-hover",
    "purple-alpha-30": "tag-chip-label-indigo-alpha-fill-hover",
    "red-dark-24":     "tag-chip-label-pink-alpha-fill-hover",
    "cyan-teal-30":    "tag-chip-label-cyan-alpha-fill-hover",
    "warm-brown-20":   "tag-chip-label-brown-alpha-fill",
    # Badge / chip context vars
    "badge-fill":   "cyber-black-250",
    "badge-text":   "text-secondary",
    "chip-outline": "tag-chip-label-gray-outline-strong",
    "chip-text":    "text-secondary",
    "chip-hover-fill": "fill-menu-item-hover",
    # Viewer toolbar bg (gradient — not a pure color)
    # Card status bg (gradient — not a pure color)
    # Surface deep
    "surface-deep-overlay": "material-ultra-thick-black",
}

# ─── 9. Collect current CSS variable definitions ──────────────────────────────

CSS_FILES = [
    ROOT / "shared/styles/base.css",
    ROOT / "shared/styles/components/ui-primitives.css",
    ROOT / "shared/styles/components/buttons.css",
    ROOT / "shared/styles/components/sidebar.css",
    ROOT / "shared/styles/components/inspector-drawer.css",
    ROOT / "shared/styles/components/checkbox.css",
    ROOT / "viewer/styles/alerts.css",
    ROOT / "viewer/styles/hosts.css",
    ROOT / "launcher/launcher.css",
    ROOT / "timeline/timeline.css",
    ROOT / "alerting-modal/style.css",
]

VAR_DEF_RE = re.compile(r"--([a-z][a-z0-9-]+)\s*:\s*(.+?)(?:\s*;)", re.DOTALL)

current_vars: dict[str, str] = {}
for css_file in CSS_FILES:
    if not css_file.exists():
        continue
    text = css_file.read_text()
    for m in VAR_DEF_RE.finditer(text):
        name, val = m.group(1), m.group(2).strip()
        if name not in current_vars:
            current_vars[name] = val

# ─── 10. Build final rename map ────────────────────────────────────────────────

rename: dict[str, str] = {}

def parse_css_color(val: str) -> tuple | None:
    val = val.strip()
    if re.match(r"#[0-9a-fA-F]{6,8}$", val):
        return hex_to_rgba(val)
    m = re.match(r"rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)", val)
    if m:
        r, g, b = int(float(m.group(1))), int(float(m.group(2))), int(float(m.group(3)))
        a = float(m.group(4)) if m.group(4) else 1.0
        return (r, g, b, a)
    return None

for old_name in sorted(current_vars.keys()):
    raw_val = current_vars[old_name]

    # 1. Explicit material rename pattern
    if old_name in MATERIAL_RENAMES:
        rename[old_name] = MATERIAL_RENAMES[old_name]
        continue

    # 2. Explicit semantic override
    if old_name in SEMANTIC_OVERRIDES:
        rename[old_name] = SEMANTIC_OVERRIDES[old_name]
        continue

    # 3. Already a valid figma var name
    if old_name in figma_var_set:
        rename[old_name] = old_name
        continue

    # 4. Value-based exact hex match
    rgba = parse_css_color(raw_val)
    if rgba:
        a_byte = round(rgba[3] * 255)
        if a_byte == 255:
            hex_key = f"#{rgba[0]:02x}{rgba[1]:02x}{rgba[2]:02x}"
        else:
            hex_key = f"#{rgba[0]:02x}{rgba[1]:02x}{rgba[2]:02x}{a_byte:02x}"
        if hex_key in hex_to_var:
            new_name = hex_to_var[hex_key].lstrip("-")
            rename[old_name] = new_name
            continue
        # 5. Nearest color from priority pool (material + base palette)
        nearest_name, dist = nearest_in_pool(rgba, priority_pool)
        if nearest_name:
            rename[old_name] = nearest_name
            continue

    # 6. Check if value is a var() reference to a known var
    m = re.match(r"var\(--([a-z][a-z0-9-]+)\)", raw_val)
    if m:
        ref = m.group(1)
        if ref in figma_var_set:
            rename[old_name] = ref
        elif ref in rename:
            rename[old_name] = rename[ref]
    # else: unmapped (non-color or complex composite)

# ─── 11. Generate tokens.css ──────────────────────────────────────────────────

semantic_groups: dict[str, list] = defaultdict(list)
for dot_path, css_var, hex_val in dark_semantic:
    top = dot_path.split(".")[0]
    semantic_groups[top].append((css_var, hex_val, dot_path))

base_groups: dict[str, list] = defaultdict(list)
for dot_path, css_var, hex_val in base_palette:
    family = dot_path.split(".")[0]
    base_groups[family].append((css_var, hex_val, dot_path))

CATEGORY_ORDER = [
    "Text", "Foreground", "Primary", "Secondary", "Theme",
    "Material", "Surface", "Stroke", "Fill", "Button",
    "Highlight", "Raised", "TagChipLabel", "Status Colors",
    "Divider", "Border", "Timeline", "Topology", "Chart",
    "Gradient", "Effects", "TUI", "Status", "WIP",
    "ContentArea", "TopToolbar", "PanelArea",
    "AccentBlue", "AccentUltraBlue", "Floating", "ThemeMidnight",
    "ThemeCadet", "ThemeSpace", "ThemeFigma",
]

def emit_group(group_name: str, items: list[tuple[str,str,str]]) -> list[str]:
    if not items:
        return []
    out = [f"  /* === {group_name} === */"]
    seen = set()
    for css_var, hex_val, dot_path in sorted(items, key=lambda x: x[0]):
        if css_var in seen:
            continue
        seen.add(css_var)
        out.append(f"  {css_var}: {hex_val};")
    out.append("")
    return out

lines = [
    "/* ============================================================",
    " * tokens.css",
    " * Single source of truth for all color CSS custom properties.",
    " * AUTO-GENERATED from figma-color-tokens.json",
    " *",
    " * STRICT RULE: Do NOT define color variables in any other CSS file.",
    " * Variable names follow the figma token path convention:",
    " *   Colors/DarkMode/{Category}/{Name} → --{category}-{name}",
    " *   Base Colors/DarkMode/{Family}/{Color}/{Shade} → --{family}-{color}-{shade}",
    " * ============================================================ */",
    "",
    ":root {",
]

written = set()
for cat in CATEGORY_ORDER:
    if cat in semantic_groups:
        lines.extend(emit_group(cat, semantic_groups[cat]))
        written.add(cat)
for cat in sorted(semantic_groups.keys()):
    if cat not in written:
        lines.extend(emit_group(cat, semantic_groups[cat]))

for family in ("Military", "Cyber", "Greynoise"):
    if family in base_groups:
        lines.extend(emit_group(f"Base Palette — {family}", base_groups[family]))
for family in sorted(base_groups.keys()):
    if family not in ("Military", "Cyber", "Greynoise"):
        lines.extend(emit_group(f"Base Palette — {family}", base_groups[family]))

lines.append("}")
lines.append("")
OUTPUT_CSS.write_text("\n".join(lines))
print(f"✓ Written {OUTPUT_CSS}")

# ─── 12. Write rename map ──────────────────────────────────────────────────────

unchanged = [(n, rename[n]) for n in sorted(current_vars) if n in rename and rename[n] == n]
changed   = [(n, rename[n]) for n in sorted(current_vars) if n in rename and rename[n] != n]
unmapped  = [n for n in sorted(current_vars) if n not in rename]

with open(OUTPUT_MAP, "w") as f:
    f.write("# Rename map: old CSS variable → new figma-aligned CSS variable\n\n")
    f.write(f"# === RENAMED ({len(changed)}) ===\n")
    for old, new in changed:
        f.write(f"--{old} -> --{new}\n")
    f.write(f"\n# === ALREADY CORRECT ({len(unchanged)}) ===\n")
    for n, _ in unchanged:
        f.write(f"--{n}\n")
    f.write(f"\n# === UNMAPPED / NON-COLOR ({len(unmapped)}) ===\n")
    for n in unmapped:
        f.write(f"--{n}  (value: {current_vars[n][:60]})\n")

print(f"✓ Written {OUTPUT_MAP}")
print(f"  Renamed:   {len(changed)}")
print(f"  Unchanged: {len(unchanged)}")
print(f"  Unmapped:  {len(unmapped)}")
