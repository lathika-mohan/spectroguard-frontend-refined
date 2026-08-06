import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveAnalysis } from '../hooks/useLiveAnalysis';
import { useCameras } from '../hooks/useCameras';
import { LiveAnalysisService } from '../services/liveAnalysisService';
import type { CameraFeedItem, LivePredictionSession, TamperEvent } from '../types';
import { BackgroundLoopCanvas } from '../components/BackgroundLoopCanvas';
import {
  ArrowLeft, Play, Square, Activity, Cpu, Video, Camera,
  ShieldAlert, ShieldCheck, Clock, Maximize2, ScanSearch,
  Radio, Zap, BarChart2, ExternalLink, X,
} from 'lucide-react';

/**
 * LiveAnalysisView
 * ----------------
 * The web "GUI" that loads when the operator clicks **Start Analysis**.
 *
 * 1. "Start Analysis"  -> POST /camera/start -> live JPEG feed + telemetry
 * 2. "Run Analysis"    -> POST /inference/run (real physics engine)
 * 3. On tamper, the engine's EventService persisted a real JPEG screenshot;
 *    we fetch it and publish it to the store.
 * 4. "View Prediction" -> /predictions renders the REAL screenshot + result.
 */
export default function LiveAnalysisView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetCameraId = searchParams.get('cameraId') || '';
  const presetName = searchParams.get('name') || '';

  const live = useLiveAnalysis();
  const { registry } = useCameras();

  const [cameraName, setCameraName] = useState<string>(presetName || 'Live Camera');
  const [cameraSource, setCameraSource] = useState<string>('');
  const [events, setEvents] = useState<TamperEvent[]>([]);
  const [session, setSession] = useState<LivePredictionSession | null>(null);

  // Keep the camera name in sync with the query param / registry.
  useEffect(() => {
    if (presetName) setCameraName(presetName);
    if (presetCameraId && registry.length > 0) {
      const match = registry.find((c) => c.id === presetCameraId);
      if (match) {
        setCameraName(match.name);
        setCameraSource(match.source || String(match.port || '0'));
      }
    }
  }, [presetCameraId, presetName, registry]);

  const refreshEvents = useCallback(async () => {
    try {
      const evts = await LiveAnalysisService.fetchEvents(10);
      setEvents(evts);
    } catch { /* offline */ }
  }, []);

  useEffect(() => {
    refreshEvents();
    const timer = window.setInterval(refreshEvents, 8000);
    return () => window.clearInterval(timer);
  }, [refreshEvents]);

  const handleStart = async () => {
    setSession(null);
    const source = cameraSource.trim() || '0';
    await live.start(source);
    // Register this camera name with the backend registry so the dashboard
    // stores it exactly as given in the template.
    try {
      await LiveAnalysisService.registerCamera({
        name: cameraName.trim() || 'Live Camera',
        location: 'Live Analysis Console',
        vendor: 'generic',
        ip_address: cameraSource.trim() || '0',
        port: 554,
        source,
        status: 'online',
      });
    } catch { /* registry optional */ }
    refreshEvents();
  };

  const handleRunAnalysis = async () => {
    const result = await live.runPrediction();
    if (result) {
      setSession(result);
      refreshEvents();
    }
  };

  const handleViewPrediction = () => {
    navigate('/predictions');
  };

  const handleStop = async () => {
    setSession(null);
    await live.stop();
  };

  const telemetry = live.status;
  const resolution = telemetry && telemetry.width
    ? `${telemetry.width} × ${telemetry.height}`
    : '—';
  const isTamperedResult = session?.prediction === 'tampering_suspected';

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-['SF_Pro_Text'] selection:bg-blue-500/30 relative overflow-x-hidden">
      <BackgroundLoopCanvas />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#030712]/90 border-b border-white/10 py-3">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 select-none">
            <span className="text-xl font-extrabold tracking-tight font-['SF_Pro_Display']">
              SPECTRA<span className="text-blue-400">GUARD</span>
            </span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              LIVE ANALYSIS
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${live.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-slate-300">{live.isLive ? 'STREAM ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT: LIVE FEED & CONTROLS ================= */}
          <div className="lg:col-span-8 space-y-5">
            {/* Live Feed Display */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
              {live.frameUrl ? (
                <img
                  src={live.frameUrl}
                  alt="Live camera feed"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(29,78,216,0.15),transparent_60%)]">
                  <div className={`relative w-20 h-20 flex items-center justify-center ${live.isStarting ? '' : ''}`}>
                    {live.isStarting ? (
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                    ) : null}
                    <div className={`w-16 h-16 rounded-full border-2 ${live.isStarting ? 'border-cyan-400 border-t-transparent animate-spin' : 'border-white/15'} flex items-center justify-center`}>
                      <Camera className={`w-7 h-7 ${live.isStarting ? 'text-cyan-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    {live.isStarting ? 'Opening camera capture…' : live.error ? 'Camera unavailable' : 'Camera idle — press Start Analysis'}
                  </p>
                </div>
              )}

              {/* HUD Overlay */}
              {live.isLive && (
                <>
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-mono z-10">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-white font-bold">{cameraName.toUpperCase() || 'LIVE'}</span>
                    <span className="text-slate-400">• REC</span>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-mono z-10">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-slate-300">{resolution}</span>
                  </div>
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono z-10">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" /> FPS {telemetry?.fps?.toFixed(1) ?? '—'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Uptime {telemetry ? `${Math.floor(telemetry.uptime_seconds)}s` : '—'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" /> Frames {telemetry?.frame_count ?? 0}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Control Deck */}
            <div className="liquid-glass-card rounded-3xl border border-white/10 p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 font-mono">
                    Camera Name
                  </label>
                  <input
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    disabled={live.isLive}
                    placeholder="e.g. Lobby Entrance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none text-sm font-semibold disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 font-mono">
                    Camera Source (index or RTSP)
                  </label>
                  <input
                    value={cameraSource}
                    onChange={(e) => setCameraSource(e.target.value)}
                    disabled={live.isLive}
                    placeholder="0 (webcam) or rtsp://…"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none text-sm font-mono disabled:opacity-50"
                  />
                </div>
                <div className="flex items-end gap-3">
                  {!live.isLive ? (
                    <button
                      onClick={handleStart}
                      disabled={live.isStarting}
                      className="flex-1 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      {live.isStarting ? 'Starting…' : 'Start Analysis'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStop}
                      className="flex-1 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Action row: run analysis + view prediction */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={!live.isLive || live.isAnalyzing}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2 cursor-pointer"
                  >
                    <ScanSearch className="w-4 h-4" />
                    {live.isAnalyzing ? 'Analyzing live buffer…' : 'Run Tamper Analysis'}
                  </button>

                  {session && (
                    <button
                      onClick={handleViewPrediction}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Prediction Page
                    </button>
                  )}
                </div>

                {live.error && (
                  <span className="text-xs font-mono text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> {live.error}
                  </span>
                )}
              </div>
            </div>

            {/* Analysis Result Panel */}
            {session && (
              <div className={`rounded-3xl border p-5 space-y-4 ${isTamperedResult ? 'bg-rose-950/20 border-rose-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-['SF_Pro_Display'] flex items-center gap-2">
                    {isTamperedResult ? (
                      <><ShieldAlert className="w-5 h-5 text-rose-400" /> TAMPERING SUSPECTED</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5 text-emerald-400" /> NOMINAL INTEGRITY</>
                    )}
                  </h3>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${isTamperedResult ? 'text-rose-300 border-rose-500/40 bg-rose-500/10' : 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'}`}>
                    {session.tamperType}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-slate-400 block">Probability</span>
                    <span className="text-lg font-bold text-white">{(session.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-slate-400 block">Confidence</span>
                    <span className="text-lg font-bold text-white">{(session.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-slate-400 block">Severity</span>
                    <span className="text-lg font-bold text-white">{session.severity}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-slate-400 block">Latency</span>
                    <span className="text-lg font-bold text-white">{session.latencyMs.toFixed(1)} ms</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {session.snapshotBlobUrl && (
                    <img
                      src={session.snapshotBlobUrl}
                      alt="Tamper screenshot captured"
                      className="w-52 h-32 object-cover rounded-2xl border border-white/15 shadow-xl"
                    />
                  )}
                  <div className="flex-1 space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                      Tamper screenshot captured — used on the Predict page
                    </p>
                    <p>{session.rationale}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT: TELEMETRY + EVENTS ================= */}
          <div className="lg:col-span-4 space-y-5">
            {/* Camera telemetry card */}
            <div className="liquid-glass-card rounded-3xl border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" /> Camera Telemetry
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${live.isLive ? 'text-emerald-300 border-emerald-500/40' : 'text-slate-400 border-white/10'}`}>
                  {live.isLive ? (telemetry?.status ?? 'active') : 'inactive'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                {[
                  ['Camera ID', telemetry?.camera_id ?? '—'],
                  ['Resolution', resolution],
                  ['FPS', telemetry ? telemetry.fps.toFixed(1) : '—'],
                  ['Frame Count', telemetry ? String(telemetry.frame_count) : '—'],
                  ['Uptime', telemetry ? `${Math.floor(telemetry.uptime_seconds)}s` : '—'],
                  ['OpenCV Backend', 'LOCAL_LOOP'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Live inference chips */}
              {live.inference && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Latest Inference</p>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Prediction</span>
                    <span className={live.inference.prediction === 1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {live.inference.prediction === 1 ? 'TAMPERED' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Probability</span>
                    <span className="text-white font-bold">{(live.inference.probability * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Threshold</span>
                    <span className="text-white font-bold">{live.inference.threshold.toFixed(3)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event feed */}
            <div className="liquid-glass-card rounded-3xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Real Tamper Events
                </h3>
                <span className="text-[10px] font-mono text-slate-500">{events.length} on disk</span>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <BarChart2 className="w-8 h-8 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-500 font-mono">No detections stored yet.<br />Detections appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {events.map((evt) => (
                    <div
                      key={evt.uuid}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldAlert className={`w-3.5 h-3.5 ${evt.severity === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`} />
                          {evt.cameraName}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${evt.severity === 'HIGH' ? 'text-rose-300 border-rose-500/40' : 'text-amber-300 border-amber-500/40'}`}>
                          {evt.severity}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">{evt.tamper_type} • {(evt.confidence * 100).toFixed(1)}%</p>
                      <p className="text-[10px] font-mono text-slate-500">{evt.timestamp}</p>
                      {evt.snapshot_url && (
                        <p className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Screenshot saved
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#030712]/90 py-4 text-slate-500 text-[11px] font-mono">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          © 2026 SpectraGuard Inc. • Live Camera Integrity Analysis • Frames analyzed by the physics CV Engine
        </div>
      </footer>
    </div>
  );
}
