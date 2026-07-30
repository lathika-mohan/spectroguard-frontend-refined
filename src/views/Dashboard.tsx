import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

export const Dashboard: React.FC = () => {
  return (
    <PageContainer 
      title="System Dashboard" 
      description="Real-time overview of camera integrity and system health."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* KPI Cards */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Global System Integrity</h3>
          <div className="mt-2 text-3xl font-bold text-gray-900">98.5%</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active Camera Streams</h3>
          <div className="mt-2 text-3xl font-bold text-gray-900">329</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Detected Anomalies</h3>
          <div className="mt-2 text-3xl font-bold text-red-600">4</div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-6 max-w-xl">
           <ConfidenceMeter score={0.88} label="CAM-041 (Parking East) - Partial Occlusion" />
           <ConfidenceMeter score={0.72} label="CAM-012 (Entrance) - Low Light / Noise" />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
