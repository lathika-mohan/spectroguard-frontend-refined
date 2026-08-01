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

