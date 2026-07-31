import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useCameras } from '../hooks/useCameras';

export const Cameras: React.FC = () => {
  const { data, isLoading } = useCameras();

  return (
    <PageContainer 
      title="Camera Streams" 
      description="Registry of active video feeds, capture properties, and structural signal analysis."
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-100 rounded w-full pt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((camera) => (
            <div key={camera.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-base">{camera.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    camera.status === 'online' ? 'bg-green-100 text-green-800' :
                    camera.status === 'anomalous' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {camera.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{camera.location}</p>
                <div className="mt-4 space-y-1 text-xs text-gray-400">
                  <div>Resolution: {camera.resolution}</div>
                  <div>Frame Rate: {camera.fps} FPS</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Integrity: <span className="font-bold text-gray-900">{(camera.integrityScore * 100).toFixed(0)}%</span>
                </span>
                <Link 
                  to={`/forensics/${camera.id}`}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  Inspect Spectra
                </Link>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 font-medium">No live hardware streams recorded in this context registry.</p>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Cameras;
