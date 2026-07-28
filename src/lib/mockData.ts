export type CameraStatus = "live" | "warn" | "alarm" | "offline";
export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: CameraStatus;
  lastEvent?: string;
}

export type AlertSeverity = "critical" | "warning" | "info";
export type DecisionPathType = "standard" | "fast";
export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  label: string;
  severity: AlertSeverity;
  confidence: number;
  timestamp: string;
  acknowledged: boolean;
  pathType: DecisionPathType;
}

export interface WorkerNode {
  id: string;
  name: string;
  role: string;
  status: "healthy" | "degraded" | "restarting";
  uptime: string;
  restarts24h: number;
  queueDepth: number;
}

export interface ForensicPackage {
  id: string;
  alertId: string;
  cameraName: string;
  pathType: DecisionPathType;
  decisionPath: string[];
  shapFactors: { factor: string; weight: number }[];
  heatmapCells: { x: number; y: number; weight: number }[];
  signedHash: string;
  signedAt: string;
  operator: string;
  ntpOffsetMs: number;
}

export const mockCameras: Camera[] = [
  { id: "cam-01", name: "Main Entrance", zone: "Lobby", status: "live", lastEvent: "Routine check optimal" },
  { id: "cam-02", name: "Server Room A", zone: "Secure Unit", status: "alarm", lastEvent: "High-frequency frame dropout detected" },
  { id: "cam-03", name: "Loading Dock East", zone: "Logistics", status: "live", lastEvent: "Object tracking active" },
  { id: "cam-04", name: "Vault Entry", zone: "Secure Unit", status: "offline", lastEvent: "Signal lost at 04:12:11" },
  { id: "cam-05", name: "Perimeter West", zone: "Exterior", status: "warn", lastEvent: "Motion detected (cleared)" }
];

export const mockAlerts: Alert[] = [
  { id: "evt-88213", cameraId: "cam-02", cameraName: "Server Room A", label: "Frame Dropout Anomaly", severity: "critical", confidence: 0.9412, timestamp: "12:04:11", acknowledged: false, pathType: "fast" }
];

export const mockWorkers: WorkerNode[] = [
  { id: "node-01", name: "Edge Node Alpha", role: "Ingest & FFT", status: "healthy", uptime: "14d 6h", restarts24h: 0, queueDepth: 2 }
];

export const mockForensicPackages: ForensicPackage[] = [
  {
    id: "pkg-88213",
    alertId: "evt-88213",
    cameraName: "Server Room A",
    pathType: "fast",
    decisionPath: ["Frame Grabber Ingest", "Spatial Variance Scan", "Log Spectral Energy Drop", "Mitosis Trigger Threshold"],
    shapFactors: [{ factor: "laplacian_variance", weight: 0.42 }, { factor: "spectral_flatness", weight: 0.28 }],
    heatmapCells: [{ x: 4, y: 7, weight: 0.89 }],
    signedHash: "0x8f3c7a1b9e2d4f5c",
    signedAt: "2026-07-28T12:04:15Z",
    operator: "op-4471",
    ntpOffsetMs: 12
  }
];

// Re-exports for historical naming structures used by webhookClient
export { mockCameras as cameras, mockAlerts as alerts, mockWorkers as workers, mockForensicPackages as forensicPackages };
