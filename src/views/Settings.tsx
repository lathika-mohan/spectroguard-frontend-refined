import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const Settings: React.FC = () => {
  return (
    <PageContainer 
      title="System Settings" 
      description="Configure SpectraGuard engine thresholds and application preferences."
    >
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">Configuration forms and environment readouts will be wired here.</p>
      </div>
    </PageContainer>
  );
};

export default Settings;
