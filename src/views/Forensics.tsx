import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SpectralHeatmapOverlay } from '../components/forensics/SpectralHeatmapOverlay';
import { DecisionPath } from '../components/forensics/DecisionPath';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

export const Forensics: React.FC = () => {
  return (
    <PageContainer 
      title="Spectral Forensics" 
      description="Deep dive into frequency-domain anomalies and feature extraction analysis."
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Visualizations */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2D-FFT Spatial Frequency Map</h3>
            <SpectralHeatmapOverlay />
          </div>
        </div>

        {/* Right Column: AI Metrics & Logic */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inference Results</h3>
            <div className="space-y-4">
              <ConfidenceMeter score={0.94} label="Tampering Confidence" />
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Explainability Path</h4>
                <DecisionPath steps={[
                  'Extract Frame Sequence',
                  'Compute 2D Fast Fourier Transform',
                  'Detect High-Frequency Spectral Roll-off',
                  'Classify Anomaly: Defocus Blur'
                ]} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default Forensics;
