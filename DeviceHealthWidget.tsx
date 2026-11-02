import React, { useState, useMemo, useEffect } from 'react';
import {
  DEVICES_DATABASE,
  Platform,
  DeviceModel,
  GamingStyle,
  calculateSensitivity,
  GeneratedSensitivity,
} from '../data/devices';
import {
  Activity,
  Cpu,
  HardDrive,
  BatteryCharging,
  Gauge,
  Flame,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Smartphone,
  Play,
  Copy,
  Check,
  Bot,
  Sliders,
  Crosshair,
} from 'lucide-react';

interface DeviceHealthWidgetProps {
  onAskAIWithHealth?: (healthSummary: string) => void;
}

export const DeviceHealthWidget: React.FC<DeviceHealthWidgetProps> = ({ onAskAIWithHealth }) => {
  const [platform, setPlatform] = useState<Platform>('Android');
  const [selectedBrand, setSelectedBrand] = useState<string>('Samsung');
  const [selectedModelName, setSelectedModelName] = useState<string>('Galaxy S24 Ultra');
  const [ramAmount, setRamAmount] = useState<string>('8GB');
  const [storageStatus, setStorageStatus] = useState<'low' | 'medium' | 'optimal'>('optimal');
  const [tempStatus, setTempStatus] = useState<'normal' | 'warm' | 'hot'>('normal');
  const [gameVersion, setGameVersion] = useState<string>('Free Fire OB48');
  const [sensiStyle, setSensiStyle] = useState<GamingStyle>('One Tap');

  // Stress test simulation state
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [stressTimeLeft, setStressTimeLeft] = useState<number>(0);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Available brands and models
  const availableBrands = useMemo(() => DEVICES_DATABASE[platform] || [], [platform]);
  const currentBrandObj = useMemo(() => {
    return availableBrands.find((b) => b.brand === selectedBrand) || availableBrands[0];
  }, [availableBrands, selectedBrand]);

  const currentModel = useMemo(() => {
    return currentBrandObj?.models.find((m) => m.name === selectedModelName) || currentBrandObj?.models[0];
  }, [currentBrandObj, selectedModelName]);

  // Adjust model defaults when brand/platform changes
  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    const brands = DEVICES_DATABASE[p];
    if (brands.length > 0) {
      setSelectedBrand(brands[0].brand);
      if (brands[0].models.length > 0) {
        setSelectedModelName(brands[0].models[0].name);
        setRamAmount(p === 'iOS' ? '6GB' : p === 'PC' ? '16GB' : '8GB');
      }
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const bObj = availableBrands.find((b) => b.brand === brand);
    if (bObj && bObj.models.length > 0) {
      setSelectedModelName(bObj.models[0].name);
    }
  };

  // Real-time calculation of Health Score & FPS Metrics
  const healthMetrics = useMemo(() => {
    if (!currentModel) return null;

    let score = 100;
    const hz = currentModel.refreshRate;
    const tier = currentModel.chipsetTier;

    // RAM factor
    const ramNum = parseInt(ramAmount, 10) || 4;
    if (ramNum <= 3) score -= 30;
    else if (ramNum === 4) score -= 18;
    else if (ramNum === 6) score -= 8;
    else if (ramNum >= 12) score += 3;

    // Storage factor
    if (storageStatus === 'low') score -= 22; // < 10% causes swap thrashing
    else if (storageStatus === 'medium') score -= 8;

    // Thermal state
    if (tempStatus === 'hot') score -= 32; // > 43°C forces CPU clock throttling
    else if (tempStatus === 'warm') score -= 14;

    // Game version impact
    const isMax = gameVersion.includes('MAX');
    if (isMax) {
      score -= tier === 'entry' ? 18 : tier === 'mid' ? 8 : 2;
    }
    if (gameVersion.includes('OB49')) {
      score -= 5; // Unoptimized preview builds have higher shader overhead
    }

    // Chipset tier weighting
    if (tier === 'entry') score -= 12;
    if (tier === 'flagship') score += 5;

    score = Math.max(15, Math.min(100, score));

    // Target FPS estimation
    let targetFps = 60;
    if (hz >= 120 && tier === 'flagship' && ramNum >= 8 && tempStatus !== 'hot') {
      targetFps = 120;
    } else if (hz >= 90 && (tier === 'flagship' || tier === 'mid') && ramNum >= 6 && tempStatus !== 'hot') {
      targetFps = 90;
    } else if (tier === 'entry' && ramNum <= 3) {
      targetFps = 45;
    }

    // Actual average FPS under load
    const efficiencyFactor = score / 100;
    const estimatedAvgFps = Math.round(targetFps * (0.65 + efficiencyFactor * 0.35));
    const onePercentLow = Math.max(20, Math.round(estimatedAvgFps * (0.55 + efficiencyFactor * 0.40)));
    const framePacingStability = (Math.min(99.4, 70 + efficiencyFactor * 29)).toFixed(1);

    // Thermal throttling time window
    let throttleWindow = 'No Thermal Throttling (Sustained)';
    if (tempStatus === 'hot') {
      throttleWindow = 'Immediate Throttling (Stutters in ~3 mins)';
    } else if (tempStatus === 'warm' || tier === 'entry') {
      throttleWindow = 'Moderate Throttling after ~15-20 mins';
    } else if (ramNum <= 4) {
      throttleWindow = 'Stutters after ~25 mins from RAM fragmentation';
    }

    // Categorized status
    let healthRating = 'Elite Esports Ready';
    let statusColor = 'text-emerald-400';
    let bgBadge = 'bg-emerald-950/80 border-emerald-500/50';

    if (score < 45) {
      healthRating = 'High Frame Drop Risk';
      statusColor = 'text-red-400';
      bgBadge = 'bg-red-950/80 border-red-500/50';
    } else if (score < 75) {
      healthRating = 'Moderate Stability';
      statusColor = 'text-amber-400';
      bgBadge = 'bg-amber-950/80 border-amber-500/50';
    }

    return {
      score,
      targetFps,
      estimatedAvgFps,
      onePercentLow,
      framePacingStability,
      throttleWindow,
      healthRating,
      statusColor,
      bgBadge,
      hz,
      tier,
      isMax,
    };
  }, [currentModel, ramAmount, storageStatus, tempStatus, gameVersion]);

  // Live FPS Waveform simulation
  const [fpsPoints, setFpsPoints] = useState<number[]>([]);

  useEffect(() => {
    if (!healthMetrics) return;
    const base = healthMetrics.estimatedAvgFps;
    const jitter = isStressTesting ? 8 : (100 - healthMetrics.score) / 12;
    const newPoints = Array.from({ length: 24 }, () => {
      const delta = (Math.random() - 0.48) * jitter;
      return Math.round(Math.max(15, Math.min(healthMetrics.targetFps, base + delta)));
    });
    setFpsPoints(newPoints);
  }, [healthMetrics, isStressTesting]);

  // Real-time Matched Free Fire Sensitivity (0-200 Scale) for current phone model & hardware status
  const matchedSensitivity = useMemo(() => {
    if (!currentModel) return null;
    const baseSensi = calculateSensitivity(platform, currentModel, sensiStyle);

    // Dynamic Hardware Thermal & FPS Compensation:
    // When CPU throttles (>42°C or low health score), touchscreen digitizer polling drops.
    // We dynamically apply micro-boosts on the 0–200 scale to keep drag acceleration crisp!
    let lagBoostGen = 0;
    let lagBoostRed = 0;
    let compNote = 'Nominal touch polling rate';

    if (tempStatus === 'hot' || (healthMetrics && healthMetrics.score < 45)) {
      lagBoostGen = 6;
      lagBoostRed = 4;
      compNote = '⚠️ High Thermal Lag Detected: +6 General auto-boosted to compensate for digitizer polling drop';
    } else if (tempStatus === 'warm' || (healthMetrics && healthMetrics.score < 70)) {
      lagBoostGen = 3;
      lagBoostRed = 2;
      compNote = '⚡ Warm CPU state: +3 General fine-tuned for smooth flick consistency';
    }

    return {
      ...baseSensi,
      general: Math.min(200, baseSensi.general + lagBoostGen),
      redDot: Math.min(200, baseSensi.redDot + lagBoostRed),
      lagBoostGen,
      compNote,
    };
  }, [platform, currentModel, sensiStyle, tempStatus, healthMetrics]);

  // Handle Stress Test simulation trigger
  const runStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    setStressTimeLeft(5);

    const interval = setInterval(() => {
      setStressTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsStressTesting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopyReport = () => {
    if (!healthMetrics || !currentModel || !matchedSensitivity) return;
    const text = `📊 FIXA GAMING - DEVICE HEALTH & FPS STABILITY REPORT 📊
Device: ${selectedBrand} ${selectedModelName} (${platform})
Display: ${currentModel.refreshRate}Hz • Chipset Tier: ${currentModel.chipsetTier.toUpperCase()}
Installed RAM: ${ramAmount} • Game Version: ${gameVersion}
Storage Status: ${storageStatus.toUpperCase()} • Temperature: ${tempStatus.toUpperCase()}

══════════════════════════════════════════
🎯 REAL-TIME HEALTH DIAGNOSIS:
• Health Index: ${healthMetrics.score}% (${healthMetrics.healthRating})
• Target Framerate: ${healthMetrics.targetFps} FPS
• Estimated Sustained FPS: ~${healthMetrics.estimatedAvgFps} FPS
• 1% Low Drops (Squad Fights): ~${healthMetrics.onePercentLow} FPS
• Frame Pacing Stability: ${healthMetrics.framePacingStability}%
• Thermal Throttling Margin: ${healthMetrics.throttleWindow}
══════════════════════════════════════════
🎯 MATCHED FREE FIRE SENSITIVITY (0–200 SCALE):
• Style: ${sensiStyle}
• General (Camera & Drag): ${matchedSensitivity.general} / 200
• Red Dot (Headshot Hip-fire): ${matchedSensitivity.redDot} / 200
• 2X Scope: ${matchedSensitivity.scope2x} / 200
• 4X Scope: ${matchedSensitivity.scope4x} / 200
• Sniper Scope (AWM/M82B): ${matchedSensitivity.sniper} / 200
• Free Look (Eye 360°): ${matchedSensitivity.freeLook} / 200
• Fire Button Size: ${matchedSensitivity.fireButtonSize}%
• Recommended DPI: ${matchedSensitivity.recommendedDpi}
• Compensation Engine: ${matchedSensitivity.compNote}
══════════════════════════════════════════
Recommended Action:
${
  healthMetrics.score < 55
    ? '⚠️ Use Smooth graphics, turn OFF Shadows, set High FPS, clear background apps, and play in a cool room.'
    : healthMetrics.score < 80
    ? '✅ Use Standard graphics with High FPS, disable battery saver, and close background downloads.'
    : '🔥 Device is performing at peak competitive esports stability! High/Max FPS fully unlocked.'
}
Verified by FIXA GAMING Free Fire Optimizer (WhatsApp: 0741123762 | TikTok: @fixafftop)`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleSendToAI = () => {
    if (!healthMetrics || !currentModel || !matchedSensitivity) return;
    const prompt = `My device is ${selectedBrand} ${selectedModelName} (${currentModel.refreshRate}Hz display, ${ramAmount} RAM) running ${gameVersion}. My device health score is ${healthMetrics.score}% with estimated ${healthMetrics.estimatedAvgFps} FPS. In Free Fire's 0-200 scale, my matched sensitivity is General: ${matchedSensitivity.general}, Red Dot: ${matchedSensitivity.redDot}, Fire Button: ${matchedSensitivity.fireButtonSize}%. How should I optimize my phone to lock 60/90/120 FPS and avoid drag headshot delay?`;
    if (onAskAIWithHealth) {
      onAskAIWithHealth(prompt);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#161622] via-[#0f0f16] to-[#0a0a0f] border-2 border-red-600/70 p-6 md:p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)] space-y-8 animate-fadeIn">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 relative">
            <Activity className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              <span>Real-Time Free Fire Hardware Telemetry</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black font-heading text-white">
              DEVICE HEALTH & FPS STABILITY ANALYZER
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700 shadow"
            title="Copy Report"
          >
            {copiedReport ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            onClick={runStressTest}
            disabled={isStressTesting}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isStressTesting ? `Stress Testing (${stressTimeLeft}s)...` : 'Simulate Squad Fight'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Controls (Left 6 cols) & Health Gauges (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Section (6 cols) */}
        <div className="lg:col-span-6 space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Configure Current Device Hardware & Game Version</span>
          </span>

          {/* Row 1: Platform & Brand */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => handlePlatformChange(e.target.value as Platform)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500"
              >
                <option value="Android">Android</option>
                <option value="iOS">iOS (Apple iPhone)</option>
                <option value="PC">PC / Laptop</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500"
              >
                {availableBrands.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Model Selection */}
          <div className="text-xs">
            <div className="flex justify-between items-center mb-1">
              <label className="text-zinc-300 font-semibold">Exact Model</label>
              {currentModel && (
                <span className="text-[10px] text-amber-400 font-mono">
                  {currentModel.refreshRate}Hz Display • {currentModel.chipsetTier.toUpperCase()} SOC
                </span>
              )}
            </div>
            <select
              value={selectedModelName}
              onChange={(e) => setSelectedModelName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500 truncate"
            >
              {currentBrandObj?.models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.refreshRate}Hz)
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Game Version */}
          <div className="text-xs">
            <label className="block text-zinc-300 font-semibold mb-1">Current Game Version</label>
            <select
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500"
            >
              <option value="Free Fire OB48">Garena Free Fire (OB48 Global Meta - Standard Engine)</option>
              <option value="Free Fire MAX OB48">Free Fire MAX (OB48 High-Resolution Shader Engine)</option>
              <option value="Free Fire OB47">Free Fire OB47 (Legacy)</option>
              <option value="Free Fire OB49 Advanced">Free Fire OB49 Advanced Server (Beta Engine)</option>
            </select>
          </div>

          {/* Row 4: Hardware Real-Time State (RAM, Free Storage, Battery Temp) */}
          <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Installed RAM</label>
              <select
                value={ramAmount}
                onChange={(e) => setRamAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500 text-[11px]"
              >
                <option value="2GB">2 GB</option>
                <option value="3GB">3 GB</option>
                <option value="4GB">4 GB</option>
                <option value="6GB">6 GB</option>
                <option value="8GB">8 GB</option>
                <option value="12GB">12 GB</option>
                <option value="16GB">16 GB+</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Free Storage</label>
              <select
                value={storageStatus}
                onChange={(e) => setStorageStatus(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500 text-[11px]"
              >
                <option value="optimal">&gt; 25% Free (Safe)</option>
                <option value="medium">10 - 25% (Warning)</option>
                <option value="low">&lt; 10% (Critically Low)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Device Temp</label>
              <select
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-red-500 text-[11px]"
              >
                <option value="normal">Normal (&lt; 38°C)</option>
                <option value="warm">Warm (39-42°C)</option>
                <option value="hot">Thermal Hot (&gt; 43°C)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Health Readouts & Gauges (6 cols) */}
        {healthMetrics && (
          <div className="lg:col-span-6 space-y-5">
            {/* Health Score Banner */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                  Hardware Optimization Index
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl md:text-5xl font-black font-heading ${healthMetrics.statusColor}`}>
                    {healthMetrics.score}%
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">/ 100</span>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${healthMetrics.bgBadge} ${healthMetrics.statusColor}`}>
                  {healthMetrics.healthRating}
                </div>
              </div>

              {/* Circular Gauge Representation */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#27272a"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={healthMetrics.score < 45 ? '#ef4444' : healthMetrics.score < 75 ? '#eab308' : '#10b981'}
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * healthMetrics.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Flame className={`w-6 h-6 ${healthMetrics.statusColor}`} />
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Estimated FPS</span>
                <div className="text-xl md:text-2xl font-black font-heading text-white mt-0.5">
                  ~{healthMetrics.estimatedAvgFps}{' '}
                  <span className="text-[10px] text-zinc-500 font-normal">/ {healthMetrics.targetFps}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">1% Low Drops</span>
                <div className="text-xl md:text-2xl font-black font-heading text-red-400 mt-0.5">
                  {healthMetrics.onePercentLow} <span className="text-[10px] font-normal">FPS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Frame Pacing</span>
                <div className="text-xl md:text-2xl font-black font-heading text-amber-400 mt-0.5">
                  {healthMetrics.framePacingStability}%
                </div>
              </div>
            </div>

            {/* Real-Time Frame Oscilloscope Waveform */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-500" />
                  <span>Real-Time In-Game Frame Pacing (Simulated Stress Wave)</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {fpsPoints[fpsPoints.length - 1] || healthMetrics.estimatedAvgFps} FPS Active
                </span>
              </div>

              {/* SVG Sparkline */}
              <div className="h-16 w-full relative overflow-hidden bg-black/60 rounded-lg p-1 border border-zinc-900 flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 240 60">
                  <defs>
                    <linearGradient id="fpsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {fpsPoints.length > 1 && (
                    <>
                      <polygon
                        points={`0,60 ${fpsPoints
                          .map((val, idx) => `${idx * 10},${60 - (val / healthMetrics.targetFps) * 52}`)
                          .join(' ')} 240,60`}
                        fill="url(#fpsGradient)"
                      />
                      <polyline
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        points={fpsPoints
                          .map((val, idx) => `${idx * 10},${60 - (val / healthMetrics.targetFps) * 52}`)
                          .join(' ')}
                      />
                    </>
                  )}
                </svg>
              </div>

              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                <span>0s (Spawn Island)</span>
                <span>Squad Combat Zone</span>
                <span>Final Safe Circle</span>
              </div>
            </div>

            {/* Thermal Throttling Margin Notification */}
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${healthMetrics.statusColor}`} />
              <div className="space-y-0.5">
                <span className="font-bold text-white text-[11px]">Thermal Window:</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{healthMetrics.throttleWindow}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actionable Hardware Diagnosis Recommendations */}
      {healthMetrics && (
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Tailored Optimization Verdict for {selectedBrand} {selectedModelName}</span>
            </h4>

            {onAskAIWithHealth && (
              <button
                onClick={handleSendToAI}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask FIXA AI for Full Calibration</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="font-bold text-amber-400 uppercase text-[10px]">
                Graphics Config
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {healthMetrics.score < 50
                  ? 'Switch in-game graphics strictly to SMOOTH with High FPS. Free Fire MAX shaders are overwhelming this RAM buffer.'
                  : healthMetrics.score < 75
                  ? 'STANDARD or ULTRA is optimal. Keep Shadows OFF to maintain steady 60 FPS in ranked Clash Squad.'
                  : 'MAX graphics with MAX 120 FPS supported. Toggle Vivid filter for sharper target acquisition.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="font-bold text-red-400 uppercase text-[10px]">
                RAM & Storage Tuning
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {storageStatus === 'low'
                  ? '⚠️ Free at least 5GB storage immediately! Android uses storage as ZRAM swap space during intense combat.'
                  : 'Delete unplayed event resource packs from the in-game Download Center to keep storage cache light.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-400 uppercase text-[10px]">
                Thermal Preservation
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {tempStatus === 'hot'
                  ? 'Do not fast-charge while playing. Take off thick phone case to prevent CPU from dropping to 30 FPS.'
                  : 'Maintain screen brightness at 75% to prolong peak CPU clock frequencies during 2-hour tournament sessions.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Matched Free Fire Sensitivity (0–200 Scale) Section */}
      {matchedSensitivity && currentModel && (
        <div className="pt-6 border-t border-zinc-800 space-y-5 bg-zinc-950/90 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8 rounded-b-2xl border-x-0 border-b-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Crosshair className="w-3 h-3 text-red-500" />
                <span>Matched In-Game Sensitivity • 0–200 Scale Engine</span>
              </div>
              <h4 className="text-lg md:text-xl font-black font-heading text-white">
                Free Fire Sensitivity for {selectedBrand} {selectedModelName}
              </h4>
              <p className="text-xs text-zinc-400">
                Custom-tuned for {currentModel.refreshRate}Hz display & {currentModel.chipsetTier.toUpperCase()} hardware
              </p>
            </div>

            {/* Playstyle selector for matched sensitivity */}
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              {(['One Tap', 'Drag Headshot', 'Rusher', 'Sniper'] as GamingStyle[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSensiStyle(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sensiStyle === st
                      ? 'bg-red-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Dynamic Thermal Compensation Advisory */}
          {matchedSensitivity.lagBoostGen > 0 ? (
            <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs flex items-center gap-2.5 text-amber-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>Real-Time Latency Compensation:</strong> {matchedSensitivity.compNote}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center gap-2.5 text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Optimal touch latency: calibrated strictly for {currentModel.refreshRate}Hz touch digitizer physics.
              </span>
            </div>
          )}

          {/* 6 Sensitivity Dials (0-200 Scale) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* General */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>General</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-red-500">
                {matchedSensitivity.general}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                  style={{ width: `${(matchedSensitivity.general / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* Red Dot */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>Red Dot</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-red-500">
                {matchedSensitivity.redDot}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                  style={{ width: `${(matchedSensitivity.redDot / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* 2X Scope */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>2X Scope</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-amber-400">
                {matchedSensitivity.scope2x}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                  style={{ width: `${(matchedSensitivity.scope2x / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* 4X Scope */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>4X Scope</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-amber-400">
                {matchedSensitivity.scope4x}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full"
                  style={{ width: `${(matchedSensitivity.scope4x / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* Sniper */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>Sniper</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-cyan-400">
                {matchedSensitivity.sniper}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                  style={{ width: `${(matchedSensitivity.sniper / 200) * 100}%` }}
                />
              </div>
            </div>

            {/* Free Look */}
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>Free Look</span>
                <span className="text-[10px] text-zinc-500">/200</span>
              </div>
              <div className="text-xl font-black font-heading text-slate-200">
                {matchedSensitivity.freeLook}
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-zinc-600 to-zinc-400 rounded-full"
                  style={{ width: `${(matchedSensitivity.freeLook / 200) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fire Button & DPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 font-semibold">Fire Button Size:</span>
              <span className="font-heading font-black text-white text-sm bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                {matchedSensitivity.fireButtonSize}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400 font-semibold">Recommended DPI:</span>
              <span className="font-mono font-bold text-amber-400 text-xs">
                {matchedSensitivity.recommendedDpi}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
