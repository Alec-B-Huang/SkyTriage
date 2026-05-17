import { applicationDrafts, damageAssessments, workflows } from '../data/mockData';
import type { AgentWorkflow, ApplicationDraft, DamageAssessment } from '../types';

const DEFAULT_API_BASE_URL = 'https://3f1zbvfe94.execute-api.us-west-2.amazonaws.com/prod';
const runtimeEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const API_BASE_URL = (runtimeEnv?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 5000;

type HttpMethod = 'GET' | 'POST';
type BackendMode = 'live' | 'fallback';

interface CandidateRequest<TBody = unknown> {
  path: string;
  method?: HttpMethod;
  body?: TBody;
}

interface ApiEnvelope<T> {
  data?: T;
  item?: T;
  items?: T;
  result?: T;
  workflow?: T;
  draft?: T;
  assessment?: T;
  aidPrograms?: T;
}

export interface BackendStatus {
  mode: BackendMode;
  message: string;
}

let backendTracker = createBackendTracker();

export const getDamageAssessments = async (): Promise<DamageAssessment[]> => {
  return damageAssessments;
};

export const assessDamage = async (imageBase64: string): Promise<DamageAssessment> => {
  const payload = { imageBase64 };
  return withFallback(
    'damage assessment',
    async () => {
      const result = await request<unknown>({
        path: '/assess',
        method: 'POST',
        body: payload,
      });

      return normalizeAssessmentResult(result, imageBase64);
    },
    () => ({
      ...damageAssessments[0],
      afterImage: imageBase64 || damageAssessments[0].afterImage,
    }),
  );
};

export const matchAidPrograms = async (payload: {
  buildingId: string;
  estimatedDamage: string;
  evidenceTags: string[];
}): Promise<ApplicationDraft['aidPrograms']> => {
  return withFallback(
    'aid program matching',
    async () => {
      const result = await request<ApplicationDraft['aidPrograms']>({
        path: '/match',
        method: 'POST',
        body: payload,
      });

      return unwrapArray(result, 'aid programs');
    },
    () => applicationDrafts.find((draft) => draft.buildingId === payload.buildingId)?.aidPrograms ?? [],
  );
};

export const getApplicationDraft = async (buildingId: string): Promise<ApplicationDraft> => {
  return applicationDrafts.find((draft) => draft.buildingId === buildingId) ?? applicationDrafts[0];
};

export const runAgentWorkflow = async (buildingId: string): Promise<AgentWorkflow> => {
  return workflows.find((workflow) => workflow.buildingId === buildingId) ?? workflows[0];
};

export function resetBackendStatus() {
  backendTracker = createBackendTracker();
}

export function getBackendStatusSnapshot(): BackendStatus {
  if (backendTracker.fallbackCount > 0) {
    return {
      mode: 'fallback',
      message: backendTracker.lastIssue
        ? `Using mock fallback: ${backendTracker.lastIssue}`
        : 'Using mock fallback while backend routes are unavailable.',
    };
  }

  if (backendTracker.successCount > 0) {
    return {
      mode: 'live',
      message: 'API Gateway connected.',
    };
  }

  return {
    mode: 'live',
    message: 'Awaiting backend calls.',
  };
}

async function request<TResult>({ path, method = 'GET', body }: CandidateRequest): Promise<TResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    signal: controller.signal,
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).finally(() => window.clearTimeout(timeoutId));

  const rawText = await response.text();
  const parsed = parseJsonSafely(rawText);

  if (!response.ok) {
    const message =
      parsed && typeof parsed === 'object' && 'message' in parsed && typeof parsed.message === 'string'
        ? parsed.message
        : rawText || `${response.status} ${response.statusText}`;
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return unwrapEnvelope<TResult>(parsed);
}

async function withFallback<TResult>(label: string, requestFn: () => Promise<TResult>, fallbackFn: () => TResult): Promise<TResult> {
  try {
    const result = await requestFn();
    recordSuccess(label);
    return result;
  } catch (error) {
    recordFallback(label, error);
    return fallbackFn();
  }
}

