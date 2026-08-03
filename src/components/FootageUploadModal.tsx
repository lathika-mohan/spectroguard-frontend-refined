import React, { useState, useRef } from 'react';
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
import { PredictionService } from '../services/predictionService';

interface FootageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string | null;
  fileObj: File | null;
  onRunPrediction: (predictionId: string) => void;
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
  const [statusMessage, setStatusMessage] = useState<string>('Uploading evidence...');
  const [selectedFile, setSelectedFile] = useState<File | null>(fileObj);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected file when props change
  React.useEffect(() => {
    setSelectedFile(fileObj);
    setErrorMessage(null);
  }, [fileObj, isOpen]);

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

  // Cycle professional loading messages
  React.useEffect(() => {
    if (!isAnalyzing) return;

    const messages = [
      'Uploading evidence...',
      'Extracting frames...',
      'Computing FFT signatures...',
      'Running production model...',
      'Generating explanation...',
      'Preparing results...',
    ];

    let currentIdx = 0;
    const messageInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % messages.length;
      setStatusMessage(messages[currentIdx]);
    }, 1200);

    return () => clearInterval(messageInterval);
  }, [isAnalyzing]);

  // Smooth indeterminate sweep for the progress bar
  React.useEffect(() => {
    if (!isAnalyzing) return;

    let direction = 1;
    let val = 30;
    const progressInterval = setInterval(() => {
      val += direction * 4;
      if (val >= 92) {
        direction = -1;
      } else if (val <= 20) {
        direction = 1;
      }
      setProgress(val);
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAnalyzing]);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    // 1. Double-click protection & validation
    if (isAnalyzing || !selectedFile || !footageName.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setProgress(15);
    setStatusMessage('Uploading evidence...');

    try {
      // 2. Perform the actual prediction pipeline run via service
      const session = await PredictionService.predict(selectedFile);
      
      // 3. Inference completed successfully
      setProgress(100);
      setStatusMessage('Prediction complete! Redirecting...');
      
      setTimeout(() => {
        setIsAnalyzing(false);
        onRunPrediction(session.prediction_id);
      }, 500);

    } catch (err: any) {
      console.error('Prediction request failed:', err);
      setErrorMessage(err.message || 'Verification failure. Connection to the security core was lost.');
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnalyzing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent accidental form submissions via Enter/Space during active analysis
    if (isAnalyzing && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-['SF_Pro_Text'] text-white"
      onClick={() => {
        if (!isAnalyzing) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="relative w-full max-w-lg liquid-glass-card rounded-2xl border border-white/20 bg-[#030712]/95 shadow-2xl p-6 space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDrop={handleDrop}
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
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* File Dropzone/Loader */}
        {!selectedFile ? (
          <div 
            className="p-6 rounded-xl border border-dashed border-white/25 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-8 h-8 text-blue-400 animate-pulse" />
            <p className="text-xs font-bold text-slate-300">Drag & drop video file or click to browse</p>
            <p className="text-[10px] text-slate-500 font-mono">Supported formats: MP4, AVI, MOV, JPG, PNG</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                  setErrorMessage(null);
                }
              }}
            />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white font-['SF_Pro_Display'] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {`${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • File Loaded`}
                </p>
              </div>
            </div>
            
            {!isAnalyzing && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-400 text-[10px] font-mono hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        )}

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
              className="w-full bg-white/5 border border-white/15 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-['SF_Pro_Text'] disabled:opacity-50"
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
              className="w-full bg-slate-900 border border-white/15 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-['SF_Pro_Text'] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full bg-white/5 border border-blue-500/40 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-['SF_Pro_Text'] mt-2 animate-fadeIn disabled:opacity-50"
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
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !selectedFile || !footageName.trim()}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 cursor-pointer font-['SF_Pro_Text'] disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isAnalyzing ? 'Analyzing Footage...' : 'Run Prediction'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
