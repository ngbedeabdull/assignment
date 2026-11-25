import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Navigation, 
  MapPin, 
  AlertTriangle,
  Fuel,
  Info
} from 'lucide-react';

export default function TrackingMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isSimulating
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredVehicle, setHoveredVehicle] = useState(null);

  // Geographic bounds for Bay Area sector
  const minLat = 37.58, maxLat = 37.92;
  const minLng = -122.54, maxLng = -122.12;

  const mapWidth = 800;
  const mapHeight = 440;

  // Convert GPS coordinates to SVG coordinate space
  const projectCoords = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    return { x, y };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { hex: '#10B981', ringHex: '#4EDEA3', label: 'Active', pulse: false };
      case 'Idle':
        return { hex: '#F59E0B', ringHex: '#FFB95F', label: 'Idle', pulse: false };
      case 'Critical Fault':
      default:
        return { hex: '#EF4444', ringHex: '#FFB3AD', label: 'Critical Fault', pulse: true };
    }
  };

  // Selected vehicle details for coordinate banner
  const selectedVehicle = vehicles.find(v => v.vehicle_id === selectedVehicleId);

  return (
    <div className="bg-surface-container border border-outline-variant/60 rounded-lg overflow-hidden flex flex-col shadow-lg relative">
      
      {/* Map Header Bar */}
      <div className="px-4 py-3 bg-surface-dim border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-electric-blue animate-pulse"></div>
          <h2 className="font-headline text-sm font-semibold text-on-surface uppercase tracking-wider">
            Interactive Asset Tracking Map
          </h2>
          <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
            Bay Area Telematics Sector
          </span>
        </div>

        {/* Map View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/50 rounded p-0.5">
            <button
              type="button"
              onClick={() => setShowRoutes(!showRoutes)}
              className={`px-2 py-1 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                showRoutes ? 'bg-primary-container/40 text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Toggle Freight Corridors"
            >
              <Navigation className="w-3 h-3" />
              <span>Corridors</span>
            </button>
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 py-1 text-xs font-mono rounded flex items-center gap-1 transition-colors ${
                showGrid ? 'bg-primary-container/40 text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Toggle Sector Graticule"
            >
              <Layers className="w-3 h-3" />
              <span>Grid</span>
            </button>
          </div>

          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/50 rounded p-0.5 text-on-surface-variant">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1 hover:text-on-surface hover:bg-surface-container-high rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1 hover:text-on-surface hover:bg-surface-container-high rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-on-surface hover:bg-surface-container-high rounded"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas / SVG UI */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-[#0A0F1A] overflow-hidden select-none">
        
        <svg 
          viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="sector-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161F30" strokeWidth="0.8" />
            </pattern>
            <pattern id="radar-dots" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="#1D2A42" />
            </pattern>

            {/* Glowing filter for nodes */}
            <filter id="glow-crimson" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-electric" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Canvas */}
          <rect width={mapWidth} height={mapHeight} fill="#090E17" />
          
          {/* Subtle Sector Grid Lines */}
          {showGrid && (
            <>
              <rect width={mapWidth} height={mapHeight} fill="url(#sector-grid)" />
              <rect width={mapWidth} height={mapHeight} fill="url(#radar-dots)" />
            </>
          )}

          {/* San Francisco Bay Waterway & Coastline Vector */}
          <g id="bay-waterways" opacity="0.65">
            {/* Pacific Ocean & Bay body */}
            <path
              d="M 20,20 Q 80,60 110,140 Q 140,220 180,260 Q 220,300 240,420 L 40,420 L 20,20 Z"
              fill="#061224"
              stroke="#132742"
              strokeWidth="1.2"
            />
            {/* Central Bay & North San Pablo Bay */}
            <path
              d="M 190,140 Q 250,110 320,130 Q 380,150 420,190 Q 400,260 360,280 Q 290,290 230,240 Q 200,190 190,140 Z"
              fill="#07162C"
              stroke="#142C4C"
              strokeWidth="1.2"
            />
            {/* South Bay Channel */}
            <path
              d="M 290,280 Q 340,320 370,390 Q 400,430 420,440 L 320,440 Q 290,370 260,310 Z"
              fill="#061224"
              stroke="#132742"
              strokeWidth="1"
            />
          </g>

          {/* Realistic Major Freight Corridors (Highways & Interstates) */}
          {showRoutes && (
            <g id="freight-corridors">
              {/* I-80 Eastshore / Bay Bridge corridor */}
              <path
                d="M 180,220 L 240,210 L 330,200 L 460,130 L 620,70 L 760,40"
                fill="none"
                stroke="#1E3250"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 180,220 L 240,210 L 330,200 L 460,130 L 620,70 L 760,40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
              />

              {/* I-580 / Richmond-San Rafael to East Bay */}
              <path
                d="M 120,110 L 280,120 L 410,180 L 490,260 L 590,330 L 720,380"
                fill="none"
                stroke="#1E3250"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 120,110 L 280,120 L 410,180 L 490,260 L 590,330 L 720,380"
                fill="none"
                stroke="#ADC6FF"
                strokeWidth="1"
                strokeOpacity="0.3"
              />

              {/* I-880 Oakland - San Jose Freight Artery */}
              <path
                d="M 400,200 L 430,250 L 480,310 L 520,380 L 570,440"
                fill="none"
                stroke="#1E3250"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 400,200 L 430,250 L 480,310 L 520,380 L 570,440"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />

              {/* US-101 Peninsula Freight Route */}
              <path
                d="M 160,200 L 190,270 L 220,330 L 260,390 L 300,440"
                fill="none"
                stroke="#1E3250"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Highway labels */}
              <text x="540" y="95" fill="#3E5274" fontSize="9" fontFamily="Spline Sans Mono" fontWeight="600">I-80 CORRIDOR</text>
              <text x="460" y="335" fill="#3E5274" fontSize="9" fontFamily="Spline Sans Mono" fontWeight="600">I-880 SOUTH</text>
              <text x="145" y="310" fill="#3E5274" fontSize="9" fontFamily="Spline Sans Mono" fontWeight="600">US-101 BAYSHORE</text>
            </g>
          )}

          {/* Key Port Terminals & Depots */}
          <g id="logistics-terminals" opacity="0.8">
            {/* Oakland Port Gate 4 */}
            <rect x="380" y="195" width="28" height="18" rx="2" fill="#152136" stroke="#25395A" strokeWidth="1" />
            <text x="394" y="207" fill="#6B80A5" fontSize="7.5" fontFamily="Reddit Sans" textAnchor="middle" fontWeight="bold">PORT 4</text>

            {/* SFO Air Freight Cargo Terminal */}
            <rect x="225" y="330" width="30" height="18" rx="2" fill="#152136" stroke="#25395A" strokeWidth="1" />
            <text x="240" y="342" fill="#6B80A5" fontSize="7.5" fontFamily="Reddit Sans" textAnchor="middle" fontWeight="bold">SFO CARGO</text>

            {/* Emeryville Fleet Depot */}
            <circle cx="360" cy="180" r="3.5" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="1" />
            <text x="350" y="174" fill="#5F769C" fontSize="7" fontFamily="Spline Sans Mono">DEPOT</text>
          </g>

          {/* Vehicle Markers Layer */}
          <g id="vehicle-markers-layer">
            {vehicles.map((v) => {
              const { x, y } = projectCoords(v.telemetry.gps.lat, v.telemetry.gps.lng);
              const isSelected = selectedVehicleId === v.vehicle_id;
              const isHovered = hoveredVehicle?.vehicle_id === v.vehicle_id;
              const statusCfg = getStatusColor(v.status);
              const opacity = selectedVehicleId && !isSelected ? 0.35 : 1;

              return (
                <g
                  key={v.vehicle_id}
                  className="cursor-pointer transition-all duration-200"
                  opacity={opacity}
                  onClick={() => onSelectVehicle(v.vehicle_id)}
                  onMouseEnter={() => setHoveredVehicle(v)}
                  onMouseLeave={() => setHoveredVehicle(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select vehicle ${v.vehicle_id}`}
                >
                  {/* Selected Unit Target Reticle Ring */}
                  {isSelected && (
                    <g filter="url(#glow-electric)">
                      <circle
                        cx={x}
                        cy={y}
                        r="20"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '6s' }}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="26"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                    </g>
                  )}

                  {/* Critical Fault Pulse Ring */}
                  {statusCfg.pulse && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="#EF4444"
                      fillOpacity="0.25"
                      className="animate-ping"
                      style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '2s' }}
                    />
                  )}

                  {/* Marker Outer Halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 13 : isHovered ? 12 : 10}
                    fill={statusCfg.hex}
                    fillOpacity="0.25"
                  />

                  {/* Marker Core Solid Node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 7 : 5.5}
                    fill={statusCfg.hex}
                    stroke="#080E1A"
                    strokeWidth="2"
                    filter={statusCfg.pulse ? "url(#glow-crimson)" : undefined}
                  />

                  {/* Heading Direction Arrow */}
                  {v.telemetry.gps.speed_mph > 0 && (
                    <path
                      d={`M ${x} ${y - 12} L ${x - 3} ${y - 6} L ${x + 3} ${y - 6} Z`}
                      fill={statusCfg.hex}
                      transform={`rotate(${v.telemetry.gps.heading}, ${x}, ${y})`}
                    />
                  )}

                  {/* Vehicle Tag Badge */}
                  <g transform={`translate(${x + 10}, ${y - 12})`}>
                    <rect
                      x="0"
                      y="0"
                      width="58"
                      height="20"
                      rx="4"
                      fill="#121824"
                      stroke={isSelected ? '#3B82F6' : isHovered ? '#8C909F' : '#2A3447'}
                      strokeWidth={isSelected ? '1.5' : '1'}
                      className="drop-shadow"
                    />
                    <text
                      x="29"
                      y="14"
                      textAnchor="middle"
                      fill="#DDE2F3"
                      fontFamily="Spline Sans Mono, monospace"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {v.vehicle_id}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover / Tooltip Card Overlay */}
        {hoveredVehicle && (
          <div 
            className="absolute z-20 pointer-events-none bg-surface-container-high/95 backdrop-blur-md border border-outline-variant p-3 rounded-lg shadow-2xl text-xs w-60 animate-fadeIn"
            style={{
              top: '12px',
              left: '12px'
            }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/40 mb-2">
              <span className="font-mono font-bold text-primary text-sm">
                {hoveredVehicle.vehicle_id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                hoveredVehicle.status === 'Active' ? 'bg-active-green-container text-active-green' :
                hoveredVehicle.status === 'Idle' ? 'bg-amber-container text-amber' :
                'bg-error-container text-vivid-crimson'
              }`}>
                {hoveredVehicle.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1 text-on-surface-variant font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="text-on-surface font-sans font-medium truncate max-w-[120px]">{hoveredVehicle.make_model}</span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span className="text-on-surface font-semibold">{hoveredVehicle.telemetry.gps.speed_mph} mph</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Level:</span>
                <span className={`font-semibold ${hoveredVehicle.telemetry.fuel_level_pct < 40 ? 'text-vivid-crimson' : 'text-on-surface'}`}>
                  {hoveredVehicle.telemetry.fuel_level_pct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Health Score:</span>
                <span className={`font-semibold ${hoveredVehicle.maintenance.health_score < 50 ? 'text-vivid-crimson' : hoveredVehicle.maintenance.health_score < 80 ? 'text-amber' : 'text-active-green'}`}>
                  {hoveredVehicle.maintenance.health_score}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>DTC Faults:</span>
                <span className={hoveredVehicle.maintenance.active_dtc.length > 0 ? 'text-vivid-crimson font-bold' : 'text-active-green'}>
                  {hoveredVehicle.maintenance.active_dtc.length > 0 ? hoveredVehicle.maintenance.active_dtc.join(', ') : 'None'}
                </span>
              </div>
            </div>
            
            <p className="mt-2 text-[10px] text-electric-blue font-sans italic border-t border-outline-variant/30 pt-1">
              Click node to isolate unit sensor history
            </p>
          </div>
        )}

        {/* Dynamic GPS Coordinates & Sector Readout Banner (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-10 bg-surface-dim/90 backdrop-blur-sm border border-outline-variant/60 rounded px-3 py-1.5 flex items-center gap-2 shadow-md">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-on-surface tabular-nums">
            {selectedVehicle 
              ? `${selectedVehicle.vehicle_id}: ${selectedVehicle.telemetry.gps.lat.toFixed(4)}° N, ${Math.abs(selectedVehicle.telemetry.gps.lng).toFixed(4)}° W (${selectedVehicle.telemetry.route_name})`
              : "Sector Center: 37.7749° N, 122.4194° W (San Francisco - Oakland Transit)"
            }
          </span>
        </div>

        {/* Map Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-surface-dim/85 backdrop-blur-sm border border-outline-variant/60 rounded px-3 py-1.5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-active-green-accent"></span>
            <span className="text-on-surface">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-accent"></span>
            <span className="text-on-surface">Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-vivid-crimson"></span>
            <span className="text-on-surface">Fault</span>
          </div>
        </div>

      </div>
    </div>
  );
}
