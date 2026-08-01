import React, { useState, useRef } from 'react';

interface FeaturedCameraData {
  id: string;
  camId: string;
  badge: 'VERIFIED' | 'REVIEW' | 'ALERT';
  badgeColor: string;
  badgeDotColor: string;
  title: string;
  location: string;
  health: string;
  actionText: string;
  actionColor: string;
  imageUrl: string;
}

const FEATURED_CAMERAS: FeaturedCameraData[] = [
  {
    id: 'lobby-entrance',
    camId: 'CAM-01',
    badge: 'VERIFIED',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    badgeDotColor: 'bg-emerald-400',
    title: 'Lobby Entrance',
    location: 'Main Building',
    health: '99.8%',
    actionText: 'Inspect →',
    actionColor: 'text-blue-400 hover:text-blue-300',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'warehouse-gate',
    camId: 'CAM-02',
    badge: 'REVIEW',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    badgeDotColor: 'bg-amber-400',
    title: 'Warehouse Gate',
    location: 'Warehouse Block A',
    health: '94.2%',
    actionText: 'Inspect →',
    actionColor: 'text-blue-400 hover:text-blue-300',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'parking-zone-b',
    camId: 'CAM-03',
    badge: 'ALERT',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    badgeDotColor: 'bg-rose-400',
    title: 'Parking Zone B',
    location: 'East Parking Area',
    health: '81.4%',
    actionText: 'Investigate →',
    actionColor: 'text-rose-400 hover:text-rose-300 font-bold',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'main-corridor',
    camId: 'CAM-04',
    badge: 'VERIFIED',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    badgeDotColor: 'bg-emerald-400',
    title: 'Main Corridor',
    location: 'Administration Wing',
    health: '99.1%',
    actionText: 'Inspect →',
    actionColor: 'text-blue-400 hover:text-blue-300',
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
  },
];

// 3D Glass Press Push Card Component for Featured Cameras
const CameraCardItem: React.FC<{ card: FeaturedCameraData }> = ({ card }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState({ x: 0.5, y: 0.5, isHovered: false });

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

      {/* TOP IMAGE THUMBNAIL AREA (Image-first card) */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-900 shrink-0">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover saturate-[0.75] contrast-[1.15] brightness-[0.85] group-hover:scale-105 group-hover:saturate-100 transition-all duration-500"
        />
        
        {/* Subtle Vignette & Blue Tint CCTV Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-slate-950/20 to-blue-900/20 mix-blend-multiply pointer-events-none" />
        
        {/* CCTV Top Info Overlay Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow pointer-events-none z-20">
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {card.camId} • REC
          </span>
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            LIVE
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
            onClick={() => alert(`Opening inspection console for ${card.title}`)}
            className={`text-xs font-bold font-['SF_Pro_Text'] transition-colors flex items-center gap-1 ${card.actionColor}`}
          >
            <span>{card.actionText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export const CameraIntegritySection: React.FC = () => {
  return (
    <div className="space-y-4" id="featured-cameras-section">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['SF_Pro_Display'] flex items-center gap-2">
          <span>Featured Cameras</span>
        </h2>
      </div>

      {/* 4 Image-First Camera Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {FEATURED_CAMERAS.map((card) => (
          <CameraCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

