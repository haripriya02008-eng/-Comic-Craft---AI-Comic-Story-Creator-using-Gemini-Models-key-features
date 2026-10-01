/**
 * ComicCraft Artistic Panel Illustrator
 * Generates rich, stylized, high-fidelity SVG comic art matching specific styles, settings, and characters.
 */

export interface ComicArtOptions {
  panelNumber: number;
  title: string;
  setting: string;
  style: string;
  tone: string;
  characterName: string;
  soundEffect?: string;
  imagePrompt?: string;
  sceneDescription?: string;
}

export function generateComicPanelSvg(options: ComicArtOptions): string {
  const {
    panelNumber,
    setting = 'Forest',
    style = 'Classic Comic Book',
    tone = 'Dramatic',
    characterName = 'Hero',
    soundEffect,
    sceneDescription = '',
  } = options;

  // Width and height of comic panel canvas (standard 4:3 or square comic panel)
  const width = 800;
  const height = 540;

  // Determine palette based on style & tone
  let bgGradientStart = '#1a202c';
  let bgGradientEnd = '#2d3748';
  let accentColor = '#e53e3e';
  let secondaryColor = '#ecc94b';
  let outlineColor = '#000000';
  let filterEffect = '';
  let speedLines = false;
  let halftone = true;

  const styleLower = style.toLowerCase();
  const settingLower = setting.toLowerCase();
  const toneLower = tone.toLowerCase();

  if (styleLower.includes('cyberpunk')) {
    bgGradientStart = '#0f051d';
    bgGradientEnd = '#240046';
    accentColor = '#00f0ff';
    secondaryColor = '#ff007f';
    speedLines = true;
  } else if (styleLower.includes('manga') || styleLower.includes('anime')) {
    bgGradientStart = '#18181b';
    bgGradientEnd = '#3f3f46';
    accentColor = '#f43f5e';
    secondaryColor = '#ffffff';
    speedLines = toneLower.includes('action');
  } else if (styleLower.includes('watercolor')) {
    bgGradientStart = '#1e3a8a';
    bgGradientEnd = '#3b82f6';
    accentColor = '#f59e0b';
    secondaryColor = '#ec4899';
    halftone = false;
  } else if (styleLower.includes('vintage') || styleLower.includes('golden')) {
    bgGradientStart = '#2c1810';
    bgGradientEnd = '#5c3a21';
    accentColor = '#f97316';
    secondaryColor = '#fef08a';
  } else if (styleLower.includes('noir') || styleLower.includes('dark')) {
    bgGradientStart = '#09090b';
    bgGradientEnd = '#18181b';
    accentColor = '#ef4444';
    secondaryColor = '#e4e4e7';
  } else {
    // Classic Comic Book
    bgGradientStart = '#1e1b4b';
    bgGradientEnd = '#312e81';
    accentColor = '#dc2626';
    secondaryColor = '#fbbf24';
  }

  // Setting specific colors
  if (settingLower.includes('forest')) {
    if (!styleLower.includes('cyberpunk')) {
      bgGradientStart = toneLower.includes('mysterious') ? '#062c19' : '#0f3822';
      bgGradientEnd = '#1a5336';
      accentColor = '#34d399';
      secondaryColor = '#fde047';
    }
  } else if (settingLower.includes('space')) {
    bgGradientStart = '#050515';
    bgGradientEnd = '#1e1035';
    accentColor = '#38bdf8';
    secondaryColor = '#c084fc';
  } else if (settingLower.includes('underwater')) {
    bgGradientStart = '#041c32';
    bgGradientEnd = '#04293a';
    accentColor = '#06b6d4';
    secondaryColor = '#10b981';
  } else if (settingLower.includes('castle')) {
    bgGradientStart = '#1c1917';
    bgGradientEnd = '#44403c';
    accentColor = '#f97316';
    secondaryColor = '#eab308';
  }

  // Generate scenic elements based on setting
  let scenerySvg = '';
  const isFox = characterName.toLowerCase().includes('fox') || sceneDescription.toLowerCase().includes('fox');
  const isRobot = characterName.toLowerCase().includes('bot') || sceneDescription.toLowerCase().includes('robot');

  if (settingLower.includes('forest')) {
    // Trees, foliage, moonlight beams
    scenerySvg = `
      <!-- Forest Trees & Layers -->
      <g opacity="0.6">
        <path d="M 0 540 L 0 320 Q 60 220 120 340 L 160 540 Z" fill="#082015" />
        <path d="M 120 540 L 170 260 Q 230 180 290 280 L 330 540 Z" fill="#0b2e1e" />
        <path d="M 500 540 L 560 240 Q 630 160 700 270 L 740 540 Z" fill="#082015" />
        <path d="M 680 540 L 720 300 Q 770 200 800 290 L 800 540 Z" fill="#05170f" />
      </g>
      <!-- Glowing enchanted motes -->
      <circle cx="280" cy="220" r="4" fill="${secondaryColor}" opacity="0.8" />
      <circle cx="340" cy="180" r="6" fill="${secondaryColor}" opacity="0.9" />
      <circle cx="490" cy="250" r="3.5" fill="${accentColor}" opacity="0.7" />
      <circle cx="610" cy="210" r="5" fill="${secondaryColor}" opacity="0.8" />
      <circle cx="190" cy="300" r="4.5" fill="${accentColor}" opacity="0.6" />
      <!-- Forest ground / hill -->
      <path d="M -20 460 Q 200 400 400 440 T 820 420 L 820 540 L -20 540 Z" fill="#071b12" stroke="#000000" stroke-width="4" />
      <path d="M -20 480 Q 240 450 500 490 T 820 460 L 820 540 L -20 540 Z" fill="#04110b" />
    `;
  } else if (settingLower.includes('city') || settingLower.includes('cyberpunk')) {
    // Skyscrapers, neon signs, perspective grid
    scenerySvg = `
      <!-- Skyline -->
      <g opacity="0.85">
        <rect x="40" y="160" width="110" height="380" fill="#0c0d1a" stroke="#000" stroke-width="3" />
        <rect x="180" y="100" width="140" height="440" fill="#121324" stroke="#000" stroke-width="3" />
        <rect x="350" y="190" width="120" height="350" fill="#0e0f1e" stroke="#000" stroke-width="3" />
        <rect x="500" y="80" width="160" height="460" fill="#15172b" stroke="#000" stroke-width="3" />
        <rect x="680" y="140" width="100" height="400" fill="#0b0c17" stroke="#000" stroke-width="3" />
      </g>
      <!-- Neon window highlights -->
      <g opacity="0.75">
        <line x1="200" y1="130" x2="300" y2="130" stroke="${accentColor}" stroke-width="3" />
        <line x1="200" y1="160" x2="280" y2="160" stroke="${secondaryColor}" stroke-width="2" />
        <line x1="520" y1="120" x2="640" y2="120" stroke="${accentColor}" stroke-width="3" />
        <line x1="520" y1="150" x2="610" y2="150" stroke="${secondaryColor}" stroke-width="2" />
      </g>
      <!-- Perspective street ground -->
      <polygon points="0,540 800,540 500,420 300,420" fill="#07080f" stroke="#000" stroke-width="3" />
      <line x1="400" y1="420" x2="400" y2="540" stroke="${accentColor}" stroke-dasharray="20,15" stroke-width="4" opacity="0.8" />
    `;
  } else if (settingLower.includes('space')) {
    // Starfield, nebula, planet ring
    scenerySvg = `
      <!-- Distant Ringed Planet -->
      <circle cx="640" cy="160" r="80" fill="${accentColor}" opacity="0.4" />
      <ellipse cx="640" cy="160" rx="140" ry="25" fill="none" stroke="${secondaryColor}" stroke-width="4" transform="rotate(-20 640 160)" opacity="0.7" />
      <!-- Star motes -->
      <circle cx="80" cy="60" r="2" fill="#fff" />
      <circle cx="180" cy="120" r="3" fill="#fff" />
      <circle cx="280" cy="50" r="1.5" fill="#fff" />
      <circle cx="380" cy="140" r="2.5" fill="#fff" />
      <circle cx="480" cy="70" r="2" fill="#fff" />
      <circle cx="120" cy="220" r="3" fill="${secondaryColor}" />
      <!-- Sci-fi station deck -->
      <polygon points="0,540 800,540 700,400 100,400" fill="#111827" stroke="#000" stroke-width="4" />
      <line x1="100" y1="400" x2="0" y2="540" stroke="${accentColor}" stroke-width="3" />
      <line x1="700" y1="400" x2="800" y2="540" stroke="${accentColor}" stroke-width="3" />
    `;
  } else {
    // Generic dramatic landscape
    scenerySvg = `
      <!-- Mountain silhouettes -->
      <polygon points="-50,540 180,240 380,540" fill="#18181b" stroke="#000" stroke-width="3" />
      <polygon points="260,540 480,180 720,540" fill="#111827" stroke="#000" stroke-width="3" />
      <polygon points="580,540 720,290 850,540" fill="#09090b" stroke="#000" stroke-width="3" />
      <!-- Terrain -->
      <path d="M 0 460 Q 400 420 800 470 L 800 540 L 0 540 Z" fill="#0c0a09" stroke="#000" stroke-width="4" />
    `;
  }

  // Dynamic Character Silhouette / Figure
  let characterSvg = '';
  if (isFox) {
    // Cute, heroic, sharp fox silhouette in action
    const foxColor = styleLower.includes('noir') ? '#ffffff' : '#ea580c';
    const bellyColor = '#fef08a';
    characterSvg = `
      <!-- Fox Character (${characterName}) -->
      <g transform="translate(330, 310) scale(1.15)">
        <!-- Fox Tail with white tip -->
        <path d="M 40 70 Q -30 90 -20 40 Q -10 10 30 50 Z" fill="${foxColor}" stroke="#000" stroke-width="3.5" />
        <path d="M -20 40 Q -15 25 -5 20 Q -8 35 -20 40 Z" fill="#ffffff" stroke="#000" stroke-width="2" />
        <!-- Body -->
        <ellipse cx="65" cy="65" rx="36" ry="24" fill="${foxColor}" stroke="#000" stroke-width="3.5" transform="rotate(-15 65 65)" />
        <ellipse cx="68" cy="68" rx="20" ry="14" fill="${bellyColor}" opacity="0.9" transform="rotate(-15 68 68)" />
        <!-- Paws / Legs -->
        <path d="M 40 78 L 35 110 L 45 112 L 52 82 Z" fill="#1c1917" stroke="#000" stroke-width="3" />
        <path d="M 85 75 L 95 108 L 105 106 L 95 72 Z" fill="#1c1917" stroke="#000" stroke-width="3" />
        <!-- Head & Snout -->
        <path d="M 90 45 L 135 48 L 105 20 Z" fill="${foxColor}" stroke="#000" stroke-width="3.5" />
        <circle cx="134" cy="47" r="4" fill="#000000" />
        <!-- White cheek fluff -->
        <path d="M 95 50 Q 110 55 125 49 L 105 62 Z" fill="#ffffff" stroke="#000" stroke-width="2" />
        <!-- Alert Ears -->
        <polygon points="90,26 80,-8 102,16" fill="${foxColor}" stroke="#000" stroke-width="3" />
        <polygon points="88,22 83,0 98,16" fill="#1c1917" />
        <polygon points="104,22 108,-6 122,20" fill="${foxColor}" stroke="#000" stroke-width="3" />
        <!-- Focused Eye -->
        <ellipse cx="110" cy="36" rx="4" ry="5.5" fill="#000000" />
        <circle cx="111" cy="34" r="1.5" fill="#ffffff" />
      </g>
    `;
  } else if (isRobot) {
    characterSvg = `
      <!-- Robot Character -->
      <g transform="translate(360, 270) scale(1.1)">
        <!-- Head -->
        <rect x="25" y="10" width="50" height="40" rx="8" fill="#475569" stroke="#000" stroke-width="4" />
        <rect x="35" y="24" width="30" height="12" rx="4" fill="${accentColor}" />
        <line x1="50" y1="10" x2="50" y2="-5" stroke="#000" stroke-width="4" />
        <circle cx="50" cy="-7" r="6" fill="${secondaryColor}" stroke="#000" stroke-width="2" />
        <!-- Torso -->
        <rect x="15" y="55" width="70" height="75" rx="6" fill="#334155" stroke="#000" stroke-width="4" />
        <circle cx="50" cy="85" r="16" fill="${secondaryColor}" stroke="#000" stroke-width="3" />
        <!-- Limbs -->
        <rect x="25" y="130" width="18" height="60" fill="#1e293b" stroke="#000" stroke-width="4" />
        <rect x="57" y="130" width="18" height="60" fill="#1e293b" stroke="#000" stroke-width="4" />
      </g>
    `;
  } else {
    // Humanoid Adventurer Silhouette
    characterSvg = `
      <!-- Hero Figure (${characterName}) -->
      <g transform="translate(360, 260) scale(1.2)">
        <!-- Cape / Cloak Billowing -->
        <path d="M 30 45 Q -25 80 -10 130 Q 15 110 35 70 Z" fill="${accentColor}" stroke="#000" stroke-width="3.5" />
        <!-- Head / Hood -->
        <circle cx="45" cy="22" r="15" fill="#1e293b" stroke="#000" stroke-width="3.5" />
        <!-- Mask / Eyes glow -->
        <ellipse cx="49" cy="22" rx="4" ry="2" fill="${secondaryColor}" />
        <!-- Body / Armor -->
        <path d="M 32 37 L 58 37 L 52 95 L 38 95 Z" fill="#0f172a" stroke="#000" stroke-width="3.5" />
        <!-- Arms / Stance -->
        <path d="M 32 40 L 15 70 L 25 75 L 38 48 Z" fill="#1e293b" stroke="#000" stroke-width="3" />
        <path d="M 58 40 L 75 65 L 88 55 L 75 40 Z" fill="#1e293b" stroke="#000" stroke-width="3" />
        <!-- Legs / Boots -->
        <path d="M 38 95 L 28 145 L 42 147 L 46 95 Z" fill="#020617" stroke="#000" stroke-width="3.5" />
        <path d="M 50 95 L 60 145 L 74 143 L 54 95 Z" fill="#020617" stroke="#000" stroke-width="3.5" />
      </g>
    `;
  }

  // Speed lines for action/dramatic scenes
  let speedLinesSvg = '';
  if (speedLines || toneLower.includes('action')) {
    speedLinesSvg = `
      <g stroke="#ffffff" stroke-width="1.5" opacity="0.3" stroke-linecap="round">
        <line x1="0" y1="0" x2="280" y2="200" />
        <line x1="0" y1="270" x2="260" y2="280" />
        <line x1="0" y1="540" x2="300" y2="350" />
        <line x1="800" y1="0" x2="520" y2="200" />
        <line x1="800" y1="270" x2="540" y2="280" />
        <line x1="800" y1="540" x2="500" y2="350" />
        <line x1="400" y1="0" x2="400" y2="180" />
      </g>
    `;
  }

  // Comic Sound Effect Sticker (if provided or for action tone)
  let sfxSvg = '';
  const effectiveSfx = soundEffect || (panelNumber === 2 ? 'RUSTLE...' : panelNumber === 4 ? 'WHOOSH!' : panelNumber === 5 ? 'CLIK!' : undefined);
  if (effectiveSfx) {
    sfxSvg = `
      <!-- Comic Sound Effect Sticker -->
      <g transform="translate(560, 90) rotate(${panelNumber % 2 === 0 ? 8 : -10}) scale(0.95)">
        <!-- Burst background polygon -->
        <polygon points="0,20 25,-15 50,15 80,-20 95,25 130,5 120,45 155,60 120,80 145,115 105,105 100,140 70,115 40,135 35,100 0,105 15,65 -20,50" 
          fill="${secondaryColor}" stroke="#000000" stroke-width="4.5" />
        <!-- Secondary inner burst -->
        <polygon points="5,22 25,-8 48,17 75,-12 90,27 120,10 112,45 145,58 114,78 135,108 100,100 94,130 68,108 40,125 35,94 5,98 18,63 -12,50" 
          fill="${accentColor}" />
        <!-- SFX Text -->
        <text x="65" y="72" text-anchor="middle" font-family="'Bangers', cursive, sans-serif" font-size="34" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="3" paint-order="stroke fill" letter-spacing="2">
          ${effectiveSfx}
        </text>
      </g>
    `;
  }

  // Atmospheric Vignette & Frame
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" class="w-full h-auto block select-none">
      <defs>
        <linearGradient id="bgGrad_${panelNumber}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${bgGradientStart}" />
          <stop offset="100%" stop-color="${bgGradientEnd}" />
        </linearGradient>
        <radialGradient id="vignette_${panelNumber}" cx="50%" cy="50%" r="70%">
          <stop offset="40%" stop-color="transparent" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
        </radialGradient>
        <pattern id="halftone_${panelNumber}" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.5" fill="#000000" opacity="${halftone ? '0.12' : '0.04'}" />
        </pattern>
        <!-- Atmospheric Glow Filter -->
        <filter id="glow_${panelNumber}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Background Sky / Setting Base -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad_${panelNumber})" />
      
      <!-- Halftone Texture Overlay -->
      <rect width="${width}" height="${height}" fill="url(#halftone_${panelNumber})" />

      <!-- Speed Lines -->
      ${speedLinesSvg}

      <!-- Scenery Layers -->
      ${scenerySvg}

      <!-- Main Focal Character -->
      ${characterSvg}

      <!-- Comic Sound Effect -->
      ${sfxSvg}

      <!-- Vignette Lighting -->
      <rect width="${width}" height="${height}" fill="url(#vignette_${panelNumber})" pointer-events="none" />

      <!-- High-contrast Comic Panel Border -->
      <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#000000" stroke-width="8" />
      <rect x="7" y="7" width="${width - 14}" height="${height - 14}" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.3" />

      <!-- Panel Badge top-left -->
      <g transform="translate(18, 18)">
        <polygon points="0,0 80,0 65,34 0,34" fill="#000000" />
        <polygon points="2,2 76,2 62,32 2,32" fill="${accentColor}" />
        <text x="32" y="23" text-anchor="middle" font-family="'Bangers', cursive, sans-serif" font-size="19" font-weight="bold" fill="#ffffff" stroke="#000" stroke-width="1" paint-order="stroke fill">
          PANEL ${panelNumber}
        </text>
      </g>
    </svg>
  `.trim();
}

/**
 * Converts SVG to base64 Data URL so it can be loaded directly as <img src="...">
 */
export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
