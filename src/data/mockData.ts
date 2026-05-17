import type { AgentWorkflow, ApplicationDraft, Building, DamageAssessment, DamageLevel } from '../types';

const damagePalette: Record<DamageLevel, string> = {
  none: '#7f8998',
  minor: '#4bc67a',
  moderate: '#f2c94c',
  severe: '#f2994a',
  destroyed: '#eb5757',
};

const levelLabels: Record<DamageLevel, string> = {
  none: 'No Visible Damage',
  minor: 'Minor Damage',
  moderate: 'Moderate Damage',
  severe: 'Severe Damage',
  destroyed: 'Destroyed',
};

// Future imagery source notes:
// - Real hurricane or flood captures can be dropped into /public/mock-imagery.
// - Good later candidates include xBD, CRASAR/UAS, or curated agency aerial imagery.
// - Keeping stable public paths here lets the UI swap in real files without changing components or API contracts.
const mockImageryPaths = {
  houseBefore: '/mock-imagery/house-before.jpg',
  houseAfterDamage: '/mock-imagery/house-after-damage.jpg',
  satelliteDamageArea: '/mock-imagery/satellite-damage-area.jpg',
};

export const buildings: Building[] = [
  {
    id: 'SKY-204',
    label: 'Parcel SKY-204',
    address: '1442 Harbor View Drive',
    neighborhood: 'Bay Crest',
    householdId: 'HH-88413',
    occupantName: 'Lena Ortiz',
    coordinates: { x: 28, y: 56 },
  },
  {
    id: 'SKY-318',
    label: 'Parcel SKY-318',
    address: '903 Mission Ridge Lane',
    neighborhood: 'Mission Ridge',
    householdId: 'HH-77201',
    occupantName: 'Marcus Hall',
    coordinates: { x: 43, y: 35 },
  },
  {
    id: 'SKY-411',
    label: 'Parcel SKY-411',
    address: '208 Cedar Point Avenue',
    neighborhood: 'Cedar Point',
    householdId: 'HH-33871',
    occupantName: 'Aisha Thompson',
    coordinates: { x: 57, y: 57 },
  },
  {
    id: 'SKY-587',
    label: 'Parcel SKY-587',
    address: '54 Eastline Court',
    neighborhood: 'Eastline',
    householdId: 'HH-12019',
    occupantName: 'Noah Kim',
    coordinates: { x: 73, y: 39 },
  },
  {
    id: 'SKY-642',
    label: 'Parcel SKY-642',
    address: '78 Seabreak Terrace',
    neighborhood: 'Seabreak',
    householdId: 'HH-68442',
    occupantName: 'Priya Desai',
    coordinates: { x: 53, y: 25 },
  },
  {
    id: 'SKY-718',
    label: 'Parcel SKY-718',
    address: '311 North Harbor Street',
    neighborhood: 'North Harbor',
    householdId: 'HH-22174',
    occupantName: 'Jonah Reed',
    coordinates: { x: 21, y: 78 },
  },
];

export const damageAssessments: DamageAssessment[] = [
  {
    buildingId: 'SKY-204',
    damageClass: 'moderate',
    damageLabel: levelLabels.moderate,
    confidence: 0.83,
    assessedAt: '2026-05-15T09:14:00-07:00',
    evidenceTags: ['roof displacement', 'debris field', 'water intrusion risk'],
    summary: 'Roofline shift and exterior debris are visible. Occupancy may be possible after safety inspection.',
    estimatedDamage: '$48,000 structural estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseAfterDamage,
  },
  {
    buildingId: 'SKY-318',
    damageClass: 'minor',
    damageLabel: levelLabels.minor,
    confidence: 0.76,
    assessedAt: '2026-05-15T09:22:00-07:00',
    evidenceTags: ['shingle loss', 'tree contact'],
    summary: 'Localized roof disturbance only. Household likely eligible for quick-turn repair support.',
    estimatedDamage: '$11,500 repair estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseAfterDamage,
  },
  {
    buildingId: 'SKY-411',
    damageClass: 'severe',
    damageLabel: levelLabels.severe,
    confidence: 0.89,
    assessedAt: '2026-05-15T09:31:00-07:00',
    evidenceTags: ['wall collapse', 'major roof failure', 'displacement likely'],
    summary: 'Major roof collapse and wall deformation indicate the home is not currently habitable.',
    estimatedDamage: '$129,000 structural estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseAfterDamage,
  },
  {
    buildingId: 'SKY-587',
    damageClass: 'none',
    damageLabel: levelLabels.none,
    confidence: 0.67,
    assessedAt: '2026-05-15T09:40:00-07:00',
    evidenceTags: ['clear roof', 'no debris plume'],
    summary: 'No visible exterior damage in the latest imagery. Keep household in monitoring queue only.',
    estimatedDamage: '$0 visible exterior estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseBefore,
  },
  {
    buildingId: 'SKY-642',
    damageClass: 'destroyed',
    damageLabel: levelLabels.destroyed,
    confidence: 0.94,
    assessedAt: '2026-05-15T09:47:00-07:00',
    evidenceTags: ['foundation exposure', 'complete roof loss', 'heavy debris'],
    summary: 'Structure appears destroyed. Immediate displacement and high-priority assistance are recommended.',
    estimatedDamage: '$286,000 total loss estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseAfterDamage,
  },
  {
    buildingId: 'SKY-718',
    damageClass: 'severe',
    damageLabel: levelLabels.severe,
    confidence: 0.88,
    assessedAt: '2026-05-15T09:52:00-07:00',
    evidenceTags: ['flood washout', 'access blocked', 'utility hazard'],
    summary: 'Flooding and access obstruction suggest prolonged displacement even if partial structure remains.',
    estimatedDamage: '$98,000 combined estimate',
    beforeImage: mockImageryPaths.houseBefore,
    afterImage: mockImageryPaths.houseAfterDamage,
  },
];

