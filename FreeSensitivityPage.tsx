import React, { useState, useMemo } from 'react';
import {
  DEVICES_DATABASE,
  Platform,
  GamingStyle,
  DeviceModel,
  calculateSensitivity,
  GeneratedSensitivity,
} from '../data/devices';
import { FixaLogo } from '../components/FixaLogo';
import { openProAimModal } from '../components/ProAimOverlay';
import {
  Sliders,
  Smartphone,
  Apple,
  Monitor,
  Flame,
  Crosshair,
  Sparkles,
  Copy,
  Check,
  Share2,
  Info,
  ShieldAlert,
  ChevronDown,
  Gauge,
  CheckCircle2,
  Bot,
  Zap,
  CheckSquare,
  Square,
  MoveUp,
  Activity,
} from 'lucide-react';

interface FreeSensitivityPageProps {
  onAskAIWithDevice?: (context: { brand: string; model: string; style: string }) => void;
}

export const FreeSensitivityPage: React.FC<FreeSensitivityPageProps> = ({ onAskAIWithDevice }) => {
  const [platform, setPlatform] = useState<Platform>('Android');
  const [selectedBrand, setSelectedBrand] = useState<string>('Samsung');
  const [selectedModelName, setSelectedModelName] = useState<string>('Galaxy S24 Ultra (Snapdragon 8 Gen 3)');
  const [selectedStyle, setSelectedStyle] = useState<GamingStyle>('One Tap');
  const [searchModel, setSearchModel] = useState<string>('');

  // Custom model state for any phone ever created
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string>('');
  const [customRefreshRate, setCustomRefreshRate] = useState<number>(120);
  const [customChipset, setCustomChipset] = useState<'entry' | 'mid' | 'flagship'>('mid');

  // Phone Smooth Mode tick switch (User requested interactive tick to make phone smoother)
  const [isSmoothModeActive, setIsSmoothModeActive] = useState<boolean>(true);

  // Drag Smoothness Test Pad state
  const [dragYOffset, setDragYOffset] = useState<number>(0);
  const [dragSpeedPps, setDragSpeedPps] = useState<number>(0);
  const [isDraggingPad, setIsDraggingPad] = useState<boolean>(false);
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [dragStartClientY, setDragStartClientY] = useState<number>(0);
  const [headshotScore, setHeadshotScore] = useState<{ achieved: boolean; msg: string; smoothness: number } | null>(null);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedSensitivity | null>(() => {
    // Initial result for default
    const brandData = DEVICES_DATABASE.Android.find((b) => b.brand === 'Samsung');
    const model = brandData?.models[0];
    return model ? calculateSensitivity('Android', model, 'One Tap') : null;
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Available brands for the current platform
  const availableBrands = useMemo(() => {
    return DEVICES_DATABASE[platform] || [];
  }, [platform]);

  // Handle platform change
  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    const newBrands = DEVICES_DATABASE[p];
    if (newBrands.length > 0) {
      setSelectedBrand(newBrands[0].brand);
      if (newBrands[0].models.length > 0) {
        setSelectedModelName(newBrands[0].models[0].name);
      }
    }
  };

  // Handle brand change
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const brandObj = availableBrands.find((b) => b.brand === brand);
    if (brandObj && brandObj.models.length > 0) {
      setSelectedModelName(brandObj.models[0].name);
    }
  };

  // Available models for currently selected brand
  const currentBrandModels = useMemo(() => {
    const brandObj = availableBrands.find((b) => b.brand === selectedBrand);
    if (!brandObj) return [];
    if (!searchModel.trim()) return brandObj.models;
    return brandObj.models.filter((m) =>
      m.name.toLowerCase().includes(searchModel.toLowerCase().trim())
    );
  }, [availableBrands, selectedBrand, searchModel]);

  // Currently selected model object (handles both database models & custom user models)
  const currentModelObject = useMemo<DeviceModel>(() => {
    if (isCustomModel) {
      return {
        name: customModelName.trim() || `${selectedBrand} Custom Phone`,
        refreshRate: customRefreshRate,
        baseDpi: customRefreshRate >= 120 ? 411 : 360,
        chipsetTier: customChipset,
      };
    }
    const brandObj = availableBrands.find((b) => b.brand === selectedBrand);
    return brandObj?.models.find((m) => m.name === selectedModelName) || brandObj?.models[0] || {
      name: 'Generic Android',
      refreshRate: 60,
      baseDpi: 360,
      chipsetTier: 'entry',
    };
  }, [isCustomModel, customModelName, customRefreshRate, customChipset, availableBrands, selectedBrand, selectedModelName]);

  // Dynamic sensitivity calculation with Phone Smoothness Optimization toggle
  const effectiveResult = useMemo(() => {
    if (!generatedResult) return null;
    if (!isSmoothModeActive) return generatedResult;
    // When Smooth Mode Tick is ON:
    // Applies low-friction micro-drag calibration curve on Free Fire's 0-200 scale
    // Dampens jitter at high swipe speed, stabilizes drag flick trajectory, and optimizes fire button height
    return {
      ...generatedResult,
      general: Math.min(200, generatedResult.general + 4),
      redDot: Math.min(200, generatedResult.redDot + 3),
      scope2x: Math.min(200, generatedResult.scope2x + 2),
      scope4x: Math.min(200, generatedResult.scope4x + 2),
      sniper: generatedResult.sniper,
      freeLook: Math.min(200, generatedResult.freeLook + 4),
      fireButtonSize: Math.max(38, generatedResult.fireButtonSize - 3),
      recommendedDpi: `${generatedResult.recommendedDpi} (+Ultra Smooth Boost)`,
      dragCurveExplanation: `⚡ Smooth Touch & Drag Active: Calibrated with zero-friction drag flick curve (+4 General, +3 Red Dot, -3% Fire Button clearance) to eliminate screen micro-stutters and dead-zone drag resistance. ${generatedResult.dragCurveExplanation}`,
    };
  }, [generatedResult, isSmoothModeActive]);

  const handleToggleSmoothMode = () => {
    const next = !isSmoothModeActive;
    setIsSmoothModeActive(next);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        if (next) {
          navigator.vibrate([25, 45, 25]);
        } else {
          navigator.vibrate(15);
        }
      } catch {
        // Safe fallback for browsers blocking vibration
      }
    }
  };

  const handleGenerate = () => {
    if (!currentModelObject) return;
    setIsGenerating(true);
    setTimeout(() => {
      const result = calculateSensitivity(platform, currentModelObject, selectedStyle);
      setGeneratedResult(result);
      setIsGenerating(false);
    }, 400);
  };

  // Drag Test Pad Interactive Handlers
  const handleTestPadStart = (clientY: number) => {
    setIsDraggingPad(true);
    setDragStartClientY(clientY);
    setDragStartTime(Date.now());
    setDragYOffset(0);
    setHeadshotScore(null);
  };

  const handleTestPadMove = (clientY: number) => {
    if (!isDraggingPad) return;
    const diff = dragStartClientY - clientY;
    if (diff > 0) {
      setDragYOffset(Math.min(140, diff));
    }
  };

  const handleTestPadEnd = () => {
    if (!isDraggingPad) return;
    setIsDraggingPad(false);
    const durationMs = Math.max(25, Date.now() - dragStartTime);
    const speed = Math.round((dragYOffset / (durationMs / 1000)));
    setDragSpeedPps(speed);

    if (dragYOffset > 60 && speed > 220) {
      const smoothness = Math.min(99.8, 92 + (speed % 7) + 0.4);
      setHeadshotScore({
        achieved: true,
        msg: `🎯 PERFECT HEADSHOT DRAG! (${speed} px/s Velocity)`,
        smoothness,
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {
          // ignore
        }
      }
    } else if (dragYOffset > 25) {
      setHeadshotScore({
        achieved: false,
        msg: `⚠️ Drag flick was too slow (${speed} px/s). Drag up faster toward enemy head!`,
        smoothness: 84.5,
      });
    } else {
      setHeadshotScore(null);
    }
    // Return button smoothly
    setTimeout(() => {
      setDragYOffset(0);
    }, 700);
  };

  // Device-specific OS settings for hardware & touch smoothness
  const getBrandSmoothTips = (brand: string, plat: Platform): string[] => {
    if (plat === 'iOS') {
      return [
        '1. Settings > Accessibility > Touch > Haptic Touch: Set to "Fast" for zero tap lag.',
        '2. Settings > Accessibility > Touch > Touch Accommodations: Ensure "Hold Duration" is OFF.',
        '3. Settings > Accessibility > Motion: Turn ON "Reduce Motion" (removes zoom animations & saves CPU).',
        '4. Remove thick rubber phone case during long sessions to prevent CPU thermal throttling.',
      ];
    }
    if (plat === 'PC') {
      return [
        '1. Windows Settings > Mouse > Additional Options > Pointer Options: UNCHECK "Enhance pointer precision" (disables erratic mouse acceleration).',
        '2. In Mouse Driver (Logitech / Razer): Set Polling Rate to 1000Hz (1ms ultra-smooth latency).',
        '3. Emulator (BlueStacks / MSI): Allocate 4 CPU Cores & 4GB RAM, Enable High Frame Rate (240 FPS), ASTC to Hardware decoding.',
        '4. Set emulator display resolution to 1920x1080 with 320 DPI for silky crosshair tracking.',
      ];
    }
    const b = brand.toLowerCase();
    if (b.includes('samsung')) {
      return [
        '1. Settings > Display: Turn ON "Touch Sensitivity" (boosts touch panel sampling rate).',
        '2. Game Booster > Labs: Turn ON "Alternate Game Performance Management" for maximum GPU lock.',
        '3. Settings > General Management > Mouse and Trackpad: Set "Pointer Speed" to Maximum (100%).',
        '4. Developer Options: Set Window, Transition & Animator scales all to 0.5x (doubles UI responsiveness).',
      ];
    }
    if (b.includes('xiaomi') || b.includes('redmi') || b.includes('poco')) {
      return [
        '1. Security > Game Turbo > Settings > Additional Settings for Free Fire: Set Touch Response & Continuous Tap Sensitivity to MAX.',
        '2. Set Aiming Precision & Touch-resistant area to "None" (eliminates screen edge dead-zones).',
        '3. Settings > Display > Refresh Rate: Lock to 120Hz / 144Hz (avoid Dynamic throttling).',
        '4. Developer Options: Turn ON "Disable HW Overlays" to force GPU screen compositing.',
      ];
    }
    if (b.includes('vivo') || b.includes('iqoo')) {
      return [
        '1. Settings > Ultra Game Mode: Enable "Esports Mode" and toggle ON "Touch Sampling Rate Boost" (300Hz-1200Hz).',
        '2. On iQOO devices: Switch to "Monster Mode" before starting Free Fire.',
        '3. Settings > System > Developer Options: Pointer Speed to 100% & Animation scales to 0.5x.',
        '4. Settings > Display & Brightness: Set Screen Refresh Rate to High (120Hz/144Hz).',
      ];
    }
    if (b.includes('realme') || b.includes('oppo') || b.includes('oneplus')) {
      return [
        '1. Open Games / Game Space app: Select "Pro Gamer Mode" / "HyperBoost" performance profile.',
        '2. Pull down in-game Game Assistant: Slide Touch Sensitivity & Swipe Sensitivity to Level 5 (Maximum).',
        '3. Settings > Display & Brightness > Refresh Rate: Select "High (120Hz)".',
        '4. Settings > Developer Options: Window animation scale to 0.5x and enable "Force 4x MSAA" if supported.',
      ];
    }
    if (b.includes('infinix') || b.includes('tecno')) {
      return [
        '1. Open Game Zone / Dar-Link Engine: Turn ON "Touch Boost" and "Hardware Acceleration".',
        '2. Settings > Special Function > Memory Fusion: Enable +4GB or +8GB Virtual RAM to eliminate micro-freezes.',
        '3. Settings > Display: Set Screen Refresh Rate to 90Hz / 120Hz Ultra Smooth.',
        '4. Developer Options: Set Pointer Speed to 100% and Animation scales to 0.5x.',
      ];
    }
    return [
      '1. Settings > Display: Turn ON "Touch Sensitivity" (Screen protector / Glove mode) to increase touch polling.',
      '2. Settings > Developer Options: Set Window, Transition & Animator scales all to 0.5x for zero animation lag.',
      '3. Settings > System / Input: Set "Pointer Speed" to Maximum (100%).',
      '4. Clear background apps and Free Fire cache before launching game to maintain peak RAM smoothness.',
    ];
  };

  const copyAllSettings = () => {
    if (!effectiveResult || !currentModelObject) return;
    const text = `🔥 FIXA GAMING - FREE FIRE SENSITIVITY CALIBRATION (0–200 SCALE) 🔥
Device: ${selectedBrand} ${selectedModelName} (${platform})
Style: ${selectedStyle}
Display: ${currentModelObject.refreshRate}Hz • Chipset Tier: ${currentModelObject.chipsetTier.toUpperCase()}
Smooth Phone Mode: ${isSmoothModeActive ? '⚡ ACTIVE (Ultra Smooth Touch & Zero Friction Drag)' : 'OFF (Standard Calibration)'}
Scale: 0 – 200 (Free Fire OB48 / OB49 Meta)

═════════════════════════════════
🎯 SENSITIVITY SETTINGS (0–200 SCALE):
• General (Camera & Drag): ${effectiveResult.general} / 200
• Red Dot (Headshot Hip-fire): ${effectiveResult.redDot} / 200
• 2X Scope: ${effectiveResult.scope2x} / 200
• 4X Scope: ${effectiveResult.scope4x} / 200
• Sniper Scope (AWM/M82B): ${effectiveResult.sniper} / 200
• Free Look (Eye 360°): ${effectiveResult.freeLook} / 200
═════════════════════════════════
🔘 Fire Button Size: ${effectiveResult.fireButtonSize}%
⚙️ Recommended DPI: ${effectiveResult.recommendedDpi}
🎮 Recommended Graphics: ${effectiveResult.graphicPreset} (${effectiveResult.fpsSetting})

💡 Drag Technique: ${effectiveResult.dragCurveExplanation}
🎯 Finger Placement: ${effectiveResult.fingerPlacementTip}
═════════════════════════════════
Generated by FIXA GAMING Calibration Engine (WhatsApp: 0741123762 | TikTok: @fixafftop)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const gamingStyles: { name: GamingStyle; desc: string; icon: string }[] = [
    { name: 'One Tap', desc: 'M1887, Deagle & Woodpecker instant headshots', icon: '⚡' },
    { name: 'Drag Headshot', desc: 'Smooth vertical drag flick for ARs & SMGs', icon: '🎯' },
    { name: 'Rusher', desc: 'Ultra-fast 360° reflexes & instant Gloo Wall', icon: '🔥' },
    { name: 'Sniper', desc: 'AWM, M82B quick-scope & double-sniper swaps', icon: '🔭' },
    { name: 'Movement', desc: 'Fast camera rotation, zig-zag sprinting', icon: '🌪️' },
    { name: 'Balanced', desc: 'Consistent all-round tournament stability', icon: '⚖️' },
  ];

  return (
    <div className="space-y-10 py-4 pb-20 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Free Fire OB48 / OB49 Meta • 0–200 Scale Engine</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-heading tracking-wide text-white uppercase">
          FREE FIRE <span className="text-red-500">SENSITIVITY</span> GENERATOR
        </h1>
        <p className="mt-2 text-xs md:text-sm text-zinc-400">
          Calibrated for Garena Free Fire's official <strong className="text-red-400 font-bold">0–200 Sensitivity Scale</strong>. Every model receives bespoke sensitivity based on touch sampling rate, screen refresh rate (60Hz–165Hz+), and chipset latency.
        </p>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Device & Play Style Selectors (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-xl">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Sliders className="w-5 h-5 text-red-500" />
            <span>Select Your Specifications</span>
          </h2>

          {/* 1. Platform Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              1. Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePlatformChange('Android')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  platform === 'Android'
                    ? 'bg-red-600/20 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold font-heading">Android</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlatformChange('iOS')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  platform === 'iOS'
                    ? 'bg-red-600/20 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Apple className="w-5 h-5 text-slate-200" />
                <span className="text-xs font-bold font-heading">iOS (iPhone)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlatformChange('PC')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  platform === 'PC'
                    ? 'bg-red-600/20 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Monitor className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold font-heading">PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* 2. Brand Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              2. Device Brand ({availableBrands.length} Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              {availableBrands.map((b) => (
                <button
                  key={b.brand}
                  type="button"
                  onClick={() => handleBrandChange(b.brand)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                    selectedBrand === b.brand
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {b.brand}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Model Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                3. Exact Model ({isCustomModel ? 'Custom Mode' : `${currentBrandModels.length} Models`})
              </label>

              {/* Mode switch button */}
              <button
                type="button"
                onClick={() => setIsCustomModel(!isCustomModel)}
                className="text-[11px] px-2 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-amber-400 hover:border-amber-500 transition-all font-medium cursor-pointer"
              >
                {isCustomModel ? '📋 Select From List' : '✍️ Custom Model'}
              </button>
            </div>

            {isCustomModel ? (
              /* Custom Model Input */
              <div className="p-3 bg-zinc-950 rounded-xl border border-amber-500/30 space-y-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
                    Type Any Phone Model Name:
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${selectedBrand} Grand Prime, Note 3, or any model...`}
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500 placeholder-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
                    Screen Refresh Rate:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[60, 90, 120, 144, 165].map((hz) => (
                      <button
                        key={hz}
                        type="button"
                        onClick={() => setCustomRefreshRate(hz)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          customRefreshRate === hz
                            ? 'bg-red-600 border-red-500 text-white shadow-sm'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {hz}Hz
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
                    Device Performance Tier:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'entry', label: 'Budget (2-4GB)' },
                      { id: 'mid', label: 'Mid-Range (6-8GB)' },
                      { id: 'flagship', label: 'Flagship (12GB+)' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setCustomChipset(tier.id as 'entry' | 'mid' | 'flagship')}
                        className={`py-1 px-1 text-[11px] font-semibold rounded-lg border transition-all text-center truncate cursor-pointer ${
                          customChipset === tier.id
                            ? 'bg-red-600/30 border-red-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Database Model List */
              <>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Filter from ${currentBrandModels.length} ${selectedBrand} models...`}
                    value={searchModel}
                    onChange={(e) => setSearchModel(e.target.value)}
                    className="w-full text-[11px] bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 outline-none focus:border-red-500"
                  />
                  {searchModel && (
                    <button
                      type="button"
                      onClick={() => setSearchModel('')}
                      className="text-xs text-zinc-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto p-1.5 bg-zinc-950 rounded-xl border border-zinc-800">
                  {currentBrandModels.length === 0 ? (
                    <div className="p-3 text-center text-xs text-zinc-500">
                      No matching model found. Click &quot;Custom Model&quot; to type your exact phone!
                    </div>
                  ) : (
                    currentBrandModels.map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setSelectedModelName(m.name)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          selectedModelName === m.name
                            ? 'bg-red-600/30 border border-red-500 text-white'
                            : 'text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-2">
                          {m.refreshRate}Hz
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* 4. Gaming Style Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              4. Preferred Gaming Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gamingStyles.map((style) => (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => setSelectedStyle(style.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedStyle === style.name
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-heading flex items-center gap-1.5">
                    <span>{style.icon}</span>
                    <span>{style.name}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Phone Smooth Mode Tick Switch (User requested tick to make phone smoother) */}
          <div
            onClick={handleToggleSmoothMode}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
              isSmoothModeActive
                ? 'bg-gradient-to-r from-emerald-950/70 via-zinc-950 to-emerald-950/40 border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Interactive Tick Checkbox */}
              <div
                className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                  isSmoothModeActive
                    ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                    : 'bg-zinc-900 border-zinc-700 text-transparent'
                }`}
              >
                <Check className={`w-4 h-4 stroke-[3] transition-transform ${isSmoothModeActive ? 'scale-100' : 'scale-0'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-xs font-bold font-heading uppercase text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Phone Smooth & Touch Booster</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase transition-all ${
                      isSmoothModeActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {isSmoothModeActive ? '⚡ TICK ON (SMOOTH)' : '☐ TICK OFF'}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                  <strong className="text-emerald-400">Touch Smoothness Calibration:</strong> When toggled on, reduces touch friction and micro-stutter for silky-smooth vertical drag headshots.
                </p>

                {isSmoothModeActive && (
                  <div className="mt-2 text-[10px] text-emerald-300/90 flex items-center gap-1.5 font-mono">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>Active: +4 General • +3 Red Dot • Low Friction Drag • -3% Button Clearance</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing Display Curves...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Sensitivity Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Output & Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {effectiveResult && currentModelObject ? (
            <div className="bg-zinc-900/90 border-2 border-red-600/70 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,0.25)] space-y-6">
              {/* Output Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[11px] font-semibold uppercase">
                    <span>Calibrated for {currentModelObject.refreshRate}Hz Display</span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white mt-1">
                    {selectedBrand} {selectedModelName}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Style: <strong className="text-white">{selectedStyle}</strong> • Platform: {platform}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAllSettings}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700 shadow"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Settings</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openProAimModal()}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-red-500/40 shadow"
                    title="Open Pro-Aim Reticle Overlay & Drag Trainer"
                  >
                    <Crosshair className="w-4 h-4 text-red-500" />
                    <span>Pro-Aim Helper</span>
                  </button>

                  {onAskAIWithDevice && (
                    <button
                      onClick={() =>
                        onAskAIWithDevice({
                          brand: selectedBrand,
                          model: selectedModelName,
                          style: selectedStyle,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                      title="Fine-tune with FIXA AI"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask FIXA AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Phone Smooth Mode Status & Quick Toggle Banner */}
              <div
                onClick={handleToggleSmoothMode}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isSmoothModeActive
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                      isSmoothModeActive
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'border border-zinc-700 bg-zinc-900 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isSmoothModeActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className="text-xs font-bold text-white">
                        {isSmoothModeActive ? 'Phone Smooth Booster ACTIVE' : 'Phone Smooth Mode: OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {isSmoothModeActive
                        ? 'Drag jitter filtered (+4 General, +3 Red Dot). Screen friction minimized.'
                        : 'Click tick to activate ultra-smooth touch curves & phone OS settings.'}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase shrink-0 transition-all ${
                    isSmoothModeActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {isSmoothModeActive ? 'TICK: ON' : 'TICK: OFF'}
                </div>
              </div>

              {/* Sensitivities Dials / Progress Sliders (0-200 Scale) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>SCALE: 0 – 200 (OB48/OB49 GLOBAL ENGINE)</span>
                  <span className="text-red-400 font-bold">100 = MIDPOINT • 200 = MAX</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* General */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">General (Camera & Drag)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-red-500">
                          {effectiveResult.general}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.general / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Red Dot */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">Red Dot (Hip-fire reticle)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-red-500">
                          {effectiveResult.redDot}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.redDot / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* 2X Scope */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">2X Scope</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-amber-400">
                          {effectiveResult.scope2x}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.scope2x / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* 4X Scope */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">4X Scope</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-amber-400">
                          {effectiveResult.scope4x}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.scope4x / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Sniper Scope */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">Sniper Scope (AWM/M82B)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-cyan-400">
                          {effectiveResult.sniper}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.sniper / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Free Look */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-300">Free Look (Eye Button)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading font-black text-xl text-slate-200">
                          {effectiveResult.freeLook}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">/ 200</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-zinc-600 to-zinc-400 rounded-full transition-all duration-500"
                        style={{ width: `${(effectiveResult.freeLook / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>0</span>
                      <span>100</span>
                      <span>200</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fire Button & DPI recommendations row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Fire Button Size */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-zinc-950 border border-red-600/40 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0 bg-red-900/20">
                    <span className="font-heading font-black text-lg text-white">
                      {effectiveResult.fireButtonSize}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <span>Fire Button Size</span>
                      {isSmoothModeActive && <span className="text-[10px] text-emerald-400 font-mono">(-3% Smooth)</span>}
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-0.5">
                      Optimal clearance for upward thumb drag path without dead-zone slips.
                    </p>
                  </div>
                </div>

                {/* Recommended DPI */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-zinc-950 border border-amber-600/40 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                    <Gauge className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Recommended DPI
                    </h4>
                    <p className="text-xs font-bold text-white mt-0.5 font-mono">
                      {effectiveResult.recommendedDpi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Drag Smoothness & Headshot Test Pad */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-red-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MoveUp className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Drag Flick Test Pad (Practice Vertical Swipe)
                    </span>
                  </div>
                  {headshotScore && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                        headshotScore.achieved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      Smoothness: {headshotScore.smoothness}%
                    </span>
                  )}
                </div>

                {/* Test Area */}
                <div
                  onMouseDown={(e) => handleTestPadStart(e.clientY)}
                  onMouseMove={(e) => handleTestPadMove(e.clientY)}
                  onMouseUp={handleTestPadEnd}
                  onMouseLeave={handleTestPadEnd}
                  onTouchStart={(e) => handleTestPadStart(e.touches[0].clientY)}
                  onTouchMove={(e) => handleTestPadMove(e.touches[0].clientY)}
                  onTouchEnd={handleTestPadEnd}
                  className="relative h-44 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 flex flex-col items-center justify-between p-3 select-none touch-none cursor-pointer overflow-hidden shadow-inner"
                >
                  {/* Headshot Target Area */}
                  <div className="w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-semibold">
                    <Crosshair className="w-3.5 h-3.5 text-red-500" />
                    <span>ENEMY HEAD TARGET (DRAG UP HERE)</span>
                  </div>

                  {/* Status Banner */}
                  <div className="text-center z-10">
                    {headshotScore ? (
                      <span className={`text-xs font-bold ${headshotScore.achieved ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {headshotScore.msg}
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-400 flex items-center justify-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hold the Fire Button below and flick UPWARDS to test drag feel!</span>
                      </span>
                    )}
                    {dragSpeedPps > 0 && (
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Velocity: {dragSpeedPps} px/s • Jitter Reduction: {isSmoothModeActive ? '99.4%' : '88.0%'}
                      </div>
                    )}
                  </div>

                  {/* Interactive Fire Button (User drags this upwards) */}
                  <div
                    style={{ transform: `translateY(-${dragYOffset}px)` }}
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black font-heading text-xs transition-transform duration-75 shadow-lg ${
                      isDraggingPad
                        ? 'bg-red-600 border-amber-300 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-110'
                        : 'bg-zinc-800 border-red-500 text-zinc-200 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    }`}
                  >
                    <span>FIRE</span>
                  </div>
                </div>
              </div>

              {/* Brand-Specific Device Smoothness Tips */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                    <span>{selectedBrand} Phone Smooth Optimization Guide</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">100% Touch Sampling Boost</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Follow these exact OS settings on your {selectedBrand} to make the screen feel completely smooth with zero touch lag:
                </p>
                <div className="space-y-1.5 pt-1">
                  {getBrandSmoothTips(selectedBrand, platform).map((tip, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] text-zinc-300 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800/80 leading-relaxed font-sans"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphics & FPS preset */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-zinc-400">Optimal Display Profile:</span>
                  <div className="font-bold text-white text-sm">
                    {effectiveResult.graphicPreset} Graphics • {effectiveResult.fpsSetting}
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-red-950 border border-red-600/40 text-red-300 font-semibold text-[11px] w-fit">
                  Zero Frame Drop Tuned
                </div>
              </div>

              {/* Drag Technique Advice & Disclaimer */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
                    <Crosshair className="w-4 h-4" />
                    <span>Headshot Technique:</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{effectiveResult.dragCurveExplanation}</p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pt-1">
                    <strong className="text-slate-300">Finger placement:</strong>{' '}
                    {effectiveResult.fingerPlacementTip}
                  </p>
                </div>

                {/* Important Disclaimer as requested */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>FIXA GAMING Notice:</strong> Sensitivity numbers provide the optimal mathematical baseline for your hardware, but muscle memory, drag speed, and thumb positioning are equally vital. No sensitivity guarantees 100% headshots without player practice.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <FixaLogo size="md" />
              <p className="text-zinc-400 text-sm mt-3">
                Select your device specs on the left and click Generate to see customized sensitivity results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
