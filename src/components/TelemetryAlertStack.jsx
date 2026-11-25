import React from 'react';
import { 
  AlertTriangle, 
  Fuel, 
  Flame, 
  X, 
  ChevronRight, 
  Radio,
  ExternalLink
} from 'lucide-react';

export default function TelemetryAlertStack({
  alerts,
  onDismissAlert,
  onSelectVehicle,
  selectedVehicleId
}) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <section aria-label="Telemetry Anomaly Notification Stack" className="w-full">
      <div className="bg-surface-container-high/40 border border-outline-variant/60 rounded-lg p-3">
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-vivid-crimson animate-ping"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-vivid-crimson">
              CRITICAL TELEMETRY FAULT STACK ({alerts.length})
            </span>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant">
            Monitored in Real-Time by FleetPulse Telemetry Engine
          </span>
        </div>

        {/* Scrollable / Stackable Notification Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isSelected = selectedVehicleId === alert.vehicle_id;

            const pillClasses = isCritical
              ? 'bg-error-container/80 border-vivid-crimson text-on-error-container hover:bg-error-container'
              : 'bg-amber-container/80 border-amber-accent text-on-amber-container hover:bg-amber-container';

            return (
              <div
                key={alert.id}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono shadow-sm transition-all duration-150 ${pillClasses} ${
                  isSelected ? 'ring-2 ring-electric-blue' : ''
                }`}
              >
                {/* Icon */}
                {alert.type === 'Fuel Drop' ? (
                  <Fuel className="w-3.5 h-3.5 text-vivid-crimson shrink-0 animate-bounce" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0" />
                )}

                {/* Alert Text */}
                <span 
                  onClick={() => onSelectVehicle(alert.vehicle_id)}
                  className="cursor-pointer hover:underline font-semibold"
                  title="Click to isolate this vehicle"
                >
                  <strong className="font-bold underline decoration-dotted mr-1">{alert.vehicle_id}</strong>
                  {alert.text}
                </span>

                {/* Location / Timestamp Badge */}
                {alert.timestamp && (
                  <span className="text-[10px] opacity-75 hidden sm:inline">
                    [{alert.timestamp.split(' ')[1] || alert.timestamp}]
                  </span>
                )}

                {/* Inspect Action */}
                <button
                  type="button"
                  onClick={() => onSelectVehicle(alert.vehicle_id)}
                  className="p-0.5 rounded hover:bg-black/20 text-current ml-1"
                  title={`Inspect ${alert.vehicle_id}`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Dismiss Action */}
                <button
                  type="button"
                  onClick={() => onDismissAlert(alert.id)}
                  className="p-0.5 rounded hover:bg-black/30 text-current ml-0.5"
                  title="Dismiss notification"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
