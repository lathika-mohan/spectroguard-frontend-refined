import React from 'react';

export const SpectralHeatmapOverlay: React.FC = () => {
  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
      {/* Visual placeholder for the 2D-FFT canvas/WebGL render */}
      <div className="absolute inset-0 opacity-30" style={{ 
        backgroundImage: 'radial-gradient(circle at center, #38bdf8 0%, transparent 70%)',
        backgroundSize: '20px 20px'
      }}></div>
      <div className="z-10 text-cyan-400 font-mono text-sm tracking-widest uppercase">
        [ Live Spectral Heatmap ]
      </div>
    </div>
  );
};
