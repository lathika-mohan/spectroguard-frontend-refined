import { useCallback, useEffect, useRef, useState } from 'react';
import { LiveAnalysisService } from '../services/liveAnalysisService';
import { liveAnalysisStore } from '../state/liveAnalysisStore';
import type { InferenceResult, LiveCameraStatus, LivePredictionSession, TamperEvent, TamperEventResult } from '../types';

const FRAME_POLL_MS = 250;   // ~4 fps live preview (cheap on localhost)
const STATUS_POLL_MS = 2000; // telemetry refresh

export interface LiveAnalysisState {
  isStarting: boolean;
  isLive: boolean;
  isAnalyzing: boolean;
  frameUrl: string | null;
  status: LiveCameraStatus | null;
  inference: InferenceResult | null;
  tamper: TamperEventResult | null;
  snapshotUrl: string | null;
  lastEvent: TamperEvent | null;
  error: string | null;
}

const initialState: LiveAnalysisState = {
  isStarting: false,
  isLive: false,
  isAnalyzing: false,
  frameUrl: null,
  status: null,
  inference: null,
  tamper: null,
  snapshotUrl: null,
  lastEvent: null,
  error: null,
};

/**
 * useLiveAnalysis
 * ---------------
 * Drives the real CV Engine live-analysis session from the web GUI:
 *
 *   start()  -> POST /camera/start, then polls /camera/frame + /camera/status
 *   runPrediction() -> POST /inference/run, reads /tamper/latest, grabs the
 *                      tamper screenshot, publishes a LivePredictionSession
 *                      into the store (consumed by the Predict page), returns it.
 *   stop()   -> POST /camera/stop and tears down all polling.
 */
export const useLiveAnalysis = () => {
  const [state, setState] = useState<LiveAnalysisState>(initialState);
  const frameTimer = useRef<number | null>(null);
  const statusTimer = useRef<number | null>(null);
  const liveRef = useRef(false);
  const frameUrlRef = useRef<string | null>(null);

  const clearFrameUrl = useCallback(() => {
    if (frameUrlRef.current) {
      URL.revokeObjectURL(frameUrlRef.current);
      frameUrlRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (frameTimer.current !== null) window.clearInterval(frameTimer.current);
    if (statusTimer.current !== null) window.clearInterval(statusTimer.current);
    frameTimer.current = null;
    statusTimer.current = null;
  }, []);

  const pollFrames = useCallback(() => {
    frameTimer.current = window.setInterval(async () => {
      try {
        const blob = await LiveAnalysisService.fetchLiveFrame();
        clearFrameUrl();
        const url = URL.createObjectURL(blob);
        frameUrlRef.current = url;
        setState((prev) => ({ ...prev, frameUrl: url, error: null }));
      } catch (err: any) {
        // Non-fatal: keep the last frame visible while the stream hiccups.
        if (liveRef.current) {
          setState((prev) => ({ ...prev, error: null }));
        }
      }
    }, FRAME_POLL_MS);
  }, [clearFrameUrl]);

  const pollStatus = useCallback(() => {
    statusTimer.current = window.setInterval(async () => {
      try {
        const status = await LiveAnalysisService.cameraStatus();
        setState((prev) => ({ ...prev, status }));
      } catch {
        // ignore telemetry blips
      }
    }, STATUS_POLL_MS);
  }, []);

  const start = useCallback(async (source?: string | number) => {
    setState((prev) => ({ ...prev, isStarting: true, error: null }));
    try {
      await LiveAnalysisService.startCamera(source);
      liveRef.current = true;
      setState((prev) => ({ ...prev, isStarting: false, isLive: true }));

      // Warm telemetry once, then start both polls.
      try {
        const status = await LiveAnalysisService.cameraStatus();
        setState((prev) => ({ ...prev, status }));
      } catch { /* handled by poll */ }

      pollFrames();
      pollStatus();
    } catch (err: any) {
      liveRef.current = false;
      setState((prev) => ({
        ...prev,
        isStarting: false,
        isLive: false,
        error: err?.message || 'Failed to start live camera capture.',
      }));
    }
  }, [pollFrames, pollStatus]);

  const stop = useCallback(async () => {
    liveRef.current = false;
    stopPolling();
    clearFrameUrl();
    try {
      await LiveAnalysisService.stopCamera();
    } catch {
      // camera may already be stopped
    }
    setState(initialState);
  }, [stopPolling, clearFrameUrl]);

  /**
   * Run the real inference, capture the tamper screenshot and publish a
   * session for the Predict page. Returns null on failure (error surfaced).
   */
  const runPrediction = useCallback(async (): Promise<LivePredictionSession | null> => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const inference = await LiveAnalysisService.runInference();
      let tamper: TamperEventResult | null = null;
      let lastEvent: TamperEvent | null = null;
      let snapshotUrl: string | null = null;

      try {
        tamper = await LiveAnalysisService.latestTamper();
      } catch { /* no tamper yet -> still nominal */ }

      // Real tamper screenshot: prefer the most recent persisted detection,
      // otherwise use the live frame itself.
      try {
        const events = await LiveAnalysisService.fetchEvents(1);
        lastEvent = events[0] ?? null;
        if (lastEvent?.uuid) {
          const blob = await LiveAnalysisService.fetchSnapshot(lastEvent.uuid);
          snapshotUrl = URL.createObjectURL(blob);
        }
      } catch { /* fall back to live frame below */ }

      if (!snapshotUrl) {
        try {
          const blob = await LiveAnalysisService.fetchLiveFrame();
          snapshotUrl = URL.createObjectURL(blob);
        } catch { /* no screenshot available */ }
      }

      const isTampered = inference.prediction === 1 || (tamper && tamper.tamper_type !== 'NORMAL');

      const session: LivePredictionSession = {
        predictionId: `live_${Date.now().toString(36)}`,
        cameraName: lastEvent?.cameraName || 'Live Camera',
        cameraId: inference.camera_id || 'CAM-LIVE',
        timestamp: new Date().toISOString(),
        prediction: isTampered ? 'tampering_suspected' : 'nominal',
        probability: inference.probability,
        confidence: tamper?.confidence ?? inference.confidence,
        threshold: inference.threshold,
        severity: tamper?.severity ?? (isTampered ? 'HIGH' : 'LOW'),
        tamperType: tamper?.tamper_type ?? (isTampered ? 'UNKNOWN_ANOMALY' : 'NORMAL'),
        rationale: tamper?.explanation
          ? `${tamper.explanation} (rule: ${tamper.tamper_type}, dev: ${tamper.deviation_score.toFixed(3)})`
          : isTampered
            ? 'Tamper signatures detected in the live frame window.'
            : 'No tamper signatures detected; camera integrity nominal.',
        latencyMs: inference.latency_ms,
        featureSnapshot: inference.feature_vector ?? {},
        snapshotUrl,
        snapshotBlobUrl: snapshotUrl ?? undefined,
        source: 'live-analysis',
      };

      liveAnalysisStore.set(session);
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        inference,
        tamper,
        lastEvent,
        snapshotUrl,
      }));
      return session;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: err?.message || 'Inference engine failed to produce a result.',
      }));
      return null;
    }
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopPolling();
      clearFrameUrl();
    };
  }, [stopPolling, clearFrameUrl]);

  return { ...state, start, stop, runPrediction };
};
