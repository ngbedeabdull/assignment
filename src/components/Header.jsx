import React from 'react';
import { 
  Radio, 
  Activity, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  Pause, 
  SlidersHorizontal,
  XCircle,
  Truck
} from 'lucide-react';

export default function Header({
  unit,
  onToggleUnit,
  timeframe,
  onChangeTimeframe,
  selectedVehicle,
  onClearVehicle,
  isSimulating,
  onToggleSimulation,
  onTriggerFuelDrop,
  alertCount
}) {
  return (
    <header className="sticky top-0 z-30 bg-surface-dim border-b border-outline-variant/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand & Live System Status */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-electric-blue/15 border border-electric-blue/40 flex items-center justify-center text-electric-blue shadow-inner">
                <Truck className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline text-lg sm:text-xl font-bold text-on-surface tracking-tight">
                    FleetPulse Telematics
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-active-green-container/60 text-active-green text-xs font-mono font-medium border border-active-green/30">
                    <span className="w-2 h-2 rounded-full bg-active-green-accent animate-pulse"></span>
                    LIVE STREAM
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                  <span>J1939 / CAN BUS V4.2</span>
                  <span>•</span>
                  <span>SAN FRANCISCO DISPATCH</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={onToggleUnit}
                className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-xs font-mono font-semibold text-primary"
              >
                {unit}
              </button>
            </div>
          </div>

          {/* Center / Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Simulation Controller */}
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant/50 rounded-md p-1">
              <button
                type="button"
                onClick={onToggleSimulation}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  isSimulating 
                    ? 'bg-active-green/15 text-active-green border border-active-green/40' 
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                title={isSimulating ? "Pause live telemetry simulation" : "Resume live telemetry simulation"}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>SIMULATING</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>PAUSED</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onTriggerFuelDrop}
                className="ml-1 flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-error-container/40 text-vivid-crimson hover:bg-error-container/70 border border-vivid-crimson/50 transition-all hover:scale-105"
                title="Inject sudden fuel loss anomaly (>10%) on FL-104 or selected unit"
              >
                <Fuel className="w-3.5 h-3.5" />
                <span className="font-semibold">TEST FUEL DROP</span>
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant/60 rounded-md p-1">
              {['24h', '7d', '30d', 'custom'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onChangeTimeframe(tf)}
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                    timeframe === tf
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Unit Toggle Desktop */}
            <div className="hidden lg:flex items-center">
              <button
                type="button"
                onClick={onToggleUnit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container border border-outline-variant hover:border-primary/50 text-xs font-mono text-on-surface transition-colors"
                title="Toggle Fuel Economy Metric Units"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>Unit: <strong className="text-primary">{unit}</strong></span>
              </button>
            </div>

            {/* Selected Vehicle Isolation Status */}
            {selectedVehicle && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-electric-blue/15 border border-electric-blue/60 text-xs font-mono text-on-surface animate-fadeIn">
                <span className="text-electric-blue font-bold">ISOLATED: {selectedVehicle.vehicle_id}</span>
                <button
                  type="button"
                  onClick={onClearVehicle}
                  className="p-0.5 rounded hover:bg-electric-blue/30 text-on-surface-variant hover:text-on-surface"
                  title="Clear isolation"
                >
                  <XCircle className="w-3.5 h-3.5 text-electric-blue" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
