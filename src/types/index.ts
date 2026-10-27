export type ToolCategory =
  | 'all'
  | 'organize'
  | 'optimize'
  | 'convert-to-pdf'
  | 'convert-from-pdf'
  | 'edit'
  | 'security';

export interface PDFTool {
  id: string;
  title: string;
  shortDesc: string;
  category: ToolCategory;
  badge?: string;
  color: string;
  accentBg: string;
  iconName: string;
  accept: string;
  multiple: boolean;
  featured?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
  rotation?: number; // 0, 90, 180, 270
}

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface PageNumberConfig {
  format: 'number' | 'page_of_total';
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right';
  startFrom: number;
  fontSize: number;
}

export interface ImageToPdfConfig {
  orientation: 'portrait' | 'landscape' | 'auto';
  pageSize: 'fit' | 'a4' | 'letter';
  margin: 'none' | 'small' | 'big';
}

export interface SignConfig {
  signatureDataUrl: string;
  pageNumber: number; // 1-based, or -1 for all
  scale: number;
  posX: number; // 0 to 1 percentage
  posY: number; // 0 to 1 percentage
}

export interface ProcessResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  processedSize: number;
  downloadUrl: string;
  pageCount?: number;
}
