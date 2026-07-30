import React from 'react';

interface SpectralHeatmapProps {
  energyData?: number[];
}

export const SpectralHeatmapOverlay: React.FC<SpectralHeatmapProps> = ({ energyData }) => {
  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
      {/* Visual placeholder for the 2D-FFT canvas/WebGL render */}
      <div className="absolute inset-0 opacity-30" style={{ 
        backgroundImage: 'radial-gradient(circle at center, #38bdf8 0%, transparent 70%)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Data-driven visualization mapping */}
      {energyData && (
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-8 h-1/2 z-10 opacity-60 pointer-events-none">
          {energyData.map((val, i) => (
            <div key={i} className="w-full mx-0.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm" style={{ height: `${val}%` }}></div>
          ))}
        </div>
      )}

      <div className="z-20 text-cyan-400 font-mono text-sm tracking-widest uppercase bg-slate-900/60 px-4 py-2 rounded-md backdrop-blur-sm border border-cyan-900/50">
        [ Live Spectral Heatmap ]
      </div>
    </div>
  );
};
