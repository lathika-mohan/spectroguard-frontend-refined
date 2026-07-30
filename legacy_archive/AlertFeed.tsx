import React from "react";
import { useAlerts } from "@/state/useLiveData";
import { DecisionPathTag } from "@/components/DecisionPathTag";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { EmptyState } from "@/views/EmptyState";

export function AlertFeed() {
  const { alerts: items, loading, error, acknowledge } = useAlerts();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center font-mono text-sm tracking-wider opacity-60 animate-pulse">
        SYNCHRONIZING INCIDENT INTELLIGENCE FEED...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-12 font-mono text-sm text-[var(--color-alarm)] border border-[var(--color-alarm)] bg-[var(--color-alarm)]/5 rounded-lg text-center">
        ALERT GATEWAY DATA SYNCHRONIZATION TIMEOUT
      </div>
    );
  }

  const activeIncidents = items.filter((item) => !item.acknowledged);
  if (activeIncidents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold tracking-tight">FORENSIC INCIDENT FEED</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase">Real-Time Tampering Vectors</p>
      </div>

      <div className="border border-hairline rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-hairline bg-panel uppercase tracking-wider text-ink-dim">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Camera Node</th>
                <th className="p-4 font-semibold">Anomaly Profile</th>
                <th className="p-4 font-semibold">Path Strategy</th>
                <th className="p-4 font-semibold">Confidence Metric</th>
                <th className="p-4 font-semibold text-right">Operational Action</th>
              </tr>
            </thead>
            <tbody>
              {activeIncidents.map((item) => (
                <tr key={item.id} className="border-b border-hairline transition-colors hover:bg-accent/30 group">
                  <td className="p-4 text-ink">{item.timestamp}</td>
                  <td className="p-4 font-bold text-ink">{item.cameraName}</td>
                  <td className="p-4 text-ink-dim">{item.label}</td>
                  <td className="p-4">
                    {/* FIX: Changed 'type' prop to 'path' to align with component definition */}
                    <DecisionPathTag path={item.pathType} />
                  </td>
                  <td className="p-4">
                    <ConfidenceBadge confidence={item.confidence} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => acknowledge(item.id)}
                      className="px-3 py-1 border border-hairline rounded text-[10px] uppercase hover:bg-[var(--color-live)] hover:text-black hover:border-[var(--color-live)] transition-all cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
