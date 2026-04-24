# Figma Component → CSS Class Map

This file replaces Code Connect for this vanilla HTML repo.
**AI rule:** When implementing from a Figma node, look up the component name here to get the correct CSS class and HTML structure. Never invent classes or inline styles.

Call `get_design_context(fileKey, nodeId)` on any entry below to get a screenshot and live specs.

---

## How to Use This File

1. Identify the Figma component name from the design you are implementing.
2. Find the matching entry below.
3. Use the exact CSS class(es) listed — do not invent alternatives.
4. Use CSS vars from `shared/styles/base.css` for all color/spacing/font values.
5. For confirmed node IDs marked ✓, you can call `get_variable_defs(fileKey, nodeId)` to get live token values.

## Shared Control Reuse Rule

- Shared primitives are mandatory when they already cover the need.
- Do not invent feature-local button sizes, toggle geometry, or padding contracts for shared controls.
- If a design appears to require an exception, cite the exact Figma node and record the exception in `Codex.md` and this file before implementation.

---

## Button

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**Node ID:** TBD — fetch with `search_design_system("button")`
**CSS source:** `shared/styles/components/buttons.css`

### Secondary Button (default variant)
```html
<button class="btn-secondary size-m">
  <span class="svg-icon" style="-webkit-mask-image: url(/icons/ui_core/icon_name.svg)"></span>
  <span class="btn-label">Label</span>
</button>
```
**Sizes:**
- `size-l` — 32px height, 14px text
- `size-m` — 28px height, 13px text (default shared button size)
- `size-s` — 24px height, 12px text (embedded CTA/icon control size)
- Only `size-l`, `size-m`, and `size-s` are valid shared secondary button sizes unless a documented exception exists.
- Use `size-m` by default.
- Use `size-s` only for CTA/icon controls inside a `32px` host or similarly constrained inline shell.
- Use `size-l` only for navbar and other explicit conditional placements.
- Do not create feature-local button heights, widths, or padding variants when one of these sizes already fits the use case.

**Icon-only:**
```html
<button class="btn-secondary-icon size-m" title="Action">
  <span class="svg-icon" style="-webkit-mask-image: url(/icons/ui_core/icon_name.svg)"></span>
</button>
```

**States:** hover → `color: var(--text-primary)`, active → add `.is-active`

---

## Sidebar Item Row

**Figma file:** `9Obt62HWohs3oEV4yPfVju` (Viewer)
**Node ID:** `2526:55793` (sidebar frame)
**CSS source:** `shared/styles/components/sidebar.css`
**JS source:** `shared/features/sidebar/sidebar-sot.js`

```html
<div class="sidebar-item-row" data-sidebar-kind="node" data-sidebar-level="1">
  <div class="sidebar-item">
    <span class="sidebar-item-icon svg-icon" style="-webkit-mask-image: url(...)"></span>
    <span class="sidebar-item-label">Label</span>
    <span class="sidebar-item-count">12</span>
  </div>
</div>
```

**States:**
- Hover: `.sidebar-item-row:hover`
- Active/selected: add `.is-active` to `.sidebar-item-row`
- Expanded: add `.is-expanded` to `.sidebar-item-row`
- `data-sidebar-kind`: `"node"` | `"group"` | `"section"` | `"integration"` | `"sensor"`
- `data-sidebar-level`: `"1"` | `"2"` | `"3"`

### Section Header
```html
<div class="sidebar-item-row" data-sidebar-kind="section">
  <div class="sidebar-section-header">
    <span class="sidebar-section-label">Section Name</span>
    <span class="sidebar-item-count">4</span>
  </div>
</div>
```

---

## Status Badge

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**Node ID:** `12944:22869` ✓ (confirmed MCP access)
**CSS source:** `shared/styles/components/ui-primitives.css`

```html
<div class="status-badge status-online">
  <span class="status-badge-icon"></span>
  <span class="status-badge-label">Online</span>
</div>
```

