import { useState, useEffect, useCallback } from 'react';
import { PredictionService } from '../services/predictionService';
import type { PredictionSession } from '../types';

/**
 * usePredictionHistory
 * Reusable hook to fetch and refresh the surveillance prediction history.
 * Automatically sorts history in descending order (newest first).
 */
export const usePredictionHistory = () => {
  const [history, setHistory] = useState<PredictionSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await PredictionService.fetchHistory();
      // Sort descending (newest prediction session first)
      setHistory(data.slice().reverse());
    } catch (err: any) {
      console.error('Failed to fetch prediction history:', err);
      setError(err.message || 'Failed to load prediction history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error, refetch: fetchHistory };
};
