import { useParams, Link } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCameras, useAlerts } from "@/state/useLiveData"
import { ArrowLeft, Maximize2, Volume2 } from "lucide-react"

export function CameraDetail() {
  const { cameraId } = useParams<{ cameraId: string }>()
  const { data: cameras, loading } = useCameras()
  const { alerts } = useAlerts()
  const camera = cameras.find((c) => c.id === cameraId)
  const cameraAlerts = alerts.filter((a) => a.cameraId === cameraId)

  if (loading) {
    return (
      <AppShell title="Camera">
        <p className="text-sm text-ink-dim">Loading camera…</p>
      </AppShell>
    )
  }

  if (!camera) {
    return (
      <AppShell title="Camera">
        <p className="text-sm text-ink-dim">Camera not found.</p>
      </AppShell>
    )
  }

  const isOffline = camera.status === "offline"

  return (
    <AppShell title={camera.name} subtitle={camera.zone}>
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-xs text-ink-dim hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to live grid
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="relative aspect-video overflow-hidden lg:col-span-2">
          {!isOffline && (
            <>
              <div
                className="absolute inset-0 animate-noise opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.5px, transparent 0.5px)",
                  backgroundSize: "3px 3px",
                }}
              />
              <div className="scanlines absolute inset-0" />
              <div className="absolute inset-x-0 top-0 h-20 animate-sweep bg-gradient-to-b from-white/5 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-live animate-blink-rec" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/80">rec</span>
              </div>
              <div className="absolute right-3 top-3 flex gap-2">
                <Volume2 className="h-4 w-4 text-ink-dim" strokeWidth={1.75} />
                <Maximize2 className="h-4 w-4 text-ink-dim" strokeWidth={1.75} />
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-ink-faint">
                {camera.id} · 3840×2160 · 24fps
              </div>
            </>
          )}
          {isOffline && (
            <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-ink-faint">
              Signal lost — last frame unavailable
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-dim">Health</span>
                <Badge variant={camera.status === "alarm" ? "alarm" : camera.status === "offline" ? "neutral" : "live"}>
                  {camera.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-dim">Zone</span>
                <span className="text-ink">{camera.zone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-dim">Bitrate</span>
                <span className="font-mono text-ink">{isOffline ? "—" : "6.2 Mbps"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent events</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {cameraAlerts.length === 0 && (
                <p className="text-sm text-ink-dim">No recent events on this camera.</p>
              )}
              {cameraAlerts.map((a) => (
                <Link
                  key={a.id}
                  to={`/forensics/${a.id}`}
                  className="flex items-center justify-between rounded-md border border-hairline px-3 py-2 text-sm hover:bg-panel-raised"
                >
                  <span className="text-ink">{a.label}</span>
                  <span className="font-mono text-[11px] text-ink-faint">{a.timestamp}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Button variant="outline" size="sm">Export clip (last 60s)</Button>
        </div>
      </div>
    </AppShell>
  )
}
