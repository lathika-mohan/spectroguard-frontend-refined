import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const EmptyState: React.FC = () => {
  return (
    <PageContainer title="Alert Feed" description="0 unacknowledged events">
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-sm border border-gray-200 border-dashed h-64">
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No Alerts</h3>
        <p className="text-sm text-gray-500 mt-1">The system is operating normally without detected anomalies.</p>
      </div>
    </PageContainer>
  );
};

export default EmptyState;
