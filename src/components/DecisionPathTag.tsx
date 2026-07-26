import { cn } from "@/lib/utils"
import { Zap, ListOrdered } from "lucide-react"

export type DecisionPath = "standard" | "fast"

/**
 * DecisionPathTag — Bible Spec §14 / §17
 *
 * Unambiguously shows whether an alert was produced via the STANDARD
 * multi-stage pipeline (detect → track → classify → SHAP explain → sign)
 * or the FAST PATH (reduced-latency route for high-severity, high-confidence
 * events — see docs/CONTRACTS.md for the exact trigger conditions).
 */
export function DecisionPathTag({ path, className }: { path: DecisionPath; className?: string }) {
  const isFast = path === "fast"
  const Icon = isFast ? Zap : ListOrdered

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        isFast ? "border-warn/30 bg-warn-dim text-warn" : "border-hairline bg-panel-raised text-ink-dim",
        className
      )}
      data-testid="decision-path-tag"
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {isFast ? "Fast path" : "Standard path"}
    </span>
  )
}
