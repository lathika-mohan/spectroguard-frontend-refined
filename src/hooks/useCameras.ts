import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { CameraFeedItem, CameraRegistryEntry } from '../types';

export interface CameraData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'anomalous';
  integrityScore: number;
  resolution?: string;
  fps?: number;
  thumbnail?: string;
}

/**
 * Map the REAL CV Engine camera-registry rows into the frontend
 * `CameraFeedItem` schema. No synthetic rows, no Unsplash placeholders:
 * unknown fields fall back to neutral defaults, thumbnails are rendered by
 * the live-frame fetcher in the UI instead of stock photos.
 */
export const mapRegistryToFeedItems = (registry: CameraRegistryEntry[]): CameraFeedItem[] => {
  return registry.map((c) => {
    const integrityPct = Math.round(Math.max(0, Math.min(1, c.integrity_score ?? 0)) * 100);
    const online = c.status === 'online';
    const anomalous = c.status === 'anomalous';

    return {
      id: c.id || c.camera_id || `CAM-${Date.now().toString(36)}`,
      name: c.name || `Camera ${c.id}`,
      location: c.location || c.building || 'Unassigned Zone',
      building: c.building || (c.location || 'Main Facility').split(' ')[0],
      status: anomalous ? 'Tampered' : online ? 'Online' : 'Offline',
      integrityScore: integrityPct,
      integrityStatus: anomalous ? 'Tampered' : online ? 'Nominal' : 'Offline',
      resolution: c.resolution || '1920 × 1080',
      frameRate: `${c.fps || 0} FPS`,
      codec: 'H.264',
      lastUpdated: c.last_seen ? new Date(c.last_seen).toLocaleString() : '—',
      lastPrediction: c.last_event ? new Date(c.last_event).toLocaleString() : '—',
      connection: online ? 'Stable' : anomalous ? 'Unstable' : 'Disconnected',
      stream: online || anomalous ? 'Active' : 'Inactive',
      imageUrl: '', // real frame is fetched live via /camera/frame
      timestamp: c.last_seen ? new Date(c.last_seen).toLocaleTimeString() : '—',
      predictionDetail: anomalous
        ? 'Tamper signatures detected on this camera. Screenshot captured for forensic review.'
        : online
          ? 'Camera integrity nominal. No tamper signatures detected.'
          : 'Camera is offline. Signal unavailable.',
      historyScores: c.history_scores?.length
        ? c.history_scores
        : undefined,
    };
  });
};

export const useCameras = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [registry, setRegistry] = useState<CameraRegistryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The gateway returns the REAL CV Engine camera registry when reachable.
      const responseData = await apiClient<CameraData[] | CameraRegistryEntry[]>('/cameras');
      const rows = Array.isArray(responseData) ? responseData : [];
      setRegistry(rows as CameraRegistryEntry[]);
      setData(rows as CameraData[]);
    } catch (err: any) {
      console.error('Failed to fetch camera telemetry from backend:', err);
      setError(err.message || 'Failed to fetch camera list from backend.');
      setRegistry([]);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  return { data, registry, isLoading, error, refetch: fetchCameras };
};
