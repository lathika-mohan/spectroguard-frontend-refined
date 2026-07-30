import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useCameras } from '../hooks/useCameras';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

export const Cameras: React.FC = () => {
  const { data, isLoading } = useCameras();

  return (
    <PageContainer 
      title="Camera Streams" 
      description="Manage and monitor connected physical camera feeds."
      actions={
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition w-full sm:w-auto">
          Add Camera
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading camera feeds...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((camera) => (
            <div key={camera.id} className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              
              <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
                  <p className="text-sm text-gray-500">{camera.id} &bull; {camera.location}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold tracking-wide rounded-full ${
                  camera.status === 'online' ? 'bg-green-100 text-green-800' :
                  camera.status === 'anomalous' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {camera.status.toUpperCase()}
                </span>
              </div>
              
              <div className="p-5 flex-grow space-y-4">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Res: {camera.resolution}</span>
                  <span>{camera.fps} FPS</span>
                </div>
                <ConfidenceMeter score={camera.integrityScore} label="Signal Integrity" />
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <Link 
                  to={`/cameras/${camera.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center w-full transition-colors"
                >
                  View Forensics &rarr;
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Cameras;
