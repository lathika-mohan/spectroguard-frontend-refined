import React from "react";
import { useParams, Link } from "react-router-dom";
import { mockCameras } from "@/lib/mockData";
import type { CameraStatus } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export function CameraDetail() {
  const { cameraId } = useParams<{ cameraId: string }>();
  const camera = mockCameras.find((c) => c.id === cameraId);

  if (!camera) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-display font-bold">Camera Not Found</h2>
        <Link to="/dashboard" className="text-sm text-primary hover:underline mt-2 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const renderStatusBadge = (status: CameraStatus) => {
    switch (status) {
      case "alarm":
        return <Badge variant="alarm" className="animate-pulse">ALARM</Badge>;
      case "warn":
        return <Badge variant="warn">WARN</Badge>;
      case "offline":
        return <Badge variant="neutral">OFFLINE</Badge>;
      case "live":
      default:
        return <Badge variant="live">LIVE</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-display font-bold">{camera.name}</h1>
        {renderStatusBadge(camera.status)}
      </div>
      <div className="border rounded-lg p-4 bg-card font-mono text-sm space-y-2 max-w-md">
        <p><span className="opacity-60">ID:</span> {camera.id}</p>
        <p><span className="opacity-60">ZONE:</span> {camera.zone}</p>
        <p><span className="opacity-60">LAST EVENT:</span> {camera.lastEvent || "None"}</p>
        <p><span className="opacity-60">STREAM SPECS:</span> 3840×2160 · 24fps (Simulated)</p>
      </div>
    </div>
  );
}