export const applicationDrafts: ApplicationDraft[] = [
  {
    buildingId: 'SKY-204',
    applicant: { name: 'Lena Ortiz', phone: '(415) 555-0182', email: 'lena.ortiz@example.org' },
    address: { street: '1442 Harbor View Drive', city: 'San Aurelio', state: 'CA', zip: '94010' },
    estimatedDamage: '$48,000 structural estimate',
    summary:
      'Resident reports roof displacement, wind-driven rain entry, and temporary shelter needs for two nights while the property undergoes inspection.',
    aidPrograms: [
      { name: 'Housing Assistance', fit: 'Temporary shelter and habitability support', policyCitation: 'IHP §408 Housing' },
      { name: 'Other Needs Assistance', fit: 'Debris cleanup and safety items', policyCitation: 'ONA §1204 Personal Property' },
    ],
    documents: ['Driver license photo', 'Utility bill', 'Insurance declaration page'],
    missingInfo: ['Insurance claim number', 'Photos of interior water damage'],
    citations: ['FEMA IHP 408', 'FEMA ONA 1204'],
  },
  {
    buildingId: 'SKY-318',
    applicant: { name: 'Marcus Hall', phone: '(415) 555-0195', email: 'marcus.hall@example.org' },
    address: { street: '903 Mission Ridge Lane', city: 'San Aurelio', state: 'CA', zip: '94010' },
    estimatedDamage: '$11,500 repair estimate',
    summary:
      'Minor roof repairs are likely sufficient. Household remains in residence and seeks documentation for emergency repair reimbursement.',
    aidPrograms: [
      { name: 'Home Repair Assistance', fit: 'Limited shingle and gutter repairs', policyCitation: 'IHP §408 Repair' },
    ],
    documents: ['Insurance card', 'Owner occupancy affidavit'],
    missingInfo: ['Repair contractor quote'],
    citations: ['FEMA IHP 408 Repair'],
  },
  {
    buildingId: 'SKY-411',
    applicant: { name: 'Aisha Thompson', phone: '(415) 555-0104', email: 'aisha.t@example.org' },
    address: { street: '208 Cedar Point Avenue', city: 'San Aurelio', state: 'CA', zip: '94011' },
    estimatedDamage: '$129,000 structural estimate',
    summary:
      'Computer vision detected wall collapse and probable roof failure. Household likely requires displacement support, inspection priority, and document follow-up.',
    aidPrograms: [
      { name: 'Temporary Housing Assistance', fit: 'Household displacement expected', policyCitation: 'IHP §408 Temporary Housing' },
      { name: 'Serious Needs Assistance', fit: 'Immediate essentials after severe damage', policyCitation: 'SNA §2024 Immediate Needs' },
      { name: 'Home Repair Assistance', fit: 'Major structural stabilization', policyCitation: 'IHP §408 Repair' },
    ],
    documents: ['State ID', 'Proof of ownership', 'Insurance declaration page'],
    missingInfo: ['Current insurance deductible', 'Household size confirmation'],
    citations: ['FEMA IHP 408 Temporary Housing', 'FEMA SNA 2024', 'FEMA IHP 408 Repair'],
  },
  {
    buildingId: 'SKY-587',
    applicant: { name: 'Noah Kim', phone: '(415) 555-0173', email: 'noah.kim@example.org' },
    address: { street: '54 Eastline Court', city: 'San Aurelio', state: 'CA', zip: '94012' },
    estimatedDamage: '$0 visible exterior estimate',
    summary:
      'No visible exterior damage from imagery. Household remains on standby until on-the-ground reports or resident-submitted documents indicate otherwise.',
    aidPrograms: [
      { name: 'Monitoring Queue', fit: 'No direct benefits matched yet', policyCitation: 'Ops Playbook §Triage Monitoring' },
    ],
    documents: ['Optional resident-submitted photos'],
    missingInfo: ['Damage self-report', 'Inspection request if conditions worsen'],
    citations: ['Ops Playbook Triage Monitoring'],
  },
  {
    buildingId: 'SKY-642',
    applicant: { name: 'Priya Desai', phone: '(415) 555-0122', email: 'priya.desai@example.org' },
    address: { street: '78 Seabreak Terrace', city: 'San Aurelio', state: 'CA', zip: '94013' },
    estimatedDamage: '$286,000 total loss estimate',
    summary:
      'Structure appears destroyed. The draft prioritizes displacement assistance, serious needs support, and expedited case review for full household relocation.',
    aidPrograms: [
      { name: 'Temporary Housing Assistance', fit: 'Immediate displacement required', policyCitation: 'IHP §408 Temporary Housing' },
      { name: 'Serious Needs Assistance', fit: 'Emergency cash for critical needs', policyCitation: 'SNA §2024 Immediate Needs' },
      { name: 'Personal Property Assistance', fit: 'Likely total loss of belongings', policyCitation: 'ONA §1204 Personal Property' },
    ],
    documents: ['Identity verification', 'Proof of occupancy', 'Bank routing form'],
    missingInfo: ['Preferred temporary lodging location', 'Insurance settlement status'],
    citations: ['FEMA IHP 408 Temporary Housing', 'FEMA SNA 2024', 'FEMA ONA 1204'],
  },
  {
    buildingId: 'SKY-718',
    applicant: { name: 'Jonah Reed', phone: '(415) 555-0168', email: 'jonah.reed@example.org' },
    address: { street: '311 North Harbor Street', city: 'San Aurelio', state: 'CA', zip: '94014' },
    estimatedDamage: '$98,000 combined estimate',
    summary:
      'Flood-related access issues and utility hazards indicate the household will need displacement support and coordinated inspection follow-up.',
    aidPrograms: [
      { name: 'Temporary Housing Assistance', fit: 'Unsafe access and probable displacement', policyCitation: 'IHP §408 Temporary Housing' },
      { name: 'Clean and Sanitize Assistance', fit: 'Flood contamination risk', policyCitation: 'ONA §1204 Sanitation' },
    ],
    documents: ['Photo ID', 'Flood insurance statement', 'Resident contact sheet'],
    missingInfo: ['Utility shutoff confirmation'],
    citations: ['FEMA IHP 408 Temporary Housing', 'FEMA ONA 1204 Sanitation'],
  },
];

