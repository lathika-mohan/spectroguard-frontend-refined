import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DecisionPathTag } from "@/components/DecisionPathTag"

describe("DecisionPathTag", () => {
  it("labels the standard path unambiguously", () => {
    render(<DecisionPathTag path="standard" />)
    expect(screen.getByTestId("decision-path-tag")).toHaveTextContent(/standard path/i)
  })

  it("labels the fast path unambiguously", () => {
    render(<DecisionPathTag path="fast" />)
    expect(screen.getByTestId("decision-path-tag")).toHaveTextContent(/fast path/i)
  })
})
