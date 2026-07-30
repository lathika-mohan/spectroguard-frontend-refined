import React, { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';

const ShellContext = createContext(false);

interface AppShellProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ title, subtitle, children }) => {
  const isNested = useContext(ShellContext);

  // If used inside an existing view as a wrapper, render a clean header instead of a double sidebar
  if (isNested) {
    return (
      <div className="flex flex-col h-full w-full">
        {(title || subtitle) && (
          <div className="mb-6 border-b border-gray-200 pb-4">
            {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="flex-grow relative">
          {children}
        </div>
      </div>
    );
  }

  // Top-level Router Layout
  return (
    <ShellContext.Provider value={true}>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <aside className="w-64 h-full bg-gray-900 text-white flex-shrink-0 shadow-lg border-r border-gray-800">
          <div className="p-4 text-xl font-bold border-b border-gray-800 tracking-wider">
            SpectraGuard
          </div>
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Dashboard</a>
            <a href="/cameras" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Cameras</a>
            <a href="/settings" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Settings</a>
          </nav>
        </aside>

        <div className="flex flex-col flex-grow overflow-hidden">
          <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <h1 className="text-lg font-semibold text-gray-700">Integrity Intelligence</h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                OP
              </div>
            </div>
          </header>

          <main className="flex-grow p-6 overflow-auto relative">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
};

export { AppShell };
export default AppShell;