**Status modifier classes:**
| Class | Meaning | Color |
|---|---|---|
| `status-online` / `status-enabled` / `status-active` / `status-synced` | Healthy | Green `#006447` |
| `status-ready` / `status-syncing` / `status-uploading` | In-progress | Blue `#0045c0` |
| `status-paused` | Paused | Purple `#4b2dc2` |
| `status-offline` / `status-disabled` | Inactive | Muted gray |
| `status-warning` | Degraded | Orange/yellow |
| `status-error` | Error | Red/pink |

---

## Chip / Tag Label

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**Node ID:** `5257:9141` ✓ (confirmed MCP access)
**CSS source:** `shared/styles/components/ui-primitives.css`

```html
<span class="chip chip-gray">Label</span>
```

**Color variants:** `chip-gray` | `chip-orange` | `chip-pink` | `chip-yellow` | `chip-teal` | `chip-blue`

**Chip outlines (from Figma — matched to CSS vars):**
- Gray: `var(--ui-chip-gray-outline)` = `#575a65`
- Orange: `var(--ui-chip-orange-outline)` = `#da7e25`
- Pink: `var(--ui-chip-pink-outline)` = `#e26d8a`
- Yellow: `var(--ui-chip-yellow-outline)` = `#8f8900`
- Teal: `var(--ui-chip-teal-outline)` = `#4ead8b`
- Blue: `var(--ui-chip-blue-outline)` = `#4393ff`

---

## Badge

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**Node ID:** `7431:41514`
**CSS source:** `shared/styles/components/ui-primitives.css`

```html
<span class="ui-badge badge-green">Label</span>
```

**Fill variants (from Figma — matched to `--ui-badge-*-fill` CSS vars):**
| Class | `--ui-badge-*-fill` | Value |
|---|---|---|
| `badge-gray` | `--ui-badge-gray-fill` | `#474a53` |
| `badge-green` | `--ui-badge-green-fill` | `#0d6700` |
| `badge-teal` | `--ui-badge-teal-fill` | `#006447` |
| `badge-cyan` | `--ui-badge-cyan-fill` | `#005d7b` |
| `badge-purple` | `--ui-badge-purple-fill` | `#4b2dc2` |
| `badge-blue` | `--ui-badge-blue-fill` | `#0045c0` |
| `badge-brown` | `--ui-badge-brown-fill` | `#6c4c00` |
| `badge-pink` | `--ui-badge-pink-fill` | `#902146` |
| `badge-yellow` | `--ui-badge-yellow-fill` | `#5c5500` |

---

## Card / Accordion Panel

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**Node ID:** `16107:503755` (right-side element matrix)
**CSS source:** `shared/styles/components/ui-primitives.css`

### Static card
```html
<div class="card">
  <div class="card-header">
    <span class="card-title">Title</span>
    <div class="card-actions"><!-- buttons --></div>
  </div>
  <div class="card-body">
    <div class="card-row">
      <span class="card-label">Field</span>
      <span class="card-value">Value</span>
    </div>
  </div>
</div>
```

### Accordion card (expandable)
```html
<details class="card-accordion">
  <summary class="card-accordion-header card-header">
    <span class="card-title">Title</span>
    <span class="card-header-chevron">
      <span class="card-header-chevron-icon svg-icon" style="-webkit-mask-image: url(...)"></span>
    </span>
  </summary>
  <div class="card-body"><!-- rows --></div>
</details>
```

**Compatibility aliases:** Existing drawer markup may continue to include `ui-card` or `suri-card*` classes during migration, but new or touched card markup should include the canonical `card` / `card-accordion` semantics first. Card outlines use the shared inset `box-shadow`, not a CSS border. Accordion headers show the divider only while expanded.

---

## Toggle

**Figma file:** `e5FcbA4LEgrIssUL3558uC` (Design System 2026)
**CSS source:** `shared/styles/components/ui-primitives.css`

