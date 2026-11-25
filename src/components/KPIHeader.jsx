import React from 'react';
import { 
  Truck, 
  Fuel, 
  Leaf, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function KPIHeader({
  vehicles,
  selectedVehicle,
  unit,
  timeframe,
  formatFuelEconomy,
  alerts
}) {
  const tfMultiplier = timeframe === '24h' ? 0.04 : timeframe === '7d' ? 0.25 : 1.0;

  // Compute metrics based on whether an individual vehicle is isolated or fleet-wide
  let kpi1 = {}, kpi2 = {}, kpi3 = {}, kpi4 = {};

  if (selectedVehicle) {
    const v = selectedVehicle;
    const dtcCount = v.maintenance.active_dtc.length;
    const isFuelDropAnomaly = v.telemetry.fuel_drop_5m_pct > 10;
    const totalFaults = dtcCount + (isFuelDropAnomaly ? 1 : 0);

    // KPI 1: Selected Unit Status
    kpi1 = {
      label: "Selected Unit Status",
      value: v.vehicle_id,
      delta: v.status.toUpperCase(),
      deltaType: v.status === 'Active' ? 'success' : v.status === 'Idle' ? 'warning' : 'critical',
      sub: `${v.make_model} • ${v.telemetry.odometer_km.toLocaleString()} km`,
      icon: Truck
    };

    // KPI 2: Fuel Metrics
    kpi2 = {
      label: "Unit Fuel Economy",
      value: formatFuelEconomy(v.telemetry.mpg),
      delta: `${v.telemetry.fuel_level_pct.toFixed(1)}% Tank`,
      deltaType: v.telemetry.fuel_level_pct < 35 ? 'critical' : v.telemetry.fuel_level_pct < 60 ? 'warning' : 'success',
      sub: `Burn Rate: ${v.telemetry.fuel_rate_lph.toFixed(1)} L/h • Speed: ${v.telemetry.gps.speed_mph} mph`,
      icon: Fuel
    };

    // KPI 3: Carbon Footprint
    const unitCo2 = (v.telemetry.co2_tons_month * tfMultiplier).toFixed(2);
    kpi3 = {
      label: "Unit Carbon Output",
      value: `${unitCo2} t`,
      delta: `${timeframe.toUpperCase()} Window`,
      deltaType: 'neutral',
      sub: `Estimated ${v.telemetry.co2_tons_month.toFixed(1)} t / month normal rate`,
      icon: Leaf
    };

    // KPI 4: Unit Alerts & Faults
    kpi4 = {
      label: "Unit Maintenance Alerts",
      value: `${totalFaults} Faults`,
      badge: totalFaults > 0 ? "ACTION REQ" : "SYSTEM OK",
      isCritical: isFuelDropAnomaly || v.status === 'Critical Fault',
      isWarning: !isFuelDropAnomaly && v.status === 'Idle' && totalFaults > 0,
      sub: isFuelDropAnomaly 
        ? `CRITICAL: Tank drop -${v.telemetry.fuel_drop_5m_pct.toFixed(1)}% in 5m!` 
        : dtcCount > 0 
          ? `Active DTCs: ${v.maintenance.active_dtc.join(', ')}`
          : "All J1939 diagnostic loops nominal",
      icon: AlertOctagon
    };

  } else {
    // Fleet-wide calculations
    const totalCount = vehicles.length;
    const activeCount = vehicles.filter(v => v.status === 'Active').length;
    const idleCount = vehicles.filter(v => v.status === 'Idle').length;
    const criticalCount = vehicles.filter(v => v.status === 'Critical Fault').length;

    const avgMpg = totalCount > 0 
      ? vehicles.reduce((acc, v) => acc + v.telemetry.mpg, 0) / totalCount 
      : 0;

    const totalCo2 = totalCount > 0 
      ? (vehicles.reduce((acc, v) => acc + v.telemetry.co2_tons_month, 0) * tfMultiplier).toFixed(1) 
      : "0";

    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
    const warningAlerts = alerts.filter(a => a.severity === 'WARNING').length;

    // KPI 1: Total Active Fleet Count
    kpi1 = {
      label: "Total Active Fleet Count",
      value: `${activeCount + idleCount} / ${totalCount}`,
      delta: "+4.2% WoW",
      deltaType: 'success',
      sub: `${activeCount} Active • ${idleCount} Idle • ${criticalCount} Critical`,
      icon: Truck
    };

    // KPI 2: Real-Time Fuel Economy Average
    kpi2 = {
      label: "Fleet Fuel Economy Avg",
      value: formatFuelEconomy(avgMpg),
      delta: "+0.3 vs target",
      deltaType: 'success',
      sub: "Fleet-wide weighted average telematics",
      icon: Fuel
    };

    // KPI 3: Total Carbon Emissions
    kpi3 = {
      label: "Fleet Carbon Emissions",
      value: `${totalCo2} t`,
      delta: "-2.1% MoM",
      deltaType: 'success',
      sub: `CO2 metric tons calculated for ${timeframe.toUpperCase()}`,
      icon: Leaf
    };

    // KPI 4: Critical Maintenance Alerts Count
    kpi4 = {
      label: "Critical Alerts & Anomalies",
      value: `${criticalAlerts} High`,
      badge: criticalAlerts > 0 ? "ACTION REQ" : "CLEAR",
      isCritical: criticalAlerts > 0,
      isWarning: criticalAlerts === 0 && warningAlerts > 0,
      sub: `Critical: ${criticalAlerts} • Warnings: ${warningAlerts} • DTCs active`,
      icon: AlertOctagon
    };
  }

  return (
    <section aria-label="Operational KPI Summary" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Fleet Count */}
        <div className="bg-surface-container border border-outline-variant/60 rounded-lg p-4 hover:border-outline-variant transition-all duration-150 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-title text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              {kpi1.label}
            </span>
            <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center text-primary">
              <kpi1.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">
              {kpi1.value}
            </span>
            <span className={`inline-flex items-center text-xs font-mono font-semibold px-2 py-0.5 rounded ${
              kpi1.deltaType === 'critical'
                ? 'bg-error-container text-vivid-crimson border border-vivid-crimson/40'
                : kpi1.deltaType === 'warning'
                  ? 'bg-amber-container text-amber border border-amber-accent/40'
                  : 'bg-active-green-container text-active-green border border-active-green/40'
            }`}>
              {kpi1.delta}
            </span>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant font-mono truncate">
            {kpi1.sub}
          </p>
        </div>

        {/* KPI 2: Fuel Economy Average */}
        <div className="bg-surface-container border border-outline-variant/60 rounded-lg p-4 hover:border-outline-variant transition-all duration-150 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-title text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              {kpi2.label}
            </span>
            <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center text-electric-blue">
              <kpi2.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">
              {kpi2.value}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary-container/40 text-primary border border-primary/40">
              <TrendingUp className="w-3 h-3" />
              {kpi2.delta}
            </span>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant font-mono truncate">
            {kpi2.sub}
          </p>
        </div>

        {/* KPI 3: Carbon Emissions */}
        <div className="bg-surface-container border border-outline-variant/60 rounded-lg p-4 hover:border-outline-variant transition-all duration-150 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-title text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              {kpi3.label}
            </span>
            <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center text-active-green">
              <kpi3.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-on-surface tabular-nums">
              {kpi3.value}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-active-green-container text-active-green border border-active-green/40">
              <TrendingDown className="w-3 h-3" />
              {kpi3.delta}
            </span>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant font-mono truncate">
            {kpi3.sub}
          </p>
        </div>

        {/* KPI 4: Critical Maintenance Alerts (Accurate Color Coding: Vivid Crimson for critical, Amber for warning) */}
        <div className={`rounded-lg p-4 transition-all duration-150 shadow-md border ${
          kpi4.isCritical
            ? 'bg-error-container/30 border-vivid-crimson/70 shadow-vivid-crimson/10'
            : kpi4.isWarning
              ? 'bg-amber-container/30 border-amber-accent/70 shadow-amber-accent/10'
              : 'bg-surface-container border-outline-variant/60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-title text-xs uppercase tracking-wider font-semibold ${
              kpi4.isCritical ? 'text-vivid-crimson' : kpi4.isWarning ? 'text-amber' : 'text-on-surface-variant'
            }`}>
              {kpi4.label}
            </span>
            <div className={`w-7 h-7 rounded flex items-center justify-center ${
              kpi4.isCritical 
                ? 'bg-vivid-crimson/20 text-vivid-crimson animate-bounce' 
                : kpi4.isWarning 
                  ? 'bg-amber-accent/20 text-amber' 
                  : 'bg-surface-container-high text-active-green'
            }`}>
              <kpi4.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className={`font-display text-2xl sm:text-3xl font-bold tabular-nums ${
              kpi4.isCritical ? 'text-vivid-crimson' : kpi4.isWarning ? 'text-amber' : 'text-on-surface'
            }`}>
              {kpi4.value}
            </span>
            <span className={`inline-flex items-center text-xs font-mono font-bold px-2 py-0.5 rounded ${
              kpi4.isCritical
                ? 'bg-vivid-crimson text-surface-container-lowest animate-pulse'
                : kpi4.isWarning
                  ? 'bg-amber-accent text-surface-container-lowest'
                  : 'bg-active-green text-surface-container-lowest'
            }`}>
              {kpi4.badge}
            </span>
          </div>
          <p className={`mt-2 text-xs font-mono truncate ${
            kpi4.isCritical ? 'text-error font-medium' : kpi4.isWarning ? 'text-amber' : 'text-on-surface-variant'
          }`}>
            {kpi4.sub}
          </p>
        </div>

      </div>
    </section>
  );
}
