import { useParams, Link } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useForensicPackage } from "@/state/useLiveData"
import { DecisionPathTag } from "@/components/DecisionPathTag"
import { SpectralHeatmapOverlay } from "@/components/SpectralHeatmapOverlay"
import { ShieldCheck, Copy, ChevronRight } from "lucide-react"

export function ForensicPackageViewer() {
  const { alertId } = useParams<{ alertId: string }>()
  const { pkg, loading } = useForensicPackage(alertId)

  if (loading) {
    return (
      <AppShell title="Forensic Package Viewer">
        <p className="text-sm text-ink-dim">Loading forensic package…</p>
      </AppShell>
    )
  }

  if (!pkg) {
    return (
      <AppShell title="Forensic Package">
        <Card>
          <CardContent className="p-8 text-center text-sm text-ink-dim">
            No forensic package found for <span className="font-mono">{alertId}</span>.
            <div className="mt-4">
              <Link to="/alerts">
                <Button variant="outline" size="sm">Back to alert feed</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AppShell>
    )
  }

  const maxWeight = Math.max(...pkg.shapFactors.map((f) => Math.abs(f.weight)))

  return (
    <AppShell title="Forensic Package Viewer" subtitle={`${pkg.id} · ${pkg.cameraName}`}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Decision path */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Decision path</CardTitle>
              <CardDescription>Sequence of checks that produced this alert</CardDescription>
            </div>
            <DecisionPathTag path={pkg.pathType} />
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {pkg.decisionPath.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[10px] text-ink-dim">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink">{step}</span>
                  {i < pkg.decisionPath.length - 1 && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint" />
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* SHAP factors / heatmap */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>SHAP contribution heatmap</CardTitle>
            <CardDescription>Feature weight toward the ALARM classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
              <SpectralHeatmapOverlay cells={pkg.heatmapCells} />
              <p className="self-center text-xs text-ink-dim">
                Attribution rendered on the model's 512×512 working grid, aligned to the frame at
                classification time — not the camera's native capture resolution.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {pkg.shapFactors.map((f) => {
                const pct = (Math.abs(f.weight) / maxWeight) * 100
                const positive = f.weight >= 0
                return (
                  <div key={f.factor}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-ink-dim">{f.factor}</span>
                      <span className={"font-mono " + (positive ? "text-alarm" : "text-live")}>
                        {positive ? "+" : ""}
                        {f.weight.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-panel-raised">
                      <div
                        className={"h-full rounded-full " + (positive ? "bg-alarm" : "bg-live")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Signed metadata */}
        <Card className="lg:col-span-5">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-evidence" strokeWidth={1.75} />
                Signed metadata
              </CardTitle>
              <CardDescription>Chain-of-custody record, immutable once signed</CardDescription>
            </div>
            <Badge variant="evidence">Verified</Badge>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-ink-dim">Signed at</dt>
                <dd className="font-mono text-sm text-ink">{pkg.signedAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-dim">Signed by</dt>
                <dd className="font-mono text-sm text-ink">{pkg.operator}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-dim">NTP offset at signing</dt>
                <dd className="font-mono text-sm text-ink">{pkg.ntpOffsetMs} ms</dd>
              </div>
              <div className="sm:col-span-3">
                <dt className="text-xs text-ink-dim">Hash</dt>
                <dd className="flex items-center gap-2">
                  <span className="truncate font-mono text-sm text-ink">{pkg.signedHash}</span>
                  <Copy className="h-3.5 w-3.5 shrink-0 cursor-pointer text-ink-faint hover:text-ink-dim" />
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
