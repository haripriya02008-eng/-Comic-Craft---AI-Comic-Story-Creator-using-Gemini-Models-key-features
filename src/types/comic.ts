export interface ComicPanel {
  panel: number;
  title: string;
  scene_description: string;
  caption: string;
  narration: string;
  dialogue: string;
  image_prompt: string;
  sound_effect?: string;
  camera_angle?: string;
  visual_mood?: string;
  image_url: string;
  image_source?: 'stable_diffusion' | 'stylized_art';
}

export interface ComicStory {
  id: string;
  title: string;
  prompt: string;
  character_name: string;
  character_description?: string;
  setting: string;
  tone: string;
  style: string;
  summary: string;
  image_engine?: 'stable_diffusion' | 'stylized_art';
  panels: ComicPanel[];
  created_at: string;
}

export interface GenerateComicRequest {
  prompt: string;
  character_name?: string;
  character_description?: string;
  setting?: string;
  tone?: string;
  style?: string;
  panel_count?: number;
  image_engine?: 'stable_diffusion' | 'stylized_art';
}

