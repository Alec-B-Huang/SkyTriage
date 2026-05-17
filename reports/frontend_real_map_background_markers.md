# Frontend Real Map Background Markers

## Files changed

- `src/components/map/MapPanel.tsx`
- `src/data/mockData.ts`

## What changed

- Replaced the synthetic/generated `Damage Map` viewport surface with the real hurricane aftermath image at `/public/mock-imagery/house-after-damage.jpg`.
- Kept a dark layered overlay on top of the image so the region label, map controls, and severity markers remain readable.
- Removed the abstract road, parcel, and footprint scaffolding from the viewport so the map now reads as real imagery instead of a fabricated background.
- Repositioned the existing building marker coordinates so the six markers sit over plausible structures and damage areas in the hurricane image.
- Preserved all existing map interactions:
  - marker click behavior
  - search
  - severity filtering
  - selected marker strip
  - bottom detail panels

## Verification

- `npm run build` passed.
