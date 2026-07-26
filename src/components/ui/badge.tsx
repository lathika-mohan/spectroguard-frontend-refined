import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        live: "border-live/30 bg-live-dim text-live",
        alarm: "border-alarm/30 bg-alarm-dim text-alarm",
        warn: "border-warn/30 bg-warn-dim text-warn",
        evidence: "border-evidence/30 bg-evidence-dim text-evidence",
        neutral: "border-hairline bg-panel-raised text-ink-dim",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
