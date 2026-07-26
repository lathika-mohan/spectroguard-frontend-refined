import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const thresholds = [
  { name: "Person detection confidence", value: "0.85", zone: "Global" },
  { name: "Loitering duration", value: "240s", zone: "Perimeter" },
  { name: "After-hours window", value: "18:00 – 06:00", zone: "Interior" },
  { name: "Unattended object delay", value: "90s", zone: "Global" },
  { name: "Restart alert threshold", value: "2 restarts / 24h", zone: "System" },
]

export function Settings() {
  return (
    <AppShell title="Thresholds" subtitle="Read-only — contact calibration lead to change">
      <Card>
        <CardHeader>
          <CardTitle>Active detection thresholds</CardTitle>
          <CardDescription>Values currently applied by the detection pipeline</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-hairline">
            {thresholds.map((t) => (
              <div key={t.name} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-ink">{t.name}</p>
                  <p className="text-[11px] text-ink-dim">{t.zone}</p>
                </div>
                <span className="font-mono text-sm text-ink">{t.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Badge variant="evidence">Calibrated 2026-07-20 · signed by ops lead</Badge>
      </div>
    </AppShell>
  )
}
