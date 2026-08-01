import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useEvents } from '../hooks/useEvents';
import { 
  Camera, 
  UploadCloud, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
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
  const navigate = useNavigate();

  // Load metrics and events from backend APIs
  const { summary, isLoading: summaryLoading, error: summaryError } = useDashboardSummary();
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents();

  // On-Demand Verification Interactive State (Prepared for Phase 2)
  const [verificationState, setVerificationState] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isEventsModalOpen, setIsEventsModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to map dynamic camera thumbnails based on camera name
  const getCameraImageByName = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('lobby')) {
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80';
    }
    if (n.includes('warehouse') || n.includes('gate')) {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=100&q=80';
    }
    if (n.includes('parking') || n.includes('zone')) {
      return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=100&q=80';
    }
    if (n.includes('server') || n.includes('room')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=100&q=80';
    }
    return 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=100&q=80';
  };

  // Helper for event status color mapping
  const getEventStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'online' || s === 'nominal' || s === 'verified' || s === 'healthy') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (s === 'anomalous' || s === 'critical' || s === 'error' || s === 'tampering suspected' || s === 'tamper' || s === 'blur detected' || s === 'lens obstruction') {
      return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const getEventDot = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'online' || s === 'nominal' || s === 'verified' || s === 'healthy') return '🟢';
    if (s === 'anomalous' || s === 'critical' || s === 'error' || s === 'tampering suspected' || s === 'tamper' || s === 'blur detected' || s === 'lens obstruction') return '🔴';
    return '🟡';
  };

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
    // Staging area prepared for Phase 2 integration
    console.info('On-demand prediction triggered for:', uploadedFileName);
  };

  const handleResetVerification = () => {
    setVerificationState('idle');
    setAnalysisProgress(0);
    setUploadedFileName(null);
    setFileError('');
  };

  return (
    <div id="operational-overview-and-recently-added" className="space-y-8 pt-2 text-white">
      {/* SECTION 2: OPERATIONAL OVERVIEW */}
      <div id="operational-overview-section" className="space-y-6">
        
        {/* Section Header: Title & Subtitle */}
        <div className="flex flex-col border-b border-white/10 pb-3 gap-0.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sf-display flex items-center gap-2">
            <span>Operational Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sf-text">
            Live operational intelligence across the surveillance network.
          </p>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryLoading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))
          ) : summaryError ? (
            <div className="col-span-full py-4 text-center text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
              Failed to load summary stats: {summaryError}
            </div>
          ) : summary ? (
            <>
              {/* Card 1: System Integrity */}
              <GlassPressCard className="p-4" id="kpi-system-integrity">
                <span className="text-xs text-slate-400 font-medium font-sf-text">System Integrity</span>
                <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-sf-display">
                    {(summary.systemIntegrity * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-sf-text">
                  <span className="text-slate-400">Overall camera integrity</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Nominal
                  </span>
                </div>
              </GlassPressCard>

              {/* Card 2: Active Cameras */}
              <GlassPressCard className="p-4" id="kpi-active-cameras">
                <span className="text-xs text-slate-400 font-medium font-sf-text">Active Cameras</span>
                <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-sf-display">
                    {summary.activeCameras}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-sf-text">
                  <span className="text-slate-400">Monitored feeds</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Live Feeds
                  </span>
                </div>
              </GlassPressCard>

              {/* Card 3: Integrity Alerts */}
              <GlassPressCard className="p-4" id="kpi-integrity-alerts">
                <span className="text-xs text-slate-400 font-medium font-sf-text">Integrity Alerts</span>
                <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-sf-display ${summary.integrityAlerts > 0 ? 'text-rose-400' : 'text-white'}`}>
                    {summary.integrityAlerts}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-sf-text">
                  <span className="text-slate-400">Require investigation</span>
                  {summary.integrityAlerts > 0 ? (
                    <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      High Priority
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Clear
                    </span>
                  )}
                </div>
              </GlassPressCard>

              {/* Card 4: Predictions Today */}
              <GlassPressCard className="p-4" id="kpi-predictions-today">
                <span className="text-xs text-slate-400 font-medium font-sf-text">Predictions Today</span>
                <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-sf-display">
                    {summary.predictionsToday}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-sf-text">
                  <span className="text-slate-400">Completed analyses</span>
                  <span className="text-emerald-400 font-bold font-mono flex items-center gap-1 text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Live Core
                  </span>
                </div>
              </GlassPressCard>
            </>
          ) : null}
        </div>

        {/* Main Operational Grid: Recent Camera Activity (Left 7 cols) + On-Demand Verification (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Large Card: Recent Camera Activity (7 cols) */}
          <div className="lg:col-span-7">
            <GlassPressCard className="p-5 flex flex-col justify-between h-full space-y-4" id="recent-camera-activity-card">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-sf-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Recent Camera Activity</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Timeline</span>
              </div>

              {/* Event List / Timeline */}
              {eventsLoading ? (
                <div className="space-y-3.5 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 bg-white/5 rounded-xl" />
                  ))}
                </div>
              ) : eventsError ? (
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center font-sf-text">
                  Failed to load camera activity: {eventsError}
                </div>
              ) : events.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center text-slate-400 text-xs font-semibold font-sf-text">
                  No camera activities recorded.
                </div>
              ) : (
                <div className="space-y-3.5 divide-y divide-white/5">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group/event">
                      
                      {/* Time, Icon & Camera Name */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-medium text-slate-400 shrink-0 w-16">
                          {event.time || event.timestamp || 'Live'}
                        </span>

                        {/* Cinematic Surveillance Scene Image */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-slate-900 relative group-hover/event:border-blue-500/60 transition-colors">
                          <img
                            src={event.imageUrl || getCameraImageByName(event.camera || event.cameraName || '')}
                            alt={event.camera || event.cameraName}
                            className="w-full h-full object-cover saturate-[0.7] contrast-[1.15] brightness-[0.85] group-hover/event:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply pointer-events-none" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white font-sf-display group-hover/event:text-blue-300 transition-colors">
                            {event.camera || event.cameraName || 'CCTV Stream'}
                          </h4>
                          <p className="text-xs text-slate-400 font-sf-text">
                            {event.event || event.description || 'Surveillance system event check.'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 self-start sm:self-center pl-19 sm:pl-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getEventStatusStyle(event.status)}`}>
                          {event.status}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </GlassPressCard>
          </div>

          {/* Right Large Card: On-Demand Verification (5 cols) */}
          <div className="lg:col-span-5">
            <GlassPressCard className="p-5 flex flex-col justify-between h-full space-y-4" id="on-demand-verification-card">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-sf-display flex items-center gap-2">
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

                  <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white font-sf-display">Upload surveillance evidence</p>
                    <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-sf-text">
                      Supports video clips (.mp4) and frame snapshots (.png, .jpg)
                    </p>
                  </div>

                  <div className="flex flex-col w-full gap-2 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Choose Local File
                    </button>
                    
                    {uploadedFileName && (
                      <div className="text-xs font-mono text-slate-300 truncate max-w-full px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>Ready: {uploadedFileName}</span>
                      </div>
                    )}

                    <button
                      onClick={handleRunPrediction}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-650/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      Run Prediction
                    </button>
                  </div>
                  
                  {fileError && <p className="text-rose-400 text-xs font-semibold">{fileError}</p>}
                </div>
              )}

              {/* Dynamic State 2: UPLOADING / PROCESSING */}
              {verificationState === 'uploading' && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Pulsing circular outer rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>

                  <div className="space-y-1.5 w-full max-w-[240px]">
                    <p className="text-sm font-bold text-white font-sf-display">Running physics validations...</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-sf-text">
                      Analyzing pixel variance and spectral clarity.
                    </p>
                  </div>

                  {/* Operational Ingest Progress Bar */}
                  <div className="w-full space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>SECURE INGEST</span>
                      <span>{analysisProgress}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic State 3: COMPLETE */}
              {verificationState === 'complete' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                    <ShieldCheck className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white font-sf-display">Verification Complete</p>
                    <p className="text-xs text-slate-400 font-sf-text">
                      Analysis report successfully compiled.
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2.5 p-3.5 rounded-xl border border-white/10 bg-white/5 text-left text-xs font-sf-text">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Clarity Rating</span>
                      <span className="text-base font-extrabold text-white font-sf-display">Nominal</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Confidence</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">98.2%</span>
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-2 pt-2">
                    <button
                      onClick={handleResetVerification}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Submit Another File
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
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sf-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Recent Integrity Events</span>
          </h2>

          <button
            onClick={() => setIsEventsModalOpen(true)}
            className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-sf-text cursor-pointer"
            id="view-all-events-btn"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Event Table Feed */}
        {eventsLoading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : eventsError ? (
          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center font-sf-text">
            Failed to load recent events: {eventsError}
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-400 text-xs font-semibold font-sf-text">
            No integrity events logged recently.
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.slice(0, 4).map((evt) => (
              <GlassPressCard
                key={evt.id}
                id={`integrity-event-${evt.id}`}
                onClick={() => navigate(`/forensics/${evt.camera || evt.cameraName || 'CCTV'}`)}
                className="p-3.5 sm:p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm font-sf-text">
                  
                  {/* Left: Event Time, CCTV Camera Icon & Camera Name */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Event Time */}
                    <span className="text-xs font-mono font-semibold text-slate-400 shrink-0 w-16 sm:w-20">
                      {evt.time || evt.timestamp || 'Live'}
                    </span>

                    {/* CCTV Surveillance Camera Icon */}
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:border-blue-400/60 group-hover:bg-blue-500/20 transition-all shadow-sm">
                      <Camera className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Camera Name */}
                    <span className="font-bold text-white font-sf-display truncate">
                      {evt.camera || evt.cameraName || 'CCTV Stream'}
                    </span>
                  </div>

                  {/* Middle: Event details */}
                  <div className="hidden md:block flex-1 truncate text-slate-400 text-xs text-left px-4">
                    {evt.event || evt.description}
                  </div>

                  {/* Right: Status Pill with Enterprise Accent Colors */}
                  <div className="shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getEventStatusStyle(evt.status)}`}>
                      <span className="text-[9px]">{getEventDot(evt.status)}</span>
                      <span>{evt.status === 'online' ? 'Nominal' : evt.status}</span>
                    </span>
                  </div>

                </div>
              </GlassPressCard>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DRAWER OVERLAY: ALL SURVEILLANCE INTEGRITY LOGS */}
      {isEventsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-3xl mx-4 rounded-2xl border border-white/10 bg-[#080c14] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-fade-in relative z-50">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white font-sf-display">
                  System Integrity Audit Logs
                </h2>
              </div>
              <button
                onClick={() => setIsEventsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable Log Timeline */}
            <div className="p-4 overflow-y-auto space-y-3 flex-grow bg-transparent">
              {eventsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-16 bg-white/5 border border-white/10 rounded-2xl" />
                  ))}
                </div>
              ) : eventsError ? (
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center font-sf-text">
                  Failed to load integrity audit logs: {eventsError}
                </div>
              ) : events.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-400 text-xs font-semibold font-sf-text">
                  No events found in registry log.
                </div>
              ) : (
                events.map((evt) => (
                  <div 
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-sf-text"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 sm:mt-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left font-sf-text">
                        <div className="flex items-center gap-2 flex-wrap font-sf-text">
                          <span className="font-bold text-white font-sf-display">
                            {evt.camera || evt.cameraName}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            • {evt.time || evt.timestamp || 'Live'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sf-text mt-0.5">
                          {evt.event || evt.description || 'Surveillance system event check.'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getEventStatusStyle(evt.status)}`}>
                        <span className="text-[9px]">{getEventDot(evt.status)}</span>
                        <span>{evt.status === 'online' ? 'Nominal' : evt.status}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0 font-sf-text bg-black/10">
              <span>Showing all registered surveillance integrity logs</span>
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
