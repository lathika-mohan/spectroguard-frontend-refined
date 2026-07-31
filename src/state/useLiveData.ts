import { useState } from 'react';

export const useLiveData = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev: any[]) => 
      prev.map((a: any) => a.id === id ? { ...a, acknowledged: true } : a)
    );
  };

  return { alerts, acknowledgeAlert };
};
