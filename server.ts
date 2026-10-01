import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { generateComicPanelSvg, svgToDataUrl } from './src/utils/comicArtRenderer.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Generates an illustration using Stable Diffusion via API, with automatic fallback
 */
async function generatePanelArtwork(
  prompt: string,
  style: string,
  setting: string,
  tone: string,
  characterName: string,
  panelNum: number,
  soundEffect?: string,
  sceneDescription?: string,
  imageEngine: 'stable_diffusion' | 'stylized_art' = 'stable_diffusion'
): Promise<{ imageUrl: string; source: 'stable_diffusion' | 'stylized_art' }> {
  if (imageEngine === 'stable_diffusion') {
    try {
      const cleanPrompt = prompt.replace(/[^\w\s,.-]/g, ' ').slice(0, 320);
      const styledPrompt = `${style} comic book style illustration, ${cleanPrompt}, dynamic graphic novel panel, comic art, high resolution, masterpiece`;
      const seed = Math.floor(Math.random() * 900000) + 10000;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styledPrompt)}?width=768&height=512&nologo=true&seed=${seed}&model=flux`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ComicCraft-Engine/2.0',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 2000) {
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = response.headers.get('content-type') || 'image/jpeg';
          return {
            imageUrl: `data:${contentType};base64,${base64}`,
            source: 'stable_diffusion',
          };
        }
      }
    } catch (err) {
      console.warn(`Stable Diffusion generation for panel ${panelNum} fell back to stylized renderer.`);
    }
  }

  // Guaranteed fallback to high-fidelity SVG Comic Art
  const svg = generateComicPanelSvg({
    panelNumber: panelNum,
    title: `Panel ${panelNum}`,
    setting,
    style,
    tone,
    characterName,
    soundEffect,
    imagePrompt: prompt,
    sceneDescription,
  });

  return {
    imageUrl: svgToDataUrl(svg),
    source: 'stylized_art',
  };
}

/**
 * Route: POST /api/comic/generate
 * Generates structured 5-panel comic storylines, dialogues, captions, and visual artwork
 */
app.post('/api/comic/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt = 'A brave fox explores an enchanted forest.',
      character_name = 'Free',
      character_description = '',
      setting = 'Forest',
      tone = 'Dramatic',
      style = 'Classic Comic Book',
      panel_count = 5,
      image_engine = 'stable_diffusion',
    } = req.body;

    const count = Math.min(Math.max(parseInt(panel_count, 10) || 5, 3), 6);

    const systemInstruction = `You are a legendary comic book creator, scriptwriter, and visual director.
Your goal is to transform a story idea into a tightly paced ${count}-panel comic book issue with compelling panel pacing:
1. Panel 1: The Inciting Moment / Hook & Establishing Scene
2. Panel 2: The Rising Tension / Venturing into the Unknown
3. Panel 3: The Discovery or Conflict / Climax
4. Panel 4: The Twist, Action, or Revelation
5. Panel 5: The Resonant Resolution or Cliffhanger

Guidelines:
- Main Character: "${character_name}" ${character_description ? `(${character_description})` : ''}
- Setting: "${setting}"
- Tone: "${tone}"
- Art Style: "${style}"
- Write distinct, impactful **CAPTION:** text (setting the atmosphere/time/place).
- Write gripping **NARRATION:** text (literary, punchy comic narration).
- Write authentic **DIALOGUE:** (with speaker name, witty or dramatic).
- Write a vivid **IMAGE PROMPT:** (cinematic description of the characters, actions, camera framing, lighting, and colors suited for comic book illustration).
- Pick an evocative comic sound effect (e.g. "WHOOSH!", "CRACKLE!", "RUSTLE...", "THUD!", "ZAP!").`;

    const userPrompt = `Create a ${count}-panel comic story for:
Story Idea: "${prompt}"
Main Character: "${character_name}" ${character_description ? `(Appearance: ${character_description})` : ''}
Setting: "${setting}"
Tone: "${tone}"
Art Style: "${style}"

Return ONLY structured JSON adhering to the specified schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comic_title: {
              type: Type.STRING,
              description: 'Exciting, pulpy comic book title (e.g. "The Whispering Woods: Journey of Free")',
            },
            summary: {
              type: Type.STRING,
              description: 'A 2-3 sentence teaser summary of the story',
            },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panel: { type: Type.INTEGER, description: 'Panel number (1 to N)' },
                  title: { type: Type.STRING, description: 'Panel title (e.g. "Panel 1: The Edge of Mystery")' },
                  scene_description: {
                    type: Type.STRING,
                    description: 'Italicized atmospheric narrative description of what happens in the scene',
                  },
                  caption: {
                    type: Type.STRING,
                    description: 'Comic box caption starting with **CAPTION:**',
                  },
                  narration: {
                    type: Type.STRING,
                    description: 'Narrative voiceover starting with **NARRATION:**',
                  },
                  dialogue: {
                    type: Type.STRING,
                    description: 'Character spoken lines with speaker name',
                  },
                  image_prompt: {
                    type: Type.STRING,
                    description: 'Detailed prompt for the comic artist describing shot, character pose, background, and lighting',
                  },
                  sound_effect: {
                    type: Type.STRING,
                    description: 'Comic SFX onomatopoeia like "WHOOSH!", "RUSTLE...", "CRACKLE!"',
                  },
                  camera_angle: {
                    type: Type.STRING,
                    description: 'e.g. "Low-angle heroic shot", "Extreme close-up", "Wide scenic panorama"',
                  },
                  visual_mood: {
                    type: Type.STRING,
                    description: 'Color palette and lighting mood',
                  },
                },
                required: ['panel', 'title', 'scene_description', 'caption', 'narration', 'dialogue', 'image_prompt'],
              },
            },
          },
          required: ['comic_title', 'summary', 'panels'],
        },
      },
    });

    const rawText = response.text || '{}';
    let comicData;
    try {
      comicData = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        comicData = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse Gemini comic output.');
      }
    }

    // Generate artwork for each panel in parallel (Stable Diffusion AI + fallback)
    const rawPanels = comicData.panels || [];
    const enhancedPanels = await Promise.all(
      rawPanels.map(async (panel: any, idx: number) => {
        const panelNum = panel.panel || idx + 1;
        const cleanTitle = panel.title || `Panel ${panelNum}`;

        const art = await generatePanelArtwork(
          panel.image_prompt,
          style,
          setting,
          tone,
          character_name,
          panelNum,
          panel.sound_effect,
          panel.scene_description,
          image_engine
        );

        return {
          ...panel,
          panel: panelNum,
          title: cleanTitle,
          image_url: art.imageUrl,
          image_source: art.source,
        };
      })
    );

    const fullComic = {
      id: 'comic_' + Date.now(),
      title: comicData.comic_title || 'Untitled Comic Adventure',
      summary: comicData.summary || '',
      prompt,
      character_name,
      character_description,
      setting,
      tone,
      style,
      image_engine,
      panels: enhancedPanels,
      created_at: new Date().toISOString(),
    };

    res.json({ success: true, comic: fullComic });
  } catch (error: any) {
    console.error('Error generating comic:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during comic generation.',
    });
  }
});

