import React, { useState } from 'react';
import { Sparkles, Wand2, BookOpen, Shuffle } from 'lucide-react';
import { GenerateComicRequest } from '../types/comic.ts';

interface CreateComicFormProps {
  onGenerate: (data: GenerateComicRequest) => Promise<void>;
  isGenerating: boolean;
  currentStepText: string;
}

const PRESET_STORIES = [
  {
    label: '🦊 The Brave Fox',
    prompt: 'A brave fox explores an enchanted forest to uncover the secret of the glowing guardian shrine.',
    character_name: 'Free',
    setting: 'Forest',
    tone: 'Dramatic',
    style: 'Classic Comic Book',
  },
  {
    label: '🌆 Cyber Samurai',
    prompt: 'A rogue ronin in a rain-slicked neon megalopolis tracks a stolen memory drive through dark alleyways.',
    character_name: 'Ren',
    setting: 'Cyberpunk Metropolis',
    tone: 'Mysterious',
    style: 'Cyberpunk',
  },
  {
    label: '🚀 Deep Space 99',
    prompt: 'An astronaut and a curious zero-gravity alien creature investigate a mysterious derelict star cruiser.',
    character_name: 'Nova',
    setting: 'Space Station',
    tone: 'Action-packed',
    style: 'Manga / Anime',
  },
  {
    label: '🏰 Dragon Knight',
    prompt: 'A young squire discovers that the terrifying mountain dragon actually protects the ancient kingdom relics.',
    character_name: 'Gareth',
    setting: 'Medieval Castle',
    tone: 'Epic Fantasy',
    style: 'Watercolor',
  },
  {
    label: '🌊 Sunken Oracle',
    prompt: 'A marine explorer discovers glowing ruins guarded by giant sea creatures deep beneath the ocean trench.',
    character_name: 'Kael',
    setting: 'Underwater Kingdom',
    tone: 'Mysterious',
    style: 'Realistic',
  },
];

