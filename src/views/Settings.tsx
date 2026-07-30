import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export const Settings: React.FC = () => {
  return (
    <PageContainer 
      title="System Settings" 
      description="Configure SpectraGuard engine thresholds and application preferences."
      actions={
        <button 
          className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed border border-gray-200 transition w-full sm:w-auto" 
          disabled
          title="Settings are read-only in this environment"
        >
          Save Changes (Read-only)
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Model Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Model Configuration</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Active Classifier</label>
              <input 
                type="text" 
                disabled 
                value="RandomForest_Frequency_v1.2" 
                className="w-full sm:w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FFT Resolution (Bins)</label>
              <input 
                type="text" 
                disabled 
                value="1024" 
                className="w-full sm:w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-sm" 
              />
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Alert Thresholds</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anomaly Detection Confidence</label>
              <div className="flex items-center space-x-4 w-full sm:w-1/2">
                <input 
                  type="range" 
                  disabled 
                  min="0" 
                  max="100" 
                  value="85" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed" 
                />
                <span className="text-sm font-medium text-gray-600 w-12 text-right">85%</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Alerts will trigger when classifier confidence exceeds this threshold.</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Frontend Release</p>
              <p className="text-sm text-gray-900 mt-1">v1.0.0-rc</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Engine API Status</p>
              <p className="text-sm text-blue-600 font-medium mt-1">Simulated Mode (Phase 6)</p>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default Settings;
