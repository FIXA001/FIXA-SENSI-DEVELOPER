import React, { useState, useEffect, useRef } from 'react';
import {
  Crosshair,
  Sliders,
  Target,
  Zap,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Move,
  RotateCcw,
  ShieldCheck,
  Check,
  Play,
  Flame,
  Award,
  Info
} from 'lucide-react';

export type CrosshairStyle = 'dot' | 'cross' | 'shotgun_ring' | 't_shape' | 'circle_dot' | 'chevron' | 'diamond';

export interface WeaponPreset {
  id: string;
  name: string;
  category: 'Shotgun' | 'SMG' | 'Pistol' | 'Marksman' | 'Sniper' | 'Rifle';
  icon: string;
  defaultStyle: CrosshairStyle;
  recommendedColor: string;
  recommendedSize: number;
  recommendedDot: boolean;
  dragTechnique: 'J-Drag' | 'Straight-Up' | 'Snap-Flick' | 'Quick-Scope' | 'Burst-Pull';
  placementGuide: {
    anchorZone: 'Upper Chest' | 'Neck' | 'Slightly Right of Chest' | 'Under Chin' | 'Center Pinpoint';
    dragAngle: string;
    optimalSpeed: string;
    whiteToRedTip: string;
    description: string;
  };
  sampleDmg: { head: number; body: number };
}

export const WEAPON_PRESETS: WeaponPreset[] = [
  {
    id: 'm1887',
    name: 'M1887 (Double Barrel)',
    category: 'Shotgun',
    icon: '💥',
    defaultStyle: 'shotgun_ring',
    recommendedColor: '#ff2b4e',
    recommendedSize: 34,
    recommendedDot: true,
    dragTechnique: 'J-Drag',
    placementGuide: {
      anchorZone: 'Upper Chest',
      dragAngle: 'Curve right then flick directly up (J-Motion)',
      optimalSpeed: '320 - 450 px/s (Ultra Fast Flick)',
      whiteToRedTip: 'Start with crosshair on the right side of enemy body. When dragging, pull down slightly and whip straight up into head hitbox.',
      description: 'The M1887 pellets have wide spread. The shotgun ring overlay helps visualize the pellet cluster zone, while the center dot ensures the center pellet lands on the forehead.'
    },
    sampleDmg: { head: 360, body: 95 }
  },
  {
    id: 'mp40',
    name: 'MP40 Cobra',
    category: 'SMG',
    icon: '⚡',
    defaultStyle: 'cross',
    recommendedColor: '#00f0ff',
    recommendedSize: 22,
    recommendedDot: true,
    dragTechnique: 'Straight-Up',
    placementGuide: {
      anchorZone: 'Neck',
      dragAngle: 'Pure vertical upward swipe (0° deviation)',
      optimalSpeed: '250 - 340 px/s (Smooth & Steady)',
      whiteToRedTip: 'Fire the first 3 bullets at chest height, then drag upward smoothly. Avoid swiping too fast or bullets will fly above head into the sky.',
      description: 'MP40 has extreme fire rate. A compact 22px crosshair prevents recoil spread from blinding your sight of the enemy helmet.'
    },
    sampleDmg: { head: 148, body: 26 }
  },
  {
    id: 'deagle',
    name: 'Desert Eagle',
    category: 'Pistol',
    icon: '🎯',
    defaultStyle: 'dot',
    recommendedColor: '#ffe600',
    recommendedSize: 14,
    recommendedDot: true,
    dragTechnique: 'Snap-Flick',
    placementGuide: {
      anchorZone: 'Under Chin',
      dragAngle: 'Micro snap upward flick right as reticle turns red',
      optimalSpeed: '380 - 500 px/s (Instant Snap)',
      whiteToRedTip: 'Keep crosshair white right below enemy collarbone. The moment aim-assist snaps to red, flick your fire button directly upward.',
      description: 'One-Tap master weapon. A minimal 14px red/gold dot gives zero screen obstruction for clean 495 red headshot numbers.'
    },
    sampleDmg: { head: 495, body: 90 }
  },
  {
    id: 'woodpecker',
    name: 'Woodpecker / SVD',
    category: 'Marksman',
    icon: '🦅',
    defaultStyle: 't_shape',
    recommendedColor: '#00ff66',
    recommendedSize: 24,
    recommendedDot: true,
    dragTechnique: 'Snap-Flick',
    placementGuide: {
      anchorZone: 'Neck',
      dragAngle: 'Instant vertical flick with pause on head',
      optimalSpeed: '300 - 420 px/s (Sharp One-Tap)',
      whiteToRedTip: 'Woodpecker has high armor penetration. Place crosshair at shoulder level before pressing fire button.',
      description: 'T-Shape crosshair clears the top sight line so you have an unobstructed view of the enemy head hitbox when peaking gloo walls.'
    },
    sampleDmg: { head: 372, body: 74 }
  },
  {
    id: 'awm',
    name: 'AWM / M82B Sniper',
    category: 'Sniper',
    icon: '🔭',
    defaultStyle: 'circle_dot',
    recommendedColor: '#bf00ff',
    recommendedSize: 28,
    recommendedDot: true,
    dragTechnique: 'Quick-Scope',
    placementGuide: {
      anchorZone: 'Center Pinpoint',
      dragAngle: 'Prefire centering before scoping (Zero drag)',
      optimalSpeed: 'Instant quick-tap switch',
      whiteToRedTip: 'Snipers in Free Fire do not have a default hipfire crosshair! This overlay gives you a permanent center dot so you can align targets BEFORE opening scope.',
      description: 'Double-sniper switch advantage: Center the custom reticle on the enemy, tap Scope + Fire + Quick Weapon Switch for 0.2s headshots.'
    },
    sampleDmg: { head: 1100, body: 150 }
  },
  {
    id: 'ak47',
    name: 'AK47 / M4A1 (AR)',
    category: 'Rifle',
    icon: '🔥',
    defaultStyle: 'chevron',
    recommendedColor: '#ff6600',
    recommendedSize: 26,
    recommendedDot: false,
    dragTechnique: 'Burst-Pull',
    placementGuide: {
      anchorZone: 'Upper Chest',
      dragAngle: 'Initial upward drag followed by slight downward pull',
      optimalSpeed: '220 - 280 px/s (Controlled Pull)',
      whiteToRedTip: 'AK recoil rises rapidly. Drag up for the first 2-3 headshot hits, then pull down 5% to keep spray centered.',
      description: 'Chevron reticle provides an arrow tip pointing directly at the enemy head while the lower wings indicate recoil bloom bounds.'
    },
    sampleDmg: { head: 214, body: 38 }
  }
];

