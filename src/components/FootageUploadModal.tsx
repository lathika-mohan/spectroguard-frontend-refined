import React, { useState } from 'react';
import type { CameraFeedItem } from '../types';
import { 
  X, 
  Video, 
  UploadCloud, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  Sliders 
} from 'lucide-react';

interface FootageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string | null;
  fileObj: File | null;
  onRunPrediction: (newCamera: CameraFeedItem) => void;
}

export const FootageUploadModal: React.FC<FootageUploadModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileObj,
  onRunPrediction
}) => {
  const [footageName, setFootageName] = useState<string>('');
  const [locationZone, setLocationZone] = useState<string>('Main Building');
  const [customLocationZone, setCustomLocationZone] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Preparing footage frames...');

  // Pre-fill footage name when modal opens
  React.useEffect(() => {
    if (fileName) {
      const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      setFootageName(capitalized || 'Main Entrance Channel 01');
    } else {
      setFootageName('Main Lobby Entrance Feed');
    }
    setIsAnalyzing(false);
    setProgress(0);
  }, [fileName, isOpen]);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    if (!footageName.trim()) return;

    setIsAnalyzing(true);
    setProgress(10);
    setStatusMessage('Extracting video frames and keypoints...');

    const steps = [
      { p: 30, msg: 'Analyzing sub-pixel luminance variations...' },
      { p: 60, msg: 'Checking optical stability and noise ratio...' },
      { p: 85, msg: 'Verifying AI frame frequency integrity...' },
      { p: 100, msg: 'Prediction complete! Generating report...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusMessage(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Generate new camera record
          const camId = `CAM-${Math.floor(100 + Math.random() * 899)}`;
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          const finalZone = locationZone === 'Other / Custom...' 
            ? (customLocationZone.trim() || 'Custom Zone') 
            : locationZone;

          const newCamera: CameraFeedItem = {
            id: camId,
            name: footageName.trim(),
            location: footageName.trim(),
            building: finalZone,
            status: 'Online',
            integrityScore: 98,
            integrityStatus: 'Nominal',
            resolution: '1920 x 1080',
            frameRate: '30 FPS',
            codec: 'H.264',
            lastUpdated: 'Just now',
            lastPrediction: 'Just now',
            connection: 'Stable',
            stream: 'Active',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
            timestamp: timeStr,
            predictionDetail: 'AI Sub-pixel optical integrity verification complete. No frame tampering or lens occlusion detected.',
            historyScores: [
              { label: 'May 24', score: 96 },
              { label: 'May 25', score: 97 },
              { label: 'May 26', score: 98 },
              { label: 'May 27', score: 98 },
              { label: 'May 28', score: 99 },
              { label: 'May 29', score: 98 },
              { label: 'May 30', score: 98 },
            ]
          };

          onRunPrediction(newCamera);
        }, 400);
      }
    }, 380);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['SF_Pro_Text'] text-white"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg liquid-glass-card rounded-2xl border border-white/20 bg-[#030712]/95 shadow-2xl p-6 space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['SF_Pro_Display']">
                On-Demand Footage Verification
              </h3>
              <p className="text-xs text-slate-400 font-['SF_Pro_Text']">
                Configure parameters before running AI prediction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Info Box */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white font-['SF_Pro_Display'] truncate">
                {fileName || 'cctv_surveillance_feed.mp4'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono">
                {fileObj ? `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB • File Loaded` : 'Ready for analysis'}
              </p>
            </div>
          </div>
          
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30 shrink-0 font-mono">
            MP4 / H.264
          </span>
        </div>

        {/* Input Form Controls */}
        <div className="space-y-4 text-xs font-['SF_Pro_Text']">
          
          {/* Footage Name Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold font-['SF_Pro_Display']">
              Footage / Camera Name
            </label>
            <input
              type="text"
              value={footageName}
              onChange={(e) => setFootageName(e.target.value)}
              placeholder="e.g. Lobby Entrance Channel 01"
              disabled={isAnalyzing}
              className="w-full bg-white/5 border border-white/15 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-['SF_Pro_Text']"
            />
          </div>

          {/* Location Zone Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold font-['SF_Pro_Display']">
              Location / Zone
            </label>
            <select
              value={locationZone}
              onChange={(e) => setLocationZone(e.target.value)}
              disabled={isAnalyzing}
              className="w-full bg-slate-900 border border-white/15 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-['SF_Pro_Text'] cursor-pointer"
            >
              <option value="Main Building">Main Building</option>
              <option value="East Wing">East Wing</option>
              <option value="Warehouse">Warehouse</option>
              <option value="IT Section">IT Section</option>
              <option value="Factory Floor">Factory Floor</option>
              <option value="West Wing">West Wing</option>
              <option value="Other / Custom...">Other / Custom...</option>
            </select>

            {locationZone === 'Other / Custom...' && (
              <input
                type="text"
                value={customLocationZone}
                onChange={(e) => setCustomLocationZone(e.target.value)}
                placeholder="Enter custom location or zone (e.g. Loading Bay #4)"
                disabled={isAnalyzing}
                className="w-full bg-white/5 border border-blue-500/40 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-['SF_Pro_Text'] mt-2 animate-fadeIn"
              />
            )}
          </div>

        </div>

        {/* Analysis Progress Overlay (when active) */}
        {isAnalyzing && (
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-300 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                {statusMessage}
              </span>
              <span className="text-white font-bold">{progress}%</span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !footageName.trim()}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 cursor-pointer font-['SF_Pro_Text']"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isAnalyzing ? 'Analyzing Footage...' : 'Run Prediction'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
