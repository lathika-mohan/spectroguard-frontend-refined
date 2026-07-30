import React from 'react';

interface DecisionPathProps {
  steps: string[];
}

export const DecisionPath: React.FC<DecisionPathProps> = ({ steps }) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
            {index + 1}
          </div>
          <p className="ml-3 text-sm text-gray-700">{step}</p>
        </div>
      ))}
    </div>
  );
};
