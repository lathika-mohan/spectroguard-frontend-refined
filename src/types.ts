export type CategoryType = 
  | 'Dashboard'
  | 'Cameras'
  | 'Forensics'
  | 'Predictions'
  | 'Settings'
  | 'All Tools'
  | 'AI Writing'
  | 'Image Generation'
  | 'Video Tools'
  | 'Productivity'
  | 'Marketing'
  | 'Analytics'
  | 'Development'
  | 'Design'
  | 'Education'
  | string;

export interface AITool {
  id: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  description: string;
  longDescription?: string;
  rating: number;
  usersCount: string;
  isFeatured?: boolean;
  isActiveHighlight?: boolean; // e.g. CodeGenie in image
  iconType: 'chatmind' | 'imaginepro' | 'vidnova' | 'codegenie' | 'voicescribe' | 'slidecraft' | 'promptmaster' | 'generic' | string;
  iconBg: string; // gradient or solid color
  iconSymbol?: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  tags: string[];
  websiteUrl?: string;
  addedDate: string;
  bookmarked?: boolean;
  features?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'Update' | 'New Tool' | 'System';
}

export interface CameraFeedItem {
  id: string;
  name: string;
  location: string;
  building: string;
  status: 'Online' | 'Offline' | 'Investigating' | 'Tampered';
  integrityScore: number;
  integrityStatus: 'Nominal' | 'Investigating' | 'Tampered' | 'Offline';
  resolution: string;
  frameRate: string;
  codec: string;
  lastUpdated: string;
  lastPrediction: string;
  connection: 'Stable' | 'Unstable' | 'Disconnected';
  stream: 'Active' | 'Inactive';
  imageUrl: string;
  timestamp: string;
  predictionDetail: string;
  historyScores?: { label: string; score: number }[];
}

export interface PredictionSession {
  prediction_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | string;
  filename: string;
  file_path: string;
  camera: string;
  operator: string;
  timestamp: string;
  prediction: 'nominal' | 'tampering_suspected';
  confidence: number;
  confidence_tier: string;
  severity: string;
  action_required: boolean;
  rationale: string;
  shap_attributions: { factor: string; weight: number }[];
  feature_snapshot: Record<string, number>;
  latency_ms: number;
  
  user_id?: string;
  uploaded_filename?: string;
  uploaded_at?: string;
  processing_time_ms?: number;
  model_version?: string;
  camera_type?: string;
  original_media_path?: string;
  generated_report_path?: string;
}

// ---------------------------------------------------------------------------
// LIVE ANALYSIS / CV ENGINE CONTRACTS (real data)
// ---------------------------------------------------------------------------

/** A camera row from the CV Engine camera registry (real operator-given names). */
export interface CameraRegistryEntry {
  id: string;
  camera_id?: string;
  name: string;
  location: string;
  building?: string;
  vendor: string;
  ip_address?: string;
  port?: number;
  source: string;
  status: 'online' | 'offline' | 'anomalous';
  integrity_score: number;          // 0..1
  resolution: string;
  fps: number;
  last_seen?: string;
  registered_at?: string;
  tamper_count?: number;
  last_event?: string | null;
  history_scores?: { label: string; score: number }[];
}

/** Live camera manager telemetry from the CV Engine. */
export interface LiveCameraStatus {
  camera_id: string;
  is_opened: boolean;
  status: string;
  fps: number;
  width: number;
  height: number;
  frame_count: number;
  uptime_seconds: number;
}

export interface CameraInfo {
  camera_id: string;
  opencv_backend: string;
  camera_source: string;
  max_fps: number;
  resolution: string;
}

/** Result of POST /inference/run (real physics inference engine). */
export interface InferenceResult {
  timestamp: string;
  probability: number;              // probability of tampering class (0..1)
  prediction: number;               // 0 = Normal, 1 = Tampered
  confidence: number;
  threshold: number;
  latency_ms: number;
  feature_vector: Record<string, number>;
  camera_id: string;
}

/** Result of GET /tamper/latest (real tamper classification event). */
export interface TamperEventResult {
  timestamp: string;
  tamper_type: string;
  severity: string;
  confidence: number;
  triggered_rules: Record<string, number>;
  explanation: string;
  deviation_score: number;
  mahalanobis_distance: number;
  random_forest_prediction: number;
  random_forest_probability: number;
  latency_ms: number;
}

/** A persisted tamper detection event served by the CV Engine events API. */
export interface TamperEvent {
  id: string;
  uuid: string;
  camera: string;
  cameraName: string;
  event: string;
  description: string;
  tamper_type: string;
  severity: string;
  confidence: number;
  probability?: number;
  status: string;
  timestamp: string;
  relativeTime?: string;
  snapshot_path?: string;
  snapshot_url?: string;
  imageUrl?: string;
  drift_score?: number;
  notification_delivery_state?: string;
}

/** Complete live-analysis session handed to the Predict page. */
export interface LivePredictionSession {
  predictionId: string;
  cameraName: string;
  cameraId: string;
  timestamp: string;
  prediction: 'nominal' | 'tampering_suspected';
  probability: number;
  confidence: number;
  threshold: number;
  severity: string;
  tamperType: string;
  rationale: string;
  latencyMs: number;
  featureSnapshot: Record<string, number>;
  snapshotUrl: string | null;      // real tamper screenshot (auth-protected)
  snapshotBlobUrl?: string;        // in-memory object URL for <img>
  source: 'live-analysis' | 'upload';
}


