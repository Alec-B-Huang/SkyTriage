const legend = [
  { label: 'No visible damage', color: 'bg-slate-400' },
  { label: 'Minor', color: 'bg-emerald-400' },
  { label: 'Moderate', color: 'bg-yellow-400' },
  { label: 'Major / severe', color: 'bg-orange-400' },
  { label: 'Destroyed / high', color: 'bg-red-400' },
];

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          <span className="text-xs text-slate-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
