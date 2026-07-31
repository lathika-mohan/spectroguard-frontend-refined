import React from 'react';
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { CameraTile } from "../src/components/CameraTile";

describe("CameraTile", () => {
  it("links to the camera detail route for real navigation (Bible §review P0-3)", () => {
    render(
      <BrowserRouter>
        <CameraTile
          camera={{
            id: "cam-01",
            name: "Main Entrance",
            location: "Building A",
            status: "online",
            integrityScore: 0.94,
          }}
        />
      </BrowserRouter>
    )
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/forensics/cam-01");
  });
});

