# Frontend Fix: API Fallback and Loading Recovery

## Files Changed

- `src/lib/api.ts`
- `src/App.tsx`
- `src/components/layout/TopBar.tsx`
- `reports/frontend_api_fallback_loading_fix.md`

## Fix Summary

- Kept the API Gateway integration in the frontend API layer, but added fallback-first behavior so failed fetches, route misses, timeouts, and unexpected response shapes now return existing mock data instead of blocking the app.
- Added backend status tracking in the API layer and surfaced a small live/fallback indicator in the top bar so the dashboard stays visible while still communicating backend health.
- Removed the dashboard’s dependency on `applicationDraft` and `workflow` becoming non-null before first render by seeding them from existing mock data and refreshing them in the background.
- Preserved live API attempts for assessment and aid-program matching while ensuring the UI remains usable when backend routes are unavailable.

## Verification

- `npm run build` completed successfully on May 16, 2026.
