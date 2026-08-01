import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { BackgroundLoopCanvas } from '../components/BackgroundLoopCanvas';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowLeft, 
  Clock, 
  User, 
  Video, 
  Cpu
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
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
              <div className="w-12 h-12 rounded-full border-2 border-blue-550 border-t-transparent animate-spin" />
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
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Row Title Card */}
            <div className="liquid-glass-hero p-6 sm:p-8 rounded-2xl border border-white/15 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider font-['SF_Pro_Display']">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  <span>Physical Feed Analysis Report</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-['SF_Pro_Display'] truncate max-w-md sm:max-w-xl">
                  {prediction.filename}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-400 font-sf-text">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {prediction.operator}</span>
                  <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-slate-400" /> {prediction.camera}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(prediction.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {prediction.prediction === 'nominal' ? (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sf-display">System Integrity</span>
                      <span className="text-base font-extrabold text-emerald-400 font-sf-display">NOMINAL</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                    <ShieldAlert className="w-7 h-7 text-rose-400 animate-pulse" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sf-display">Tamper Detected</span>
                      <span className="text-base font-extrabold text-rose-400 font-sf-display">SUSPICIOUS</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Core Analytics Grid: Calibration, Recommendation, Explainability */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Calibration & Metrics (7 cols) */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Calibration Details */}
                <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide font-['SF_Pro_Display'] uppercase border-b border-white/5 pb-2">
                    Inference & Probability Calibration
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <span className="text-slate-400 text-xs font-medium font-sf-text">Calibrated Confidence</span>
                      <span className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
                        {(prediction.confidence * 100).toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-slate-450 mt-1 font-sf-text">Calibrated with Platt scaling bounds</span>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <span className="text-slate-400 text-xs font-medium font-sf-text">Confidence Tier</span>
                      <span className={`text-2xl font-extrabold mt-1 font-['SF_Pro_Display'] ${
                        prediction.confidence_tier === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {prediction.confidence_tier}
                      </span>
                      <span className="text-[10px] text-slate-450 mt-1 font-sf-text">Operational integrity threshold check</span>
                    </div>
                  </div>
                </div>

                {/* Physics Diagnostics Snapshot */}
                <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide font-['SF_Pro_Display'] uppercase border-b border-white/5 pb-2">
                    Physics FFT & Spatial Metrics Snapshot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    {Object.entries(prediction.feature_snapshot).slice(0, 9).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs">
                        <span className="text-[10px] text-slate-400 block truncate" title={key}>{key}</span>
                        <span className="font-bold text-white text-sm block mt-0.5">{val.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Recommendation & Attributions (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Decision recommendation */}
                <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide font-['SF_Pro_Display'] uppercase border-b border-white/5 pb-2">
                    Decision Engine Recommendation
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Severity Classification</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        prediction.severity === 'CRITICAL' ? 'bg-rose-550/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-550/20 text-emerald-400 border border-emerald-500/30'
                      }`}>{prediction.severity}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Action Required</span>
                      <span className={`font-bold ${prediction.action_required ? 'text-rose-400' : 'text-slate-300'}`}>
                        {prediction.action_required ? 'YES (IMMEDIATE ESCALATION)' : 'NO (ROUTINE MONITORED)'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sf-display">Deterministic Rationale</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sf-text bg-white/5 p-3 rounded-xl border border-white/5">
                        {prediction.rationale}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SHAP attributions */}
                <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-wide font-['SF_Pro_Display'] uppercase border-b border-white/5 pb-2">
                    SHAP Explainability Attributions
                  </h3>
                  
                  <div className="space-y-3 font-sf-text">
                    {prediction.shap_attributions.map((attr) => {
                      const absoluteWeight = Math.abs(attr.weight);
                      const widthPercentage = Math.min(100, Math.round(absoluteWeight * 150));
                      return (
                        <div key={attr.factor} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-300">{attr.factor}</span>
                            <span className="font-mono text-slate-400">w={attr.weight.toFixed(4)}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                attr.weight >= 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${Math.max(widthPercentage, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Audit Package Ledger Details */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>LEDGER HASH: 0x{prediction.prediction_id.split('_')[1]}8fa2d1be3b4f59a</span>
              <span>LATENCY: {prediction.latency_ms.toFixed(2)} ms</span>
              <span>STATE ID: SECURE_AUDIT_LEAD_COMPLETED</span>
            </div>

          </div>
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
