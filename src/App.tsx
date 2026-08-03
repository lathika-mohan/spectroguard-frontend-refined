import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// 🚨 GLOBAL ERROR BOUNDARY: Catches silent crashes and displays them on screen 🚨
class GlobalErrorBoundary extends React.Component<any, { hasError: boolean, error: any, errorInfo: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) { this.setState({ errorInfo }); console.error(error); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#111', color: '#ff4444', height: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ borderBottom: '1px solid #ff4444', paddingBottom: '1rem' }}>SpectraGuard UI Runtime Crash</h2>
          <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}><strong>Error:</strong> {this.state.error?.toString()}</p>
          <pre style={{ overflow: 'auto', padding: '1rem', backgroundColor: '#222', marginTop: '1rem', color: '#ccc' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AuthProvider, useAuthContext, AuthStatus } from './context/AuthContext';
import Dashboard from './views/Dashboard';
import { LoginPage } from '../legacy_archive/LoginPage';
import LandingPage from './landing_page/App';
import CameraAnalysis from './views/CameraAnalysis';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white font-mono select-none">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 mb-2 animate-pulse">
          <ShieldCheck className="h-6 w-6 text-cyan-400" />
          <span className="font-bold tracking-widest text-sm text-cyan-400">SPECTRAGUARD</span>
        </div>
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin"></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Initializing Workspace...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = () => {
  const { user, status, initializeUser, isLoading } = useAuthContext();
  const token = localStorage.getItem('spectraguard_token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken');

  useEffect(() => {
    if (token && status === AuthStatus.UNINITIALIZED) {
      initializeUser();
    }
  }, [token, status, initializeUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard defaultTab="Dashboard" />} />
                  <Route path="predictions" element={<Dashboard defaultTab="Predictions" />} />
                  <Route path="cameras" element={<Dashboard defaultTab="Cameras" />} />
                  <Route path="vault" element={<Dashboard defaultTab="Vault" />} />
                  <Route path="settings" element={<Dashboard defaultTab="Settings" />} />
                  <Route path="cameras/analysis/:predictionId" element={<CameraAnalysis />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </GlobalErrorBoundary>
  );
}
