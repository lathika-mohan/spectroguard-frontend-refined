import { useState, useEffect } from 'react';

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
    // Simulating API contract via frontend hook architecture
    // This removes direct mock imports from the view component
    const timer = setTimeout(() => {
      setData([
        { id: 'CAM-041', name: 'Parking East', location: 'Zone A', status: 'anomalous', integrityScore: 0.88, resolution: '1080p', fps: 30 },
        { id: 'CAM-012', name: 'Entrance', location: 'Lobby', status: 'anomalous', integrityScore: 0.72, resolution: '4K', fps: 24 },
        { id: 'CAM-005', name: 'Corridor North', location: 'Level 2', status: 'online', integrityScore: 0.99, resolution: '1080p', fps: 30 },
        { id: 'CAM-088', name: 'Perimeter West', location: 'Exterior', status: 'offline', integrityScore: 0.00, resolution: '1080p', fps: 15 },
      ]);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
