/**
 * FleetPulse Telematics - Master Telemetry & Fleet Dataset
 * Comprehensive 8-vehicle production dataset adhering to Google Stitch specifications.
 */

export const INITIAL_FLEET_DATA = [
  {
    vehicle_id: "FL-101",
    make_model: "Freightliner Cascadia",
    driver: "Marcus Vance",
    status: "Active", // "Active" | "Idle" | "Critical Fault"
    telemetry: {
      gps: { lat: 37.7749, lng: -122.4194, heading: 45, speed_mph: 62 },
      fuel_level_pct: 74.5,
      fuel_drop_5m_pct: 0.4,
      coolant_temp_c: 92,
      oil_pressure_psi: 48,
      fuel_rate_lph: 26.8,
      mpg: 7.9,
      co2_tons_month: 4.8,
      odometer_km: 142300,
      idle_time_mins_today: 45,
      route_name: "I-80 Corridor East"
    },
    maintenance: {
      health_score: 88,
      active_dtc: [],
      last_service_date: "2026-10-15",
      next_service_due: "2026-12-15"
    },
    history: {
      "24h": {
        fuel: [88.0, 85.0, 82.0, 79.0, 77.0, 74.5],
        dist: [42, 118, 195, 270, 342, 410],
        coolant: [88, 90, 91, 92, 91, 92],
        oil: [49, 48, 48, 47, 48, 48]
      },
      "7d": {
        fuel: [92.0, 65.0, 89.0, 58.0, 84.0, 74.5],
        dist: [410, 820, 1210, 1650, 2040, 2480],
        coolant: [89, 91, 90, 92, 91, 92],
        oil: [48, 47, 48, 48, 47, 48]
      },
      "30d": {
        fuel: [85.0, 72.0, 90.0, 61.0, 78.0, 74.5],
        dist: [1800, 3600, 5400, 7200, 9100, 10850],
        coolant: [88, 89, 91, 90, 92, 92],
        oil: [49, 48, 48, 47, 48, 48]
      }
    }
  },
  {
    vehicle_id: "FL-102",
    make_model: "Volvo VNL 860",
    driver: "Elena Rostova",
    status: "Active",
    telemetry: {
      gps: { lat: 37.8044, lng: -122.2712, heading: 120, speed_mph: 58 },
      fuel_level_pct: 81.2,
      fuel_drop_5m_pct: 0.3,
      coolant_temp_c: 89,
      oil_pressure_psi: 51,
      fuel_rate_lph: 25.1,
      mpg: 8.2,
      co2_tons_month: 4.5,
      odometer_km: 98450,
      idle_time_mins_today: 28,
      route_name: "Oakland Inner Harbor Delivery"
    },
    maintenance: {
      health_score: 94,
      active_dtc: [],
      last_service_date: "2026-11-02",
      next_service_due: "2027-01-10"
    },
    history: {
      "24h": {
        fuel: [94.0, 91.0, 88.0, 86.0, 83.0, 81.2],
        dist: [38, 105, 180, 255, 328, 395],
        coolant: [86, 87, 88, 89, 89, 89],
        oil: [52, 51, 51, 50, 51, 51]
      },
      "7d": {
        fuel: [95.0, 71.0, 88.0, 62.0, 90.0, 81.2],
        dist: [390, 780, 1190, 1580, 1960, 2390],
        coolant: [87, 88, 88, 89, 89, 89],
        oil: [51, 51, 50, 51, 51, 51]
      },
      "30d": {
        fuel: [90.0, 75.0, 86.0, 68.0, 84.0, 81.2],
        dist: [1650, 3300, 4950, 6600, 8250, 9980],
        coolant: [87, 88, 89, 88, 89, 89],
        oil: [52, 51, 51, 50, 51, 51]
      }
    }
  },
  {
    vehicle_id: "FL-103",
    make_model: "Kenworth T680",
    driver: "Devon Brooks",
    status: "Idle",
    telemetry: {
      gps: { lat: 37.6879, lng: -122.4702, heading: 0, speed_mph: 0 },
      fuel_level_pct: 52.0,
      fuel_drop_5m_pct: 0.2,
      coolant_temp_c: 96,
      oil_pressure_psi: 42,
      fuel_rate_lph: 14.2,
      mpg: 6.8,
      co2_tons_month: 5.9,
      odometer_km: 215800,
      idle_time_mins_today: 134, // Excessive Idle (>120m threshold)
      route_name: "I-580 Staging Yard Bay 12"
    },
    maintenance: {
      health_score: 71,
      active_dtc: ["P0128"],
      last_service_date: "2026-09-18",
      next_service_due: "2026-11-30"
    },
    history: {
      "24h": {
        fuel: [64.0, 61.0, 58.0, 56.0, 54.0, 52.0],
        dist: [25, 70, 110, 160, 195, 230],
        coolant: [92, 93, 95, 96, 96, 96],
        oil: [44, 43, 43, 42, 42, 42]
      },
      "7d": {
        fuel: [80.0, 52.0, 76.0, 48.0, 69.0, 52.0],
        dist: [280, 560, 840, 1120, 1400, 1680],
        coolant: [93, 94, 95, 95, 96, 96],
        oil: [43, 43, 42, 42, 42, 42]
      },
      "30d": {
        fuel: [75.0, 55.0, 80.0, 50.0, 70.0, 52.0],
        dist: [1200, 2400, 3600, 4800, 6000, 7200],
        coolant: [92, 93, 94, 95, 96, 96],
        oil: [44, 43, 43, 42, 42, 42]
      }
    }
  },
  {
    vehicle_id: "FL-104",
    make_model: "Peterbilt 579",
    driver: "Tariq Morales",
    status: "Critical Fault",
    telemetry: {
      gps: { lat: 37.8199, lng: -122.3120, heading: 270, speed_mph: 0 },
      fuel_level_pct: 31.4,
      fuel_drop_5m_pct: 14.2, // Sudden drop >10% anomaly
      coolant_temp_c: 104, // Overheating
      oil_pressure_psi: 32, // Low oil pressure
      fuel_rate_lph: 38.5,
      mpg: 5.4,
      co2_tons_month: 7.2,
      odometer_km: 310400,
      idle_time_mins_today: 88,
      route_name: "Port of Oakland Gate 4"
    },
    maintenance: {
      health_score: 42, // Red (<50%)
      active_dtc: ["P0300", "P0171"],
      last_service_date: "2026-08-04",
      next_service_due: "2026-10-15" // Overdue
    },
    history: {
      "24h": {
        fuel: [62.0, 58.0, 54.0, 49.0, 45.6, 31.4], // 14.2% sudden loss anomaly
        dist: [30, 85, 140, 195, 240, 265],
        coolant: [94, 96, 98, 101, 103, 104],
        oil: [40, 38, 36, 34, 33, 32]
      },
      "7d": {
        fuel: [75.0, 48.0, 70.0, 42.0, 60.0, 31.4],
        dist: [320, 640, 960, 1280, 1600, 1890],
        coolant: [96, 98, 99, 102, 103, 104],
        oil: [38, 36, 35, 34, 33, 32]
      },
      "30d": {
        fuel: [70.0, 50.0, 68.0, 45.0, 55.0, 31.4],
        dist: [1400, 2800, 4200, 5600, 7000, 8300],
        coolant: [95, 97, 98, 100, 102, 104],
        oil: [39, 37, 36, 35, 33, 32]
      }
    }
  },
  {
    vehicle_id: "FL-105",
    make_model: "Mack Anthem",
    driver: "Hannah Jensen",
    status: "Active",
    telemetry: {
      gps: { lat: 37.7312, lng: -122.3877, heading: 190, speed_mph: 54 },
      fuel_level_pct: 66.8,
      fuel_drop_5m_pct: 0.5,
      coolant_temp_c: 91,
      oil_pressure_psi: 47,
      fuel_rate_lph: 27.4,
      mpg: 7.7,
      co2_tons_month: 4.9,
      odometer_km: 178900,
      idle_time_mins_today: 52,
      route_name: "Bayshore Blvd Logistics Hub"
    },
    maintenance: {
      health_score: 85,
      active_dtc: [],
      last_service_date: "2026-10-22",
      next_service_due: "2026-12-28"
    },
    history: {
      "24h": {
        fuel: [82.0, 79.0, 76.0, 73.0, 70.0, 66.8],
        dist: [35, 95, 160, 225, 290, 355],
        coolant: [89, 90, 90, 91, 91, 91],
        oil: [48, 48, 47, 47, 47, 47]
      },
      "7d": {
        fuel: [88.0, 62.0, 82.0, 57.0, 79.0, 66.8],
        dist: [360, 720, 1080, 1440, 1800, 2190],
        coolant: [90, 91, 90, 91, 91, 91],
        oil: [48, 47, 47, 47, 47, 47]
      },
      "30d": {
        fuel: [84.0, 70.0, 87.0, 63.0, 76.0, 66.8],
        dist: [1550, 3100, 4650, 6200, 7750, 9350],
        coolant: [89, 90, 91, 90, 91, 91],
        oil: [48, 48, 47, 47, 47, 47]
      }
    }
  },
  {
    vehicle_id: "FL-106",
    make_model: "International LT",
    driver: "Rayyan Al-Mansoor",
    status: "Critical Fault",
    telemetry: {
      gps: { lat: 37.6213, lng: -122.3790, heading: 310, speed_mph: 0 },
      fuel_level_pct: 44.1,
      fuel_drop_5m_pct: 1.1,
      coolant_temp_c: 98,
      oil_pressure_psi: 39,
      fuel_rate_lph: 31.0,
      mpg: 6.5,
      co2_tons_month: 6.4,
      odometer_km: 264100,
      idle_time_mins_today: 105,
      route_name: "SFO Cargo Terminal Bay 7"
    },
    maintenance: {
      health_score: 54, // Yellow (50-80%)
      active_dtc: ["P0420", "SPN 3226"],
      last_service_date: "2026-09-02",
      next_service_due: "2026-11-20" // Overdue
    },
    history: {
      "24h": {
        fuel: [58.0, 55.0, 52.0, 49.0, 46.5, 44.1],
        dist: [28, 75, 125, 175, 220, 260],
        coolant: [94, 95, 96, 97, 98, 98],
        oil: [42, 41, 40, 40, 39, 39]
      },
      "7d": {
        fuel: [74.0, 46.0, 68.0, 40.0, 58.0, 44.1],
        dist: [310, 620, 930, 1240, 1550, 1840],
        coolant: [95, 96, 97, 97, 98, 98],
        oil: [41, 40, 40, 39, 39, 39]
      },
      "30d": {
        fuel: [72.0, 48.0, 66.0, 42.0, 54.0, 44.1],
        dist: [1350, 2700, 4050, 5400, 6750, 8050],
        coolant: [94, 95, 96, 97, 98, 98],
        oil: [42, 41, 40, 39, 39, 39]
      }
    }
  },
  {
    vehicle_id: "FL-107",
    make_model: "Freightliner eCascadia",
    driver: "Chloe Chen",
    status: "Active",
    telemetry: {
      gps: { lat: 37.8715, lng: -122.2730, heading: 80, speed_mph: 45 },
      fuel_level_pct: 89.0, // State of Charge %
      fuel_drop_5m_pct: 0.1,
      coolant_temp_c: 68,
      oil_pressure_psi: 55,
      fuel_rate_lph: 0.0, // EV
      mpg: 18.5, // Diesel-equivalent MPGe
      co2_tons_month: 0.4,
      odometer_km: 41200,
      idle_time_mins_today: 15,
      route_name: "Berkeley - Richmond Clean Corridor"
    },
    maintenance: {
      health_score: 97,
      active_dtc: [],
      last_service_date: "2026-11-10",
      next_service_due: "2027-02-15"
    },
    history: {
      "24h": {
        fuel: [98.0, 96.0, 94.0, 92.0, 90.5, 89.0],
        dist: [30, 80, 135, 190, 245, 298],
        coolant: [65, 66, 67, 68, 68, 68],
        oil: [55, 55, 55, 55, 55, 55]
      },
      "7d": {
        fuel: [99.0, 78.0, 94.0, 72.0, 92.0, 89.0],
        dist: [290, 580, 870, 1160, 1450, 1750],
        coolant: [66, 67, 67, 68, 68, 68],
        oil: [55, 55, 55, 55, 55, 55]
      },
      "30d": {
        fuel: [95.0, 82.0, 90.0, 76.0, 88.0, 89.0],
        dist: [1200, 2400, 3600, 4800, 6000, 7350],
        coolant: [66, 67, 68, 67, 68, 68],
        oil: [55, 55, 55, 55, 55, 55]
      }
    }
  },
  {
    vehicle_id: "FL-108",
    make_model: "Volvo VNR 640",
    driver: "Jamal Edwards",
    status: "Active",
    telemetry: {
      gps: { lat: 37.7021, lng: -122.1691, heading: 140, speed_mph: 60 },
      fuel_level_pct: 61.5,
      fuel_drop_5m_pct: 0.4,
      coolant_temp_c: 91,
      oil_pressure_psi: 46,
      fuel_rate_lph: 26.5,
      mpg: 8.0,
      co2_tons_month: 4.6,
      odometer_km: 112600,
      idle_time_mins_today: 41,
      route_name: "San Leandro Industrial Transfer"
    },
    maintenance: {
      health_score: 81,
      active_dtc: [],
      last_service_date: "2026-10-05",
      next_service_due: "2026-12-08"
    },
    history: {
      "24h": {
        fuel: [76.0, 73.0, 70.0, 67.0, 64.0, 61.5],
        dist: [40, 104, 170, 236, 302, 368],
        coolant: [89, 90, 90, 91, 91, 91],
        oil: [47, 47, 46, 46, 46, 46]
      },
      "7d": {
        fuel: [86.0, 63.0, 79.0, 54.0, 74.0, 61.5],
        dist: [360, 720, 1080, 1440, 1800, 2160],
        coolant: [89, 90, 91, 90, 91, 91],
        oil: [47, 46, 46, 46, 46, 46]
      },
      "30d": {
        fuel: [82.0, 67.0, 85.0, 59.0, 73.0, 61.5],
        dist: [1510, 3020, 4530, 6040, 7550, 9060],
        coolant: [89, 90, 90, 91, 91, 91],
        oil: [47, 47, 46, 46, 46, 46]
      }
    }
  }
];

