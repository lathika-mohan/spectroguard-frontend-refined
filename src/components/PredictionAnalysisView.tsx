import React, { useState } from 'react';
import type { CameraFeedItem } from '../types';
import { GlassPressCard } from './GlassPressCard';
import { 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  Brain, 
  Activity, 
  FileText, 
  Layers, 
  Clock, 
  Cpu, 
  Maximize2, 
  Copy, 
  Check, 
  Info, 
  ExternalLink, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronDown,
  Play,
  Pause,
  X,
  Film,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Zap,
  Grid,
  Download,
  Shield
} from 'lucide-react';

interface PredictionAnalysisViewProps {
  currentCamera?: CameraFeedItem | null;
  onNavigateToForensics?: () => void;
  onNavigateToUploadModal?: () => void;
}

export const PredictionAnalysisView: React.FC<PredictionAnalysisViewProps> = ({
  currentCamera,
  onNavigateToForensics,
  onNavigateToUploadModal
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'0-5s' | '5-15s' | '15-22s' | 'Full'>('Full');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ hz: number; val: number } | null>(null);

  // Modals state
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isFramesModalOpen, setIsFramesModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isFftModalOpen, setIsFftModalOpen] = useState(false);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(2); // Frame #330 Key Frame by default

  // Fallback camera or current analyzed footage data
  const cameraData = currentCamera || {
    id: 'CAM-001',
    name: 'warehouse_gate.mp4',
    location: 'Warehouse Gate',
    building: 'Main Warehouse',
    status: 'Online',
    integrityScore: 32,
    integrityStatus: 'Tampered',
    resolution: '1920 × 1080',
    frameRate: '30 FPS',
    codec: 'H.264',
    lastUpdated: 'Just now',
    lastPrediction: 'May 24, 2025 07:22 PM',
    connection: 'Stable',
    stream: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    timestamp: '07:22:17 PM',
    predictionDetail: 'Strong evidence of lens obstruction / physical interference detected.',
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText('a7f3c9e821b014d983c20021b21d4f');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isTampered = cameraData.integrityStatus === 'Tampered' || cameraData.integrityScore < 60;

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const statusColor = isTampered ? '#e11d48' : '#059669';
    const statusText = isTampered ? 'TAMPERING DETECTED' : 'NOMINAL INTEGRITY FEED';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>SpectraGuard Forensic Report - ${cameraData.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              color: #0f172a; 
              padding: 40px; 
              background: #ffffff; 
              max-width: 900px;
              margin: 0 auto;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start;
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo-title { 
              font-size: 22px; 
              font-weight: 800; 
              color: #0f172a; 
              letter-spacing: -0.5px; 
            }
            .subtitle {
              color: #64748b;
              font-size: 13px;
              margin-top: 4px;
            }
            .badge { 
              padding: 6px 14px; 
              border-radius: 20px; 
              font-weight: 700; 
              font-size: 11px; 
              text-transform: uppercase; 
              letter-spacing: 0.5px;
              color: #ffffff; 
              background: ${statusColor}; 
              display: inline-block;
            }
            .meta-bar {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 30px;
            }
            .meta-item label {
              font-size: 11px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 600;
              display: block;
              margin-bottom: 4px;
            }
            .meta-item span {
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
            }
            .grid-2 { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 30px; 
            }
            .card { 
              border: 1px solid #e2e8f0; 
              padding: 20px; 
              border-radius: 12px; 
              background: #f8fafc; 
            }
            .card h3 { 
              margin: 0 0 10px 0; 
              font-size: 12px; 
              color: #64748b; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              font-weight: 700;
            }
            .card .val { 
              font-size: 32px; 
              font-weight: 800; 
              color: #0f172a; 
            }
            .section-title {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              margin: 30px 0 12px 0;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
            }
            .text-block {
              font-size: 13px;
              line-height: 1.6;
              color: #334155;
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
            }
            .table th, .table td { 
              text-align: left; 
              padding: 10px 12px; 
              border-bottom: 1px solid #e2e8f0; 
              font-size: 12px; 
            }
            .table th { 
              background: #f1f5f9; 
              color: #475569; 
              font-weight: 700; 
            }
            .actions-list {
              padding-left: 20px;
              margin: 10px 0;
              font-size: 13px;
              color: #334155;
            }
            .actions-list li {
              margin-bottom: 6px;
            }
            .footer { 
              margin-top: 50px; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px; 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
            }
            @media print { 
              body { padding: 0; } 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo-title">SpectraGuard AI Forensic Report</div>
              <div class="subtitle">Surveillance Integrity & Spectral Anomaly Assessment</div>
            </div>
            <div style="text-align: right;">
              <div class="badge">${statusText}</div>
              <div class="subtitle" style="margin-top: 6px;">Generated: ${new Date().toLocaleString()}</div>
            </div>
          </div>

          <div class="meta-bar">
            <div class="meta-item">
              <label>Media Asset</label>
              <span>${cameraData.name}</span>
            </div>
            <div class="meta-item">
              <label>Camera ID</label>
              <span>${cameraData.id}</span>
            </div>
            <div class="meta-item">
              <label>Resolution</label>
              <span>${cameraData.resolution}</span>
            </div>
            <div class="meta-item">
              <label>Location</label>
              <span>${cameraData.location}</span>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3>Model Confidence Score</h3>
              <div class="val">${isTampered ? '98.6%' : '99.2%'}</div>
              <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">Random Forest Inference v1.3.2</p>
            </div>
            <div class="card">
              <h3>Integrity Rating</h3>
              <div class="val" style="color: ${statusColor}">${isTampered ? '32% (Degraded)' : '98% (Optimal)'}</div>
              <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">Sub-Pixel Frequency Assessment</p>
            </div>
          </div>

          <div class="section-title">Investigation Summary</div>
          <div class="text-block">
            ${isTampered 
              ? 'The uploaded surveillance media exhibits significant frequency-domain anomalies consistent with partial lens obstruction. Spectral analysis indicates abnormal energy concentration in the mid-high frequency band along with reduced edge consistency and elevated entropy. Explainability analysis confirms that these frequency characteristics contributed most strongly to the final tampering classification.'
              : 'The uploaded surveillance media exhibits nominal frequency-domain characteristics with no signs of lens obstruction or tampering. Spectral analysis indicates normal energy distribution across frequency bands along with optimal edge consistency and normal noise floor. Explainability analysis confirms that baseline optical parameters contributed most strongly to the nominal classification.'}
          </div>

          <div class="section-title">Extracted Features Breakdown</div>
          <table class="table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Measured Characteristic</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Spectral Entropy</td><td>${isTampered ? '0.842 (Elevated)' : '0.120 (Normal)'}</td><td><strong>${isTampered ? 'High Risk' : 'Normal'}</strong></td></tr>
              <tr><td>Dominant Frequency</td><td>${isTampered ? '320 Hz (Peak Anomaly)' : '120 Hz (Baseline)'}</td><td><strong>Nominal</strong></td></tr>
              <tr><td>Energy Distribution</td><td>${isTampered ? 'Mid-High Band Concentration' : 'Uniform Distribution'}</td><td><strong>${isTampered ? 'Abnormal' : 'Nominal'}</strong></td></tr>
              <tr><td>Edge Consistency</td><td>${isTampered ? 'Reduced (0.27)' : 'Optimal (0.94)'}</td><td><strong>${isTampered ? 'Degraded' : 'Optimal'}</strong></td></tr>
              <tr><td>Texture Uniformity</td><td>${isTampered ? 'Irregular (0.31)' : 'Uniform (0.88)'}</td><td><strong>${isTampered ? 'Irregular' : 'Uniform'}</strong></td></tr>
              <tr><td>Noise Floor</td><td>${isTampered ? '4.820 dB' : '0.014 dB'}</td><td><strong>Normal</strong></td></tr>
            </tbody>
          </table>

          <div class="section-title">Recommended Actions & Next Steps</div>
          <ul class="actions-list">
            <li>Physically inspect the camera for obstruction or damage.</li>
            <li>Compare with previous frames or baseline capture.</li>
            <li>Continue with detailed camera diagnostics if available.</li>
            <li>Archive this forensic report for audit and reference.</li>
          </ul>

          <div class="footer">
            SpectraGuard AI Forensic Intelligence Platform • Official Export Document • Page 1 of 1
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Dynamic SVG Paths for FFT Graph based on time range and tampering state
  const getGraphPath = () => {
    if (isTampered) {
      switch (selectedTimeRange) {
        case '0-5s':
          return "M 0,85 Q 50,80 100,70 T 200,55 T 300,40 T 320,20 T 350,60 T 400,75 T 500,85";
        case '5-15s':
          return "M 0,90 Q 50,85 100,60 T 200,50 T 280,10 T 320,15 T 380,65 T 450,80 T 500,90";
        case '15-22s':
          return "M 0,80 Q 50,75 100,65 T 200,45 T 320,25 T 360,50 T 420,70 T 500,85";
        default:
          return "M 0,90 Q 50,85 100,75 T 200,60 T 300,20 T 320,15 T 350,70 T 400,80 T 500,90";
      }
    } else {
      // Nominal smoothly balanced curves (no scary spikes)
      switch (selectedTimeRange) {
        case '0-5s':
          return "M 0,85 Q 50,75 100,65 T 200,70 T 300,75 T 380,80 T 500,88";
        case '5-15s':
          return "M 0,88 Q 60,80 120,40 T 220,75 T 320,82 T 420,85 T 500,90";
        case '15-22s':
          return "M 0,85 Q 80,70 150,60 T 250,78 T 350,82 T 450,88 T 500,92";
        default:
          return "M 0,88 Q 60,78 120,38 T 240,75 T 340,80 T 440,85 T 500,90";
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-['SF_Pro_Text'] text-white max-w-[1600px] mx-auto pb-16">
      
      {/* SVG Gradient Definitions for Glowing 3D Donut Gauges & Dynamic Graphs */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          {/* Reference Image Style Green/Cyan Ring Gradient for Nominal */}
          <linearGradient id="nominalGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Tampered Red/Rose Ring Gradient */}
          <linearGradient id="tamperedGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4b4b" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* Graph Fill Gradients */}
          <linearGradient id="nominalGraphFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="tamperedGraphFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-blue-400">Prediction</span>
            <span>&gt;</span>
            <span className="text-white font-semibold">Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['SF_Pro_Display'] flex items-center gap-3">
            <span>Prediction Analysis</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              {cameraData.id}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>07:45 PM | May 24, 2025</span>
          </span>
        </div>
      </div>

      {/* Main Reference Layout 2x2 Grid (4 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Source Frame */}
        <GlassPressCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              1. Source Frame
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Key Evidence
            </span>
          </div>

          <div 
            onClick={() => setIsVideoPlayerOpen(true)}
            className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group shadow-2xl cursor-pointer"
          >
            <img 
              src={cameraData.imageUrl} 
              alt="Source Frame" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Expand Icon Overlay Button at top right of image */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoPlayerOpen(true);
              }}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg cursor-pointer"
              title="Expand frame player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Info Bar inside Card 1 */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-slate-400" />
              <span>Frame #330 / 660</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Resolution</span>
              <span className="font-bold text-white">1920 × 1080</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>07:22:17 PM</span>
            </div>
          </div>
        </GlassPressCard>

        {/* CARD 2: AI Prediction Result */}
        <GlassPressCard className={`p-6 space-y-5 flex flex-col justify-between transition-colors duration-500 ${
          isTampered 
            ? 'border-rose-500/30 bg-rose-950/10' 
            : 'border-emerald-500/30 bg-emerald-950/10'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              2. AI Prediction Result
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              isTampered 
                ? 'bg-rose-950/60 text-rose-400 border-rose-500/40' 
                : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
            }`}>
              {isTampered ? '⚠️ High Severity' : '✓ Normal Severity'}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className={`text-3xl sm:text-4xl font-extrabold font-['SF_Pro_Display'] tracking-tight ${
              isTampered ? 'text-rose-500' : 'text-emerald-400'
            }`}>
              {isTampered ? 'Tampering Detected' : 'Nominal Feed'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-['SF_Pro_Text'] leading-relaxed">
              {isTampered 
                ? 'Strong evidence of lens obstruction / physical interference detected in the surveillance feed.' 
                : 'No evidence of lens obstruction or physical interference detected in the surveillance feed.'}
            </p>
          </div>

          {/* 3 Stat Boxes Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Box 1 */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-['SF_Pro_Text'] block">Confidence</span>
              <span className="text-2xl font-extrabold text-white font-['SF_Pro_Display'] block">
                {isTampered ? '98.6%' : '99.2%'}
              </span>
              <span className="text-[10px] font-bold text-blue-400 font-mono flex items-center gap-1">
                <span>🎯 Very High</span>
              </span>
            </div>

            {/* Box 2 */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-['SF_Pro_Text'] block">Integrity Score</span>
              <span className={`text-2xl font-extrabold font-['SF_Pro_Display'] block ${
                isTampered ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {isTampered ? '32%' : '98%'}
              </span>
              <span className={`text-[10px] font-bold font-mono flex items-center gap-1 ${
                isTampered ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                <span>{isTampered ? '🛡️ Low' : '🛡️ High'}</span>
              </span>
            </div>

            {/* Box 3 */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-['SF_Pro_Text'] block">Status</span>
              <span className="text-lg font-bold text-white font-['SF_Pro_Display'] truncate block pt-0.5">
                {isTampered ? 'Investigating' : 'Verified'}
              </span>
              <span className={`text-[10px] font-bold font-mono flex items-center gap-1 ${
                isTampered ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <span>{isTampered ? '📁 Requires Review' : '✅ Passed'}</span>
              </span>
            </div>
          </div>

          {/* Bottom Row inside Card 2 */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-['SF_Pro_Text']">Prediction Class</span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${isTampered ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                <span className={isTampered ? 'text-rose-400' : 'text-emerald-400'}>
                  {isTampered ? 'Tampered' : 'Nominal'}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-['SF_Pro_Text']">Risk Level</span>
              <span className={`font-bold flex items-center gap-1 ${isTampered ? 'text-rose-500' : 'text-emerald-400'}`}>
                <span>{isTampered ? 'High' : 'Low'}</span>
                <ShieldAlert className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </GlassPressCard>

        {/* CARD 3: Frequency Domain Analysis (FFT) */}
        <GlassPressCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              3. Frequency Domain Analysis (FFT)
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Structural Evidence
            </span>
          </div>

          {/* FFT Chart Area with Y-axis and X-axis matching reference screenshot */}
          <div className="relative w-full h-56 bg-slate-950/90 rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">Magnitude</span>

            <div className="relative flex-1 flex items-stretch gap-2">
              {/* Y-axis tick marks */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 select-none py-1">
                <span>1.0</span>
                <span>0.8</span>
                <span>0.6</span>
                <span>0.4</span>
                <span>0.2</span>
                <span>0.0</span>
              </div>

              {/* SVG Plot area */}
              <div className="relative flex-1 h-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                  ))}

                  {/* Fill path */}
                  <path
                    d={`${getGraphPath()} L 500,100 L 0,100 Z`}
                    fill={`url(#${isTampered ? 'tamperedGraphFill' : 'nominalGraphFill'})`}
                    opacity="0.6"
                  />

                  {/* Line path */}
                  <path
                    d={getGraphPath()}
                    fill="none"
                    stroke={isTampered ? '#f43f5e' : '#38bdf8'}
                    strokeWidth="2.5"
                    className="transition-all duration-500"
                  />

                  {/* Peak Indicator Dot & Pulse */}
                  {isTampered ? (
                    <>
                      <line x1="310" y1="20" x2="310" y2="100" stroke="#f43f5e" strokeDasharray="3 3" opacity="0.6" />
                      <circle cx="310" cy="20" r="5" fill="#f43f5e" className="animate-ping opacity-80" />
                      <circle cx="310" cy="20" r="4" fill="#f43f5e" />
                    </>
                  ) : (
                    <>
                      <circle cx="120" cy="38" r="4" fill="#38bdf8" className="animate-pulse" />
                    </>
                  )}
                </svg>

                {/* Peak Callout Badge */}
                <div 
                  style={{ left: isTampered ? '62%' : '24%' }}
                  className={`absolute top-0 -translate-x-1/2 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full shadow-xl border border-white/20 animate-pulse z-20 ${
                    isTampered ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white'
                  }`}
                >
                  {isTampered ? 'Anomaly Detected' : 'Harmonics Nominal'}
                </div>
              </div>
            </div>

            {/* X-axis tick labels */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 pl-6 pt-1 border-t border-white/10">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span className="text-slate-300 font-bold">Frequency (Hz)</span>
              <span>400</span>
              <span>500</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-['SF_Pro_Text'] leading-relaxed">
            {isTampered 
              ? 'Abnormal energy concentration detected in the mid-high frequency range indicating possible lens obstruction or degradation.' 
              : 'Normal energy distribution across frequency bands with no abnormal spikes detected.'}
          </p>
        </GlassPressCard>

        {/* CARD 4: Explainability (SHAP) */}
        <GlassPressCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              4. Explainability (SHAP)
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Model Explanation
            </span>
          </div>

          <span className="text-xs text-slate-400 font-['SF_Pro_Text'] block">
            Top features contributing to this prediction
          </span>

          {/* SHAP Bars */}
          <div className="space-y-2.5 font-mono text-xs">
            {[
              { label: 'High Frequency Energy (280-320 Hz)', value: isTampered ? '+0.42' : '+0.05', width: '85%', positive: isTampered },
              { label: 'Spectral Entropy', value: isTampered ? '+0.31' : '+0.08', width: '65%', positive: isTampered },
              { label: 'Edge Consistency', value: isTampered ? '+0.27' : '-0.24', width: '50%', positive: !isTampered },
              { label: 'Signal Contrast', value: isTampered ? '+0.18' : '-0.19', width: '35%', positive: !isTampered },
              { label: 'Frequency Dispersion', value: isTampered ? '-0.11' : '-0.32', width: '25%', positive: false },
              { label: 'Low Frequency Energy (0-50 Hz)', value: isTampered ? '-0.08' : '-0.38', width: '20%', positive: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-52 text-[11px] text-slate-300 truncate font-['SF_Pro_Text']">{item.label}</span>
                <div className="flex-1 h-3.5 bg-black/50 rounded-full overflow-hidden relative border border-white/5">
                  <div 
                    style={{ width: item.width }} 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.positive 
                        ? (isTampered ? 'bg-gradient-to-r from-rose-700 to-rose-500' : 'bg-gradient-to-r from-emerald-600 to-cyan-500')
                        : 'bg-blue-600/80'
                    }`}
                  />
                </div>
                <span className={`w-10 text-right font-bold text-[11px] ${
                  item.positive 
                    ? (isTampered ? 'text-rose-400' : 'text-emerald-400') 
                    : 'text-blue-400'
                }`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Impact Axis Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10">
            <span>Low Impact</span>
            <div className={`h-1 flex-1 mx-4 rounded-full ${
              isTampered ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500'
            }`} />
            <span>High Impact</span>
          </div>
        </GlassPressCard>

      </div>

      {/* SECTION 2: Feature Summary, Confidence Breakdown, Processing Timeline (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 5: 5. Feature Summary */}
        <GlassPressCard className="p-6 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              5. Feature Summary
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Extracted Features
            </span>
          </div>

          <div className="space-y-3 relative z-10">
            {[
              {
                name: 'Spectral Entropy',
                badge: isTampered ? 'High' : 'Normal',
                status: isTampered ? 'tampered' : 'normal',
                icon: Activity
              },
              {
                name: 'Dominant Frequency',
                badge: 'Normal',
                status: 'normal',
                icon: BarChart2
              },
              {
                name: 'Energy Distribution',
                badge: isTampered ? 'Abnormal' : 'Nominal',
                status: isTampered ? 'tampered' : 'normal',
                icon: Zap
              },
              {
                name: 'Edge Consistency',
                badge: isTampered ? 'Reduced' : 'Optimal',
                status: isTampered ? 'warning' : 'normal',
                icon: Layers
              },
              {
                name: 'Texture Uniformity',
                badge: isTampered ? 'Irregular' : 'Uniform',
                status: isTampered ? 'warning' : 'normal',
                icon: Grid
              },
              {
                name: 'Noise Level',
                badge: 'Normal',
                status: 'normal',
                icon: ShieldCheck
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border ${
                    isTampered 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    <feature.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 font-['SF_Pro_Text']">
                    {feature.name}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  feature.status === 'tampered'
                    ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                    : feature.status === 'warning'
                    ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                }`}>
                  {feature.badge}
                </span>
              </div>
            ))}
          </div>
        </GlassPressCard>

        {/* CARD 6: 6. Confidence Breakdown */}
        <GlassPressCard className="p-6 space-y-5 flex flex-col justify-between text-center">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-left">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              6. Confidence Breakdown
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Model Certainty
            </span>
          </div>

          {/* Big Glowing Circular Ring Gauge */}
          <div className="flex flex-col items-center justify-center my-auto py-4 relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              
              {/* Soft Radial Ambient Glow */}
              <div className={`absolute inset-2 rounded-full blur-2xl opacity-40 ${
                isTampered ? 'bg-blue-600' : 'bg-cyan-500'
              }`} />

              <svg className="w-full h-full -rotate-90 overflow-visible relative z-10" viewBox="0 0 100 100">
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-800/80 stroke-current"
                  strokeWidth="5"
                  fill="none"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isTampered ? '#3b82f6' : '#06b6d4'}
                  strokeWidth="6"
                  strokeDasharray="251"
                  strokeDashoffset={isTampered ? '12' : '6'}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    filter: isTampered
                      ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.9))'
                      : 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.9))'
                  }}
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 select-none">
                <span className="text-3xl font-extrabold text-white font-['SF_Pro_Display'] tracking-tight">
                  {isTampered ? '98.6%' : '99.2%'}
                </span>
                <span className="text-xs font-medium text-slate-300 font-['SF_Pro_Text'] mt-1">
                  Confidence
                </span>
                <span className="text-[11px] font-bold text-blue-400 font-mono mt-0.5">
                  Very High
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-['SF_Pro_Text'] leading-relaxed border-t border-white/10 pt-3">
            The model is highly certain about this prediction based on extracted frequency characteristics.
          </p>
        </GlassPressCard>

        {/* CARD 7: 7. Processing Timeline */}
        <GlassPressCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              7. Processing Timeline
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Investigation Steps
            </span>
          </div>

          <div className="relative space-y-3.5 font-['SF_Pro_Text'] my-auto">
            {/* Connecting Vertical Line */}
            <div className="absolute top-3 bottom-3 left-3.5 w-0.5 bg-purple-500/30 z-0" />

            {[
              { step: 'Upload Complete', time: '07:22:15 PM', icon: RotateCcw },
              { step: 'Frame Extraction', time: '07:22:16 PM', icon: CheckCircle2 },
              { step: 'FFT Analysis', time: '07:22:18 PM', icon: Zap },
              { step: 'Feature Extraction', time: '07:22:19 PM', icon: CheckCircle2 },
              { step: 'Random Forest Inference', time: '07:22:20 PM', icon: CheckCircle2 },
              { step: 'SHAP Explanation Generated', time: '07:22:21 PM', icon: CheckCircle2 },
              { step: 'Prediction Completed', time: '07:22:21 PM', icon: CheckCircle2 },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#111028] border border-purple-500/50 text-purple-300 flex items-center justify-center text-xs shadow-md shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {item.step}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </GlassPressCard>

      </div>

      {/* SECTION 3: Section 8 (Investigation Summary) & Section 9 (Recommended Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 8: 8. Investigation Summary */}
        <GlassPressCard className="p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              8. Investigation Summary
            </h2>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 font-['SF_Pro_Text'] leading-relaxed relative z-10 my-auto">
            {isTampered ? (
              <>
                <p>
                  The uploaded surveillance media exhibits significant frequency-domain anomalies consistent with partial lens obstruction.
                </p>
                <p>
                  Spectral analysis indicates abnormal energy concentration in the mid-high frequency band along with reduced edge consistency and elevated entropy.
                </p>
                <p>
                  Explainability analysis confirms that these frequency characteristics contributed most strongly to the final tampering classification.
                </p>
                <p>
                  Manual inspection of the affected camera is recommended to verify physical obstruction or interference.
                </p>
              </>
            ) : (
              <>
                <p>
                  The uploaded surveillance media exhibits nominal frequency-domain characteristics with no signs of lens obstruction or tampering.
                </p>
                <p>
                  Spectral analysis indicates normal energy distribution across frequency bands along with optimal edge consistency and normal noise floor.
                </p>
                <p>
                  Explainability analysis confirms that baseline optical parameters contributed most strongly to the nominal classification.
                </p>
                <p>
                  No manual inspection or physical intervention is required for this feed.
                </p>
              </>
            )}
          </div>

          {/* Subdued Shield Watermark Background */}
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-10 text-indigo-400 z-0">
            <Shield className="w-32 h-32" />
          </div>
        </GlassPressCard>

        {/* CARD 9: 9. Recommended Action */}
        <GlassPressCard className="p-6 space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
              9. Recommended Action
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Next Steps
            </span>
          </div>

          {/* Action List */}
          <div className="space-y-3 font-['SF_Pro_Text'] text-xs sm:text-sm text-slate-200 my-auto">
            {[
              'Physically inspect the camera for obstruction or damage.',
              'Compare with previous frames or baseline capture.',
              'Continue with detailed camera diagnostics if available.',
              'Archive this forensic report for audit and reference.'
            ].map((action, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="leading-snug">{action}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleExportPdf}
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs font-['SF_Pro_Text'] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Report</span>
            </button>

            <button
              onClick={() => {
                if (onNavigateToUploadModal) onNavigateToUploadModal();
              }}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold font-['SF_Pro_Text'] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Run New Prediction</span>
            </button>
          </div>
        </GlassPressCard>

      </div>

      {/* MODAL 1: Footage Playback Modal */}
      {isVideoPlayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden font-['SF_Pro_Text']">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                    <span>{cameraData.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      {cameraData.resolution} @ {cameraData.frameRate}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Camera ID: {cameraData.id} • {cameraData.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsVideoPlayerOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Area */}
            <div className="relative w-full aspect-video bg-black overflow-hidden group">
              <img 
                src={cameraData.imageUrl} 
                alt="Footage Playback"
                className="w-full h-full object-cover contrast-[1.05]"
              />
              
              {/* Status HUD Watermark */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-mono z-10">
                <span className={`w-2 h-2 rounded-full ${isTampered ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-white font-bold">{isTampered ? 'TAMPERED FEED DETECTED' : 'NOMINAL INTEGRITY FEED'}</span>
              </div>

              {/* Video Scrubber & Playback Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2 z-20">
                {/* Progress bar scrubber */}
                <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer relative">
                  <div className={`h-full ${isTampered ? 'bg-rose-500' : 'bg-cyan-400'} ${isPlayingVideo ? 'w-3/5 transition-all duration-1000' : 'w-2/5'}`} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="text-white hover:text-cyan-400 cursor-pointer"
                    >
                      {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span>{isPlayingVideo ? '00:13 / 00:22' : '00:08 / 00:22'}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">Frame 390 / 660</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-400">{cameraData.codec}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">1080p</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer info */}
            <div className="p-4 px-6 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>660 Total Frames Analyzed by Model</span>
              </span>
              <button
                onClick={() => setIsVideoPlayerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Close Player
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Extracted Key Frames Modal */}
      {isFramesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden font-['SF_Pro_Text'] max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                    <span>Extracted Frames Analysis (5 Keypoints)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      660 Frames Total
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Select a frame below to inspect sub-pixel spectrum and noise levels
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFramesModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area: Large Preview + Specs */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Selected Frame Zoom View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Large Frame Image */}
                <div className="lg:col-span-8 h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-white/15 relative group shadow-2xl">
                  <img 
                    src={cameraData.imageUrl} 
                    alt="Selected frame preview"
                    className="w-full h-full object-cover saturate-[0.9] contrast-[1.1]"
                  />
                  
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 border border-white/20 text-xs font-mono text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Frame #{[110, 220, 330, 440, 550][selectedFrameIdx]}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-cyan-300">{['00:03.66', '00:07.33', '00:11.00', '00:14.66', '00:18.33'][selectedFrameIdx]}</span>
                  </div>

                  <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-black/80 border border-white/20 text-xs font-mono font-bold">
                    {selectedFrameIdx === 2 && isTampered ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> High Anomaly Keypoint
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Nominal Frame
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Frame Metrics Panel */}
                <div className="lg:col-span-4 space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10 font-mono text-xs">
                  <h4 className="text-sm font-bold text-white font-['SF_Pro_Display'] uppercase border-b border-white/10 pb-2">
                    Frame #{[110, 220, 330, 440, 550][selectedFrameIdx]} Metrics
                  </h4>

                  <div className="space-y-2.5 text-slate-300">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Timestamp</span>
                      <span className="font-bold text-white">{['00:03.66', '00:07.33', '00:11.00', '00:14.66', '00:18.33'][selectedFrameIdx]}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">FFT Frequency</span>
                      <span className="font-bold text-cyan-300">
                        {selectedFrameIdx === 2 && isTampered ? '320 Hz (Peak Anomaly)' : '120 Hz (Baseline)'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Noise Floor</span>
                      <span className="font-bold text-white">
                        {selectedFrameIdx === 2 && isTampered ? '4.820 dB (High Noise)' : '0.014 dB (Normal)'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Sub-pixel Delta</span>
                      <span className="font-bold text-white">
                        {selectedFrameIdx === 2 && isTampered ? '0.842 px' : '0.012 px'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Confidence</span>
                      <span className={`font-bold ${selectedFrameIdx === 2 && isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {selectedFrameIdx === 2 && isTampered ? '98.6%' : '99.4%'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 5 Frames Thumbnail Selector Bar */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Select Extracted Keyframe
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { num: 110, time: '00:03.66', label: 'Baseline', tampered: false },
                    { num: 220, time: '00:07.33', label: 'Calibration', tampered: false },
                    { num: 330, time: '00:11.00', label: 'Key Frame', tampered: isTampered },
                    { num: 440, time: '00:14.66', label: 'Secondary', tampered: isTampered },
                    { num: 550, time: '00:18.33', label: 'Post-Event', tampered: false },
                  ].map((frame, idx) => (
                    <button
                      key={frame.num}
                      onClick={() => setSelectedFrameIdx(idx)}
                      className={`p-2 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                        selectedFrameIdx === idx
                          ? frame.tampered
                            ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                            : 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-950 mb-2 relative">
                        <img 
                          src={cameraData.imageUrl} 
                          alt={`Frame ${frame.num}`} 
                          className="w-full h-full object-cover saturate-[0.85]"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                          #{frame.num}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-white">{frame.label}</span>
                        <span className={frame.tampered ? 'text-rose-400' : 'text-emerald-400'}>
                          {frame.tampered ? 'Alert' : 'OK'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block">{frame.time}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Extracted via SpectraGuard Sub-Pixel Analyzer v1.3.2</span>
              <button
                onClick={() => setIsFramesModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: Surveillance Prediction Documentation Modal */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden font-['SF_Pro_Text'] max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 px-6 border-b border-white/10 bg-slate-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['SF_Pro_Display'] tracking-tight">
                    Understanding Your Prediction
                  </h3>
                  <p className="text-xs text-slate-400 font-['SF_Pro_Text']">
                    Learn how SpectraGuard evaluated your uploaded surveillance media and generated this integrity assessment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-slate-300 leading-relaxed font-['SF_Pro_Text']">
              
              {/* Section 1: Prediction Overview */}
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">1</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Prediction Overview
                  </h4>
                </div>
                <div className="text-slate-300 text-xs sm:text-sm space-y-2">
                  <p><strong className="text-white block mb-1">What happened?</strong></p>
                  <p>
                    SpectraGuard analyzed the uploaded image or video using a physics-informed frequency-domain pipeline. Instead of relying only on pixel appearance, the system evaluates structural frequency characteristics that reveal signs of camera degradation, obstruction, defocus, or tampering.
                  </p>
                  <p className="text-slate-200 font-medium">Your uploaded media has been classified as:</p>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span className={`font-bold px-2.5 py-1 rounded ${isTampered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                      {isTampered ? 'Tampering Detected' : 'Nominal Feed'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-bold text-cyan-300 text-sm">{isTampered ? '98.6%' : '99.2%'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Pipeline Flow Diagram */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">2</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Analysis Pipeline
                  </h4>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-white block mb-1">How was the prediction generated?</strong>
                  Every uploaded file passes through the same verification pipeline.
                </p>

                {/* Pipeline Diagram */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto">
                  <div className="flex flex-nowrap items-center justify-between gap-2 min-w-[720px] text-[11px] font-mono">
                    {[
                      'Media Upload',
                      'Frame Extraction',
                      'Frequency Transform (FFT)',
                      'Feature Extraction',
                      'ML Classification',
                      'Explainability Analysis',
                      'Final Prediction'
                    ].map((step, idx, arr) => (
                      <React.Fragment key={step}>
                        <div className="px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-center text-white font-semibold shadow-md shrink-0">
                          {step}
                        </div>
                        {idx < arr.length - 1 && (
                          <span className="text-cyan-400 font-bold shrink-0">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                  Each stage contributes evidence to the final integrity assessment.
                </p>
              </div>

              {/* Section 3: Frame Extraction */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">3</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Frame Extraction
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Your uploaded video is divided into representative frames.
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  Instead of analyzing every frame independently, SpectraGuard selects frames that best represent the surveillance scene while preserving computational efficiency.
                </p>
                <p className="text-xs text-slate-400">
                  This allows rapid inference without sacrificing reliability.
                </p>
              </div>

              {/* Section 4: Frequency-Domain Analysis */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">4</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Frequency-Domain Analysis
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Unlike traditional computer vision systems that analyze only visible pixels, SpectraGuard converts each frame into its frequency representation using the Fast Fourier Transform (FFT).
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  This reveals structural patterns that are often invisible in the spatial domain.
                </p>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase font-mono block">Examples include:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Lens obstruction</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Defocus</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Motion degradation</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Signal inconsistencies</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Camera interference</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  These frequency signatures form the basis of the integrity analysis.
                </p>
              </div>

              {/* Section 5: Feature Extraction */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">5</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Feature Extraction
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  From the frequency spectrum, SpectraGuard extracts numerical descriptors that characterize the structural behavior of the surveillance media.
                </p>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase font-mono block">Examples include:</span>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Spectral energy</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Entropy</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Contrast</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Frequency distribution</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Texture statistics</li>
                  </ul>
                </div>
                <p className="text-xs text-slate-400">
                  These features become the input to the machine learning model.
                </p>
              </div>

              {/* Section 6: Machine Learning Decision */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">6</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Machine Learning Decision
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  The extracted features are evaluated using the trained prediction model.
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  The model compares the uploaded media against previously learned integrity patterns and assigns the most probable integrity class.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 font-mono text-xs">
                  <span className="text-slate-400 font-bold block mb-1">For this prediction:</span>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Detected Class:</span>
                    <span className={`font-bold ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isTampered ? 'Tampering Detected' : 'Nominal Feed'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-bold text-white">{isTampered ? '98.6%' : '99.2%'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Higher confidence indicates stronger agreement between the observed frequency characteristics and the learned tampering patterns.
                </p>
              </div>

              {/* Section 7: Explainability */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">7</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Explainability
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  SpectraGuard does not return only a prediction. It also explains why the prediction was made.
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  The explainability engine identifies which extracted frequency characteristics contributed most strongly to the final decision.
                </p>
                <p className="text-xs text-slate-400">
                  This improves transparency and supports operator trust during investigation.
                </p>
              </div>

              {/* Section 8: Confidence Score */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">8</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Confidence Score
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  The confidence score represents how certain the model is about the predicted integrity state.
                </p>
                <p className="text-xs sm:text-sm text-slate-300">
                  It is not a measure of surveillance quality.
                </p>
                <p className="text-xs text-slate-400">
                  A high confidence simply indicates that the observed characteristics closely match the learned pattern for the predicted class.
                </p>
              </div>

              {/* Section 9: Recommended Action */}
              <div className="space-y-3 bg-blue-950/20 p-5 rounded-2xl border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-mono font-bold">9</span>
                  <h4 className="text-base font-bold text-white font-['SF_Pro_Display']">
                    Recommended Action
                  </h4>
                </div>
                <p className="text-xs text-slate-300 font-medium">Based on this prediction:</p>

                <ul className="space-y-2 text-xs font-mono text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Review the captured frame.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Continue with detailed forensic analysis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Inspect the affected camera physically if available.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Compare with previous observations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Archive the forensic report if confirmation is required.</span>
                  </li>
                </ul>
              </div>

              {/* Section 10: Important Note */}
              <div className="space-y-2 bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono font-bold text-[10px]">10</span>
                  <h4 className="font-bold text-amber-300 font-['SF_Pro_Display']">Important Note</h4>
                </div>
                <p className="leading-relaxed text-slate-300">
                  SpectraGuard is an operator decision-support platform. Predictions should be interpreted together with operational context, forensic evidence, and standard security procedures before taking corrective action.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-['SF_Pro_Text'] shrink-0">
              <div className="text-slate-400 text-center sm:text-left">
                <p className="font-bold text-white">Need more technical details?</p>
                <p className="text-[11px]">View the complete Frequency-Domain Analysis Report or continue to the Forensics page for detailed evidence visualizations.</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {onNavigateToForensics && (
                  <button
                    onClick={() => {
                      setIsDocsModalOpen(false);
                      onNavigateToForensics();
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-600/30 text-xs"
                  >
                    <span>View Forensics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsDocsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: Expanded FFT Frequency Spectrum Inspection Modal */}
      {isFftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden font-['SF_Pro_Text'] max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 px-6 border-b border-white/10 bg-slate-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['SF_Pro_Display'] tracking-tight flex items-center gap-2">
                    <span>Fast Fourier Transform (FFT) Frequency Inspection</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                      {selectedTimeRange} Range
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Camera ID: {cameraData.id} • {cameraData.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFftModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Time Range Selector */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono">Time Window Filter:</span>
                <div className="flex items-center gap-2">
                  {(['Full', '0-5s', '5-15s', '15-22s'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedTimeRange === range
                          ? isTampered
                            ? 'bg-rose-600 text-white shadow-lg'
                            : 'bg-cyan-600 text-white shadow-lg'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Expanded FFT Curve Graph */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/15 space-y-3 shadow-2xl relative">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-2">
                  <span>SPECTRAL MAGNITUDE SPECTRUM (0 Hz - 500 Hz)</span>
                  <span className="text-cyan-300">Res: 0.5 Hz / Bin</span>
                </div>

                <div className="relative w-full h-56 my-2 bg-black/40 rounded-xl p-4 border border-white/5">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    ))}
                    {[0, 100, 200, 300, 400, 500].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    ))}

                    {/* Area fill */}
                    <path
                      d={`${getGraphPath()} L 500,100 L 0,100 Z`}
                      fill={`url(#${isTampered ? 'tamperedGraphFill' : 'nominalGraphFill'})`}
                      opacity="0.6"
                    />

                    {/* Main Curve */}
                    <path
                      d={getGraphPath()}
                      fill="none"
                      stroke={isTampered ? '#f43f5e' : '#38bdf8'}
                      strokeWidth="2.5"
                      className="transition-all duration-500"
                    />

                    {/* Highlighted Peak Point if in Full mode */}
                    {selectedTimeRange === 'Full' && (
                      isTampered ? (
                        <>
                          <circle cx="320" cy="15" r="6" fill="#f43f5e" className="animate-ping opacity-75" />
                          <circle cx="320" cy="15" r="4" fill="#f43f5e" />
                        </>
                      ) : (
                        <>
                          <circle cx="120" cy="38" r="5" fill="#38bdf8" className="animate-pulse" />
                        </>
                      )
                    )}
                  </svg>

                  {/* Callout in Full mode */}
                  {selectedTimeRange === 'Full' && (
                    <div 
                      style={{ left: isTampered ? '64%' : '24%' }}
                      className={`absolute top-2 -translate-x-1/2 text-xs font-bold font-mono px-3 py-1 rounded-xl shadow-2xl border border-white/20 animate-pulse ${
                        isTampered ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white'
                      }`}
                    >
                      {isTampered ? 'Anomaly Peak (320Hz • 0.95 Mag)' : 'Harmonics Nominal (120Hz • 0.62 Mag)'}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xs font-mono text-slate-500 pt-1">
                  <span>0 Hz</span>
                  <span>100 Hz</span>
                  <span>200 Hz</span>
                  <span>300 Hz</span>
                  <span>400 Hz</span>
                  <span>500 Hz</span>
                </div>
              </div>

              {/* Band breakdown stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-1">
                  <span className="text-slate-400 block">Low Freq (0 - 100Hz)</span>
                  <span className="text-lg font-bold text-white block">0.240 Mag</span>
                  <span className="text-[10px] text-emerald-400">Baseline Pass</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-1">
                  <span className="text-slate-400 block">Mid Freq (100 - 300Hz)</span>
                  <span className="text-lg font-bold text-white block">
                    {isTampered ? '0.890 Mag' : '0.620 Mag'}
                  </span>
                  <span className={`text-[10px] ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isTampered ? 'High Energy Spike' : 'Nominal Power'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs space-y-1">
                  <span className="text-slate-400 block">High Freq (300 - 500Hz)</span>
                  <span className="text-lg font-bold text-white block">
                    {isTampered ? '0.950 Mag' : '0.110 Mag'}
                  </span>
                  <span className={`text-[10px] ${isTampered ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isTampered ? 'Distortion Peak (320Hz)' : 'Noise Floor Normal'}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 px-6 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
              <span>FFT Spectrum Filter Window: {selectedTimeRange}</span>
              <button
                onClick={() => setIsFftModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
