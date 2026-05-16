const navItems = [
  { label: 'Command Center', value: 'Active' },
  { label: 'Incidents', value: 'Wildfire + flood' },
  { label: 'Coverage', value: '24 parcels tracked' },
  { label: 'Priority Cases', value: '6 households' },
];

const quickStats = [
  { label: 'Destroyed', value: '1', tone: 'text-red-300' },
  { label: 'Severe', value: '2', tone: 'text-orange-300' },
  { label: 'Moderate', value: '1', tone: 'text-yellow-300' },
  { label: 'Minor/None', value: '2', tone: 'text-emerald-300' },
];

export function Sidebar() {
  return (
    <aside className="panel-glow flex min-h-screen w-full max-w-[270px] flex-col justify-between border-r border-white/10 px-5 py-6 shadow-panel">
      <div className="space-y-8">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-sky-200/70">SkyTriage</div>
          <h1 className="mt-3 text-2xl font-semibold text-white">Response Command</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Bedrock-assisted disaster triage for property damage, aid matching, and draft intake.
          </p>
        </div>

        <div className="rounded-3xl border border-sky-300/15 bg-sky-300/5 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-sky-200/70">Mission</div>
          <div className="mt-3 text-sm leading-6 text-slate-100">
            Prioritize damaged households, surface evidence fast, and prep FEMA-ready drafts without backend dependencies.
          </div>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
              <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
            </div>
          ))}
        </nav>

        <section className="space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-sky-200/70">Severity Mix</div>
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-slate-300">{stat.label}</span>
              <span className={`text-lg font-semibold ${stat.tone}`}>{stat.value}</span>
            </div>
          ))}
        </section>
      </div>

      <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Ops Status</div>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.7)]" />
          Mock agent workflow healthy
        </div>
      </div>
    </aside>
  );
}