export const INITIAL_ANOMALY_EVENTS = [
  {
    id: "EVT-9041",
    vehicle_id: "FL-104",
    type: "Fuel Drop",
    delta: "-14.2% (21.3 gal)",
    location: "Oakland Port Gate 4",
    timestamp: "2026-11-25 06:14:08",
    severity: "CRITICAL",
    detail: "Sudden tank drop >10% in 4m 12s while stationary (Suspected Theft / Major Fuel Line Rupture)."
  },
  {
    id: "EVT-9038",
    vehicle_id: "FL-103",
    type: "Excessive Idle",
    delta: "-8.4 gal wasted",
    location: "I-580 Staging Yard",
    timestamp: "2026-11-25 05:42:19",
    severity: "WARNING",
    detail: "Continuous idle exceeded 120-minute threshold; thermostat failure suspected (DTC P0128)."
  },
  {
    id: "EVT-9035",
    vehicle_id: "FL-106",
    type: "Excessive Idle",
    delta: "-6.1 gal wasted",
    location: "SFO Cargo Terminal",
    timestamp: "2026-11-25 04:55:02",
    severity: "WARNING",
    detail: "High auxiliary PTO load during extended idle; NOx catalyst efficiency below threshold (SPN 3226)."
  },
  {
    id: "EVT-9029",
    vehicle_id: "FL-102",
    type: "Refuel",
    delta: "+62.0 gal",
    location: "Emeryville Fleet Depot",
    timestamp: "2026-11-25 03:18:44",
    severity: "NOMINAL",
    detail: "Verified cardlock fill; tank at 94.0%."
  },
  {
    id: "EVT-9024",
    vehicle_id: "FL-101",
    type: "Refuel",
    delta: "+54.5 gal",
    location: "San Leandro Hub",
    timestamp: "2026-11-25 01:09:31",
    severity: "NOMINAL",
    detail: "Scheduled route top-off completed."
  }
];

export const DTC_LOOKUP = {
  "P0300": {
    system: "Ignition / Fuel Injection",
    description: "Random / Multiple Cylinder Misfire Detected",
    urgency: "Immediate Repair Required"
  },
  "P0171": {
    system: "Air-Fuel Ratio",
    description: "System Too Lean (Bank 1)",
    urgency: "High - Possible Fuel Pressure Drop"
  },
  "P0128": {
    system: "Engine Cooling",
    description: "Coolant Thermostat Temperature Below Regulating Temp",
    urgency: "Moderate - Idling Fuel Waste"
  },
  "P0420": {
    system: "Exhaust Aftertreatment",
    description: "Catalyst System Efficiency Below Threshold (Bank 1)",
    urgency: "High - Emissions Non-Compliance"
  },
  "SPN 3226": {
    system: "SCR / DEF System",
    description: "Aftertreatment 1 Outlet NOx Sensor Abnormal Rate of Change",
    urgency: "High - DEF Dosing Fault"
  }
};
