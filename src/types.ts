export type DamageLevel = 'none' | 'minor' | 'moderate' | 'severe' | 'destroyed';

export interface Building {
  id: string;
  label: string;
  address: string;
  neighborhood: string;
  householdId: string;
  occupantName: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface DamageAssessment {
  buildingId: string;
  damageClass: DamageLevel;
  damageLabel: string;
  confidence: number;
  assessedAt: string;
  evidenceTags: string[];
  summary: string;
  estimatedDamage: string;
  beforeImage: string;
  afterImage: string;
}

export interface AidProgram {
  name: string;
  fit: string;
  policyCitation: string;
}

export interface ApplicationDraft {
  buildingId: string;
  applicant: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  estimatedDamage: string;
  summary: string;
  aidPrograms: AidProgram[];
  documents: string[];
  missingInfo: string[];
  citations: string[];
}

export interface AgentStep {
  title: string;
  timestamp: string;
  description: string;
  status: 'complete' | 'active' | 'pending';
}

export interface AgentWorkflow {
  buildingId: string;
  steps: AgentStep[];
}
