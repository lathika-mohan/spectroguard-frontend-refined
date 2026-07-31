import React from 'react';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { DecisionPath } from './DecisionPath';
import type { PredictionResponse } from '../../hooks/usePrediction';

interface PredictionDisplayProps {
  result: PredictionResponse | null;
  isLoading?: boolean;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Executing Spectral Inference Engine...</p>
      </div>
    );
  }

  if (!result) return null;

  const isAnomalous = result.prediction.toLowerCase() !== 'original' && result.prediction.toLowerCase() !== 'authentic';

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-6 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-start border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inference Result</h3>
          <p className="text-sm text-gray-500 mt-1">Compute Latency: {result.latency_ms} ms</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isAnomalous ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {result.prediction}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Model Confidence</h4>
        <ConfidenceMeter score={result.confidence} label={isAnomalous ? "Tampering Probability" : "Authenticity Probability"} />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Explainability Signature</h4>
        <DecisionPath steps={[result.explanation]} />
      </div>
      
    </div>
  );
};
