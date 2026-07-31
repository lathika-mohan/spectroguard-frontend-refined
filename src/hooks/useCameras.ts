import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface CameraData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'anomalous';
  integrityScore: number;
  resolution: string;
  fps: number;
}

export const useCameras = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    apiClient<CameraData[]>('/cameras')
      .then((responseData) => {
        if (mounted) {
          setData(responseData);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch camera telemetry from backend:', error);
        if (mounted) {
          setData([]); // Safe fallback to preserve UI stability
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading };
};
