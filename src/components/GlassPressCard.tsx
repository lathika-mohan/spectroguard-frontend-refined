import React, { useState, useRef } from 'react';

interface GlassPressCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassPressCard: React.FC<GlassPressCardProps> = ({
  children,
  className = '',
  onClick,
  id,
}) => {
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
  const maxRotateDeg = 6;
  const rotateX = cursorState.isHovered ? centerOffsetY * maxRotateDeg : 0;
  const rotateY = cursorState.isHovered ? -centerOffsetX * maxRotateDeg : 0;

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: cursorState.isHovered
          ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-4px) scale3d(0.992, 0.992, 0.992)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: cursorState.isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: cursorState.isHovered
          ? `inset ${centerOffsetX * 18}px ${centerOffsetY * 18}px 30px rgba(0, 0, 0, 0.75), 0 20px 40px -10px rgba(15, 23, 42, 0.8), 0 0 30px rgba(37, 99, 235, 0.35)`
          : undefined,
      }}
      className={`group relative liquid-glass-card rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
        cursorState.isHovered ? 'border-blue-500/60 ring-1 ring-blue-500/30' : 'border-white/10'
      } ${className}`}
    >
      {/* 3D Dark Blue Cursor Press Flow Spotlight */}
      {cursorState.isHovered && (
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 260px at ${cursorState.x * 100}% ${cursorState.y * 100}%, rgba(30, 58, 138, 0.45) 0%, rgba(29, 78, 216, 0.15) 45%, transparent 80%)`,
          }}
        />
      )}

      {/* Top light reflection border highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
