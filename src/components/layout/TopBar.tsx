import type { BackendStatus } from '../../lib/api';

interface TopBarProps {
  selectedBuildingId: string;
  backendStatus: BackendStatus;
}

export function TopBar({ selectedBuildingId, backendStatus }: TopBarProps) {
  const backendLabel =
    backendStatus.mode === 'live'
      ? 'Live backend connected'
      : backendStatus.message.includes('damage assessment')
        ? 'Fallback inference active'
        : 'Mock aid matching fallback';

  return (
    <header className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,18,30,0.96),rgba(7,13,22,0.98))] px-5 py-4 shadow-[0_16px_40px_rgba(1,4,10,0.28)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-red-300/12 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-100">
              Active event
            </span>
            <span className="text-sm font-medium text-white">Coastal hurricane response</span>
            <span className="text-sm text-slate-400">Selected parcel {selectedBuildingId}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                backendStatus.mode === 'live'
                  ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
                  : 'border-amber-300/20 bg-amber-400/10 text-amber-100'
              }`}
            >
              {backendLabel}
            </span>
            <span className="text-xs text-slate-400">{backendStatus.message}</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Hurricane response triage board</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Imagery review, ML damage assessment, Bedrock orchestration trace, and disaster assistance drafting stay
            synchronized for the active parcel while mock fallbacks keep the demo stable.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Imagery Queue', value: '14 pending' },
            { label: 'Agent Latency', value: '1.6s avg' },
            { label: 'Draft Accuracy', value: '89% confidence' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-white/8 bg-white/[0.035] px-4 py-3 backdrop-blur-sm"
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
              <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
