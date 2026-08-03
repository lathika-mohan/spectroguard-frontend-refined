import { apiClient } from '../api/client';
import type { PredictionSession } from '../types';

/**
 * PredictionService
 * Encapsulates all backend prediction pipeline interactions.
 * Future-proofed to return complete, immutable PredictionSession structures.
 */
export class PredictionService {
  /**
   * Uploads file, triggers ML model inference, and retrieves the complete PredictionSession.
   */
  static async predict(file: File): Promise<PredictionSession> {
    const formData = new FormData();
    formData.append('file', file);

    // Call predict endpoint
    const response = await apiClient<{ prediction_id: string; status: string }>('/predict', {
      method: 'POST',
      body: formData,
    });

    // Retrieve full Prediction Session details from the backend
    return this.fetchSession(response.prediction_id);
  }

  /**
   * Retrieves detailed analytics for a specific prediction session.
   */
  static async fetchSession(predictionId: string): Promise<PredictionSession> {
    return apiClient<PredictionSession>(`/predictions/${predictionId}`);
  }

  /**
   * Retrieves prediction session history.
   */
  static async fetchHistory(): Promise<PredictionSession[]> {
    return apiClient<PredictionSession[]>('/predictions/history');
  }
}
