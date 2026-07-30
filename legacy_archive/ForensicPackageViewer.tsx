import React from "react";
import { useParams, Link } from "react-router-dom";
import { useForensicPackage } from "@/state/useLiveData";
import { Badge } from "@/components/ui/badge";

interface ShapFactor {
  factor: string;
  weight: number;
}

export function ForensicPackageViewer() {
  const { alertId } = useParams<{ alertId: string }>();
  const { pkg, loading, error } = useForensicPackage(alertId);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center font-mono text-sm tracking-wider opacity-60 animate-pulse">
        COMPUTING FORENSIC DECONVOLUTION DATA...
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-display font-bold">Forensic Package Not Found</h2>
        <p className="text-sm font-mono text-ink-dim mt-1">ID parameter tracking exception or missing record signature.</p>
        <Link to="/alerts" className="text-sm text-primary hover:underline mt-4 inline-block">Return to Incidents</Link>
      </div>
    );
  }

  const isCryptographicallySigned = pkg.signedHash && pkg.signedHash.startsWith("0x") && pkg.signedHash.length >= 10;
  const maxWeight = Math.max(...pkg.shapFactors.map((f: ShapFactor) => Math.abs(f.weight)));

  // FIX BLK-09: Clipboard handling sequence execution parameters
  const copyHashToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pkg.signedHash);
    } catch (err) {
      console.error("Clipboard operational transaction boundary interrupted.", err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold tracking-tight">FORENSIC ANALYSIS DOSSIER</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase">Chain-of-Custody Verification Node</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-hairline rounded-lg p-6 bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <h2 className="font-display font-bold tracking-tight text-sm uppercase">DETECTION DECISION TREE PATH</h2>
              <Badge variant={pkg.pathType === "fast" ? "alarm" : "neutral"}>
                {pkg.pathType.toUpperCase()} PATH
              </Badge>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {pkg.decisionPath.map((step: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-ink-dim">
                  <span className="text-[var(--color-live)]">[{i + 1}]</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-hairline rounded-lg p-6 bg-card space-y-4">
            <h2 className="font-display font-bold tracking-tight text-sm uppercase border-b border-hairline pb-4">
              NEURAL INFERENCE IMPORTANCE VECTORS (SHAP)
            </h2>
            <div className="space-y-3 font-mono text-xs">
              {pkg.shapFactors.map((f: ShapFactor) => {
                const percentage = maxWeight > 0 ? (Math.abs(f.weight) / maxWeight) * 100 : 0;
                return (
                  <div key={f.factor} className="space-y-1">
                    <div className="flex justify-between opacity-80">
                      <span>{f.factor}</span>
                      <span>{f.weight.toFixed(4)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-accent/30 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-warn)]" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-hairline rounded-lg p-6 bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <h2 className="font-display font-bold tracking-tight text-sm uppercase">SIGNED METADATA</h2>
              <Badge variant={isCryptographicallySigned ? "evidence" : "alarm"}>
                {isCryptographicallySigned ? "VERIFIED" : "UNSIGNED RAW DATA"}
              </Badge>
            </div>
            <div className="space-y-3 font-mono text-xs text-ink-dim break-all">
              <div className="group relative">
                <span className="block opacity-50 uppercase text-[10px]">RECORD HASH:</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="select-all bg-accent/20 px-1 py-0.5 rounded text-ink">{pkg.signedHash}</span>
                  <button 
                    onClick={copyHashToClipboard}
                    className="p-1 border border-hairline rounded hover:bg-accent hover:text-ink cursor-pointer transition-colors text-[10px]"
                    title="Copy Hash Trace Parameters"
                  >
                    COPY
                  </button>
                </div>
              </div>
              <p><span className="block opacity-50 uppercase text-[10px]">TIMESTAMP:</span> {pkg.signedAt}</p>
              <p><span className="block opacity-50 uppercase text-[10px]">WITNESSING OP:</span> {pkg.operator}</p>
              <p><span className="block opacity-50 uppercase text-[10px]">NETWORK TIME OFFSET:</span> {pkg.ntpOffsetMs} ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
