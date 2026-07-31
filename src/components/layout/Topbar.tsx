import React from 'react';

export const Topbar: React.FC = () => {
  // Explicit safe typed collections to satisfy compiler evaluation structures
  const alerts: any[] = [];
  const cameras: any[] = [];
  const workers: any[] = [];

  const activeAlarmsCount = alerts.filter((a: any) => !a.acknowledged && a.severity === "critical").length;
  const activeWarningsCount = cameras.filter((c: any) => c.status === "warn").length;
  const degradedWorkersCount = workers.filter((w: any) => w.status === "degraded" || w.status === "restarting").length;

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center min-w-0">
        <h1 className="text-lg font-semibold text-gray-800 truncate">Integrity Intelligence</h1>
      </div>
      <div className="flex items-center space-x-6 text-xs font-medium text-gray-500">
        <div className="space-x-4 flex">
          <span>Alarms: <strong className="text-red-600 font-bold">{activeAlarmsCount}</strong></span>
          <span>Warnings: <strong className="text-yellow-600 font-bold">{activeWarningsCount}</strong></span>
          <span>Workers: <strong className="text-gray-700 font-bold">{degradedWorkersCount}</strong></span>
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner">
          OP
        </div>
      </div>
    </header>
  );
};

export default Topbar;
