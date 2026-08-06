import type { CameraFeedItem } from '../types';

/**
 * Camera data source: REMOVED ALL SYNTHETIC ROWS.
 *
 * The dashboard/camera registry previously rendered a hard-coded, fake camera
 * set (Unsplash thumbnails, made-up integrity scores). Those rows are gone.
 *
 * Real cameras are now served by the CV Engine camera registry through the
 * gateway's `GET /api/v1/cameras` endpoint. The PyQt GUI registers every
 * camera on connect (with the operator-given name), and the registry persists
 * it to `storage/registry/cameras.json`.
 *
 * `INITIAL_CAMERAS` is kept as an empty array purely so existing imports do
 * not break; it is never used as data anymore.
 */
export const INITIAL_CAMERAS: CameraFeedItem[] = [];

/** Template of the exact CameraFeedItem contract the backend registry fills. */
export const CAMERA_FEED_TEMPLATE: CameraFeedItem = {
  id: 'CAM-001',
  name: 'Camera Name From Registry',
  location: 'Zone / Location',
  building: 'Building',
  status: 'Online',
  integrityScore: 0,
  integrityStatus: 'Nominal',
  resolution: '1920 × 1080',
  frameRate: '30 FPS',
  codec: 'H.264',
  lastUpdated: '—',
  lastPrediction: '—',
  connection: 'Stable',
  stream: 'Active',
  imageUrl: '',
  timestamp: '—',
  predictionDetail: 'Waiting for real telemetry…',
  historyScores: [],
};
