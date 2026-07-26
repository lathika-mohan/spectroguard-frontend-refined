import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ConfidenceBadge } from "@/components/ConfidenceBadge"

describe("ConfidenceBadge", () => {
  it("renders the confidence as a rounded percentage", () => {
    render(<ConfidenceBadge confidence={0.874} />)
    expect(screen.getByTestId("confidence-badge")).toHaveTextContent("87%")
  })

  it("marks itself as display-only via title/sr-only text, never implying it drove the decision", () => {
    render(<ConfidenceBadge confidence={0.5} />)
    const badge = screen.getByTestId("confidence-badge")
    expect(badge).toHaveAttribute("title", expect.stringContaining("display only"))
  })
})
