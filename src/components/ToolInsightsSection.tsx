import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Video,
  X
} from 'lucide-react';
import type { AITool } from '../types';

// Helper component for 3D glass press push effect and dark blue flow on hover
const GlassPressCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}> = ({ children, className = '', onClick, id }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState({ x: 0.5, y: 0.5, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setCursorState({ x: relX, y: relY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setCursorState({ x: 0.5, y: 0.5, isHovered: false });
  };

  const centerOffsetX = (cursorState.x - 0.5) * 2;
  const centerOffsetY = (cursorState.y - 0.5) * 2;
  const maxRotateDeg = 5;
  const rotateX = cursorState.isHovered ? centerOffsetY * maxRotateDeg : 0;
  const rotateY = cursorState.isHovered ? -centerOffsetX * maxRotateDeg : 0;

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: cursorState.isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-4px) scale3d(0.99, 0.99, 0.99)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: cursorState.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: cursorState.isHovered
          ? `inset ${centerOffsetX * 10}px ${centerOffsetY * 10}px 20px rgba(0, 0, 0, 0.8), 0 10px 25px -8px rgba(15, 23, 42, 0.7), 0 0 20px rgba(30, 58, 138, 0.3)`
          : undefined,
      }}
      className={`group relative liquid-glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
        cursorState.isHovered ? 'border-blue-600/60' : 'border-white/10'
      } ${className}`}
    >
      {/* 3D Dark Blue Cursor Press Flow Spotlight */}
      {cursorState.isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 200px at ${cursorState.x * 100}% ${cursorState.y * 100}%, rgba(30, 58, 138, 0.4) 0%, rgba(29, 78, 216, 0.15) 45%, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-20 w-full h-full">{children}</div>
    </div>
  );
};

interface ToolInsightsSectionProps {
  onSelectTool?: (tool: AITool) => void;
  onViewAllRecentlyAdded?: () => void;
}

