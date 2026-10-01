import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, ArrowLeft, FileText, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { ComicStory } from '../types/comic.ts';

interface ExportSuccessProps {
  comic: ComicStory;
  onCreateAnother: () => void;
  onReturnToPreview: () => void;
  onDownloadPdfAgain: () => Promise<void>;
  onExportPng: () => Promise<void>;
}

export const ExportSuccess: React.FC<ExportSuccessProps> = ({
  comic,
  onCreateAnother,
  onReturnToPreview,
  onDownloadPdfAgain,
  onExportPng,
}) => {
  useEffect(() => {
    // Fire celebratory confetti when this screen loads
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full flex flex-col items-center">
        {/* Success Title matching Screenshot 3 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#10a345] mb-4 flex items-center justify-center gap-3">
          <span role="img" aria-label="check">
            ✅
          </span>
          <span>Comic Exported Successfully!</span>
        </h1>

        {/* Description matching Screenshot 3 */}
        <p className="text-base sm:text-lg text-gray-800 mb-8 leading-relaxed max-w-md">
          Your AI-powered comic has been successfully created! Dive back in and bring another story to life.
        </p>

        {/* Comic Summary Card */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-left shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📖</span>
            <span className="font-bold text-gray-900 text-sm">{comic.title}</span>
          </div>
          <p className="text-xs text-gray-600 italic mb-3">
            &ldquo;{comic.summary || comic.prompt}&rdquo;
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
              Hero: {comic.character_name}
            </span>
            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
              {comic.setting}
            </span>
            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">
              {comic.panels.length} Panels
            </span>
          </div>
        </div>

        {/* Primary Action Button matching Screenshot 3 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onCreateAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0265dc] hover:bg-[#0252b3] text-white font-semibold text-base px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span role="img" aria-label="art">
              🎨
            </span>
            <span>Go Create Another Comic</span>
          </button>

          <button
            type="button"
            onClick={onReturnToPreview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-base px-6 py-3 rounded-lg transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span>Return to Preview</span>
          </button>
        </div>

        {/* Secondary Downloads */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
          <button
            type="button"
            onClick={onDownloadPdfAgain}
            className="hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF Again
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={onExportPng}
            className="hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Export as PNG Strip
          </button>
        </div>
      </div>
    </div>
  );
};
