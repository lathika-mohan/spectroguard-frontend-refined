import { useState } from 'react';

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  explanation: string;
  latency_ms: number;
}

export const usePrediction = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executePrediction = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('spectraguard_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        let errMessage = `Inference failed: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData?.error) errMessage = errData.error;
        } catch (e) {
          // Fallback to status text
        }
        throw new Error(errMessage);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during prediction.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearPrediction = () => {
    setResult(null);
    setError(null);
  };

  return { executePrediction, clearPrediction, result, isLoading, error };
};
