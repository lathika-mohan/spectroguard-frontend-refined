import React, { useState, useRef } from 'react';
import type { AITool } from '../types';
import { 
  Star, 
  Users, 
  Bot, 
  Wand2, 
  Video, 
  Code, 
  Sparkles,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface ToolCardProps {
  tool: AITool;
  onSelect: (tool: AITool) => void;
  onToggleBookmark?: (toolId: string) => void;
  isBookmarked?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState({ x: 0.5, y: 0.5, isHovered: false });

  // Handle cursor position inside card for 3D press flow animation
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

  // Calculate 3D tilt angles: cursor location presses down into 3D screen with dark blue flow
  const centerOffsetX = (cursorState.x - 0.5) * 2; // -1 to 1
  const centerOffsetY = (cursorState.y - 0.5) * 2; // -1 to 1
  const maxRotateDeg = 12;
  const rotateX = cursorState.isHovered ? centerOffsetY * maxRotateDeg : 0;
  const rotateY = cursorState.isHovered ? -centerOffsetX * maxRotateDeg : 0;

  // Render specific icon matching reference image icons
  const renderIcon = () => {
    switch (tool.iconType) {
      case 'chatmind':
        return <Bot className="w-6 h-6 text-white" />;
      case 'imaginepro':
        return <Wand2 className="w-6 h-6 text-white" />;
      case 'vidnova':
        return <Video className="w-6 h-6 text-white" />;
      case 'codegenie':
        return <Code className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(tool)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id={`tool-card-${tool.id}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: cursorState.isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-8px) scale3d(0.985, 0.985, 0.985)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: cursorState.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: cursorState.isHovered
          ? `inset ${centerOffsetX * 18}px ${centerOffsetY * 18}px 28px rgba(0, 0, 0, 0.85), 0 20px 40px -8px rgba(15, 23, 42, 0.8), 0 0 30px rgba(30, 58, 138, 0.45)`
          : undefined,
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 liquid-glass-card overflow-hidden ${
        cursorState.isHovered ? 'border-blue-600/70' : 'border-white/10'
      }`}
    >
      {/* 3D Dark Blue Cursor Press Flow Spotlight */}
      {cursorState.isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 200px at ${cursorState.x * 100}% ${cursorState.y * 100}%, rgba(30, 58, 138, 0.5) 0%, rgba(29, 78, 216, 0.22) 40%, transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Top Header Row: Icon & Bookmark */}
        <div className="flex items-start justify-between mb-4">
          {/* Custom App Icon Box */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${tool.iconBg} shadow-lg shadow-black/40 border border-white/20 group-hover:scale-105 transition-transform duration-300`}>
            {renderIcon()}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.pricing && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-['SF_Pro_Text'] ${
                tool.pricing === 'Free' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : tool.pricing === 'Freemium'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {tool.pricing}
              </span>
            )}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(tool.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tool'}
                id={`bookmark-btn-${tool.id}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Subcategory */}
        <div className="space-y-0.5 mb-2">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors font-['SF_Pro_Display'] flex items-center justify-between">
            <span>{tool.name}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
          </h3>
          <p className="text-xs font-semibold text-blue-400/90 font-['SF_Pro_Text']">
            {tool.subcategory}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-['SF_Pro_Text'] line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      {/* Footer Stats Row (Rating & Users Count) */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-['SF_Pro_Text']">
        {/* Rating */}
        <div className="flex items-center gap-1 font-bold text-white">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{tool.rating.toFixed(1)}</span>
        </div>

        {/* User count */}
        <div className="flex items-center gap-1 text-slate-400 font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{tool.usersCount}</span>
        </div>
      </div>
    </div>
  );
};
