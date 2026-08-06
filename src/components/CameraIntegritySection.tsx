import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { CameraFeedItem } from '../types';
import { apiBlob } from '../api/client';

interface FeaturedCameraData {
  id: string;
  camId: string;
  badge: 'VERIFIED' | 'REVIEW' | 'ALERT' | 'OFFLINE';
  badgeColor: string;
  badgeDotColor: string;
  title: string;
  location: string;
  health: string;
  actionText: string;
  actionColor: string;
  imageUrl: string;
}

/** Derive the card presentation from a REAL registry row. */
const toCard = (camera: CameraFeedItem): FeaturedCameraData => {
  const status = camera.integrityStatus;
  const isTampered = status === 'Tampered';
  const isInvestigating = status === 'Investigating';
  const isOffline = status === 'Offline';

  return {
    id: camera.id,
    camId: camera.id,
    badge: isTampered ? 'ALERT' : isInvestigating ? 'REVIEW' : isOffline ? 'OFFLINE' : 'VERIFIED',
    badgeColor: isTampered
      ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
      : isInvestigating
        ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
        : isOffline
          ? 'text-slate-400 border-slate-500/30 bg-slate-500/10'
          : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    badgeDotColor: isTampered ? 'bg-rose-400' : isInvestigating ? 'bg-amber-400' : isOffline ? 'bg-slate-500' : 'bg-emerald-400',
    title: camera.name,
    location: camera.location,
    health: `${camera.integrityScore}%`,
    actionText: isTampered ? 'Investigate →' : 'Inspect →',
    actionColor: isTampered
      ? 'text-rose-400 hover:text-rose-300 font-bold'
      : 'text-blue-400 hover:text-blue-300',
    imageUrl: camera.imageUrl || '',
  };
};

// 3D Glass Press Push Card Component for Featured Cameras
const CameraCardItem: React.FC<{ card: FeaturedCameraData; onInspect?: (cameraId: string) => void }> = ({ card, onInspect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState({ x: 0.5, y: 0.5, isHovered: false });
  const [liveFrame, setLiveFrame] = useState<string>('');
  const frameKey = useRef(0);

  // Fetch the real live frame for this camera once it has been inspected
  // (reuses the CV engine frame endpoint; no stock photos).
  useEffect(() => {
    const key = ++frameKey.current;
    if (card.imageUrl) {
      setLiveFrame(card.imageUrl);
      return;
    }
    setLiveFrame('');
    let cancelled = false;
    const load = async () => {
      try {
        const blob = await apiBlob('/camera/frame');
        if (!cancelled && frameKey.current === key) {
          setLiveFrame(URL.createObjectURL(blob));
        }
      } catch {
        setLiveFrame('');
      }
    };
    load();
    return () => { cancelled = true; };
  }, [card.imageUrl, card.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setCursorState({ x: relX, y: relY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setCursorState({ x: 0.5, y: 0.5, isHovered: false });
  };

  const centerOffsetX = (cursorState.x - 0.5) * 2;
  const centerOffsetY = (cursorState.y - 0.5) * 2;
  const maxRotateDeg = 7;
  const rotateX = cursorState.isHovered ? centerOffsetY * maxRotateDeg : 0;
  const rotateY = cursorState.isHovered ? -centerOffsetX * maxRotateDeg : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: cursorState.isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-6px) scale3d(0.99, 0.99, 0.99)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: cursorState.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: cursorState.isHovered
          ? `inset ${centerOffsetX * 15}px ${centerOffsetY * 15}px 25px rgba(0, 0, 0, 0.8), 0 15px 35px -8px rgba(15, 23, 42, 0.7), 0 0 25px rgba(30, 58, 138, 0.4)`
          : undefined,
      }}
      className={`group relative liquid-glass-card rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
        cursorState.isHovered ? 'border-blue-500/60' : 'border-white/10'
      }`}
      id={`camera-card-${card.id}`}
    >
      {/* Dark Blue Cursor Press Flow Spotlight */}
      {cursorState.isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 220px at ${cursorState.x * 100}% ${cursorState.y * 100}%, rgba(30, 58, 138, 0.5) 0%, rgba(29, 78, 216, 0.2) 40%, transparent 80%)`,
          }}
        />
      )}

      {/* TOP IMAGE THUMBNAIL AREA (real live frame) */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-900 shrink-0">
        {liveFrame ? (
          <img
            src={liveFrame}
            alt={card.title}
            className="w-full h-full object-cover saturate-[0.75] contrast-[1.15] brightness-[0.85] group-hover:scale-105 group-hover:saturate-100 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(29,78,216,0.12),transparent_60%)]">
            <span className="text-[10px] font-mono text-slate-500">NO LIVE FRAME — CAMERA OFFLINE / NOT STARTED</span>
          </div>
        )}

        {/* Subtle Vignette & Blue Tint CCTV Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-slate-950/20 to-blue-900/20 mix-blend-multiply pointer-events-none" />

        {/* CCTV Top Info Overlay Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow pointer-events-none z-20">
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {card.camId} • REC
          </span>
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            {card.badge === 'OFFLINE' ? 'OFFLINE' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* CARD CONTENT BODY */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 relative z-20">
        {/* Status Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${card.badgeColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${card.badgeDotColor} animate-pulse`} />
            <span>{card.badge}</span>
          </span>
        </div>

        {/* Camera Name & Location */}
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white font-['SF_Pro_Display'] group-hover:text-blue-300 transition-colors">
            {card.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium font-['SF_Pro_Text']">
            {card.location}
          </p>
        </div>

        {/* Camera Health % and Action Button */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-['SF_Pro_Text']">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Camera Health</span>
            <span className="font-extrabold text-white font-mono text-sm tracking-tight">
              {card.health}
            </span>
          </div>

          <button
            onClick={() => onInspect?.(card.id)}
            className={`text-xs font-bold font-['SF_Pro_Text'] transition-colors flex items-center gap-1 ${card.actionColor} cursor-pointer`}
          >
            <span>{card.actionText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CameraIntegritySectionProps {
  cameras?: CameraFeedItem[];
  onInspect?: (camera: CameraFeedItem) => void;
}

export const CameraIntegritySection: React.FC<CameraIntegritySectionProps> = ({ cameras = [], onInspect }) => {
  const featured = useCallback(() => cameras.slice(0, 4).map(toCard), [cameras]);

  return (
    <div className="space-y-4" id="featured-cameras-section">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['SF_Pro_Display'] flex items-center gap-2">
          <span>Featured Cameras</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 font-mono font-bold border border-blue-500/30">
            {cameras.length} registered
          </span>
        </h2>
      </div>

      {cameras.length === 0 ? (
        <div className="liquid-glass-card rounded-2xl border border-white/10 p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-300 font-['SF_Pro_Text']">
            No cameras registered yet.
          </p>
          <p className="text-xs text-slate-500 font-['SF_Pro_Text'] font-mono">
            Connect a camera in the SpectraGuard GUI (or press Start Analysis) — it will appear here with its real name and telemetry.
          </p>
        </div>
      ) : (
        /* 4 Image-First Camera Cards from the REAL registry */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {featured().map((card) => (
            <CameraCardItem
              key={card.id}
              card={card}
              onInspect={(cameraId) => {
                const camera = cameras.find((c) => c.id === cameraId);
                if (camera) onInspect?.(camera);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
