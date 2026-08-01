import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { usePlatformStatus } from '../../hooks/usePlatformStatus';
import { useAuth } from '../../hooks/useAuth';
import { BackgroundLoopCanvas } from '../BackgroundLoopCanvas';
import { ShieldCheck, HardDrive, RefreshCw } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading: userLoading } = useUser();
  const { status, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = usePlatformStatus();
  const { logout } = useAuth();

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/cameras' && location.pathname.includes('/forensics')) return true;
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen w-full bg-[#030712] overflow-hidden relative text-white">
      {/* Seamless looping background animation canvas */}
      <BackgroundLoopCanvas />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar (Platform Status Section 3) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#080c14]/90 backdrop-blur-md text-white flex-shrink-0 shadow-2xl border-r border-white/10 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between`}>
        <div className="flex flex-col flex-1">
          <div className="p-4 border-b border-white/10 tracking-wider flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-sm tracking-widest font-['SF_Pro_Display']">SPECTRAGUARD</span>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <nav className="p-4 space-y-2">
            <Link 
              to="/dashboard" 
              className={`block px-4 py-2 rounded-xl transition-all font-semibold text-sm ${isActive('/dashboard') ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/cameras" 
              className={`block px-4 py-2 rounded-xl transition-all font-semibold text-sm ${isActive('/cameras') ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              Cameras
            </Link>
            <Link 
              to="/settings" 
              className={`block px-4 py-2 rounded-xl transition-all font-semibold text-sm ${isActive('/settings') ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Section 3: Platform Status widget inside Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Platform Status</span>
            </h3>
            <button 
              onClick={refetchStatus}
              className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Refresh status"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {statusLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
              <div className="h-3 bg-white/5 rounded w-1/2"></div>
            </div>
          ) : statusError ? (
            <div className="text-[11px] text-rose-400 bg-rose-500/5 border border-rose-500/20 p-2 rounded-lg text-center font-medium">
              Backend Connection Offline
            </div>
          ) : status ? (
            <div className="space-y-2.5 text-[11px] font-['SF_Pro_Text']">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Backend Core</span>
                <span className={`inline-flex items-center gap-1 font-bold ${status.backendStatus === 'online' || status.backendStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.backendStatus === 'online' || status.backendStatus === 'healthy' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                  {status.backendStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database</span>
                <span className={`inline-flex items-center gap-1 font-bold ${status.databaseStatus === 'online' || status.databaseStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.databaseStatus === 'online' || status.databaseStatus === 'healthy' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                  {status.databaseStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">CV Engine</span>
                <span className={`inline-flex items-center gap-1 font-bold ${status.cvEngineStatus === 'online' || status.cvEngineStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.cvEngineStatus === 'online' || status.cvEngineStatus === 'healthy' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                  {status.cvEngineStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-gray-400">Connected Feeds</span>
                <span className="font-mono font-bold text-blue-400">{status.connectedCameras}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Platform Health</span>
                <span className="font-mono font-bold text-emerald-400">
                  {typeof status.platformHealth === 'number' 
                    ? `${(status.platformHealth * 100).toFixed(1)}%` 
                    : status.platformHealth}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden w-full min-w-0 bg-transparent">
        
        {/* Responsive Topbar (Section 1: Header) */}
        <header className="h-16 bg-[#080c14]/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-30">
          <div className="flex items-center min-w-0">
            <button
              className="md:hidden mr-3 text-gray-400 hover:text-white focus:outline-none p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-base font-bold tracking-tight text-white font-['SF_Pro_Display'] truncate">
              SURVEILLANCE INTEGRITY COMMAND
            </h2>
          </div>

          <div className="flex items-center space-x-4 ml-4 shrink-0">
            {/* Operator profile display */}
            {userLoading ? (
              <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-white/15 object-cover shadow-inner"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow-inner font-mono">
                    {(user.name || user.username || 'OP').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight font-['SF_Pro_Display']">
                    {user.name || user.username || 'Security Operator'}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-none mt-0.5">
                    {user.role || 'Operator'}
                  </div>
                </div>
              </div>
            ) : null}

            <button 
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 text-[11px] font-bold text-gray-300 hover:text-rose-400 transition-all font-['SF_Pro_Text'] cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow p-4 sm:p-6 overflow-x-hidden overflow-y-auto relative w-full bg-transparent">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppShell;
