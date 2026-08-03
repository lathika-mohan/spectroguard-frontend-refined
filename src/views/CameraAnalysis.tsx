import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { BackgroundLoopCanvas } from '../components/BackgroundLoopCanvas';
import { PredictionAnalysisView } from '../components/PredictionAnalysisView';
import { 
  ShieldAlert, 
  ArrowLeft
} from 'lucide-react';

interface PredictionRecord {
  prediction_id: string;
  status: string;
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
}

export default function CameraAnalysis() {
  const { predictionId } = useParams<{ predictionId: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<PredictionRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    if (!predictionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<PredictionRecord>(`/predictions/${predictionId}`);
      setPrediction(data);
    } catch (err: any) {
      console.error('Failed to fetch prediction details:', err);
      setError(err.message || 'The requested analysis record could not be found or retrieved.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [predictionId]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-['SF_Pro_Text'] selection:bg-blue-500/30 relative overflow-x-hidden">
      {/* Background Loop Canvas matching exactly the Apple fluid glass loop */}
      <BackgroundLoopCanvas />

      {/* Header Bar */}
      <header className="sticky top-0 z-45 w-full backdrop-blur-2xl bg-[#030712]/90 border-b border-white/10 py-3">
        <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-all font-['SF_Pro_Text'] cursor-pointer"
            id="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2 select-none">
            <span className="text-xl font-extrabold tracking-tight text-white font-['SF_Pro_Display']">
              SPECTRA<span className="text-blue-400">GUARD</span>
            </span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              ANALYSIS
            </span>
          </div>
        </div>
      </header>

      {/* Main Analysis Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-blue-550/30 animate-ping" />
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-400">Loading CV Engine physics records...</p>
          </div>
        ) : error ? (
          <div className="liquid-glass-hero p-8 rounded-2xl text-center space-y-4 border border-rose-500/20 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white font-['SF_Pro_Display']">Analysis Inaccessible</h2>
            <p className="text-xs text-slate-350 leading-relaxed font-sf-text">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-['SF_Pro_Text'] shadow-lg cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : prediction ? (
          <PredictionAnalysisView 
            prediction={prediction} 
            onNavigateToForensics={() => navigate('/dashboard')}
          />
        ) : null}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#030712]/90 py-4 text-slate-500 text-[11px] font-mono">
        <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          © 2026 SpectraGuard Inc. • Surveillance Physics Verification Engine
        </div>
      </footer>
    </div>
  );
}
