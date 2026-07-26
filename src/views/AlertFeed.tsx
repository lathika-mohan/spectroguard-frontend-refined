import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AppShell } from "@/components/layout/AppShell"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Alert } from "@/lib/mockData"
import { ConfidenceBadge } from "@/components/ConfidenceBadge"
import { DecisionPathTag } from "@/components/DecisionPathTag"
import { useAlerts } from "@/state/useLiveData"
import { AlertTriangle, Info, Siren, ArrowRight } from "lucide-react"

const severityBadge: Record<Alert["severity"], { variant: "alarm" | "warn" | "neutral"; icon: typeof Siren }> = {
  critical: { variant: "alarm", icon: Siren },
  warning: { variant: "warn", icon: AlertTriangle },
  info: { variant: "neutral", icon: Info },
}

export function AlertFeed() {
  const { alerts: items, loading, acknowledge } = useAlerts()

  const unacked = items.filter((a) => !a.acknowledged).length

  return (
    <AppShell title="Alert Feed" subtitle={`${unacked} unacknowledged event${unacked === 1 ? "" : "s"}`}>
      {loading && <p className="mb-3 text-sm text-ink-dim">Loading alerts…</p>}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {items.map((alert) => {
            const { variant, icon: Icon } = severityBadge[alert.severity]
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card
                  className={
                    alert.acknowledged
                      ? "opacity-60"
                      : alert.severity === "critical"
                      ? "border-alarm/40"
                      : ""
                  }
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Icon
                          className={
                            "h-4 w-4 " +
                            (alert.severity === "critical"
                              ? "text-alarm"
                              : alert.severity === "warning"
                              ? "text-warn"
                              : "text-ink-dim")
                          }
                          strokeWidth={1.75}
                        />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-ink">{alert.label}</span>
                          <Badge variant={variant}>{alert.severity}</Badge>
                          <ConfidenceBadge confidence={alert.confidence} />
                          <DecisionPathTag path={alert.pathType} />
                        </div>
                        <p className="mt-0.5 text-xs text-ink-dim">{alert.cameraName}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                          {alert.id} · {alert.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      {!alert.acknowledged && (
                        <Button size="sm" variant="subtle" onClick={() => acknowledge(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                      <Link to={`/forensics/${alert.id}`}>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          Forensic package
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
