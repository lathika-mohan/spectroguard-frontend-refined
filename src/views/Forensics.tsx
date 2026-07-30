import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const Forensics: React.FC = () => {
  return (
    <PageContainer 
      title="Spectral Forensics" 
      description="Deep dive into frequency-domain anomalies and feature extraction analysis."
    >
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">Spectral visualizations and SHAP tools will be wired here.</p>
      </div>
    </PageContainer>
  );
};

export default Forensics;
