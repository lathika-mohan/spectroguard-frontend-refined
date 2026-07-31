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

const MOCK_DELAY_MS = 800

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS))

class WebhookClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_WEBHOOK_BASE_URL || ""
  }

  async getCameras(): Promise<Camera[]> {
    if (!this.baseUrl) {
      return delay(mockCameras)
    }
    return delay(mockCameras) 
  }

  async getAlerts(): Promise<Alert[]> {
    if (!this.baseUrl) {
      return delay(mockAlerts)
    }
    return delay(mockAlerts)
  }

  async getWorkers(): Promise<WorkerNode[]> {
    if (!this.baseUrl) {
      return delay(mockWorkers)
    }
    return delay(mockWorkers)
  }

  // FIX: Added leading underscore to allow lint compilation clearance on mock signatures
  async acknowledgeAlert(_alertId: string): Promise<{ ok: boolean }> {
    if (!this.baseUrl) {
      return delay({ ok: true })
    }
    return delay({ ok: true })
  }

  async getForensicPackage(alertId: string): Promise<ForensicPackage | undefined> {
    if (!this.baseUrl) {
      const pkg = mockForensicPackages.find((p) => p.alertId === alertId)
      return delay(pkg)
    }
    
    const pkg = mockForensicPackages.find((p) => p.alertId === alertId)
    return delay(pkg)
  }
}

export const webhookClient = new WebhookClient()
