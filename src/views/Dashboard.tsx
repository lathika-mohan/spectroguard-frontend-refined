import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useCameras } from '../hooks/useCameras';
import { useEvents } from '../hooks/useEvents';
import { useSearch } from '../hooks/useSearch';
import { 
  Camera, 
  Activity, 
  UploadCloud, 
  Search, 
  Clock, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

// Custom 3D Glass Press Card Component for Dashboard Grid
const DashboardCard: React.FC<{
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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom API hooks connecting directly to backend endpoints
  const { summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useDashboardSummary();
  const { data: cameras, isLoading: camerasLoading, error: camerasError, refetch: refetchCameras } = useCameras();
  const { events, isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEvents();
  const { executeSearch, results: searchResults, isLoading: searchLoading, error: searchError } = useSearch();

  // Search query states
  const [searchQuery, setSearchQuery] = useState('');

  // Upload file state (UI prepared for Phase 2 integration)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Trigger search on submit or empty query reset
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      executeSearch(''); // Clear results
    }
  }, [searchQuery]);

  // Clean trigger to refresh all metrics
  const refreshAllData = () => {
    refetchSummary();
    refetchCameras();
    refetchEvents();
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  // Helper to map Unsplash thumbnails for UI matching standalone look
  const getCameraThumbnail = (camId: string, index: number): string => {
    const urls = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', // Office/Lobby
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80', // Warehouse/Logistics
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80', // Parking
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80', // Corridor
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', // Server Room
    ];
    return urls[index % urls.length];
  };

  return (
    <div className="space-y-8 pb-12 text-white font-['SF_Pro_Text'] animate-fade-in relative z-10">
      
      {/* SECTION 7: Search and Global Commands bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cameras by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </form>

        <button 
          onClick={refreshAllData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold tracking-wide transition-all self-end sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Live Feeds</span>
        </button>
      </div>

      {/* Primary Dashboard UI */}
      {searchQuery.trim() !== '' ? (
        /* Search results layout section */
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <h3 className="text-lg font-bold text-white font-['SF_Pro_Display']">
              Search Results
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 font-mono font-bold">
              {searchLoading ? 'searching...' : `${searchResults.length} matches`}
            </span>
          </div>

          {searchLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 bg-white/5 border border-white/10 rounded-2xl" />
              ))}
            </div>
          ) : searchError ? (
            <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center text-xs text-rose-300 font-semibold">
              Search failed: {searchError}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="liquid-glass-card p-12 rounded-2xl text-center border border-white/10">
              <p className="text-slate-400 text-sm font-medium">No cameras matching "{searchQuery}" recorded in backend registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.map((camera, idx) => (
                <DashboardCard 
                  key={camera.id}
                  id={`search-card-${camera.id}`}
                  onClick={() => navigate(`/forensics/${camera.id}`)}
                  className="cursor-pointer"
                >
                  <div className="h-36 relative overflow-hidden bg-slate-900 shrink-0">
                    <img 
                      src={getCameraThumbnail(camera.id, idx)} 
                      alt={camera.name} 
                      className="w-full h-full object-cover saturate-[0.7] group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-white font-['SF_Pro_Display'] truncate max-w-[70%]">
                        {camera.name}
                      </h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                        camera.status === 'online' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                        camera.status === 'anomalous' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-gray-400 border-white/10 bg-white/5'
                      }`}>
                        {camera.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-2">
                      <span>{camera.location}</span>
                      <span className="font-bold font-mono text-blue-400">
                        {Math.round(camera.integrityScore * 100)}% Integrity
                      </span>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default Dashboard view containing operational metrics, cards and feeds */
        <>
          {/* SECTION 2: KPI Metrics Cards */}
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
                <DashboardCard className="p-4" id="kpi-system-integrity">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-['SF_Pro_Display']">System Integrity</span>
                  <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">
                      {(summary.systemIntegrity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                    <span>Average node score</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Nominal
                    </span>
                  </div>
                </DashboardCard>

                <DashboardCard className="p-4" id="kpi-active-cameras">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-['SF_Pro_Display']">Active Cameras</span>
                  <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">
                      {summary.activeCameras}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                    <span>Online streams</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live Monitoring
                    </span>
                  </div>
                </DashboardCard>

                <DashboardCard className="p-4" id="kpi-integrity-alerts">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-['SF_Pro_Display']">Integrity Alerts</span>
                  <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                    <span className={`text-2xl sm:text-3xl font-extrabold font-['SF_Pro_Display'] ${summary.integrityAlerts > 0 ? 'text-rose-400' : 'text-white'}`}>
                      {summary.integrityAlerts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                    <span>Pending checks</span>
                    {summary.integrityAlerts > 0 ? (
                      <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                        Investigation Required
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Clear
                      </span>
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard className="p-4" id="kpi-predictions-today">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-['SF_Pro_Display']">Predictions Today</span>
                  <div className="flex items-baseline gap-2 mt-1 mb-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">
                      {summary.predictionsToday}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                    <span>Spectral runs Completed</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-[9px]">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Synchronized
                    </span>
                  </div>
                </DashboardCard>
              </>
            ) : (
              <div className="col-span-full py-4 text-center text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-2xl">
                No summary metrics telemetry available
              </div>
            )}
          </div>

          {/* SECTION 6: Live Upload Section (Visual layout prepared for Phase 2) */}
          <div className="liquid-glass-hero p-6 sm:p-8 rounded-2xl border border-white/15 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 relative z-10">
              <div className="md:col-span-7 text-left space-y-3">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest font-['SF_Pro_Display']">
                  <ShieldCheck className="w-4 h-4" />
                  <span>On-Demand Spectral Validation (Phase 1 Ready)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight font-['SF_Pro_Display']">
                  Verify Surveillance Integrity
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-['SF_Pro_Text'] leading-relaxed max-w-lg">
                  Submit video clips or image sequences for physics-informed tamper and blur verification. The detection engine runs FFT metrics in the background.
                </p>
                {uploadedFileName && (
                  <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs font-mono text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Evidence file: <strong className="text-white truncate max-w-[150px]">{uploadedFileName}</strong>
                  </div>
                )}
              </div>

              {/* Upload Dropzone Container */}
              <div className="md:col-span-5 w-full flex flex-col items-center justify-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,video/*"
                />
                <div 
                  onClick={triggerUploadClick}
                  className="w-full border border-dashed border-white/20 hover:border-blue-500/60 rounded-2xl p-5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform mb-1">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white font-['SF_Pro_Display']">
                    Drag & Drop Evidence Clip
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold underline cursor-pointer">
                    Click to Browse Files
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Operational grid layout: Camera Overview (Section 4) + Recent Activity (Section 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SECTION 4: Camera Overview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span>Camera Overview</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Feeds</span>
              </div>

              {camerasLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-44 bg-white/5 border border-white/10 rounded-2xl" />
                  ))}
                </div>
              ) : camerasError ? (
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center text-xs text-rose-300 font-semibold">
                  Failed to load camera streams: {camerasError}
                </div>
              ) : cameras.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400 font-semibold">
                  No Cameras Registered
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cameras.map((camera, index) => (
                    <DashboardCard 
                      key={camera.id}
                      id={`camera-card-${camera.id}`}
                      onClick={() => navigate(`/forensics/${camera.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="h-36 relative overflow-hidden bg-slate-900 shrink-0">
                        <img 
                          src={getCameraThumbnail(camera.id, index)} 
                          alt={camera.name} 
                          className="w-full h-full object-cover saturate-[0.7] group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute top-2 left-2 flex items-center text-[9px] font-mono text-white/90 z-20">
                          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${camera.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
                            {camera.id}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 relative z-20">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-white font-['SF_Pro_Display'] group-hover:text-blue-300 transition-colors truncate font-sans">
                            {camera.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium truncate">
                            {camera.location}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-medium">Integrity Score</span>
                            <span className="font-extrabold text-white font-mono text-xs">
                              {Math.round(camera.integrityScore * 100)}%
                            </span>
                          </div>

                          <button 
                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-0.5"
                          >
                            <span>Analyze →</span>
                          </button>
                        </div>
                      </div>
                    </DashboardCard>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 5: Recent Activity (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Recent Activity</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Real-time Feed</span>
              </div>

              {eventsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-white/5 border border-white/10 rounded-2xl" />
                  ))}
                </div>
              ) : eventsError ? (
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center text-xs text-rose-300 font-semibold">
                  Failed to load events timeline: {eventsError}
                </div>
              ) : events.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400 font-semibold">
                  No Recent Activity logged.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((evt, idx) => (
                    <DashboardCard 
                      key={evt.id || idx}
                      id={`event-card-${evt.id}`}
                      className="p-3.5"
                    >
                      <div className="flex items-start justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                            <Clock className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white font-['SF_Pro_Display'] truncate">
                                {evt.camera || evt.cameraName || 'CCTV Stream'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                {evt.time || evt.timestamp || 'Live'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-['SF_Pro_Text'] mt-0.5 leading-relaxed">
                              {evt.event || evt.description || 'Surveillance system event check.'}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 self-start">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            evt.statusStyle || 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                      </div>
                    </DashboardCard>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
