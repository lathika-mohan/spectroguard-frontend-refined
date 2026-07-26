import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { Camera } from "@/lib/mockData"
import { Video, VideoOff } from "lucide-react"

const statusStyle: Record<string, string> = {
  live: "border-hairline",
  alarm: "border-alarm shadow-[0_0_0_1px_rgba(255,90,82,0.4)]",
  warn: "border-warn/60",
  offline: "border-hairline opacity-60",
}

export function CameraTile({ camera }: { camera: Camera }) {
  const isOffline = camera.status === "offline"
  const isAlarm = camera.status === "alarm"

  return (
    <Link
      to={`/camera/${camera.id}`}
      className={cn(
        "group relative aspect-video overflow-hidden rounded-lg border bg-panel-raised transition-transform hover:scale-[1.01]",
        statusStyle[camera.status]
      )}
    >
      {/* Simulated live feed texture */}
      {!isOffline ? (
        <div
          className="absolute inset-0 animate-noise opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 0.5px, transparent 0.5px)",
            backgroundSize: "3px 3px",
          }}
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          isAlarm ? "from-alarm/10 via-transparent to-transparent" : "from-live/5 via-transparent to-transparent"
        )}
      />

      {!isOffline && <div className="scanlines absolute inset-0" />}
      {!isOffline && (
        <div className="absolute inset-x-0 top-0 h-16 animate-sweep bg-gradient-to-b from-white/5 to-transparent" />
      )}

      {isOffline && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-faint">
          <VideoOff className="h-6 w-6" strokeWidth={1.5} />
          <span className="font-mono text-[11px] uppercase tracking-wide">Signal lost</span>
        </div>
      )}

      {/* Top bar: REC + camera id */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
        <div className="flex items-center gap-1.5">
          {!isOffline && (
            <>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full animate-blink-rec",
                  isAlarm ? "bg-alarm" : "bg-live"
                )}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/80">
                {isAlarm ? "alarm" : "rec"}
              </span>
            </>
          )}
        </div>
        <span className="font-mono text-[10px] text-ink-faint">{camera.id}</span>
      </div>

      {/* Bottom label */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-3 pt-6">
        <div className="flex items-center gap-1.5 text-ink">
          <Video className="h-3.5 w-3.5 text-ink-dim" strokeWidth={1.75} />
          <span className="text-sm font-medium">{camera.name}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-ink-dim">{camera.zone}</p>
        {camera.lastEvent && (
          <p className="mt-1 font-mono text-[10px] text-alarm">{camera.lastEvent}</p>
        )}
      </div>
    </Link>
  )
}
