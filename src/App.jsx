import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import KPIHeader from './components/KPIHeader';
import TrackingMap from './components/TrackingMap';
import SensorInspector from './components/SensorInspector';
import FuelManagementHub from './components/FuelManagementHub';
import EngineHealthMatrix from './components/EngineHealthMatrix';
import TelemetryAlertStack from './components/TelemetryAlertStack';
import VehicleDrillDownBanner from './components/VehicleDrillDownBanner';
import { INITIAL_FLEET_DATA, INITIAL_ANOMALY_EVENTS } from './data/fleetData';

export default function App() {
  // Master fleet telemetry state
  const [vehicles, setVehicles] = useState(INITIAL_FLEET_DATA);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [unit, setUnit] = useState('MPG'); // 'MPG' or 'L/100km'
  const [timeframe, setTimeframe] = useState('24h'); // '24h', '7d', '30d', 'custom'
  const [isSimulating, setIsSimulating] = useState(true);

  // UI Notification & Anomaly Alert Stack
  const [alerts, setAlerts] = useState([
    {
      id: "ALERT-INIT-104",
      vehicle_id: "FL-104",
      type: "Fuel Drop",
      severity: "CRITICAL",
      text: "Fuel Drop Alert: FL-104 lost 14.2% in 4m 12s at Oakland Port Gate 4",
      timestamp: "2026-11-25 06:14:08"
    },
    {
      id: "ALERT-INIT-103",
      vehicle_id: "FL-103",
      type: "Excessive Idle",
      severity: "WARNING",
      text: "Idle Threshold Exceeded: FL-103 idling >130m with thermostat DTC P0128",
      timestamp: "2026-11-25 05:42:19"
    },
    {
      id: "ALERT-INIT-106",
      vehicle_id: "FL-106",
      type: "DTC Trigger",
      severity: "CRITICAL",
      text: "DTC SPN 3226: FL-106 SCR / DEF Catalyst efficiency failure",
      timestamp: "2026-11-25 04:55:02"
    }
  ]);

  // Selected vehicle object
  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.vehicle_id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  /**
   * Telemetry Logic 1: Fuel Drop Alert Monitor
   * Internal function that monitors the vehicle array;
   * if a fuel drop >10% is detected, immediately appends a "Critical" alert to the UI notification stack.
   */
  const monitorFuelDropAlerts = useCallback((vehicleList) => {
    vehicleList.forEach((v) => {
      if (v.telemetry.fuel_drop_5m_pct > 10) {
        setAlerts((prevAlerts) => {
          // Prevent exact duplicate active alerts for the same vehicle
          const alreadyExists = prevAlerts.some(
            a => a.vehicle_id === v.vehicle_id && a.type === 'Fuel Drop'
          );
          if (alreadyExists) return prevAlerts;

          const newAlert = {
            id: `ALERT-DROP-${v.vehicle_id}-${Date.now()}`,
            vehicle_id: v.vehicle_id,
            type: "Fuel Drop",
            severity: "CRITICAL",
            text: `Fuel Drop Alert: ${v.vehicle_id} lost ${v.telemetry.fuel_drop_5m_pct.toFixed(1)}% in 5m (Suspected Tank Breach / Fuel Line Leak)`,
            timestamp: new Date().toLocaleTimeString()
          };

          return [newAlert, ...prevAlerts];
        });
      }
    });
  }, []);

  /**
   * Telemetry Logic 2: Vehicle Drill-Down State Management
   * Clicking on any vehicle row or map node filters the state,
   * smoothly transitioning the dashboard to isolate that vehicle's sensor history.
   */
  const handleSelectVehicle = useCallback((vehicleId) => {
    setSelectedVehicleId((prev) => (prev === vehicleId ? null : vehicleId));
  }, []);

  const handleClearVehicle = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  // Keyboard shortcut: Press Escape to clear drill-down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedVehicleId) {
        handleClearVehicle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVehicleId, handleClearVehicle]);

  // Unit converter helper
  const formatFuelEconomy = useCallback((mpg) => {
    if (unit === 'MPG') {
      return `${mpg.toFixed(1)} MPG`;
    }
    const l100km = 235.215 / (mpg || 1);
    return `${l100km.toFixed(1)} L/100km`;
  }, [unit]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => (prev === 'MPG' ? 'L/100km' : 'MPG'));
  }, []);

  const handleDismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  /**
   * Interactive Simulator Action: Inject sudden fuel drop anomaly (>10%)
   * Used for real-time testing and verifying the automated alert logic.
   */
  const triggerSimulatedFuelDrop = useCallback(() => {
    const targetId = selectedVehicleId || 'FL-104';
    
    setVehicles((prev) => {
      const updated = prev.map((v) => {
        if (v.vehicle_id === targetId) {
          const dropAmount = 14.5;
          const newLevel = Math.max(v.telemetry.fuel_level_pct - dropAmount, 5);
          return {
            ...v,
            status: 'Critical Fault',
            telemetry: {
              ...v.telemetry,
              fuel_level_pct: Number(newLevel.toFixed(1)),
              fuel_drop_5m_pct: dropAmount,
              fuel_rate_lph: 42.0
            },
            maintenance: {
              ...v.maintenance,
              health_score: Math.min(v.maintenance.health_score, 40)
            }
          };
        }
        return v;
      });

      // Trigger surveillance check immediately
      monitorFuelDropAlerts(updated);
      return updated;
    });
  }, [selectedVehicleId, monitorFuelDropAlerts]);

  /**
   * Real-Time Telemetry Simulation Loop
   * Smoothly moves active vehicles along their realistic GPS routes,
   * updates odometers, fuel levels, and checks for anomaly thresholds.
   */
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prev) => {
        const updated = prev.map((v) => {
          if (v.status === 'Active') {
            // Move realistic GPS coordinate slightly along its heading
            const rad = (v.telemetry.gps.heading * Math.PI) / 180;
            const deltaLat = Math.cos(rad) * 0.0006;
            const deltaLng = Math.sin(rad) * 0.0006;

            // Bounds bounce
            let newLat = v.telemetry.gps.lat + deltaLat;
            let newLng = v.telemetry.gps.lng + deltaLng;
            let newHeading = v.telemetry.gps.heading;

            if (newLat > 37.89 || newLat < 37.62) {
              newHeading = (newHeading + 180) % 360;
              newLat = Math.max(37.63, Math.min(37.88, newLat));
            }
            if (newLng > -122.15 || newLng < -122.50) {
              newHeading = (newHeading + 180) % 360;
              newLng = Math.max(-122.49, Math.min(-122.16, newLng));
            }

            // Subtle fuel burn and odometer increment
            const fuelBurn = 0.03;
            const newFuel = Math.max(v.telemetry.fuel_level_pct - fuelBurn, 2);
            const newOdo = v.telemetry.odometer_km + 1;

            return {
              ...v,
              telemetry: {
                ...v.telemetry,
                gps: {
                  ...v.telemetry.gps,
                  lat: Number(newLat.toFixed(5)),
                  lng: Number(newLng.toFixed(5)),
                  heading: newHeading
                },
                fuel_level_pct: Number(newFuel.toFixed(1)),
                odometer_km: newOdo
              }
            };
          } else if (v.status === 'Idle') {
            // Increment idle time slightly
            return {
              ...v,
              telemetry: {
                ...v.telemetry,
                idle_time_mins_today: v.telemetry.idle_time_mins_today + 1
              }
            };
          }
          return v;
        });

        // Run alert surveillance
        monitorFuelDropAlerts(updated);
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, monitorFuelDropAlerts]);

  return (
    <div className="min-h-screen bg-slate-bg text-on-surface font-body flex flex-col selection:bg-electric-blue/30 selection:text-on-surface">
      
      {/* Top Operational Header */}
      <Header
        unit={unit}
        onToggleUnit={toggleUnit}
        timeframe={timeframe}
        onChangeTimeframe={setTimeframe}
        selectedVehicle={selectedVehicle}
        onClearVehicle={handleClearVehicle}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(prev => !prev)}
        onTriggerFuelDrop={triggerSimulatedFuelDrop}
        alertCount={alerts.length}
      />

      {/* Main Operational Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dynamic Drill-Down Isolation Banner (shows when a vehicle is selected) */}
        {selectedVehicle && (
          <VehicleDrillDownBanner
            vehicle={selectedVehicle}
            onReset={handleClearVehicle}
          />
        )}

        {/* Telemetry Alert Notification Stack */}
        <TelemetryAlertStack
          alerts={alerts}
          onDismissAlert={handleDismissAlert}
          onSelectVehicle={handleSelectVehicle}
          selectedVehicleId={selectedVehicleId}
        />

        {/* Component 1: KPI Header Summary Cards (4 Distinct Cards) */}
        <KPIHeader
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          unit={unit}
          timeframe={timeframe}
          formatFuelEconomy={formatFuelEconomy}
          alerts={alerts}
        />

        {/* Component 2 & Sensor Inspector Grid (Section 2: Map + Sensor Inspector) */}
        <section aria-label="Geospatial Telemetry and Diagnostic Section" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Component 2: Interactive Asset Tracking Map (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <TrackingMap
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={handleSelectVehicle}
                isSimulating={isSimulating}
              />
            </div>

            {/* Sensor Telemetry & Vehicle Drill-Down Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <SensorInspector
                selectedVehicle={selectedVehicle}
                vehicles={vehicles}
                timeframe={timeframe}
              />
            </div>

          </div>
        </section>

        {/* Component 3: Fuel Management Hub (Dual-Axis Chart + Idle Bar Chart) */}
        <FuelManagementHub
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          timeframe={timeframe}
          onSelectVehicle={handleSelectVehicle}
        />

        {/* Component 4: Engine Health Matrix (Searchable, Paginated Data Table) */}
        <EngineHealthMatrix
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleSelectVehicle}
        />

      </main>

      {/* Industrial Dispatch Footer */}
      <footer className="mt-auto bg-surface-dim border-t border-outline-variant/40 py-4 px-4 sm:px-8 text-xs font-mono text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-active-green-accent"></span>
          <span>FLEETPULSE TELEMATICS SUITE • DISPATCH PROTOCOL ISO 11898-1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CAN BUS 500 kbps</span>
          <span>•</span>
          <span>LATENCY: 14ms</span>
          <span>•</span>
          <span className="text-primary">DARK MODE ACTIVE (#121824)</span>
        </div>
      </footer>

    </div>
  );
}
