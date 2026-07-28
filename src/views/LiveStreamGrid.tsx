import React from "react";
import { useCameras } from "@/state/useLiveData";
import { CameraTile } from "@/components/CameraTile";

export function LiveStreamGrid() {
  const { cameras, loading, error } = useCameras();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center font-mono text-sm tracking-wider opacity-60 animate-pulse">
        SYNCHRONIZING CORE TELEMETRY PIPELINE...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-12">
        <div className="border border-[var(--color-alarm)] bg-[var(--color-alarm)]/5 p-6 rounded-lg text-center space-y-4">
          <div className="h-2 w-2 rounded-full bg-[var(--color-alarm)] animate-ping mx-auto" />
          <h2 className="font-display font-bold text-xl text-[var(--color-alarm)] tracking-tight uppercase">
            Data Gateway Interrupted
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
            {error.message || "The surveillance node telemetry socket timed out or returned an invalid contract response."}
          </p>
          <div className="pt-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-[var(--color-alarm)] text-xs font-mono rounded hover:bg-[var(--color-alarm)]/10 transition-colors"
            >
              FORCE SOCKET RE-INITIALIZATION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold tracking-tight">LIVE MONITORING MATRIX</h1>
        <p className="text-xs font-mono text-muted-foreground uppercase">Stationary Camera Node Interface</p>
      </div>

      {cameras.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center font-mono text-sm opacity-50">
          NO SURVEILLANCE STREAMS DIRECTLY ASSIGNED TO CONSOLE
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera) => (
            <CameraTile key={camera.id} camera={camera} />
          ))}
        </div>
      )}
    </div>
  );
}
