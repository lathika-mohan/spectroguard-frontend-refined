# SpectroGuard Frontend (Member 3)

Autonomous surveillance/SOC review console — Live Stream Grid, Alert Feed,
Forensic Package Viewer, Camera Detail, System/Worker Health, Thresholds,
Login, and Empty State — as one consolidated React + TypeScript app.

## Status

This is a consolidation of the previously scattered per-page artifacts in
this repo (see `docs/CHANGELOG.md` for exactly what moved where). It is
**demo-ready, not production-ready** — see "Known gaps" in
`docs/CONTRACTS.md` and `docs/CHANGELOG.md` before treating it as a finished
Gate 3/4/5 deliverable.

## Stack

- React 19 + TypeScript, Vite 8
- React Router (client-side routing between all views)
- Tailwind CSS v4
- Framer Motion (alert feed transitions)
- Vitest + React Testing Library (`tests/`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run test       # run the test suite once
npm run test:watch # watch mode
npm run build       # type-check + production build
```

By default the app runs entirely on mock data (`src/lib/mockData.ts`) routed
through `src/api/webhookClient.ts`. To point it at a real backend, copy
`.env.example` to `.env` and set `VITE_WEBHOOK_BASE_URL` — no other code
changes are required. See `docs/CONTRACTS.md` for the exact schema the
backend must serve.

## Structure

```
src/
  views/          One file per screen (LiveStreamGrid, AlertFeed,
                   ForensicPackageViewer, CameraDetail, HealthPanel,
                   Settings, LoginPage, EmptyState)
  components/      Shared UI: ConfidenceBadge, DecisionPathTag,
                   SpectralHeatmapOverlay, CameraTile, layout/, ui/
  api/             webhookClient.ts — the one place that talks to core-infra
  state/           useLiveData.ts — hooks each view uses to read/write data
  lib/             mockData.ts (dev fixtures), utils.ts
docs/
  CONTRACTS.md     Data contract with core-infra/cv-engine
  CHANGELOG.md      What changed in the consolidation pass
tests/             Vitest + Testing Library specs
reference/         Design/exploration material kept for context, not wired
                   into the app (interactive 3D robot experiment, the
                   original dashboard HTML preview)
```

## Navigation map

- `/` → Login → `/dashboard`
- `/dashboard` (Live Stream Grid) → click a camera tile → `/camera/:id`
- `/alerts` (Alert Feed) → click "Forensic package" → `/forensics/:alertId`
- `/alerts/empty` — empty-state reference view
- `/health` — worker/system health
- `/settings` — read-only detection thresholds

## Known gaps

See `docs/CONTRACTS.md` → "Open items" and `docs/CHANGELOG.md` → "Known
gaps" — most notably: no real auth flow on the login screen yet, no
pagination, and test coverage covers the new/changed surfaces rather than
the full 60% floor required by Spec §2.4.
