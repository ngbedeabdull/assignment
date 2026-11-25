import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  Fuel, 
  Activity, 
  X,
  Gauge
} from 'lucide-react';

export default function VehicleDrillDownBanner({
  vehicle,
  onReset
}) {
  if (!vehicle) return null;

  return (
    <section 
      aria-label="Active Vehicle Drill-Down Banner"
      className="w-full bg-surface-container-high border border-electric-blue/50 rounded-lg p-3 sm:p-4 shadow-xl transition-all duration-200 animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Left: Unit Identity & Route */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-electric-blue/20 border border-electric-blue flex items-center justify-center text-electric-blue shadow-inner">
            <Truck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-electric-blue tracking-wider">
                ACTIVE DRILL-DOWN: {vehicle.vehicle_id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                vehicle.status === 'Active' ? 'bg-active-green-container text-active-green' :
                vehicle.status === 'Idle' ? 'bg-amber-container text-amber' :
                'bg-error-container text-vivid-crimson'
              }`}>
                {vehicle.status.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-on-surface-variant mt-0.5">
              <span>{vehicle.make_model}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {vehicle.telemetry.route_name}
              </span>
              <span>•</span>
              <span>Driver: <strong className="text-on-surface">{vehicle.driver}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Quick telemetry stats and Reset Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/30">
          
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-on-surface">
            <div>
              <span className="text-on-surface-variant block text-[10px]">SPEED</span>
              <span className="font-bold">{vehicle.telemetry.gps.speed_mph} mph</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">TANK</span>
              <span className={`font-bold ${vehicle.telemetry.fuel_level_pct < 35 ? 'text-vivid-crimson' : 'text-primary'}`}>
                {vehicle.telemetry.fuel_level_pct.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">HEALTH</span>
              <span className={`font-bold ${vehicle.maintenance.health_score < 50 ? 'text-vivid-crimson' : vehicle.maintenance.health_score < 80 ? 'text-amber' : 'text-active-green'}`}>
                {vehicle.maintenance.health_score}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-electric-blue/20 hover:bg-electric-blue/30 border border-electric-blue text-xs font-mono font-bold text-electric-blue transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT DRILL-DOWN</span>
          </button>

        </div>

      </div>
    </section>
  );
}
