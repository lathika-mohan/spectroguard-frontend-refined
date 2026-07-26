/**
 * webhookClient — FE-1 (Bible Spec §17)
 *
 * This is the single integration point between the frontend and
 * core-infra's detection webhook. Every view that needs live camera,
 * alert, worker-health, or forensic data goes through this client —
 * never through mockData.ts directly (mockData.ts is imported ONLY
 * here, as the fallback/dev fixture).
 *
 * SWAPPING IN THE REAL BACKEND:
 * Set VITE_WEBHOOK_BASE_URL in your environment (see .env.example).
 * When it is set, each function below calls `fetch(`${BASE_URL}/...`)`
 * against the schema documented in docs/CONTRACTS.md instead of
 * returning the mock fixture. Until that env var is set, every
 * function resolves mock data through a simulated network delay so
 * the UI is exercised the same way it would be in production
 * (loading states, async boundaries, etc.).
 */
import {
  cameras as mockCameras,
  alerts as mockAlerts,
  workers as mockWorkers,
  forensicPackages as mockForensicPackages,
  type Camera,
  type Alert,
  type WorkerNode,
  type ForensicPackage,
} from "@/lib/mockData"

const BASE_URL = import.meta.env.VITE_WEBHOOK_BASE_URL as string | undefined

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { Accept: "application/json" } })
  if (!res.ok) throw new Error(`webhookClient: ${path} responded ${res.status}`)
  return (await res.json()) as T
}

export const webhookClient = {
  async getCameras(): Promise<Camera[]> {
    if (BASE_URL) return getJSON<Camera[]>("/cameras")
    return delay(mockCameras)
  },

  async getAlerts(): Promise<Alert[]> {
    if (BASE_URL) return getJSON<Alert[]>("/alerts")
    return delay(mockAlerts)
  },

  async acknowledgeAlert(alertId: string): Promise<{ ok: true }> {
    if (BASE_URL) {
      const res = await fetch(`${BASE_URL}/alerts/${alertId}/ack`, { method: "POST" })
      if (!res.ok) throw new Error(`webhookClient: ack ${alertId} responded ${res.status}`)
      return { ok: true }
    }
    return delay({ ok: true }, 120)
  },

  async getWorkers(): Promise<WorkerNode[]> {
    if (BASE_URL) return getJSON<WorkerNode[]>("/workers")
    return delay(mockWorkers)
  },

  async getForensicPackage(alertId: string): Promise<ForensicPackage | undefined> {
    if (BASE_URL) {
      try {
        return await getJSON<ForensicPackage>(`/forensics/${alertId}`)
      } catch {
        return undefined
      }
    }
    return delay(mockForensicPackages[alertId])
  },
}

export type WebhookClient = typeof webhookClient
