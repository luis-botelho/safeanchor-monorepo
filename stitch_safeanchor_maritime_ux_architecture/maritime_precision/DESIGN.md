---
name: Maritime Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#cedaf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d7e3fc'
  on-surface: '#0f1c2e'
  on-surface-variant: '#43474d'
  inverse-surface: '#253144'
  inverse-on-surface: '#ebf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#00152a'
  on-primary: '#ffffff'
  primary-container: '#102a43'
  on-primary-container: '#7a92b0'
  inverse-primary: '#b0c9e8'
  secondary: '#3e646c'
  on-secondary: '#ffffff'
  secondary-container: '#bee7ef'
  on-secondary-container: '#426970'
  tertiary: '#001819'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e31'
  on-tertiary-container: '#429ca3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#c1eaf2'
  secondary-fixed-dim: '#a5cdd6'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#254c54'
  tertiary-fixed: '#9af1f7'
  tertiary-fixed-dim: '#7dd4da'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f53'
  background: '#f9f9ff'
  on-background: '#0f1c2e'
  surface-variant: '#d7e3fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-mono-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: '0'
  data-mono-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for mission-critical maritime operations, port logistics, and deck inspections. It bridges rugged maritime dependability with high-density, modern enterprise SaaS performance. 

The aesthetic is characterized by **Tactile Precision and Industrial Utilitarianism**:
- **Operational Calm:** High-stakes seafaring environments demand low visual fatigue, decisive contrast, and zero ambiguity. Visuals convey poise and structural authority.
- **Nautical Utilitarianism:** Inspired by vessel bridges, navigational interfaces, and maritime instrumentation. Surfaces rely on hairline tectonic borders, systematic data grouping, and clear mechanical hierarchy rather than decorative flourishes.
- **Deck & Dock Ergonomics:** Built to serve dual contexts: high-density multi-pane desktop monitoring for fleet coordinators, and high-contrast, thumb-driven touch interactions for port workers and deck officers wearing work gloves under harsh maritime glare.

## Colors

The palette grounds the interface in deep oceanic depths while maintaining high contrast across bridge screens, harsh dock daylight, and low-light night watches.

### Palette Architecture
- **Primary (`#102A43` - Deep Ocean Navy):** Structural backbone for primary actions, navigation shells, commanding headers, and authoritative operational controls.
- **Secondary (`#123C43` - Abyss Teal):** Intermediate surface fills, secondary active states, table header panels, and structural grouping boundaries.
- **Tertiary (`#167D83` - Sea Teal):** Interactive highlights, active navigational nodes, progress indicators, and precise focal points.
- **Neutral Canvas & Surfaces:**
  - `Canvas Base`: `#F2F6F5` (Light Mist) provides a low-strain, glare-resistant field.
  - `Card / Sheet Background`: `#FFFFFF` (Pure White) delivers crisp foreground separation.
  - `Borders & Rules`: `#D8E2DE` provides crisp, hairline definition between operational panels.
- **Typography & Ink:**
  - `Text Primary`: `#344054` (Slate Text) ensures AA/AAA contrast ratios against light mist backgrounds without the harshness of pure black.
  - `Text Muted`: `#667085` (Muted Slate) used strictly for non-critical metadata, units of measurement, and inactive labels.

### Operational Status Tokens
Operational states use precise signal pigments calibrated against the maritime base palette:
- **Operational / Ready (`#16835D`):** Vessel cleared, seaworthy, inspection passed. Subtle wash: `#E8F5F0`.
- **Warning / Due Soon / Planned (`#C78624`):** Approaching compliance window, maintenance required, caution advised. Subtle wash: `#FDF6EC`.
- **Critical / Overdue / Non-Ready (`#C54848`):** Detention risk, expired certification, no-sail advisory. Subtle wash: `#FDF2F2`.
- **Informational / Demo (`#167D83`):** Simulation, test runs, non-blocking telemetry. Subtle wash: `#E8F4F5`.

## Typography

The typographic hierarchy prioritizes rapid scanning, absolute legibility, and zero confusion between critical data points (such as coordinates, knot speeds, and IMO numbers).

- **Typeface Selection:** Inter is applied across all levels. It delivers crisp micro-legibility at compact table densities, tall x-heights for sunlight reading, and robust glyph disambiguation.
- **Tabular Numerics (`tnum`, `zero`):** All numerical displays—including IMO registrations, voyage timestamps, coordinates, drafts, and readiness counts—must enforce `font-feature-settings: "tnum" 1, "zero" 1`. This aligns data columns vertically without layout shifting during live telemetry sync.
- **Restrained Scale:** Operational software emphasizes dense, well-proportioned informational hierarchies over large display styles. Font sizes above 24px are reserved strictly for page roots, aggregate KPI callouts, and top-level deck views.
- **Uppercase Data Labels:** Sub-labels, equipment serial tags, and status headers use `label-sm` with 0.04em tracking and uppercase casing for rapid industrial parsing.

## Layout & Spacing

The layout balances information density on multi-screen desk displays with rugged finger-touch ergonomics on portable tablets and handhelds.

### Grid & Layout Strategy
- **Desktop (1024px+):** 12-column fluid grid system with `gutter-desktop` (24px) and outer canvas margins of `margin-desktop` (32px). Accommodates dense split-pane fleet manifests, live dock schematics, and nested audit logs.
- **Tablet / Deck Tablet (768px - 1023px):** 8-column layout with 16px gutters and 20px margins. Sidebars collapse to icon rails; table panes convert to stacked inspection cards.
- **Mobile Handheld (320px - 767px):** 4-column layout with 16px margins. Bottom action sheets and sticky footer controls replace floating action dialogs.

