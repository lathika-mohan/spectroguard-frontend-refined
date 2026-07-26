import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkers } from "@/state/useLiveData"
import { RotateCw, Cpu } from "lucide-react"

const statusVariant: Record<string, "live" | "warn" | "alarm"> = {
  healthy: "live",
  degraded: "warn",
  restarting: "alarm",
}

export function HealthPanel() {
  const { data: workers } = useWorkers()
  const restarting = workers.filter((w) => w.status === "restarting").length

  return (
    <AppShell
      title="System / Worker Health"
      subtitle={restarting > 0 ? `${restarting} worker restarting — visible, not hidden` : "All workers nominal"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workers.map((w) => (
          <Card key={w.id} className={w.status === "restarting" ? "border-alarm/40" : undefined}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 normal-case tracking-normal">
                  <Cpu className="h-4 w-4 text-ink-dim" strokeWidth={1.75} />
                  {w.name}
                </CardTitle>
                <CardDescription>{w.role}</CardDescription>
              </div>
              <Badge variant={statusVariant[w.status]}>
                {w.status === "restarting" && <RotateCw className="h-3 w-3 animate-spin" />}
                {w.status}
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-mono text-sm text-ink">{w.uptime}</p>
                <p className="text-[11px] text-ink-dim">uptime</p>
              </div>
              <div>
                <p className={"font-mono text-sm " + (w.restarts24h > 0 ? "text-warn" : "text-ink")}>
                  {w.restarts24h}
                </p>
                <p className="text-[11px] text-ink-dim">restarts/24h</p>
              </div>
              <div>
                <p className={"font-mono text-sm " + (w.queueDepth > 20 ? "text-alarm" : "text-ink")}>
                  {w.queueDepth}
                </p>
                <p className="text-[11px] text-ink-dim">queue depth</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}
