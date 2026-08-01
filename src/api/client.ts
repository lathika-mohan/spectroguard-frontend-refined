const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return 'http://localhost:8000/api/v1';
  return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
};
const BASE_URL = getBaseUrl();


export class ApiError extends Error {
  status: number; // Explicit property declaration to satisfy erasableSyntaxOnly

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('spectraguard_token');
  
  // Use the native Headers API to satisfy TS2322 and gracefully handle all header formats
  const headers = new Headers(options?.headers);

  // Default to JSON if not specified and not using FormData
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Prevent overriding Content-Type if FormData is used (browser sets it automatically with boundary)
  if (options?.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        } else {
          switch (response.status) {
            case 400: errorMessage = "Invalid request format or parameters."; break;
            case 401: 
              errorMessage = "Authentication expired or invalid. Please log in again."; 
              localStorage.removeItem('spectraguard_token');
              break;
            case 403: errorMessage = "Access forbidden. Insufficient permissions."; break;
            case 404: errorMessage = "Requested telemetry or resource not found."; break;
            case 413: errorMessage = "Uploaded payload exceeds maximum allowed size."; break;
            case 422: errorMessage = "Unprocessable entity. Data validation failed."; break;
            case 429: errorMessage = "Rate limit exceeded. Please try again later."; break;
            case 500: errorMessage = "Internal server error. The backend engine encountered a fault."; break;
          }
        }
      } catch {
        // Handle non-JSON error responses (linter fix: removed unused 'e' parameter)
        if (response.status === 502 || response.status === 503) {
           errorMessage = "Backend service is currently unavailable or restarting.";
        }
      }
      
      throw new ApiError(response.status, errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Network failure: Unable to connect to the Spectral Engine backend. Please check your connection.");
    }
    
    throw new Error(error.message || "An unexpected runtime error occurred during the request.");
  }
};
