import React from 'react';
import type { AITool } from '../types';
import { 
  X, 
  Star, 
  Users, 
  ExternalLink, 
  Check, 
  Bookmark, 
  Share2, 
  Bot, 
  Wand2, 
  Video, 
  Code, 
  Sparkles,
  Calendar,
  Tag
} from 'lucide-react';

interface ToolDetailModalProps {
  tool: AITool | null;
  onClose: () => void;
  onToggleBookmark: (toolId: string) => void;
  isBookmarked: boolean;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
  onToggleBookmark,
  isBookmarked,
}) => {
  if (!tool) return null;

  const renderIcon = () => {
    switch (tool.iconType) {
      case 'chatmind': return <Bot className="w-8 h-8 text-white" />;
      case 'imaginepro': return <Wand2 className="w-8 h-8 text-white" />;
      case 'vidnova': return <Video className="w-8 h-8 text-white" />;
      case 'codegenie': return <Code className="w-8 h-8 text-white" />;
      default: return <Sparkles className="w-8 h-8 text-white" />;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(`Link to ${tool.name} copied to clipboard!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl liquid-glass-hero p-6 sm:p-8 border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
        id={`tool-modal-${tool.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          id="close-tool-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Information */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center bg-gradient-to-br ${tool.iconBg} shadow-xl border border-white/20`}>
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                {tool.category} • {tool.subcategory}
              </span>
              <span className="text-xs font-bold text-slate-300 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                {tool.pricing}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['SF_Pro_Display']">
              {tool.name}
            </h2>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 text-center text-xs font-['SF_Pro_Text']">
          <div>
            <p className="text-slate-400 mb-0.5">Rating</p>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{tool.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>
          <div className="border-x border-white/10">
            <p className="text-slate-400 mb-0.5">Active Users</p>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-sm">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{tool.usersCount}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Added Date</p>
            <div className="flex items-center justify-center gap-1 font-bold text-white text-sm">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{tool.addedDate}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-['SF_Pro_Display']">
            About {tool.name}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed font-['SF_Pro_Text']">
            {tool.longDescription || tool.description}
          </p>
        </div>

        {/* Key Features */}
        {tool.features && tool.features.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-['SF_Pro_Display']">
              Key Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 p-2.5 rounded-lg bg-white/5 border border-white/5 font-['SF_Pro_Text']">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {tool.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => onToggleBookmark(tool.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'liquid-glass-card text-white hover:bg-white/10 border-white/15'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl liquid-glass-card text-slate-300 hover:text-white border-white/15 hover:bg-white/10 transition-colors"
            title="Share Tool"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <a
            href={tool.websiteUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all font-['SF_Pro_Text']"
          >
            <span>Visit Tool Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
