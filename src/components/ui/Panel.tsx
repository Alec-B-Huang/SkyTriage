import type { PropsWithChildren, ReactNode } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function Panel({ title, eyebrow, action, className = '', children }: PanelProps) {
  return (
    <section className={`panel-glow rounded-[30px] border border-white/8 p-5 shadow-panel ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <div className="text-xs uppercase tracking-[0.28em] text-sky-200/70">{eyebrow}</div> : null}
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
