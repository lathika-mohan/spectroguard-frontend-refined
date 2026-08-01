import { useState } from 'react';
import { apiClient } from '../api/client';
import type { CameraData } from './useCameras';

export interface SearchResponse {
  cameras: CameraData[];
  events: any[];
  predictions: any[];
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResponse>({ cameras: [], events: [], predictions: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      setResults({ cameras: [], events: [], predictions: [] });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
      setResults({
        cameras: data.cameras || [],
        events: data.events || [],
        predictions: data.predictions || []
      });
    } catch (err: any) {
      console.error('Search query failed:', err);
      setError(err.message || 'Search request failed.');
      setResults({ cameras: [], events: [], predictions: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return { executeSearch, results, isLoading, error };
};
