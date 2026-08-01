import React from 'react';
import { Search, LayoutDashboard, Video, BrainCircuit, FolderLock, Settings, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: 'directory' | 'dashboard';
  setActiveView: (view: 'directory' | 'dashboard') => void;
  activeCategory?: string;
  notificationCount: number;
  onOpenNotifications: () => void;
  onOpenSubmitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView,
  activeCategory,
  onOpenNotifications,
  onOpenSubmitModal,
}) => {
  const { t, theme, accentClasses } = useApp();

  return (
    <header 
      id="header-bar" 
      className={`sticky top-0 z-40 w-full backdrop-blur-2xl transition-colors border-b ${
        theme === 'light'
          ? 'bg-white/85 border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#030712]/90 border-white/10 text-white'
      }`}
    >
      <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo with Custom Atom Star Orbit */}
        <div 
          onClick={() => setActiveView('directory')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          id="brand-logo-btn"
        >
          {/* Custom SVG Atom Star Symbol with orbiting rings */}
          <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 100 100" className={`w-8 h-8 ${accentClasses.text} fill-none stroke-current stroke-[4]`}>
              <circle cx="50" cy="50" r="10" className={`${accentClasses.text} fill-current stroke-none`} />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(-30 50 50)" className="stroke-current opacity-80" />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(30 50 50)" className="stroke-current opacity-80" />
              <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(90 50 50)" className="stroke-current opacity-70" />
            </svg>
          </div>
          
          <span className={`text-xl font-extrabold tracking-tight font-['SF_Pro_Display'] ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            SPECTRA<span className={accentClasses.text}>GUARD</span>
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-8">
          <div className={`relative rounded-xl flex items-center px-3.5 py-1.5 transition-all border ${
            theme === 'light'
              ? 'bg-slate-100 border-slate-300 text-slate-900 focus-within:border-blue-500'
              : 'liquid-glass-input text-white border-white/10'
          }`}>
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search')}
              className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none font-['SF_Pro_Text'] ${
                theme === 'light' ? 'text-slate-900 placeholder-slate-500' : 'text-white placeholder-slate-400'
              }`}
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

        {/* Right: Dashboard / Camera Button & Notification Badge */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Dynamic Active Page Badge Button */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${accentClasses.bg} ${accentClasses.bgHover} text-white border ${accentClasses.border} shadow-lg transition-all font-['SF_Pro_Text']`}
            id="dashboard-toggle-btn"
          >
            {activeCategory === 'Predictions' ? (
              <>
                <BrainCircuit className={`w-3.5 h-3.5 text-white animate-pulse ${accentClasses.glow}`} />
                <span>{t('nav.predictions')}</span>
              </>
            ) : activeCategory === 'Cameras' ? (
              <>
                <Video className={`w-3.5 h-3.5 text-white animate-pulse ${accentClasses.glow}`} />
                <span>{t('nav.cameras')}</span>
              </>
            ) : activeCategory === 'Vault' || activeCategory === 'Forensics' ? (
              <>
                <FolderLock className={`w-3.5 h-3.5 text-white animate-pulse ${accentClasses.glow}`} />
                <span>{t('nav.vault')}</span>
              </>
            ) : activeCategory === 'Settings' ? (
              <>
                <Settings className={`w-3.5 h-3.5 text-white animate-pulse ${accentClasses.glow}`} />
                <span>{t('nav.settings')}</span>
              </>
            ) : (
              <>
                <LayoutDashboard className={`w-3.5 h-3.5 text-white animate-pulse ${accentClasses.glow}`} />
                <span>{t('nav.dashboard')}</span>
              </>
            )}
          </button>

          {/* Notification Button with OP badge and live pulse indicator */}
          <button
            onClick={onOpenNotifications}
            className={`relative px-2.5 h-8 rounded-xl flex items-center justify-center border transition-all font-bold text-xs font-['SF_Pro_Text'] tracking-wide ${
              theme === 'light'
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                : 'liquid-glass-card text-white/90 hover:text-white border-white/15 hover:bg-white/10'
            }`}
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




