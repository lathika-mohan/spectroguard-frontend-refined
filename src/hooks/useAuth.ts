import { useState } from 'react';
import { apiClient } from '../api/client';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      localStorage.setItem('spectraguard_token', data.token);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('spectraguard_token');
    window.location.href = '/dashboard';
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('spectraguard_token');
  };

  return { login, logout, isAuthenticated, error, isLoading };
};
