# FleetPulse Telematics — Fleet Maintenance & Fuel Telemetry Dashboard

An elite, industrial dark-mode telematics command platform built for heavy-duty commercial fleet dispatchers and maintenance engineers. Engineered according to Google Stitch UI specifications and the FleetPulse Telematics design system.

---

## 🚀 Tech Stack
- **Framework**: React 19 (Modular Functional Components & Hooks)
- **Styling**: Tailwind CSS 3.4 (`#121824` Slate canvas, stepped surface containers)
- **Icons**: Lucide React & Google Material Symbols
- **Charting & Geospatial Engine**: High-performance client-side SVG/Canvas telemetry vector renderers (Dual-Axis Fuel % vs. Distance, Idling Fuel Waste Bar Chart, Real-Time Sensor Sparklines)
- **Build Tool**: Vite 6 (Compiled production bundle ready for instantaneous deployment)

---

## 🏗️ Architectural Overview & Component Protocol

### 1. KPI Header (`src/components/KPIHeader.jsx`)
Four high-contrast operational summary cards with real-time reactive calculations:
- **Total Active Fleet Count**: Visualizes operational readiness (`7 / 8`), dynamic WoW deltas, and fleet breakdown (Active, Idle, Critical Fault). When an individual vehicle is isolated, transforms into the unit's operational profile and odometer summary.
- **Real-Time Fuel Economy Average**: Displays weighted fleet fuel economy (`7.6 MPG` or `30.9 L/100km`) with a one-click metric unit toggle, delta vs. dispatch target, and burn rate.
- **Fleet Carbon Emissions**: Calculates CO2 metric tons dynamically scaled to the active monitoring timeframe (`24h`, `7d`, `30d`, `Custom`).
- **Critical Maintenance Alerts**: Employs strict color hierarchy (**Vivid Crimson `#EF4444`** for critical faults like fuel drop >10% and OBD-II misfire codes; **Amber `#F59E0B`** for warning thresholds like excessive idling >120m).

### 2. Interactive Asset Tracking Map (`src/components/TrackingMap.jsx`)
- **Geospatial Vector Rendering**: Real-time canvas/SVG projection mapping latitude and longitude (`37.58°N - 37.92°N`, `-122.54°W - -122.12°W`) across the San Francisco Bay, Port of Oakland, and Interstate freight corridors (I-80, I-580, I-880, US-101).
- **Realistic Vehicle Kinematics**: Active vehicles smoothly traverse their routes with directional heading indicators, speed tags, and live coordinate readouts.
- **State-Aware Status Markers**: Color-coded nodes (Active Green `#10B981`, Idle Amber `#F59E0B`, Critical Crimson `#EF4444`) with animated radar pulse rings.
- **Interactive Drill-Down**: Clicking any vehicle node immediately triggers drill-down isolation with an animated cyan target reticle.
- **Hover Inspection Popovers**: Displays real-time speed, tank %, health score, driver, and active trouble codes.

### 3. Fuel Management Hub (`src/components/FuelManagementHub.jsx`)
- **Dual-Axis Chart (Fuel % vs. Distance)**:
  - Left Y-Axis: Fuel Tank Level (`0% - 100%`) in Vivid Electric Blue (`#3B82F6`) with gradient area underlay.
  - Right Y-Axis: Distance Traveled (`km`) in Amber (`#F59E0B`) with dashed step progression.
  - Anomaly Flag Marker: Highlights sudden fuel drop events (`-14.2% in 5m`) with pulsing red callout.
  - Precise Hover Tooltips: Crosshair tracking column displaying exact timestamp, fuel %, distance, and consumption rate.
- **Excessive Idling Time Bar Chart**:
  - Highlights top 5 vehicles flagged for idle fuel waste.
  - Color-coded severity thresholds: Normal (<60m), Amber Warning (60-120m), Vivid Crimson Critical (>120m).
  - Displays computed fuel waste gallons and idle cost benchmarks.
  - Click-to-isolate vehicle integration.

