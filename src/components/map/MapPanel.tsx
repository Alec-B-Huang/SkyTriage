import { useMemo } from 'react';
import { buildings } from '../../data/mockData';
import type { Building, DamageAssessment, DamageLevel } from '../../types';
import { MapLegend } from './MapLegend';

const markerStyles: Record<DamageLevel, string> = {
  none: 'bg-slate-300 ring-slate-200/25',
  minor: 'bg-emerald-400 ring-emerald-300/35',
  moderate: 'bg-amber-300 ring-amber-200/35',
  severe: 'bg-orange-400 ring-orange-300/35',
  destroyed: 'bg-red-500 ring-red-300/35',
};

const markerBadgeStyles: Record<DamageLevel, string> = {
  none: 'border-slate-300/25 bg-slate-300/12 text-slate-100',
  minor: 'border-emerald-300/25 bg-emerald-400/12 text-emerald-100',
  moderate: 'border-amber-300/25 bg-amber-400/12 text-amber-100',
  severe: 'border-orange-300/25 bg-orange-400/12 text-orange-100',
  destroyed: 'border-red-300/25 bg-red-400/12 text-red-100',
};

const majorRoads = [
  { left: '3%', top: '20%', width: '61%', rotate: '-11deg' },
  { left: '10%', top: '34%', width: '58%', rotate: '9deg' },
  { left: '14%', top: '58%', width: '50%', rotate: '-13deg' },
  { left: '44%', top: '10%', width: '36%', rotate: '31deg' },
  { left: '58%', top: '52%', width: '28%', rotate: '-27deg' },
];

const secondaryRoads = [
  { left: '5%', top: '15%', width: '46%', rotate: '20deg' },
  { left: '18%', top: '24%', width: '40%', rotate: '-34deg' },
  { left: '20%', top: '44%', width: '52%', rotate: '18deg' },
  { left: '9%', top: '70%', width: '43%', rotate: '14deg' },
  { left: '25%', top: '61%', width: '42%', rotate: '-30deg' },
  { left: '54%', top: '18%', width: '25%', rotate: '-18deg' },
  { left: '61%', top: '38%', width: '24%', rotate: '26deg' },
];

const parcelOutlines = Array.from({ length: 26 }, (_, index) => {
  const column = index % 5;
  const row = Math.floor(index / 5);
  const left = 7 + column * 12.6 + (row % 2) * 1.2;
  const top = 13 + row * 12.1 + (column % 2) * 0.8;
  const width = 10.4 + (index % 3) * 1.6;
  const height = 8 + ((index + 1) % 4) * 0.9;
  const rotate = (index % 2 === 0 ? -1 : 1) * (((index * 3) % 5) * 0.65);

  return { left, top, width, height, rotate };
}).filter((parcel) => parcel.left + parcel.width < 79);

