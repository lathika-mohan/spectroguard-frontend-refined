import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CameraTile } from "@/components/CameraTile"
import type { Camera } from "@/lib/mockData"

const camera: Camera = { id: "cam-01", name: "Loading Dock A", zone: "Perimeter", status: "alarm", lastEvent: "Intrusion" }

describe("CameraTile", () => {
  it("links to the camera detail route for real navigation (Bible §review P0-3)", () => {
    render(
      <MemoryRouter>
        <CameraTile camera={camera} />
      </MemoryRouter>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/camera/cam-01")
  })
})
