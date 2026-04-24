# Figma Context

## Connected Frame
- Root mockup URL: `https://www.figma.com/design/9Obt62HWohs3oEV4yPfVju/Viewer?node-id=2526-49508&m=dev`
- Sidebar node: `2526:55793`
- Sidebar name: `launcher_sidebarv1`

## Captured Sidebar Structure
- Header row with project/workspace selector: `HULA Base`
- Top utility action button on the right side of the header
- Search field below the header
- Quick action row: `New Collection`
- Grouped navigation sections including:
  - Presentations
  - Investigations
  - My Workflow 1
  - Networks
  - Security
  - Operations
  - Compliance
  - Dashboards

## Visible Interaction/Hierarchy Notes
- `Networks` is the visually selected row.
- Some groups are collapsed, some expanded.
- Nested tree items include multiple indentation levels.
- Count values appear on section headers and some nested rows.
- The visual style is low-contrast, dark, and compact, with blue emphasis on the selected row and input focus.

## What To Provide For Better Context
- Exact links for alternate states:
  - default
  - hover
  - expanded
  - collapsed
  - active/selected
- Links for destination views if sidebar clicks change surrounding layout
- Any product rules that Figma alone does not express, such as:
  - which items are clickable
  - selection behavior
  - accordion expansion rules
  - whether counts are static, computed, or hidden at times

## Recommended Prompt Style
- `Use docs/figma-context.md and implement this node exactly: <figma-url>`
- `Compare the current sidebar implementation to node 2526:55793 and list visual mismatches.`
- `Using AGENTS.md, Codex.md, and docs/figma-context.md, build the sidebar and ask for any missing states before final polish.`

## Alerts Tab Context (Mar 5, 2026)
- Alerts file URL: `https://www.figma.com/design/GHKqpRz85mBBev827PCgSN/Alerts`
- Primary table + toolbar frame: `2764:46788`
- Toolbar node: `2764:46789`
- Table header node: `2764:46791`
- First row/first cell structure: `2764:46802`
- Hosts chip cell node: `4197:311975`
- Last Seen link node: `2764:46803`
- Age link node: `2764:46804`
- Count bar cell node: `2764:46806`
- Hosts searchable dropdown menu: `4886:163414`

## Expanded Row / Drawer / Dropdown Context
- Expanded alert row mockup: `5258:166217`
- Expanded row container/table: `5258:166248`
- Expanded header: `5258:166259`
- Expanded selected nested row: `5258:166267`
- Expanded collapse row: `5810:156930`
- Drawer edit mode mockup: `5873:160178`
- Drawer toolbar + title: `5873:160181`
- Description card: `5873:160199`
- Enabled + Version row card: `5873:160201`
- Alert Parameters card: `5873:160205`
- Alert Filters card: `5873:160221`
- References card: `5873:160243`
- Subnet params dropdown menu: `5889:160791`

## Design System Chip Reference
- File URL: `https://www.figma.com/design/e5FcbA4LEgrIssUL3558uC/Design-System-2026`
- Chip component node: `5257:9141`
- Behavior used in prototype:
  - Project-selected subnets render as blue bordered chips with no remove affordance.
  - Manually typed subnets render as gray bordered chips with remove affordance.

## Design System Tableitem Source of Truth (Mar 6, 2026)
- Table item component node: `5104:15445`
- Table element variants node: `16317:291628`
- Canonical cell layout:
  - `Container`
  - `Checkbox Container` (optional/removable)
  - `Row Container`
  - `Cell`
  - `table_element` (content variant changes via `Type`)
- Alerts-specific rule:
  - Name column uses `table_element` type `Stacked`.
  - Other columns should map to their matching `table_element` type (chip/tertiary/value bar/text) rather than ad-hoc layouts.

