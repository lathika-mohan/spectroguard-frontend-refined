import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-hairline bg-void/60 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-ink-dim">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="live">
          <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-dot" />
          System nominal
        </Badge>
        <span className="font-mono text-xs text-ink-dim tabular-nums">
          {now.toLocaleTimeString("en-US", { hour12: false })} UTC
        </span>
        <div className="h-8 w-8 rounded-full bg-panel-raised border border-hairline flex items-center justify-center font-mono text-[11px] text-ink-dim">
          OP
        </div>
      </div>
    </header>
  )
}
