import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface CameraData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'anomalous';
  integrityScore: number;
  resolution?: string;
  fps?: number;
  thumbnail?: string;
}

export const useCameras = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await apiClient<CameraData[]>('/cameras');
      setData(responseData);
    } catch (err: any) {
      console.error('Failed to fetch camera telemetry from backend:', err);
      setError(err.message || 'Failed to fetch camera list from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return { data, isLoading, error, refetch: fetchCameras };
};