```html
<button class="suri-toggle is-on" role="switch" aria-checked="true">
  <span class="suri-toggle-thumb"></span>
</button>
```

**States:**
- Off (default): no modifier
- On: add `.is-on` — sets `background: var(--ui-toggle-active)` = `#2f53ff`
- Disabled: add `.is-disabled`
- Reuse `suri-toggle` by default for toggle behavior and geometry.
- Do not create feature-local lookalikes for shared toggle controls unless a documented exception exists.

---

## Checkbox

**CSS source:** `shared/styles/components/checkbox.css`

```html
<div class="sot-checkbox">
  <div class="sot-checkbox-box"></div>
</div>
```

**States:** `.is-checked`, `.is-mixed`

---

## Inspector Drawer

**Figma file:** `GHKqpRz85mBBev827PCgSN` (Alerts)
**Node IDs:** Drawer row shell `5873:160201`, Drawer dropdown panel `5889:160791`
**CSS source:** `shared/styles/components/inspector-drawer.css`

```html
<div class="inspector-drawer">
  <div class="inspector-drawer-header">
    <span class="inspector-drawer-title">Title</span>
    <div class="inspector-drawer-actions"><!-- buttons --></div>
  </div>
  <div class="inspector-drawer-content"><!-- content --></div>
</div>
```

---

## Dropdown Menu

**CSS source:** `shared/styles/components/ui-primitives.css`
**CSS vars:** `--ui-menu-fill`, `--ui-menu-shadow`, `--ui-menu-option-hover`

```html
<div class="ui-menu menu-list">
  <div class="menu-item">Item</div>
  <div class="menu-item menu-item-check is-active">Selected item</div>
  <div class="menu-item menu-item-cta">Action row</div>
  <div class="ui-menu-divider"></div>
  <div class="menu-item is-destructive">Delete</div>
</div>
```

Canonical menu semantics:
- `menu-item` is the base row class.
- `menu-item-check` is used for leading checkmark rows.
- `menu-item-toggle` is used for trailing toggle rows.
- `menu-item-cta` is used for rows with far-right action buttons.
- `menu-item-checkbox` is used for rows with checkboxes.
- `menu-list` is the canonical menu container class for shared dropdown/panel surfaces.

---

## SVG Icon Rule

**All monochrome icons use the CSS mask technique — never `<img>` tags.**

```html
<span class="svg-icon"
  style="-webkit-mask-image: url(/icons/category/icon_name.svg);
         mask-image: url(/icons/category/icon_name.svg);">
</span>
```

Icon inherits `currentColor` via the `.svg-icon` class. Set `color:` on the parent or the element itself to change the icon color.

**Icon categories:** `ui_core/`, `topology/`, `integration/`, `location/`, `status/`, `severity/`, `action/`, `data_type/`, `device_type/`, `annotation/`, `protocol/`, `timeline/`

---

## Node ID Quick Reference

| Component | Figma File | Node ID | MCP Verified |
|---|---|---|---|
| Status badges | Design System (`e5FcbA4LEgrIssUL3558uC`) | `12944:22869` | ✓ |
| Chips / Tags | Design System (`e5FcbA4LEgrIssUL3558uC`) | `5257:9141` | ✓ |
| Alerts table + toolbar | Alerts (`GHKqpRz85mBBev827PCgSN`) | `2764:46788` | ✓ |
| Sidebar frame | Viewer (`9Obt62HWohs3oEV4yPfVju`) | `2526:55793` | — |
| Badges | Design System (`e5FcbA4LEgrIssUL3558uC`) | `7431:41514` | — |
| Right-side element matrix | Design System (`e5FcbA4LEgrIssUL3558uC`) | `16107:503755` | — |
| Drawer row shell | Alerts (`GHKqpRz85mBBev827PCgSN`) | `5873:160201` | — |
| Drawer dropdown panel | Alerts (`GHKqpRz85mBBev827PCgSN`) | `5889:160791` | — |
