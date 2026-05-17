# Frontend Bugfix: Edge-Aware Map Tooltip

## Files Changed

- `src/components/map/MapPanel.tsx`
- `reports/frontend_bugfix_edge_aware_map_tooltip.md`

## Fix Summary

- Added edge-aware tooltip placement in `MapPanel.tsx` so the selected-marker tooltip repositions based on marker coordinates instead of always opening on the same side.
- Right-edge markers now place the tooltip to the left, left-side markers place it to the right, lower markers shift the tooltip upward above the summary strip, and center markers stay centered near the marker.
- Kept the tooltip compact and preserved `pointer-events-none` so marker clickability remains intact.
- Cleaned up the bottom summary strip so `Selected Building` and `Visible Markers` remain separate grid items with their own wrapped text content.

## Verification

- Checked placement logic for representative markers in each region:
  - left side: `SKY-204`
  - right side: `SKY-642`
  - lower area near summary strip: `SKY-718`
  - center area: `SKY-411`
- `npm run build` completed successfully on May 16, 2026.
