import React from 'react';
import type { CategoryType } from '../types';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Camera, 
  FolderLock, 
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

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  setActiveCategory,
  categoryCounts,
  selectedFilter,
  setSelectedFilter,
}) => {
  const { t, theme, accentClasses } = useApp();

  const OPERATIONS_MENU: { name: CategoryType; navKey: string; icon: React.ReactNode }[] = [
    { name: 'Dashboard', navKey: 'nav.dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Predictions', navKey: 'nav.predictions', icon: <BrainCircuit className="w-4 h-4" /> },
    { name: 'Cameras', navKey: 'nav.cameras', icon: <Camera className="w-4 h-4" /> },
    { name: 'Vault', navKey: 'nav.vault', icon: <FolderLock className="w-4 h-4" /> },
    { name: 'Settings', navKey: 'nav.settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside 
      id="sidebar-menu" 
      className={`w-full lg:w-64 shrink-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-5 p-4 rounded-2xl border shadow-2xl select-none transition-all duration-300 ${
        theme === 'light'
          ? 'bg-white/90 border-slate-200 text-slate-900 shadow-slate-200/50'
          : 'liquid-glass-card border-white/10 text-white shadow-black/50'
      }`}
    >
      {/* OPERATIONS Section */}
      <div className="relative z-20">
        <h2 className={`text-[11px] font-bold tracking-widest uppercase mb-3 px-3 font-['SF_Pro_Display'] ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('settings.preferences') === 'प्राथमिकताएं' ? 'ऑपरेशन्स' : 'OPERATIONS'}
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
                    ? `${accentClasses.bg} text-white shadow-lg ${accentClasses.border}`
                    : theme === 'light'
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                id={`cat-btn-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white drop-shadow-md' : 'text-slate-400 group-hover:text-blue-400'}>
                    {cat.icon}
                  </span>
                  <span className="font-['SF_Pro_Text']">{t(cat.navKey)}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SYSTEM STATUS Section */}
      <div className={`relative z-20 pt-4 border-t space-y-3 ${
        theme === 'light' ? 'border-slate-200' : 'border-white/10'
      }`}>
        <h3 className={`text-[11px] font-bold tracking-widest uppercase px-3 font-['SF_Pro_Display'] flex items-center justify-between ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>{t('settings.preferences') === 'प्राथमिकताएं' ? 'सिस्टम स्थिति' : 'SYSTEM STATUS'}</span>
        </h3>
        
        <div 
          className={`p-3.5 rounded-xl border transition-all ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'border-white/10 bg-white/5'
          }`}
          id="system-status-widget"
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-2xl font-extrabold font-['SF_Pro_Display'] ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>24</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {t('status.online')}
            </span>
          </div>

          <p className={`text-xs font-['SF_Pro_Text'] font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t('settings.preferences') === 'प्राथमिकताएं' ? 'कनेक्ट किए गए कैमरे' : 'Connected Cameras'}
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
      <div className={`relative z-20 pt-4 border-t space-y-3 ${
        theme === 'light' ? 'border-slate-200' : 'border-white/10'
      }`}>
        <h3 className={`text-[11px] font-bold tracking-widest uppercase px-3 font-['SF_Pro_Display'] ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('settings.preferences') === 'प्राथमिकताएं' ? 'सक्रिय चेतावनियां' : 'ACTIVE ALERTS'}
        </h3>

        <div className="space-y-2 px-1 text-xs font-['SF_Pro_Text']">
          {[
            { location: 'Parking Zone B', level: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: '🔴' },
            { location: 'Warehouse Gate', level: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', dot: '🟡' },
            { location: 'Loading Dock', level: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: '🔴' },
            { location: 'Lobby Entrance', level: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: '🟢' },
            { location: 'Main Corridor', level: 'Normal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: '🟢' },
          ].map((item) => (
            <div key={item.location} className={`flex items-center justify-between transition-colors cursor-pointer py-1 ${
              theme === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
            }`}>
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
        <div className={`p-3.5 rounded-xl border text-xs ${
          theme === 'light'
            ? 'bg-blue-50 border-blue-200 text-slate-800'
            : 'bg-gradient-to-br from-blue-900/30 to-indigo-950/40 border-blue-500/20'
        }`}>
          <div className="flex items-center gap-2 text-blue-500 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Integrity</span>
          </div>
          <p className={`text-[11px] leading-relaxed font-['SF_Pro_Text'] ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Core services are online and ready for real-time camera integrity analysis.
          </p>
        </div>
      </div>

    </aside>
  );
};