function unwrapEnvelope<TResult>(payload: unknown): TResult {
  if (!payload || typeof payload !== 'object') {
    return payload as TResult;
  }

  const envelope = payload as ApiEnvelope<TResult>;
  return (
    envelope.data ??
    envelope.item ??
    envelope.items ??
    envelope.result ??
    envelope.workflow ??
    envelope.draft ??
    envelope.assessment ??
    envelope.aidPrograms ??
    (payload as TResult)
  );
}

function unwrapArray<T>(payload: unknown, label: string): T[] {
  if (!Array.isArray(payload)) {
    throw new Error(`Expected ${label} array from API response.`);
  }

  return payload;
}

function unwrapObject<T>(payload: unknown, label: string): T {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(`Expected ${label} object from API response.`);
  }

  return payload as T;
}

function normalizeAssessmentResult(payload: unknown, imageBase64: string): DamageAssessment {
  const source = unwrapObject<Record<string, unknown>>(payload, 'damage assessment');
  const baseline = damageAssessments[0];
  const damageClass = normalizeDamageClass(
    source.damageClass ??
      source.damage_class ??
      source.damageLevel ??
      source.damage_level ??
      source.classification ??
      source.label ??
      source.damageLabel,
  );
  const damageLabel =
    readString(source.damageLabel) ??
    readString(source.damage_label) ??
    readString(source.classification) ??
    readString(source.label) ??
    formatDamageLabel(damageClass);

  return {
    ...baseline,
    buildingId: readString(source.buildingId) ?? readString(source.building_id) ?? baseline.buildingId,
    damageClass,
    damageLabel,
    confidence:
      readNumber(source.confidence) ??
      readNumber(source.confidence_score) ??
      readNumber(source.score) ??
      baseline.confidence,
    assessedAt: readString(source.assessedAt) ?? readString(source.assessed_at) ?? new Date().toISOString(),
    evidenceTags:
      readStringArray(source.evidenceTags) ?? readStringArray(source.evidence_tags) ?? baseline.evidenceTags,
    summary: readString(source.summary) ?? readString(source.explanation) ?? baseline.summary,
    estimatedDamage:
      readString(source.estimatedDamage) ?? readString(source.estimated_damage) ?? baseline.estimatedDamage,
    beforeImage: readString(source.beforeImage) ?? readString(source.before_image) ?? baseline.beforeImage,
    afterImage: readString(source.afterImage) ?? readString(source.after_image) ?? imageBase64 ?? baseline.afterImage,
  };
}

function parseJsonSafely(value: string): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function createBackendTracker() {
  return {
    successCount: 0,
    fallbackCount: 0,
    lastIssue: '',
  };
}

function recordSuccess(_label: string) {
  backendTracker.successCount += 1;
}

function recordFallback(label: string, error: unknown) {
  backendTracker.fallbackCount += 1;
  backendTracker.lastIssue = `${label} unavailable`;

  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('MissingAuthenticationToken')) {
    backendTracker.lastIssue = `${label} route not deployed`;
  } else if (message.includes('AbortError')) {
    backendTracker.lastIssue = `${label} timed out`;
  } else if (message.includes('Expected ')) {
    backendTracker.lastIssue = `${label} returned unexpected data`;
  }
}

function normalizeDamageClass(value: unknown): DamageAssessment['damageClass'] {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, '');

  switch (normalized) {
    case 'none':
    case 'novisibledamage':
      return 'none';
    case 'minor':
    case 'minordamage':
      return 'minor';
    case 'moderate':
    case 'moderatedamage':
      return 'moderate';
    case 'major':
    case 'severe':
    case 'majordamage':
    case 'severedamage':
      return 'severe';
    case 'destroyed':
    case 'high':
    case 'highdamage':
      return 'destroyed';
    default:
      return damageAssessments[0].damageClass;
  }
}

function formatDamageLabel(damageClass: DamageAssessment['damageClass']) {
  switch (damageClass) {
    case 'none':
      return 'No Visible Damage';
    case 'minor':
      return 'Minor Damage';
    case 'moderate':
      return 'Moderate Damage';
    case 'severe':
      return 'Severe Damage';
    case 'destroyed':
      return 'Destroyed';
  }
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return undefined;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const entries = value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  return entries.length > 0 ? entries : undefined;
}
