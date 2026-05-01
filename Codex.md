# Component Context Memory

This file is a durable contract for component semantics and styling in this workspace.

## Documentation Contract

### Scope
- Applies whenever a shared component contract, naming rule, or source-of-truth implementation changes.

### Git Workflow Contract
- Canonical Git workflow guide: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/docs/git-workflow.md`
- Before preparing a commit, summarize changed files, classify the work as MVP-facing or future-scope where relevant, confirm documentation updates, and state verification performed.
- Stage only files that belong to the requested change; leave unrelated local edits unstaged.
- Use conventional commit messages with the scopes documented in the Git workflow guide.

### Non-Negotiable Implementation Rule
- Update this file whenever a shared component semantic or styling rule changes.
- Do not invent ad-hoc component behavior if the rule can be recorded here and reused.
- Shared control reuse is mandatory:
  - documented button sizes are canonical
  - documented toggle primitives are canonical
  - documented padding contracts are canonical
  - default shared secondary button size is `size-m` (`28px`)
  - `size-s` (`24px`) is reserved for embedded CTA/icon controls inside `32px` hosts or similarly constrained shells
  - `size-l` (`32px`) is reserved for navbars and other explicit conditional placements, not as a default fallback
  - feature CSS must not redefine shared control height, width, padding, or toggle geometry when an existing primitive already covers the need
  - if a surface needs an exception, cite the exact Figma node first and record the exception in both `Codex.md` and `docs/figma-components.md` before implementation
- Reviewer/implementer checklist for shared controls:
  - before adding new control sizing or spacing, verify that no existing primitive already covers it
  - if one exists, reuse it
  - if none exists, document the new primitive first rather than shipping ad-hoc CSS
- Neutral failure-mode reminder:
  - do not introduce feature-local oversized buttons or custom toggle geometry for a ribbon or action bar without source-of-truth backing
- `AGENTS.md` remains the project instruction file.
- `Codex.md` is the component memory/source-of-truth companion document.

## Repository Structure

### Canonical Top-Level Folders
- `alerting-modal/` for the alerts modal document and modal-specific runtimes.
- `viewer/` for the project viewer shell and viewer-owned scripts/styles.
- `launcher/` for the workspace launcher shell and launcher-owned scripts/styles.
- `timeline/` for timeline-specific runtime and styling.
- `shared/` for shared data, shared sidebar runtime, and shared styling primitives.
- `icons/` for the lowercase canonical asset tree.
- `docs/` for project and feature documentation.
- `tmp/` for local harnesses and verification pages.

### Naming Rules
- Do not reintroduce `prototype/`, `Launcher/`, or `Icons/`.
- The canonical alert modal document is `alerting-modal/alert-modal.html`, not `alerting-modal/index.html`.
- The canonical viewer entrypoint is `viewer/viewer.html`.

## Sidebar Source Of Truth

### Scope
- Applies to Viewer sidebar, Launcher sidebar, and alerting-modal sidebar.
- Timeline sidebar items are excluded.

### Canonical Files
- Structure/state helpers: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/features/sidebar/sidebar-sot.js`
- Styling contract: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/sidebar.css`

### Figma Authorities
- Design file: `Design-System-2026`
- Sidebar item states:
  - Default: `29721:32121`
  - Hover: `29721:32236`
  - Expanded: `29721:31712`
- Sidebar section/header states:
  - Default: `12470:24871`
  - Hover: `12470:24880`
  - Pressed/Active: `12470:24891`

### Terminology
- `item`
- `sub-item`
- `subsub-item`
- `subsubsub-item`

### Color Rules
- Sidebar item default text: `var(--text-secondary)`
- Sidebar item hover/active text: `var(--text-primary)`
- Sidebar section/header default text: `var(--text-tertiary)`
- Sidebar section/header hover/pressed text: `var(--text-secondary)`
- Icon color must follow text color token through `currentColor` (for `icon_*` use cases).
- Launcher nav icon mapping rule:
  - `Feeds` uses `icon_feed.svg`
  - `Demo Projects` uses `icon_project_demo.svg`

### Required Row Class Contract
- Every sidebar row must include:
  - `sidebar-item-row`
  - one of: `sidebar-item` or `sidebar-section-header`
- Sidebar item state colors:
  - hover uses `--fill-accordion-hover` (`Fill/Accordion/Hover`)
  - active/focused uses `--fill-accordion-active` (`Fill/Accordion/Active`)
  - do not use menu-item fill tokens for sidebar row hover/active states
- Nested tree arrow/icon hover uses a neutral material hover fill (`--material-thin-white`), not active blue fill tokens.
- Sidebar row classes are intentionally composed: surface base (`side-row`), shared semantics (`sidebar-item-row sidebar-item`), tree variant (`side-tree-row`), and state flags such as `is-active`, `is-readonly`, `has-children`, `has-hover-cta`, and `has-count`.
- State flags:
  - `is-active`
  - `is-expanded`
- Data attributes:
  - `data-sidebar-kind` (`section` or `item`)
  - `data-sidebar-level` (`item`, `sub-item`, `subsub-item`, `subsubsub-item`)

### Required Right-Side Containers
- Count wrapper:
  - class: `count-container`
  - contains element with class `count`
- CTA wrapper:
  - class: `cta-container`
  - must use `4px` padding and `4px` inter-button gap
  - contains one or more `24px` secondary ghost icon buttons

### Hover Override Rules
- `has-hover-cta` controls hover swap behavior.
- If a row has `has-hover-cta`, count fades out on hover/context-open and CTA(s) fade in.
- If a row has no `has-hover-cta`, count remains visible on hover.
- Rows may have:
  - no count
  - no CTA
  - one CTA
  - multiple CTAs

### Canonical HTML Shape
```html
<button class="btn-reset row sidebar-item-row sidebar-item">
  <span class="row-content">
    <span class="row-main">
      <span class="item-label-group with-gap">
        <span class="tree-icon"><span class="svg-icon"></span></span>
        <span class="row-label">Label</span>
      </span>
    </span>
    <span class="count-container"><span class="count">8</span></span>
    <span class="actions cta-container">
      <button class="btn-reset btn-secondary-icon size-s style-ghost sidebar-action-button">
        <span class="svg-icon"></span>
      </button>
    </span>
  </span>
</button>
```

### Non-Negotiable Implementation Rule
- Do not invent alternate sidebar row structure/classes when implementing new sidebar work.
- Reuse `sidebar-sot.js` helpers and `styles/components/sidebar.css` rules.
- Viewer-only collapsed sidebar behavior may expose a transient interactive flyout from the collapsed trigger.
- That flyout must reuse the same canonical sidebar DOM/state rather than a second tree instance.
- The flyout is an overlay convenience state, not a second persistent navigation mode.
- The collapsed sidebar flyout slides in from the left edge below chrome and shares the same chrome sidebar width as the expanded shell.
- Viewer View notes are launched from the sidebar footer accordion `Notes` control, always follow the active View, and can live either as a docked sidebar tray or as a floating modal-style panel. The docked surface uses a single bottom accordion header, with the pin/unpin action kept separate from the expand/collapse trigger.
- View notes continue to use the saved View `savedMarkdown` lifecycle. Docked tray open/height and floating panel position/size are chrome UI state and must not be saved into View snapshots.
- Export belongs in the open notes toolbars, not the closed sidebar. The docked tray and floating panel both expose the same notes tools inline with the editor controls.
- Bottom-attached notes export menus must prefer opening upward from the footer toolbar, only falling back downward when there is not enough space above.
- The sidebar notes tray must resize with the sidebar width and use an invisible top-edge resize hit target, matching the existing panel resize affordance style.
- View rows and the topbar must not expose notes launchers unless product direction changes.

## Checkbox Source Of Truth

### Scope
- Applies to Launcher table selection checkboxes and any future drawer/dropdown checkbox usage.
- Only the checkbox primitive is SOT. Containers/wrappers around it are allowed to vary by context.

### Canonical File
- Styling contract: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/checkbox.css`

