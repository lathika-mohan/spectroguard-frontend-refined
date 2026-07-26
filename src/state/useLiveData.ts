/**
 * Thin data hooks that route every view through webhookClient (FE-1)
 * instead of importing mockData.ts directly. Swapping the backend
 * (see src/api/webhookClient.ts) requires no changes here or in views.
 */
import { useEffect, useState, useCallback } from "react"
import { webhookClient } from "@/api/webhookClient"
import type { Camera, Alert, WorkerNode, ForensicPackage } from "@/lib/mockData"

function usePolled<T>(fetcher: () => Promise<T>, initial: T, intervalMs?: number) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    let cancelled = false
    fetcher().then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [fetcher])

  useEffect(() => {
    const cancel = reload()
    if (!intervalMs) return cancel
    const id = setInterval(reload, intervalMs)
    return () => {
      cancel()
      clearInterval(id)
    }
  }, [reload, intervalMs])

  return { data, loading, reload }
}

export function useCameras() {
  return usePolled<Camera[]>(webhookClient.getCameras, [])
}

export function useWorkers() {
  return usePolled<WorkerNode[]>(webhookClient.getWorkers, [])
}

export function useAlerts() {
  const { data, loading, reload } = usePolled<Alert[]>(webhookClient.getAlerts, [])
  const [items, setItems] = useState<Alert[]>([])

  useEffect(() => setItems(data), [data])

  const acknowledge = useCallback(async (alertId: string) => {
    setItems((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)))
    await webhookClient.acknowledgeAlert(alertId)
  }, [])

  return { alerts: items, loading, acknowledge, reload }
}

export function useForensicPackage(alertId: string | undefined) {
  const [pkg, setPkg] = useState<ForensicPackage | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!alertId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    webhookClient.getForensicPackage(alertId).then((result) => {
      if (!cancelled) {
        setPkg(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [alertId])

  return { pkg, loading }
}
