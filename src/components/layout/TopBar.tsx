interface TopBarProps {
  selectedBuildingId: string;
}

export function TopBar({ selectedBuildingId }: TopBarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-white/[0.04] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.28em] text-sky-200/70">Operational Snapshot</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">Hurricane response triage board</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Selected parcel <span className="font-medium text-slate-100">{selectedBuildingId}</span> is syncing imagery review,
          aid matching, and application draft generation across the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Imagery Queue', value: '14 pending' },
          { label: 'Agent Latency', value: '1.6s avg' },
          { label: 'Draft Accuracy', value: '89% confidence' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-sky-300/10 bg-sky-300/5 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
            <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
