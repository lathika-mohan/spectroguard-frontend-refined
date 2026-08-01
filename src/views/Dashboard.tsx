import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Activity, 
  Camera, 
  UploadCloud, 
  Clock, 
  ArrowRight, 
  Search, 
  AlertCircle 
} from 'lucide-react';

import { apiClient } from '../api/client';

interface SummaryData {
  systemIntegrity: string;
  activeCameras: number;
  integrityAlerts: number;
  predictionsToday: number;
}

interface CameraData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'anomalous';
  resolution: string;
  fps: number;
  integrityScore: number;
  thumbnail: string;
}

interface EventData {
  id: string;
  time: string;
  camera: string;
  status: string;
  event: string;
}

interface SearchResult {
  cameras: CameraData[];
  events: EventData[];
  predictions: any[];
}

// 3D Glass Press Tilt Camera Card
const CameraCardItem: React.FC<{ card: CameraData }> = ({ card }) => {
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
  const maxRotateDeg = 7;
  const rotateX = cursorState.isHovered ? centerOffsetY * maxRotateDeg : 0;
  const rotateY = cursorState.isHovered ? -centerOffsetX * maxRotateDeg : 0;

  // Derive styles from status
  let badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let badgeDotColor = 'bg-emerald-400';
  let badgeText = 'NOMINAL';

  if (card.status === 'anomalous') {
    badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    badgeDotColor = 'bg-rose-400';
    badgeText = 'ALERT';
  } else if (card.status === 'offline') {
    badgeColor = 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    badgeDotColor = 'bg-slate-400';
    badgeText = 'OFFLINE';
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: cursorState.isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-6px) scale3d(0.99, 0.99, 0.99)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: cursorState.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: cursorState.isHovered
          ? `inset ${centerOffsetX * 15}px ${centerOffsetY * 15}px 25px rgba(0, 0, 0, 0.8), 0 15px 35px -8px rgba(15, 23, 42, 0.7), 0 0 25px rgba(30, 58, 138, 0.4)`
          : undefined,
      }}
      className={`group relative liquid-glass-card rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
        cursorState.isHovered ? 'border-blue-500/60' : 'border-white/10'
      }`}
      id={`camera-card-${card.id}`}
    >
      {cursorState.isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 220px at ${cursorState.x * 100}% ${cursorState.y * 100}%, rgba(30, 58, 138, 0.5) 0%, rgba(29, 78, 216, 0.2) 40%, transparent 80%)`,
          }}
        />
      )}

      {/* Top Image Thumbnail */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-900 shrink-0">
        <img
          src={card.thumbnail || 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80'}
          alt={card.name}
          className="w-full h-full object-cover saturate-[0.75] contrast-[1.15] brightness-[0.85] group-hover:scale-105 group-hover:saturate-100 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-slate-950/20 to-blue-900/20 mix-blend-multiply pointer-events-none" />
        
        {/* CCTV Rec Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow pointer-events-none z-20">
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {card.id} • REC
          </span>
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            LIVE
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 relative z-20 text-left">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${badgeColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badgeDotColor} animate-pulse`} />
            <span>{badgeText}</span>
          </span>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white font-display group-hover:text-blue-300 transition-colors">
            {card.name}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {card.location}
          </p>
        </div>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Camera Integrity</span>
            <span className="font-extrabold text-white font-mono text-sm tracking-tight">
              {(card.integrityScore * 100).toFixed(1)}%
            </span>
          </div>

          <Link 
            to={`/forensics/${card.id}`}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>Inspect →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Core telemetry states
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search result states
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [sumData, camData, evtData, predData] = await Promise.all([
          apiClient<SummaryData>('/dashboard/summary'),
          apiClient<CameraData[]>('/cameras'),
          apiClient<EventData[]>('/events'),
          apiClient<any[]>('/predictions/history')
        ]);

        if (mounted) {
          setSummary(sumData);
          setCameras(camData);
          setEvents(evtData);
          setPredictions(predData);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) {
          setError(err.message || 'Fatal error loading dashboard telemetry.');
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch search results when query parameter changes
  useEffect(() => {
    let mounted = true;
    if (!query) {
      setSearchResult(null);
      return;
    }

    setIsSearchLoading(true);
    apiClient<SearchResult>(`/search?q=${encodeURIComponent(query)}`)
      .then((data) => {
        if (mounted) {
          setSearchResult(data);
          setIsSearchLoading(false);
        }
      })
      .catch((err) => {
        console.error('Search failed:', err);
        if (mounted) {
          setIsSearchLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  // Handle clear search
  const handleClearSearch = () => {
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  // Upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Retrieving telemetry and logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left space-y-4 max-w-xl mx-auto mt-12 animate-fade-in">
        <div className="flex items-center gap-3 text-rose-400">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold font-display">System Boundary Interrupted</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Display Search Results Screen
  if (query) {
    return (
      <div className="space-y-8 animate-fade-in text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white font-display">
              Search Results for "{query}"
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 font-mono font-bold border border-blue-500/30">
              {searchResult ? (searchResult.cameras.length + searchResult.events.length) : 0} matches
            </span>
          </div>
          <button
            onClick={handleClearSearch}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Clear Search
          </button>
        </div>

        {isSearchLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Matching Cameras */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-300 font-display">Matching Camera Feeds</h3>
              {searchResult?.cameras && searchResult.cameras.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResult.cameras.map((cam) => (
                    <CameraCardItem key={cam.id} card={cam} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No cameras match the query.</p>
              )}
            </div>

            {/* Matching Events */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-300 font-display">Matching Activity Logs</h3>
              {searchResult?.events && searchResult.events.length > 0 ? (
                <div className="space-y-2">
                  {searchResult.events.map((evt) => (
                    <div 
                      key={evt.id} 
                      className="p-3.5 rounded-xl liquid-glass-card border border-white/10 flex items-center justify-between text-xs sm:text-sm font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-16">{evt.time}</span>
                        <span className="font-bold text-white">{evt.camera}</span>
                        <span className="text-slate-400">— {evt.event}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                        evt.status === 'online' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No activity events match the query.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Welcome Hero Panel */}
      <div className="liquid-glass-hero p-6 sm:p-8 rounded-2xl border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider font-display">
              <BarChart3 className="w-4 h-4" />
              <span>Surveillance Integrity Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Operator Operations Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Inspect structural anomalies, review frame ingestion logs, and coordinate machine-vision forensics.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: System Integrity */}
        <div className="liquid-glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">System Integrity</span>
          <div className="flex items-baseline gap-2 mt-2 mb-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {summary?.systemIntegrity ?? 'No data available'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Average stream score</span>
            {summary && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nominal
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Active Cameras */}
        <div className="liquid-glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">Active Cameras</span>
          <div className="flex items-baseline gap-2 mt-2 mb-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {summary?.activeCameras ?? 'No data available'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Actively ingested</span>
            {summary && <span className="text-emerald-400 font-semibold">Streams Online</span>}
          </div>
        </div>

        {/* KPI 3: Integrity Alerts */}
        <div className="liquid-glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">Integrity Alerts</span>
          <div className="flex items-baseline gap-2 mt-2 mb-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500 font-mono">
              {summary?.integrityAlerts ?? 'No data available'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Require investigation</span>
            {summary && summary.integrityAlerts > 0 ? (
              <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Action Required
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">Clear</span>
            )}
          </div>
        </div>

        {/* KPI 4: Predictions Today */}
        <div className="liquid-glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">Predictions Today</span>
          <div className="flex items-baseline gap-2 mt-2 mb-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {summary?.predictionsToday ?? 'No data available'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">On-demand validations</span>
            {summary && <span className="text-blue-400 font-semibold">FFT Inference</span>}
          </div>
        </div>

      </div>

      {/* Section 4: Camera Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight font-display">
          Camera Registry Grid
        </h2>
        
        {cameras.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-slate-400 text-sm">No Camera Alerts</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {cameras.map((cam) => (
              <CameraCardItem key={cam.id} card={cam} />
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Recent Activity (Section 5) + On-Demand Verification Entry (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10">
        
        {/* Left Side: Recent Activity Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Recent Activity timeline</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live Ingest</span>
          </div>

          <div className="liquid-glass-card rounded-2xl border border-white/10 p-5 space-y-4">
            {events.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-xs">No Recent Activity</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 space-y-3.5">
                {events.map((evt) => (
                  <div key={evt.id} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group/event">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-slate-400 shrink-0 w-16">
                        {evt.time}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                        <Camera className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-white font-display group-hover/event:text-blue-300 transition-colors">
                          {evt.camera}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {evt.event}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-center pl-19 sm:pl-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        evt.status === 'online'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }`}>
                        {evt.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: On-Demand Verification Entry Point */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <span>On-Demand Verification</span>
          </h3>

          <div className="liquid-glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between h-full space-y-4">
            
            {/* File Drop-Zone UI */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-2xl p-6 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*"
                onChange={handleFileChange}
              />

              <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              
              <span className="text-xs sm:text-sm font-bold text-white font-display">
                Upload Video / Evidence Clip
              </span>
              <span className="text-xs text-blue-400 font-semibold underline">
                Click to Browse File
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                Supports image and video binaries
              </span>
            </div>

            {uploadFile && (
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 truncate max-w-[200px]">{uploadFile.name}</span>
                <button 
                  onClick={handleClearFile}
                  className="text-rose-400 hover:text-rose-300 underline"
                >
                  Clear File
                </button>
              </div>
            )}

            {/* Run Prediction Button (Entry Point Prepared for Phase 2) */}
            <button
              disabled={!uploadFile}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                uploadFile 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg' 
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Run Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-white/5">
              <span>* Inference calculations are performed in Phase 2.</span>
            </div>

          </div>
        </div>

      </div>

      {/* Section 7: Prediction History list & Empty State */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Prediction History</span>
        </h3>

        {predictions.length === 0 ? (
          <div className="liquid-glass-card p-12 rounded-2xl text-center border border-white/10">
            <p className="text-slate-400 text-sm font-medium mb-1">No Predictions Yet</p>
            <p className="text-xs text-slate-500">Waiting for First Analysis to compile telemetry audit logs.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {predictions.map((p, idx) => (
              <div 
                key={idx} 
                className="p-3.5 sm:p-4 rounded-xl liquid-glass-card border border-white/10 flex items-center justify-between text-xs sm:text-sm font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{p.timestamp}</span>
                  <span className="font-bold text-white">{p.filename}</span>
                </div>
                <span className="text-emerald-400">{p.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
