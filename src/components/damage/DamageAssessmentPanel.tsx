import { buildings } from '../../data/mockData';
import type { DamageAssessment } from '../../types';
import { Panel } from '../ui/Panel';

interface DamageAssessmentPanelProps {
  assessment: DamageAssessment;
}

export function DamageAssessmentPanel({ assessment }: DamageAssessmentPanelProps) {
  const building = buildings.find((item) => item.id === assessment.buildingId) ?? buildings[0];

  return (
    <Panel
      eyebrow="Vision Assessment"
      title="Damage assessment"
      action={
        <div className="rounded-full border border-red-300/15 bg-red-400/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-red-200">
          ML first
        </div>
      }
      className="h-full"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(270px,0.92fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[24px] border border-white/8 bg-black/20">
            <img src={assessment.beforeImage} alt={`Before imagery for ${assessment.buildingId}`} className="h-56 w-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-[24px] border border-white/8 bg-black/20">
            <img src={assessment.afterImage} alt={`After imagery for ${assessment.buildingId}`} className="h-56 w-full object-cover" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[26px] border border-sky-300/18 bg-sky-300/8 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-sky-200/70">Model Classification</div>
            <div className="mt-3 text-3xl font-semibold text-white">{assessment.damageLabel}</div>
            <div className="mt-2 text-sm text-sky-100">confidence {assessment.confidence.toFixed(2)}</div>
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
              {assessment.summary}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Building ID" value={building.id} />
            <InfoItem label="Assessment Time" value={formatTime(assessment.assessedAt)} />
            <InfoItem label="Address" value={building.address} />
            <InfoItem label="Estimated Damage" value={assessment.estimatedDamage} />
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Evidence Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {assessment.evidenceTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-100">{value}</div>
    </div>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
