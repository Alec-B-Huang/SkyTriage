import { useMemo } from 'react';
import { buildings } from '../../data/mockData';
import type { Building, DamageAssessment, DamageLevel } from '../../types';
import { MapLegend } from './MapLegend';

const markerStyles: Record<DamageLevel, string> = {
  none: 'bg-slate-400 ring-slate-300/40',
  minor: 'bg-emerald-400 ring-emerald-300/40',
  moderate: 'bg-yellow-400 ring-yellow-300/40',
  severe: 'bg-orange-400 ring-orange-300/40',
  destroyed: 'bg-red-500 ring-red-300/40',
};

interface MapPanelProps {
  assessments: DamageAssessment[];
  selectedBuildingId: string;
  searchTerm: string;
  filter: DamageLevel | 'all';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: DamageLevel | 'all') => void;
  onSelectBuilding: (buildingId: string) => void;
}

export function MapPanel({
  assessments,
  selectedBuildingId,
  searchTerm,
  filter,
  onSearchChange,
  onFilterChange,
  onSelectBuilding,
}: MapPanelProps) {
  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      const assessment = assessments.find((item) => item.buildingId === building.id);
      const matchesSearch =
        searchTerm.length === 0 ||
        [building.id, building.address, building.neighborhood, building.occupantName]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || assessment?.damageClass === filter;
      return matchesSearch && matchesFilter;
    });
  }, [assessments, filter, searchTerm]);

  const selectedBuilding = buildings.find((item) => item.id === selectedBuildingId) ?? buildings[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <MapLegend />
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <span className="text-slate-500">Search</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Building ID or address"
              className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <span className="text-slate-500">Filter</span>
            <select
              value={filter}
              onChange={(event) => onFilterChange(event.target.value as DamageLevel | 'all')}
              className="bg-transparent text-slate-100 outline-none"
            >
              <option value="all">All classes</option>
              <option value="none">No damage</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="destroyed">Destroyed</option>
            </select>
          </label>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/10">
        <div className="map-grid relative h-[480px]">
          <div className="absolute left-5 top-5 flex gap-2">
            {['+', '-', 'Focus'].map((control) => (
              <button
                key={control}
                type="button"
                className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur"
              >
                {control}
              </button>
            ))}
          </div>

          <div className="absolute right-5 top-5 rounded-2xl border border-sky-300/15 bg-slate-950/65 px-4 py-3 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.2em] text-sky-200/70">Region</div>
            <div className="mt-2 text-sm font-medium text-slate-100">San Aurelio Coastal District</div>
            <div className="mt-1 text-xs text-slate-400">Storm capture 2026-05-15 09:52 PST</div>
          </div>

          <div className="absolute inset-0">
            {filteredBuildings.map((building: Building) => {
              const assessment = assessments.find((item) => item.buildingId === building.id);
              if (!assessment) return null;

              const isSelected = selectedBuildingId === building.id;
              return (
                <button
                  key={building.id}
                  type="button"
                  onClick={() => onSelectBuilding(building.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-950/70 transition duration-150 ${
                    isSelected ? 'z-20 scale-110 shadow-[0_0_0_8px_rgba(70,160,255,0.16)]' : 'z-10 hover:scale-105'
                  }`}
                  style={{
                    left: `${building.coordinates.x}%`,
                    top: `${building.coordinates.y}%`,
                  }}
                >
                  <span className={`block h-4 w-4 rounded-full ring-8 ${markerStyles[assessment.damageClass]}`} />
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-5 left-5 right-5 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="rounded-[24px] border border-sky-300/15 bg-slate-950/70 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-sky-200/70">Selected Building</div>
              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{selectedBuilding.id}</div>
                  <div className="mt-1 text-sm text-slate-300">{selectedBuilding.address}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {selectedBuilding.neighborhood} • Household {selectedBuilding.householdId}
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  Marker selection updates imagery review, agent trace, and FEMA draft in sync.
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Visible Markers</div>
              <div className="mt-3 text-3xl font-semibold text-white">{filteredBuildings.length}</div>
              <div className="mt-2 text-sm text-slate-400">Filtered by search and damage class</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
