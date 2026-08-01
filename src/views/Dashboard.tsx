import React, { useState, useMemo } from 'react';
import type { CategoryType, AITool, NotificationItem } from '../types';
import { INITIAL_TOOLS, INITIAL_NOTIFICATIONS } from '../data/toolsData';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { HeroBanner } from '../components/HeroBanner';
import { ToolCard } from '../components/ToolCard';
import { ToolDetailModal } from '../components/ToolDetailModal';
import { SubmitToolModal } from '../components/SubmitToolModal';
import { NotificationsDrawer } from '../components/NotificationsDrawer';
import { DashboardView } from '../components/DashboardView';
import { ToolInsightsSection } from '../components/ToolInsightsSection';
import { CameraIntegritySection } from '../components/CameraIntegritySection';
import { Sparkles, Filter } from 'lucide-react';
import { BackgroundLoopCanvas } from '../components/BackgroundLoopCanvas';

export default function Dashboard() {
  const [tools, setTools] = useState<AITool[]>(INITIAL_TOOLS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Dashboard');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'newThisWeek'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'directory' | 'dashboard'>('directory');

  // Handle sidebar navigation clicks
  const handleSelectNavPage = (category: CategoryType) => {
    setActiveCategory(category);
    setSelectedFilter('all');

    if (category === 'Cameras') {
      const elem = document.getElementById('camera-integrity-section');
      elem?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'Forensics') {
      const elem = document.getElementById('operational-overview-section');
      elem?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'Predictions') {
      const elem = document.getElementById('on-demand-verification-card');
      elem?.scrollIntoView({ behavior: 'smooth' });
    } else if (category === 'Dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Modals & Drawers state
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['code-genie', 'chatmind-ai']);

  // Toggle Bookmark
  const handleToggleBookmark = (toolId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  // Submit new tool handler
  const handleAddTool = (newTool: AITool) => {
    setTools((prev) => [newTool, ...prev]);
  };

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Tools': tools.length };
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(query);
        const matchesDesc = tool.description.toLowerCase().includes(query);
        const matchesSub = tool.subcategory.toLowerCase().includes(query);
        const matchesTag = tool.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesSub && !matchesTag) return false;
      }

      // New this week filter
      if (selectedFilter === 'newThisWeek') {
        return true; // All items in demo or recently added
      }

      // Category filter
      if (activeCategory !== 'All Tools') {
        return tool.category === activeCategory;
      }

      return true;
    });
  }, [tools, activeCategory, selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-['SF_Pro_Text'] selection:bg-blue-500/30 relative">
      {/* Smooth static loop animation canvas fixed in the background */}
      <BackgroundLoopCanvas />
      
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        notificationCount={12}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {activeView === 'dashboard' ? (
          <DashboardView
            tools={tools}
            bookmarkedIds={bookmarkedIds}
            onSelectTool={(t) => setSelectedTool(t)}
            onToggleBookmark={handleToggleBookmark}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          />
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            
            {/* Left Sidebar Menu */}
            <Sidebar
              activeCategory={activeCategory}
              setActiveCategory={handleSelectNavPage}
              categoryCounts={categoryCounts}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

            {/* Right Content Area */}
            <div className="flex-1 w-full space-y-8 min-w-0">
              
              {/* Hero Banner Section matching exact text and plane black / transparent liquid glass layout */}
              <HeroBanner
                onExploreClick={() => {
                  const elem = document.getElementById('catalog-grid-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Search Result Header or Primary Dashboard View */}
              {searchQuery ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-blue-400" />
                      <h2 className="text-xl font-bold text-white font-['SF_Pro_Display']">
                        Search Results for "{searchQuery}"
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                        {filteredTools.length} found
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-blue-400 hover:text-blue-300 underline font-['SF_Pro_Text']"
                    >
                      Clear search
                    </button>
                  </div>

                  {filteredTools.length === 0 ? (
                    <div className="liquid-glass-card p-12 rounded-2xl text-center space-y-3 border border-white/10">
                      <p className="text-slate-300 font-medium font-['SF_Pro_Text']">No surveillance records matching your query.</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-['SF_Pro_Text']"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                      {filteredTools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          onSelect={(t) => setSelectedTool(t)}
                          onToggleBookmark={handleToggleBookmark}
                          isBookmarked={bookmarkedIds.includes(tool.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Primary Dashboard View: Camera Integrity & Operational Insights */
                <>
                  {/* Camera Integrity Overview Section */}
                  <CameraIntegritySection />
 
                  {/* Tool Insights & Recent Integrity Events Section */}
                  <div className="pt-2 border-t border-white/10" id="catalog-grid-section">
                    <ToolInsightsSection 
                      onSelectTool={(t) => setSelectedTool(t)}
                      onViewAllRecentlyAdded={() => {
                        const elem = document.getElementById('recent-integrity-events-section');
                        elem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  </div>
                </>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#030712]/90 py-6 mt-12 text-slate-400 text-xs font-['SF_Pro_Text']">
        <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white font-['SF_Pro_Display']">SPECTRAGUARD</span>
            <span>— Surveillance Integrity Command Center</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">API Integration</span>
            <span className="text-slate-500">© 2026 SpectraGuard Inc.</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlay Drawers */}
      <ToolDetailModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={selectedTool ? bookmarkedIds.includes(selectedTool.id) : false}
      />

      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitTool={handleAddTool}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearNotifications={() => setNotifications([])}
      />

    </div>
  );
}
