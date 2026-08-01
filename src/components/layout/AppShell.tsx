import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Settings, 
  Search, 
  Bell, 
  LogOut, 
  User, 
  ShieldCheck, 
  Sparkles,
  X 
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { BackgroundLoopCanvas } from './BackgroundLoopCanvas';
import { NotificationsDrawer } from './NotificationsDrawer';
import type { NotificationItem } from './NotificationsDrawer';


interface OperatorProfile {
  username: string;
  role: string;
  avatar: string;
}

interface SidebarStatus {
  backendStatus: string;
  databaseStatus: string;
  cvEngineStatus: string;
  connectedCameras: number;
  platformHealth: number;
}

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search state
  const searchQuery = searchParams.get('q') || '';

  // API states
  const [operator, setOperator] = useState<OperatorProfile | null>(null);
  const [status, setStatus] = useState<SidebarStatus | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch all layout telemetry in parallel on mount
  useEffect(() => {
    let mounted = true;

    const fetchLayoutTelemetry = async () => {
      try {
        const [meData, sidebarData, notifData] = await Promise.all([
          apiClient<OperatorProfile>('/me'),
          apiClient<SidebarStatus>('/dashboard/sidebar'),
          apiClient<NotificationItem[]>('/notifications')
        ]);

        if (mounted) {
          setOperator(meData);
          setStatus(sidebarData);
          setNotifications(notifData);
        }
      } catch (err) {
        console.error('Failed to load layout telemetry:', err);
      }
    };

    fetchLayoutTelemetry();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle Search input change
  const handleSearchChange = (query: string) => {
    if (query) {
      setSearchParams({ q: query });
      if (location.pathname !== '/dashboard') {
        navigate(`/dashboard?q=${encodeURIComponent(query)}`);
      }
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  };

  const handleClearSearch = () => {
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  // Process logout
  const handleLogout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Backend session cleanup failed or was bypassed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('spectraguard_token');
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const activeNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen text-white flex flex-col font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Caching loop canvas background */}
      <BackgroundLoopCanvas />

      {/* Global Command Header */}
      <header id="header-bar" className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#030712]/90 border-b border-white/10 transition-all">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <Link 
            to="/dashboard"
            onClick={handleClearSearch}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="brand-logo-btn"
          >
            <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-blue-400 fill-none stroke-current stroke-[4]">
                <circle cx="50" cy="50" r="10" className="fill-blue-400 stroke-none" />
                <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(-30 50 50)" className="stroke-blue-400/80" />
                <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(30 50 50)" className="stroke-indigo-400/80" />
                <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(90 50 50)" className="stroke-cyan-400/70" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white font-display">
              SPECTRA<span className="text-blue-400">GUARD</span>
            </span>
          </Link>

          {/* Search bar connected to the backend */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-8">
            <div className="relative liquid-glass-input rounded-xl flex items-center px-3.5 py-1.5 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search cameras, events, status..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                id="search-tools-input"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors"
                  id="clear-search-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Navigation & Operator Profile */}
          <div className="flex items-center gap-3 shrink-0 relative">
            {/* Quick Dashboard Toggle */}
            <Link
              to="/dashboard"
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/90 text-white border border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:bg-blue-600 transition-all"
              id="dashboard-toggle-btn"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl liquid-glass-card hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              title="System Alerts Feed"
              id="notifications-btn"
            >
              <Bell className="w-4 h-4" />
              {activeNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#030712] animate-pulse" />
              )}
            </button>

            {/* Profile Avatar / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                id="operator-profile-btn"
              >
                {operator?.avatar ? (
                  <img 
                    src={operator.avatar} 
                    alt={operator.username} 
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                    OP
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-56 rounded-xl liquid-glass-hero border border-white/20 shadow-2xl p-4 z-40 animate-fade-in text-left">
                    <div className="border-b border-white/10 pb-3 mb-2.5">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-display">Authenticated Operator</p>
                      <p className="text-sm font-bold text-white mt-1 truncate" id="operator-username-label">
                        {operator?.username || 'Loading Operator...'}
                      </p>
                      <p className="text-[11px] text-blue-400 font-medium font-display mt-0.5">
                        {operator?.role || 'Retrieving role...'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile Console</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                        id="logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Structural Framework Layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          
          {/* Left Panel Sidebar */}
          <aside 
            id="sidebar-menu" 
            className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start flex flex-col gap-5 p-4 rounded-2xl liquid-glass-card border border-white/10 shadow-2xl shadow-black/50 select-none transition-all duration-300"
          >
            {/* OPERATIONS navigation */}
            <div>
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-3 px-3 font-display">
                OPERATIONS
              </h2>
              <nav className="flex flex-col gap-1.5" id="category-nav">
                <Link
                  to="/dashboard"
                  onClick={handleClearSearch}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'liquid-glass-sidebar-item active text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  id="cat-btn-dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/cameras"
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive('/cameras')
                      ? 'liquid-glass-sidebar-item active text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  id="cat-btn-cameras"
                >
                  <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Cameras</span>
                </Link>

                <Link
                  to="/settings"
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive('/settings')
                      ? 'liquid-glass-sidebar-item active text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  id="cat-btn-settings"
                >
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>

            {/* SYSTEM STATUS telemetry widget */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 px-3 font-display">
                SYSTEM STATUS
              </h3>
              
              <div 
                className="p-3.5 rounded-xl border border-white/10 bg-white/5 transition-all text-left space-y-2.5"
                id="system-status-widget"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-white font-mono">{status?.connectedCameras ?? '—'}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-semibold leading-none">Connected Cameras</p>

                {/* Subsystem Health Matrix */}
                <div className="border-t border-white/5 pt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Backend API</span>
                    <span className={`font-semibold uppercase tracking-wider text-[10px] ${status?.backendStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                      {status?.backendStatus ?? 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Database Core</span>
                    <span className={`font-semibold uppercase tracking-wider text-[10px] ${status?.databaseStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                      {status?.databaseStatus ?? 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">CV Engine Node</span>
                    <span className={`font-semibold uppercase tracking-wider text-[10px] ${status?.cvEngineStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                      {status?.cvEngineStatus ?? 'Loading...'}
                    </span>
                  </div>
                </div>

                {/* Platform Health Score Bar */}
                {status && (
                  <div className="pt-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                      <span>Platform Health</span>
                      <span className="font-mono text-white font-bold">{Math.round(status.platformHealth * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${status.platformHealth * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Integrity Banner */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-950/40 border border-blue-500/20 text-xs text-left">
                <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1 font-display">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Platform Integrity</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Physics-informed FFT networks active. Telemetry channels fully guarded.
                </p>
              </div>
            </div>

          </aside>

          {/* Right Main Page Panel */}
          <div className="flex-1 w-full min-w-0">
            <Outlet />
          </div>

        </div>
      </main>

      {/* Global Secure Footer */}
      <footer className="w-full border-t border-white/10 bg-[#030712]/90 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white font-display">SPECTRAGUARD</span>
            <span>— Real-time Physics-Informed Surveillance Cryptography</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Security Audit</span>
            <span className="hover:text-white cursor-pointer transition-colors">API Compliance</span>
            <span className="text-slate-500">© 2026 SpectraGuard Inc.</span>
          </div>
        </div>
      </footer>

      {/* Overlays Drawers */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearNotifications={() => setNotifications([])}
      />
    </div>
  );
};

export default AppShell;
