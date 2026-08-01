import React from 'react';
import type { CategoryType } from '../types';
import { 
  LayoutDashboard, 
  Camera, 
  Search, 
  BrainCircuit, 
  Settings,
  Sparkles
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
  return (
    <aside 
      id="sidebar-menu" 
      className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-5 p-4 rounded-2xl liquid-glass-card border border-white/10 shadow-2xl shadow-black/50 select-none transition-all duration-300"
    >
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
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 px-3 font-['SF_Pro_Display'] flex items-center justify-between">
          <span>SYSTEM STATUS</span>
        </h3>
        
        <div 
          className="p-3.5 rounded-xl border border-white/10 bg-white/5 transition-all"
          id="system-status-widget"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-extrabold text-white font-['SF_Pro_Display']">24</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              ONLINE
            </span>
          </div>

          <p className="text-xs text-slate-300 font-['SF_Pro_Text'] font-medium">
            Connected Cameras
          </p>

          {/* Mini Status Graphic */}
          <div className="h-2 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden flex gap-0.5 p-0.5">
            <div className="h-full bg-emerald-500 rounded-full flex-1" />
            <div className="h-full bg-emerald-500 rounded-full flex-1" />
            <div className="h-full bg-emerald-500 rounded-full flex-1" />
            <div className="h-full bg-amber-500 rounded-full w-2" />
          </div>
        </div>
      </div>

      {/* ACTIVE ALERTS Section */}
      <div className="relative z-20 pt-4 border-t border-white/10 space-y-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 px-3 font-['SF_Pro_Display']">
          ACTIVE ALERTS
        </h3>

        <div className="space-y-2 px-1 text-xs font-['SF_Pro_Text']">
          {[
            { location: 'Parking Zone B', level: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: '🔴' },
            { location: 'Warehouse Gate', level: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', dot: '🟡' },
            { location: 'Loading Dock', level: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: '🔴' },
            { location: 'Lobby Entrance', level: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: '🟢' },
            { location: 'Main Corridor', level: 'Normal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: '🟢' },
          ].map((item) => (
            <div key={item.location} className="flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer py-1">
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
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Integrity</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed font-['SF_Pro_Text']">
            Core services are online and ready for real-time camera integrity analysis.
          </p>
        </div>
      </div>

    </aside>
  );
};
