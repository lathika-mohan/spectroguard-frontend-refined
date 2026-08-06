import { apiClient, apiBlob } from '../api/client';
import type {
  CameraRegistryEntry,
  CameraInfo,
  InferenceResult,
  LiveCameraStatus,
  TamperEvent,
  TamperEventResult,
} from '../types';

/**
 * LiveAnalysisService
 * -------------------
 * Thin client over the CV Engine API (proxied through the SpectraGuard
 * gateway at `VITE_API_BASE_URL`). Every method here returns REAL data from
 * the camera pipeline — no synthetic values.
 *
 * Flow used by the web GUI:
 *   1. `startCamera(source?)`   -> open the physical/RTSP capture
 *   2. `fetchLiveFrame()`       -> poll the current JPEG frame (~5-10 fps)
 *   3. `runInference()`         -> run the physics tamper model on buffered frames
 *   4. `latestTamper()`         -> classification details
 *   5. `fetchSnapshot(eventId)` -> the exact JPEG screenshot saved at tamper time
 */
export class LiveAnalysisService {
  // ------------------------------------------------------------------ #
  // Camera control & telemetry
  // ------------------------------------------------------------------ #
  static async startCamera(source?: string | number): Promise<{ success: boolean; message: string; camera_id: string }> {
    return apiClient('/camera/start', {
      method: 'POST',
      body: JSON.stringify({ camera_source: source !== undefined ? String(source) : null }),
    });
  }

  static async stopCamera(): Promise<{ success: boolean; message: string; camera_id: string }> {
    return apiClient('/camera/stop', { method: 'POST', body: JSON.stringify({}) });
  }

  static async cameraStatus(): Promise<LiveCameraStatus> {
    return apiClient('/camera/status');
  }

  static async cameraInfo(): Promise<CameraInfo> {
    return apiClient('/camera/info');
  }

  /** Current live frame as a Blob (auth-protected). */
  static async fetchLiveFrame(): Promise<Blob> {
    return apiBlob('/camera/frame');
  }

  // ------------------------------------------------------------------ #
  // Inference & tamper classification (real engine)
  // ------------------------------------------------------------------ #
  static async runInference(): Promise<InferenceResult> {
    return apiClient('/inference/run', { method: 'POST', body: JSON.stringify({}) });
  }

  static async latestInference(): Promise<InferenceResult> {
    return apiClient('/inference/latest');
  }

  static async latestTamper(): Promise<TamperEventResult> {
    return apiClient('/tamper/latest');
  }

  // ------------------------------------------------------------------ #
  // Camera registry (real names as entered in the GUI connect panel)
  // ------------------------------------------------------------------ #
  static async fetchCameras(): Promise<CameraRegistryEntry[]> {
    return apiClient('/cameras');
  }

  static async registerCamera(payload: Record<string, unknown>): Promise<{ success: boolean; camera: CameraRegistryEntry }> {
    return apiClient('/cameras/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ------------------------------------------------------------------ #
  // Tamper events & snapshots
  // ------------------------------------------------------------------ #
  static async fetchEvents(limit = 20): Promise<TamperEvent[]> {
    return apiClient(`/events/latest?limit=${limit}`);
  }

  /** JPEG snapshot captured at the moment of tampering (auth-protected blob). */
  static async fetchSnapshot(eventId: string): Promise<Blob> {
    return apiBlob(`/events/snapshot/${encodeURIComponent(eventId)}`);
  }

  /** Convert a blob into an object URL (cleaning up the previous one). */
  static blobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
