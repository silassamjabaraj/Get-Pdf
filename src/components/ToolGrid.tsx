import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { PDFTool, ToolCategory } from '../types';
import { PDF_TOOLS, CATEGORIES } from '../data/tools';
import { ToolIcon } from './ToolIcon';

interface ToolGridProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none p-1 bg-slate-100 rounded-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Filter Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#248C54] focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Grid of Tools */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-base font-semibold text-slate-700">No PDF tools found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or choosing another category.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#248C54] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Show All Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Tool Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105 ${tool.accentBg}`}
                >
                  <ToolIcon name={tool.iconName} className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#248C54] transition-colors mb-2">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">{tool.shortDesc}</p>
              </div>

              {/* Action prompt */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-[#248C54] transition-colors">
                <span>Use tool</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