export const ToolInsightsSection: React.FC<ToolInsightsSectionProps> = ({
  onSelectTool: _onSelectTool,
  onViewAllRecentlyAdded,
}) => {
  // On-Demand Verification Interactive State
  const [verificationState, setVerificationState] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isEventsModalOpen, setIsEventsModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timeline events for "Recent Camera Activity"
  const recentActivityEvents = [
    {
      id: 'act-1',
      time: '09:42 AM',
      camera: 'Lobby Entrance',
      status: 'Integrity Verified',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Camera operating normally.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'act-2',
      time: '09:37 AM',
      camera: 'Warehouse Gate',
      status: 'Blur Detected',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Optical degradation detected.',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'act-3',
      time: '09:31 AM',
      camera: 'Parking Zone B',
      status: 'Lens Obstruction',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Immediate inspection recommended.',
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'act-4',
      time: '09:25 AM',
      camera: 'Main Corridor',
      status: 'Integrity Verified',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'No anomalies detected.',
      imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'act-5',
      time: '09:18 AM',
      camera: 'Server Room',
      status: 'Signal Restored',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: 'Camera connection successfully re-established.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Integrity Events Data for Section 3
  const integrityEvents = [
    {
      id: 'evt-1',
      time: '09:41 AM',
      cameraName: 'Lobby Entrance',
      status: 'Tampering Suspected',
      dot: '🔴',
      statusStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      relativeTime: '2 min ago',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'evt-2',
      time: '09:32 AM',
      cameraName: 'Warehouse Gate',
      status: 'Blur Detected',
      dot: '🟡',
      statusStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      relativeTime: '10 min ago',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'evt-3',
      time: '09:14 AM',
      cameraName: 'Main Corridor',
      status: 'Nominal',
      dot: '🟢',
      statusStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      relativeTime: '28 min ago',
      imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'evt-4',
      time: '08:58 AM',
      cameraName: 'Parking Zone B',
      status: 'Integrity Restored',
      dot: '🟢',
      statusStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      relativeTime: '44 min ago',
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Handle file select and trigger prediction simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setFileError('');
    }
  };

  const handleRunPrediction = () => {
    if (!uploadedFileName) {
      setFileError('Please select or upload a video file first to run prediction.');
      return;
    }
    setFileError('');
    setVerificationState('uploading');
    setAnalysisProgress(10);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerificationState('complete');
          return 100;
        }
        return prev + 18;
      });
    }, 280);
  };

  const handleResetVerification = () => {
    setVerificationState('idle');
    setAnalysisProgress(0);
    setUploadedFileName(null);
    setFileError('');
  };

  return (
    <div id="operational-overview-and-recently-added" className="space-y-8 pt-2">
      {/* SECTION 2: OPERATIONAL OVERVIEW */}
      <div id="operational-overview-section" className="space-y-6">
        
        {/* Section Header: Title & Subtitle */}
        <div className="flex flex-col border-b border-white/10 pb-3 gap-0.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['SF_Pro_Display'] flex items-center gap-2">
            <span>Operational Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-['SF_Pro_Text']">
            Live operational intelligence across the surveillance network.
          </p>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: System Integrity */}
          <GlassPressCard className="p-4 cursor-pointer" id="kpi-system-integrity">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">System Integrity</span>
            <div className="flex items-baseline gap-2 mt-1 mb-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">98.6%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-['SF_Pro_Text']">
              <span className="text-slate-400">Overall camera integrity</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Excellent
              </span>
            </div>
          </GlassPressCard>

          {/* Card 2: Active Cameras */}
          <GlassPressCard className="p-4 cursor-pointer" id="kpi-active-cameras">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Active Cameras</span>
            <div className="flex items-baseline gap-2 mt-1 mb-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">24</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-['SF_Pro_Text']">
              <span className="text-slate-400">Currently monitored</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                All cameras online
              </span>
            </div>
          </GlassPressCard>

          {/* Card 3: Integrity Alerts */}
          <GlassPressCard className="p-4 cursor-pointer" id="kpi-integrity-alerts">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Integrity Alerts</span>
            <div className="flex items-baseline gap-2 mt-1 mb-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">2</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-['SF_Pro_Text']">
              <span className="text-slate-400">Require investigation</span>
              <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                High Priority
              </span>
            </div>
          </GlassPressCard>

          {/* Card 4: Predictions Today */}
          <GlassPressCard className="p-4 cursor-pointer" id="kpi-predictions-today">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Predictions Today</span>
            <div className="flex items-baseline gap-2 mt-1 mb-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">18</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-['SF_Pro_Text']">
              <span className="text-slate-400">Completed analyses</span>
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Updated 2 min ago
              </span>
            </div>
          </GlassPressCard>

        </div>

        {/* Main Operational Grid: Recent Camera Activity (Left 7 cols) + On-Demand Verification (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Large Card: Recent Camera Activity (7 cols) */}
          <div className="lg:col-span-7">
            <GlassPressCard className="p-5 flex flex-col justify-between h-full space-y-4" id="recent-camera-activity-card">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Recent Camera Activity</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Timeline</span>
              </div>

              {/* Event List / Timeline */}
              <div className="space-y-3.5 divide-y divide-white/5">
                {recentActivityEvents.map((event) => (
                  <div key={event.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group/event">
                    
                    {/* Time, Icon & Camera Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-slate-400 shrink-0 w-16">
                        {event.time}
                      </span>

                      {/* Cinematic Surveillance Scene Image */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-slate-900 relative group-hover/event:border-blue-500/60 transition-colors">
                        <img
                          src={event.imageUrl}
                          alt={event.camera}
                          className="w-full h-full object-cover saturate-[0.7] contrast-[1.15] brightness-[0.85] group-hover/event:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply pointer-events-none" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white font-['SF_Pro_Display'] group-hover/event:text-blue-300 transition-colors">
                          {event.camera}
                        </h4>
                        <p className="text-xs text-slate-400 font-['SF_Pro_Text']">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 self-start sm:self-center pl-19 sm:pl-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${event.statusColor}`}>
                        {event.status}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </GlassPressCard>
          </div>

          {/* Right Large Card: On-Demand Verification (5 cols) */}
          <div className="lg:col-span-5">
            <GlassPressCard className="p-5 flex flex-col justify-between h-full space-y-4" id="on-demand-verification-card">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>On-Demand Verification</span>
                </h3>
                <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  AI Module
                </span>
              </div>

              {/* Dynamic State 1: IDLE */}
              {verificationState === 'idle' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
                  
                  {/* Invisible file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />

                  {uploadedFileName ? (
                    <div className="w-full p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white font-['SF_Pro_Display'] truncate">
                            {uploadedFileName}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-mono font-medium">
                            Ready for AI Prediction
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline shrink-0"
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    /* Drag & Drop Area */
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-2xl p-5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      
                      <span className="text-sm font-bold text-white font-['SF_Pro_Display']">
                        Upload Video / Evidence Clip
                      </span>
                      <span className="text-xs text-blue-400 font-semibold underline underline-offset-2">
                        Click to Browse File
                      </span>
                      
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Supported formats: MP4 • AVI • MOV • PNG • JPG
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 font-['SF_Pro_Text'] max-w-xs">
                    Upload surveillance evidence to perform AI-powered camera integrity prediction.
                  </p>

                  {fileError && (
                    <div className="w-full p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-['SF_Pro_Text'] font-semibold">
                      {fileError}
                    </div>
                  )}

                  <button
                    onClick={() => handleRunPrediction()}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-['SF_Pro_Text'] shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Run Prediction</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

              {/* Dynamic State 2: UPLOADING / ANALYZING */}
              {verificationState === 'uploading' && (
                <div className="flex flex-col items-center justify-center text-center space-y-5 py-6">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                    <Camera className="w-6 h-6 text-blue-400" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white font-['SF_Pro_Display']">
                      Uploading & Analyzing...
                    </h4>
                    <p className="text-xs text-blue-400 font-mono">
                      {analysisProgress < 40 
                        ? 'Uploading file...' 
                        : analysisProgress < 80 
                        ? 'Analyzing Frequency Domain...' 
                        : 'Running Integrity Prediction...'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full space-y-1">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-300" 
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{uploadedFileName}</span>
                      <span>{analysisProgress}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic State 3: PREDICTION COMPLETE */}
              {verificationState === 'complete' && (
                <div className="flex flex-col justify-between space-y-4 py-2">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-['SF_Pro_Display'] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Prediction Complete
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Just Now</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-['SF_Pro_Text']">Integrity Status</span>
                        <span className="text-base font-extrabold text-white font-['SF_Pro_Display']">Nominal</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-['SF_Pro_Text']">Confidence</span>
                        <span className="text-base font-extrabold text-emerald-400 font-mono">98.7%</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-['SF_Pro_Text'] leading-relaxed">
                    Frequency domain inspection confirmed baseline optical clarity and zero frame tampering detected.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => alert('Opening detailed forensic report...')}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-['SF_Pro_Text'] shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>View Forensic Analysis →</span>
                    </button>

                    <button
                      onClick={handleResetVerification}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold font-['SF_Pro_Text'] transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Analyze Another Evidence Clip</span>
                    </button>
                  </div>
                </div>
              )}

            </GlassPressCard>
          </div>

        </div>
      </div>

      {/* SECTION 3: RECENT INTEGRITY EVENTS */}
      <div id="recent-integrity-events-section" className="space-y-4 pt-4 border-t border-white/10">
        {/* Section Header: Title & View All Events Link */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['SF_Pro_Display'] flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Recent Integrity Events</span>
          </h2>

          <button
            onClick={() => {
              setIsEventsModalOpen(true);
              if (onViewAllRecentlyAdded) onViewAllRecentlyAdded();
            }}
            className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-['SF_Pro_Text'] cursor-pointer"
            id="view-all-events-btn"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Event Table Feed */}
        <div className="space-y-2.5">
          {integrityEvents.map((evt) => (
            <GlassPressCard
              key={evt.id}
              id={`integrity-event-${evt.id}`}
              onClick={() => alert(`Opening surveillance event logs for ${evt.cameraName}...`)}
              className="p-3.5 sm:p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm font-['SF_Pro_Text']">
                
                {/* Left: Event Time, CCTV Camera Icon & Camera Name */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Event Time */}
                  <span className="text-xs font-mono font-semibold text-slate-400 shrink-0 w-16 sm:w-20">
                    {evt.time}
                  </span>

                  {/* CCTV Surveillance Camera Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:border-blue-400/60 group-hover:bg-blue-500/20 transition-all shadow-sm">
                    <Camera className="w-5 h-5 text-blue-400" />
                  </div>

                  {/* Camera Name */}
                  <span className="font-bold text-white font-['SF_Pro_Display'] truncate">
                    {evt.cameraName}
                  </span>
                </div>

                {/* Middle: Status Pill with Enterprise Accent Colors */}
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${evt.statusStyle}`}>
                    <span className="text-[9px]">{evt.dot}</span>
                    <span>{evt.status}</span>
                  </span>
                </div>

                {/* Right: Relative Time */}
                <div className="text-right shrink-0 w-20 sm:w-24">
                  <span className="text-xs font-mono text-slate-400">
                    {evt.relativeTime}
                  </span>
                </div>

              </div>
            </GlassPressCard>
          ))}
        </div>
      </div>

      {/* View All Events In-Page Pop-Up Modal */}
      {isEventsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsEventsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col liquid-glass-card rounded-2xl border border-white/20 bg-[#030712]/95 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['SF_Pro_Display']">
                    All Surveillance Integrity Events
                  </h3>
                  <p className="text-xs text-slate-400 font-['SF_Pro_Text']">
                    Real-time audit log across all 32 connected camera feeds
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEventsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                id="close-events-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Events List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {[
                {
                  id: 'modal-evt-1',
                  time: '09:41 AM',
                  cameraName: 'Lobby Entrance (CAM-01)',
                  status: 'Tampering Suspected',
                  dot: '🔴',
                  statusStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
                  relativeTime: '2 min ago',
                  details: 'Sudden luminance variation detected on channel 01.'
                },
                {
                  id: 'modal-evt-2',
                  time: '09:32 AM',
                  cameraName: 'Warehouse Gate (CAM-02)',
                  status: 'Blur Detected',
                  dot: '🟡',
                  statusStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                  relativeTime: '10 min ago',
                  details: 'Focus degradation flag triggered in sub-pixel check.'
                },
                {
                  id: 'modal-evt-3',
                  time: '09:14 AM',
                  cameraName: 'Main Corridor (CAM-04)',
                  status: 'Nominal',
                  dot: '🟢',
                  statusStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  relativeTime: '28 min ago',
                  details: 'Frame frequency check passed. No anomalies.'
                },
                {
                  id: 'modal-evt-4',
                  time: '08:55 AM',
                  cameraName: 'Parking Zone B (CAM-03)',
                  status: 'Lens Obstruction',
                  dot: '🔴',
                  statusStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
                  relativeTime: '47 min ago',
                  details: 'Partial lens blocking flag identified at 08:55:12.'
                },
                {
                  id: 'modal-evt-5',
                  time: '08:30 AM',
                  cameraName: 'Server Room (CAM-05)',
                  status: 'Signal Restored',
                  dot: '🔵',
                  statusStyle: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
                  relativeTime: '1 hr ago',
                  details: 'Re-established sync after brief power cycle.'
                },
                {
                  id: 'modal-evt-6',
                  time: '08:12 AM',
                  cameraName: 'Substation B-West (CAM-19)',
                  status: 'Nominal',
                  dot: '🟢',
                  statusStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  relativeTime: '1.5 hrs ago',
                  details: 'Automated 12-hour optical integrity scan passed.'
                },
                {
                  id: 'modal-evt-7',
                  time: '07:45 AM',
                  cameraName: 'Perimeter Fence South (CAM-08)',
                  status: 'Motion Anomaly',
                  dot: '🟡',
                  statusStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                  relativeTime: '2 hrs ago',
                  details: 'High-frequency vibration detected along perimeter mount.'
                },
                {
                  id: 'modal-evt-8',
                  time: '07:10 AM',
                  cameraName: 'Loading Dock C (CAM-12)',
                  status: 'Nominal',
                  dot: '🟢',
                  statusStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  relativeTime: '2.5 hrs ago',
                  details: 'Optical clarity verified at 99.7% efficiency.'
                }
              ].map((evt) => (
                <div 
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-['SF_Pro_Text']"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 sm:mt-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white font-['SF_Pro_Display']">
                          {evt.cameraName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          • {evt.time} ({evt.relativeTime})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-['SF_Pro_Text'] mt-0.5">
                        {evt.details}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-start sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${evt.statusStyle}`}>
                      <span className="text-[9px]">{evt.dot}</span>
                      <span>{evt.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0 font-['SF_Pro_Text']">
              <span>Showing all 8 surveillance integrity logs</span>
              <button
                onClick={() => setIsEventsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

