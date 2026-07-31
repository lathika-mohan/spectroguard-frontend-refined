import React from 'react';
import { Link } from 'react-router-dom';

interface CameraTileProps {
  camera: {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline' | 'anomalous';
    integrityScore: number;
  };
}

export const CameraTile: React.FC<CameraTileProps> = ({ camera }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800 truncate">{camera.name}</h4>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            camera.status === 'online' ? 'bg-green-100 text-green-800' :
            camera.status === 'anomalous' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {camera.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{camera.location}</p>
      </div>
      <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-500 font-medium">Integrity: {(camera.integrityScore * 100).toFixed(0)}%</span>
        <Link to={`/forensics/${camera.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
          Analyze &rarr;
        </Link>
      </div>
    </div>
  );
};
