# Frontend Assess Endpoint Trigger

## Files changed

- `src/lib/api.ts`
- `src/App.tsx`
- `src/components/damage/DamageAssessmentPanel.tsx`

## What changed

- Kept the existing real API Gateway integration and wired the frontend to the deployed `POST /assess` route through the existing `assessDamage(...)` API helper.
- Updated the assessment request payload to send `imageBase64` and added light response normalization so common backend field shapes can still hydrate the frontend assessment model.
- Added a compact `Run ML assessment` image-upload control in the Damage Assessment panel.
- Converted uploaded image files to base64 data URLs in `App.tsx` before calling `assessDamage(...)`.
- Merged returned assessment fields back into the currently displayed building assessment so the damage class, confidence, assessment time, summary, and after-image preview update in place.
- Preserved mock fallback behavior if `/assess` fails or returns unexpected data.

## Verification

- `npm run build` passed.
