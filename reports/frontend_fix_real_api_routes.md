# Frontend Fix: Real API Routes

## Files Changed

- `src/lib/api.ts`
- `reports/frontend_fix_real_api_routes.md`

## Fix Summary

- Removed probing of guessed and undeployed API Gateway route names such as `/assessments`, `/damage-assessments`, `/getDamageAssessments`, `/match-aid-programs`, `/application-drafts`, and `/runAgentWorkflow`.
- Updated the live frontend API integration to use only the two valid deployed routes:
  - `POST /assess`
  - `POST /match`
- Kept the existing mock fallback behavior so the frontend remains usable if either deployed route fails or returns unexpected data.
- Left application draft, workflow, and damage assessment list loading on mock-backed data so the frontend no longer generates 403 responses for undeployed endpoints.

## Verification

- `npm run build` completed successfully on May 16, 2026.
