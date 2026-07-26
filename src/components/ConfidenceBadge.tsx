import { cn } from "@/lib/utils"

/**
 * ConfidenceBadge — Bible Spec §13
 *
 * Displays a model confidence score. This value is DISPLAY-ONLY: it is a
 * Platt-scaled probability estimate surfaced for operator context and does
 * NOT drive the alarm/no-alarm decision (that comes from DecisionPathTag /
 * the detection pipeline's thresholding, see docs/CONTRACTS.md).
 */
export function ConfidenceBadge({
  confidence,
  className,
}: {
  /** 0–1 Platt-scaled confidence score from the classifier */
  confidence: number
  className?: string
}) {
  const pct = Math.round(confidence * 100)
  const tier = pct >= 90 ? "high" : pct >= 70 ? "medium" : "low"
  const tierStyle: Record<string, string> = {
    high: "border-alarm/30 bg-alarm-dim text-alarm",
    medium: "border-warn/30 bg-warn-dim text-warn",
    low: "border-hairline bg-panel-raised text-ink-dim",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium",
        tierStyle[tier],
        className
      )}
      title="Platt-scaled model confidence — display only, not the alarm decision"
      data-testid="confidence-badge"
    >
      {pct}% conf.
      <span className="sr-only"> (display-only, does not drive alarm decision)</span>
    </span>
  )
}