### Canonical Class Contract
- Primitive class: `sot-checkbox`
- State classes:
  - `is-checked`
  - `is-mixed`

### Non-Negotiable Implementation Rule
- Do not introduce new per-feature checkbox visuals when `sot-checkbox` can be used.
- Keep table cell and row wrappers context-specific, but checkbox visual state must come from `sot-checkbox`.
- The visual treatment for `sot-checkbox` follows the Suricata-style checked checkbox treatment used in alerting flows (`suri-subnet-checkbox.checked`), not the simpler combobox square.
- Unchecked checkbox fills must stay neutral (`--material-thin-white`); do not use active menu/sidebar fills for checkbox rest states.

## Rule Config Readonly Value Source Of Truth

### Scope
- Applies to readonly/non-editing simple-mode values in `Rule Config` only.
- Current users:
  - Suricata `Rule Config`
  - Default Alerts simple filter summary controls

### Canonical Files
- Markup helper: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`
- Suricata scope callsite: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/rule-scope-runtime.js`
- Styling: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`

### Canonical Class Contract
- Trigger class:
  - `suri-madlib-trigger is-readonly`
- Label class:
  - `suri-madlib-trigger-label`

### Non-Negotiable Implementation Rule
- Rule Config readonly values do not use `Teletext`.
- Render them as text-primary inline values with:
  - 24px control height
  - no fill
  - no chevron
  - no underline when there are zero or one applied madlib items
- When a readonly madlib summarizes multiple applied items:
  - show a dotted underline using `Text/Secondary`
  - render a scrollable hover/focus popover with each applied item
  - mark excluded items in the popover with an orange `!`
- On hover/focus for underlined madlibs:
  - underline changes from dotted to solid
  - underline color remains `Text/Secondary`
  - text remains `Text/Primary`
- Single-item readonly madlibs must not show a tooltip/popover because the inline value already contains the full item.
- Two-item readonly madlibs show both values inline joined with `and`.
- Three-or-more readonly madlibs summarize by item category, not include/exclude state; inclusion/exclusion details only appear in the popover.
- Do not introduce chevrons in readonly madlib state.

## Simple Madlib Multi-Select Menu Source Of Truth

### Scope
- Applies to simple-mode multi-select dropdown menus in alerting param editors.
- Current users:
  - Suricata `Rule Config` multi-select fields
  - Default Alerts simple filter dropdowns

### Figma Authority
- File: `Alerts`
- Node: `7725:260036`
- URL: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts?node-id=7725-260036&t=VsGXoMBo4a3w6h1y-11`

### Canonical Files
- Shared simple/default-alert menu rendering:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`
- Suricata scope simple menu rendering:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/rule-scope-runtime.js`
- Shared menu styling:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`

### Non-Negotiable Implementation Rule
- Structure must be:
  - stacked selection shell
  - divider
  - search row
  - divider
  - option list
- The top selection shell is not typable.
- Users may only remove chips from the top selection shell.
- Option rows must commit include/exclude via inline `+` and `-` Design System 2026 `button/secondary/icon_colored` buttons on the right.
- Option rows are a two-column layout:
  - left = value content
  - right = `+ / -` action buttons
  - do not preserve a dead checkbox column once the checkbox is removed
- Option rows with inline `+` and `-` action buttons must not show a row hover fill; only the buttons themselves may show hover affordance.
- Include/exclude action buttons use fixed `button/secondary/icon_colored` variants: include/`+` = blue, exclude/`-` = orange.
- Include/exclude action buttons inside menu items are fixed 24px square controls; do not use 26px or any other expanded local size.
- Include/exclude action button interaction states only change fill color. Stroke width, stroke color, glyph color, and shadow must remain stable across default, hover, active, pressed, and focus-visible states.
- Include/exclude action buttons must preserve their semantic blue/orange color on hover and active/pressed states; shared secondary-icon hover must not turn the glyph text-primary/white.
- This colored `+`/`-` treatment applies only to include/exclude menu CTAs, not generic add/remove, transform, chip remove, or drawer controls.
- Re-rendering after `+`, `-`, or chip removal must preserve list scroll position.
- The simple-mode selection shell for `suri-simple-menu-selection` is capped at `160px` tall and scrolls internally once it overflows.
- When a new chip is added or excluded in `suri-simple-menu-selection`, the shell snaps to the bottom so the newest chip stays visible.
- When Figma provides a chip or tag component link, preserve the attached runtime token bindings exactly; do not swap in a different color alias or hardcode a hex value.
- Chip close affordances must use existing repo icons from `icons/` through the SVG mask/icon system; do not use emoji, text glyphs, or ad-hoc assets.
- Listed menu rows use `--menu-row-padding-text-only` for text-only and text+CTA rows, and `--menu-row-padding-icon` for icon-bearing rows.
- Text-only and text+CTA rows keep `12px` left padding; icon-bearing rows use even `8px` padding on all sides.
- Menu styling is repo-wide source of truth:
  - semantic class names are canonical, not optional
  - local feature classes may only act as aliases or layout hooks
  - any exception must be narrowly scoped and documented
- Menu container semantics are repo-wide source of truth:
  - `menu-list` is the base menu container name.
  - legacy container names such as `suri-menu-panel`, `dropdown-menu`, `combobox-options`, `toolbar-dropdown-menu-body`, and `suri-scope-suggestion-panel` may remain as combo/layout aliases during migration, but new or touched container markup must also carry the canonical `menu-list` class.
  - container overrides should stay in feature-specific combo classes, not in the base `menu-list` contract.
- Canonical menu row semantics:
  - `menu-item` is the base menu row name.
  - `menu-item-check` is a `menu-item` with a leading check indicator.
  - `menu-item-toggle` is a `menu-item` with a trailing toggle switch.
  - `menu-item-cta` is a `menu-item` with far-right CTA buttons/actions.
  - `menu-item-checkbox` is a `menu-item` with checkbox controls.
- Legacy feature-specific names such as `suri-menu-option`, `suri-picker-option`, and `suri-scope-suggestion-item` may remain as layout compatibility aliases, but new or touched menu row markup must also carry the canonical `menu-item` class and the relevant `menu-item-*` modifier.
- Included chips use blue outline; excluded chips use orange outline.
- Rule chips use the Figma TagChipLabel token family directly:
  - blue include chips use `--tag-chip-label-blue-outline-strong` and `--tag-chip-label-blue-alpha-fill-hover`
  - orange exclude chips use `--tag-chip-label-orange-outline-strong` and `--tag-chip-label-orange-alpha-fill-hover`
  - default chip text uses `--text-secondary` and hovers to `--text-primary`
- In Suricata scope editors, variable search must work whether or not the operator prefixes the query with `$`.
- Scope variable option pools must include the shared runtime variables dataset so existing rule variables such as `HOME_PORTS` remain searchable in both Simple and Verbose edit flows.
- Default Alerts filter editors must track the Suricata scope interaction model:
  - Simple-mode summary labels use the same include/exclude-aware summary style as Suricata instead of generic count-only labels
  - Verbose-mode readonly values use the same readonly trigger/tooltip behavior as Suricata
  - port and subnet filter menus can surface shared rule variables, not only static project options
- In Default Alerts verbose filter menus, do not repeat the selected-chip shell at the top of the opened menu panel when the main field chipbox is already showing the selected chips.
- Host rows should render an icon from existing `icons/device_asset/...` assets when an appropriate asset exists.
- Protocol rows should render an icon from existing `icons/protocols/...` assets when an appropriate asset exists.
- Suricata Scope simple-mode protocol picker is backed by Figma node `1413:143746` in file `GHKqpRz85mBBev827PCgSN`.
  - It renders as a searchable `menu-list`.
  - Protocol rows use `menu-item menu-item-checkbox`, the shared `sot-checkbox` primitive, and existing protocol icons.
  - Protocol selection is true multi-select in the prototype UI.
  - Derived Suricata config may serialize only a single selected protocol; zero or multiple selected protocols serialize as `any` to avoid invalid rule-header syntax.
- `Unidirectional` must use `icon_arrow_short_right`.
- Do not invent a non-existent `icon_bidirectional` asset. If the requested asset is missing from the repo, use the nearest existing directional glyph as a temporary fallback and call that out explicitly.

## Rule Patterns Readonly Layout Source Of Truth

### Scope
- Applies to Suricata `Rule Patterns` rows in non-editing state.

### Non-Negotiable Implementation Rule
- Non-editing `Rule Patterns` rows must not render a grab slot or grab placeholder.
- Readonly `Rule Patterns` rows must collapse to a single content column instead of preserving the edit-state drag column.
- Readonly `Rule Patterns` must render as madlib sentences, not the edit-state row/grid layout.
- Readonly sentence copy stays on the left; value chips stay on the right.
- Dynamic pattern values and stored pattern metadata in readonly `Rule Patterns` stay as `Teletext` chips aligned right.
- Relation text such as `starts with`, `contains`, and `matches` must render as lowercase tertiary text, not `Teletext`.
- `HTTP Header` header-field text such as `user-agent` must render inline as lowercase tertiary text, not a chip.
- Readonly `Rule Patterns` must reflect the actual normalized `rulePatterns` data. Do not render a visual-only summary that drops active operators, offsets, transforms, region bounds, or active flags.
- Active readonly flag metadata renders as compact stored-keyword tokens such as `nocase`, `fast_pattern`, `multiline`, `dotall`, `raw bytes`, `relative`, or `negated`.

### Add Pattern Menu Contract
- The Rule Patterns header action must be labeled `Add Pattern`.
- The add menu must be searchable and scrollable.
- The add menu viewport must cap at roughly 10 visible rows before scrolling.
- Search must match across both the protocol family label and the keyword label.
- Menu rows use grouped labels in the form `Protocol ⋅ Keyword`.
- Added Rule Pattern cards use keyword-only titles with no protocol prefix.
- `Region` replaces `Search Range` and renders inline with the checkbox flags, pinned to the right side of the flags row as a label-plus-toggle control.
- The extra region inputs render on a separate row below only when the `Region` toggle is enabled.
- `Transform` renders inline with `Region` in the same CTA row for eligible content/regex patterns.
- When `Transform` is enabled, the transform chain renders above the base matcher and preserves selected transform order.
- `Byte Jump` is the actual Suricata pointer-moving pattern; do not reintroduce a generic `Set Position` toggle on content patterns.
- The rule-pattern catalog now includes the Figma-backed HTTP, TLS, File, SSH, DNS, SMTP, IP, Kerberos, SMB, NFS, FTP, Modbus, DNP3, and EtherNet/IP families that have added-pattern mockups.
- `File Hash`, `File Magic`, `SSH HASSH`, and `SSH HASSH Server` are selectable in the menu because added-pattern mockups now exist for them.
- MQTT and `SMB NTLMSSP User` / `SMB NTLMSSP Domain` remain menu-only disabled entries until editor mockups are supplied.
- The `Buffer Size` checkbox in rule-pattern rows is backed by the existing `rawBytes` field so the toggle survives normalization and serialization.
- Typing in the add-menu search and other in-place menu actions that do not intentionally reposition the user must preserve the current list scroll position.
- Items present in the Figma add-menu catalog but lacking a supplied editor mockup stay visible in the menu but disabled.
- Disabled catalog entries are a Figma/mockup coverage signal, not a hidden implementation detail. Do not silently remove them from the catalog.

## Teletext Source Of Truth

### Scope
- Applies to all `Teletext` tokens across the alerting modal and any other reused surfaces.
- Design source of truth:
  - Figma file: `Design-System-2026`
  - Node: `30436:169989`
  - URL: `https://www.figma.com/design/e5FcbA4LEgrIssUL3558uC/Design-System-2026?node-id=30436-169989&t=4nLeG0Ep4P6ZNzWa-11`

