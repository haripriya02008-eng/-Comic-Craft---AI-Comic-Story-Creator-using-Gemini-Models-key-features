import React, { useState } from 'react';
import { X, Save, Sparkles, RotateCw } from 'lucide-react';
import { ComicPanel } from '../types/comic.ts';

interface PanelEditorModalProps {
  panel: ComicPanel;
  onSave: (updatedPanel: ComicPanel) => void;
  onRegenerateWithInstruction: (panelNumber: number, instruction: string) => Promise<void>;
  onClose: () => void;
}

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  panel,
  onSave,
  onRegenerateWithInstruction,
  onClose,
}) => {
  const [title, setTitle] = useState(panel.title);
  const [sceneDesc, setSceneDesc] = useState(panel.scene_description);
  const [caption, setCaption] = useState(panel.caption);
  const [narration, setNarration] = useState(panel.narration);
  const [dialogue, setDialogue] = useState(panel.dialogue);
  const [imagePrompt, setImagePrompt] = useState(panel.image_prompt);
  const [customInstruction, setCustomInstruction] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSave = () => {
    onSave({
      ...panel,
      title,
      scene_description: sceneDesc,
      caption,
      narration,
      dialogue,
      image_prompt: imagePrompt,
    });
    onClose();
  };

  const handleAiRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateWithInstruction(panel.panel, customInstruction);
      onClose();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Edit Panel {panel.panel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Panel Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Scene Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Scene Description (Italicized)
            </label>
            <textarea
              rows={2}
              value={sceneDesc}
              onChange={(e) => setSceneDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Caption (**CAPTION:**)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Narration */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Narration (**NARRATION:**)
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Dialogue */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Dialogue (**DIALOGUE:**)
            </label>
            <input
              type="text"
              value={dialogue}
              onChange={(e) => setDialogue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Image Prompt */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Image Prompt (**IMAGE PROMPT:**)
            </label>
            <textarea
              rows={2}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
            />
          </div>

          {/* AI Adjust Panel Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask AI to Rewrite & Regenerate this Panel</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Add more intense suspense and a surprise monster shadow..."
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-blue-300 rounded focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAiRegenerate}
                disabled={isRegenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                {isRegenerating ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
