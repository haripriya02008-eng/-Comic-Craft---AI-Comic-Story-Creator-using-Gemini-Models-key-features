import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, Maximize2 } from 'lucide-react';
import { ComicStory } from '../types/comic.ts';

interface ComicReaderModalProps {
  comic: ComicStory;
  onClose: () => void;
}

export const ComicReaderModal: React.FC<ComicReaderModalProps> = ({ comic, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showOverlays, setShowOverlays] = useState(true);

  const panel = comic.panels[currentIdx];
  const total = comic.panels.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIdx((prev) => (prev < total - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total, onClose]);

  if (!panel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
            {comic.title}
          </span>
          <h2 className="text-base sm:text-lg font-bold">
            Panel {panel.panel}: {panel.title.replace(/^Panel\s*\d+[:\s\-]*/i, '')}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className={`text-xs px-2.5 py-1.5 rounded font-medium border transition flex items-center gap-1.5 ${
              showOverlays ? 'bg-amber-400 text-black border-amber-400' : 'bg-transparent text-white border-gray-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Speech Bubbles: {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex items-center justify-center my-4 max-w-4xl mx-auto w-full relative">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          disabled={currentIdx === 0}
          className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-20 transition z-20 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Panel Frame */}
        <div className="w-full max-w-3xl bg-black rounded-lg overflow-hidden border-4 border-amber-400/80 shadow-2xl relative flex flex-col">
          <div className="relative">
            <img
              src={panel.image_url}
              alt={`Panel ${panel.panel}`}
              className="w-full h-auto max-h-[60vh] object-contain mx-auto block"
            />

            {/* In-Panel Comic Overlays */}
            {showOverlays && (
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                {panel.caption && (
                  <div className="self-start max-w-[80%] bg-amber-300 border-2 border-black px-3 py-1 text-black text-xs font-bold font-comic shadow-[3px_3px_0px_#000]">
                    {panel.caption.replace(/^\*\*CAPTION:\*\*\s*/i, '')}
                  </div>
                )}
                {panel.dialogue && (
                  <div className="self-end max-w-[75%] bg-white border-2 border-black rounded-xl px-3 py-2 text-black text-xs font-bold font-comic shadow-[3px_3px_0px_#000] relative speech-bubble">
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

          {/* Bottom Narrative Strip */}
          <div className="bg-gray-900 p-4 border-t border-gray-800 text-left space-y-1.5">
            <p className="text-xs sm:text-sm italic text-gray-300">
              {panel.scene_description}
            </p>
            {panel.narration && (
              <p className="text-xs text-amber-200/90 font-medium">
                {panel.narration.replace(/^\*\*NARRATION:\*\*\s*/i, '')}
              </p>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => setCurrentIdx((p) => Math.min(total - 1, p + 1))}
          disabled={currentIdx === total - 1}
          className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-20 transition z-20 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Progress Controls */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full text-xs text-gray-400">
        <div>
          <span>Keyboard: Left / Right arrows or Space</span>
        </div>
        <div className="flex items-center gap-1.5">
          {comic.panels.map((p, idx) => (
            <button
              key={p.panel}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`w-7 h-7 rounded font-bold transition flex items-center justify-center cursor-pointer ${
                idx === currentIdx
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div>
          <span>
            Panel {currentIdx + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  );
};
