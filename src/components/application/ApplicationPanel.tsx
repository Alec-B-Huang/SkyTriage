import { useState } from 'react';
import { buildings } from '../../data/mockData';
import type { ApplicationDraft } from '../../types';
import { Panel } from '../ui/Panel';

const tabs = ['Summary', 'Aid Programs', 'Documents', 'Missing Info'] as const;
type TabKey = (typeof tabs)[number];

interface ApplicationPanelProps {
  draft: ApplicationDraft;
}

export function ApplicationPanel({ draft }: ApplicationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('Summary');
  const building = buildings.find((item) => item.id === draft.buildingId) ?? buildings[0];

  return (
    <Panel
      eyebrow="FEMA Draft"
      title="Application output"
      action={
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
            Ready
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-100"
          >
            Download PDF
          </button>
          <button
            type="button"
            className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-medium text-sky-100"
          >
            Share Draft
          </button>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-5">
        <div className="grid gap-3 xl:grid-cols-2">
          <Card label="Applicant" value={draft.applicant.name} detail={`${draft.applicant.phone} • ${draft.applicant.email}`} />
          <Card label="Address" value={draft.address.street} detail={`${draft.address.city}, ${draft.address.state} ${draft.address.zip}`} />
          <Card label="Estimated Damage" value={draft.estimatedDamage} detail={`Parcel ${building.id}`} />
          <Card label="Household" value={building.householdId} detail={`Occupant record matched to ${building.neighborhood}`} />
        </div>

        <div className="border-b border-white/8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-t-2xl px-4 py-2.5 text-sm transition ${
                  activeTab === tab
                    ? 'border-b-2 border-sky-300 text-sky-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Summary' ? (
          <div className="grid gap-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)]">
              <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Application Summary</div>
                <p className="mt-3 text-sm leading-7 text-slate-200">{draft.summary}</p>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Draft context</div>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <div className="text-slate-500">Estimated Damage</div>
                    <div className="mt-1 font-medium text-slate-100">{draft.estimatedDamage}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Disaster</div>
                    <div className="mt-1 font-medium text-slate-100">San Aurelio coastal hurricane event</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Parcel ID</div>
                    <div className="mt-1 font-medium text-slate-100">{building.id}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Policy citations</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.citations.map((citation) => (
                  <span
                    key={citation}
                    className="rounded-full border border-sky-300/18 bg-sky-300/8 px-3 py-1.5 text-xs font-medium text-sky-100"
                  >
                    {citation}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'Aid Programs' ? (
          <div className="space-y-3">
            {draft.aidPrograms.map((program) => (
              <div key={program.name} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{program.name}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">{program.fit}</div>
                  </div>
                  <div className="inline-flex rounded-full border border-sky-300/18 bg-sky-300/8 px-3 py-1.5 text-xs text-sky-100">
                    {program.policyCitation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === 'Documents' ? (
          <div className="space-y-3">
            {draft.documents.map((document) => (
              <div key={document} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                {document}
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === 'Missing Info' ? (
          <div className="space-y-3">
            {draft.missingInfo.map((item) => (
              <div key={item} className="rounded-[22px] border border-orange-300/15 bg-orange-400/8 px-4 py-3 text-sm text-orange-100">
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

function Card({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-100">{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate-400">{detail}</div>
    </div>
  );
}
