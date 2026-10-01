import React, { useState } from 'react';
import {
  Download,
  PlusCircle,
  Eye,
  LayoutGrid,
  FileText,
  RotateCw,
  Edit3,
  MessageSquare,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { ComicStory, ComicPanel } from '../types/comic.ts';

interface ComicPreviewProps {
  comic: ComicStory;
  onDownloadPdf: () => Promise<void>;
  onExportPng: () => Promise<void>;
  onCreateNew: () => void;
  onOpenReader: () => void;
  onEditPanel: (panel: ComicPanel) => void;
  onRegeneratePanelArt: (panelNumber: number) => Promise<void>;
  isExportingPdf: boolean;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  comic,
  onDownloadPdf,
  onExportPng,
  onCreateNew,
  onOpenReader,
  onEditPanel,
  onRegeneratePanelArt,
  isExportingPdf,
}) => {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'page' | 'grid'>('page');
  const [showOverlays, setShowOverlays] = useState(true);
  const [regeneratingPanel, setRegeneratingPanel] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleRegenerate = async (panelNum: number) => {
    setRegeneratingPanel(panelNum);
    try {
      await onRegeneratePanelArt(panelNum);
    } finally {
      setRegeneratingPanel(null);
    }
  };

  const handleShareStory = () => {
    const text = `Read my AI comic "${comic.title}" starring ${comic.character_name}!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Top Floating Controls Bar */}
      <div className="w-full max-w-4xl mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sticky top-4 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            <PlusCircle className="w-4 h-4 text-gray-500" />
            <span>New Comic</span>
          </button>

          <button
            type="button"
            onClick={onOpenReader}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Reader Mode</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-0.5 rounded-lg flex items-center">
            <button
              type="button"
              onClick={() => setLayoutMode('page')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                layoutMode === 'page' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📖 Comic Page
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('vertical')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                layoutMode === 'vertical' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                layoutMode === 'grid' ? 'bg-white shadow text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5" /> Grid
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 cursor-pointer ${
              showOverlays
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Bubbles: {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onExportPng}
            title="Export as continuous PNG comic strip"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>PNG Strip</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#0265dc] hover:bg-[#0252b3] px-3.5 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {isExportingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Header matching screenshot */}
      <div className="text-center mb-6 max-w-xl">
        <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-[#2b2b2b]">
          <span role="img" aria-label="book">
            📖
          </span>
          <h1>Your Comic Preview</h1>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-2">{comic.title}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
            Hero: {comic.character_name}
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
            Setting: {comic.setting}
          </span>
          <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full">
            Style: {comic.style}
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
            Tone: {comic.tone}
          </span>
          {comic.image_engine && (
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              {comic.image_engine === 'stable_diffusion' ? 'Stable Diffusion AI' : 'Comic Vector Art'}
            </span>
          )}
        </div>
        {comic.summary && (
          <p className="text-xs sm:text-sm text-gray-600 italic mt-2.5 bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
            &ldquo;{comic.summary}&rdquo;
          </p>
        )}
      </div>

      {/* 1. COMIC BOOK SPREAD PAGE LAYOUT */}
      {layoutMode === 'page' && (
        <div className="w-full max-w-4xl bg-white border-4 border-black p-4 sm:p-6 shadow-2xl rounded-sm">
          {/* Comic Masthead Banner */}
          <div className="border-b-4 border-black pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                COLLECTOR&apos;S EDITION &bull; ISSUE #1
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-comic uppercase tracking-wider text-black mt-1">
                {comic.title}
              </h2>
              <p className="text-xs text-gray-700 italic">
                A {comic.tone} story starring {comic.character_name} in {comic.setting}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">COMICCRAFT</div>
              <div className="text-[10px] text-gray-400 font-mono">APPROVED BY AI COMICS CODE</div>
            </div>
          </div>

          {/* 5-Panel Comic Page Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comic.panels.map((panel, idx) => {
              const isFirst = idx === 0;
              const isRegen = regeneratingPanel === panel.panel;

              return (
                <div
                  key={panel.panel}
                  className={`border-3 border-black bg-gray-900 relative rounded-sm overflow-hidden flex flex-col group ${
                    isFirst ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Top Panel Title & Action Header */}
                  <div className="bg-black text-white text-[11px] font-bold px-2 py-1 flex items-center justify-between z-10">
                    <span className="font-comic tracking-wide uppercase">
                      Panel {panel.panel}: {panel.title.replace(/^Panel\s*\d+[:\s\-]*/i, '')}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onEditPanel(panel)}
                        className="hover:text-blue-300 p-0.5"
                        title="Edit text"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRegenerate(panel.panel)}
                        disabled={isRegen}
                        className="hover:text-green-300 p-0.5"
                        title="Regenerate art"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isRegen ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Panel Artwork with Comic Bubbles */}
                  <div className="relative flex-1 min-h-[220px] bg-black">
                    <img
                      src={panel.image_url}
                      alt={`Panel ${panel.panel}`}
                      className="w-full h-full object-cover block select-none"
                    />

                    {/* Speech & Narration Overlays */}
                    {showOverlays && (
                      <div className="absolute inset-0 p-2.5 flex flex-col justify-between pointer-events-none">
                        {panel.caption && (
                          <div className="self-start max-w-[85%] bg-amber-200 border-2 border-black px-2 py-0.5 text-black text-[10px] sm:text-xs font-bold font-comic shadow-[2px_2px_0px_#000000]">
                            {panel.caption.replace(/^\*\*CAPTION:\*\*\s*/i, '')}
                          </div>
                        )}

                        {panel.dialogue && (
                          <div className="self-end max-w-[78%] bg-white border-2 border-black rounded-lg px-2.5 py-1 text-black text-[11px] sm:text-xs font-bold font-comic shadow-[2px_2px_0px_#000000] relative speech-bubble">
                            <span className="text-blue-900 block font-black text-[9px] uppercase">
                              {comic.character_name}
                            </span>
                            <span>
                              {panel.dialogue.replace(/^\*\*DIALOGUE:\*\*\s*/i, '').replace(/^.*?:\s*/, '')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Caption Strip */}
                  <div className="bg-white p-2 border-t-2 border-black text-left">
                    <p className="text-[11px] sm:text-xs italic text-gray-700 leading-snug">
                      {panel.scene_description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comic Page Footer */}
          <div className="border-t-2 border-black mt-4 pt-2 flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>COMICCRAFT ORIGINALS &bull; ISSUE #1</span>
            <span>END OF ISSUE &bull; TO BE CONTINUED!</span>
          </div>
        </div>
      )}

      {/* 2. VERTICAL CARDS / GRID LAYOUT MATCHING SCREENSHOT */}
      {layoutMode !== 'page' && (
      <div
        className={`w-full ${
          layoutMode === 'vertical'
            ? 'max-w-[680px] space-y-7'
            : 'max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6'
        }`}
      >
        {comic.panels.map((panel) => {
          const isRegen = regeneratingPanel === panel.panel;

          return (
            <div
              key={panel.panel}
              className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-5 sm:p-6 transition hover:shadow-md relative group"
            >
              {/* Panel Top Title */}
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Panel {panel.panel}: {panel.title.replace(/^Panel\s*\d+[:\s\-]*/i, '')}
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditPanel(panel)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition cursor-pointer"
                    title="Edit panel story & dialogue"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerate(panel.panel)}
                    disabled={isRegen}
                    className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition cursor-pointer disabled:opacity-50"
                    title="Regenerate panel artwork"
                  >
                    <RotateCw className={`w-4 h-4 ${isRegen ? 'animate-spin text-green-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Panel Image Container with Optional Comic Overlays */}
              <div className="relative rounded-lg overflow-hidden border-2 border-black bg-gray-900 mb-4 group/art shadow-sm">
                <img
                  src={panel.image_url}
                  alt={`Panel ${panel.panel}`}
                  className="w-full h-auto object-cover block select-none transition-transform duration-300 group-hover/art:scale-[1.01]"
                />

                {/* Comic Speech Balloon / Caption Overlays */}
                {showOverlays && (
                  <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                    {/* Top Yellow Narration Box */}
                    {panel.caption && (
                      <div className="self-start max-w-[85%] bg-amber-200 border-2 border-black px-2.5 py-1 text-black text-[11px] sm:text-xs font-bold font-comic shadow-[2px_2px_0px_#000000]">
                        {panel.caption.replace(/^\*\*CAPTION:\*\*\s*/i, '')}
                      </div>
                    )}

                    {/* Character Dialogue Speech Balloon */}
                    {panel.dialogue && (
                      <div className="self-end max-w-[80%] bg-white border-2 border-black rounded-xl px-3 py-1.5 text-black text-xs font-bold font-comic shadow-[3px_3px_0px_#000000] relative speech-bubble">
                        <span className="text-blue-900 block font-black text-[10px] uppercase">
                          {comic.character_name}
                        </span>
                        <span>
                          {panel.dialogue.replace(/^\*\*DIALOGUE:\*\*\s*/i, '').replace(/^.*?:\s*/, '')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Italicized scene description matching screenshot */}
              <p className="text-sm italic text-gray-600 leading-relaxed mb-4">
                {panel.scene_description}
              </p>

              {/* Captions, Narration, Dialogue and Prompts matching screenshot */}
              <div className="space-y-2 text-xs sm:text-sm text-gray-800 border-t border-gray-100 pt-3">
                {panel.caption && (
                  <div className="text-gray-800">
                    <span className="font-bold text-gray-900">**CAPTION:**</span>{' '}
                    <span>{panel.caption.replace(/^\*\*CAPTION:\*\*\s*/i, '')}</span>
                  </div>
                )}

                {panel.narration && (
                  <div className="text-gray-800">
                    <span className="font-bold text-gray-900">**NARRATION:**</span>{' '}
                    <span>{panel.narration.replace(/^\*\*NARRATION:\*\*\s*/i, '')}</span>
                  </div>
                )}

                {panel.dialogue && (
                  <div className="text-gray-800">
                    <span className="font-bold text-gray-900">**DIALOGUE:**</span>{' '}
                    <span className="font-semibold text-amber-900">
                      {panel.dialogue.replace(/^\*\*DIALOGUE:\*\*\s*/i, '')}
                    </span>
                  </div>
                )}

                {panel.image_prompt && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-200 mt-2 font-mono leading-relaxed">
                    <span className="font-bold text-gray-800 block mb-0.5">**IMAGE PROMPT:**</span>
                    <span>{panel.image_prompt}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Bottom Download Bar matching Screenshot 2 */}
      <div className="mt-10 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isExportingPdf}
          className="inline-flex items-center gap-2.5 bg-[#0265dc] hover:bg-[#0252b3] active:bg-[#024497] text-white text-base sm:text-lg font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {isExportingPdf ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span role="img" aria-label="download" className="text-xl">
              📥
            </span>
          )}
          <span>Download Your Comic as PDF</span>
        </button>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3.5 rounded-lg transition cursor-pointer"
        >
          <span>🎨</span> Create Another Comic
        </button>
      </div>
    </div>
  );
};
