import React, { useState } from 'react';
import type { CameraFeedItem } from '../types';
import { GlassPressCard } from './GlassPressCard';
import { 
  Search, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  ShieldCheck
} from 'lucide-react';

interface CameraRegistryViewProps {
  cameras: CameraFeedItem[];
  selectedCameraId?: string;
  onSelectCamera?: (cameraId: string) => void;
}

export const CameraRegistryView: React.FC<CameraRegistryViewProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [integrityFilter, setIntegrityFilter] = useState('All Integrity');
  const [activeCamId, setActiveCamId] = useState<string>(
    selectedCameraId || (cameras.length > 0 ? cameras[0].id : 'CAM-001')
  );
  const [starredIds, setStarredIds] = useState<string[]>(['CAM-001', 'CAM-009']);

  // Update active camera if prop changes
  React.useEffect(() => {
    if (selectedCameraId) {
      setActiveCamId(selectedCameraId);
    }
  }, [selectedCameraId]);

  // Find currently active camera for right inspector panel
  const activeCamera = cameras.find((c) => c.id === activeCamId) || cameras[0];

  // Filtered list
  const filteredCameras = cameras.filter((cam) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cam.name.toLowerCase().includes(q);
      const matchLoc = cam.location.toLowerCase().includes(q);
      const matchBldg = cam.building.toLowerCase().includes(q);
      const matchId = cam.id.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchBldg && !matchId) return false;
    }
    if (statusFilter !== 'All Status' && cam.status !== statusFilter) return false;
    if (locationFilter !== 'All Locations' && !cam.building.includes(locationFilter) && !cam.location.includes(locationFilter)) return false;
    if (integrityFilter !== 'All Integrity' && cam.integrityStatus !== integrityFilter) return false;
    return true;
  });

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setLocationFilter('All Locations');
    setIntegrityFilter('All Integrity');
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Nominal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-sm shadow-emerald-900/30';
      case 'Investigating':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-sm shadow-amber-900/30';
      case 'Tampered':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-sm shadow-rose-900/30';
      case 'Offline':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getGradientId = (status: string) => {
    switch (status) {
      case 'Nominal':
        return 'emeraldGrad';
      case 'Investigating':
        return 'amberGrad';
      case 'Tampered':
        return 'roseGrad';
      default:
        return 'blueGrad';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['SF_Pro_Text'] text-white max-w-[1600px] mx-auto pb-12">
      
      {/* SVG Gradient Definitions for 3D Ring Gauges */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Apple 3D Metric Glass Badges (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: System Integrity Gauge */}
        <GlassPressCard className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Network Integrity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">98%</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 font-mono tracking-wide">Nominal Status</span>
          </div>

          {/* 3D Circular Gauge */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800/80 stroke-current"
                strokeWidth="3.2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                stroke="url(#blueGrad)"
                strokeDasharray="98, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <ShieldCheck className="w-5 h-5 text-blue-400 absolute" />
          </div>
        </GlassPressCard>

        {/* Metric 2: Active Feeds */}
        <GlassPressCard className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Active Feeds</span>
            <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-['SF_Pro_Display']">32</span>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-1">
              <span className="text-emerald-400 font-semibold">28 Live</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">4 Off</span>
            </div>
          </div>
        </GlassPressCard>

        {/* Metric 3: Investigating */}
        <GlassPressCard className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Investigating</span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['SF_Pro_Display']">6</span>
            <p className="text-[11px] font-mono text-amber-300 font-medium mt-1">18.8% under review</p>
          </div>
        </GlassPressCard>

        {/* Metric 4: Tampered Flags */}
        <GlassPressCard className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Tampered Flags</span>
            <div className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-['SF_Pro_Display']">2</span>
            <p className="text-[11px] font-mono text-rose-400 font-semibold mt-1">Physical occlusion</p>
          </div>
        </GlassPressCard>

        {/* Metric 5: Signal Disconnected */}
        <GlassPressCard className="p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">Disconnected</span>
            <div className="p-1.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-['SF_Pro_Display']">4</span>
            <p className="text-[11px] font-mono text-slate-400 font-medium mt-1">Check cable link</p>
          </div>
        </GlassPressCard>

      </div>

      {/* 2. Filter & Search Bar - Smooth Glass Pill Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/10 text-xs font-['SF_Pro_Text'] shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter camera name/ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/15 focus:border-blue-500 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          <span className="text-slate-500 font-bold hidden sm:inline">|</span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/80 border border-white/15 rounded-2xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-900/80 border border-white/15 rounded-2xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="All Locations">All Locations</option>
            <option value="Main Building">Main Building</option>
            <option value="East Wing">East Wing</option>
            <option value="Warehouse">Warehouse</option>
            <option value="IT Section">IT Section</option>
            <option value="Factory Floor">Factory Floor</option>
          </select>

          <select
            value={integrityFilter}
            onChange={(e) => setIntegrityFilter(e.target.value)}
            className="bg-slate-900/80 border border-white/15 rounded-2xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="All Integrity">All Integrity</option>
            <option value="Nominal">Nominal</option>
            <option value="Investigating">Investigating</option>
            <option value="Tampered">Tampered</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold border border-white/10 transition-all cursor-pointer hover:border-white/20"
        >
          Reset Filters
        </button>
      </div>

      {/* 4. Main Grid Section: Camera Feed Cards (Left 8 cols) + Inspector Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Camera Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {filteredCameras.length === 0 ? (
            <GlassPressCard className="p-12 text-center space-y-4">
              <Video className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-slate-300 text-sm font-medium">No cameras match your current filter parameters.</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </GlassPressCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCameras.map((cam) => {
                const isSelected = cam.id === activeCamId;
                const isStarred = starredIds.includes(cam.id);
                const gradId = getGradientId(cam.integrityStatus);

                return (
                  <GlassPressCard
                    key={cam.id}
                    onClick={() => {
                      setActiveCamId(cam.id);
                      if (onSelectCamera) onSelectCamera(cam.id);
                    }}
                    className={`p-4 flex flex-col justify-between space-y-4 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-blue-500/80 border-blue-500 bg-blue-950/20 shadow-2xl shadow-blue-900/30'
                        : ''
                    }`}
                  >
                    {/* Top Status Badge & Star */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                        cam.status === 'Online'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        <span>{cam.status}</span>
                      </span>

                      <button
                        onClick={(e) => toggleStar(cam.id, e)}
                        className={`p-1 text-slate-400 hover:text-amber-400 transition-colors ${isStarred ? 'text-amber-400' : ''}`}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Camera Feed Thumbnail Container */}
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-900 relative border border-white/10 group-hover:border-blue-400/40 transition-colors shadow-inner">
                      <img
                        src={cam.imageUrl}
                        alt={cam.name}
                        className="w-full h-full object-cover saturate-[0.85] contrast-[1.1] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Live Timestamp overlay */}
                      <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-semibold text-slate-200 border border-white/10">
                        {cam.timestamp}
                      </span>
                    </div>

                    {/* Camera Title & ID */}
                    <div>
                      <h3 className="text-sm font-bold text-white font-['SF_Pro_Display'] truncate group-hover:text-blue-300 transition-colors">
                        {cam.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {cam.id} • {cam.building}
                      </p>
                    </div>

                    {/* Integrity Ring & Score */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStatusBadgeStyle(cam.integrityStatus)}`}>
                          {cam.integrityStatus}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {cam.lastUpdated}
                        </p>
                      </div>

                      {/* 3D Circular Progress Meter */}
                      <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800/80 stroke-current"
                            strokeWidth="3.2"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            stroke={`url(#${gradId})`}
                            strokeDasharray={`${cam.integrityScore}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            fill="none"
                            className="drop-shadow-[0_0_6px_rgba(59,130,246,0.4)] transition-all duration-500"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold font-mono text-white">
                          {cam.integrityScore}%
                        </span>
                      </div>
                    </div>

                  </GlassPressCard>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-['SF_Pro_Text']">
            <span>Showing 1 to {filteredCameras.length} of 32 feeds</span>

            <div className="flex items-center gap-2 font-mono">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-blue-600/30">
                1
              </button>
              <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors">
                3
              </button>
              <span className="text-slate-500">...</span>
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Camera Detail Inspector Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <GlassPressCard className="p-6 space-y-6 shadow-2xl">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-['SF_Pro_Display']">
                  {activeCamera.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeCamera.id} • {activeCamera.building}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                activeCamera.status === 'Online'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${activeCamera.status === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{activeCamera.status}</span>
              </span>
            </div>

            {/* Live Camera Feed Preview Box */}
            <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-900 relative border border-white/20 group shadow-2xl">
              <img
                src={activeCamera.imageUrl}
                alt={activeCamera.name}
                className="w-full h-full object-cover saturate-[0.85] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Timestamp tag & Fullscreen button */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-white flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{activeCamera.timestamp}</span>
              </div>

              <button className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer border border-white/10">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Camera Technical Specifications */}
            <div className="space-y-2.5 text-xs font-['SF_Pro_Text'] border-b border-white/10 pb-5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Resolution</span>
                <span className="font-mono font-semibold text-white">{activeCamera.resolution}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Frame Rate</span>
                <span className="font-mono font-semibold text-white">{activeCamera.frameRate}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Codec</span>
                <span className="font-mono font-semibold text-white">{activeCamera.codec}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Last Updated</span>
                <span className="font-mono font-semibold text-white">{activeCamera.lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Connection</span>
                <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeCamera.connection}
                </span>
              </div>
            </div>

            {/* Integrity Score & History Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-['SF_Pro_Display']">
                  Integrity Gauge
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(activeCamera.integrityStatus)}`}>
                  {activeCamera.integrityStatus}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-5">
                {/* Large 3D Circle Metric */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800/80 stroke-current"
                      strokeWidth="3.2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke={`url(#${getGradientId(activeCamera.integrityStatus)})`}
                      strokeDasharray={`${activeCamera.integrityScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold font-mono text-white">
                    {activeCamera.integrityScore}%
                  </span>
                </div>

                {/* Sparkline Graphic */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                  </div>
                  <div className="h-9 w-full flex items-end gap-1 pt-1">
                    {(activeCamera.historyScores || [
                      { label: 'May 24', score: 95 },
                      { label: 'May 25', score: 97 },
                      { label: 'May 26', score: 94 },
                      { label: 'May 27', score: 98 },
                      { label: 'May 28', score: 96 },
                      { label: 'May 29', score: 99 },
                      { label: 'May 30', score: 98 },
                    ]).map((pt, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 hover:from-blue-500 hover:to-cyan-400 rounded-t transition-all relative group/bar"
                        style={{ height: `${pt.score}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-black px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap z-20 border border-white/20 shadow-xl">
                          {pt.label}: {pt.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Latest AI Prediction Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">AI Sub-Pixel Prediction</span>
                <span className="text-[10px] text-slate-400 font-mono">Just now</span>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  activeCamera.integrityStatus === 'Nominal'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-['SF_Pro_Display']">
                    {activeCamera.integrityStatus} Verification
                  </p>
                  <p className="text-xs text-slate-300 font-['SF_Pro_Text'] leading-relaxed mt-0.5">
                    {activeCamera.predictionDetail}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => alert(`Inspecting ${activeCamera.name} camera stream...`)}
                className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-900/40 cursor-pointer font-['SF_Pro_Text']"
              >
                Inspect Feed
              </button>
              <button 
                onClick={() => alert(`Exporting report for ${activeCamera.id}...`)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 font-semibold text-xs transition-all cursor-pointer font-['SF_Pro_Text']"
              >
                Export Report
              </button>
            </div>

          </GlassPressCard>
        </div>

      </div>

    </div>
  );
};
