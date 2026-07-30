import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import NotFound from './pages/NotFound';

// Safely resolve modules whether they use default or named exports by bypassing strict module typing on dynamic imports
const Dashboard = React.lazy(() => import('./views/Dashboard').then((m: any) => ({ default: m.default || m.Dashboard })).catch(() => ({ default: () => <div className="p-6">Dashboard Loading...</div> })));
const Cameras = React.lazy(() => import('./views/Cameras').then((m: any) => ({ default: m.default || m.Cameras })).catch(() => ({ default: () => <div className="p-6">Cameras Loading...</div> })));
const Forensics = React.lazy(() => import('./views/Forensics').then((m: any) => ({ default: m.default || m.Forensics })).catch(() => ({ default: () => <div className="p-6">Forensics Loading...</div> })));
const Settings = React.lazy(() => import('./views/Settings').then((m: any) => ({ default: m.default || m.Settings })).catch(() => ({ default: () => <div className="p-6">Settings Loading...</div> })));

const App: React.FC = () => {
  return (
    <Router>
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading SpectraGuard...</div>}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cameras" element={<Cameras />} />
            <Route path="/cameras/:id" element={<Forensics />} />
            <Route path="/forensics/:id" element={<Forensics />} />
            <Route path="/settings" element={<Settings />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
