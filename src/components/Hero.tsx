import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

interface HeroProps {
  onSelectTool: (toolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTool }) => {
  return (
    <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
        Every tool you need to use PDFs, <span className="text-[#248C54]">at your fingertips.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-balance leading-relaxed">
        All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, sign, protect and watermark PDFs with just a few clicks.
      </p>

      {/* Trust & Privacy Markers (clean text with typographic separators) */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-side Privacy</span>
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Instant In-browser Processing</span>
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-slate-700" />
          <span>Files Never Leave Your Device</span>
        </span>
      </div>

      {/* Quick Action Pills for Popular Tasks */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onSelectTool('merge-pdf')}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-[#248C54] hover:bg-emerald-100 transition-colors"
        >
          Merge PDF
        </button>
        <button
          onClick={() => onSelectTool('split-pdf')}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
        >
          Split PDF
        </button>
        <button
          onClick={() => onSelectTool('compress-pdf')}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          Compress PDF
        </button>
        <button
          onClick={() => onSelectTool('jpg-to-pdf')}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
        >
          JPG to PDF
        </button>
        <button
          onClick={() => onSelectTool('sign-pdf')}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
        >
          Sign PDF
        </button>
      </div>
    </section>
  );
};