## Design System 2026 References (Mar 8, 2026)
- File URL: `https://www.figma.com/design/e5FcbA4LEgrIssUL3558uC/Design-System-2026`
- Status badges component: `12944:22869`
  - Status icon slot is `16px` with internal `6px` status glyph.
  - Badge variants in use: `Online`, `Ready`, `Paused`, `Offline`, `Warning`, `Error`.
- User settings button layout (topbar): `29610:96558`
  - Uses secondary button language with `24px` leading avatar and `10px` chevron.
- User settings menu + appearance submenu: `29610:95102`
  - Menu chevrons in submenu triggers use `10px` icon in a `24px` trailing slot.
- Timeline sidebar structure reference: `21348:567845`
  - Protocol rows use protocol-family icons (16px) plus disclosure arrow and right-aligned count.

## Workspace Sidebar States (Mar 10, 2026)
- File URL: `https://www.figma.com/design/k8jUcmPgtIJKKThn5KCY3Z/Workspace`
- Expanded sidebar shell reference: `1497:97692`
  - Full workspace dropdown label shown.
  - Primary nav rows render label + count.
  - Favorites area is visible with accordion behavior.
- Collapsed sidebar shell reference: `1297:87591`
  - Sidebar collapses to an icon rail, not zero width.
  - Text labels, counts, and favorites list are hidden.
  - Rail controls remain available for re-expansion and quick access.
  - Runtime implementation may layer a transient hover/focus flyout over this collapsed rail for Viewer-only quick access, but the collapsed rail remains the base shell state.

## Sidebar Component Source-Of-Truth States (Mar 11, 2026)
- File URL: `https://www.figma.com/design/e5FcbA4LEgrIssUL3558uC/Design-System-2026`
- Sidebar item state references:
  - Default: `29721:32121`
  - Hover: `29721:32236`
  - Expanded: `29721:31712`
- Sidebar section/header state references:
  - Default: `12470:24871`
  - Hover: `12470:24880`
  - Pressed/Active: `12470:24891`
- Structural rules captured from nodes:
  - Right-side count uses a dedicated count wrapper container.
  - Right-side actions use a dedicated CTA container with `4px` padding and `4px` inter-button gap.
  - Sub-hierarchy naming is standardized as `sub-item`, `subsub-item`, and `subsubsub-item`.

## Component Source-Of-Truth Alignment (Mar 13, 2026)
- File URL: `https://www.figma.com/design/e5FcbA4LEgrIssUL3558uC/Design-System-2026`
- Right-side card element matrix: `16107:503755`
  - Canonical type names: `Input`, `Text`, `Icon Group`, `Tag Group`, `Description`, `Teletext`, `Progress Bar`, `Badge`, `Secondary Button`, `Tertiary Button`, `Primary Button`, `Secondary Button Icon`, `Dropdown`, `Switch`, `Segmented Control`, `Theme`, `Radio Button`, `Status Complete`, `Status Loading`, `Combo Box`, `Edit Profile`, `Rank`, `Avatar Group`, `Bar Graph`, `Outline Button`, `Search`, `Color Picker`, `Slider`.
  - `Teletext` replaces old local naming like `suri-token` when referring to the type.
- Tags and chips: `5257:9141`
  - Use chip color families from this node.
  - Preserve rounded vs square variants and the hover fill for each color.
  - Dismissable chips use the trailing close icon variant.
- Badges: `7431:41514`
  - `badge` refers to the filled label primitive with no status icon.
- Status badges: `12944:22869`
  - `status-badge` refers to launcher/runtime states like `Online`, `Ready`, `Paused`, `Offline`, `Warning`, and `Error`.
  - `Paused` uses the purple status family, not yellow.
- Manage Alerts drawer row shell: `5873:160201`
  - Drawer rows are the canonical accordion/card-row shell: `44px` row height, `8px 8px 8px 14px` padding, left label column, right element slot.
- Manage Alerts searchable dropdown: `5889:160791`
  - Use this menu shell for dropdown/select/combobox panels across the prototype.
