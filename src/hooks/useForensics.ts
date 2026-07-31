import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface ShapValue {
  feature: string;
  impact: number;
}

export interface ForensicsData {
  id: string;
  cameraName: string;
  anomalyType: string;
  confidence: number;
  spectralEnergy: number[];
  shapValues: ShapValue[];
  decisionSteps: string[];
}

export const useForensics = (cameraId: string | undefined) => {
  const [data, setData] = useState<ForensicsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!cameraId) return;
    
    let mounted = true;
    setIsLoading(true);

    apiClient<ForensicsData>(`/forensics/${cameraId}`)
      .then((responseData) => {
        if (mounted) {
          setData(responseData);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch forensics profile for ${cameraId}:`, error);
        if (mounted) {
          setData(null);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [cameraId]);

  return { data, isLoading };
};
