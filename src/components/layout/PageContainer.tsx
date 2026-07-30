import React, { type ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  description, 
  children, 
  actions 
}) => {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      {/* Standardized Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {actions && (
          <div className="flex shrink-0 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
      
      {/* Standardized Content Area */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

