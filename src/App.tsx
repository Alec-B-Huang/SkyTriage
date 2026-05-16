import { useEffect, useMemo, useState } from 'react';
import { AgentTracePanel } from './components/agent/AgentTracePanel';
import { ApplicationPanel } from './components/application/ApplicationPanel';
import { DamageAssessmentPanel } from './components/damage/DamageAssessmentPanel';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MapPanel } from './components/map/MapPanel';
import { Panel } from './components/ui/Panel';
import { buildings } from './data/mockData';
import {
  getApplicationDraft,
  getDamageAssessments,
  matchAidPrograms,
  runAgentWorkflow,
} from './lib/api';
import type { AgentWorkflow, ApplicationDraft, DamageAssessment, DamageLevel } from './types';

const initialBuildingId = buildings[2].id;

function App() {
  const [assessments, setAssessments] = useState<DamageAssessment[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(initialBuildingId);
  const [workflow, setWorkflow] = useState<AgentWorkflow | null>(null);
  const [applicationDraft, setApplicationDraft] = useState<ApplicationDraft | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<DamageLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const baseAssessments = await getDamageAssessments();
      setAssessments(baseAssessments);
      setLoading(false);
    };

    void loadDashboard();
  }, []);

  useEffect(() => {
    if (assessments.length === 0) return;

    const refreshSelection = async () => {
      const selectedAssessment = assessments.find((item) => item.buildingId === selectedBuildingId);
      if (!selectedAssessment) return;

      const [draft, agentWorkflow, aidPrograms] = await Promise.all([
        getApplicationDraft(selectedBuildingId),
        runAgentWorkflow(selectedBuildingId),
        matchAidPrograms({
          buildingId: selectedBuildingId,
          estimatedDamage: selectedAssessment.estimatedDamage,
          evidenceTags: selectedAssessment.evidenceTags,
        }),
      ]);

      setApplicationDraft({ ...draft, aidPrograms });
      setWorkflow(agentWorkflow);
    };

    void refreshSelection();
  }, [assessments, selectedBuildingId]);

  const selectedAssessment = useMemo(
    () => assessments.find((item) => item.buildingId === selectedBuildingId) ?? assessments[0],
    [assessments, selectedBuildingId],
  );

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Sidebar />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto flex max-w-[1700px] flex-col gap-5">
            <TopBar selectedBuildingId={selectedBuildingId} />

            {loading || !selectedAssessment || !applicationDraft || !workflow ? (
              <Panel eyebrow="Loading" title="Preparing dashboard">
                <div className="text-sm text-slate-300">Syncing mock imagery, policy matches, and draft application data.</div>
              </Panel>
            ) : (
              <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.6fr)_minmax(380px,0.9fr)]">
                <div className="grid gap-5">
                  <Panel eyebrow="Damage Map" title="Disaster impact map">
                    <MapPanel
                      assessments={assessments}
                      selectedBuildingId={selectedBuildingId}
                      searchTerm={searchTerm}
                      filter={filter}
                      onSearchChange={setSearchTerm}
                      onFilterChange={setFilter}
                      onSelectBuilding={setSelectedBuildingId}
                    />
                  </Panel>
                  <DamageAssessmentPanel assessment={selectedAssessment} />
                </div>

                <div className="grid gap-5">
                  <AgentTracePanel workflow={workflow} />
                  <ApplicationPanel draft={applicationDraft} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
