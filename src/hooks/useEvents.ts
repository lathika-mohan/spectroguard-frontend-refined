import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface IntegrityEvent {
  id: string;
  time?: string;
  timestamp?: string;
  camera?: string;
  cameraName?: string;
  event?: string;
  description?: string;
  status: string;
  statusStyle?: string;
  relativeTime?: string;
  imageUrl?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<IntegrityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await apiClient<IntegrityEvent[]>('/events');
      setEvents(responseData);
    } catch (err: any) {
      console.error('Failed to fetch integrity events:', err);
      setError(err.message || 'Failed to load integrity events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, isLoading, error, refetch: fetchEvents };
};
