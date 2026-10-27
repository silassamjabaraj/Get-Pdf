import React from 'react';
import { X } from 'lucide-react';
import { PDF_TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import { ToolCategory } from '../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onSelectTool }) => {
  if (!isOpen) return null;

  const categories: { id: ToolCategory; title: string }[] = [
    { id: 'organize', title: 'Organize PDF' },
    { id: 'optimize', title: 'Optimize PDF' },
    { id: 'convert-to-pdf', title: 'Convert to PDF' },
    { id: 'convert-from-pdf', title: 'Convert from PDF' },
    { id: 'edit', title: 'Edit PDF' },
    { id: 'security', title: 'PDF Security' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full my-8 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All PDF Tools</h2>
            <p className="text-xs text-slate-500">Pick any tool to process your documents instantly in your browser</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          {categories.map((cat) => {
            const toolsInCat = PDF_TOOLS.filter((t) => t.category === cat.id);
            if (toolsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {cat.title}
                </h3>
                <ul className="space-y-1.5">
                  {toolsInCat.map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => {
                          onSelectTool(tool.id);
                          onClose();
                        }}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 group transition-colors"
                      >
                        <div className={`p-1.5 rounded-md ${tool.accentBg} shrink-0`}>
                          <ToolIcon name={tool.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-[#248C54] transition-colors">
                            {tool.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{tool.shortDesc}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
