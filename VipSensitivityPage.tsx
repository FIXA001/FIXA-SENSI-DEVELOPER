import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FixaLogo } from '../components/FixaLogo';
import {
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  Flame,
  Crosshair,
  Zap,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const VipSensitivityPage: React.FC = () => {
  const { isVip, user, token, openLoginModal, whatsappContact } = useAuth();
  const [vaultData, setVaultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isVip && token) {
      setIsLoading(true);
      fetch('/api/vip/sensitivity-vault', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setVaultData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load VIP vault:', err);
          setIsLoading(false);
        });
    }
  }, [isVip, token]);

  const handleCopyPreset = (preset: any, idx: number) => {
    const text = `🔥 FIXA GAMING - VIP TOURNAMENT PRESET: ${preset.title}
Target Weapons: ${preset.targetGuns.join(', ')}
• General: ${preset.general}
• Red Dot: ${preset.redDot}
• 2X Scope: ${preset.scope2x}
• 4X Scope: ${preset.scope4x}
• Sniper Scope: ${preset.sniper}
• Free Look: ${preset.freeLook}
• Fire Button Size: ${preset.buttonSize}
• DPI Formula: ${preset.dpiMultiplier}
• Drag Mechanics: ${preset.dragTechnique}
• Recoil Cancellation: ${preset.recoilCompensation}
Verified by FIXA GAMING Official VIP Vault`;

    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // If not authenticated as VIP, show locked gaming gate
  if (!isVip) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(234,179,8,0.3)]">
            <Lock className="w-10 h-10 text-amber-400" />
          </div>
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
            LOCKED
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Authorized VIP Vault</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-wide text-white uppercase">
            VIP SENSITIVITY ACCESS REQUIRED
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            This exclusive section contains tournament-grade sensitivity matrixes, J-drag zero-recoil equations, and custom weapon multiplier curves reserved for FIXA GAMING VIP members.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            What is inside the VIP Sensitivity Vault:
          </h4>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>Tournament J-Drag Zero-Recoil Matrix (M1887, Woodpecker, Desert Eagle)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>Clash Squad Rusher 120Hz/144Hz Hyper-Speed configuration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>Pro AWM & Barrett Double-Sniper Instant-Swap setup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>Proprietary Display PPI to Safe DPI mathematical algorithm</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => openLoginModal('VIP Sensitivity')}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-heading font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-5 h-5 text-black" />
            <span>Enter VIP Credentials</span>
          </button>

          <a
            href={`https://wa.me/94741123762?text=Hello%20FIXA%20GAMING,%20I%20would%20like%20to%20get%20VIP%20Sensitivity%20credentials!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Contact Owner on WhatsApp: {whatsappContact}</span>
          </a>
        </div>
      </div>
    );
  }

  // Authenticated VIP Content
  return (
    <div className="space-y-10 py-6 pb-20 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-2 border-amber-500/60 shadow-[0_0_40px_rgba(234,179,8,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Active VIP Member: {user?.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-white uppercase">
              VIP SENSITIVITY VAULT
            </h1>
            <p className="text-xs text-zinc-400">
              Access granted. Secret tournament drag headshot matrixes & recoil cancellation guides.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
          Status: <strong className="text-emerald-400">Verified Esports Pass</strong>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-zinc-400 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-heading font-semibold">Decrypting VIP Sensitivity Matrix...</p>
        </div>
      ) : vaultData ? (
        <div className="space-y-8">
          {/* Secret Presets Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>Tournament-Grade Sensitivity Presets</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vaultData.secretPresets?.map((preset: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-900/90 border border-amber-500/40 p-6 flex flex-col justify-between hover:border-amber-400 transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-400 text-[10px] font-bold uppercase">
                        Guns: {preset.targetGuns.join(', ')}
                      </span>
                      <h3 className="text-lg font-bold font-heading text-white mt-1.5">
                        {preset.title}
                      </h3>
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] text-zinc-400 uppercase">General (0-200)</div>
                        <div className="text-base font-black font-heading text-red-500">
                          {preset.general}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] text-zinc-400 uppercase">Red Dot (0-200)</div>
                        <div className="text-base font-black font-heading text-red-500">
                          {preset.redDot}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] text-zinc-400 uppercase">Fire Button</div>
                        <div className="text-base font-black font-heading text-amber-400">
                          {preset.buttonSize}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                        <strong className="text-amber-400">DPI Tuning:</strong> {preset.dpiMultiplier}
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                        <strong className="text-red-400">Drag Technique:</strong>{' '}
                        {preset.dragTechnique}
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                        <strong className="text-emerald-400">Recoil Cancel:</strong>{' '}
                        {preset.recoilCompensation}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyPreset(preset, idx)}
                    className="mt-6 w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Preset Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Complete Preset</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical DPI Formula & Calibration Guide */}
          {vaultData.calibrationGuide && (
            <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Proprietary Calibration Guidelines</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    DPI Formula
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-mono">
                    {vaultData.calibrationGuide.secretDpiFormula}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                    Fire Button Positioning
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {vaultData.calibrationGuide.fireButtonPlacement}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    Touch Acceleration Boost
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {vaultData.calibrationGuide.touchSamplingBoost}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
