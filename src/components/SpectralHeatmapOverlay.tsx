import { cn } from "@/lib/utils"

export interface HeatmapCell {
  /** column/row index on the working grid (0-based) */
  x: number
  y: number
  /** 0–1 SHAP attribution intensity for this cell */
  weight: number
}

/**
 * SpectralHeatmapOverlay — Bible Spec §17
 *
 * Renders SHAP attribution as a grid overlay aligned to the model's
 * 512×512 WORKING GRID resolution — not the camera's native capture
 * resolution. `gridSize` defaults to 16x16 cells (32px each on the working
 * grid) and is intentionally decoupled from the source frame's pixel size;
 * callers must not assume 1:1 mapping to native camera pixels.
 */
export function SpectralHeatmapOverlay({
  cells,
  gridSize = 16,
  className,
}: {
  cells: HeatmapCell[]
  gridSize?: number
  className?: string
}) {
  return (
    <div
      className={cn("relative aspect-square w-full overflow-hidden rounded-md bg-panel-raised", className)}
      data-testid="spectral-heatmap-overlay"
      data-grid-basis="512x512"
      role="img"
      aria-label="SHAP attribution heatmap, aligned to the 512x512 working grid (not native camera resolution)"
    >
      <div
        className="grid h-full w-full"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize
          const y = Math.floor(i / gridSize)
          const cell = cells.find((c) => c.x === x && c.y === y)
          const w = cell?.weight ?? 0
          return (
            <div
              key={i}
              style={{
                backgroundColor: `rgba(255,90,82,${Math.max(0, Math.min(1, w))})`,
              }}
            />
          )
        })}
      </div>
      <div className="pointer-events-none absolute bottom-1 right-1.5 font-mono text-[9px] text-ink-faint">
        512×512 working grid
      </div>
    </div>
  )
}
