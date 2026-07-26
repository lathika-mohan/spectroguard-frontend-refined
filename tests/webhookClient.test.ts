import { describe, it, expect } from "vitest"
import { webhookClient } from "@/api/webhookClient"

describe("webhookClient (mock-backed, no VITE_WEBHOOK_BASE_URL set)", () => {
  it("resolves the fixture cameras", async () => {
    const cameras = await webhookClient.getCameras()
    expect(cameras.length).toBeGreaterThan(0)
    expect(cameras[0]).toHaveProperty("id")
  })

  it("resolves the fixture alerts, each with a pathType (Spec §14/§17)", async () => {
    const alerts = await webhookClient.getAlerts()
    expect(alerts.length).toBeGreaterThan(0)
    for (const a of alerts) {
      expect(["standard", "fast"]).toContain(a.pathType)
    }
  })

  it("acknowledges an alert", async () => {
    const result = await webhookClient.acknowledgeAlert("evt-88213")
    expect(result.ok).toBe(true)
  })

  it("returns a forensic package with heatmap cells aligned to the working grid", async () => {
    const pkg = await webhookClient.getForensicPackage("evt-88213")
    expect(pkg).toBeDefined()
    expect(pkg?.heatmapCells.length).toBeGreaterThan(0)
  })

  it("returns undefined for an unknown alert id", async () => {
    const pkg = await webhookClient.getForensicPackage("evt-nonexistent")
    expect(pkg).toBeUndefined()
  })
})
