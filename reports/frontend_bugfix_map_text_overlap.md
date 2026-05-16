# Frontend Bugfix: Map Text Overlap

## Files Changed

- `src/components/map/MapPanel.tsx`
- `reports/frontend_bugfix_map_text_overlap.md`

## Fix Summary

- Reduced the floating selected-marker tooltip to compact map-relevant details only: building ID, address, damage class, confidence, and assessed time.
- Moved the longer explanatory selection text into the bottom `Selected Building` summary card so it no longer overlaps markers or competes inside the map viewport.
- Tightened the bottom summary layout into a cleaner internal grid while preserving marker clickability and the existing app architecture.

## Verification

- `npm run build` completed successfully on May 15, 2026.
