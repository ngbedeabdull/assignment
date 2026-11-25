import React, { useState } from 'react';
import { 
  Fuel, 
  Clock, 
  TrendingDown, 
  AlertCircle, 
  Gauge, 
  BarChart3,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export default function FuelManagementHub({
  vehicles,
  selectedVehicle,
  timeframe,
  onSelectVehicle
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const tfKey = timeframe === 'custom' ? '7d' : timeframe;

  const timeLabels = {
    '24h': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    '7d': ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Today'],
    '30d': ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Now']
  }[tfKey] || ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

  // Prepare dual-axis series
  let fuelSeries = [];
  let distSeries = [];

  if (selectedVehicle) {
    fuelSeries = selectedVehicle.history[tfKey]?.fuel || [80, 75, 70, 65, 60, 55];
    distSeries = selectedVehicle.history[tfKey]?.dist || [50, 100, 150, 200, 250, 300];
  } else {
    fuelSeries = timeLabels.map((_, idx) => {
      const avg = vehicles.reduce((acc, v) => acc + (v.history[tfKey]?.fuel[idx] || 0), 0) / vehicles.length;
      return Number(avg.toFixed(1));
    });
    distSeries = timeLabels.map((_, idx) => {
      const avg = vehicles.reduce((acc, v) => acc + (v.history[tfKey]?.dist[idx] || 0), 0) / vehicles.length;
      return Math.round(avg);
    });
  }

  // Dual-axis SVG coordinates
  const svgW = 720;
  const svgH = 260;
  const padLeft = 52;
  const padRight = 60;
  const padTop = 28;
  const padBottom = 38;

  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;

  const maxFuel = 100;
  const minFuel = 0;
  const maxDist = Math.max(...distSeries, 100) * 1.15;
  const minDist = 0;

  // Coordinate mapper
  const getX = (i) => padLeft + (i / (fuelSeries.length - 1)) * plotW;
  const getFuelY = (val) => padTop + plotH - ((val - minFuel) / (maxFuel - minFuel)) * plotH;
  const getDistY = (val) => padTop + plotH - ((val - minDist) / (maxDist - minDist)) * plotH;

  // Build SVG path strings
  const fuelPoints = fuelSeries.map((val, i) => `${getX(i)},${getFuelY(val)}`).join(' ');
  const distPoints = distSeries.map((val, i) => `${getX(i)},${getDistY(val)}`).join(' ');

  // Gradient area path for fuel
  const fuelAreaPath = `
    M ${getX(0)},${padTop + plotH}
    L ${fuelPoints}
    L ${getX(fuelSeries.length - 1)},${padTop + plotH}
    Z
  `;

  // Check if there is an anomaly in the fuel series
  const anomalyIndex = selectedVehicle?.vehicle_id === 'FL-104' || (!selectedVehicle && true) ? 5 : null;

  // Top 5 Idle Vehicles Data
  const sortedIdleVehicles = [...vehicles]
    .sort((a, b) => b.telemetry.idle_time_mins_today - a.telemetry.idle_time_mins_today)
    .slice(0, 5);

  const maxIdleMins = Math.max(...sortedIdleVehicles.map(v => v.telemetry.idle_time_mins_today), 140);

  return (
    <section aria-label="Fuel Management & Telemetry Hub" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dual-Axis Line Graph (7 columns of 12) */}
        <div className="lg:col-span-7 bg-surface-container border border-outline-variant/60 rounded-lg p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-outline-variant/40">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-electric-blue"></div>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    Fuel Consumption vs. Distance Traveled
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                  {selectedVehicle 
                    ? `Unit ${selectedVehicle.vehicle_id} (${selectedVehicle.make_model}) telemetry stream`
                    : `Fleet aggregate dual-axis correlation (${timeframe.toUpperCase()})`}
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-electric-blue rounded-full"></span>
                  <span className="text-electric-blue font-semibold">Fuel % (Left)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-accent rounded-full border-t border-dashed border-amber-accent"></span>
                  <span className="text-amber font-semibold">Distance km (Right)</span>
                </div>
              </div>
            </div>

            {/* SVG Dual-Axis Chart Canvas */}
            <div className="relative mt-4 w-full h-[250px] select-none">
              <svg 
                viewBox={`0 0 ${svgW} ${svgH}`} 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Linear gradient for Fuel area fill */}
                  <linearGradient id="fuel-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                    <stop offset="90%" stopColor="#3B82F6" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Anomaly Pulse Filter */}
                  <filter id="anomaly-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = getFuelY(pct);
                  return (
                    <g key={pct}>
                      <line 
                        x1={padLeft} 
                        y1={y} 
                        x2={svgW - padRight} 
                        y2={y} 
                        stroke="#1C2433" 
                        strokeWidth="1" 
                        strokeDasharray={pct === 0 ? "none" : "3 3"} 
                      />
                      {/* Left Axis: Fuel % */}
                      <text 
                        x={padLeft - 8} 
                        y={y + 3.5} 
                        textAnchor="end" 
                        fill="#7E8799" 
                        fontFamily="Spline Sans Mono" 
                        fontSize="10" 
                        className="tabular-nums"
                      >
                        {pct}%
                      </text>
                      {/* Right Axis: Distance km */}
                      <text 
                        x={svgW - padRight + 8} 
                        y={y + 3.5} 
                        textAnchor="start" 
                        fill="#F59E0B" 
                        fontFamily="Spline Sans Mono" 
                        fontSize="10" 
                        className="tabular-nums"
                      >
                        {Math.round((pct / 100) * maxDist)} km
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Vertical markers & Labels */}
                {timeLabels.map((lbl, i) => {
                  const x = getX(i);
                  return (
                    <g key={lbl}>
                      <line 
                        x1={x} 
                        y1={padTop} 
                        x2={x} 
                        y2={padTop + plotH} 
                        stroke="#161F2E" 
                        strokeWidth="1" 
                        strokeDasharray="2 4" 
                      />
                      <text 
                        x={x} 
                        y={padTop + plotH + 18} 
                        textAnchor="middle" 
                        fill="#8C909F" 
                        fontFamily="Spline Sans Mono" 
                        fontSize="10"
                      >
                        {lbl}
                      </text>
                    </g>
                  );
                })}

                {/* Fuel Area Gradient Underlay */}
                <path d={fuelAreaPath} fill="url(#fuel-gradient)" />

                {/* Distance Traveled Line (Amber Dashed) */}
                <polyline 
                  fill="none" 
                  stroke="#F59E0B" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  points={distPoints} 
                />

                {/* Fuel Level Line (Electric Blue Solid) */}
                <polyline 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  points={fuelPoints} 
                />

                {/* Data Points on Fuel Line */}
                {fuelSeries.map((val, i) => {
                  const x = getX(i);
                  const y = getFuelY(val);
                  const isHovered = hoverIndex === i;

                  return (
                    <g key={i} className="cursor-pointer">
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? 6 : 4} 
                        fill="#3B82F6" 
                        stroke="#0D131F" 
                        strokeWidth="2" 
                      />
                      {/* Distance point */}
                      <circle 
                        cx={x} 
                        cy={getDistY(distSeries[i])} 
                        r={isHovered ? 5 : 3.5} 
                        fill="#F59E0B" 
                        stroke="#0D131F" 
                        strokeWidth="2" 
                      />
                    </g>
                  );
                })}

                {/* Anomaly Marker Flag (Sudden Drop Callout) */}
                {anomalyIndex !== null && (
                  <g transform={`translate(${getX(anomalyIndex) - 45}, ${getFuelY(fuelSeries[anomalyIndex]) - 40})`} filter="url(#anomaly-glow)">
                    <rect x="0" y="0" width="90" height="26" rx="4" fill="#930013" stroke="#EF4444" strokeWidth="1" />
                    <text x="45" y="16" textAnchor="middle" fill="#FFDAD7" fontFamily="Spline Sans Mono" fontSize="9.5" fontWeight="bold">
                      DROP -14.2%
                    </text>
                    {/* Anchor line */}
                    <line x1="45" y1="26" x2="45" y2="40" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="45" cy="40" r="3" fill="#EF4444" />
                  </g>
                )}

                {/* Interactive Cursor Tracking Column & Tooltip */}
                {hoverIndex !== null && (
                  <g>
                    <line 
                      x1={getX(hoverIndex)} 
                      y1={padTop} 
                      x2={getX(hoverIndex)} 
                      y2={padTop + plotH} 
                      stroke="#ADC6FF" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                    />
                  </g>
                )}

                {/* Invisible Hover Rectangles */}
                {fuelSeries.map((_, i) => {
                  const colW = plotW / fuelSeries.length;
                  const x = getX(i) - colW / 2;
                  return (
                    <rect 
                      key={i} 
                      x={x} 
                      y={padTop} 
                      width={colW} 
                      height={plotH} 
                      fill="transparent" 
                      className="cursor-crosshair" 
                      onMouseEnter={() => setHoverIndex(i)} 
                      onMouseLeave={() => setHoverIndex(null)} 
                    />
                  );
                })}
              </svg>

              {/* Precise Hover Tooltip Box */}
              {hoverIndex !== null && (
                <div 
                  className="absolute pointer-events-none z-30 bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant p-2.5 rounded shadow-xl text-xs font-mono w-48"
                  style={{
                    left: `${Math.min(Math.max(getX(hoverIndex) - 90, 10), svgW - 200)}px`,
                    top: '10px'
                  }}
                >
                  <div className="flex justify-between items-center pb-1 border-b border-outline-variant/40 mb-1.5 text-on-surface-variant font-bold">
                    <span>{timeLabels[hoverIndex]}</span>
                    <span className="text-primary font-sans">{timeframe.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-electric-blue">
                    <span>Fuel Level:</span>
                    <strong className="font-bold">{fuelSeries[hoverIndex]}%</strong>
                  </div>
                  <div className="flex justify-between text-amber mt-0.5">
                    <span>Distance:</span>
                    <strong className="font-bold">{distSeries[hoverIndex]} km</strong>
                  </div>
                  <div className="flex justify-between text-on-surface-variant mt-0.5 text-[10px]">
                    <span>Burn Rate:</span>
                    <span>~{(fuelSeries[hoverIndex] * 0.32).toFixed(1)} L/h</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Telemetry Footnote */}
          <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-mono">
            <span>Correlation: <strong className="text-primary">R = -0.94</strong> (Optimal Burn Efficiency)</span>
            <span>Sensor Freq: 1 Hz CAN BUS</span>
          </div>
        </div>

        {/* Idle-Time Bar Chart (5 columns of 12) */}
        <div className="lg:col-span-5 bg-surface-container border border-outline-variant/60 rounded-lg p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber" />
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    Excessive Idling Time
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                  Top 5 vehicles flagged for idle fuel waste today
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-container text-amber font-semibold">
                THRESHOLD: &gt;60m
              </span>
            </div>

            {/* Horizontal Bar Chart List */}
            <div className="mt-4 space-y-3.5">
              {sortedIdleVehicles.map((v) => {
                const idleMins = v.telemetry.idle_time_mins_today;
                const pct = Math.min((idleMins / maxIdleMins) * 100, 100);
                const isCritical = idleMins >= 120;
                const isWarning = idleMins >= 60 && idleMins < 120;
                const isSelected = selectedVehicle?.vehicle_id === v.vehicle_id;

                // Color configuration
                const barColor = isCritical ? 'bg-vivid-crimson' : isWarning ? 'bg-amber-accent' : 'bg-primary-container';
                const tagColor = isCritical ? 'text-vivid-crimson font-bold' : isWarning ? 'text-amber' : 'text-on-surface';

                // Estimate fuel wasted (approx 0.8 gal per idle hour)
                const wastedGal = ((idleMins / 60) * 0.8).toFixed(1);

                return (
                  <div 
                    key={v.vehicle_id}
                    onClick={() => onSelectVehicle(v.vehicle_id)}
                    onMouseEnter={() => setHoveredBar(v)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className={`p-2 rounded cursor-pointer transition-all duration-150 border ${
                      isSelected 
                        ? 'bg-surface-container-high border-electric-blue' 
                        : 'hover:bg-surface-container-high/60 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{v.vehicle_id}</span>
                        <span className="text-on-surface-variant truncate max-w-[110px]">{v.make_model}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface-variant text-[11px] font-sans">
                          {wastedGal} gal wasted
                        </span>
                        <span className={`${tagColor} tabular-nums font-semibold`}>
                          {idleMins} mins
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hover / Tooltip detail note */}
          <div className="mt-3 pt-3 border-t border-outline-variant/30 text-xs font-mono text-on-surface-variant flex items-center justify-between">
            <span className="text-amber">
              {hoveredBar 
                ? `${hoveredBar.vehicle_id}: Location ${hoveredBar.telemetry.route_name}` 
                : "Idle Cost Benchmark: ~$4.80 / hr diesel"}
            </span>
            <span className="text-electric-blue hover:underline cursor-pointer">
              Click unit to isolate
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
