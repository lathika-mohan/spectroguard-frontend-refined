import { AppShell } from "@/components/layout/AppShell"
import { CameraTile } from "@/components/CameraTile"
import { Badge } from "@/components/ui/badge"
import { useCameras } from "@/state/useLiveData"

export function LiveStreamGrid() {
  const { data: cameras, loading } = useCameras()
  const liveCount = cameras.filter((c) => c.status === "live").length
  const alarmCount = cameras.filter((c) => c.status === "alarm").length
  const offlineCount = cameras.filter((c) => c.status === "offline").length

  return (
    <AppShell title="Live Stream Grid" subtitle={`${cameras.length} cameras · ${liveCount} nominal`}>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge variant="live">{liveCount} live</Badge>
        {alarmCount > 0 && <Badge variant="alarm">{alarmCount} alarm</Badge>}
        {offlineCount > 0 && <Badge variant="neutral">{offlineCount} offline</Badge>}
      </div>

      {loading ? (
        <p className="text-sm text-ink-dim">Loading camera feeds…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cameras.map((camera) => (
            <CameraTile key={camera.id} camera={camera} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
