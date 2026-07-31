import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

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

// Bulletproof dynamic imports (forces React to handle both 'default' and named component exports)
const resolveModule = (importPromise: Promise<any>) => 
  importPromise.then(module => ({ default: module.default || Object.values(module)[0] }));

const AppShell = React.lazy(() => resolveModule(import('./components/layout/AppShell')));
const Dashboard = React.lazy(() => resolveModule(import('./views/Dashboard')));
const Cameras = React.lazy(() => resolveModule(import('./views/Cameras')));
const Forensics = React.lazy(() => resolveModule(import('./views/Forensics')));
const Settings = React.lazy(() => resolveModule(import('./views/Settings')));
const LoginPage = React.lazy(() => resolveModule(import('../legacy_archive/LoginPage')));
const LandingPage = React.lazy(() => resolveModule(import('./landing_page/App')));

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', backgroundColor:'#111', color:'#06b6d4', fontFamily:'monospace'}}>Loading SpectraGuard UI...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="cameras" element={<Cameras />} />
                <Route path="cameras/:id" element={<Forensics />} />
                <Route path="forensics/:id" element={<Forensics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