### Canonical Files
- Shared primitive styling:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/ui-primitives.css`
- Current readonly Rule Patterns usage:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`

### Non-Negotiable Implementation Rule
- `Teletext` is not a tertiary button substitute.
- `Teletext` must use:
  - Geist Mono
  - 12px size / 14px line height
  - 16px overall capsule height
  - `#3f424c` fill
  - `rgba(224,228,240,0.12)` border
  - `Text/Secondary`
- Do not restyle `Teletext` as a generic chip or tertiary action token.

## Shared Tooltip Mount Rule

### Scope
- Applies to the shared alerting-modal tooltip layer used by tables, drawers, chips, and readonly controls.

### Non-Negotiable Implementation Rule
- The shared tooltip element must mount to `document.body` for document roots.
- Only mount to a shadow root when the hovered target actually lives inside a shadow root.
- Do not append the tooltip element directly to the `document` node. That breaks rendering and produces help cursors with no visible tooltip.
- Tooltip targets must not force `cursor: help`.
- Tooltip-bearing elements should inherit the surrounding cursor so clickable rows keep pointer behavior and readonly drawer content stays neutral.

## Workspace Variables Modal Source Of Truth

### Scope
- Applies to the viewer navbar Variables trigger and the standalone workspace-level Variables modal.
- Workspace Variables remain workspace-level and are still triggered from the viewer navbar.
- Manage Alerts also exposes a Suricata-scoped Variables quick action in the sidebar; it reuses the shared Variables table/runtime but does not change workspace scope.

### Canonical Files
- Viewer trigger: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/viewer.html`
- Viewer trigger icon mapping: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/base.css`
- Viewer mount/context wiring: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js`
- Modal context helpers: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/core-runtime.js`
- Variables table/actions runtime: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/variables-runtime.js`
- Standalone modal boot/layout: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/script.js`
- Standalone no-sidebar styling: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`

### Canonical Trigger Contract

## Manage Alerts Suricata Modal Source Of Truth

### Scope
- Applies to the Suricata view inside the `Manage Alerts` modal.
- Figma sources:
  - Modal shell: `Alerts` file, node `7870:114595`
  - ET Pro full tree: `Alerts` file, node `7846:113230`

### Canonical Files
- Modal shell markup:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/alert-modal.html`
- Suricata sidebar tree + table data/runtime:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/content-browser-runtime.js`
- Suricata table column contract:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/table-runtime.js`
- Suricata drawer readonly-copy workflow:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`
- Suricata shell and table styling:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/style.css`

### Non-Negotiable Implementation Rule
- Top toolbar must contain:
  - functional search
  - sort dropdown
  - group dropdown
