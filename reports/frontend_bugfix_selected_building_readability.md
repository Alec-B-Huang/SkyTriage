# Frontend Bugfix: Selected Building Readability

## Files Changed

- `src/components/map/MapPanel.tsx`
- `reports/frontend_bugfix_selected_building_readability.md`

## Fix Summary

- Raised the bottom summary strip above the marker layer so damage markers no longer visually overlap the `Selected Building` card content.
- Strengthened the `Selected Building` card with a more opaque background, clearer border, subtle shadow, and light backdrop blur so it reads as a foreground UI panel instead of blending into the map imagery.
- Applied the same foreground-panel treatment to the `Visible Markers` card so the bottom summary area feels cohesive and clearly separated from the map surface.

## Verification

- `npm run build` completed successfully on May 16, 2026.
