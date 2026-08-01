import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface PlatformStatus {
  backendStatus: string;
  databaseStatus: string;
  cvEngineStatus: string;
  connectedCameras: number;
  platformHealth: string | number;
}

export const usePlatformStatus = () => {
  const [status, setStatus] = useState<PlatformStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<any>('/dashboard/sidebar');
      const backendStatus = data.backendStatus || data.backend_status || 'offline';
      const databaseStatus = data.databaseStatus || data.database_status || 'offline';
      const cvEngineStatus = data.cvEngineStatus || data.cv_engine_status || 'offline';
      const connectedCameras = data.connectedCameras !== undefined ? data.connectedCameras : (data.connected_cameras !== undefined ? data.connected_cameras : 0);
      const platformHealth = data.platformHealth !== undefined ? data.platformHealth : (data.platform_health !== undefined ? data.platform_health : '0%');

      setStatus({
        backendStatus,
        databaseStatus,
        cvEngineStatus,
        connectedCameras,
        platformHealth
      });
    } catch (err: any) {
      console.error('Failed to fetch platform status:', err);
      setError(err.message || 'Failed to load platform status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { status, isLoading, error, refetch: fetchStatus };
};
