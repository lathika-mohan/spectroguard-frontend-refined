import { useState, useEffect, useCallback } from "react";
import { webhookClient } from "@/api/webhookClient";

export function usePolled<T>(
  fetchFn: () => Promise<T>,
  intervalMs: number = 5000
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const executeFetch = useCallback(async (isInitial: boolean = false) => {
    if (isInitial) setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Data synchronization failure"));
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    let active = true;
    
    const tick = async () => {
      try {
        const result = await fetchFn();
        if (active) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error("Data synchronization failure"));
        }
      }
    };

    executeFetch(true);
    const interval = setInterval(tick, intervalMs);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [executeFetch, fetchFn, intervalMs]);

  return { data, loading, error, refetch: () => executeFetch(false), mutate: setData };
}

export function useCameras() {
  const { data, loading, error } = usePolled(() => webhookClient.getCameras());
  return { cameras: data || [], loading, error };
}

export function useAlerts() {
  const { data, loading, error, mutate } = usePolled(() => webhookClient.getAlerts());
  
  const acknowledge = async (id: string) => {
    mutate((prev) => {
      if (!prev) return null;
      return prev.map(a => a.id === id ? { ...a, acknowledged: true } : a);
    });
    
    try {
      await webhookClient.acknowledgeAlert(id);
    } catch (err) {
      console.error("Failed to acknowledge alert. Rollback not implemented per spec.", err);
    }
  };

  return { alerts: data || [], loading, error, acknowledge };
}

export function useWorkers() {
  const { data, loading, error } = usePolled(() => webhookClient.getWorkers());
  return { data: data || [], loading, error };
}

export function useForensicPackage(alertId: string | undefined) {
  const fetchFn = useCallback(() => {
    if (!alertId) return Promise.resolve(undefined);
    return webhookClient.getForensicPackage(alertId);
  }, [alertId]);

  const { data, loading, error } = usePolled(fetchFn);
  return { pkg: data || undefined, loading, error };
}
