import React, { useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { PredictionDisplay } from '../components/forensics/PredictionDisplay';
import { useCameras } from '../hooks/useCameras';
import { usePrediction } from '../hooks/usePrediction';

export const Dashboard: React.FC = () => {
  const { data, isLoading: isTelemetryLoading } = useCameras();
  const { executePrediction, result, isLoading: isInferenceLoading, error: inferenceError } = usePrediction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCameras = data.length;
  const anomalousCameras = data.filter(c => c.status === 'anomalous');
  const anomalyCount = anomalousCameras.length;
  
  const averageIntegrity = totalCameras > 0 
    ? (data.reduce((acc, cam) => acc + cam.integrityScore, 0) / totalCameras) * 100
    : 100;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await executePrediction(file);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageContainer 
      title="System Dashboard" 
      description="Real-time overview of camera integrity and system health."
    >
      {isTelemetryLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading backend telemetry...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Global System Integrity</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900">{averageIntegrity.toFixed(1)}%</div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Active Camera Streams</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900">{totalCameras}</div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Detected Anomalies</h3>
              <div className={`mt-2 text-3xl font-bold ${anomalyCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {anomalyCount}
              </div>
            </div>
          </div>

          {/* Interactive Live Upload Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">On-Demand Spectral Validation</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a video frame sequence or camera stream file to execute immediate physics-informed FFT tamper verification.</p>
            
            <div 
              onClick={triggerUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50/50 transition duration-200 group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*"
              />
              <svg className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">Click to select files for inference</p>
              <p className="text-xs text-gray-400 mt-1">Supports standard image and video telemetry binaries</p>
            </div>

            {inferenceError && (
              <div className="mt-4 p-3 bg-red-50 rounded border border-red-200 text-sm text-red-600 font-medium">
                {inferenceError}
              </div>
            )}
          </div>

          {/* Render real-time prediction output */}
          <PredictionDisplay result={result} isLoading={isInferenceLoading} />

          {/* Live System Alerts Feed */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live System Alerts</h3>
            <div className="space-y-6 max-w-xl">
              {anomalousCameras.length > 0 ? (
                anomalousCameras.map(cam => (
                  <ConfidenceMeter 
                    key={cam.id} 
                    score={cam.integrityScore} 
                    label={`${cam.id} (${cam.name}) - ${cam.location}`} 
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 font-medium">No active anomalies detected across the network. System operating nominally.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
