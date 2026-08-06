let activeBaseUrl = '';

export const getBaseUrl = (): string => {
  if (activeBaseUrl) return activeBaseUrl;

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    activeBaseUrl = envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
    return activeBaseUrl;
  }

  const savedPort = localStorage.getItem('spectraguard_detected_api_port');
  if (savedPort) {
    activeBaseUrl = `http://localhost:${savedPort}/api/v1`;
    return activeBaseUrl;
  }

  return 'http://localhost:8000/api/v1';
};


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

  let baseUrl = getBaseUrl();
  let response: Response;

  try {
    try {
      response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (error: any) {
      if (
        baseUrl.includes('localhost') &&
        error.name === 'TypeError' &&
        (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))
      ) {
        const is8000 = baseUrl.includes(':8000');
        const alternatePort = is8000 ? '8080' : '8000';
        const alternateBaseUrl = `http://localhost:${alternatePort}/api/v1`;
        
        console.warn(`Connection to ${baseUrl} failed. Probing alternate port ${alternatePort}...`);
        
        try {
          response = await fetch(`${alternateBaseUrl}${endpoint}`, {
            ...options,
            headers,
          });
          
          activeBaseUrl = alternateBaseUrl;
          localStorage.setItem('spectraguard_detected_api_port', alternatePort);
          console.log(`Successfully connected to alternate port ${alternatePort}. Config updated.`);
        } catch (probeError) {
          throw error;
        }
      } else {
        throw error;
      }
    }

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

/**
 * apiBlob
 * Fetches a binary resource (live JPEG frame, tamper screenshot) with the
 * same base-URL resolution and Authorization header as apiClient, returning
 * a Blob so callers can build object URLs for <img> / <video> elements.
 */
export const apiBlob = async (endpoint: string, options?: RequestInit): Promise<Blob> => {
  const token = localStorage.getItem('spectraguard_token');
  const headers = new Headers(options?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const baseUrl = getBaseUrl();
  let response: Response;

  try {
    try {
      response = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
    } catch (error: any) {
      // Port fallback probe (8000 <-> 8080) identical to apiClient.
      if (
        baseUrl.includes('localhost') &&
        error.name === 'TypeError' &&
        (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))
      ) {
        const is8000 = baseUrl.includes(':8000');
        const alternatePort = is8000 ? '8080' : '8000';
        const alternateBaseUrl = `http://localhost:${alternatePort}/api/v1`;
        try {
          response = await fetch(`${alternateBaseUrl}${endpoint}`, { ...options, headers });
          activeBaseUrl = alternateBaseUrl;
          localStorage.setItem('spectraguard_detected_api_port', alternatePort);
        } catch {
          throw error;
        }
      } else {
        throw error;
      }
    }

    if (!response.ok) {
      throw new ApiError(response.status, `Failed to fetch binary resource (${response.status} ${response.statusText}).`);
    }
    return await response.blob();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new Error(error.message || "Network failure while fetching binary resource.");
  }
};
