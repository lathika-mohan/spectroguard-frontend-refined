import React from 'react';
import type { AITool } from '../types';
import { ToolCard } from './ToolCard';
import { 
  BarChart3, 
  Bookmark, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Zap, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  tools: AITool[];
  bookmarkedIds: string[];
  onSelectTool: (tool: AITool) => void;
  onToggleBookmark: (toolId: string) => void;
  onOpenSubmitModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tools,
  bookmarkedIds,
  onSelectTool,
  onToggleBookmark,
  onOpenSubmitModal,
}) => {
  const bookmarkedTools = tools.filter((t) => bookmarkedIds.includes(t.id));
  const featuredTools = tools.filter((t) => t.isFeatured);

  // Category statistics calculation
  const statsByCategory = tools.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dashboard Top Banner */}
      <div className="liquid-glass-hero p-6 sm:p-8 rounded-2xl border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold uppercase tracking-wider font-['SF_Pro_Display']">
              <BarChart3 className="w-4 h-4" />
              <span>Personalized AI Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['SF_Pro_Display']">
              ToolNova Dashboard & Insights
            </h1>
            <p className="text-sm text-slate-300 font-['SF_Pro_Text'] mt-1 max-w-xl">
              Track your saved AI tools, inspect industry benchmarks, and manage custom submissions.
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all font-['SF_Pro_Text']"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit New AI Tool</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-['SF_Pro_Display']">Indexed Tools</p>
            <h3 className="text-2xl font-bold text-white font-['SF_Pro_Display']">{tools.length} Tools</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+14 this week</span>
            </p>
          </div>
        </div>

        <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-['SF_Pro_Display']">Bookmarked</p>
            <h3 className="text-2xl font-bold text-white font-['SF_Pro_Display']">{bookmarkedTools.length} Saved</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Ready for quick launch</p>
          </div>
        </div>

        <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-['SF_Pro_Display']">Verified Status</p>
            <h3 className="text-2xl font-bold text-white font-['SF_Pro_Display']">100% Passed</h3>
            <p className="text-[11px] text-indigo-300 mt-0.5">Automated security check</p>
          </div>
        </div>

        <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-['SF_Pro_Display']">Avg Rating</p>
            <h3 className="text-2xl font-bold text-white font-['SF_Pro_Display']">4.8 / 5.0</h3>
            <p className="text-[11px] text-purple-300 mt-0.5">Across 45K reviews</p>
          </div>
        </div>

      </div>

      {/* Saved Bookmarks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-['SF_Pro_Display'] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Bookmarked AI Tools ({bookmarkedTools.length})</span>
          </h2>
        </div>

        {bookmarkedTools.length === 0 ? (
          <div className="liquid-glass-card p-8 rounded-2xl text-center border border-white/10">
            <p className="text-slate-400 text-sm mb-3">You haven't bookmarked any tools yet.</p>
            <p className="text-xs text-slate-500">Click the bookmark icon on any tool card in the main directory to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarkedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown Progress */}
      <div className="liquid-glass-hero p-6 rounded-2xl border border-white/15 space-y-4">
        <h3 className="text-lg font-bold text-white font-['SF_Pro_Display']">
          AI Tools Category Index Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(statsByCategory).map(([cat, count]) => {
            const countNum = Number(count);
            const percentage = Math.round((countNum / tools.length) * 100);
            return (
              <div key={cat} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-200 mb-1.5 font-['SF_Pro_Text']">
                  <span className="font-semibold">{cat}</span>
                  <span className="text-slate-400">{countNum} tools ({percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
