/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreateComicForm } from './components/CreateComicForm.tsx';
import { ComicPreview } from './components/ComicPreview.tsx';
import { ExportSuccess } from './components/ExportSuccess.tsx';
import { ComicReaderModal } from './components/ComicReaderModal.tsx';
import { PanelEditorModal } from './components/PanelEditorModal.tsx';
import { ComicStory, ComicPanel, GenerateComicRequest } from './types/comic.ts';
import { exportComicToPdf, exportComicStripPng } from './utils/pdfExport.ts';
import { generateComicPanelSvg, svgToDataUrl } from './utils/comicArtRenderer.ts';

// Initial pre-loaded comic matching the exact prompt and screenshots
function createInitialComic(): ComicStory {
  const setting = 'Forest';
  const style = 'Classic Comic Book';
  const tone = 'Dramatic';
  const character_name = 'Free';

  const panelsData = [
    {
      panel: 1,
      title: 'Panel 1: The Whispering Woods',
      scene_description: 'The young fox, Free, pauses at the edge of the ancient Whispering Woods as twilight falls. The dense tree canopy casts long shadows, and strange emerald fireflies dance between glowing mossy roots.',
      caption: '**CAPTION:** At the edge of the forbidden forest, curiosity outweighs caution.',
      narration: '**NARRATION:** Free had heard the stories of the enchanted grove, where trees remember and shadows speak.',
      dialogue: "Free: 'If the elder spirits are real, this is where they will answer.'",
      image_prompt: 'A bold, sleek orange fox standing at the mossy boundary of an ancient enchanted forest at dusk, ethereal green mist and glowing spores floating between colossal oak trees, dramatic comic book cel-shading.',
      sound_effect: 'RUSTLE...',
    },
    {
      panel: 2,
      title: 'Panel 2: Into the Deep Woods',
      scene_description: 'Venturing deeper under towering gnarled branches, Free follows a faintly visible trail. An eerie silence hangs over the mist as giant roots twist like slumbering serpents across the forest floor.',
      caption: '**CAPTION:** Deeper into the hollow, the path vanishes beneath centuries of untamed moss.',
      narration: '**NARRATION:** Every breath feels heavier. The forest watches in unnatural silence.',
      dialogue: "Free: 'I know you're watching, guardian. Show yourself!'",
      image_prompt: 'Low-angle perspective of an orange fox cautiously walking along a twisted root path in deep mystical woods, fog swirling around paws, faint silhouettes of owl spirits in upper branches.',
      sound_effect: 'STEP...',
    },
    {
      panel: 3,
      title: 'Panel 3: The Crystal Shrine',
      scene_description: 'A sudden opening reveals a sunken stone dais with an ancient floating sapphire crystal. Soft blue and golden light pulses in rhythm with the heartbeat of the woods.',
      caption: '**CAPTION:** At the forest heart, a relic from the dawn age stirs.',
      narration: '**NARRATION:** The pulse sends ripples through the air, shaking dew from the fern leaves.',
      dialogue: "Free: 'The Sacred Shard... it isn't a myth after all.'",
      image_prompt: 'Vibrant comic book panel showing a circular ancient stone clearing with a glowing blue levitating crystal casting dramatic god-rays over an astonished fox character.',
      sound_effect: 'HUMMMM!',
    },
    {
      panel: 4,
      title: 'Panel 4: The Guardian Awakens',
      scene_description: 'The ground trembles as vines and living bark twist together, forming a colossal stag-like forest guardian towering above the shrine with luminous antlers.',
      caption: '**CAPTION:** To claim the light, one must face the forest protector.',
      narration: '**NARRATION:** The guardian sweeps its horned gaze down upon the lone intruder.',
      dialogue: "Guardian: 'WHO DARES ENTER THE SANCTUM OF VERDANT DREAMS?'",
      image_prompt: 'Dramatic high-contrast comic action panel with an immense botanical wood-and-vine stag guardian with antler branches erupting from roots, looming above a fearless fox.',
      sound_effect: 'RUMBLE!',
    },
    {
      panel: 5,
      title: 'Panel 5: The Bond of Valor',
      scene_description: 'Rather than fleeing, Free bows low and places a paw upon the crystal dais. The guardian lowers its antlered head in solemn respect as sunlight pierces the canopy, bathing both in golden dawn.',
      caption: '**CAPTION:** True bravery is not the absence of fear, but the purity of purpose.',
      narration: '**NARRATION:** In the quiet clearing, an ancient alliance is forged anew.',
      dialogue: "Free: 'I seek not to conquer your woods, guardian... but to protect them.'",
      image_prompt: 'Emotional resolution comic panel at sunrise, golden light washing through trees, the giant forest guardian touching foreheads with the brave fox Free over the glowing shrine.',
      sound_effect: 'SHINE!',
    },
  ];

  const panels: ComicPanel[] = panelsData.map((p) => {
    const svg = generateComicPanelSvg({
      panelNumber: p.panel,
      title: p.title,
      setting,
      style,
      tone,
      characterName: character_name,
      soundEffect: p.sound_effect,
      imagePrompt: p.image_prompt,
      sceneDescription: p.scene_description,
    });
    return {
      ...p,
      image_url: svgToDataUrl(svg),
    };
  });

  return {
    id: 'comic_initial',
    title: 'The Whispering Woods: Journey of Free',
    summary: 'A brave young fox enters the forbidden enchanted forest to uncover the secret of the legendary crystal shrine.',
    prompt: 'A brave fox explores an enchanted forest.',
    character_name,
    setting,
    tone,
    style,
    panels,
    created_at: new Date().toISOString(),
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<'create' | 'preview' | 'export_success'>('create');
  const [comic, setComic] = useState<ComicStory>(createInitialComic());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [readerModalOpen, setReaderModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<ComicPanel | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate Comic Handler
  const handleGenerateComic = async (request: GenerateComicRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Step 1/4: Analyzing prompt & structuring comic narrative arc...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Step 2/4: Scripting character dialogues, captions & narration...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Step 3/4: Illustrating stylized comic panels & camera angles...');
      }, 3000);

      const stepTimer3 = setTimeout(() => {
        setGenerationStep('Step 4/4: Assembling comic layout & typography...');
      }, 4500);

      const response = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.comic) {
        throw new Error(data.error || 'Failed to generate comic.');
      }

      setComic(data.comic);
      setCurrentView('preview');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Failed to generate comic. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Export PDF Handler
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportComicToPdf(comic);
      // After export, transition to export-success screen (matching screenshot 2 & 3 flow!)
      setCurrentView('export_success');
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Export PNG Strip Handler
  const handleExportPng = async () => {
    try {
      await exportComicStripPng(comic);
    } catch (err) {
      console.error('PNG export error:', err);
    }
  };

  // Regenerate Single Panel Art Handler
  const handleRegeneratePanelArt = async (panelNumber: number) => {
    try {
      const response = await fetch('/api/comic/regenerate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelNumber,
          prompt: comic.prompt,
          setting: comic.setting,
          style: comic.style,
          tone: comic.tone,
          character_name: comic.character_name,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate panel.');
      const data = await response.json();
      if (data.success && data.panel) {
        setComic((prev) => ({
          ...prev,
          panels: prev.panels.map((p) => (p.panel === panelNumber ? { ...p, ...data.panel } : p)),
        }));
      }
    } catch (err) {
      console.error(err);
      // Fallback local visual regeneration
      setComic((prev) => ({
        ...prev,
        panels: prev.panels.map((p) => {
          if (p.panel === panelNumber) {
            const newSvg = generateComicPanelSvg({
              panelNumber,
              title: p.title,
              setting: comic.setting,
              style: comic.style,
              tone: comic.tone,
              characterName: comic.character_name,
              soundEffect: p.sound_effect,
              imagePrompt: p.image_prompt,
              sceneDescription: p.scene_description,
            });
            return { ...p, image_url: svgToDataUrl(newSvg) };
          }
          return p;
        }),
      }));
    }
  };

  // Save Panel Edits Handler
  const handleSavePanel = (updatedPanel: ComicPanel) => {
    setComic((prev) => ({
      ...prev,
      panels: prev.panels.map((p) => (p.panel === updatedPanel.panel ? updatedPanel : p)),
    }));
  };

  // Regenerate with custom instruction
  const handleRegenerateWithInstruction = async (panelNumber: number, instruction: string) => {
    try {
      const response = await fetch('/api/comic/regenerate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelNumber,
          prompt: comic.prompt,
          setting: comic.setting,
          style: comic.style,
          tone: comic.tone,
          character_name: comic.character_name,
          customInstruction: instruction,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate panel.');
      const data = await response.json();
      if (data.success && data.panel) {
        handleSavePanel(data.panel);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-red-500 text-white text-xs sm:text-sm font-semibold p-3 text-center flex items-center justify-between px-6 z-50">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-white hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View Switcher */}
      {currentView === 'create' && (
        <CreateComicForm
          onGenerate={handleGenerateComic}
          isGenerating={isGenerating}
          currentStepText={generationStep}
        />
      )}

      {currentView === 'preview' && (
        <ComicPreview
          comic={comic}
          onDownloadPdf={handleDownloadPdf}
          onExportPng={handleExportPng}
          onCreateNew={() => setCurrentView('create')}
          onOpenReader={() => setReaderModalOpen(true)}
          onEditPanel={(panel) => setEditingPanel(panel)}
          onRegeneratePanelArt={handleRegeneratePanelArt}
          isExportingPdf={isExportingPdf}
        />
      )}

      {currentView === 'export_success' && (
        <ExportSuccess
          comic={comic}
          onCreateAnother={() => setCurrentView('create')}
          onReturnToPreview={() => setCurrentView('preview')}
          onDownloadPdfAgain={handleDownloadPdf}
          onExportPng={handleExportPng}
        />
      )}

      {/* Full Screen Reader Modal */}
      {readerModalOpen && (
        <ComicReaderModal
          comic={comic}
          onClose={() => setReaderModalOpen(false)}
        />
      )}

      {/* Panel Editor Modal */}
      {editingPanel && (
        <PanelEditorModal
          panel={editingPanel}
          onSave={handleSavePanel}
          onRegenerateWithInstruction={handleRegenerateWithInstruction}
          onClose={() => setEditingPanel(null)}
        />
      )}
    </div>
  );
}
