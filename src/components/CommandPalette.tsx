import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { PDF_TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search
          const btn = document.querySelector('button[title*="Search"]') as HTMLButtonElement;
          btn?.click();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = PDF_TOOLS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PDF tools (e.g. merge, compress, protect, sign)..."
            className="w-full px-3 py-4 text-base focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No tools matching "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tool.accentBg} shrink-0`}>
                      <ToolIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#248C54] transition-colors">
                        {tool.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{tool.shortDesc}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-[#248C54]">Select →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or touch</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
