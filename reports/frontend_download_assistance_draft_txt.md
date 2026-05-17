# Frontend Download Assistance Draft TXT

## Files changed

- `src/components/application/ApplicationPanel.tsx`

## What changed

- Wired the existing draft download button to generate a readable local `.txt` export from the currently selected disaster assistance draft.
- Renamed the button label from `Download PDF` to `Download Draft` so the action matches the actual output.
- Added a browser-side download flow using:
  - `Blob`
  - `URL.createObjectURL`
  - a temporary anchor element
- Used the requested filename format:
  - `skytriage-disaster-assistance-${draft.buildingId}.txt`
- Structured the export with section dividers for:
  - Applicant
  - Address
  - Estimated Damage
  - Household
  - Application Summary
  - Draft Context
  - Aid Programs
  - Documents
  - Missing Info
  - Policy Citations

## Verification

- `npm run build` passed.
- Confirmed the local app served successfully at `http://127.0.0.1:4173/`.
- I was not able to perform a true clickable browser download verification in this turn because the available toolset did not include an interactive browser automation endpoint.
