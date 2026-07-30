import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/cameras' && location.pathname.includes('/forensics')) return true;
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex-shrink-0 shadow-lg border-r border-gray-800 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-4 text-xl font-bold border-b border-gray-800 tracking-wider flex justify-between items-center">
          <span>SpectraGuard</span>
          <button 
            className="md:hidden text-gray-400 hover:text-white focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link 
            to="/dashboard" 
            className={`block px-4 py-2 rounded transition-colors font-medium ${isActive('/dashboard') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/cameras" 
            className={`block px-4 py-2 rounded transition-colors font-medium ${isActive('/cameras') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            Cameras
          </Link>
          <Link 
            to="/settings" 
            className={`block px-4 py-2 rounded transition-colors font-medium ${isActive('/settings') ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden w-full min-w-0">
        
        {/* Responsive Topbar */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center min-w-0">
            <button
              className="md:hidden mr-3 text-gray-600 hover:text-gray-900 focus:outline-none p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 truncate">Integrity Intelligence</h1>
          </div>
          <div className="flex items-center space-x-4 ml-4 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner">
              OP
            </div>
          </div>
        </header>

        {/* Dynamic Route Content (With horizontal overflow protection) */}
        <main className="flex-grow p-4 sm:p-6 overflow-x-hidden overflow-y-auto relative w-full bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppShell;
