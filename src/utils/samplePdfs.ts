import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Creates a valid, styled sample PDF file directly in the browser using pdf-lib
 */
export async function createSamplePdf(
  title: string = 'Sample Document',
  pageCount: number = 3,
  theme: 'business' | 'contract' | 'report' = 'business'
): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const colors = {
    business: { primary: rgb(0.14, 0.55, 0.33), dark: rgb(0.12, 0.16, 0.22) },
    contract: { primary: rgb(0.15, 0.39, 0.92), dark: rgb(0.12, 0.16, 0.22) },
    report: { primary: rgb(0.06, 0.72, 0.5), dark: rgb(0.12, 0.16, 0.22) },
  }[theme];

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
    const { width, height } = page.getSize();

    // Top Header bar
    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.96, 0.97, 0.99),
    });

    page.drawText('getpdf Sample Document', {
      x: 40,
      y: height - 38,
      size: 14,
      font: boldFont,
      color: colors.primary,
    });

    page.drawText(`Page ${i} of ${pageCount}`, {
      x: width - 110,
      y: height - 38,
      size: 10,
      font,
      color: rgb(0.4, 0.45, 0.5),
    });

    // Main Heading
    page.drawText(`${title} - Section ${i}`, {
      x: 40,
      y: height - 120,
      size: 22,
      font: boldFont,
      color: colors.dark,
    });

    // Subtitle
    page.drawText(`Generated for testing PDF merge, split, rotate, watermark, and sign.`, {
      x: 40,
      y: height - 145,
      size: 11,
      font,
      color: rgb(0.45, 0.5, 0.55),
    });

    // Content paragraphs
    const paragraphs = [
      `1. Document Purpose: This document provides realistic test pages to verify client-side PDF document manipulation capabilities including sorting, extraction, rotation, and security stamps.`,
      `2. Verification Checklist: Review typography clarity, margins, headers, and footer alignment across all rendered pages.`,
      `3. Compression & Stream Testing: High-fidelity layout structured to test stream density, object parsing, and metadata preservation.`,
      `4. Encryption & Signatures: Ready for digital sign placement, text watermarking at varying opacity degrees, and multi-format conversion.`,
    ];

    let currentY = height - 200;
    for (const para of paragraphs) {
      page.drawText(para.slice(0, 80), {
        x: 40,
        y: currentY,
        size: 10,
        font,
        color: rgb(0.2, 0.25, 0.3),
      });
      if (para.length > 80) {
        page.drawText(para.slice(80), {
          x: 40,
          y: currentY - 14,
          size: 10,
          font,
          color: rgb(0.2, 0.25, 0.3),
        });
      }
      currentY -= 40;
    }

    // A decorative box
    page.drawRectangle({
      x: 40,
      y: currentY - 80,
      width: width - 80,
      height: 70,
      color: rgb(0.97, 0.98, 1.0),
      borderColor: colors.primary,
      borderWidth: 1,
    });

    page.drawText(`STATUS: VERIFIED READY FOR PROCESSING`, {
      x: 60,
      y: currentY - 45,
      size: 10,
      font: boldFont,
      color: colors.primary,
    });

    page.drawText(`Local in-browser processing via getpdf engine. 100% private.`, {
      x: 60,
      y: currentY - 65,
      size: 9,
      font,
      color: rgb(0.3, 0.35, 0.4),
    });

    // Footer
    page.drawText(`Document ID: GPDF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, {
      x: 40,
      y: 40,
      size: 8,
      font,
      color: rgb(0.6, 0.65, 0.7),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const sanitizedName = `${title.toLowerCase().replace(/\s+/g, '_')}_${pageCount}p.pdf`;
  return new File([blob], sanitizedName, { type: 'application/pdf' });
}

/**
 * Creates a sample JPG image using HTML Canvas
 */
export function createSampleImage(title: string = 'Sample Photo', color: string = '#248C54'): File {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, color);
  grad.addColorStop(1, '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Card
  ctx.fillStyle = '#FFFFFF';
  ctx.roundRect(80, 80, 1040, 640, 24);
  ctx.fill();

  // Badge
  ctx.fillStyle = color;
  ctx.fillRect(140, 140, 80, 10);

  // Text
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText(title, 140, 220);

  ctx.fillStyle = '#64748B';
  ctx.font = '24px sans-serif';
  ctx.fillText('Ready to convert to high quality PDF with getpdf', 140, 270);

  ctx.font = '20px sans-serif';
  ctx.fillText('Resolution: 1200 x 800 px  |  Format: JPG', 140, 320);

  // Decorative shapes
  ctx.fillStyle = color + '15';
  ctx.beginPath();
  ctx.arc(900, 450, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('getpdf', 850, 460);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: 'image/jpeg' });
  const filename = `${title.toLowerCase().replace(/\s+/g, '_')}.jpg`;
  return new File([blob], filename, { type: 'image/jpeg' });
}
