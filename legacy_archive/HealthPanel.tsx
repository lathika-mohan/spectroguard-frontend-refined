import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const HealthPanel: React.FC = () => {
  return (
    <PageContainer title="System Health" description="Node status and diagnostic metrics">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">All edge inference nodes operational</span>
        </div>
      </div>
    </PageContainer>
  );
};

export default HealthPanel;
