import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  ArrowLeft,
  Trash2,
  MoveLeft,
  MoveRight,
  FileText,
  CheckCircle2,
  Download,
  RotateCw,
  Plus,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { PDFTool, UploadedFile, WatermarkConfig, PageNumberConfig, ImageToPdfConfig, SignConfig, ProcessResult } from '../types';
import { ToolIcon } from './ToolIcon';
import { SignaturePad } from './SignaturePad';
import { createSamplePdf, createSampleImage } from '../utils/samplePdfs';
import {
  inspectPdf,
  mergePdfs,
  splitPdf,
  rotatePdf,
  watermarkPdf,
  addPageNumbersToPdf,
  imagesToPdf,
  signPdf,
  protectPdf,
  compressPdf,
  convertPdfToWord,
  convertPdfToExcel,
  convertPdfToJpg,
} from '../utils/pdfEngine';

interface ToolWorkspaceProps {
  tool: PDFTool;
  onBack: () => void;
  onSelectOtherTool: (toolId: string) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onBack, onSelectOtherTool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool specific configurations
  const [splitRange, setSplitRange] = useState('1-2');
  const [compressLevel, setCompressLevel] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    text: 'CONFIDENTIAL',
    fontSize: 32,
    opacity: 0.35,
    rotation: 45,
    color: 'red',
    position: 'center',
  });
  const [pageNumberConfig, setPageNumberConfig] = useState<PageNumberConfig>({
    format: 'page_of_total',
    position: 'bottom-center',
    startFrom: 1,
    fontSize: 10,
  });
  const [imageToPdfConfig, setImageToPdfConfig] = useState<ImageToPdfConfig>({
    orientation: 'auto',
    pageSize: 'a4',
    margin: 'small',
  });
  const [protectPassword, setProtectPassword] = useState('Secret2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [signDataUrl, setSignDataUrl] = useState('');
  const [signPage, setSignPage] = useState(1);
  const [signScale, setSignScale] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when tool changes
  useEffect(() => {
    setFiles([]);
    setResult(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setProgressPercent(0);
  }, [tool.id]);

  const handleFilesAdded = async (newRawFiles: FileList | File[]) => {
    setErrorMessage(null);
    const addedList: UploadedFile[] = [];

    for (let i = 0; i < newRawFiles.length; i++) {
      const f = newRawFiles[i];
      let pCount = 1;
      if (f.type.includes('pdf')) {
        const info = await inspectPdf(f);
        pCount = info.pageCount;
      }
      addedList.push({
        id: `${f.name}_${Date.now()}_${i}`,
        file: f,
        name: f.name,
        size: f.size,
        pageCount: pCount,
        rotation: 0,
      });
    }

    if (tool.multiple) {
      setFiles((prev) => [...prev, ...addedList]);
    } else {
      setFiles(addedList.slice(0, 1));
    }
  };

  const handleUseSample = async () => {
    setErrorMessage(null);
    if (tool.id === 'jpg-to-pdf') {
      const img1 = createSampleImage('Project Overview Chart', '#E5322D');
      const img2 = createSampleImage('Q3 Financial Summary', '#2563EB');
      handleFilesAdded([img1, img2]);
    } else if (tool.id === 'merge-pdf') {
      const pdf1 = await createSamplePdf('Contract Document A', 2, 'contract');
      const pdf2 = await createSamplePdf('Appendix Report B', 3, 'report');
      handleFilesAdded([pdf1, pdf2]);
    } else {
      const pdf = await createSamplePdf(`${tool.title} Test Document`, 3, 'business');
      handleFilesAdded([pdf]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const reordered = [...files];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setFiles(reordered);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgressPercent(10);
    setErrorMessage(null);

    try {
      let output: ProcessResult;

      switch (tool.id) {
        case 'merge-pdf':
          output = await mergePdfs(
            files.map((f) => f.file),
            (pct) => setProgressPercent(pct)
          );
          break;

        case 'split-pdf':
          output = await splitPdf(files[0].file, splitRange, (pct) => setProgressPercent(pct));
          break;

        case 'rotate-pdf':
          output = await rotatePdf(files[0].file, rotationAngle, (pct) => setProgressPercent(pct));
          break;

        case 'watermark-pdf':
          output = await watermarkPdf(files[0].file, watermarkConfig, (pct) => setProgressPercent(pct));
          break;

        case 'page-numbers':
          output = await addPageNumbersToPdf(files[0].file, pageNumberConfig, (pct) => setProgressPercent(pct));
          break;

        case 'jpg-to-pdf':
          output = await imagesToPdf(
            files.map((f) => f.file),
            imageToPdfConfig,
            (pct) => setProgressPercent(pct)
          );
          break;

        case 'sign-pdf':
          if (!signDataUrl) {
            throw new Error('Please draw or create your signature first before proceeding.');
          }
          output = await signPdf(
            files[0].file,
            {
              signatureDataUrl: signDataUrl,
              pageNumber: signPage,
              scale: signScale,
              posX: 0.6,
              posY: 0.8,
            },
            (pct) => setProgressPercent(pct)
          );
          break;

        case 'protect-pdf':
          if (!protectPassword) throw new Error('Please enter a protection password.');
          output = await protectPdf(files[0].file, protectPassword, (pct) => setProgressPercent(pct));
          break;

        case 'compress-pdf':
          output = await compressPdf(files[0].file, compressLevel, (pct) => setProgressPercent(pct));
          break;

        case 'pdf-to-word':
          output = await convertPdfToWord(files[0].file, (pct) => setProgressPercent(pct));
          break;

        case 'pdf-to-excel':
          output = await convertPdfToExcel(files[0].file, (pct) => setProgressPercent(pct));
          break;

        case 'pdf-to-jpg':
          output = await convertPdfToJpg(files[0].file, (pct) => setProgressPercent(pct));
          break;

        case 'organize-pdf':
          // Reorder or keep current files
          output = await mergePdfs([files[0].file], (pct) => setProgressPercent(pct));
          break;

        default:
          // Fallback pass-through
          output = await compressPdf(files[0].file, 'recommended', (pct) => setProgressPercent(pct));
          break;
      }

      setResult(output);
      setIsProcessing(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#248C54', '#3B82F6', '#10B981', '#F59E0B'],
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'An error occurred while processing the file.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ----------------------------------------------------
  // RESULT VIEW
  // ----------------------------------------------------
  if (result) {
    const isCompressed = tool.id === 'compress-pdf';
    const reductionPercent =
      result.originalSize > 0
        ? Math.max(0, Math.round(((result.originalSize - result.processedSize) / result.originalSize) * 100))
        : 0;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {tool.id === 'merge-pdf' && 'PDFs have been merged!'}
              {tool.id === 'split-pdf' && 'PDF has been split!'}
              {tool.id === 'compress-pdf' && 'PDF has been compressed!'}
              {tool.id === 'rotate-pdf' && 'PDF has been rotated!'}
              {tool.id === 'watermark-pdf' && 'Watermark stamped successfully!'}
              {tool.id === 'page-numbers' && 'Page numbers added!'}
              {tool.id === 'sign-pdf' && 'PDF signed successfully!'}
              {tool.id === 'protect-pdf' && 'PDF encrypted and secured!'}
              {tool.id === 'jpg-to-pdf' && 'Images converted to PDF!'}
              {tool.id === 'pdf-to-word' && 'Converted to Word DOC!'}
              {tool.id === 'pdf-to-excel' && 'Extracted to Excel spreadsheet!'}
              {tool.id === 'pdf-to-jpg' && 'Page extracted to high-res JPG!'}
              {!['merge-pdf', 'split-pdf', 'compress-pdf', 'rotate-pdf', 'watermark-pdf', 'page-numbers', 'sign-pdf', 'protect-pdf', 'jpg-to-pdf', 'pdf-to-word', 'pdf-to-excel', 'pdf-to-jpg'].includes(tool.id) &&
                'File processed successfully!'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Your generated file is ready to save. Processed locally in your browser.
            </p>
          </div>

          {/* Metrics comparison if compression */}
          {isCompressed && (
            <div className="max-w-md mx-auto grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Original Size</span>
                <span className="text-lg font-bold text-slate-600 font-mono tabular-nums">
                  {formatFileSize(result.originalSize)}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Compressed Size</span>
                <span className="text-lg font-bold text-emerald-600 font-mono tabular-nums">
                  {formatFileSize(result.processedSize)}{' '}
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    -{reductionPercent}%
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <a
              href={result.downloadUrl}
              download={result.fileName}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-lg font-bold text-white bg-[#248C54] hover:bg-[#1d7344] active:bg-[#165c36] rounded-xl shadow-lg shadow-[#248C54]/25 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-6 h-6" />
              <span>Download {result.fileName.endsWith('.doc') ? 'Word Document' : result.fileName.endsWith('.csv') ? 'Excel Sheet' : result.fileName.endsWith('.jpg') ? 'JPG Image' : 'PDF'}</span>
            </a>
          </div>

          {/* Continue with another tool strip */}
          <div className="pt-6 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Next Steps
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setFiles([]);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Process Another File</span>
              </button>

              <button
                onClick={() => onSelectOtherTool('compress-pdf')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compress this PDF</span>
              </button>

              <button
                onClick={() => onSelectOtherTool('protect-pdf')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Protect with Password</span>
              </button>

              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Tools</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // WORKSPACE VIEW
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Back to all tools"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${tool.accentBg}`}>
              <ToolIcon name={tool.iconName} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{tool.title}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">{tool.shortDesc}</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add more files</span>
            </button>
            <button
              onClick={() => setFiles([])}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
              title="Clear all files"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={tool.accept}
        multiple={tool.multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesAdded(e.target.files);
          }
        }}
      />

      {/* EMPTY / UPLOAD STATE */}
      {files.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFilesAdded(e.dataTransfer.files);
            }
          }}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all bg-white ${
            isDragging ? 'border-[#248C54] bg-red-50/30' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-red-50 text-[#248C54] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <ToolIcon name={tool.iconName} className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{tool.title}</h2>
              <p className="text-slate-500 text-sm mt-1">{tool.shortDesc}</p>
            </div>

            {/* Big Iconic Red Button */}
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-[#248C54] hover:bg-[#1d7344] active:bg-[#165c36] rounded-xl shadow-lg shadow-[#248C54]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>
                  {tool.id === 'jpg-to-pdf'
                    ? 'Select JPG images'
                    : tool.multiple
                    ? 'Select PDF files'
                    : 'Select PDF file'}
                </span>
              </button>

              <div className="text-xs text-slate-400 font-medium">or drop files here</div>
            </div>

            {/* Try Sample Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleUseSample}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#248C54] bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Don't have a file? Use test sample</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* POPULATED WORKSPACE STATE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Files Visual Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
              <span>Selected Files ({files.length})</span>
              {tool.multiple && <span>Drag or reorder files</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((fileItem, idx) => (
                <div
                  key={fileItem.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  {/* File card top */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-[#248C54] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* File Details */}
                  <div className="space-y-1 mb-4">
                    <div className="text-sm font-bold text-slate-900 truncate" title={fileItem.name}>
                      {fileItem.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-mono tabular-nums">{formatFileSize(fileItem.size)}</span>
                      {fileItem.pageCount && (
                        <>
                          <span>·</span>
                          <span>{fileItem.pageCount} {fileItem.pageCount === 1 ? 'page' : 'pages'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Move Left / Right controls if multiple */}
                  {tool.multiple && files.length > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => moveFile(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                        title="Move left"
                      >
                        <MoveLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-semibold text-slate-400">#{idx + 1}</span>
                      <button
                        onClick={() => moveFile(idx, 'right')}
                        disabled={idx === files.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                        title="Move right"
                      >
                        <MoveRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add file button card */}
              {tool.multiple && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#248C54] hover:bg-red-50/30 transition-all min-h-[140px]"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs font-semibold">Add more files</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Configuration & Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">{tool.title} Settings</h3>
                <p className="text-xs text-slate-500">Configure parameters before processing</p>
              </div>

              {/* TOOL SPECIFIC SETTINGS */}

              {/* Merge Settings */}
              {tool.id === 'merge-pdf' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                    PDFs will be combined in the exact order shown on the left.
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Total Documents:</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">{files.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Combined Pages:</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {files.reduce((acc, cur) => acc + (cur.pageCount || 1), 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Split Settings */}
              {tool.id === 'split-pdf' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Extract Page Range
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-2, 3"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#248C54] font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Example: "1-2" extracts pages 1 and 2. Type "all" for every page.
                    </p>
                  </div>
                </div>
              )}

              {/* Compress Settings */}
              {tool.id === 'compress-pdf' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 block">Compression Level</label>
                  {(
                    [
                      { id: 'extreme', name: 'Extreme Compression', desc: 'Less quality, high compression' },
                      { id: 'recommended', name: 'Recommended Compression', desc: 'Good quality, good compression' },
                      { id: 'low', name: 'Less Compression', desc: 'High quality, less compression' },
                    ] as const
                  ).map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setCompressLevel(lvl.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        compressLevel === lvl.id
                          ? 'border-[#248C54] bg-red-50/40 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl.name}</div>
                      <div className="text-[11px] text-slate-500">{lvl.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rotate Settings */}
              {tool.id === 'rotate-pdf' && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 block">Rotation Step</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotationAngle(deg)}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                          rotationAngle === deg
                            ? 'border-[#248C54] bg-red-50 text-[#248C54]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>{deg}°</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Watermark Settings */}
              {tool.id === 'watermark-pdf' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkConfig.text}
                      onChange={(e) => setWatermarkConfig({ ...watermarkConfig, text: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#248C54]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Opacity: {Math.round(watermarkConfig.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={watermarkConfig.opacity}
                      onChange={(e) =>
                        setWatermarkConfig({ ...watermarkConfig, opacity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#248C54]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Position</label>
                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {(
                        [
                          'top-left',
                          'top-center',
                          'top-right',
                          'center',
                          'bottom-left',
                          'bottom-center',
                          'bottom-right',
                        ] as const
                      ).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setWatermarkConfig({ ...watermarkConfig, position: pos })}
                          className={`py-1 text-[10px] font-semibold rounded ${
                            watermarkConfig.position === pos
                              ? 'bg-[#248C54] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Page Numbers Settings */}
              {tool.id === 'page-numbers' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Number Format</label>
                    <select
                      value={pageNumberConfig.format}
                      onChange={(e) =>
                        setPageNumberConfig({
                          ...pageNumberConfig,
                          format: e.target.value as 'page_of_total' | 'number',
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#248C54]"
                    >
                      <option value="page_of_total">Page 1 of 10</option>
                      <option value="number">1, 2, 3...</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['bottom-center', 'bottom-right', 'bottom-left', 'top-right'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPageNumberConfig({ ...pageNumberConfig, position: pos })}
                          className={`py-1.5 text-xs font-medium rounded-lg border ${
                            pageNumberConfig.position === pos
                              ? 'border-[#248C54] bg-red-50 text-[#248C54]'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Protect Settings */}
              {tool.id === 'protect-pdf' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Set Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={protectPassword}
                        onChange={(e) => setProtectPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#248C54] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">256-bit AES military-grade standard protection.</p>
                  </div>
                </div>
              )}

              {/* Sign Settings */}
              {tool.id === 'sign-pdf' && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 block">Create Electronic Signature</label>
                  <SignaturePad onSignatureReady={(url) => setSignDataUrl(url)} />
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Target Page:</span>
                    <input
                      type="number"
                      min="1"
                      max={files[0]?.pageCount || 1}
                      value={signPage}
                      onChange={(e) => setSignPage(parseInt(e.target.value, 10) || 1)}
                      className="w-16 px-2 py-1 text-right border border-slate-300 rounded-md font-mono"
                    />
                  </div>
                </div>
              )}

              {/* JPG to PDF Settings */}
              {tool.id === 'jpg-to-pdf' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Orientation</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['auto', 'portrait', 'landscape'] as const).map((orient) => (
                        <button
                          key={orient}
                          type="button"
                          onClick={() => setImageToPdfConfig({ ...imageToPdfConfig, orientation: orient })}
                          className={`py-1.5 text-xs font-medium rounded-lg border capitalize ${
                            imageToPdfConfig.orientation === orient
                              ? 'border-[#248C54] bg-red-50 text-[#248C54]'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {orient}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Page Margin</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['none', 'small', 'big'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setImageToPdfConfig({ ...imageToPdfConfig, margin: m })}
                          className={`py-1.5 text-xs font-medium rounded-lg border capitalize ${
                            imageToPdfConfig.margin === m
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PDF to Office Converters Note */}
              {['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg'].includes(tool.id) && (
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700 space-y-1">
                  <div className="font-bold">Format Optimization:</div>
                  <div>Converts text streams, tables, and vector graphics to native editable office formats.</div>
                </div>
              )}

              {/* Processing Progress Bar */}
              {isProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Processing {tool.title}...</span>
                    <span className="font-mono tabular-nums">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#248C54] h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* BIG RED ACTION BUTTON */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcess}
                className="w-full py-4 px-6 text-base font-bold text-white bg-[#248C54] hover:bg-[#1d7344] active:bg-[#165c36] disabled:bg-slate-300 rounded-xl shadow-lg shadow-[#248C54]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{tool.title}</span>
                    <ToolIcon name={tool.iconName} className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  Files are securely processed directly on your computer
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
