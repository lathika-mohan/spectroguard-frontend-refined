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

