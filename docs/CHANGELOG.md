# Changelog

All notable changes to the SpectroGuard frontend are logged here.

## [Unreleased] — Consolidation pass

This entry documents the P0/P1 consolidation of the nine previously
disconnected artifacts in this repo into one working application. Filed
honestly as a single consolidation commit rather than a fabricated
phase-by-phase history — see "Process note" below.

### Added
- Single consolidated app at repo root (`src/`), superseding the standalone
  `spectroguard-alert-feed`, `spectroguard-login-frontend`,
  `spectroguard-page-8-detailed`, `spectroguard-soc-final`,
  `camera-detail-view-complete`, `no-alert-state`, and `worker-health-panel`
  folders (kept as read-only design references under `reference/`, see below).
- `src/components/ConfidenceBadge.tsx`, `DecisionPathTag.tsx`,
  `SpectralHeatmapOverlay.tsx` — shared components used across Alert Feed,
  Forensic Package Viewer, and Camera Detail instead of each view
  reimplementing its own severity/confidence UI.
- `src/api/webhookClient.ts` — single data-integration point (FE-1). Falls
  back to mock fixtures until `VITE_WEBHOOK_BASE_URL` is set.
- `src/state/useLiveData.ts` — hooks (`useCameras`, `useAlerts`, `useWorkers`,
  `useForensicPackage`) so every view reads through `webhookClient`, not
  `mockData.ts`, directly.
- `docs/CONTRACTS.md` documenting the exact schema the dashboard expects
  from core-infra/cv-engine.
- Vitest + Testing Library test suite (`tests/`) covering the new shared
  components and the webhook client's mock-fallback behavior.
- `pathType` (`standard` | `fast`) added to the `Alert` and `ForensicPackage`
  mock fixtures so `DecisionPathTag` has real data to render.
- `heatmapCells` and `ntpOffsetMs` added to the `ForensicPackage` fixture so
  `SpectralHeatmapOverlay` and the signed-metadata panel have real data.

### Changed
- `src/pages/` renamed to `src/views/` to match Bible §3.4.
- `AlertFeed`, `LiveStreamGrid`, `CameraDetail`, `HealthPanel`,
  `ForensicPackageViewer` now fetch through the hooks above instead of a
  local `useState` seeded from a static import.

### Known gaps (see docs/CONTRACTS.md "Open items")
- Login screen does not call a real auth endpoint yet.
- No pagination on list endpoints.
- No optimistic-update rollback on failed alert acknowledgement.
- Test coverage does not yet reach the 60% dashboard floor (Spec §2.4) —
  the suite added here covers the new/changed surfaces, not the pre-existing
  view components line-for-line.
- The 3D robot exploration (`reference/interactive-3d-robot/`) is not wired
  into any route; it's kept as a design reference only.

### Process note
This changelog entry was written retroactively while consolidating existing
work rather than logged phase-by-phase (FE-0 → FE-1 → FE-2 → FE-3) as the
work happened. Per the review's P3 guidance: this should be disclosed
honestly in the PR/submission rather than implying iterative, checkpointed
delivery.
