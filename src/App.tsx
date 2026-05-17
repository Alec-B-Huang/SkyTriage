import { useEffect, useMemo, useState } from 'react';
import { AgentTracePanel } from './components/agent/AgentTracePanel';
import { ApplicationPanel } from './components/application/ApplicationPanel';
import { DamageAssessmentPanel } from './components/damage/DamageAssessmentPanel';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MapPanel } from './components/map/MapPanel';
import { Panel } from './components/ui/Panel';
import { applicationDrafts, buildings, damageAssessments as mockAssessments, workflows as mockWorkflows } from './data/mockData';
import {
  assessDamage,
  getBackendStatusSnapshot,
  getApplicationDraft,
  getDamageAssessments,
  matchAidPrograms,
  resetBackendStatus,
  runAgentWorkflow,
  type BackendStatus,
} from './lib/api';
import type { AgentWorkflow, ApplicationDraft, DamageAssessment, DamageLevel } from './types';

const initialBuildingId = buildings[2].id;
const initialApplicationDraft = applicationDrafts.find((draft) => draft.buildingId === initialBuildingId) ?? applicationDrafts[0];
const initialWorkflow = mockWorkflows.find((workflow) => workflow.buildingId === initialBuildingId) ?? mockWorkflows[0];

function App() {
  const [assessments, setAssessments] = useState<DamageAssessment[]>([]);
  const [assessmentOverrides, setAssessmentOverrides] = useState<Record<string, DamageAssessment>>({});
  const [selectedBuildingId, setSelectedBuildingId] = useState(initialBuildingId);
  const [workflow, setWorkflow] = useState<AgentWorkflow>(initialWorkflow);
  const [applicationDraft, setApplicationDraft] = useState<ApplicationDraft>(initialApplicationDraft);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<DamageLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [assessingBuildingId, setAssessingBuildingId] = useState<string | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<PanelStatus>({
    tone: 'idle',
    message: 'Upload imagery to run live /assess. If the backend misses, the panel keeps the current demo-safe result.',
  });
  const [aidMatchingStatus, setAidMatchingStatus] = useState<PanelStatus>({
    tone: 'idle',
    message: 'Aid recommendations stay available with mock fallback while the demo keeps the current parcel in sync.',
  });
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    mode: 'live',
    message: 'Awaiting backend calls.',
  });

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      resetBackendStatus();

      try {
        const baseAssessments = await getDamageAssessments();
        setAssessments(baseAssessments);
      } catch {
        setAssessments(mockAssessments);
      } finally {
        setBackendStatus(getBackendStatusSnapshot());
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  useEffect(() => {
    if (assessments.length === 0) return;

    const refreshSelection = async () => {
      const selectedAssessment = assessments.find((item) => item.buildingId === selectedBuildingId);
      if (!selectedAssessment) return;

      resetBackendStatus();

      try {
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
      } catch {
        const fallbackDraft = applicationDrafts.find((draft) => draft.buildingId === selectedBuildingId) ?? applicationDrafts[0];
        const fallbackWorkflow = mockWorkflows.find((workflow) => workflow.buildingId === selectedBuildingId) ?? mockWorkflows[0];
        setApplicationDraft(fallbackDraft);
        setWorkflow(fallbackWorkflow);
      } finally {
        const snapshot = getBackendStatusSnapshot();
        setBackendStatus(snapshot);
        setAidMatchingStatus(getAidMatchingStatus(snapshot));
      }
    };

    void refreshSelection();
  }, [assessments, selectedBuildingId]);

  const selectedAssessment = useMemo(
    () =>
      assessmentOverrides[selectedBuildingId] ??
      assessments.find((item) => item.buildingId === selectedBuildingId) ??
      assessments[0],
    [assessmentOverrides, assessments, selectedBuildingId],
  );

  const handleRunAssessment = async (file: File) => {
    if (!selectedAssessment) return;

    const activeBuildingId = selectedBuildingId;
    const activeAssessment = selectedAssessment;

    setAssessingBuildingId(activeBuildingId);
    setAssessmentStatus({
      tone: 'idle',
      message: 'Submitting uploaded imagery to /assess and preparing fallback output if the live response misses.',
    });
    resetBackendStatus();

    try {
      const imageBase64 = await readFileAsDataUrl(file);
      const assessmentResult = await assessDamage(imageBase64);
      const snapshot = getBackendStatusSnapshot();
      const mergedAssessment =
        snapshot.mode === 'fallback'
          ? createAssessmentFallbackView(activeAssessment, imageBase64)
          : mergeAssessmentResult(activeAssessment, assessmentResult, imageBase64);

      setAssessmentOverrides((current) => ({
        ...current,
        [activeBuildingId]: mergedAssessment,
      }));
      setAssessmentStatus(getAssessmentPanelStatus(snapshot));
    } catch {
      setAssessmentStatus({
        tone: 'fallback',
        message: 'Unable to read the selected image. Keeping the current ML assessment visible.',
      });
    } finally {
      setBackendStatus(getBackendStatusSnapshot());
      setAssessingBuildingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Sidebar />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto flex max-w-[1760px] flex-col gap-5">
            <TopBar selectedBuildingId={selectedBuildingId} backendStatus={backendStatus} />

            {loading || !selectedAssessment ? (
              <Panel eyebrow="Loading" title="Preparing dashboard">
                <div className="text-sm text-slate-300">Syncing mock imagery, policy matches, and draft application data.</div>
              </Panel>
            ) : (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.92fr)]">
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
                  <DamageAssessmentPanel
                    assessment={selectedAssessment}
                    isAssessing={assessingBuildingId === selectedBuildingId}
                    onRunAssessment={handleRunAssessment}
                    status={assessmentStatus}
                  />
                </div>

                <div className="grid gap-5">
                  <AgentTracePanel workflow={workflow} />
                  <ApplicationPanel draft={applicationDraft} matchingStatus={aidMatchingStatus} />
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

type PanelStatusTone = 'live' | 'fallback' | 'idle';

interface PanelStatus {
  tone: PanelStatusTone;
  message: string;
}

function mergeAssessmentResult(
  currentAssessment: DamageAssessment,
  nextAssessment: DamageAssessment,
  imageBase64: string,
): DamageAssessment {
  return {
    ...currentAssessment,
    ...nextAssessment,
    buildingId: currentAssessment.buildingId,
    beforeImage: nextAssessment.beforeImage || currentAssessment.beforeImage,
    afterImage: nextAssessment.afterImage || imageBase64 || currentAssessment.afterImage,
    assessedAt: nextAssessment.assessedAt || new Date().toISOString(),
    evidenceTags: nextAssessment.evidenceTags.length > 0 ? nextAssessment.evidenceTags : currentAssessment.evidenceTags,
    summary: nextAssessment.summary || currentAssessment.summary,
    estimatedDamage: nextAssessment.estimatedDamage || currentAssessment.estimatedDamage,
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to convert the selected image to base64.'));
    };

    reader.onerror = () => reject(reader.error ?? new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });
}

function createAssessmentFallbackView(currentAssessment: DamageAssessment, imageBase64: string): DamageAssessment {
  return {
    ...currentAssessment,
    afterImage: imageBase64 || currentAssessment.afterImage,
  };
}

function getAssessmentPanelStatus(snapshot: BackendStatus): PanelStatus {
  if (snapshot.mode === 'fallback') {
    return {
      tone: 'fallback',
      message: 'Fallback inference active. The ML assessment card is showing mock-compatible output for this upload.',
    };
  }

  return {
    tone: 'live',
    message: 'Live backend connected. The ML assessment card is showing the latest /assess response.',
  };
}

function getAidMatchingStatus(snapshot: BackendStatus): PanelStatus {
  if (snapshot.mode === 'fallback') {
    return {
      tone: 'fallback',
      message: 'Using mock aid matching fallback while /match is unavailable for this parcel.',
    };
  }

  return {
    tone: 'live',
    message: 'Live backend connected. Aid recommendations were refreshed through /match for the selected parcel.',
  };
}
