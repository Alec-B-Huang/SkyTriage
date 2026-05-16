# Frontend Bugfix: Marker Overlay and Classification Layout

## Files Changed

- `src/components/map/MapPanel.tsx`
- `src/components/damage/DamageAssessmentPanel.tsx`
- `reports/frontend_bugfix_marker_and_classification_layout.md`

## Fix Summary

- Updated the floating selected-marker overlay in `MapPanel.tsx` to use `pointer-events-none`, so it no longer blocks clicks on nearby markers while preserving the selected-building context on the map.
- Reworked the AI Damage Classification metadata area in `DamageAssessmentPanel.tsx` into a roomier stacked layout with a separate confidence/readout row and a clearer 2-column metadata grid, so longer values stay inside each box and remain readable on laptop screens.

## Verification

- `npm run build` completed successfully on May 15, 2026.
