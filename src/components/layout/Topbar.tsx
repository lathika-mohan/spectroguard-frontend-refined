import React, { useState, useEffect } from "react";
import { useCameras, useAlerts, useWorkers } from "@/state/useLiveData";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { cameras } = useCameras();
  const { alerts } = useAlerts();
  const { data: workers } = useWorkers();
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlarmsCount = alerts.filter((a) => !a.acknowledged && a.severity === "critical").length;
  const activeWarningsCount = cameras.filter((c) => c.status === "warn").length;
  const degradedWorkersCount = workers.filter((w) => w.status === "degraded" || w.status === "restarting").length;

  let systemStatusText = "SYSTEM NOMINAL";
  let systemStatusVariant: "live" | "warn" | "alarm" = "live";

  if (activeAlarmsCount > 0) {
    systemStatusText = `CRITICAL ALERT: ${activeAlarmsCount} UNACKNOWLEDGED INCIDENTS`;
    systemStatusVariant = "alarm";
  } else if (activeWarningsCount > 0 || degradedWorkersCount > 0) {
    systemStatusText = `DEGRADED TELEMETRY: ${activeWarningsCount + degradedWorkersCount} FLAGS ACTIVE`;
    systemStatusVariant = "warn";
  }

  return (
    <header className="h-16 border-b border-hairline bg-panel flex items-center justify-between px-6 z-40 relative">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold tracking-wider text-ink uppercase">
            {title || "CORE CONTROL MATRIX"}
          </span>
          <span className="text-[10px] font-mono text-ink-dim uppercase">
            {subtitle || "INTEGRITY OVERVIEW INTERFACE"}
          </span>
        </div>
        <Badge variant={systemStatusVariant} className={systemStatusVariant === "alarm" ? "animate-pulse" : ""}>
          {systemStatusText}
        </Badge>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-mono text-ink tracking-widest">{timeStr}</p>
        </div>
        <div className="h-8 w-8 rounded border border-hairline bg-panel-raised flex items-center justify-center font-mono text-xs font-bold text-ink-dim hover:text-ink cursor-pointer transition-colors">
          OP
        </div>
      </div>
    </header>
  );
}
