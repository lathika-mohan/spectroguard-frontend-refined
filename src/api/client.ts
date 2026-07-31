// Defaulting to typical local backend port; configurable via Vite env vars
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  // Authentication token handling will be injected here in P7.3
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Request Failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Non-JSON error response fallback (omitted catch binding to satisfy linter)
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
