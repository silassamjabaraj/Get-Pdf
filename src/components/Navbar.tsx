import React, { useState } from 'react';
import { Search, ChevronDown, Sparkles, Heart } from 'lucide-react';

interface NavbarProps {
  onSelectTool: (toolId: string) => void;
  onOpenMegaMenu: () => void;
  onOpenSearch: () => void;
  currentToolId: string | null;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTool,
  onOpenMegaMenu,
  onOpenSearch,
  onGoHome,
}) => {
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={onGoHome}
          className="flex items-center text-2xl font-black tracking-tight text-slate-900 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md"
        >
          <span className="text-slate-900">get</span>
          <span className="text-[#248C54]">pdf</span>
        </button>

        {/* Zone 2: 4-5 Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <button
            onClick={() => onSelectTool('merge-pdf')}
            className="hover:text-[#248C54] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Merge PDF
          </button>
          <button
            onClick={() => onSelectTool('split-pdf')}
            className="hover:text-[#248C54] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Split PDF
          </button>
          <button
            onClick={() => onSelectTool('compress-pdf')}
            className="hover:text-[#248C54] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Compress PDF
          </button>

          {/* Convert PDF with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setConvertDropdownOpen(true)}
            onMouseLeave={() => setConvertDropdownOpen(false)}
          >
            <button
              onClick={() => onOpenMegaMenu()}
              className="flex items-center gap-1 hover:text-[#248C54] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              <span>Convert PDF</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </button>

            {convertDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Convert to PDF
                </div>
                <button
                  onClick={() => {
                    onSelectTool('jpg-to-pdf');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  JPG to PDF
                </button>
                <button
                  onClick={() => {
                    onSelectTool('word-to-pdf');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  Word to PDF
                </button>

                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Convert from PDF
                </div>
                <button
                  onClick={() => {
                    onSelectTool('pdf-to-word');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  PDF to Word
                </button>
                <button
                  onClick={() => {
                    onSelectTool('pdf-to-excel');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  PDF to Excel
                </button>
                <button
                  onClick={() => {
                    onSelectTool('pdf-to-powerpoint');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  PDF to PowerPoint
                </button>
                <button
                  onClick={() => {
                    onSelectTool('pdf-to-jpg');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#248C54] transition-colors block"
                >
                  PDF to JPG
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenMegaMenu}
            className="flex items-center gap-1.5 hover:text-[#248C54] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            <span>All PDF Tools</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick search trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-100 rounded-lg transition-colors"
            title="Search tools (Cmd+K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-medium text-slate-400">Search tools</span>
            <kbd className="hidden md:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenMegaMenu}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#248C54] hover:bg-[#1d7344] active:bg-[#165c36] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-[#248C54]/20"
          >
            All Tools
          </button>
        </div>
      </div>
    </header>
  );
};
