import { jsPDF } from 'jspdf';
import { ComicStory, ComicPanel } from '../types/comic.ts';

/**
 * Converts an SVG Data URL to a PNG Data URL using an HTML5 Canvas
 */
async function svgDataUrlToPng(svgDataUrl: string, width = 800, height = 540): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(svgDataUrl);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      resolve(svgDataUrl);
    };
    img.src = svgDataUrl;
  });
}

/**
 * Generates and downloads a clean, multi-page Comic PDF
 */
export async function exportComicToPdf(comic: ComicStory): Promise<void> {
  // Standard US Letter: 215.9 x 279.4 mm (approx 8.5 x 11 inches)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // 1. Cover / Title Page
  doc.setFillColor(18, 24, 38);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Comic border on cover
  doc.setDrawColor(251, 191, 36); // Amber
  doc.setLineWidth(1.5);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin - 4) * 2);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(comic.title.toUpperCase(), contentWidth);
  doc.text(titleLines, pageWidth / 2, 60, { align: 'center' });

  // Subtitle / Meta
  doc.setFontSize(13);
  doc.setTextColor(251, 191, 36);
  doc.text(`A ${comic.tone} ${comic.style} Adventure`, pageWidth / 2, 85, { align: 'center' });

  // Character & Setting pill
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text(`Starring: ${comic.character_name}  |  Setting: ${comic.setting}`, pageWidth / 2, 98, { align: 'center' });

  // Teaser Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 5, 115, contentWidth - 10, 45, 3, 3, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(241, 245, 249);
  const summaryLines = doc.splitTextToSize(`"${comic.summary || comic.prompt}"`, contentWidth - 25);
  doc.text(summaryLines, margin + 12, 130);

  // Cover footer badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(251, 191, 36);
  doc.text('COMICCRAFT ORIGINAL COMICS', pageWidth / 2, pageHeight - 35, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 27, { align: 'center' });

  // 2. Individual Panel Pages (Matching the exact structure of the screenshots!)
  for (let i = 0; i < comic.panels.length; i++) {
    const panel = comic.panels[i];
    doc.addPage();

    // White page background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    let currentY = margin + 5;

    // Header: Panel X: Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text(`Panel ${panel.panel}: ${panel.title}`, margin, currentY);
    currentY += 8;

    // Panel Artwork Image
    try {
      const pngData = await svgDataUrlToPng(panel.image_url, 800, 540);
      const imgWidth = contentWidth;
      const imgHeight = (contentWidth * 540) / 800; // Keep aspect ratio
      doc.addImage(pngData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    } catch {
      currentY += 80;
    }

    // Italicized Scene Description
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(panel.scene_description, contentWidth);
    doc.text(descLines, margin, currentY);
    currentY += descLines.length * 5 + 4;

    // Caption Box (if present)
    if (panel.caption) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      const cleanCaption = panel.caption.replace(/^\*\*CAPTION:\*\*\s*/i, '');
      const capLines = doc.splitTextToSize(`CAPTION: ${cleanCaption}`, contentWidth);
      doc.text(capLines, margin, currentY);
      currentY += capLines.length * 5 + 3;
    }

    // Narration Box
    if (panel.narration) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);
      const cleanNarration = panel.narration.replace(/^\*\*NARRATION:\*\*\s*/i, '');
      const narLines = doc.splitTextToSize(`NARRATION: ${cleanNarration}`, contentWidth);
      doc.text(narLines, margin, currentY);
      currentY += narLines.length * 5 + 3;
    }

    // Dialogue Line
    if (panel.dialogue) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(180, 83, 9);
      const cleanDialogue = panel.dialogue.replace(/^\*\*DIALOGUE:\*\*\s*/i, '');
      const diaLines = doc.splitTextToSize(`DIALOGUE: ${cleanDialogue}`, contentWidth);
      doc.text(diaLines, margin, currentY);
      currentY += diaLines.length * 5 + 3;
    }

    // Image Prompt Box (at bottom)
    if (panel.image_prompt) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      doc.text('IMAGE PROMPT:', margin, currentY);
      currentY += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const promptLines = doc.splitTextToSize(panel.image_prompt, contentWidth);
      doc.text(promptLines, margin, currentY);
    }

    // Page Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i + 2} of ${comic.panels.length + 1}  •  ComicCraft`, pageWidth / 2, pageHeight - 8, {
      align: 'center',
    });
  }

  // Save PDF
  const filename = `${comic.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}_comic.pdf`;
  doc.save(filename);
}

/**
 * Exports all panels combined into a vertical Comic Strip PNG
 */
export async function exportComicStripPng(comic: ComicStory): Promise<void> {
  const panelWidth = 800;
  const panelHeight = 540;
  const headerHeight = 120;
  const gap = 30;
  const totalHeight = headerHeight + comic.panels.length * (panelHeight + gap) + 60;

  const canvas = document.createElement('canvas');
  canvas.width = panelWidth + 60;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Comic Border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // Header Title
  ctx.fillStyle = '#111827';
  ctx.font = "bold 34px 'Bangers', cursive, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(comic.title.toUpperCase(), canvas.width / 2, 60);

  ctx.fillStyle = '#4b5563';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText(`A ${comic.tone} story featuring ${comic.character_name} in ${comic.setting}`, canvas.width / 2, 95);

  let y = headerHeight;

  for (const panel of comic.panels) {
    const png = await svgDataUrlToPng(panel.image_url, panelWidth, panelHeight);
    await new Promise<void>((res) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 30, y, panelWidth, panelHeight);
        res();
      };
      img.onerror = () => res();
      img.src = png;
    });
    y += panelHeight + gap;
  }

  const link = document.createElement('a');
  link.download = `${comic.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}_strip.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
