# SkyTriage Frontend MVP

## Implementation Summary

Built a new `React + Vite + TypeScript + Tailwind` frontend MVP for SkyTriage as a polished dark-mode disaster response dashboard. The UI is organized around a left operations sidebar, a center damage map with clickable markers, a right-side Bedrock agent trace, a damage assessment panel, and a FEMA application draft panel with tabbed content.

## Files Created

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `postcss.config.js`
- `tailwind.config.js`
- `index.html`
- `src/main.tsx`
- `src/index.css`
- `src/App.tsx`
- `src/types.ts`
- `src/data/mockData.ts`
- `src/lib/api.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/ui/Panel.tsx`
- `src/components/map/MapLegend.tsx`
- `src/components/map/MapPanel.tsx`
- `src/components/damage/DamageAssessmentPanel.tsx`
- `src/components/agent/AgentTracePanel.tsx`
- `src/components/application/ApplicationPanel.tsx`
- `reports/frontend_mvp_summary.md`

## Files Modified

- None. The workspace was empty before implementation.

## Component Structure

- `src/components/layout`
  - `Sidebar.tsx`: left navigation and incident summary
  - `TopBar.tsx`: high-level dashboard context and KPI chips
- `src/components/map`
  - `MapPanel.tsx`: search, damage filter, controls, and clickable markers
  - `MapLegend.tsx`: severity legend
- `src/components/damage`
  - `DamageAssessmentPanel.tsx`: before/after imagery and ML classification
- `src/components/agent`
  - `AgentTracePanel.tsx`: Bedrock workflow timeline
- `src/components/application`
  - `ApplicationPanel.tsx`: FEMA draft details, tabs, and citation chips
- `src/components/ui`
  - `Panel.tsx`: shared card shell for consistent layout

## Mock Data Flow

The dashboard loads assessments through `getDamageAssessments()` in `src/lib/api.ts`. The selected building ID is held in `src/App.tsx`, and marker clicks update that selection. When the selection changes, the app refreshes:

- damage details from the already-loaded assessment list
- application content from `getApplicationDraft(buildingId)`
- workflow trace from `runAgentWorkflow(buildingId)`
- aid-program matching through `matchAidPrograms(...)`

All mock records live in `src/data/mockData.ts`, while components only consume normalized return values from the API layer.

## Future AWS Integration Points

AWS integration is intentionally isolated in `src/lib/api.ts`. Each exported async function includes a comment showing where to replace mock returns with real API calls:

- `getDamageAssessments()`
- `assessDamage(imageUrl)`
- `matchAidPrograms(payload)`
- `getApplicationDraft(buildingId)`
- `runAgentWorkflow(buildingId)`

This keeps Bedrock, Lambda, or API Gateway changes out of presentational components and minimizes UI rewrites later.

## Local Run Instructions

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Build the production bundle with `npm run build`

The frontend does not require backend services to run because all data is mocked locally.

## Verification

- `npm run build` completed successfully on May 15, 2026.
