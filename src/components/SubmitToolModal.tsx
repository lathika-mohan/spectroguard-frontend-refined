import React, { useState } from 'react';
import type { AITool, CategoryType } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTool: (newTool: AITool) => void;
}

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({
  isOpen,
  onClose,
  onSubmitTool,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Development');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [pricing, setPricing] = useState<'Free' | 'Freemium' | 'Paid'>('Freemium');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const newTool: AITool = {
      id: `tool-${Date.now()}`,
      name,
      category,
      subcategory: subcategory || 'AI Utility',
      description,
      longDescription: description,
      rating: 5.0,
      usersCount: '1.0K',
      iconType: 'generic',
      iconBg: 'from-blue-600 to-indigo-700',
      pricing,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['AI', category],
      addedDate: new Date().toISOString().split('T')[0],
      features: ['Automated integration', 'Real-time API', 'Cloud persistence']
    };

    onSubmitTool(newTool);
    onClose();
    // Reset
    setName('');
    setDescription('');
    setSubcategory('');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl liquid-glass-hero p-6 border border-white/20 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['SF_Pro_Display']">Submit an AI Tool</h2>
              <p className="text-xs text-slate-400">Add a new verified tool to ToolNova index</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tool Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CodeGenie AI"
              className="w-full liquid-glass-input rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full liquid-glass-input rounded-xl px-3 py-2 text-sm text-white bg-[#0a1226] focus:outline-none"
              >
                <option value="AI Writing">AI Writing</option>
                <option value="Image Generation">Image Generation</option>
                <option value="Video Tools">Video Tools</option>
                <option value="Productivity">Productivity</option>
                <option value="Marketing">Marketing</option>
                <option value="Analytics">Analytics</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Code Assistant"
                className="w-full liquid-glass-input rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this AI tool does..."
              className="w-full liquid-glass-input rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pricing Model</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value as any)}
                className="w-full liquid-glass-input rounded-xl px-3 py-2 text-sm text-white bg-[#0a1226] focus:outline-none"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Coding, LLM, Assistant"
                className="w-full liquid-glass-input rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
