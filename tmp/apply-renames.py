"""
apply-renames.py
1. Reads tmp/rename-map.txt for the old → new variable name mapping.
2. In ALL CSS files (except tokens.css), replaces every var(--old) with var(--new) in ONE PASS.
3. Strips local color variable DEFINITIONS from component files (anything that belongs in tokens.css).
4. Adds @import "./tokens.css"; to the top of base.css.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
RENAME_MAP_FILE = ROOT / "tmp/rename-map.txt"
TOKENS_CSS = ROOT / "shared/styles/tokens.css"

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

# ─── 1. Load rename map ───────────────────────────────────────────────────────

rename: dict[str, str] = {}   # old-name (no --) → new-name (no --)

with open(RENAME_MAP_FILE) as f:
    for line in f:
        line = line.strip()
        m = re.match(r"^--([\w-]+)\s*->\s*--([\w-]+)$", line)
        if m:
            rename[m.group(1)] = m.group(2)
        # "ALREADY CORRECT" section — same name, no need to rename
        # "UNMAPPED" section — leave as-is

# ─── 2. Build set of ALL figma token names (defined in tokens.css) ─────────────

with open(TOKENS_CSS) as f:
    tokens_text = f.read()

figma_vars: set[str] = set(re.findall(r"--([\w-]+)\s*:", tokens_text))

# All old names that appear in the rename map (including unchanged)
old_names_to_new: dict[str, str] = dict(rename)

# Build sorted list of old names by length (longest first) to avoid partial matches
sorted_old_names = sorted(old_names_to_new.keys(), key=len, reverse=True)

# ─── 3. Build one-pass replacement regex ──────────────────────────────────────

# We match var(--old-name) or var( --old-name ) with optional whitespace
# and replace with var(--new-name)

escaped = [re.escape(n) for n in sorted_old_names]
pattern = re.compile(
    r"var\(\s*--(" + "|".join(escaped) + r")\s*\)"
)

def replace_vars(text: str) -> str:
    def replacer(m: re.Match) -> str:
        old = m.group(1)
        new = old_names_to_new.get(old, old)
        return f"var(--{new})"
    return pattern.sub(replacer, text)

# ─── 4. Identify color variable DEFINITIONS to strip from non-tokens files ────
#
#   A definition is a CSS custom property line like:
#     --some-var: <value>;
#   We want to REMOVE definitions for variables that:
#   a) have been renamed AND the new name is in figma_vars (i.e. it moves to tokens.css), OR
#   b) are being KEPT (old name = new name) but are defined in tokens.css
#   We keep definitions for: non-color vars (motion, sizing, font, shadow, icon-url, etc.)
#
#   We detect "color" definitions as lines where the value is:
#   - a hex color (#xxxxxx)
#   - rgba/rgb(...)
#   - a var(--...) reference to another (possibly renamed) variable
#   - a simple composite that's in the rename map
#
#   We leave gradients and shadows in place since they may have inline colors.
#   Only pure color declarations are stripped.

COLOR_VAL_RE = re.compile(
    r"^\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|var\(--[\w-]+\))\s*$"
)

# All names that should be defined only in tokens.css
# = figma_vars union values of rename map
tokens_only_names: set[str] = figma_vars | set(old_names_to_new.values())
# Also include old names that map to tokens names
for old, new in old_names_to_new.items():
    if new in figma_vars:
        tokens_only_names.add(old)

# Multiline CSS var definition pattern (handles multiline rgba/values)
# We'll strip full declaration blocks for color vars

def strip_color_definitions(text: str, filename: str) -> str:
    """
    Remove CSS custom property definitions that belong in tokens.css.
    Handles both single-line and multiline declarations.
    """
    lines = text.split("\n")
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line starts a --var-name: declaration
        m = re.match(r"^(\s*)--([\w-]+)\s*:", line)
        if m:
            indent = m.group(1)
            var_name = m.group(2)
            # Collect the full declaration (may span multiple lines until ;)
            decl_lines = [line]
            j = i
            while j < len(lines) and ";" not in lines[j]:
                j += 1
                if j < len(lines):
                    decl_lines.append(lines[j])
            full_decl = "\n".join(decl_lines)
            # Extract the value
            val_match = re.match(r"^\s*--[\w-]+\s*:\s*(.*?)\s*;", full_decl, re.DOTALL)
            if val_match:
                val = val_match.group(1).strip()
                should_strip = (
                    var_name in tokens_only_names
                    and COLOR_VAL_RE.match(val)
                )
                if should_strip:
                    # Skip this declaration
                    i = j + 1
                    continue
            result.extend(decl_lines[:j-i+1] if j > i else [line])
            i = j + 1
        else:
            result.append(line)
            i += 1
    return "\n".join(result)

# ─── 5. Process each CSS file ─────────────────────────────────────────────────

for css_file in CSS_FILES:
    if not css_file.exists():
        print(f"  SKIP (missing): {css_file.name}")
        continue

    original = css_file.read_text()
    text = original

    # Step A: one-pass var() rename
    text = replace_vars(text)

    # Step B: strip color variable definitions (not for base.css — handled in step 6)
    if css_file != ROOT / "shared/styles/base.css":
        text = strip_color_definitions(text, css_file.name)

    # Remove consecutive blank lines left by stripping (max 1 blank line)
    text = re.sub(r"\n{3,}", "\n\n", text)

    if text != original:
        css_file.write_text(text)
        print(f"  Updated: {css_file.relative_to(ROOT)}")
    else:
        print(f"  No change: {css_file.relative_to(ROOT)}")

# ─── 6. Strip color vars from base.css :root block ────────────────────────────
#
#   base.css has a large :root { ... } block.
#   We remove all color variable definitions from it.
#   We keep: --radius, --row, --sidebar-width, --view-notes-width,
#            --motion-*, --font-*, --shadow-*, --suri-*, --menu-row-*,
#            composite gradients, icon URLs, non-color vars.
#
#   After stripping, we add @import "./tokens.css"; at the top.

base_file = ROOT / "shared/styles/base.css"
base_text = base_file.read_text()

# Non-color variables to KEEP in base.css
NON_COLOR_VARS = {
    "radius", "row", "sidebar-width", "view-notes-width",
    "suri-simple-menu-selection-max-height",
    "menu-row-padding-text-only", "menu-row-padding-icon",
    "control-width",
    "launcher-sidebar-expanded-width", "launcher-sidebar-collapsed-width",
    "launcher-feed-menu-min-width",
    "motion-expand-duration", "motion-expand-ease",
    "motion-accordion-duration", "motion-accordion-ease",
    "motion-fade-duration",
    "font-family-base", "font-weight-light", "font-weight-regular",
    "font-weight-medium", "font-weight-semibold", "font-weight-bold",
    "shadow", "shadow-btn-default", "shadow-drag-ghost",
    "shadow-input-depth", "shadow-search-depth", "shadow-timeline-float",
    "shadow-toggle-thumb",
    "icon-url", "sot-checkbox-check-url", "status-badge-icon-mask",
    "drawer-scrollbar-size",
    "suri-subnet-accent-rgb", "alerts-subnet-accent-rgb",
    "suri-count-fill",
    "menu-variant",
    "viewer-toolbar-bg",  # gradient — not pure color
    "avatar-gradient", "project-thumb-gradient",
    "card-status-bg", "drag-ghost-bg",
    "panel-overlay-top", "panel-overlay-subtle",
    "surface-menu-bg", "surface-tab-overflow-bg",
    "bg-drawer", "bg-card",
    "launcher-health-fill",
    "launcher-port-fill", "launcher-port-fill-virtual",
    "launcher-port-dashed-border", "launcher-port-ring-hover",
    "launcher-port-ring-selected",
    "ui-card-fill",  # gradient
    "ui-menu-fill",  # gradient
    "ui-menu-shadow",  # box-shadow
    "ui-focus-ring",  # alias
    "view-notes-bg", "view-notes-shadow",  # gradient/shadow
    "view-notes-toolbar-bg",  # gradient
    "row-bg", "row-drag-source-bg",  # transparent / gradient
    "tab-strip-bg", "tab-pill-hover-bg", "tab-close-hover-bg",
    "surface-floating-bg",
    "floating-lab-bg",
    "focus-ring-shadow",
    "toggle-thumb", "toggle-thumb-white",
    "chip-yellow-strong",  # alias
    "sidebar-row-color",
    "row-drag-source-border", "row-drag-source-bg",
    "header",  # not a var at all
    "info",
    "suri-subnet-chip-outline", "suri-subnet-chip-fill", "suri-subnet-chip-text",
}

# Also keep vars that are purely non-color by their value type
def is_color_line(var_name: str, val: str) -> bool:
    if var_name in NON_COLOR_VARS:
        return False
    # Check value
    val = val.strip()
    if COLOR_VAL_RE.match(val):
        return True
    return False

# Parse and strip from base.css :root block
# Strategy: find the :root { ... } block and process line by line
lines = base_text.split("\n")
result = []
in_root = False
brace_depth = 0
i = 0

while i < len(lines):
    line = lines[i]

    if not in_root:
        if re.match(r"^:root\s*\{", line):
            in_root = True
            brace_depth = 1
            result.append(line)
            i += 1
            continue
        result.append(line)
        i += 1
        continue

    # Inside :root block
    brace_depth += line.count("{") - line.count("}")
    if brace_depth <= 0:
        in_root = False
        result.append(line)
        i += 1
        continue

    # Check if this starts a --var: declaration
    m = re.match(r"^(\s*)--([\w-]+)\s*:", line)
    if m:
        var_name = m.group(2)
        # Collect full declaration
        decl_lines = [line]
        j = i
        while j < len(lines) and ";" not in lines[j]:
            j += 1
            if j < len(lines):
                decl_lines.append(lines[j])

        full_decl = "\n".join(decl_lines)
        val_match = re.match(r"^\s*--[\w-]+\s*:\s*(.*?)\s*;", full_decl, re.DOTALL)
        val = val_match.group(1).strip() if val_match else ""

        should_strip = (var_name in tokens_only_names or is_color_line(var_name, val))
        # Never strip non-color vars
        if var_name in NON_COLOR_VARS:
            should_strip = False

        if should_strip:
            i = j + 1
            continue
        else:
            result.extend(decl_lines[:j-i+1] if j > i else [line])
            i = j + 1
    else:
        result.append(line)
        i += 1

# Rejoin and clean up
base_new = "\n".join(result)
base_new = re.sub(r"\n{3,}", "\n\n", base_new)

# Remove empty :root block comment sections (lone comment lines with no following vars)
base_new = re.sub(r"\n  /\* [^\n]+ \*/\n\n", "\n", base_new)

# Add @import at top
if not base_new.startswith('@import'):
    base_new = '@import "./tokens.css";\n\n' + base_new

base_file.write_text(base_new)
print(f"  Updated: shared/styles/base.css (stripped color vars, added @import)")

print("\nDone.")