const workflowTemplate = [
  { title: 'Image Received', baseTime: '09:13', description: 'Post-event capture ingested into the triage queue.' },
  { title: 'Damage Classified', baseTime: '09:14', description: 'Vision model produced severity and confidence signals.' },
  { title: 'Household Lookup', baseTime: '09:15', description: 'Parcel metadata and household occupancy were matched.' },
  { title: 'FEMA Policy Search', baseTime: '09:16', description: 'Relevant policy passages were retrieved for citation.' },
  { title: 'Aid Programs Matched', baseTime: '09:17', description: 'Eligibility candidates were ranked for the caseworker.' },
  { title: 'Application Drafted', baseTime: '09:18', description: 'A prefilled assistance draft was generated for review.' },
];

export const workflows: AgentWorkflow[] = buildings.map((building, index) => ({
  buildingId: building.id,
  steps: workflowTemplate.map((step, stepIndex) => ({
    title: step.title,
    timestamp: `${step.baseTime} PST`,
    description:
      stepIndex === 1
        ? `${step.description} ${levelLabels[damageAssessments[index].damageClass]} detected for ${building.id}.`
        : stepIndex === 2
          ? `${step.description} Household ${building.householdId} linked to ${building.occupantName}.`
          : stepIndex === 5
            ? `${step.description} Draft ready for caseworker confirmation and export.`
            : step.description,
    status:
      stepIndex < 5 ? 'complete' : damageAssessments[index].damageClass === 'destroyed' ? 'active' : 'complete',
  })),
}));