const backdropFootprints = Array.from({ length: 94 }, (_, index) => {
  const column = index % 11;
  const row = Math.floor(index / 11);
  const left = 7.5 + column * 5.8 + (row % 2) * 0.9 + ((index * 7) % 3) * 0.18;
  const top = 13 + row * 7.1 + ((index * 11) % 4) * 0.22;
  const width = 1.1 + (index % 4) * 0.34;
  const height = 0.88 + ((index + 1) % 3) * 0.28;
  const rotate = ((index * 17) % 10) - 5;

  return {
    left,
    top,
    width,
    height,
    rotate,
    tone:
      index % 8 === 0
        ? 'rgba(183, 169, 131, 0.18)'
        : index % 5 === 0
          ? 'rgba(159, 168, 172, 0.16)'
          : 'rgba(119, 127, 135, 0.12)',
  };
}).filter((footprint) => footprint.left + footprint.width < 79 && footprint.top < 90);

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
  const selectedAssessment = assessments.find((item) => item.buildingId === selectedBuilding.id) ?? assessments[0];
  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <MapLegend />
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/14 bg-sky-300/8 px-4 py-2 text-sm text-sky-100">
            <span className="text-base font-semibold text-white">{filteredBuildings.length}</span>
            <span className="text-slate-300">visible markers</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
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

        <div className="grid gap-2 rounded-[18px] border border-white/12 bg-slate-950/84 px-3 py-2.5 shadow-[0_14px_30px_rgba(1,4,10,0.18)] backdrop-blur-sm md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] md:items-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Selected Marker</div>
          <div className="text-sm font-semibold text-white">{selectedBuilding.id}</div>
          <div className="min-w-0 truncate text-sm text-slate-300">{selectedBuilding.address}</div>
          <div
            className={`justify-self-start rounded-full border px-2.5 py-1 text-xs font-medium ${markerBadgeStyles[selectedAssessment.damageClass]}`}
          >
            {selectedAssessment.damageLabel}
          </div>
          <div className="grid grid-cols-[auto_auto] items-baseline gap-x-2 gap-y-0.5 justify-self-start md:justify-self-end">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Confidence</div>
            <div className="text-sm font-semibold text-slate-100">{selectedAssessment.confidence.toFixed(2)}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Assessed</div>
            <div className="text-sm font-semibold text-slate-100">{formatShortTime(selectedAssessment.assessedAt)}</div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#07111b]">
        <div className="map-surface relative h-[480px]">
          <div className="map-waterway absolute inset-y-[-5%] right-[11%] w-[14%] rotate-[7deg] rounded-[42%]" />

          <div className="absolute inset-0">
            {majorRoads.map((road) => (
              <div
                key={`${road.left}-${road.top}-${road.rotate}`}
                className="absolute h-[2px] rounded-full bg-white/[0.22] shadow-[0_0_16px_rgba(255,255,255,0.04)]"
                style={{
                  left: road.left,
                  top: road.top,
                  width: road.width,
                  transform: `rotate(${road.rotate})`,
                  transformOrigin: 'left center',
                }}
              />
            ))}
            {secondaryRoads.map((road) => (
              <div
                key={`${road.left}-${road.top}-${road.rotate}`}
                className="absolute h-px rounded-full bg-white/12"
                style={{
                  left: road.left,
                  top: road.top,
                  width: road.width,
                  transform: `rotate(${road.rotate})`,
                  transformOrigin: 'left center',
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-80">
            {parcelOutlines.map((parcel, index) => (
              <div
                key={`${parcel.left}-${parcel.top}-${index}`}
                className="absolute rounded-sm border border-white/[0.06]"
                style={{
                  left: `${parcel.left}%`,
                  top: `${parcel.top}%`,
                  width: `${parcel.width}%`,
                  height: `${parcel.height}%`,
                  transform: `rotate(${parcel.rotate}deg)`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-90">
            {backdropFootprints.map((footprint, index) => (
              <div
                key={`${footprint.left}-${footprint.top}-${index}`}
                className="absolute rounded-[2px] border border-white/[0.05]"
                style={{
                  left: `${footprint.left}%`,
                  top: `${footprint.top}%`,
                  width: `${footprint.width}%`,
                  height: `${footprint.height}%`,
                  transform: `rotate(${footprint.rotate}deg)`,
                  backgroundColor: footprint.tone,
                }}
              />
            ))}
          </div>

          <div className="absolute left-5 right-5 top-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="rounded-[22px] border border-white/8 bg-slate-950/78 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-sky-200/70">Region</div>
              <div className="mt-2 text-sm font-medium text-slate-100">San Aurelio coastal district</div>
              <div className="mt-1 text-xs text-slate-400">Storm capture 2026-05-15 09:52 PST</div>
            </div>

            <div className="flex items-start gap-3 self-end lg:self-auto">
              <div className="flex flex-col gap-2">
                {['Locate', '+', '-'].map((control) => (
                  <button
                    key={control}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-slate-950/78 px-4 py-2 text-xs font-medium text-slate-100"
                  >
                    {control}
                  </button>
                ))}
              </div>
            </div>
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
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[6px] border-2 border-slate-950/75 p-0.5 transition duration-150 ${
                    isSelected ? 'z-20 scale-110 shadow-[0_0_0_6px_rgba(125,190,255,0.14)]' : 'z-10 hover:scale-105'
                  }`}
                  style={{
                    left: `${building.coordinates.x}%`,
                    top: `${building.coordinates.y}%`,
                  }}
                >
                  <span className={`block h-3.5 w-3.5 rounded-[4px] ring-4 ${markerStyles[assessment.damageClass]}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
        <div className="min-w-0 rounded-[24px] border border-white/14 bg-slate-950/92 p-3.5 shadow-[0_18px_36px_rgba(1,4,10,0.32)] backdrop-blur-sm">
          <div className="text-xs uppercase tracking-[0.22em] text-sky-200/70">Selected Building</div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-end">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-white">{selectedBuilding.id}</div>
              <div className="mt-1 text-sm text-slate-300">{selectedBuilding.address}</div>
              <div className="mt-1 text-xs text-slate-500">
                {selectedBuilding.neighborhood} • Household {selectedBuilding.householdId}
              </div>
            </div>
            <div className="min-w-0 text-sm leading-6 text-slate-300">
              Parcel context stays linked to the selected marker so imagery, assessment, and draft details stay in sync
              as we swap parcels.
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-[24px] border border-white/12 bg-slate-950/84 p-3.5 shadow-[0_18px_36px_rgba(1,4,10,0.24)] backdrop-blur-sm">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Assessment Details</div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            <AssessmentStat label="Damage Class" value={selectedAssessment.damageLabel} />
            <AssessmentStat label="Confidence" value={selectedAssessment.confidence.toFixed(2)} />
            <AssessmentStat label="Assessed" value={formatShortTime(selectedAssessment.assessedAt)} />
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            {selectedAssessment.summary} Future Bedrock or API-backed calls can continue to plug into this same selected
            parcel workflow.
          </div>
        </div>
      </div>
    </div>
  );
}

function formatShortTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function AssessmentStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[116px] flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <div className="min-h-[34px] text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 flex min-h-[44px] items-start text-sm font-semibold leading-8 text-slate-100">{value}</div>
    </div>
  );
}