/**
 * Route: POST /api/comic/regenerate-panel
 * Allows fine-tuning or regenerating an individual panel
 */
app.post('/api/comic/regenerate-panel', async (req: Request, res: Response) => {
  try {
    const {
      panelNumber = 1,
      prompt,
      setting = 'Forest',
      style = 'Classic Comic Book',
      tone = 'Dramatic',
      character_name = 'Free',
      character_description = '',
      customInstruction = '',
      image_engine = 'stable_diffusion',
    } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Regenerate Panel ${panelNumber} for a comic about "${prompt}" featuring "${character_name}".
Setting: ${setting}, Style: ${style}, Tone: ${tone}.
Specific adjustment: ${customInstruction || 'Make it more dramatic and detailed.'}`,
      config: {
        temperature: 0.9,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            panel: { type: Type.INTEGER },
            title: { type: Type.STRING },
            scene_description: { type: Type.STRING },
            caption: { type: Type.STRING },
            narration: { type: Type.STRING },
            dialogue: { type: Type.STRING },
            image_prompt: { type: Type.STRING },
            sound_effect: { type: Type.STRING },
          },
          required: ['panel', 'title', 'scene_description', 'caption', 'narration', 'dialogue', 'image_prompt'],
        },
      },
    });

    const updatedData = JSON.parse(response.text || '{}');
    const panelNum = updatedData.panel || panelNumber;

    const art = await generatePanelArtwork(
      updatedData.image_prompt,
      style,
      setting,
      tone,
      character_name,
      panelNum,
      updatedData.sound_effect,
      updatedData.scene_description,
      image_engine
    );

    res.json({
      success: true,
      panel: {
        ...updatedData,
        panel: panelNum,
        image_url: art.imageUrl,
        image_source: art.source,
      },
    });
  } catch (error: any) {
    console.error('Error regenerating panel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate panel.',
    });
  }
});

// Setup Vite or Static Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ComicCraft server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