- Top toolbar must not render a separate status filter control.
- Sort and Group controls use the secondary outline button contract with chevrons.
- Import and Export live in the sidebar footer, not at the top of the sidebar tree.
- Suricata sidebar must keep the ET Pro subfolder tree.
- Suricata sidebar tree rows must reuse the existing sidebar row/count/collection-arrow contract instead of introducing a modal-only tree control pattern.
- Tree folders with children expand and collapse only from the hover arrow button in the icon slot.
- Clicking the row selects the node and updates the table/detail surface. It must not toggle expand/collapse.
- Tree rows must not be rendered as `<button>` elements when the icon slot contains an arrow `<button>`. The row shell must stay a non-button selection container, otherwise the browser will split the DOM and break the layout.
- Collection arrows stay hidden at rest, including expanded rows. They only appear on hover, matching the sidebar SOT.
- Suricata tree item rows with children do not use a right-edge arrow at all. They use the same `tree-icon` hover swap as the working tree:
  - default icon at rest
  - arrow replaces the icon on hover
  - expanded folders rotate that hover arrow
- The expand arrow button inside the `tree-icon` slot must not be interactive at rest.
  - `pointer-events` stay disabled until the parent row is hovered
  - the row body remains a pure selection target
  - the arrow slot becomes the only expand/collapse target once visible
- Suricata tree indentation and guide lines must use the same `indent-tracks / indent-track` structure as the working tree. Do not fake the tree using wrapper margins or border-left.
- Suricata depth mapping is literal:
  - ET Pro root = parent/item
  - `Active Threats`, `C2 & Reputation`, etc. = subfolders/sub-item
  - `Malware`, `Exploit`, etc. = sub-subfolders/subsub-item
- Suricata tree children must use the same accordion container model as the working tree:
  - `tree-children`-style grid collapse
  - `tree-children-inner` inner wrapper
- Read-only Suricata rows are source rules. They must not render the duplicate-source second line (`related SID | folder`). That meta line belongs only to duplicated/editable rules.
- Suricata table names truncate to a single line and expose the full rule name through the shared tooltip layer on hover.
- Suricata table selection uses its own leading checkbox column.
  - it does not replace or share the binary status-dot column
  - the status-dot column stays dot-only
- Default Alerts table body rows use a fixed 58px row contract.
- Alert tables use a split shell:
  - header table in its own non-scrolling container
  - body table in the scroll container
  - horizontal scroll is synced from body to header
  - the scrollbar range starts at the first data row, not at the header band
  - the split header shell must not introduce its own visual fill
  - header cells remain `position: relative` so column resize handles still work
  - toggle existing DOM classes instead of rerendering the full sidebar on expand/collapse
- The Suricata sidebar scroll container must keep the same inner padding feel as the working tree so row hover/active radii remain visible inside the sidebar bounds.
- The alerting-sidebar scroll container padding for tree surfaces is `6px 8px 18px`, matching the working tree inset. Do not reintroduce larger modal-only padding.
- Sidebar section headers stay expanded by default on first open. Only the nested Suricata roots/tree nodes stay collapsed by default; do not pre-expand ET Pro or custom/imported roots.
- Suricata sidebar counts must be derived from the live Suricata rule dataset, not hardcoded placeholder counts on the nodes.
- The imported Suricata root item must not render a `Read-only` badge in the sidebar.
- `Emerging Threats Pro` feed rules are readonly by default.
- `Emerging Threats Pro` sidebar counts represent catalog totals, not just the concrete rows currently surfaced in the table; the table can show a smaller sampled subset as long as the folder/count taxonomy stays coherent.
- Default Alerts are readonly source rules. Users must use `Make a Copy` before modifying them.
- Readonly Suricata feed selections must not expose the content-header settings button.
- Suricata content header actions must be:
  - `View Settings` as `Secondary Icon Button / Ghost / M` using `icon_view_settings`
  - `Threshold Settings` as `Secondary Icon Button / Ghost / M` using `icon_gear`
  - `Create New Rule` as `Secondary Button / Default / M` (`28px` height)
- The content-action order is right-aligned and must read left-to-right as:
  - `View Settings`
  - `Threshold Settings`
  - `Create New Rule`
- Top toolbar must not render a separate status filter control.
- Sort and Group controls use the secondary outline button contract with chevrons, `size-m`, and hugging width.
- If no sort or group is selected, the buttons read `Sort` and `Group`.
- If a sort or group is selected, the buttons read `Sort by: {column}` and `Group by: {column}`.
- Active sort/group menu items use `icon_check_menu_item` on the left of the label.
- Sort direction rows use:
  - `icon_sort_ascending` with trailing meta `A → Z`
  - `icon_sort_descending` with trailing meta `Z → A`
- `View Settings` is a column-visibility menu. It does not introduce new filter state.
- Users may only modify readonly Suricata rules by using `Make a Copy` from the drawer meatball menu.
- `Make a Copy` must target the editable `My Custom Detections` tree.
- `Create New Rule` uses the same dialog shell as `Make a Copy`, but the title is `New Rule` and the dialog fields are:
  - `Create from`
  - `Move to Folder`
- The copy/new dialog must support:
  - selecting an existing custom folder
  - creating a new custom detection
  - creating a new subfolder
- Custom detection folders/subfolders must be creatable from the copy workflow.
- Custom detection names must be renameable by double-click in the sidebar.
- The Suricata sidebar exposes a `Variables` quick action row directly under the Suricata section header, followed by a divider.
- That quick action reuses the shared Variables table/runtime and the `Add Variable` content action, but it stays scoped to Manage Alerts and does not replace the viewer navbar Variables trigger.
- Manage Alerts rule detail has three prototype view states:
  - list: table visible, no selected row, preview URL `/rules`
  - drawer: table visible with drawer open, preview URL `/rules?selected={ruleId}`
  - full: sidebar remains visible while the table/drawer are replaced by full detail, preview URL `/rules/{ruleId}`
- The fake preview URL is visual annotation only; do not use `history.pushState`, hash routing, `window.location`, or browser back/forward handling.
- The rule view format is a persistent preference owned by the table View Settings menu under `Rule detail view`:
  - `Drawer`
  - `Full content area`
  - changing the preference applies immediately to the currently open rule
  - the meatball remains rule actions only
  - the deeplink-style `/rules/{ruleId}` entry forces full view without overwriting the saved preference
- Full rule view reuses existing Suricata/Default Alert drawer content and controls. Variables drawer remains drawer-only.
- Full rule view is unframed page-in content, not a card/drawer shell: do not add a separate full-view background, border, or internal header divider.
- Derived Config must use the shared `card/suri-card` outer shell in both drawer and full-view contexts; `suri-rule-config-shell` is the inner code-pane primitive, not a standalone section container.
- Full rule view actions live inline in the existing content header action row with View Settings:
  - left side: `← Back to list`
  - right side: View Settings, `Edit` / `Save` / `Cancel`, and meatball menu
- Drawer-open mode must not dim or block the table. Analysts must be able to click another visible rule row to swap the drawer selection without closing the drawer first.
- When a Suricata drawer is open, the table uses a temporary compact column filter:
  - keep `select`, `led`, `action`, `name`, `speed`, `lastSeen`, `hits`, `status`
  - hide `sid`, `class`, `created`, `updated`
  - preserve the user's normal View Settings choices when returning to list view
- In the Suricata drawer, rule rename is owned by the `Name` metadata row in edit mode.
- The `Folder` metadata row uses the editable custom-folder hierarchy only; ET Pro and other read-only folders remain protected.
- `Assign to Project` and `Publish to Library` are not valid options in Manage Alerts.
- Suricata table rows must use a two-line name cell:
  - line 1 = rule name
  - line 2 = related SID + folder source
  - related SID uses `icon_routing_change`
  - related SID and folder source are separated by a divider
- Suricata table name cells truncate to a single line and expose the full rule name through the shared modal tooltip.
- Suricata leading status indicator is binary only:
  - green = enabled
  - gray = disabled
