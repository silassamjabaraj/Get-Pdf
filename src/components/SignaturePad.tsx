import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Pen, Type, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureReady: (dataUrl: string) => void;
  initialSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureReady }) => {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('John Doe');
  const [fontFamily, setFontFamily] = useState('cursive');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0F172A';
    } else {
      generateTypedSignature();
    }
  }, [mode, typedName, fontFamily]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureReady(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureReady('');
  };

  const generateTypedSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F172A';
    ctx.font = `italic 48px ${fontFamily}, Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Sign here', canvas.width / 2, canvas.height / 2);

    onSignatureReady(canvas.toDataURL('image/png'));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'draw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'type' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type</span>
          </button>
        </div>

        {mode === 'draw' && (
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {mode === 'draw' ? (
        <div className="relative border border-dashed border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={480}
            height={160}
            className="w-full h-40 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
              Draw your signature here with mouse or finger
            </div>
          )}
          <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none border-b border-slate-300 w-3/4">
            Sign above the line
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value);
              }}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#248C54]"
            />
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-center min-h-[90px] flex items-center justify-center">
            <span
              style={{ fontFamily }}
              className="text-3xl italic text-slate-900 select-none tracking-wide"
            >
              {typedName || 'Sign here'}
            </span>
          </div>

          <div className="flex gap-2">
            {['cursive', 'Caveat, cursive', 'Georgia, serif'].map((font, idx) => (
              <button
                key={font}
                type="button"
                onClick={() => setFontFamily(font)}
                className={`flex-1 py-1 text-xs border rounded-md font-medium ${
                  fontFamily === font ? 'border-[#248C54] bg-orange-50 text-[#248C54]' : 'border-slate-200 text-slate-600'
                }`}
              >
                Style {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
