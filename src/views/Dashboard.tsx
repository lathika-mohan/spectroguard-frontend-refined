import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { useCameras } from '../hooks/useCameras';

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useCameras();

  // Dynamically calculate KPIs based on backend data
  const totalCameras = data.length;
  const anomalousCameras = data.filter(c => c.status === 'anomalous');
  const anomalyCount = anomalousCameras.length;
  
  // Calculate average integrity score
  const averageIntegrity = totalCameras > 0 
    ? (data.reduce((acc, cam) => acc + cam.integrityScore, 0) / totalCameras) * 100
    : 100;

  return (
    <PageContainer 
      title="System Dashboard" 
      description="Real-time overview of camera integrity and system health."
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading backend telemetry...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* KPI Cards */}
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

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Alerts</h3>
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
        </>
      )}
    </PageContainer>
  );
};

export default Dashboard;