### Touch Targets on Deck
Any touch interactive target on viewports under 1024px must maintain a minimum physical hit area of **44x44px** (with 48px preferred for critical action buttons), even if visual label bounds are compact. This ensures reliable operation with damp fingers or work gloves during gangway, dock, or engine room inspections.

## Elevation & Depth

Visual hierarchy uses crisp tectonic framing rather than deep blurred shadows. Maritime bridge displays and outdoor rugged tablets suffer when low-contrast drop shadows wash out in ambient sunlight.

### Layering Philosophy
- **Base Canvas:** `#F2F6F5` (Light Mist) sets the grounded, glare-controlled background.
- **Structural Elevation (Low-Contrast Outlines & Hard Planes):** Containers rely on a 1px solid border (`#D8E2DE`) combined with white surfaces (`#FFFFFF`). This establishes sharp, tactile compartments reminiscent of marine physical control instrumentation.
- **Level 0 (Flat / Embedded):** Unraised table rows, sub-panels, and search trays. Border: `1px solid #D8E2DE`, No shadow.
- **Level 1 (Cards & Data Units):** Default deck cards, vessel tiles, and inspection checklists. 
  - Border: `1px solid #D8E2DE`
  - Shadow: `0px 1px 3px rgba(16, 42, 67, 0.06), 0px 1px 2px rgba(16, 42, 67, 0.04)`
- **Level 2 (Dropdowns, Popovers, Active Focus):** 
  - Border: `1px solid #C1D0CA`
  - Shadow: `0px 4px 8px -2px rgba(16, 42, 67, 0.08), 0px 2px 4px -2px rgba(16, 42, 67, 0.04)`
- **Level 3 (Modal Dialogs & Critical Inspection Sheets):**
  - Backdrop: `rgba(16, 42, 67, 0.45)` with 2px backdrop blur.
  - Border: `1px solid #123C43`
  - Shadow: `0px 12px 24px -4px rgba(16, 42, 67, 0.16), 0px 4px 8px -2px rgba(16, 42, 67, 0.08)`

## Shapes

The design system enforces a **Soft Structural (`1`)** shape language:
- Standard elements (cards, input fields, badges, buttons) use a base radius of **0.25rem (4px)**.
- Grouped dialogs and bottom sheets use `rounded-lg` **0.5rem (8px)**.
- Large modal shells use `rounded-xl` **0.75rem (12px)**.
- Fully rounded pills are strictly limited to numeric count tags and readiness status badges.

This tight corner geometry produces an architectural, instrument-like feel, maximizes pixel-grid efficiency for high-density tables, and prevents the interface from feeling playful or decorative.

## Components

### Buttons
- **Primary:** Deep Ocean Navy background (`#102A43`), white text, 4px corner radius. In hover/active states, shifts to Abyss Teal (`#123C43`). Subtle top-edge inset highlight creates a sturdy, tactile click feel.
- **Secondary:** White background with 1px border (`#D8E2DE`), text `#344054`. Hover state transitions to Mist surface (`#F2F6F5`) with a darkened border (`#C1D0CA`).
- **Critical / Danger:** Non-ready crimson (`#C54848`) solid fill with white text for irrevocable deck commands (e.g., "Report Detention", "Fail Checklist").
- **Touch Sizing:** Desktop compact button height is 36px; mobile and tablet inspection modes enforce a minimum height of 46px.

### Readiness & Status Badges
Badges are compact, high-visibility capsules indicating operational compliance:
- **Ready:** Green text (`#16835D`), background `#E8F5F0`, border `1px solid #B8E4D3`.
- **Overdue / Critical:** Red text (`#C54848`), background `#FDF2F2`, border `1px solid #F5C2C2`.
- **Due Soon / Warning:** Amber text (`#C78624`), background `#FDF6EC`, border `1px solid #F4DCB4`.
- **Planned / Demo:** Sea Teal text (`#167D83`), background `#E8F4F5`, border `1px solid #BFDFE1`.
- **Styling:** Pill geometry (`rounded-full`), `11px` uppercase bold font (`label-sm`), containing a 6px solid status dot on the leading edge.

### Inspection Cards
- Enclosed with 1px solid `#D8E2DE`, pure white background, 4px border radius.
- Includes a 3px accent stroke on the left edge denoting the active state (e.g., `#16835D` for compliant hold, `#C54848` for flagged violation).
- Padding adapts from desktop (`space-lg`) to compact handheld checklist mode (`space-md`).

### Input Fields & Controls
- **Form Inputs:** Border `1px solid #D8E2DE`, background `#FFFFFF`, text `#344054`. Active focus ring uses a crisp 2px stroke in Sea Teal (`#167D83`) with no blurry glow.
- **Checkboxes & Radios:** High-contrast mechanical checks. 18x18px minimum desktop box; 22x22px on inspection tablets. Checked state fills with `#102A43` displaying a crisp white icon.

### High-Density Data Tables
- Header cells: `#F2F6F5` background, uppercase `11px` tracked text, 1px bottom border.
- Row zebra striping is avoided; rows are separated by single hairline borders (`#EDF2F0`).
- Selected rows tint with `#E8F4F5` and a left border in Sea Teal (`#167D83`).
- Numeric columns right-align with enforced `font-feature-settings: "tnum" 1`.

### Maritime Domain Additions
- **Vessel Telemetry Gauge:** Compact progress meter displaying fuel, ballast balance, or draft levels using Sea Teal and Deep Ocean Navy segments.
- **Deficiency Tracker Strip:** Horizontal segmented bar showing PSC (Port State Control) inspection finding counts by risk tier (low, medium, code 30 detainable).