- The Suricata leading status slot must not use raster images. It uses inline SVG with `currentColor`.
- Suricata table status column uses:
  - rule-state tags only
  - no `Enabled` / `Disabled` chips because the first status-dot column already communicates enabled state
  - the only allowed status chips in this scope are `Read-only` and `Broken`
  - ET Pro and Default Alerts source rules show `Read-only` as a gray tag
  - duplicated/custom editable copies do not receive a `Duplicate` status tag
- Status chips must stay on one line. If the visible chip budget is exceeded, collapse the remainder into a rounded `+n` chip with a hover tooltip listing the hidden statuses.
- `Broken` uses the Figma pink/error treatment with `icon_error_fill`, pink alpha fill, and `TagChipLabel/Pink/OutlineStrong` where available.
- Do not introduce `Managed`, `Custom`, or `Draft` state tags in the Suricata table.
- ET Pro and Default Alerts remain read-only even when they carry `Broken`.
- Custom copied rules are editable because they live under `My Custom Detections`, not because of a status tag.
- The viewer-mounted Manage Alerts iframe host uses `.alerting-modal-host` and is currently sized to `1500px` max width, not the standalone modal width.
- The ET Pro read-only drawer banner copy is: `This rule is read-only. To customize, duplicate it and edit the copy.`
- In the Suricata rule drawer:
  - `Enabled` lives in its own card
  - `Version` + `Priority` share a second card
  - `SID` + `Class` share a third card
  - the `Version/Priority` and `SID/Class` cards sit side by side
- In the Default Alerts drawer:
  - `Enabled` lives in its own card
  - `Version` lives in its own separate card
- The Suricata table keeps the separate checkbox column visible at rest, and the checkbox visual must use the shared `sot-checkbox` primitive.
- The Suricata table renders the full current result set as one continuous scrollable list; it does not page Suricata rows into 50-row slices.
- The Suricata table header uses the same visible `sot-checkbox` primitive as a master toggle for the full current result set, including mixed state when only some rows are selected.
- The Suricata table `col-select` header and body cells use the combo class `col-select-combo`: both cells are fixed at `40x40`, have zero padding, and center the checkbox.
- In Suricata rule meta rows, the reference SID item opens the original read-only rule drawer, and the folder item jumps the sidebar/table context to that original folder.
- Icons from `icons/ui_core/collection/` that are expected to follow state color must render through the mask-based `.svg-icon` path, not as `<img>` tags.
- Bulk selection keeps the same checkbox column visible and adds row highlight state; it does not gate checkbox visibility.
- Bulk selection in the Suricata table shows the Figma-style floating multi-select ribbon inside the table shell, below the table content, with:
  - `Delete` only when every selected rule is editable
  - `Export`
  - bulk enable/disable toggle for editable selected rules
- The Suricata bulk ribbon collapses by measured available width, not viewport breakpoints:
  - `full`: inline `Delete`, `Export`, and inline enable/disable toggle
  - `compact`: `Delete` and `Export` move into a meatball overflow menu; the inline toggle remains visible
  - `smallest`: the meatball overflow menu contains `Delete`, `Export`, and the enable/disable control as a `menu-item-toggle` row; the ribbon shows only the meatball button
- The overflow trigger uses the shared `btn-secondary-icon size-m style-ghost` meatball button.
- Overflow menu rows must reuse shared menu primitives:
  - `Delete` = destructive menu row
  - `Export` = standard menu row
  - divider between `Delete` and `Export`
  - enable/disable in the smallest state = `menu-item-toggle`
- Bottom-anchored ribbons and action bars must open overflow menus into visible space above the trigger; do not reuse the default downward dropdown placement on bottom-fixed or bottom-anchored surfaces.
- Ribbon overflow menus must use a valid shared `menu-list` structure with rows as direct menu children; do not wrap plain shared `menu-item` rows in `toolbar-dropdown-menu-body` unless the full toolbar row helper structure is also being used.
- The bulk status toggle text reflects the editable subset it will change:
  - `Enable N Rules` when any selected editable rules are currently disabled; clicking only enables that disabled editable subset
  - `Disable N Rules` only when all selected editable rules are enabled
- Read-only Suricata bulk selections keep `Export` but must not show `Delete` or the bulk status toggle.
- Mixed editable/read-only selections must also hide `Delete` so the ribbon never implies a partial destructive action.
- The multi-select ribbon must not include a generic `Clear Status` action.
- Suricata ET Pro seed data should stay in the low-thousands so search, grouping, pagination, and bulk actions can be validated under realistic table density.
- Suricata `Hits` and `Speed` columns use the same filled-value treatment as the Alerts table count column, not flat text.
- Threshold Settings uses the shared drawer shell as its own drawer variant:
  - title = `Set Thresholds`
  - header actions = `Cancel`, `Save`
  - `Simple` mode = sentence/madlib layout
  - `Verbose` mode = row-and-slider layout
- ET Pro rule drawers must render a read-only banner as the first item in `drawer-content`.
- If an ET Pro rule also carries operational statuses, render those status banners below the read-only banner in the same drawer stack.
  - no `Edit` button
  - no drawer meatball button
  - cards = `Slow Performance`, `Noisy Volume`, `Staleness`
  - each card has its own `Simple / Verbose` mode toggle
- Drawer version-history contract:
  - `Version` is view navigation, not an editable field.
  - non-editing state may open a version selector for current and older saved versions.
  - selecting an older version switches the drawer into read-only historical view and shows an older-version banner.
  - historical versions must not expose `Edit`, and non-edit controls like `Enabled` must be disabled in that state.
  - edit mode renders `Version` as static text only.
  - saving edits creates a new current version automatically and prepends it to stored version history.
- Viewer topbar trigger id:
  - `workspaceVariablesButton`
- Button class contract:
  - `btn-reset`
  - `btn-secondary-icon`
  - `size-m`
  - `style-ghost`
- Icon class:
  - `svg-icon-programming-variable`
- Icon asset:
  - `icons/ui_core/collection/icon_programming_variable.svg`

### Non-Negotiable Implementation Rule
- Workspace Variables must open the alerting modal in `workspace-variables` context.
- In `workspace-variables` context:
  - sidebar is hidden
  - modal title is `Variables`
  - the existing Variables table/actions layout is reused
  - `Projects` uses the same metric pill treatment as `Values`, `Used By`, and `Referenced By`
  - `Created` and `Updated` are underlined tertiary buttons with a full timestamp hover tooltip
  - outbound `referenceItems` are the canonical variable dependency source; inbound `Referenced By` counts and tooltips are derived from a reverse index
  - clicking a variable row opens the shared right-side drawer in `variables` variant
  - the variable drawer reuses existing drawer/card/row/chipbox primitives rather than introducing a second drawer implementation
- The Manage Alerts sidebar Variables quick action stays visible only inside the Suricata section and must keep the viewer navbar Variables trigger as the workspace-level entry point.

## Canonical Alerting Graph Source Of Truth

### Scope
- Applies to Variables, Manage Alerts, and Viewer Alerts.

### Canonical Files
- Alerting graph bootstrap: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/alerting-data.js`
- Shared workspace data merge point: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/app-data.js`
- Manage Alerts runtime: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/content-browser-runtime.js`
- Variables runtime: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/variables-runtime.js`
- Viewer Alerts runtime: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js`

### Non-Negotiable Implementation Rule
- There is one canonical alerting graph, exposed through `window.TeleseerAppData.alerting`, that feeds all alert-related surfaces.
- Variable labels, `valueCount`, tooltips, drawer entries, `Used By`, `Referenced By`, and `Projects` must all be derived from the same graph.
- `SSH_PORTS`-style port counts are derived from literal values and inclusive ranges, not hardcoded display counts.
- Viewer alert groups and Manage Alerts rule rows must reference the same canonical rule ids wherever they describe the same detection.
- ET Pro realism matters: the canonical graph should keep a dense read-only vendor catalog, with concrete rows only representing the inspectable sample, not the full inventory size.

## Alerting Modal Mount Source Of Truth

### Scope
- Applies to the viewer-mounted Manage Alerts modal and the viewer-mounted Workspace Variables modal.

### Canonical Files
- Viewer host shell: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/viewer.html`
- Viewer mount/runtime: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/scripts/alerts-feature.js`
- Host sizing/styling: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/viewer/styles/alerts.css`
- Canonical modal document: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/alert-modal.html`
- Modal context bootstrap: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/core-runtime.js`

