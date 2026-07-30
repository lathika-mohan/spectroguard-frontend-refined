import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { SpectralHeatmapOverlay } from '../components/forensics/SpectralHeatmapOverlay';
import { DecisionPath } from '../components/forensics/DecisionPath';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { ShapWaterfall } from '../components/forensics/ShapWaterfall';
import { useForensics } from '../hooks/useForensics';

export const Forensics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useForensics(id);

  if (isLoading) {
    return (
      <PageContainer title="Spectral Forensics" description="Loading analysis data...">
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading forensics profile for {id}...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!data) return null;

  return (
    <PageContainer 
      title={`Forensics: ${data.cameraName}`} 
      description={`Deep dive into frequency-domain anomalies for stream ID: ${data.id}`}
      actions={
        <Link 
          to="/cameras" 
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition flex items-center shadow-sm w-full sm:w-auto justify-center"
        >
          &larr; Back to Cameras
        </Link>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Visualizations */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2D-FFT Spatial Frequency Map</h3>
            <SpectralHeatmapOverlay energyData={data.spectralEnergy} />
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">SHAP Feature Importance</h3>
              <p className="text-sm text-gray-500 mt-1">Contribution of isolated spectral components to the final integrity prediction.</p>
            </div>
            <ShapWaterfall data={data.shapValues} />
          </div>
        </div>

        {/* Right Column: AI Metrics & Logic */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inference Results</h3>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Detected Signature</span>
                <span className="text-lg font-bold text-red-600">{data.anomalyType}</span>
              </div>
              
              <ConfidenceMeter score={data.confidence} label="Classifier Confidence" />
              
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Explainability Path</h4>
                <DecisionPath steps={data.decisionSteps} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default Forensics;
