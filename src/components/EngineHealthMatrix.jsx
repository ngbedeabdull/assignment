import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  X,
  Wrench
} from 'lucide-react';
import { DTC_LOOKUP } from '../data/fleetData';

export default function EngineHealthMatrix({
  vehicles,
  selectedVehicleId,
  onSelectVehicle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('vehicle_id');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Status filter
      if (statusFilter !== 'ALL' && v.status !== statusFilter) {
        return false;
      }
      // Search query filter (matches ID, make/model, driver, or DTC codes)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = v.vehicle_id.toLowerCase().includes(q);
        const matchesModel = v.make_model.toLowerCase().includes(q);
        const matchesDriver = v.driver?.toLowerCase().includes(q);
        const matchesDtc = v.maintenance.active_dtc.some(code => code.toLowerCase().includes(q));
        return matchesId || matchesModel || matchesDriver || matchesDtc;
      }
      return true;
    }).sort((a, b) => {
      let valA, valB;
      if (sortField === 'vehicle_id') {
        valA = a.vehicle_id;
        valB = b.vehicle_id;
      } else if (sortField === 'health_score') {
        valA = a.maintenance.health_score;
        valB = b.maintenance.health_score;
      } else if (sortField === 'odometer_km') {
        valA = a.telemetry.odometer_km;
        valB = b.telemetry.odometer_km;
      } else if (sortField === 'fuel_level_pct') {
        valA = a.telemetry.fuel_level_pct;
        valB = b.telemetry.fuel_level_pct;
      } else {
        valA = a.vehicle_id;
        valB = b.vehicle_id;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [vehicles, searchQuery, statusFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  /**
   * Health Score Dynamic Color Coding:
   * Red < 50%
   * Yellow / Amber 50% - 80%
   * Green > 80%
   */
  const getHealthScoreColor = (score) => {
    if (score < 50) {
      return {
        bar: 'bg-vivid-crimson',
        text: 'text-vivid-crimson',
        bg: 'bg-error-container/30',
        label: 'CRITICAL'
      };
    } else if (score <= 80) {
      return {
        bar: 'bg-amber-accent',
        text: 'text-amber',
        bg: 'bg-amber-container/30',
        label: 'WARNING'
      };
    } else {
      return {
        bar: 'bg-active-green-accent',
        text: 'text-active-green',
        bg: 'bg-active-green-container/30',
        label: 'OPTIMAL'
      };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return {
          dot: 'bg-active-green-accent',
          pill: 'bg-active-green-container text-active-green border border-active-green/30'
        };
      case 'Idle':
        return {
          dot: 'bg-amber-accent',
          pill: 'bg-amber-container text-amber border border-amber-accent/30'
        };
      case 'Critical Fault':
      default:
        return {
          dot: 'bg-vivid-crimson animate-pulse',
          pill: 'bg-error-container text-vivid-crimson border border-vivid-crimson/40'
        };
    }
  };

  return (
    <section aria-label="Engine Health Matrix" className="w-full bg-surface-container border border-outline-variant/60 rounded-lg shadow-lg overflow-hidden flex flex-col">
      
      {/* Table Control Header */}
      <div className="p-4 sm:p-5 border-b border-outline-variant/40 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Engine Health & Diagnostic Matrix
            </h3>
            <span className="text-xs font-mono bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
              {filteredVehicles.length} UNITS
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Real-time J1939 fault telemetry, predictive maintenance scores, and service schedule status
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Unit ID, Model, DTC..."
              className="w-full pl-9 pr-8 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded text-xs font-mono text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-mono text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-surface-container">All Statuses</option>
              <option value="Active" className="bg-surface-container">Active</option>
              <option value="Idle" className="bg-surface-container">Idle</option>
              <option value="Critical Fault" className="bg-surface-container">Critical Fault</option>
            </select>
          </div>

        </div>

      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-surface-dim border-b border-outline-variant/40 text-on-surface-variant font-semibold select-none">
              
              <th 
                className="py-3 px-4 cursor-pointer hover:text-on-surface transition-colors"
                onClick={() => handleSort('vehicle_id')}
              >
                <div className="flex items-center gap-1.5">
                  <span>VEHICLE ID</span>
                  <ArrowUpDown className="w-3 h-3 text-outline" />
                </div>
              </th>

              <th className="py-3 px-4">MAKE & MODEL</th>

              <th className="py-3 px-4">STATUS</th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-on-surface transition-colors"
                onClick={() => handleSort('odometer_km')}
              >
                <div className="flex items-center gap-1.5">
                  <span>ODOMETER</span>
                  <ArrowUpDown className="w-3 h-3 text-outline" />
                </div>
              </th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-on-surface transition-colors"
                onClick={() => handleSort('fuel_level_pct')}
              >
                <div className="flex items-center gap-1.5">
                  <span>FUEL LEVEL</span>
                  <ArrowUpDown className="w-3 h-3 text-outline" />
                </div>
              </th>

              <th className="py-3 px-4">NEXT SERVICE</th>

              <th className="py-3 px-4">ACTIVE DTC FAULTS</th>

              <th 
                className="py-3 px-4 cursor-pointer hover:text-on-surface transition-colors"
                onClick={() => handleSort('health_score')}
              >
                <div className="flex items-center gap-1.5">
                  <span>HEALTH SCORE</span>
                  <ArrowUpDown className="w-3 h-3 text-outline" />
                </div>
              </th>

              <th className="py-3 px-4 text-center">ACTION</th>

            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/30">
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((v) => {
                const isSelected = selectedVehicleId === v.vehicle_id;
                const healthCfg = getHealthScoreColor(v.maintenance.health_score);
                const statusCfg = getStatusBadge(v.status);

                return (
                  <tr
                    key={v.vehicle_id}
                    onClick={() => onSelectVehicle(v.vehicle_id)}
                    className={`cursor-pointer transition-colors duration-150 group ${
                      isSelected
                        ? 'bg-surface-container-high border-l-4 border-electric-blue'
                        : 'hover:bg-surface-container-high/60'
                    }`}
                  >
                    {/* Vehicle ID */}
                    <td className="py-3.5 px-4 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="text-primary group-hover:underline">
                          {v.vehicle_id}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-ping"></span>
                        )}
                      </div>
                    </td>

                    {/* Make & Model */}
                    <td className="py-3.5 px-4 font-sans text-on-surface">
                      <div>
                        <div className="font-medium text-xs text-on-surface">{v.make_model}</div>
                        <div className="text-[11px] text-on-surface-variant font-mono">Driver: {v.driver}</div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold ${statusCfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                        <span>{v.status.toUpperCase()}</span>
                      </span>
                    </td>

                    {/* Odometer */}
                    <td className="py-3.5 px-4 text-on-surface tabular-nums">
                      {v.telemetry.odometer_km.toLocaleString()} km
                    </td>

                    {/* Fuel Level */}
                    <td className="py-3.5 px-4 tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${v.telemetry.fuel_level_pct < 35 ? 'text-vivid-crimson' : 'text-on-surface'}`}>
                          {v.telemetry.fuel_level_pct.toFixed(1)}%
                        </span>
                        {v.telemetry.fuel_drop_5m_pct > 10 && (
                          <span className="px-1.5 py-0.5 rounded bg-error-container text-vivid-crimson font-bold text-[10px] animate-pulse">
                            DROP!
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Next Service Due */}
                    <td className="py-3.5 px-4 text-on-surface-variant tabular-nums">
                      {v.maintenance.next_service_due}
                    </td>

                    {/* Active DTC Faults */}
                    <td className="py-3.5 px-4">
                      {v.maintenance.active_dtc.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {v.maintenance.active_dtc.map((code) => {
                            const desc = DTC_LOOKUP[code]?.description || "Fault code";
                            return (
                              <span 
                                key={code}
                                title={`${code}: ${desc}`}
                                className="px-2 py-0.5 rounded bg-error-container text-vivid-crimson text-[10px] font-bold border border-vivid-crimson/50"
                              >
                                {code}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-active-green text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Nominal</span>
                        </span>
                      )}
                    </td>

                    {/* Health Score (Progress bar: Red < 50%, Yellow 50-80%, Green > 80%) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5 min-w-[120px]">
                        <div className="flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${healthCfg.bar}`}
                            style={{ width: `${v.maintenance.health_score}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold tabular-nums text-xs ${healthCfg.text}`}>
                          {v.maintenance.health_score}%
                        </span>
                      </div>
                    </td>

                    {/* Drill-down action button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVehicle(v.vehicle_id);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          isSelected 
                            ? 'bg-electric-blue text-white shadow' 
                            : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                        }`}
                        title={isSelected ? "Vehicle currently isolated" : "Isolate vehicle sensors"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-on-surface-variant">
                  No vehicles matched the specified query or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 bg-surface-dim border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono text-on-surface-variant">
        <div>
          Showing <span className="text-on-surface font-semibold">{filteredVehicles.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="text-on-surface font-semibold">{Math.min(currentPage * pageSize, filteredVehicles.length)}</span> of <span className="text-on-surface font-semibold">{filteredVehicles.length}</span> units
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/60 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high text-on-surface flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="px-2 text-on-surface font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/60 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-high text-on-surface flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </section>
  );
}
