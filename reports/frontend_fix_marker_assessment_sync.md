# Frontend Fix Marker Assessment Sync

## Files changed

- `src/App.tsx`
- `src/components/map/MapPanel.tsx`

## What changed

- Kept `selectedBuildingId` in `App.tsx` as the single source of truth.
- Added an `effectiveAssessments` view in `App.tsx` that merges any assessment overrides back into the base assessment list.
- Derived the current `selectedAssessment` from that same `effectiveAssessments` list and the active `selectedBuildingId`.
- Passed the same `selectedAssessment` object into both:
  - `MapPanel`
  - `DamageAssessmentPanel`
- Updated `MapPanel` so it no longer derives its own separate selected assessment from a possibly stale local list.

## Result

- Clicking a marker still updates `selectedBuildingId` through `onSelectBuilding`.
- The selected marker strip, map assessment details, and the Damage Assessment panel now read from the same selected assessment source.
- Application and aid output remain tied to the same selected building through the existing `selectedBuildingId`-driven refresh flow.

## Verification

- `npm run build` passed.
- I verified the synchronization path in code after the change.
- I was not able to perform a true interactive click-through test in a browser from the currently available tools in this turn.
