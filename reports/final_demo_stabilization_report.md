# Final Demo Stabilization Report

## Understanding snapshot

- Live API Gateway routes in use:
  - `POST /assess` through `assessDamage(...)`
  - `POST /match` through `matchAidPrograms(...)`
- Mock-backed functions still in place:
  - `getDamageAssessments()`
  - `getApplicationDraft()`
  - `runAgentWorkflow()`
- `/match` is triggered when the selected building changes.
- `/assess` is connected to the visible `Run ML assessment` upload control in the Damage Assessment panel.
- The Bedrock workflow trace is rendered in `src/components/agent/AgentTracePanel.tsx`.

## Files changed

- `src/App.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/damage/DamageAssessmentPanel.tsx`
- `src/components/application/ApplicationPanel.tsx`
- `src/components/agent/AgentTracePanel.tsx`

## What changed

- Kept the existing global backend indicator, but updated the wording so the top bar now reads more clearly for demo use:
  - `Live backend connected`
  - `Fallback inference active`
  - `Mock aid matching fallback`
- Added small panel-level status messaging for:
  - ML assessment activity and fallback state in the Damage Assessment panel
  - aid matching state in the Disaster Assistance panel
- Improved `/assess` failure handling so a fallback response does not overwrite the currently selected parcel with another mock parcel's classification data.
- Preserved the uploaded after-image preview when `/assess` falls back, so the panel still feels responsive and stable.
- Kept `/match` fallback behavior intact and surfaced it unobtrusively in the application panel.
- Tightened wording around:
  - Bedrock orchestration
  - agent workflow trace
  - disaster assistance drafting

## Verification

- `npm run build` passed.

## Remaining demo risks

- `getDamageAssessments()`, `getApplicationDraft()`, and `runAgentWorkflow()` are still mock-backed, so the demo is only partially live.
- The workflow trace is presentation-only today and does not stream real Bedrock trace events.
- `/assess` response normalization is defensive, but if the backend starts returning a very different schema, the frontend may still fall back.
- The top-level backend status is shared across operations, so rapid consecutive actions can update the message based on the most recent call rather than showing separate live statuses for every panel.
