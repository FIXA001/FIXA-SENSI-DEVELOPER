import React, { useState } from 'react';
import { DeviceHealthWidget } from '../components/DeviceHealthWidget';
import {
  Gauge,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Cpu,
  HardDrive,
  Sliders,
  Wifi,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  ShieldAlert,
} from 'lucide-react';

interface FreeOptimizePageProps {
  onAskAIWithHealth?: (query: string) => void;
}

export const FreeOptimizePage: React.FC<FreeOptimizePageProps> = ({ onAskAIWithHealth }) => {
  const [selectedTier, setSelectedTier] = useState<'low' | 'mid' | 'high'>('mid');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const optimizationChecklist = [
    {
      id: 'opt_1',
      title: 'Free Fire In-Game Display: Set High FPS',
      description:
        'Navigate to Settings > Display in Free Fire and switch FPS to "High". Even on low-end phones, High FPS unlocks 60 FPS instead of the default 30 FPS stutter lock.',
      tierNote: 'Critical for all tiers',
    },
    {
      id: 'opt_2',
      title: 'Turn Off In-Game Shadows & High Res',
      description:
        'Shadows heavily stress the mobile GPU shaders during squad smoke grenade exchanges. Turning Shadows OFF stabilizes framerate by up to 25%.',
      tierNote: 'Crucial for 2GB - 6GB devices',
    },
    {
      id: 'opt_3',
      title: 'Uninstall Unused Free Fire Resource Packs',
      description:
        'Open Download Center (Cloud icon) inside Free Fire. Delete weapon skin animation effects and old event maps you do not play. Keeps app size under 2.5 GB.',
      tierNote: 'Saves 3GB+ storage and frees RAM',
    },
    {
      id: 'opt_4',
      title: 'Configure Android Developer Window Animation Scales',
      description:
        'Go to Settings > Developer Options. Set "Window animation scale", "Transition animation scale", and "Animator duration scale" from 1x to 0.5x.',
      tierNote: 'Cuts render latency across all Android brands',
    },
    {
      id: 'opt_5',
      title: 'Activate Dedicated Game Turbo / Game Space',
      description:
        'For Samsung: Game Booster Labs. For Xiaomi/POCO: Game Turbo with Performance Mode ON. For OnePlus/Realme: Pro Gamer Mode. Prioritizes CPU clock speeds.',
      tierNote: 'Prevents CPU throttling',
    },
    {
      id: 'opt_6',
      title: 'Disable Battery Saver During Gaming Sessions',
      description:
        'Power saving modes limit CPU frequencies to 70%, creating major frame drops during intense close-range gunfights.',
      tierNote: 'Essential for smooth combat',
    },
  ];

  const totalSteps = optimizationChecklist.length;
  const finishedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((finishedCount / totalSteps) * 100);

  return (
    <div className="space-y-10 py-6 pb-20 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Gauge className="w-3.5 h-3.5" />
          <span>Esports Performance Tuning</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-heading tracking-wide text-white uppercase">
          FREE FIRE <span className="text-red-500">OPTIMIZATION</span> SUITE
        </h1>
        <p className="mt-2 text-xs md:text-sm text-zinc-400">
          Proven step-by-step performance optimizations, graphics configurations, and lag reduction strategies verified by FIXA GAMING.
        </p>
      </div>

      {/* Real-time Device Health & FPS Stability Telemetry Widget */}
      <DeviceHealthWidget onAskAIWithHealth={onAskAIWithHealth} />

      {/* Interactive Optimization Progress Tracker */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#161214] to-zinc-900 border-2 border-red-600/50 shadow-[0_0_35px_rgba(220,38,38,0.25)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Interactive FPS Booster Checklist</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Check off each optimization step as you apply it to your device to achieve maximum FPS.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-red-400 font-mono">
              {finishedCount} / {totalSteps} Completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {optimizationChecklist.map((item) => {
            const isDone = !!completedSteps[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleStep(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : 'border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-bold font-heading ${
                        isDone ? 'text-emerald-300 line-through' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-300">
                    {item.tierNote}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Device Specification Tier Recommendation Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-500" />
              <span>Recommended Graphics Config By Device Tier</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Select your phone's hardware category to see tailored in-game settings.
            </p>
          </div>

          <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => setSelectedTier('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedTier === 'low'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Low-End (2GB-4GB)
            </button>
            <button
              onClick={() => setSelectedTier('mid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedTier === 'mid'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mid-Range (6GB-8GB)
            </button>
            <button
              onClick={() => setSelectedTier('high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedTier === 'high'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Flagship (12GB+ / iOS)
            </button>
          </div>
        </div>

        {/* Tier Details Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          {selectedTier === 'low' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-600/40 text-xs text-red-200">
                <strong>Target Objective:</strong> Achieve a rock-solid 55-60 FPS without overheating or app crashing.
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Graphics</span>
                  <div className="font-heading font-black text-base text-red-500 mt-1">SMOOTH</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">High FPS</span>
                  <div className="font-heading font-black text-base text-emerald-400 mt-1">HIGH (ON)</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Shadows</span>
                  <div className="font-heading font-black text-base text-zinc-400 mt-1">OFF</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Filter</span>
                  <div className="font-heading font-black text-base text-amber-400 mt-1">CLASSIC</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong>Why:</strong> Low-end chips (Helio G35/G36, Snapdragon 680, Exynos 850) lack GPU bandwidth for dynamic reflections. Smooth graphics with High FPS provides the cleanest frame pacing.
              </p>
            </div>
          )}

          {selectedTier === 'mid' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200">
                <strong>Target Objective:</strong> Balanced competitive visual clarity and sustained 60-90 FPS in ranked tournaments.
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Graphics</span>
                  <div className="font-heading font-black text-base text-amber-400 mt-1">STANDARD / ULTRA</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">High FPS</span>
                  <div className="font-heading font-black text-base text-emerald-400 mt-1">HIGH (60/90 FPS)</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Shadows</span>
                  <div className="font-heading font-black text-base text-zinc-400 mt-1">OFF</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Filter</span>
                  <div className="font-heading font-black text-base text-red-400 mt-1">VIVID</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong>Why:</strong> Mid-tier devices (Snapdragon 778G, Dimensity 7050/8050, Tensor G2) easily handle Vivid colors for spotting enemies inside grass and behind Gloo Walls without drops.
              </p>
            </div>
          )}

          {selectedTier === 'high' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-xs text-emerald-200">
                <strong>Target Objective:</strong> Ultra-fast 120 FPS high refresh rate gaming with zero touch input latency.
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Graphics</span>
                  <div className="font-heading font-black text-base text-emerald-400 mt-1">ULTRA / MAX</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">High FPS</span>
                  <div className="font-heading font-black text-base text-emerald-400 mt-1">MAX (120 FPS)</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">High Res</span>
                  <div className="font-heading font-black text-base text-amber-400 mt-1">HIGH</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] uppercase">Filter</span>
                  <div className="font-heading font-black text-base text-cyan-400 mt-1">OCEAN / VIVID</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong>Why:</strong> Flagship silicon (Snapdragon 8 Gen 2/3, Dimensity 9300, Apple A17/A18 Pro) provides ample thermal headroom. Even with Max graphics, always turn Shadows OFF for esports visibility.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lag Reduction & Network Ping Stabilization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold font-heading text-white">
                Eliminate 999+ Ping Spikes
              </h4>
              <p className="text-xs text-zinc-400">Network latency stabilization</p>
            </div>
          </div>

          <ul className="text-xs text-zinc-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0 font-bold">•</span>
              <span>
                <strong>5GHz Wi-Fi Band:</strong> Connect to 5GHz rather than 2.4GHz to avoid microwave and Bluetooth signal interference.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0 font-bold">•</span>
              <span>
                <strong>Private DNS Configuration:</strong> Set Private DNS in Android settings to <code className="text-amber-400 font-mono">dns.google</code> or <code className="text-amber-400 font-mono">1dot1dot1dot1.cloudflare-dns.com</code> to resolve game servers with lower jitter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 shrink-0 font-bold">•</span>
              <span>
                <strong>Disable Auto-Updates:</strong> Turn off Google Play Store and iOS App Store auto-update over Wi-Fi so background downloads never trigger during ranked matches.
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-500 border border-red-500/40">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold font-heading text-white">
                Thermal Throttling Prevention
              </h4>
              <p className="text-xs text-zinc-400">Stop FPS drop when phone gets hot</p>
            </div>
          </div>

          <ul className="text-xs text-zinc-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-red-500 shrink-0 font-bold">•</span>
              <span>
                <strong>Remove Thick Phone Case:</strong> Silicone and heavy armor cases trap heat against the phone backplate, forcing the processor to throttle down to 30 FPS within 15 minutes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 shrink-0 font-bold">•</span>
              <span>
                <strong>Never Play While Fast Charging:</strong> 33W-120W charging generates excessive heat that causes severe frame rate drops. Charge before the game.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 shrink-0 font-bold">•</span>
              <span>
                <strong>Screen Brightness at 70-80%:</strong> 100% maximum brightness is one of the highest heat contributors on AMOLED panels.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
