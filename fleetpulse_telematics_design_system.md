---
name: "FleetPulse Telematics"
description: "High-contrast dark industrial design system for real-time fleet maintenance, fuel telemetry, and predictive diagnostics."
---

## Overview

FleetPulse Telematics is built for fleet operations managers, dispatchers, and maintenance engineers who monitor heavy-duty commercial vehicles in real time. The interface embodies an **industrial, high-contrast dark mode** aesthetic: disciplined, data-dense, and immediately scannable under control-room or cab lighting conditions.

Every visual decision prioritizes operational clarity. High-luminance status signals—Electric Blue for active telemetry, Amber for mild warnings, and Vivid Crimson for critical fuel or engine faults—stand out against a deep slate/charcoal canvas (`#121824`) so anomalies surface in under a second.

## Colors

The palette anchors on a deep slate/charcoal ground (`#121824`) with stepped neutral container tiers for visual hierarchy without heavy borders. Exact brand and telemetry status hexes are preserved alongside contrast-compliant Material dark-mode semantic roles for text and interactive surfaces.

- **Slate Background (`#121824`)**: Primary application canvas, reducing eye strain in 24/7 dispatch environments.
- **Electric Blue (`#3B82F6`) & Primary (`#ADC6FF`)**: Active vehicle states, selected filters, and primary interactive controls.
- **Amber (`#F59E0B` / `#FFB95F`)**: Mild maintenance warnings, elevated coolant temperatures, and excessive idling thresholds.
- **Vivid Crimson (`#EF4444` / `#FFB3AD`)**: Critical DTC fault codes, sudden fuel drop alerts (>10% in 5 minutes), and urgent service flags.
- **Active Green (`#10B981` / `#4EDEA3`)**: Healthy operational status and optimal engine health scores.

```yaml
colors:
  slate-bg: "#121824"
  electric-blue: "#3B82F6"
  amber-accent: "#F59E0B"
  vivid-crimson: "#EF4444"
  active-green-accent: "#10B981"
  primary: "#ADC6FF"
  on-primary: "#002E6A"
  primary-container: "#4D8EFF"
  on-primary-container: "#001C46"
  secondary: "#B1C6F9"
  on-secondary: "#182F59"
  secondary-container: "#304671"
  on-secondary-container: "#9FB5E7"
  tertiary: "#FFB786"
  on-tertiary: "#502400"
  tertiary-container: "#DF7412"
  on-tertiary-container: "#351600"
  error: "#FFB3AD"
  on-error: "#68000A"
  error-container: "#930013"
  on-error-container: "#FFDAD7"
  background: "#121824"
  on-background: "#DDE2F3"
  surface: "#121824"
  surface-dim: "#0D131F"
  surface-bright: "#333946"
  surface-container-lowest: "#080E1A"
  surface-container-low: "#161C28"
  surface-container: "#1A202C"
  surface-container-high: "#242A37"
  surface-container-highest: "#2F3542"
  on-surface: "#DDE2F3"
  surface-variant: "#424754"
  on-surface-variant: "#C2C6D6"
  outline: "#8C909F"
  outline-variant: "#424754"
  inverse-surface: "#DDE2F3"
  inverse-on-surface: "#2A303D"
  inverse-primary: "#005AC2"
  amber: "#FFB95F"
  on-amber: "#472A00"
  amber-container: "#653E00"
  on-amber-container: "#FFDDB8"
  active-green: "#4EDEA3"
  on-active-green: "#003824"
  active-green-container: "#005236"
  on-active-green-container: "#6FFBBE"
  shadow: "#000000"
  scrim: "#000000"
```

## Typography

Typography pairs **Schibsted Grotesk** for crisp, authoritative headers and KPI numerals with **Reddit Sans** for high-legibility UI labels and table cells, and **Spline Sans Mono** (`tabular-nums`) for vehicle IDs, DTC fault codes, coordinates, and live sensor readings.

```yaml
typography:
  display-md:
    fontFamily: "Schibsted Grotesk"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: -0.5px
  display-md-mobile:
    fontFamily: "Schibsted Grotesk"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Schibsted Grotesk"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "Schibsted Grotesk"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: "Reddit Sans"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  body-md:
    fontFamily: "Reddit Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Reddit Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "Reddit Sans"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Reddit Sans"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.4px
  mono-md:
    fontFamily: "Spline Sans Mono"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0px
  mono-sm:
    fontFamily: "Spline Sans Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.2px
```

## Layout & Spacing

The dashboard uses a **12-column Fluid Grid** with a 1440px max container width on desktop (`lg:` and `xl:`), collapsing cleanly to 2-column and single-column stacks on tablet (`md:`) and mobile (`sm:`). An 8px base rhythm (`gutter-sm: 8px`, `gutter-md: 16px`, `gutter-lg: 24px`) keeps KPI cards, telemetry charts, and the engine health matrix aligned.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 32px
  page-margin: 24px
```

## Elevation & Depth

Depth is achieved through **tonal surface layering** and **low-contrast ghost borders** (`outline-variant` at subtle opacity) rather than heavy drop shadows. The canvas sits at `#121824`, primary dashboard cards step up to `surface-container` (`#1A202C`), and interactive drawers, modals, or active hover states step to `surface-container-high` (`#242A37`).

## Shapes

Corners are crisp and engineered: `8px` (`DEFAULT`) for cards and chart panels, `6px` (`sm`) for buttons, inputs, and DTC code badges, and `9999px` (`full`) for status indicator dots and health score progress bars.

```yaml
rounded:
  sm: 6px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  full: 9999px
```

## Motion & Micro-interaction

Transitions are crisp and mechanical, providing immediate feedback without distracting from live telemetry. Interactive filter toggles and row selections respond within `120ms`, while vehicle drill-down panels enter smoothly over `200ms`.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 200ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice**: Direct, technical, and operational. Alerts state the exact fault, unit ID, and threshold breach (e.g., `"Fuel Drop Alert: FL-104 lost 14.2% in 4m"`).
- **Capitalisation**: Sentence case for section titles and descriptions; uppercase `mono-sm` for vehicle IDs (`FL-101`), OBD-II/J1939 DTC codes (`P0300`), and status pills.
- **Numbers & Units**: Always use `tabular-nums` for telemetry metrics, odometer readings (`142,300 km`), fuel economy (`7.4 MPG` or `31.8 L/100km`), temperatures (`92°C`), and percentages (`74.5%`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html` — `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html` — `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html` — `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Searchbar** → `@components/searchbar.html` — `searchbar-standard`, `searchbar-with-suggestions`
- **Table** → `@components/table.html` — `table-standard`, `table-interactive`, `table-selectable`