### 4. Engine Health & Diagnostic Matrix (`src/components/EngineHealthMatrix.jsx`)
- **Search & Filtering**: Instant search across Unit ID, Model, Driver, and DTC codes; status filter dropdown (All, Active, Idle, Critical Fault).
- **Sorting & Pagination**: Column sorting across Unit ID, Odometer, Fuel Level, and Health Score, with 5 vehicles per page.
- **Dynamic Health Score Coloring**:
  - 🔴 **Red (`#EF4444`)**: Health Score `< 50%` (Urgent maintenance required)
  - 🟡 **Yellow / Amber (`#F59E0B`)**: Health Score `50% - 80%` (Warning / scheduled service approaching)
  - 🟢 **Green (`#10B981`)**: Health Score `> 80%` (Optimal operating condition)
- **OBD-II & J1939 DTC Diagnostic Badges**: Interactive code badges (`P0300`, `P0171`, `P0128`, `SPN 3226`) with tooltip fault explanations.
- **Row Click Isolation**: Smoothly transitions the dashboard into vehicle drill-down mode.

### 5. Telemetry Logic Integration (`src/App.jsx`)
- **Automated Fuel Drop Alert Surveillance**: An internal watcher function monitors the fleet array on every telemetry tick. When `fuel_drop_5m_pct > 10%` is simulated or detected, it immediately appends a "Critical" alert with timestamp to the top notification stack.
- **Interactive Simulator Control**: Includes a "Test Fuel Drop" action button in the operational header to simulate sudden fuel drop anomalies on demand for testing and validation.
- **Vehicle Drill-Down State Management**: Selecting any vehicle across the Map, Health Matrix table, Idle chart, or Alert pills isolates the vehicle across all dashboard components. Includes an active drill-down banner with an "Exit Drill-Down" action and `Escape` key shortcut.

---

## 📊 Comprehensive 8-Vehicle Dataset (`src/data/fleetData.js`)

| Vehicle ID | Make / Model | Status | Health | Fuel % | 5m Drop % | Idle Today | DTC Codes | Primary Route |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **FL-101** | Freightliner Cascadia | Active | 88% | 74.5% | 0.4% | 45m | None | I-80 Corridor East |
| **FL-102** | Volvo VNL 860 | Active | 94% | 81.2% | 0.3% | 28m | None | Oakland Harbor Delivery |
| **FL-103** | Kenworth T680 | Idle | 71% | 52.0% | 0.2% | 134m | `P0128` | I-580 Staging Yard |
| **FL-104** | Peterbilt 579 | Critical | 42% | 31.4% | **14.2%** | 88m | `P0300`, `P0171` | Port of Oakland Gate 4 |
| **FL-105** | Mack Anthem | Active | 85% | 66.8% | 0.5% | 52m | None | Bayshore Blvd Logistics |
| **FL-106** | International LT | Critical | 54% | 44.1% | 1.1% | 105m | `P0420`, `SPN 3226` | SFO Cargo Terminal Bay 7 |
| **FL-107** | Freightliner eCascadia | Active | 97% | 89.0% | 0.1% | 15m | None | Berkeley Clean Corridor |
| **FL-108** | Volvo VNR 640 | Active | 81% | 61.5% | 0.4% | 41m | None | San Leandro Transfer |

---

## 💻 Execution & Deployment Instructions

### Option 1: Development Server
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Open http://localhost:3000 in your browser
```

### Option 2: Production Build & Local Preview
```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Option 3: Deploy to Production
The production-compiled static files are located in `dist/`. They can be deployed instantly to:
- **Vercel / Netlify**: Connect repository or run `netlify deploy --dir=dist`
- **AWS S3 + CloudFront**: Copy `dist/` directly to your S3 bucket
- **Nginx / Docker**: Serve `dist/` as standard static HTML/JS/CSS assets
