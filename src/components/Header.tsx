import React from 'react';
import { Search, LayoutDashboard, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: 'directory' | 'dashboard';
  setActiveView: (view: 'directory' | 'dashboard') => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  onOpenSubmitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeView: _activeView,
  setActiveView,
  onOpenNotifications,
  onOpenSubmitModal: _onOpenSubmitModal,
}) => {
  return (
    <header id="header-bar" className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#030712]/90 border-b border-white/10 transition-all">
      <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo with Custom Atom Star Orbit */}
        <div 
          onClick={() => setActiveView('directory')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          id="brand-logo-btn"
        >
          {/* Custom SVG Atom Star Symbol with orbiting rings */}
          <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-blue-400 fill-none stroke-current stroke-[4]">
              <circle cx="50" cy="50" r="10" className="fill-blue-400 stroke-none" />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(-30 50 50)" className="stroke-blue-400/80" />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(30 50 50)" className="stroke-indigo-400/80" />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(90 50 50)" className="stroke-cyan-400/70" />
            </svg>
          </div>
          
          <span className="text-xl font-extrabold tracking-tight text-white font-['SF_Pro_Display']">
            SPECTRA<span className="text-blue-400">GUARD</span>
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-8">
          <div className="relative liquid-glass-input rounded-xl flex items-center px-3.5 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cameras, forensic logs, locations..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-['SF_Pro_Text']"
              id="search-tools-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors"
                id="clear-search-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Dashboard Button & Notification Badge */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Dashboard Button */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/90 text-white border border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:bg-blue-600 transition-all font-['SF_Pro_Text']"
            id="dashboard-toggle-btn"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
            <span>Dashboard</span>
          </button>

          {/* Notification Button with OP badge and live pulse indicator */}
          <button
            onClick={onOpenNotifications}
            className="relative px-2.5 h-8 rounded-xl liquid-glass-card flex items-center justify-center text-white/90 hover:text-white border-white/15 hover:bg-white/10 transition-all font-bold text-xs font-['SF_Pro_Text'] tracking-wide"
            title="Operational Notifications"
            id="notifications-btn"
          >
            <span>OP</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#030712] animate-pulse" />
          </button>
        </div>

      </div>
    </header>
  );
};