export const RETICLE_COLORS = [
  { name: 'Crimson Red', hex: '#ff1744' },
  { name: 'Neon Green', hex: '#00e676' },
  { name: 'Cyber Cyan', hex: '#00e5ff' },
  { name: 'Electric Gold', hex: '#ffd600' },
  { name: 'Vivid Violet', hex: '#d500f9' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Blaze Orange', hex: '#ff6d00' }
];

export const openProAimModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fixa:open-pro-aim'));
  }
};

interface ProAimOverlayProps {
  onNotifyMission?: () => void;
}

export const ProAimOverlay: React.FC<ProAimOverlayProps> = ({ onNotifyMission }) => {
  // Global Overlay State
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fixa_pro_aim_active') === 'true';
    } catch {
      return false;
    }
  });

  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'arena' | 'studio' | 'guides'>('arena');

  // Listen to global open event
  useEffect(() => {
    const handleOpen = () => {
      setIsStudioOpen(true);
    };
    window.addEventListener('fixa:open-pro-aim', handleOpen);
    return () => window.removeEventListener('fixa:open-pro-aim', handleOpen);
  }, []);

  // Reticle Styling Config
  const [reticleStyle, setReticleStyle] = useState<CrosshairStyle>('shotgun_ring');
  const [reticleColor, setReticleColor] = useState<string>('#ff1744');
  const [reticleSize, setReticleSize] = useState<number>(30);
  const [reticleOpacity, setReticleOpacity] = useState<number>(90);
  const [showCenterDot, setShowCenterDot] = useState<boolean>(true);
  const [dotSize, setDotSize] = useState<number>(4);
  const [thickness, setThickness] = useState<number>(2);
  const [gapSize, setGapSize] = useState<number>(6);
  const [enableDynamicBloom, setEnableDynamicBloom] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Selected Weapon Preset
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('m1887');

  // Drag Trainer Arena State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentDragPos, setCurrentDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [dragPath, setDragPath] = useState<{ x: number; y: number }[]>([]);
  const [lastShotResult, setLastShotResult] = useState<{
    hitType: 'head' | 'chest' | 'body' | 'miss';
    damage: number;
    speedPps: number;
    angleDegree: number;
    message: string;
    color: string;
  } | null>(null);

  const [trainingScore, setTrainingScore] = useState<{
    totalShots: number;
    headshots: number;
    streak: number;
  }>({ totalShots: 0, headshots: 0, streak: 0 });

  const arenaRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synchronize overlay active state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fixa_pro_aim_active', isOverlayActive ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isOverlayActive]);

  // Web Audio Synth for authentic Esports Headshot sound & drag feedback
  const playEsportsSound = (type: 'headshot' | 'body' | 'flick') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'headshot') {
        // High crisp bell + bass snap (Free Fire Red Number crunch)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220, now);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.15);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);

        // Haptic feedback if available
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([30, 40, 60]);
          } catch {
            // ignore
          }
        }
      } else if (type === 'body') {
        // Dull body thud (White damage)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'flick') {
        // Subtle tick during swipe
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const selectedWeapon = WEAPON_PRESETS.find(w => w.id === selectedWeaponId) || WEAPON_PRESETS[0];

  const handleApplyPreset = (preset: WeaponPreset) => {
    setSelectedWeaponId(preset.id);
    setReticleStyle(preset.defaultStyle);
    setReticleColor(preset.recommendedColor);
    setReticleSize(preset.recommendedSize);
    setShowCenterDot(preset.recommendedDot);
    playEsportsSound('flick');
  };

  // Drag Flick Handlers
  const handleArenaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStartPos({ x, y });
    setCurrentDragPos({ x, y });
    setDragStartTime(Date.now());
    setDragPath([{ x, y }]);
    playEsportsSound('flick');
  };

  const handleArenaPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !arenaRef.current || !dragStartPos) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentDragPos({ x, y });
    setDragPath(prev => [...prev.slice(-25), { x, y }]);
  };

  const handleArenaPointerUp = () => {
    if (!isDragging || !dragStartPos || !currentDragPos) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);

    const deltaX = currentDragPos.x - dragStartPos.x;
    const deltaY = dragStartPos.y - currentDragPos.y; // Positive if dragging UP
    const durationSec = Math.max(0.04, (Date.now() - dragStartTime) / 1000);
    const distancePx = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speedPps = Math.round(distancePx / durationSec);

    // Compute angle relative to straight UP (0 deg = straight up)
    const angleRad = Math.atan2(deltaX, deltaY);
    const angleDegree = Math.round((angleRad * 180) / Math.PI);

    // Evaluate Shot Hitbox
    // Headshot: Must drag UP at least 45px, velocity > 220px/s, angle deviation within -35 to +35 deg (or J-curve if shotgun)
    const isUpwardFlick = deltaY >= 40;
    const isFastEnough = speedPps >= 210;
    const isAngleAccurate = selectedWeapon.dragTechnique === 'J-Drag'
      ? (angleDegree >= -20 && angleDegree <= 65) // J-Drag curves right
      : (Math.abs(angleDegree) <= 30); // Straight drag

    if (isUpwardFlick && isFastEnough && isAngleAccurate) {
      // PERFECT HEADSHOT!
      const dmg = selectedWeapon.sampleDmg.head;
      playEsportsSound('headshot');
      setLastShotResult({
        hitType: 'head',
        damage: dmg,
        speedPps,
        angleDegree,
        message: `🎯 PERFECT HEADSHOT! (${speedPps} px/s)`,
        color: '#ff1744'
      });
      setTrainingScore(prev => ({
        totalShots: prev.totalShots + 1,
        headshots: prev.headshots + 1,
        streak: prev.streak + 1
      }));
      if (onNotifyMission) {
        onNotifyMission();
      }
    } else if (isUpwardFlick && (!isFastEnough || !isAngleAccurate)) {
      // Chest / Upper Body Hit (White Damage)
      const dmg = selectedWeapon.sampleDmg.body;
      playEsportsSound('body');
      setLastShotResult({
        hitType: 'chest',
        damage: dmg,
        speedPps,
        angleDegree,
        message: !isFastEnough
          ? `⚠️ Drag too slow (${speedPps} px/s). Drag faster for Red Numbers!`
          : `⚠️ Drag angle drifted (${angleDegree}°). Keep drag centered towards head!`,
        color: '#ffd600'
      });
      setTrainingScore(prev => ({
        totalShots: prev.totalShots + 1,
        headshots: prev.headshots,
        streak: 0
      }));
    } else {
      // Missed or drag down
      playEsportsSound('body');
      setLastShotResult({
        hitType: 'miss',
        damage: 0,
        speedPps,
        angleDegree,
        message: '❌ Drag failed. Swipe your finger/mouse upward toward the enemy head!',
        color: '#94a3b8'
      });
      setTrainingScore(prev => ({
        totalShots: prev.totalShots + 1,
        headshots: prev.headshots,
        streak: 0
      }));
    }
  };

  // Render Reticle Graphic based on Style
  const renderCrosshairGraphic = (scaleMultiplier = 1, isPreview = false) => {
    const size = reticleSize * scaleMultiplier;
    const half = size / 2;
    const op = reticleOpacity / 100;
    const dSize = dotSize * scaleMultiplier;

    return (
      <div
        className={`relative flex items-center justify-center pointer-events-none select-none transition-transform ${
          enableDynamicBloom && !isPreview ? 'animate-pulse' : ''
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity: op,
          filter: `drop-shadow(0 0 4px ${reticleColor})`
        }}
      >
        {/* Center Dot */}
        {showCenterDot && (
          <div
            className="absolute rounded-full"
            style={{
              width: `${dSize}px`,
              height: `${dSize}px`,
              backgroundColor: reticleColor,
              boxShadow: `0 0 6px ${reticleColor}`
            }}
          />
        )}

        {/* Reticle Shape Variants */}
        {reticleStyle === 'dot' && (
          <div
            className="rounded-full"
            style={{
              width: `${Math.max(6, size * 0.45)}px`,
              height: `${Math.max(6, size * 0.45)}px`,
              backgroundColor: reticleColor,
              boxShadow: `0 0 10px ${reticleColor}`
            }}
          />
        )}

        {reticleStyle === 'cross' && (
          <>
            {/* Top Bar */}
            <div
              className="absolute rounded-sm"
              style={{
                top: 0,
                width: `${thickness}px`,
                height: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
            {/* Bottom Bar */}
            <div
              className="absolute rounded-sm"
              style={{
                bottom: 0,
                width: `${thickness}px`,
                height: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
            {/* Left Bar */}
            <div
              className="absolute rounded-sm"
              style={{
                left: 0,
                height: `${thickness}px`,
                width: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
            {/* Right Bar */}
            <div
              className="absolute rounded-sm"
              style={{
                right: 0,
                height: `${thickness}px`,
                width: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
          </>
        )}

        {reticleStyle === 'shotgun_ring' && (
          <div
            className="absolute rounded-full border border-dashed"
            style={{
              width: `${size * 0.9}px`,
              height: `${size * 0.9}px`,
              borderColor: reticleColor,
              borderWidth: `${thickness}px`,
              boxShadow: `0 0 8px ${reticleColor}33`
            }}
          >
            {/* 4 Cardinal Tick Marks */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 rounded"
              style={{ backgroundColor: reticleColor }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-2 rounded"
              style={{ backgroundColor: reticleColor }}
            />
            <div
              className="absolute -left-1 top-1/2 -translate-y-1/2 h-1 w-2 rounded"
              style={{ backgroundColor: reticleColor }}
            />
            <div
              className="absolute -right-1 top-1/2 -translate-y-1/2 h-1 w-2 rounded"
              style={{ backgroundColor: reticleColor }}
            />
          </div>
        )}

        {reticleStyle === 't_shape' && (
          <>
            {/* Left */}
            <div
              className="absolute rounded-sm"
              style={{
                left: 0,
                height: `${thickness}px`,
                width: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
            {/* Right */}
            <div
              className="absolute rounded-sm"
              style={{
                right: 0,
                height: `${thickness}px`,
                width: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
            {/* Bottom */}
            <div
              className="absolute rounded-sm"
              style={{
                bottom: 0,
                width: `${thickness}px`,
                height: `${(size - gapSize) / 2}px`,
                backgroundColor: reticleColor
              }}
            />
          </>
        )}

        {reticleStyle === 'circle_dot' && (
          <div
            className="absolute rounded-full border"
            style={{
              width: `${size * 0.75}px`,
              height: `${size * 0.75}px`,
              borderColor: reticleColor,
              borderWidth: `${thickness}px`
            }}
          />
        )}

        {reticleStyle === 'chevron' && (
          <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            className="absolute"
          >
            <path
              d="M10 22 L16 12 L22 22"
              stroke={reticleColor}
              strokeWidth={thickness * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {reticleStyle === 'diamond' && (
          <div
            className="absolute rotate-45 border"
            style={{
              width: `${size * 0.6}px`,
              height: `${size * 0.6}px`,
              borderColor: reticleColor,
              borderWidth: `${thickness}px`
            }}
          />
        )}
      </div>
    );
  };

  const headshotPercentage = trainingScore.totalShots > 0
    ? Math.round((trainingScore.headshots / trainingScore.totalShots) * 100)
    : 0;

  return (
    <>
      {/* 1. PERSISTENT GLOBAL SCREEN CROSSHAIR OVERLAY (ACTIVE WHEN TOGGLED ON) */}
      {isOverlayActive && (
        <div
          id="fixa-pro-aim-overlay-reticle"
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center transition-opacity"
        >
          {/* Exact screen center reticle */}
          {renderCrosshairGraphic(1)}

          {/* Subdued HUD Crosshair Lock Indicator */}
          <div className="absolute top-20 right-4 pointer-events-auto bg-black/80 backdrop-blur border border-red-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-zinc-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-heading font-bold text-white uppercase">Pro-Aim HUD: Active</span>
            <button
              onClick={() => setIsOverlayActive(false)}
              className="text-zinc-400 hover:text-red-400 ml-1 p-0.5 rounded cursor-pointer"
              title="Hide Reticle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. FLOATING QUICK ACTION BUTTON (ALWAYS ACCESSIBLE ON BOTTOM RIGHT) */}
      <div className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-40 flex flex-col items-end gap-2">
        {/* Toggle overlay active status button */}
        <button
          onClick={() => setIsStudioOpen(true)}
          className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.8)] border transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
            isOverlayActive
              ? 'bg-gradient-to-r from-red-600 to-amber-600 border-amber-400/80 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
              : 'bg-zinc-900/95 backdrop-blur-md border-zinc-700 hover:border-red-500 text-zinc-200 hover:text-white'
          }`}
          title="Open FIXA Pro-Aim Calibrator & Training Arena"
        >
          <div className="relative">
            <Crosshair className={`w-5 h-5 ${isOverlayActive ? 'text-white animate-spin-slow' : 'text-red-500'}`} />
            {isOverlayActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/90 font-bold leading-none">
              FIXA AIM HELPER
            </div>
            <div className="text-xs font-black font-heading tracking-wide uppercase leading-tight">
              {isOverlayActive ? 'PRO-AIM ACTIVE' : 'PRO-AIM OVERLAY'}
            </div>
          </div>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${
              isOverlayActive ? 'bg-black/30 text-emerald-300' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {isOverlayActive ? 'ON' : 'OPEN'}
          </span>
        </button>
      </div>

      {/* 3. PRO-AIM MODAL: STUDIO, PRACTICE ARENA & WEAPON GUIDES */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0e0e13] border-2 border-red-600/60 shadow-[0_0_60px_rgba(220,38,38,0.35)] overflow-hidden text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider">
                      OB48 Crosshair Suite
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                      Esports Reticle & Drag Flick Engine
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black font-heading tracking-wide text-white uppercase">
                    PRO-AIM VISUAL RETICLE HELPER
                  </h2>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {/* Overlay Toggle Switch */}
                <button
                  onClick={() => setIsOverlayActive(!isOverlayActive)}
                  className={`px-3 py-1.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isOverlayActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
                  }`}
                >
                  {isOverlayActive ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>HUD ON SCREEN</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>SHOW ON SCREEN</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsStudioOpen(false)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 pt-3 border-b border-zinc-800/80 bg-zinc-950/70 text-xs font-heading font-bold uppercase">
              <button
                onClick={() => setActiveTab('arena')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'arena'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-4 h-4 text-red-500" />
                <span>Drag Practice Arena</span>
              </button>

              <button
                onClick={() => setActiveTab('studio')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'studio'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Reticle Customizer</span>
              </button>

              <button
                onClick={() => setActiveTab('guides')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'guides'
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Weapon Drag Vectors</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: INTERACTIVE DRAG PRACTICE ARENA */}
              {activeTab === 'arena' && (
                <div className="space-y-5">
                  {/* Weapon Quick Selector Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-zinc-400 uppercase tracking-wider font-bold">
                        Select Free Fire Weapon Archetype:
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">
                        Target Weapon: <strong className="text-white">{selectedWeapon.name}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {WEAPON_PRESETS.map(preset => {
                        const isSelected = selectedWeaponId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-red-600/30 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                          >
                            <div className="text-lg">{preset.icon}</div>
                            <div className="text-xs font-bold font-heading truncate mt-1 text-white">
                              {preset.name.split(' ')[0]}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              {preset.dragTechnique}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practice Arena Screen Canvas */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    {/* Left: Interactive Target & Drag Canvas (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col">
                      <div
                        ref={arenaRef}
                        onPointerDown={handleArenaPointerDown}
                        onPointerMove={handleArenaPointerMove}
                        onPointerUp={handleArenaPointerUp}
                        onPointerCancel={handleArenaPointerUp}
                        className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#14141c] via-[#0d0d12] to-black border-2 border-red-600/40 overflow-hidden shadow-inner cursor-crosshair select-none touch-none flex flex-col justify-between p-4"
                      >
                        {/* Esports Grid & Radar Background */}
                        <div
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.2) 0%, transparent 70%), linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '100% 100%, 30px 30px, 30px 30px'
                          }}
                        />

                        {/* Top HUD Stats */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold font-mono">
                              {selectedWeapon.dragTechnique} Drill
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              Swipe Upward to Trigger Red Number
                            </span>
                          </div>

                          <div className="flex items-center gap-3 font-mono">
                            <span className="text-zinc-400">
                              Shots: <strong className="text-white">{trainingScore.totalShots}</strong>
                            </span>
                            <span className="text-red-400 font-bold">
                              HS Rate: <strong>{headshotPercentage}%</strong>
                            </span>
                          </div>
                        </div>

                        {/* 2D FREE FIRE ENEMY DUMMY TARGET */}
                        <div className="relative z-10 mx-auto flex flex-col items-center pointer-events-none my-auto">
                          {/* HEAD TARGET ZONE (Red Number Trigger) */}
                          <div className="relative group/head flex items-center justify-center">
                            <div className="w-14 h-16 rounded-3xl bg-gradient-to-b from-red-600/60 to-red-900/60 border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center text-center animate-pulse">
                              <span className="text-[10px] font-black font-heading text-white uppercase tracking-wider leading-tight">
                                HEAD
                                <br />
                                <span className="text-yellow-300">CRIT</span>
                              </span>
                            </div>
                            {/* Hitbox ring */}
                            <div className="absolute -inset-2 rounded-full border border-red-500/30 pointer-events-none" />
                          </div>

                          {/* NECK / UPPER CHEST DRAG START ANCHOR */}
                          <div className="relative w-24 h-12 rounded-t-xl bg-gradient-to-b from-amber-600/30 to-zinc-800/50 border-x-2 border-t-2 border-amber-500/50 flex items-center justify-center -mt-1">
                            <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                              Drag Start Zone
                            </span>
                            {/* Anchor point target indicator */}
                            <div className="absolute w-3 h-3 rounded-full bg-amber-400/80 animate-ping" />
                          </div>

                          {/* BODY / TORSO ZONE */}
                          <div className="w-32 h-20 bg-zinc-900/70 border-2 border-zinc-700/80 rounded-b-xl flex items-center justify-center text-zinc-400 text-[10px] font-semibold">
                            Body Armor (White Dmg)
                          </div>
                        </div>

                        {/* Drag Flick SVG Trajectory */}
                        {dragPath.length > 1 && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                            <polyline
                              fill="none"
                              stroke={selectedWeapon.recommendedColor}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={dragPath.map(p => `${p.x},${p.y}`).join(' ')}
                            />
                            {currentDragPos && (
                              <circle
                                cx={currentDragPos.x}
                                cy={currentDragPos.y}
                                r="6"
                                fill="#fff"
                                stroke={selectedWeapon.recommendedColor}
                                strokeWidth="2"
                              />
                            )}
                          </svg>
                        )}

                        {/* Floating Drag Indicator / Touch Cue */}
                        {!isDragging && (
                          <div className="relative z-10 text-center pointer-events-none pb-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-zinc-700 text-zinc-300 text-xs font-semibold animate-bounce">
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span>Touch & Swipe UP on Screen with Thumb / Mouse</span>
                            </div>
                          </div>
                        )}

                        {/* Reticle following pointer during drag */}
                        {isDragging && currentDragPos && (
                          <div
                            className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${currentDragPos.x}px`,
                              top: `${currentDragPos.y}px`
                            }}
                          >
                            {renderCrosshairGraphic(1)}
                          </div>
                        )}

                        {/* Damage Popup Overlay on Hit */}
                        {lastShotResult && (
                          <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-fadeScale"
                            key={Date.now()}
                          >
                            {lastShotResult.hitType === 'head' ? (
                              <div className="text-center drop-shadow-[0_0_25px_rgba(220,38,38,1)]">
                                <div className="text-4xl sm:text-6xl font-black font-heading text-red-500 tracking-wider">
                                  {lastShotResult.damage}
                                </div>
                                <div className="text-xs sm:text-sm font-black font-heading text-yellow-300 uppercase tracking-widest bg-black/80 px-3 py-0.5 rounded-full border border-red-500 mt-1 inline-block">
                                  💥 HEADSHOT! RED NUMBER
                                </div>
                              </div>
                            ) : lastShotResult.hitType === 'chest' ? (
                              <div className="text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                                <div className="text-3xl sm:text-4xl font-black font-heading text-slate-100">
                                  {lastShotResult.damage}
                                </div>
                                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider bg-black/80 px-2.5 py-0.5 rounded-full border border-zinc-700 mt-1 inline-block">
                                  White Damage (Drag Faster!)
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                      {/* Shot Telemetry Bar */}
                      <div className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-400 uppercase font-mono text-[10px]">
                            Last Flick Result:
                          </span>
                          <span
                            className="font-bold font-heading"
                            style={{ color: lastShotResult?.color || '#94a3b8' }}
                          >
                            {lastShotResult ? lastShotResult.message : 'Ready for Drag Test'}
                          </span>
                        </div>

                        {lastShotResult && (
                          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                            <span>
                              Speed: <strong className="text-white">{lastShotResult.speedPps} px/s</strong>
                            </span>
                            <span>
                              Angle: <strong className="text-white">{lastShotResult.angleDegree}°</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Real-time Placement Vector Guide & Stats (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Weapon Aim Strategy Card */}
                      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                          <h4 className="text-sm font-bold font-heading text-white flex items-center gap-1.5">
                            <Crosshair className="w-4 h-4 text-red-500" />
                            <span>{selectedWeapon.name} Guide</span>
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
                            {selectedWeapon.dragTechnique}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                              1. Starting Reticle Placement:
                            </span>
                            <span className="font-semibold text-amber-300">
                              {selectedWeapon.placementGuide.anchorZone}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                              2. Drag Flick Trajectory:
                            </span>
                            <span className="text-zinc-300">
                              {selectedWeapon.placementGuide.dragAngle}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                              3. Optimal Drag Velocity:
                            </span>
                            <span className="text-emerald-400 font-mono font-bold">
                              {selectedWeapon.placementGuide.optimalSpeed}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-600/30 text-[11px] text-zinc-300 leading-snug">
                            <strong className="text-red-400 block mb-0.5">White-to-Red Aim Lock:</strong>
                            {selectedWeapon.placementGuide.whiteToRedTip}
                          </div>
                        </div>
                      </div>

                      {/* Sound & Haptics Toggle Card */}
                      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {soundEnabled ? (
                            <Volume2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <VolumeX className="w-4 h-4 text-zinc-500" />
                          )}
                          <div>
                            <div className="text-xs font-bold text-white">Audio & Hit Sounds</div>
                            <div className="text-[10px] text-zinc-400">Esports headshot bell & drag clicks</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold cursor-pointer transition-colors ${
                            soundEnabled
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {soundEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      {/* Reset Drills */}
                      <button
                        type="button"
                        onClick={() => {
                          setTrainingScore({ totalShots: 0, headshots: 0, streak: 0 });
                          setLastShotResult(null);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Reset Practice Scores</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RETICLE STUDIO & CUSTOMIZATION */}
              {activeTab === 'studio' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left: Reticle Live Preview Box (5 cols) */}
                  <div className="md:col-span-5 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-between min-h-[360px] text-center">
                    <div className="w-full flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-mono uppercase font-bold">Reticle Preview</span>
                      <span className="text-red-400 font-mono">{reticleStyle.toUpperCase()}</span>
                    </div>

                    {/* Preview Box with Mock Game Background */}
                    <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-b from-[#181822] via-[#101017] to-black border border-zinc-700 flex items-center justify-center shadow-inner overflow-hidden my-4">
                      {/* Reticle */}
                      {renderCrosshairGraphic(1.5, true)}

                      {/* Mock enemy silhouette head in background to test contrast */}
                      <div className="absolute w-12 h-14 rounded-full border border-red-500/20 opacity-30 pointer-events-none" />
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                        <span>Color: <strong style={{ color: reticleColor }}>{reticleColor}</strong></span>
                        <span>Size: <strong className="text-white">{reticleSize}px</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsOverlayActive(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Apply & Lock to Screen Center</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Customization Controls (7 cols) */}
                  <div className="md:col-span-7 space-y-5 bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800">
                    {/* Reticle Style Selector */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        1. Crosshair Geometry Archetype
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(
                          [
                            { id: 'shotgun_ring', name: 'Shotgun Ring' },
                            { id: 'cross', name: 'Esports Cross' },
                            { id: 'dot', name: 'Pinpoint Dot' },
                            { id: 't_shape', name: 'T-Shape' },
                            { id: 'circle_dot', name: 'Sniper Circle' },
                            { id: 'chevron', name: 'Chevron Arrow' },
                            { id: 'diamond', name: 'Diamond Ring' }
                          ] as { id: CrosshairStyle; name: string }[]
                        ).map(style => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => {
                              setReticleStyle(style.id);
                              playEsportsSound('flick');
                            }}
                            className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                              reticleStyle === style.id
                                ? 'bg-red-600/30 border-red-500 text-white shadow-sm'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        2. High-Contrast Reticle Color
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {RETICLE_COLORS.map(c => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => {
                              setReticleColor(c.hex);
                              playEsportsSound('flick');
                            }}
                            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer transform hover:scale-110 ${
                              reticleColor === c.hex
                                ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-110'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {reticleColor === c.hex && <Check className="w-4 h-4 text-black stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Reticle Size */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-zinc-300">
                          <span>Crosshair Diameter</span>
                          <span className="font-mono text-red-400">{reticleSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="54"
                          value={reticleSize}
                          onChange={e => setReticleSize(Number(e.target.value))}
                          className="w-full accent-red-600 cursor-pointer"
                        />
                      </div>

                      {/* Reticle Opacity */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-zinc-300">
                          <span>Screen Opacity</span>
                          <span className="font-mono text-red-400">{reticleOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={reticleOpacity}
                          onChange={e => setReticleOpacity(Number(e.target.value))}
                          className="w-full accent-red-600 cursor-pointer"
                        />
                      </div>

                      {/* Line Thickness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-zinc-300">
                          <span>Line Thickness</span>
                          <span className="font-mono text-red-400">{thickness}px</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={thickness}
                          onChange={e => setThickness(Number(e.target.value))}
                          className="w-full accent-red-600 cursor-pointer"
                        />
                      </div>

                      {/* Center Dot Toggle */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div>
                          <div className="text-xs font-bold text-white">Center Dot</div>
                          <div className="text-[10px] text-zinc-400">Headshot pinpoint</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCenterDot(!showCenterDot)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                            showCenterDot
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {showCenterDot ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WEAPON DRAG VECTORS & PLACEMENT THEORY */}
              {activeTab === 'guides' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-600/40">
                    <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>THE SCIENCE OF FREE FIRE RED NUMBERS & AIM LOCK</span>
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      In Free Fire, the built-in auto-aim lock defaults to the center chest hitbox. If you start your drag flick while the crosshair is already locked onto the body, the aim friction prevents your crosshair from rising to the head. Follow these weapon-specific vector angles:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WEAPON_PRESETS.map(preset => (
                      <div
                        key={preset.id}
                        className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-500/50 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{preset.icon}</span>
                            <div>
                              <h4 className="text-sm font-bold font-heading text-white">{preset.name}</h4>
                              <span className="text-[10px] font-mono text-zinc-400">{preset.category}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleApplyPreset(preset);
                              setActiveTab('arena');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Practice
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-950 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Anchor Placement:</span>
                            <span className="text-amber-400 font-semibold">{preset.placementGuide.anchorZone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Drag Trajectory:</span>
                            <span className="text-slate-200">{preset.dragTechnique}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Headshot Damage:</span>
                            <span className="text-red-400 font-mono font-bold">{preset.sampleDmg.head} RED DMG</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-snug">
                          {preset.placementGuide.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Anti-Ban Safe • Visual Overlay (Zero Game File Modification)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors cursor-pointer"
                >
                  Close Helper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
