import React from 'react';
import type { CategoryType } from '../types';
import { usePlatformStatus } from '../hooks/usePlatformStatus';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Camera, 
  Search, 
  BrainCircuit, 
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  categoryCounts: Record<string, number>;
  selectedFilter: 'all' | 'newThisWeek';
  setSelectedFilter: (filter: 'all' | 'newThisWeek') => void;
}

const OPERATIONS_MENU: { name: CategoryType; icon: React.ReactNode }[] = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Cameras', icon: <Camera className="w-4 h-4" /> },
  { name: 'Forensics', icon: <Search className="w-4 h-4" /> },
  { name: 'Predictions', icon: <BrainCircuit className="w-4 h-4" /> },
  { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  setActiveCategory,
  categoryCounts: _categoryCounts,
  selectedFilter: _selectedFilter,
  setSelectedFilter,
}) => {
  const { status, isLoading: statusLoading, error: statusError } = usePlatformStatus();
  const { user } = useUser();
  const { logout } = useAuth();

  return (
    <aside 
      id="sidebar-menu" 
      className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-5 p-4 rounded-2xl liquid-glass-card border border-white/10 shadow-2xl shadow-black/50 select-none transition-all duration-300"
    >
      {/* Operator profile context */}
      {user && (
        <div className="relative z-20 flex items-center justify-between gap-3 p-3 rounded-xl border border-white/15 bg-white/5 font-['SF_Pro_Text']" id="operator-profile-card">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user.username || 'Operator'}
              className="w-10 h-10 rounded-full border border-blue-500/30 object-cover shrink-0"
              id="operator-avatar"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate font-['SF_Pro_Display']" id="operator-username">
                {user.username || 'op-4471'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate" id="operator-role">
                {user.role || 'Lead Security Operator'}
              </span>
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all shrink-0"
            title="Log Out"
            id="logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* OPERATIONS Section */}
      <div className="relative z-20">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-3 px-3 font-['SF_Pro_Display']">
          OPERATIONS
        </h2>
        
        <nav className="flex flex-col gap-1.5" id="category-nav">
          {OPERATIONS_MENU.map((cat) => {
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setSelectedFilter('all');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'liquid-glass-sidebar-item active text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                id={`cat-btn-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}>
                    {cat.icon}
                  </span>
                  <span className="font-['SF_Pro_Text']">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SYSTEM STATUS Section */}
      <div className="relative z-20 pt-4 border-t border-white/10 space-y-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 px-3 font-sf-display">
          SYSTEM STATUS
        </h3>
        
        {statusLoading ? (
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 animate-pulse space-y-2">
            <div className="h-3 bg-white/5 rounded w-2/3"></div>
            <div className="h-3 bg-white/5 rounded w-1/2"></div>
          </div>
        ) : statusError ? (
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-xs font-semibold text-center font-sf-text">
            Connection Offline
          </div>
        ) : status ? (
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-3 text-xs font-sf-text">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-white font-sf-display">
                {status.connectedCameras}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Connected Feeds
            </p>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Backend Core</span>
                <span className={`font-bold uppercase ${status.backendStatus === 'online' || status.backendStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-450'}`}>
                  {status.backendStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Database</span>
                <span className={`font-bold uppercase ${status.databaseStatus === 'online' || status.databaseStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-450'}`}>
                  {status.databaseStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">CV Engine</span>
                <span className={`font-bold uppercase ${status.cvEngineStatus === 'online' || status.cvEngineStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-450'}`}>
                  {status.cvEngineStatus}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ACTIVE ALERTS Section */}
      <div className="relative z-20 pt-4 border-t border-white/10 space-y-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 px-3 font-sf-display">
          ACTIVE ALERTS
        </h3>

        <div className="space-y-2 px-1 text-xs font-sf-text">
          {[
            { location: 'Parking Zone B', level: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: '🔴' },
            { location: 'Warehouse Gate', level: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', dot: '🟡' },
          ].map((item) => (
            <div key={item.location} className="flex items-center justify-between text-slate-350 hover:text-white transition-colors cursor-pointer py-1">
              <span className="font-medium">{item.location}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${item.color}`}>
                <span className="text-[8px]">{item.dot}</span>
                <span>{item.level}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Integrity Banner */}
      <div className="relative z-20 mt-auto pt-4">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-950/40 border border-blue-500/20 text-xs">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Health</span>
            </div>
            {status && (
              <span className="font-mono font-bold text-emerald-400">
                {typeof status.platformHealth === 'number' 
                  ? `${(status.platformHealth * 100).toFixed(1)}%` 
                  : status.platformHealth}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed font-sf-text">
            Core services are online and ready for real-time camera integrity analysis.
          </p>
        </div>
      </div>

    </aside>
  );
};
