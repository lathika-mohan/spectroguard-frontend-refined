import React from 'react';
import type { ShapValue } from '../../hooks/useForensics';

interface ShapWaterfallProps {
  data: ShapValue[];
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="flex items-center text-sm">
          <div className="w-1/3 truncate pr-4 text-gray-700 font-medium">{item.feature}</div>
          <div className="w-2/3 flex items-center">
            <div className="flex-1 h-5 bg-gray-50 rounded-sm border border-gray-200 overflow-hidden flex relative">
              {/* Center Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
              
              {item.impact > 0 ? (
                <>
                  <div className="w-1/2"></div>
                  <div className="h-full bg-red-400/80 border-l border-red-500" style={{ width: `${Math.min(item.impact * 100, 50)}%` }}></div>
                </>
              ) : (
                <>
                  <div className="h-full bg-blue-400/80 border-r border-blue-500 ml-auto" style={{ width: `${Math.min(Math.abs(item.impact) * 100, 50)}%` }}></div>
                  <div className="w-1/2"></div>
                </>
              )}
            </div>
            <span className={`ml-3 w-12 text-right font-mono font-medium ${item.impact > 0 ? 'text-red-600' : 'text-blue-600'}`}>
              {item.impact > 0 ? '+' : ''}{item.impact.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

