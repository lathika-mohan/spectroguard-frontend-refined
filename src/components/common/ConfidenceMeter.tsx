import React from 'react';

interface ConfidenceMeterProps {
  score: number; // 0.0 to 1.0
  label?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, label = "Confidence" }) => {
  const percentage = Math.round(score * 100);
  const colorClass = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};
