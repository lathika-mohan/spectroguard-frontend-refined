import React from "react";
import { Link } from "react-router-dom";
import type { Camera } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface CameraTileProps {
  camera: Camera;
}

const statusStyles: Record<Camera["status"], string> = {
  live: "border-[var(--color-live)] text-[var(--color-live)]",
  warn: "border-[var(--color-warn)] text-[var(--color-warn)]",
  alarm: "border-[var(--color-alarm)] text-[var(--color-alarm)] animate-pulse",
  offline: "border-muted text-muted",
};

export function CameraTile({ camera }: CameraTileProps) {
  const isAlarm = camera.status === "alarm";
  const isWarn = camera.status === "warn";
  const isOffline = camera.status === "offline";

  const currentStyle = statusStyles[camera.status] || statusStyles.live;

  return (
    <Link
      to={`/camera/${camera.id}`}
      className={cn(
        "relative flex flex-col justify-between p-4 border rounded-lg bg-card transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
        currentStyle
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay overflow-hidden rounded-lg">
        <div className="w-full h-full bg-noise-shift" />
        <div className="w-full h-full bg-scanline" />
        <div className="w-full h-[10%] bg-sweep absolute top-0" />
      </div>

      <div className="relative z-10 flex justify-between items-start">
        <h3 className="font-display font-semibold tracking-tight">{camera.name}</h3>
        <div className="flex items-center gap-2">
          {!isOffline && (
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isAlarm ? "bg-[var(--color-alarm)] animate-ping" : 
                isWarn ? "bg-[var(--color-warn)]" : "bg-[var(--color-live)]"
              )}
            />
          )}
          <span className="text-xs font-mono uppercase opacity-80">
            {isAlarm ? "REC/ALARM" : isWarn ? "WARN" : isOffline ? "OFFLINE" : "REC"}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <p className="text-sm opacity-80 font-mono">ID: {camera.id}</p>
        <p className="text-sm opacity-80 font-mono">ZONE: {camera.zone}</p>
      </div>
    </Link>
  );
}
