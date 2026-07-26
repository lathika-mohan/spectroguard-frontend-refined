export type CameraStatus = "live" | "alarm" | "offline"

export interface Camera {
  id: string
  name: string
  zone: string
  status: CameraStatus
  lastEvent?: string
}

export const cameras: Camera[] = [
  { id: "cam-01", name: "Loading Dock A", zone: "Perimeter", status: "alarm", lastEvent: "Intrusion, 00:02 ago" },
  { id: "cam-02", name: "North Fence Line", zone: "Perimeter", status: "live" },
  { id: "cam-03", name: "Server Room", zone: "Interior", status: "live" },
  { id: "cam-04", name: "Main Lobby", zone: "Interior", status: "live" },
  { id: "cam-05", name: "Parking Structure B2", zone: "Perimeter", status: "warn" as CameraStatus },
  { id: "cam-06", name: "Roof Access", zone: "Interior", status: "offline" },
  { id: "cam-07", name: "West Gate", zone: "Perimeter", status: "live" },
  { id: "cam-08", name: "Warehouse Aisle 3", zone: "Interior", status: "live" },
  { id: "cam-09", name: "Emergency Exit C", zone: "Interior", status: "live" },
]

export type AlertSeverity = "critical" | "warning" | "info"

export type DecisionPathType = "standard" | "fast"

export interface Alert {
  id: string
  cameraId: string
  cameraName: string
  label: string
  severity: AlertSeverity
  confidence: number
  timestamp: string
  acknowledged: boolean
  /** Bible Spec §14/§17 — which pipeline route produced this alert */
  pathType: DecisionPathType
}

export const alerts: Alert[] = [
  {
    id: "evt-88213",
    cameraId: "cam-01",
    cameraName: "Loading Dock A",
    label: "Person after hours",
    severity: "critical",
    confidence: 0.97,
    timestamp: "18:04:12",
    acknowledged: false,
    pathType: "fast",
  },
  {
    id: "evt-88209",
    cameraId: "cam-05",
    cameraName: "Parking Structure B2",
    label: "Loitering, 4m+",
    severity: "warning",
    confidence: 0.81,
    timestamp: "17:58:47",
    acknowledged: false,
    pathType: "standard",
  },
  {
    id: "evt-88198",
    cameraId: "cam-02",
    cameraName: "North Fence Line",
    label: "Object left unattended",
    severity: "warning",
    confidence: 0.74,
    timestamp: "17:41:03",
    acknowledged: true,
    pathType: "standard",
  },
  {
    id: "evt-88187",
    cameraId: "cam-08",
    cameraName: "Warehouse Aisle 3",
    label: "Forklift near-miss",
    severity: "info",
    confidence: 0.63,
    timestamp: "17:22:56",
    acknowledged: true,
    pathType: "standard",
  },
  {
    id: "evt-88176",
    cameraId: "cam-06",
    cameraName: "Roof Access",
    label: "Camera signal lost",
    severity: "critical",
    confidence: 1.0,
    timestamp: "16:59:31",
    acknowledged: true,
    pathType: "fast",
  },
]

export interface WorkerNode {
  id: string
  name: string
  role: string
  status: "healthy" | "degraded" | "restarting"
  uptime: string
  restarts24h: number
  queueDepth: number
}

export const workers: WorkerNode[] = [
  { id: "w-01", name: "detector-gpu-01", role: "Detection inference", status: "healthy", uptime: "14d 6h", restarts24h: 0, queueDepth: 3 },
  { id: "w-02", name: "detector-gpu-02", role: "Detection inference", status: "restarting", uptime: "0d 0h 2m", restarts24h: 2, queueDepth: 41 },
  { id: "w-03", name: "tracker-01", role: "Multi-object tracking", status: "healthy", uptime: "14d 6h", restarts24h: 0, queueDepth: 1 },
  { id: "w-04", name: "shap-explainer-01", role: "Explainability (SHAP)", status: "degraded", uptime: "2d 1h", restarts24h: 1, queueDepth: 12 },
  { id: "w-05", name: "evidence-signer-01", role: "Chain-of-custody signing", status: "healthy", uptime: "31d 2h", restarts24h: 0, queueDepth: 0 },
  { id: "w-06", name: "ingest-gateway-01", role: "Stream ingest", status: "healthy", uptime: "31d 2h", restarts24h: 0, queueDepth: 6 },
]

export interface ForensicPackage {
  id: string
  alertId: string
  cameraName: string
  /** Bible Spec §14/§17 — which pipeline route produced this package */
  pathType: DecisionPathType
  decisionPath: string[]
  shapFactors: { factor: string; weight: number }[]
  /** SHAP attribution rendered on the 512x512 working grid, Spec §17 */
  heatmapCells: { x: number; y: number; weight: number }[]
  signedHash: string
  signedAt: string
  operator: string
  /** Clock offset from NTP at signing time, ms — Spec §17 chain-of-custody metadata */
  ntpOffsetMs: number
}

export const forensicPackages: Record<string, ForensicPackage> = {
  "evt-88213": {
    id: "fp-88213",
    alertId: "evt-88213",
    cameraName: "Loading Dock A",
    pathType: "fast",
    decisionPath: [
      "Motion delta exceeded threshold (0.42)",
      "Human silhouette classified, conf 0.97",
      "Zone check: restricted after 18:00",
      "No badge-in event within 90s window",
      "Escalated to ALARM",
    ],
    shapFactors: [
      { factor: "Silhouette confidence", weight: 0.34 },
      { factor: "Time-of-day risk", weight: 0.27 },
      { factor: "Zone sensitivity", weight: 0.21 },
      { factor: "Motion velocity", weight: 0.12 },
      { factor: "Historical false-positive rate", weight: -0.06 },
    ],
    heatmapCells: [
      { x: 7, y: 6, weight: 0.9 }, { x: 8, y: 6, weight: 0.75 }, { x: 7, y: 7, weight: 0.6 },
      { x: 8, y: 7, weight: 0.85 }, { x: 9, y: 7, weight: 0.4 }, { x: 8, y: 8, weight: 0.3 },
    ],
    signedHash: "sha256:9f2a1c7e4b8d0e21a6c4f9012bde3aa7c5f8e12d4a6b7c8d9e0f1a2b3c4d5e6f",
    signedAt: "2026-07-24T18:04:19Z",
    operator: "auto-signed · evidence-signer-01",
    ntpOffsetMs: 12,
  },
  "evt-88209": {
    id: "fp-88209",
    alertId: "evt-88209",
    cameraName: "Parking Structure B2",
    pathType: "standard",
    decisionPath: [
      "Person detected, conf 0.81",
      "Dwell timer started",
      "Dwell exceeded 240s loitering threshold",
      "SHAP explainer queued (standard path)",
      "Escalated to WARNING",
    ],
    shapFactors: [
      { factor: "Dwell duration", weight: 0.41 },
      { factor: "Zone sensitivity", weight: 0.18 },
      { factor: "Silhouette confidence", weight: 0.15 },
      { factor: "Time-of-day risk", weight: 0.08 },
      { factor: "Historical false-positive rate", weight: -0.11 },
    ],
    heatmapCells: [
      { x: 4, y: 10, weight: 0.5 }, { x: 5, y: 10, weight: 0.7 }, { x: 5, y: 11, weight: 0.55 },
    ],
    signedHash: "sha256:2b7e9a1f4c6d8e02b3a5f7091cde4bb8d6f9e23e5b7c8d9e0f1a2b3c4d5e6f70",
    signedAt: "2026-07-24T17:59:03Z",
    operator: "auto-signed · evidence-signer-01",
    ntpOffsetMs: 8,
  },
}
