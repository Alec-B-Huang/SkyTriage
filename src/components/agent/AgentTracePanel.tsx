import type { AgentWorkflow } from '../../types';
import { Panel } from '../ui/Panel';

interface AgentTracePanelProps {
  workflow: AgentWorkflow;
}

export function AgentTracePanel({ workflow }: AgentTracePanelProps) {
  return (
    <Panel
      eyebrow="Bedrock Workflow"
      title="Agent trace"
      action={
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-200">
          {workflow.steps.filter((step) => step.status === 'complete').length}/{workflow.steps.length} steps synced
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          Trace events stay visually prominent here, but the panel remains presentation-only until live Bedrock workflow
          events replace the mock API response.
        </div>

        <div className="space-y-3">
          {workflow.steps.map((step, index) => {
            const isComplete = step.status === 'complete';
            const isActive = step.status === 'active';

            return (
              <div key={step.title} className="relative pl-14">
                {index < workflow.steps.length - 1 ? (
                  <div className="absolute left-[17px] top-8 h-[calc(100%+10px)] w-px bg-gradient-to-b from-sky-400/40 to-white/[0.05]" />
                ) : null}
                <div
                  className={`absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold ${
                    isComplete
                      ? 'border-emerald-300/30 bg-emerald-400/12 text-emerald-100'
                      : isActive
                        ? 'border-sky-300/35 bg-sky-400/15 text-sky-100'
                        : 'border-white/12 bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {isComplete ? '✓' : isActive ? '⋯' : index + 1}
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{step.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
                    </div>
                    <div
                      className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] ${
                        isComplete
                          ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
                          : isActive
                            ? 'border-sky-300/20 bg-sky-400/10 text-sky-100'
                            : 'border-white/8 bg-black/20 text-slate-400'
                      }`}
                    >
                      {step.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