### Non-Negotiable Implementation Rule
- The viewer must mount the real `alerting-modal/alert-modal.html` inside `alerting-inline-root` using `iframe.alerting-inline-frame`.
- Do not reconstruct the alerting modal by copying its HTML/CSS/JS into a shadow root.
- Context must be passed through the iframe URL:
  - `surface=manage-alerts`
  - `surface=workspace-variables`
- Embedded viewer mounts must also pass `embed=viewer` so the standalone modal overlay/padding is disabled inside the iframe host.
- If the mounted viewer modal diverges from the standalone modal, fix the standalone modal or the iframe host, not a shadow-mounted fork.
- Rule and variable tables must render explicit neutral empty-state rows for empty/search-empty results; do not leave table bodies blank.

## Alerting Rule Data Source Of Truth

### Scope
- Applies to Manage Alerts rule rows and the Suricata / Default Alert drawers.

### Canonical Files
- Rule seed / normalization source: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/alerting-data.js`
- Rule runtime normalization: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/content-browser-runtime.js`
- Drawer state construction: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/alerting-modal/drawer-runtime.js`

### Non-Negotiable Implementation Rule
- Drawer state must be derived from the selected rule record, not from drawer-local canned HTTP/DNS examples.
- Rule rows, drawer state, search, regrouping, and viewer linkage must all read from the same canonical rule record.

## Inspector Drawer/Card/Row Source Of Truth

### Scope
- Applies to Launcher right-side feed drawer and future inspector-style drawers.
- Drawer shell, card shell, and row primitives are shared.
- Right-side content inside rows can vary per feature (toggle, text, dropdown, badge, button, etc.).
- The system intentionally has two drawer shell colors:
  - app-level drawers use `--drawer-shell-bg`
  - drawers inside modals use `--modal-drawer-shell-bg`
- Figma's uniform `linear-gradient(...)` layers represent stacked flat fills, not visual gradients. Drawer implementations consume the semantic shell tokens instead of copying those exported layer stacks locally.

### Canonical File
- Card styling contract: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/ui-primitives.css`
- Drawer and row styling contract: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/inspector-drawer.css`

### Canonical Class Contract
- Drawer:
  - `suri-drawer`
  - `suri-drawer-header`
  - `suri-drawer-header-left`
  - `suri-drawer-title`
  - `suri-drawer-actions`
  - `suri-drawer-content`
- Card:
  - `card` for static cards
  - `card-accordion` for expandable cards
  - `card-header`
  - `card-accordion-header`
  - `card-title`
  - `card-actions`
  - `card-body`
  - Legacy compatibility aliases may remain during migration: `suri-card`, `suri-card-header`, `suri-card-title`, `suri-card-actions`, `suri-card-body`
- Row:
  - `suri-row`
  - `suri-row-label`
  - `suri-row-value`

### Non-Negotiable Implementation Rule
- Use the SOT classes above instead of creating per-feature card/row lookalikes.
- Preserve SOT metrics from this contract: `8px` radius, shared card fill, and `0.5px` inset `box-shadow` outline.
- Card outlines are shadows, not borders.
- Accordion headers show a divider only while expanded; collapsed headers must not render a divider because it visually doubles with the card outline.
- Drawers and inspector panels must reuse these card primitives instead of feature-local card shells.
- Launcher feed drawer shell behavior:
  - `launcher-feed-drawer-shell` is absolute/floating.
  - opening the drawer dims `launcher-surface`.
  - drawer enter uses eased slide-in animation.

## Status Badge Source Of Truth

### Scope
- Applies to all status indicators in Launcher and shared prototype surfaces.
- Use this status primitive for table cells, drawer rows, and sync/status labels.

### Canonical File
- Styling contract: `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/components/ui-primitives.css`

### Canonical Class Contract
- Base:
  - `status-badge`
  - `status-badge-icon`
  - `status-badge-label`
- Canonical variants:
  - `status-online`
  - `status-ready`
  - `status-paused`
  - `status-offline`
  - `status-warning`
  - `status-error`
- Alias variants (mapped to canonical color sets):
  - `status-active`
  - `status-enabled`
  - `status-syncing`
  - `status-uploading`
  - `status-disabled`
  - `status-initializing`
  - `status-restricted`
- `status-read-only`

## User Settings Source Of Truth

### Scope
- Applies to the top-right user settings trigger, primary user settings menu, and theme submenu in Viewer and Launcher.

### Canonical Files
- Structure contract:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/launcher/launcher.html`
- Icon render contract:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/launcher/launcher.css`
- Shared styling contract:
  - `/Users/renzdupitas/Desktop/Teleseer Mockups/teleseer-dummy/shared/styles/base.css`

### Canonical Class Contract
- Trigger:
  - `user-settings-button`
  - `user-avatar`
- Primary menu:
  - `user-settings-menu`
  - `menu-item`
  - `user-menu-item-main`
  - `svg-icon`
  - `svg-icon-ready`
  - `user-menu-icon`
  - `user-menu-toggle`
  - `user-submenu-chevron`
- Theme submenu:
  - `user-theme-menu`
  - `menu-item`
  - `user-theme-check`
  - `active`

### Non-Negotiable Implementation Rule
- Viewer and Launcher must use the same markup shape for the user settings trigger and both menus.
- Do not use Viewer-only generic menu row variants for this control.
- Do not inline per-icon sizing for this control; icon sizing must come from the shared user settings contract.
- User settings icons must render as inline SVG inside the shared `svg-icon svg-icon-ready` shell for both Viewer and Launcher.
- Menu item rows across shared primitives and app-specific menus use `32px` min-height.
- Do not reintroduce `36px` heights for dropdown, popover, or listbox option rows.
- `status-queued`
  - `status-synced`
  - `status-behind`

### Non-Negotiable Implementation Rule
- Do not use custom per-feature status dot/chip implementations (for example `launcher-status`).
- Status rendering must resolve to `status-badge` with one of the variants above.

## Table Cell Fill Rule

### Scope
- Applies to Launcher tables (and should be followed by future table implementations unless explicitly overridden by product requirements).

### Rule
- `th` and `td` must not have fill/background color.
- Fill is allowed only at row interaction states:
  - row hover
  - row selected
- Active blue tokens are reserved for active states only, never for passive structural chrome:
  - `--fill-table-active` only for active/selected table rows
  - `--fill-menu-item-active` only for active/selected menu or dropdown items
  - `--fill-tab-active` only for active tab or segmented-control surfaces
  - `--fill-accordion-active` only for active/focused sidebar rows
  - never use these tokens for borders, dividers, shells, cards, or inset shadows that are not the active state itself
- Dense tables use the Suricata resize-handle divider contract:
  - the visible column boundary is the resize handle line, not a passive `th` border
  - the at-rest handle line is `--material-medium-white`
  - hover/resizing switches the handle line to `--stroke-active`
  - do not use `--divider-table-default` as the primary column divider on Launcher tables
  - the header row still keeps its own horizontal divider using a neutral structural token; only the vertical column boundaries move to the handle line
- Launcher table columns should use the shared `LauncherTableSOT` resize behavior when a section owns configurable columns.
- Launcher table sections with configurable columns expose `View Settings` as a secondary icon ghost medium button using `icon_view_settings`.
- Launcher Projects `Name` cells are single-line, name-only cells. Do not render workspace/subnet metadata as a second line in the Projects table.
- Feeds table `Type` column is plain text (no badge/chip treatment).

## Feeds Filter Control Pattern

### Scope
- Applies to Feeds toolbar filters in Launcher.

### Rule
- Filters live inside `launcher-toolbar-left`, positioned to the right of search.
- Use custom dropdown triggers built from `btn-secondary size-l style-outline` with chevron.
- Label typography for trigger text:
  - key (`Feed Type` / `Status`) uses medium weight
  - selected value uses regular weight
- Do not use native `<select>` for these controls.
- Feeds start/stop actions use:
  - `Start`: `btn-secondary size-m style-outline` with `icon_play.svg`
  - `Stop`: warning/yellow `btn-secondary-colored` treatment with `icon_pause.svg`

## Feeds Source Of Truth

### Scope
- Applies to Launcher `Feeds` table, feed create flow, and feed detail drawer.

### Current Product Truth
- Only `Network Capture` is live today.
- `Folder Watch` and `App/Integration` remain visible only as planned states in the create flow.
- Live source types under `Network Capture`:
  - `Napatech`
  - `Generic Interface`

### Create Flow Contract
- Step 1 combines:
  - `Category`
  - `Source Type`
- Step 2 is capture configuration, not a generic source form.
- Step 3 is summary/review.

### Required Capture Fields
- `Name`
- `Description`
- `Capture Device`
- `Capture Input`
- `Output Folder`
- `Chunk Size (MB)`
- `Close & Process Every (seconds)`
- `Retention (days)`
- Traffic filter fields
- Napatech-only:
  - `Port Layout`

### Source Semantics
- Feed `source` is derived from:
  - `Capture Device`
  - `Capture Input`
- Do not treat `source` as a separate free-form source-of-truth field in the Launcher create flow.

### Drawer Contract
- Feed drawer overview must distinguish:
  - `Category`
  - `Source Type`
  - `Source`
- Feed drawer subtitle format:
  - `Feed Type · Source`
- Configuration card title is `Capture Settings`.
- Separate editable filter card title is `Filter Rules`.
- Separate read-only rule visibility card title is `Suricata Rules`.
- History card title is `History`.
- Subscribed project management is read-only in Launcher:
  - users can inspect subscribed projects here
  - subscribe/unsubscribe actions belong in Project Viewer
- Capture Settings rows should reflect the live capture model:
  - `Capture Device`
  - `Capture Input`
  - `Port Layout` when applicable
  - `Output Folder`
  - `Chunk Size`
  - `Close & Process Every`
  - `Retention`
  - `Source Details`
  - `Filter Rules`
  - `Raw BPF`

### Table Contract
- `Type` means `Feed Type`:
  - `Network Capture`
  - `Folder Watch`
  - `App/Integration`
- Do not render feed type as a badge or chip.
- Feed icons under the `Name` column must reflect the actual source type:
  - `Napatech` -> Napatech icon from `Icons`
  - `Generic Interface` -> ethernet icon from `Icons`
- Add a `Files` column using:
  - `{total} · {errorCount}E / {warningCount}W`
- Active capture rows do not show `Active` text.
  - show capture/download rate with `icon_arrow_short_down.svg`
- Syncing rows must show percentage in the badge label.
- `Initializing` is labeled `Starting`.
- Feed rows support an expandable produced-files accordion:
  - paginated
  - filter states: `All`, `Warn`, `Error`
- If subscribed project count is `0`, render `-` in the table instead of `0 Projects`.
- Do not append inline `Stale` or `No subscriptions` warnings inside the table cells.

### Device Management Boundary
- Napatech firmware and card-level port mode/layout are device-level concerns.
- A feed may link to device management, but the feed itself is not the source of truth for shared Napatech hardware administration.

## Geist Font Weight Source Of Truth

### Scale
- Light: `300`
- Regular: `400`
- Medium: `500`
- SemiBold: `600`
- Bold: `700`

### Shared Tokens
- `--font-weight-light`
- `--font-weight-regular`
- `--font-weight-medium`
- `--font-weight-semibold`
- `--font-weight-bold`

---

## Color Token System

### Scope
- Applies to every CSS file in the project that uses or defines a color value.
- This rule is non-negotiable and must be followed absolutely.

### Canonical Files
- **Definitions (write here only):** `shared/styles/tokens.css`
- **Source of truth (read only):** `shared/styles/figma-color-tokens.json`
- **Regeneration scripts:** `tmp/generate-tokens.py` (produces `tokens.css`) · `tmp/apply-renames.py` (propagates renames)

### Naming Convention
CSS variable names are derived from the Figma token JSON path:
1. Strip the `Colors/DarkMode/` or `Base Colors/DarkMode/` prefix
2. Convert the remaining path to kebab-case: `/` → `-`, space → `-`, ` - ` → `-`
3. Convert PascalCase segments to kebab-case (e.g. `NavbarViewer` → `navbar-viewer`)
4. Lowercase everything

| Figma Token Path | CSS Variable |
|---|---|
| `Colors/DarkMode/Text/Primary` | `--text-primary` |
| `Colors/DarkMode/Material/Ultra Thin - White` | `--material-ultra-thin-white` |
| `Colors/DarkMode/Material/Ultra Thin - Black` | `--material-ultra-thin-black` |
| `Colors/DarkMode/Surface/Drawer` | `--surface-drawer` |
| `Colors/DarkMode/Surface/NavbarViewer` | `--surface-navbar-viewer` |
| `Colors/DarkMode/TagChipLabel/Blue/Fill` | `--tag-chip-label-blue-fill` |
| `Colors/DarkMode/Fill/MenuItem/Hover` | `--fill-menu-item-hover` |
| `Base Colors/DarkMode/Cyber/Blue/300` | `--cyber-blue-300` |
| `Base Colors/DarkMode/Military/Black/700` | `--military-black-700` |

### Non-Negotiable Implementation Rules
1. **One file only.** Color CSS custom properties must be defined exclusively in `shared/styles/tokens.css`. No other CSS file may declare a `--*` color variable.
2. **Names must match Figma exactly.** Variable names must follow the kebab-case conversion of the Figma token path above. Do not invent names.
3. **Values must match Figma exactly.** Variable values must be the resolved hex value from `figma-color-tokens.json`. Do not hardcode ad-hoc hex values.
4. **No invented variables.** If a needed color is not in `figma-color-tokens.json`, find the closest token by RGB distance and document the approximation. Do not introduce a new variable.
5. **No local shadowing.** Do not redefine or shadow a token in any component or feature CSS file.
6. **Regeneration protocol.** When `figma-color-tokens.json` is updated, re-run `tmp/generate-tokens.py` to regenerate `tokens.css`, then re-run `tmp/apply-renames.py` to propagate any renames. Do not hand-edit token names or values.

---

## Design Token Reference Table

**AI rule:** Never hardcode hex values or raw pixel values for colors, fonts, or structural spacing. Always resolve to the CSS var in `shared/styles/tokens.css`. `shared/styles/figma-color-tokens.json` is the design-token source of truth for validating exact Figma mappings.

### Text Colors
| CSS Variable | Value | Figma Variable | Usage |
|---|---|---|---|
| `--text-primary` | `#f7f8fbeb` | `Text/Primary` ✓ | High-emphasis labels, headings |
| `--text-secondary` | `#f7f8fba3` | `Text/Secondary` ✓ | Default body text |
| `--text-tertiary` | `#f7f8fb5c` | `Text/Tertiary` ✓ | Muted/supporting text |
| `--text-quaternary` | `#f7f8fb24` | `Text/Quaternary` ✓ | Ghost/faint text |
| `--text-error` | `#f7809a` | `Text/Error` ✓ | Error state text/icon |
| `--text-positive` | `#56b13e` | `Text/Positive` ✓ | Success state text/icon |
| `--text-highlight` | `#c0c477` | `Text/Highlight` ✓ | Warning/highlight text |
| `--text-exclude` | `#d28249` | `Text/Exclude` ✓ | Orange/exclude accent |
| `--text-link` | `#7ba1ff` | `Text/Link` ✓ | Interactive link text |
| `--text-active` | `#7ba1ff` | `Text/Active` ✓ | Active state text |

