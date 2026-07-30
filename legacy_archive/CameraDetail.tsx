import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCameras } from '../hooks/useCameras';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

export const CameraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCameras();

  if (isLoading) {
    return (
      <PageContainer title="Camera Details" description="Fetching stream telemetry...">
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading camera details...</p>
        </div>
      </PageContainer>
    );
  }

  const camera = data.find(c => c.id === id);

  if (!camera) {
    return (
      <PageContainer title="Camera Not Found" description="The requested camera ID could not be located in the registry.">
        <div className="p-6 text-center bg-white rounded-lg border border-gray-200">
          <Link to="/cameras" className="text-blue-600 hover:text-blue-800 font-medium transition">
            &larr; Return to Cameras Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title={`Camera Details: ${camera.name}`} 
      description={`ID: ${camera.id} | Location: ${camera.location}`}
      actions={
        <Link to="/cameras" className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm font-medium shadow-sm">
          Back to Cameras
        </Link>
      }
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stream Status</h3>
            <p className="text-sm text-gray-500 mt-1">Resolution: {camera.resolution} @ {camera.fps} FPS</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            camera.status === 'online' ? 'bg-green-100 text-green-800' : 
            camera.status === 'anomalous' ? 'bg-red-100 text-red-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {camera.status}
          </span>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Integrity Analysis</h3>
          <ConfidenceMeter score={camera.integrityScore} label="Signal Integrity" />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Link to={`/forensics/${camera.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors flex items-center">
            Launch Full Spectral Forensics <span className="ml-1">&rarr;</span>
          </Link>
        </div>
        
      </div>
    </PageContainer>
  );
};

export default CameraDetail;
