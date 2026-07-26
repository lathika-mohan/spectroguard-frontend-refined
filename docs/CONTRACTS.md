# CONTRACTS.md — Frontend ↔ core-infra data contract

This is the contract the frontend consumes from `core-infra` / `cv-engine`.
The single integration point is `src/api/webhookClient.ts` — no view ever
talks to a data source directly. Until `VITE_WEBHOOK_BASE_URL` is set,
`webhookClient` returns the mock fixtures in `src/lib/mockData.ts` so the
UI behaves identically in dev and prod (same async/loading boundaries).

## Base URL

Set via `VITE_WEBHOOK_BASE_URL` (see `.env.example`). All paths below are
relative to it.

## `GET /cameras` → `Camera[]`

```ts
interface Camera {
  id: string            // stable camera identifier, e.g. "cam-01"
  name: string           // human-readable label
  zone: string           // "Perimeter" | "Interior" | site-defined zone name
  status: "live" | "alarm" | "offline"
  lastEvent?: string     // short human-readable description of most recent event
}
```

## `GET /alerts` → `Alert[]`

```ts
interface Alert {
  id: string             // event id, e.g. "evt-88213"
  cameraId: string        // FK -> Camera.id
  cameraName: string
  label: string           // short classification label, e.g. "Person after hours"
  severity: "critical" | "warning" | "info"
  confidence: number      // 0-1, Platt-scaled — DISPLAY ONLY (Spec §13).
                          // Never use this value to imply alarm/no-alarm;
                          // that decision is made upstream by the pipeline
                          // and is only ever *reported* here, via pathType
                          // and severity.
  timestamp: string       // HH:MM:SS local, or full ISO 8601 — pick one and
                          // be consistent; current fixtures use HH:MM:SS
  acknowledged: boolean
  pathType: "standard" | "fast"  // which pipeline route produced this alert
                                  // (Spec §14/§17) — must always be present
                                  // and rendered via DecisionPathTag, never
                                  // inferred client-side.
}
```

## `POST /alerts/:alertId/ack` → `{ ok: true }`

Marks an alert acknowledged server-side. The frontend applies an optimistic
update immediately (see `src/state/useLiveData.ts`); on failure the UI does
not currently roll back — that's a known gap, see "Open items" below.

## `GET /workers` → `WorkerNode[]`

```ts
interface WorkerNode {
  id: string
  name: string            // e.g. "detector-gpu-01"
  role: string            // e.g. "Detection inference"
  status: "healthy" | "degraded" | "restarting"
  uptime: string           // human-readable, e.g. "14d 6h"
  restarts24h: number
  queueDepth: number
}
```

Per Spec R53, a `restarting` worker must remain **visible but non-alarming**
in the UI — `HealthPanel` shows it as a distinct badge state, not as a red
site-wide alarm.

## `GET /forensics/:alertId` → `ForensicPackage | 404`

```ts
interface ForensicPackage {
  id: string               // package id, e.g. "fp-88213"
  alertId: string           // FK -> Alert.id
  cameraName: string
  pathType: "standard" | "fast"
  decisionPath: string[]    // ordered, human-readable steps the pipeline
                            // took to reach this alert — rendered as-is,
                            // in order, by ForensicPackageViewer
  shapFactors: { factor: string; weight: number }[]
                            // signed feature attributions; weight can be
                            // negative (evidence against the alarm)
  heatmapCells: { x: number; y: number; weight: number }[]
                            // SHAP attribution rendered on the model's
                            // 512×512 WORKING GRID — (x, y) are cell
                            // indices on that grid, NOT native camera
                            // pixel coordinates. Do not scale these by
                            // the camera's native resolution.
  signedHash: string        // sha256:... chain-of-custody hash
  signedAt: string           // ISO 8601 UTC timestamp of signing
  operator: string           // human or "auto-signed · <worker-id>"
  ntpOffsetMs: number        // clock offset from NTP at signing time —
                             // required chain-of-custody metadata (Spec §17)
}
```

If no package exists for the given `alertId`, the endpoint returns 404 and
`webhookClient.getForensicPackage` resolves `undefined`; `ForensicPackageViewer`
renders a "package not found" state rather than crashing.

## Open items / not yet covered by this contract

- No pagination on `/alerts` or `/cameras` — fine for demo scale, will need
  addressing before this is load-bearing against a real large-scale deployment.
- No auth token flow is wired into `webhookClient` yet — `LoginPage` is
  currently a client-side-only redirect and does not call a real
  `/auth` endpoint. This must be added before the login screen is anything
  more than a mockup.
- No rollback path if `POST /alerts/:id/ack` fails after the optimistic
  update has already been applied.
- The diurnal-bin check mentioned in R55, if surfaced in any future view,
  must be labeled scaffolded/simulated rather than live-validated until it
  actually is.
