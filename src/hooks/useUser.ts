import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface UserProfile {
  name?: string;
  username?: string;
  role: string;
  avatar?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    apiClient<UserProfile>('/me')
      .then((data) => {
        if (mounted) {
          setUser(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch authenticated user info:', err);
        if (mounted) {
          setError(err.message || 'Failed to fetch operator information');
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { user, isLoading, error };
};
