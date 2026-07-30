import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const Dashboard: React.FC = () => {
  return (
    <PageContainer 
      title="System Dashboard" 
      description="Real-time overview of camera integrity and system health."
    >
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">Dashboard metrics and widgets will be wired here.</p>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
