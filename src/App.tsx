import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "@/views/LoginPage"
import { LiveStreamGrid } from "@/views/LiveStreamGrid"
import { AlertFeed } from "@/views/AlertFeed"
import { ForensicPackageViewer } from "@/views/ForensicPackageViewer"
import { CameraDetail } from "@/views/CameraDetail"
import { HealthPanel } from "@/views/HealthPanel"
import { EmptyState } from "@/views/EmptyState"
import { Settings } from "@/views/Settings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<LiveStreamGrid />} />
        <Route path="/alerts" element={<AlertFeed />} />
        <Route path="/alerts/empty" element={<EmptyState />} />
        <Route path="/forensics/:alertId" element={<ForensicPackageViewer />} />
        <Route path="/camera/:cameraId" element={<CameraDetail />} />
        <Route path="/health" element={<HealthPanel />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
