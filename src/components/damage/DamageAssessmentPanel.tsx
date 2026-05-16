import { buildings } from '../../data/mockData';
import type { DamageLevel, DamageAssessment } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Panel } from '../ui/Panel';

const damageTone: Record<DamageLevel, string> = {
  none: 'text-slate-100',
  minor: 'text-emerald-300',
  moderate: 'text-amber-300',
  severe: 'text-orange-300',
  destroyed: 'text-red-300',
};

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
        <div className="rounded-full border border-sky-300/15 bg-sky-300/8 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-sky-100">
          ML classification
        </div>
      }
      className="h-full"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Selected building</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {building.id} <span className="text-slate-500">•</span> {building.address}
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {building.neighborhood} neighborhood • Household {building.householdId}
                </div>
              </div>
              <div className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-xs text-slate-300">
                Assessed {formatTime(assessment.assessedAt)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex min-h-[44px] items-start justify-between gap-3">
                <div className="text-sm font-medium text-white">Before</div>
                <div className="whitespace-nowrap pt-0.5 text-right text-xs uppercase tracking-[0.22em] text-slate-500">
                  Reference imagery
                </div>
              </div>
              <ImageWithFallback
                src={assessment.beforeImage}
                alt={`Before imagery for ${assessment.buildingId}`}
                label="Before imagery"
                hint="Add real pre-event aerial or drone imagery to /public/mock-imagery/house-before.jpg when available."
                variant="before"
                className="h-[220px]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex min-h-[44px] items-start justify-between gap-3">
                <div className="text-sm font-medium text-white">After</div>
                <div className="whitespace-nowrap pt-0.5 text-right text-xs uppercase tracking-[0.22em] text-slate-500">
                  Post-event evidence
                </div>
              </div>
              <ImageWithFallback
                src={assessment.afterImage}
                alt={`After imagery for ${assessment.buildingId}`}
                label="After imagery"
                hint="Replace /public/mock-imagery/house-after-damage.jpg or /satellite-damage-area.jpg with real hurricane damage captures later."
                variant="after"
                className="h-[220px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-sky-300/18 bg-[linear-gradient(180deg,rgba(24,47,72,0.34),rgba(12,22,34,0.92))] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-sky-200/70">AI Damage Classification</div>
            <div className={`mt-3 text-[2rem] font-semibold tracking-tight ${damageTone[assessment.damageClass]}`}>
              {assessment.damageLabel}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-300">{assessment.summary}</div>

            <div className="mt-5 rounded-[22px] border border-white/8 bg-black/20 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-[110px] w-[110px] shrink-0 place-items-center rounded-full border border-sky-300/18 bg-slate-950/80 text-center">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Confidence</div>
                      <div className="mt-2 text-3xl font-semibold text-white">{assessment.confidence.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Model readout</div>
                    <div className={`mt-2 text-xl font-semibold ${damageTone[assessment.damageClass]}`}>{assessment.damageLabel}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      Confidence, case metadata, and timing stay grouped here so the model result remains easy to scan.
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <InfoItem label="Damage Class" value={assessment.damageLabel} />
                  <InfoItem label="Estimated Damage" value={assessment.estimatedDamage} />
                  <InfoItem label="Building ID" value={building.id} />
                  <InfoItem label="Assessment Time" value={formatTime(assessment.assessedAt)} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Evidence tags</div>
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

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Assessment context</div>
            <div className="mt-3 text-sm leading-7 text-slate-300">
              Mock imagery paths are already wired into the panel so real hurricane, flood, or xBD-style imagery can be
              dropped into <span className="font-medium text-slate-100">/public/mock-imagery</span> later without changing the UI.
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-100 break-words">{value}</div>
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
