import { AppShell } from "@/components/layout/AppShell"
import { ShieldCheck } from "lucide-react"

export function EmptyState() {
  return (
    <AppShell title="Alert Feed" subtitle="0 unacknowledged events">
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-live/30 bg-live-dim">
          <span className="absolute h-full w-full animate-ping rounded-full bg-live/10" />
          <ShieldCheck className="h-7 w-7 text-live" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-lg font-semibold text-ink">No active alerts</h2>
        <p className="max-w-sm text-sm text-ink-dim">
          All 9 cameras are reporting nominal. New detections will appear here the moment they're classified.
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-faint">Last event cleared 00:14:22 ago</p>
      </div>
    </AppShell>
  )
}
