interface TopBarProps {
  selectedBuildingId: string;
}

export function TopBar({ selectedBuildingId }: TopBarProps) {
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
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Hurricane response triage board</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Imagery review, ML damage assessment, Bedrock workflow trace, and draft assistance output stay synchronized for
            the active parcel without relying on live backend services yet.
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