### Accent & Primary
| CSS Variable | Value | Figma Variable | Usage |
|---|---|---|---|
| `--primary` | `#2f53ff` | `Primary` ✓ | Core primary color |
| `--accent-blue` | `#0068f8` | `AccentBlue` ✓ | Primary interactive accent — buttons, focus rings, selections |
| `--accent-ultra-blue` | `#2f53ff` | `AccentUltraBlue` ✓ | Strong accent (toggle-on, active selection) |
| `--stroke-active` | `#217dff` | `Stroke/Active` ✓ | Active stroke / focus ring |

### Surface & Background
| CSS Variable | Value | Figma Variable | Usage |
|---|---|---|---|
| `--app-theme-bg` | dynamic | Theme runtime alias | App-wide base background; changes with body theme class |
| `--modal-shell-bg` | dynamic | Modal shell alias | Layered modal shell background; uses modal surface over 80% `--app-theme-bg` |
| `--modal-shell-shadow` | dynamic | Modal shell alias | Modal inner shadow, hairline stroke, and drop shadow |
| `--modal-shell-backdrop-filter` | `blur(38px)` | Modal shell alias | Modal blur strength |
| `--modal-shell-radius` | `10px` | `Radius/2XL-Window` ✓ | Centered modal radius |
| `--modal-shell-surface` | `var(--material-thin-white)` | `Surface/Modal` ✓ | Modal surface overlay |
| `--modal-shell-inner-shadow` | `var(--material-ultra-thick-white)` | `Effects/Modal/InnerShadow` ✓ | Modal inset highlight |
| `--modal-shell-drop-shadow` | `var(--material-intense-black)` | `Effects/Modal/DropShadow` ✓ | Modal hairline shadow |
| `--modal-shell-drop-shadow-2` | `var(--material-medium-black)` | `Effects/Modal/DropShadow 2` ✓ | Modal outer drop shadow |
| `--drawer-shell-bg` | dynamic | Drawer shell alias | App-level / Launcher drawer background; layers `--surface-drawer` over `--content-area` over `--app-theme-bg` |
| `--modal-drawer-shell-bg` | dynamic | Modal drawer shell alias | Modal-contained drawer background; layers `--surface-drawer-dark` over `--content-area` over `--app-theme-bg` |
| `--surface-drawer-dark` | `var(--material-ultra-thin-black)` | `SurfaceDrawerDark` | Modal drawer top-layer alias derived from `Material/Ultra Thin - Black` |
| `--drawer-shell-shadow` | dynamic | Drawer shell alias | Drawer inset border plus drop shadow |
| `--drawer-shell-backdrop-filter` | `blur(38px)` | Drawer shell alias | Drawer blur strength |
| `--drawer-shell-radius` | `8px` | Drawer shell alias | Drawer radius |
| `--border-drawer` | `var(--material-thick-white)` | Drawer border alias | Drawer inset border color |
| `--theme-midnight` | `#101214` | `Theme/Midnight` ✓ | Static Midnight theme color |
| `--theme-space` | `#101014` | `Theme/Space` ✓ | Static Space theme color |
| `--theme-cadet` | `#121212` | `Theme/Cadet` ✓ | Static Cadet theme color |
| `--surface-drawer` | `#fefefe0a` | `Surface/Drawer` ✓ | Drawer surface fill |
| `--surface-popover` | `#151619` | `Surface/Popover` ✓ | Popover/menu surface fill |
| `--surface-tab-panel` | `#fefefe0a` | `Surface/TabPanel` ✓ | Tab pill active fill |
| `--surface-navbar-viewer` | `#fefefe0a` | `Surface/NavbarViewer` ✓ | Viewer navbar surface |
| `--surface-sidebar` | `#fefefe14` | `Surface/Sidebar` ✓ | Sidebar fill |

