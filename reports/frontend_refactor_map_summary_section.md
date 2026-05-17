# Frontend Refactor: Map Summary Section

## Files Changed

- `src/components/map/MapPanel.tsx`
- `reports/frontend_refactor_map_summary_section.md`

## Refactor Summary

- Removed the `Selected Building` and `Visible Markers` cards from the absolutely positioned map viewport layer.
- Rendered both cards as a dedicated summary section directly below the map while preserving the same selected-marker and filtered-marker data linkage.
- Kept the viewport focused on the visual map, controls, markers, and compact edge-aware tooltip so lower markers remain fully clickable.
- Preserved the dark foreground-panel styling for the summary cards so they still feel clearly associated with the map.

## Verification

- `npm run build` completed successfully on May 16, 2026.
