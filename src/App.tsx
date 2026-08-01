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

import Dashboard from './views/Dashboard';
import { LoginPage } from '../legacy_archive/LoginPage';
import LandingPage from './landing_page/App';
import CameraAnalysis from './views/CameraAnalysis';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('spectraguard_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', backgroundColor:'#111', color:'#06b6d4', fontFamily:'monospace'}}>Loading SpectraGuard UI...</div>}>
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
      </AppProvider>
    </GlobalErrorBoundary>
  );
}