### Strokes & Dividers
| CSS Variable | Value | Figma Variable | Usage |
|---|---|---|---|
| `--stroke-default` | `#fefefe66` | `Stroke/Default` ✓ | Default border/stroke |
| `--stroke-subtle` | `#fefefe3d` | `Stroke/Subtle` ✓ | Subtle border |
| `--stroke-faint` | `#fefefe1f` | `Stroke/Faint` ✓ | Faint/ghost border |
| `--divider-menu-list` | `#e0e4f01f` | `Divider/MenuList` ✓ | Menu list dividers |

### Interactive States
| CSS Variable | Value | Figma Variable | Usage |
|---|---|---|---|
| `--fill-accordion-hover` | `#e0e4f014` | `Fill/Accordion/Hover` ✓ | Sidebar item hover |
| `--fill-accordion-active` | `#4f6dff38` | `Fill/Accordion/Active` ✓ | Sidebar item active/focused |
| `--fill-menu-item-hover` | `#e0e4f014` | `Fill/MenuItem/Hover` ✓ | Menu/dropdown item hover |
| `--fill-menu-item-active` | `#4f6dff38` | `Fill/MenuItem/Active` ✓ | Menu/dropdown item active/focused |
| `--fill-table-active` | `#2f53ff33` | `Fill/Table/Active` ✓ | Active/selected table row only |
| `--fill-table-hover` | `#fefefe1f` | `Fill/Table/Hover` ✓ | Table row hover |
| `--fill-tab-active` | `#fefefe0a` | `Fill/Tab/Active` ✓ | Active tab pill fill |

Menu list separators use `--divider-menu-list` (`Divider/MenuList`). Do not use menu item hover/active fills or material overlay colors for menu list divider rules.
Card row, drawer row, group header, and Rule Pattern row separators also use `--divider-menu-list` so structural dividers do not inherit active blue state fills.

### Typography Quick Reference
| Token | Value | Figma Variable |
|---|---|---|
| `--font-family-base` | `"Geist", "Geist Sans", sans-serif` | `Font/Family/Geist` ✓ |
| Default body: 13px / 16px / Regular | — | `Teleseer Geist/XS/XS` ✓ |
| Label: 12px / 14px / Medium | — | `Teleseer Geist/2XS/2XS-Medium` ✓ |
| Caption: 11px / 14px / Regular | — | `Teleseer Geist/3XS/3XS` ✓ |
| Heading-S: 14px / 18px / Regular | — | `Teleseer Geist/S/S` ✓ |

### Radius Scale (from Figma)
| Usage | Value | Figma Variable |
|---|---|---|
| Labels, inline badges | `3px` | `Radius/XS-Label` ✓ |
| Chips, tags | `4px` | `Radius/S-Tags` ✓ |
| Buttons, inputs | `6px` | `Radius/M-Button` ✓ |
| Cards, panels (`--radius`) | `10px` | — |
| Pill-shaped | `20px` | `Radius/3XL-Round` ✓ |

✓ = value confirmed from `shared/styles/figma-color-tokens.json` / `tokens.css`.