export const CreateComicForm: React.FC<CreateComicFormProps> = ({
  onGenerate,
  isGenerating,
  currentStepText,
}) => {
  const [prompt, setPrompt] = useState('A brave fox explores an enchanted forest.');
  const [characterName, setCharacterName] = useState('Free');
  const [characterDesc, setCharacterDesc] = useState('A clever orange fox with bright amber eyes and a frayed adventurer bandana');
  const [showAdvancedChar, setShowAdvancedChar] = useState(false);
  const [setting, setSetting] = useState('Forest');
  const [tone, setTone] = useState('Dramatic');
  const [style, setStyle] = useState('Classic Comic Book');
  const [panelCount, setPanelCount] = useState(5);
  const [imageEngine, setImageEngine] = useState<'stable_diffusion' | 'stylized_art'>('stable_diffusion');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !prompt.trim()) return;
    onGenerate({
      prompt: prompt.trim(),
      character_name: characterName.trim() || 'Hero',
      character_description: characterDesc.trim(),
      setting,
      tone,
      style,
      panel_count: panelCount,
      image_engine: imageEngine,
    });
  };

  const applyPreset = (preset: (typeof PRESET_STORIES)[0]) => {
    setPrompt(preset.prompt);
    setCharacterName(preset.character_name);
    setSetting(preset.setting);
    setTone(preset.tone);
    setStyle(preset.style);
    if (preset.character_name === 'Free') {
      setCharacterDesc('A clever orange fox with bright amber eyes and a frayed adventurer bandana');
    } else if (preset.character_name === 'Ren') {
      setCharacterDesc('A battle-hardened cyber warrior with a chrome visor and glowing katana');
    } else if (preset.character_name === 'Nova') {
      setCharacterDesc('An intrepid astronaut in a sleek white EVA suit with holographic HUD');
    } else if (preset.character_name === 'Gareth') {
      setCharacterDesc('A youthful knight in battle-dented iron plate with an eagle crest shield');
    } else {
      setCharacterDesc('An athletic deep-sea diver with glowing bioluminescent scuba gear');
    }
  };

  const randomizePreset = () => {
    const random = PRESET_STORIES[Math.floor(Math.random() * PRESET_STORIES.length)];
    applyPreset(random);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 15, 25, 0.45), rgba(10, 15, 25, 0.7)), url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Centered Glass/Card matching screenshot */}
      <div className="w-full max-w-[540px] bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-100 z-10 transition-all">
        {/* Header matching screenshot */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl" role="img" aria-label="pencil">
            ✏️
          </span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Your Comic</h1>
        </div>

        {/* Quick Inspiration Presets */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Story Presets:
            </span>
            <button
              type="button"
              onClick={randomizePreset}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Shuffle className="w-3 h-3" /> Randomize
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_STORIES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-2.5 py-1 rounded-md border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form matching exact inputs and layout */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Story Prompt */}
          <div>
            <label htmlFor="prompt" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Story Prompt:
            </label>
            <textarea
              id="prompt"
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              disabled={isGenerating}
              placeholder="e.g. A brave fox explores an enchanted forest to find the ancient relic..."
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y transition"
            />
          </div>

          {/* Main Character Name & Customization */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="character_name" className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Main Character Name:
              </label>
              <button
                type="button"
                onClick={() => setShowAdvancedChar(!showAdvancedChar)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {showAdvancedChar ? '- Hide details' : '+ Character details'}
              </button>
            </div>
            <input
              type="text"
              id="character_name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              required
              disabled={isGenerating}
              placeholder="e.g. Free"
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {showAdvancedChar && (
              <div className="mt-2">
                <label htmlFor="character_desc" className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Character Visual Details / Appearance:
                </label>
                <input
                  type="text"
                  id="character_desc"
                  value={characterDesc}
                  onChange={(e) => setCharacterDesc(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. Red fox with white chest fur and green eyes"
                  className="w-full px-3 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Setting */}
          <div>
            <label htmlFor="setting" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Setting:
            </label>
            <select
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="Forest">Forest</option>
              <option value="Futuristic City">Futuristic City</option>
              <option value="Space Station">Space Station</option>
              <option value="Medieval Castle">Medieval Castle</option>
              <option value="Underwater Kingdom">Underwater Kingdom</option>
              <option value="Cyberpunk Metropolis">Cyberpunk Metropolis</option>
              <option value="Haunted Victorian Mansion">Haunted Victorian Mansion</option>
              <option value="Desert Wasteland">Desert Wasteland</option>
            </select>
          </div>

          {/* Story Tone */}
          <div>
            <label htmlFor="tone" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Story Tone:
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="Dramatic">Dramatic</option>
              <option value="Comedic">Comedic</option>
              <option value="Mysterious">Mysterious</option>
              <option value="Action-packed">Action-packed</option>
              <option value="Whimsical">Whimsical</option>
              <option value="Dark & Gritty">Dark & Gritty</option>
              <option value="Epic Fantasy">Epic Fantasy</option>
            </select>
          </div>

          {/* Art Style */}
          <div>
            <label htmlFor="style" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Art Style:
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="Classic Comic Book">Classic Comic Book</option>
              <option value="Realistic">Realistic</option>
              <option value="Manga / Anime">Manga / Anime</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Cyberpunk">Cyberpunk</option>
              <option value="Vintage 1950s Golden Age">Vintage 1950s Golden Age</option>
              <option value="Dark Graphic Novel / Noir">Dark Graphic Novel / Noir</option>
              <option value="Saturday Morning Cartoon">Saturday Morning Cartoon</option>
            </select>
          </div>

          {/* Image Engine & Panels */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Image Engine */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                AI Image Engine:
              </label>
              <select
                value={imageEngine}
                onChange={(e) => setImageEngine(e.target.value as any)}
                disabled={isGenerating}
                className="w-full px-2.5 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="stable_diffusion">🎨 Stable Diffusion AI</option>
                <option value="stylized_art">✒️ Stylized Comic Vector</option>
              </select>
            </div>

            {/* Panel Count */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Panel Count:
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setPanelCount(num)}
                    disabled={isGenerating}
                    className={`py-1 text-xs font-bold rounded border transition ${
                      panelCount === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-[#0265dc] hover:bg-[#0252b3] disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Comic with Stable Diffusion...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Comic</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Generation Progress steps */}
        {isGenerating && (
          <div className="mt-3.5 p-3 bg-blue-50 rounded-lg border border-blue-100 text-center animate-pulse">
            <p className="text-xs font-medium text-blue-800">{currentStepText}</p>
          </div>
        )}

        {/* Footer info badge */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Gemini 3.8 Flash &bull; Stable Diffusion AI &bull; Printable PDF Exporter
        </div>
      </div>
    </div>
  );
};
