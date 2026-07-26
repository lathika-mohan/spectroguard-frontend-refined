import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SpectralHeatmapOverlay } from "@/components/SpectralHeatmapOverlay"

describe("SpectralHeatmapOverlay", () => {
  it("declares its grid basis as the 512x512 working grid, not native camera resolution", () => {
    render(<SpectralHeatmapOverlay cells={[{ x: 0, y: 0, weight: 0.5 }]} />)
    const el = screen.getByTestId("spectral-heatmap-overlay")
    expect(el).toHaveAttribute("data-grid-basis", "512x512")
    expect(el).toHaveAccessibleName(expect.stringContaining("512x512 working grid"))
  })
})
