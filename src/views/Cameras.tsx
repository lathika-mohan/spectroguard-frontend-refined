import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const Cameras: React.FC = () => {
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
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">Camera grid and list views will be wired here.</p>
      </div>
    </PageContainer>
  );
};

export default Cameras;
