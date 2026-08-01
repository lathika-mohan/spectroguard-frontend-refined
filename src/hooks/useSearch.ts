import { useState } from 'react';
import { apiClient } from '../api/client';
import type { CameraData } from './useCameras';

export const useSearch = () => {
  const [results, setResults] = useState<CameraData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<CameraData[]>(`/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err: any) {
      console.error('Search query failed:', err);
      setError(err.message || 'Search request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return { executeSearch, results, isLoading, error };
};
