import React from 'react';
import { 
  Gauge, 
  Thermometer, 
  Droplet, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Activity,
  Calendar
} from 'lucide-react';
import { DTC_LOOKUP } from '../data/fleetData';

export default function SensorInspector({
  selectedVehicle,
  vehicles,
  timeframe
}) {
  const tfKey = timeframe === 'custom' ? '7d' : timeframe;

  let coolantVal, oilVal, fuelRateVal, healthScore, activeDtcs, statusText, subText, statusClass;
  let coolantSeries = [], oilSeries = [];

  if (selectedVehicle) {
    const v = selectedVehicle;
    coolantVal = v.telemetry.coolant_temp_c;
    oilVal = v.telemetry.oil_pressure_psi;
    fuelRateVal = v.telemetry.fuel_rate_lph;
    healthScore = v.maintenance.health_score;
    activeDtcs = v.maintenance.active_dtc;
    statusText = v.status.toUpperCase();
    subText = `${v.make_model} • Driver: ${v.driver}`;

    coolantSeries = v.history[tfKey]?.coolant || [88, 90, 91, 92, 91, 92];
    oilSeries = v.history[tfKey]?.oil || [48, 47, 48, 48, 47, 48];

    statusClass = v.status === 'Active' 
      ? 'bg-active-green-container text-active-green' 
      : v.status === 'Idle' 
        ? 'bg-amber-container text-amber' 
        : 'bg-error-container text-vivid-crimson';
  } else {
    // Fleet averages
    const count = vehicles.length;
    coolantVal = vehicles.reduce((a, v) => a + v.telemetry.coolant_temp_c, 0) / count;
    oilVal = vehicles.reduce((a, v) => a + v.telemetry.oil_pressure_psi, 0) / count;
    fuelRateVal = vehicles.reduce((a, v) => a + v.telemetry.fuel_rate_lph, 0) / count;
    healthScore = Math.round(vehicles.reduce((a, v) => a + v.maintenance.health_score, 0) / count);
    activeDtcs = Array.from(new Set(vehicles.flatMap(v => v.maintenance.active_dtc)));
    statusText = "FLEET AVERAGE";
    subText = "Select any vehicle on the map or table to inspect live CAN sensor history";

    coolantSeries = [88, 89, 90, 91, 91, Math.round(coolantVal)];
    oilSeries = [48, 47, 47, 46, 46, Math.round(oilVal)];

    statusClass = 'bg-secondary-container text-on-secondary-container';
  }

  // Sparkline SVG Points
  const w = 420;
  const h = 100;
  const padX = 14;
  const padY = 14;

  const mapSparkline = (arr, min, max) => arr.map((val, i) => {
    const px = padX + (i / (arr.length - 1)) * (w - padX * 2);
    const py = h - padY - ((val - min) / (max - min)) * (h - padY * 2);
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");

  const coolantPoints = mapSparkline(coolantSeries, 60, 115);
  const oilPoints = mapSparkline(oilSeries, 25, 60);

  const isCoolantWarning = coolantVal >= 98;
  const isOilWarning = oilVal < 36;

  return (
    <div className="bg-surface-container border border-outline-variant/60 rounded-lg p-4 sm:p-5 shadow-lg flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-electric-blue" />
              <h3 className="font-headline text-base font-bold text-on-surface">
                {selectedVehicle ? `${selectedVehicle.vehicle_id} Sensor Inspector` : "Fleet Sensor Telemetry"}
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
              {subText}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider ${statusClass}`}>
              {statusText}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              healthScore < 50 ? 'bg-error-container text-vivid-crimson' :
              healthScore < 80 ? 'bg-amber-container text-amber' :
              'bg-active-green-container text-active-green'
            }`}>
              {healthScore}% HEALTH
            </span>
          </div>
        </div>

        {/* 3 Metric Gauges (Coolant, Oil Pressure, Fuel Flow) */}
        <div className="grid grid-cols-3 gap-3 my-4">
          
          {/* Coolant Gauge */}
          <div className="bg-surface-container-high/70 border border-outline-variant/40 rounded p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-on-surface-variant font-mono mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber" />
              <span>Coolant Temp</span>
            </div>
            <div className={`text-xl sm:text-2xl font-display font-bold tabular-nums ${
              isCoolantWarning ? 'text-vivid-crimson animate-pulse' : 'text-on-surface'
            }`}>
              {coolantVal.toFixed(1)}°C
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isCoolantWarning ? 'bg-error-container text-vivid-crimson font-bold' : 'text-active-green'
            }`}>
              {coolantVal >= 100 ? 'OVERHEAT' : coolantVal >= 95 ? 'ELEVATED' : 'NOMINAL'}
            </span>
          </div>

          {/* Oil Pressure Gauge */}
          <div className="bg-surface-container-high/70 border border-outline-variant/40 rounded p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-on-surface-variant font-mono mb-1">
              <Droplet className="w-3.5 h-3.5 text-electric-blue" />
              <span>Oil Pressure</span>
            </div>
            <div className={`text-xl sm:text-2xl font-display font-bold tabular-nums ${
              isOilWarning ? 'text-vivid-crimson animate-pulse' : 'text-on-surface'
            }`}>
              {Math.round(oilVal)} PSI
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isOilWarning ? 'bg-error-container text-vivid-crimson font-bold' : 'text-active-green'
            }`}>
              {oilVal < 35 ? 'LOW PSI' : 'OPTIMAL'}
            </span>
          </div>

          {/* Fuel Flow Rate Gauge */}
          <div className="bg-surface-container-high/70 border border-outline-variant/40 rounded p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-on-surface-variant font-mono mb-1">
              <Gauge className="w-3.5 h-3.5 text-primary" />
              <span>Fuel Flow</span>
            </div>
            <div className="text-xl sm:text-2xl font-display font-bold text-on-surface tabular-nums">
              {fuelRateVal.toFixed(1)} L/h
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant">
              CAN PID 0x5E
            </span>
          </div>

        </div>

        {/* Dual Sparkline Chart (Coolant vs Oil over Timeframe) */}
        <div className="bg-surface-container-lowest/80 border border-outline-variant/40 rounded p-3 mb-4">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-on-surface-variant">
            <span>Sensor Trend Sparkline ({timeframe.toUpperCase()})</span>
            <div className="flex items-center gap-3">
              <span className="text-amber">● Coolant (°C)</span>
              <span className="text-electric-blue">● Oil (PSI)</span>
            </div>
          </div>

          <div className="w-full h-[90px]">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible">
              {/* Guidelines */}
              <line x1={padX} y1="25" x2={w - padX} y2="25" stroke="#1D2738" strokeDasharray="3 3" />
              <line x1={padX} y1="50" x2={w - padX} y2="50" stroke="#1D2738" strokeDasharray="3 3" />
              <line x1={padX} y1="75" x2={w - padX} y2="75" stroke="#1D2738" strokeDasharray="3 3" />

              {/* Coolant Polyline */}
              <polyline 
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                points={coolantPoints} 
              />

              {/* Oil Polyline */}
              <polyline 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                points={oilPoints} 
              />
            </svg>
          </div>
        </div>

        {/* Active DTC Codes Diagnostic Card */}
        <div className="bg-surface-container-high/50 border border-outline-variant/50 rounded p-3">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-on-surface flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-primary" />
              <span>OBD-II / J1939 Diagnostic Codes</span>
            </span>
            <span className="text-[11px] text-on-surface-variant">
              {activeDtcs.length} Active Codes Flagged
            </span>
          </div>

          {activeDtcs.length > 0 ? (
            <div className="space-y-1.5">
              {activeDtcs.map((dtc) => {
                const info = DTC_LOOKUP[dtc] || { system: "General Engine", description: "Diagnostic Fault Code", urgency: "Attention Required" };
                return (
                  <div key={dtc} className="flex items-start justify-between bg-error-container/30 border border-vivid-crimson/40 rounded px-2.5 py-1.5 text-xs font-mono">
                    <div>
                      <span className="font-bold text-vivid-crimson mr-2">{dtc}</span>
                      <span className="text-on-surface">{info.description}</span>
                    </div>
                    <span className="text-[10px] text-error font-sans font-semibold uppercase shrink-0 ml-2">
                      {info.urgency}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-active-green bg-active-green-container/20 border border-active-green/30 rounded p-2">
              <CheckCircle className="w-4 h-4" />
              <span>No active DTC trouble codes reported by ECU telematics.</span>
            </div>
          )}
        </div>

      </div>

      {/* Service Schedule Note */}
      <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>Last Service: {selectedVehicle?.maintenance.last_service_date || "2026-10-15"}</span>
        <span>Next Due: <strong className="text-primary">{selectedVehicle?.maintenance.next_service_due || "2026-12-15"}</strong></span>
      </div>

    </div>
  );
}
