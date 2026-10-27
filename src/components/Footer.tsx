import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTool: (toolId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-sm text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: getpdf Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">getpdf</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTool('merge-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('split-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('compress-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('jpg-to-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  JPG to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Convert Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Convert & Edit</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTool('pdf-to-word')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  PDF to Word
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('pdf-to-excel')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  PDF to Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('rotate-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Rotate PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('watermark-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Watermark PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Security & Sign */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTool('protect-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Protect PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('sign-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Sign PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('page-numbers')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Page Numbers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('organize-pdf')}
                  className="hover:text-[#248C54] transition-colors"
                >
                  Organize PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Local Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Privacy Guarantee</h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All document processing occurs locally inside your web browser. Your files and personal data remain 100% on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© 2026 getpdf · Built with</span>
            <Heart className="w-3.5 h-3.5 fill-[#248C54] text-[#248C54] inline-block" />
            <span>for PDF users worldwide</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Client-side WebAssembly & PDF-Lib Engine</span>
            <span>·</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
