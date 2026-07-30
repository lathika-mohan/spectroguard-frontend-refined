import { useState, useEffect } from 'react';

export interface ShapValue {
  feature: string;
  impact: number;
}

export interface ForensicsData {
  id: string;
  cameraName: string;
  anomalyType: string;
  confidence: number;
  spectralEnergy: number[];
  shapValues: ShapValue[];
  decisionSteps: string[];
}

export const useForensics = (cameraId: string | undefined) => {
  const [data, setData] = useState<ForensicsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulating API contract via frontend hook architecture
    const timer = setTimeout(() => {
      setData({
        id: cameraId || 'UNKNOWN-CAM',
        cameraName: cameraId === 'CAM-041' ? 'Parking East' : 'Standard Surveillance Node',
        anomalyType: 'Defocus Blur',
        confidence: 0.94,
        spectralEnergy: [12, 45, 87, 54, 23, 10, 5, 2, 8, 15, 32, 60, 40],
        shapValues: [
          { feature: 'High-Freq Roll-off', impact: 0.45 },
          { feature: 'Edge Variance', impact: 0.25 },
          { feature: 'Luminance Shift', impact: -0.05 },
          { feature: 'Temporal Flicker', impact: 0.15 },
        ],
        decisionSteps: [
          'Extract Frame Sequence',
          'Compute 2D Fast Fourier Transform',
          'Detect High-Frequency Spectral Roll-off',
          'Classify Anomaly: Defocus Blur'
        ]
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [cameraId]);

  return { data, isLoading };
};
