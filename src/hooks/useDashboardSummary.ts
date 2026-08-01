import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface DashboardSummary {
  systemIntegrity: number;
  activeCameras: number;
  integrityAlerts: number;
  predictionsToday: number;
}

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<any>('/dashboard/summary');
      const systemIntegrity = data.systemIntegrity !== undefined ? data.systemIntegrity : (data.system_integrity !== undefined ? data.system_integrity : 0);
      const activeCameras = data.activeCameras !== undefined ? data.activeCameras : (data.active_cameras !== undefined ? data.active_cameras : 0);
      const integrityAlerts = data.integrityAlerts !== undefined ? data.integrityAlerts : (data.integrity_alerts !== undefined ? data.integrity_alerts : 0);
      const predictionsToday = data.predictionsToday !== undefined ? data.predictionsToday : (data.predictions_today !== undefined ? data.predictions_today : 0);

      setSummary({
        systemIntegrity,
        activeCameras,
        integrityAlerts,
        predictionsToday
      });
    } catch (err: any) {
      console.error('Failed to fetch dashboard summary:', err);
      setError(err.message || 'Failed to load dashboard summary data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, isLoading, error, refetch: fetchSummary };
};
