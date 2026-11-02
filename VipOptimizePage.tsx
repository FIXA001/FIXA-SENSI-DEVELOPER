import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  Zap,
  Cpu,
  Smartphone,
  Laptop,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Sliders,
  Terminal,
} from 'lucide-react';

export const VipOptimizePage: React.FC = () => {
  const { isVip, user, token, openLoginModal, whatsappContact } = useAuth();
  const [optimizerData, setOptimizerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isVip && token) {
      setIsLoading(true);
      fetch('/api/vip/optimizer-vault', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOptimizerData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load VIP optimizer vault:', err);
          setIsLoading(false);
        });
    }
  }, [isVip, token]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // If not logged in, show VIP locked gate
  if (!isVip) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-red-600/10 border-2 border-red-600/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
            VIP ONLY
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Authorized Optimization Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-wide text-white uppercase">
            VIP OPTIMIZATION VAULT
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Restricted to authorized FIXA GAMING esports players. Contains system-level Android Developer engine flags, iOS touch stabilization protocols, and PC emulator 240Hz unlock configurations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
            Exclusive VIP Optimization Features:
          </h4>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>Advanced Android GPU Rendering Overrides & HW Overlay elimination</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>iOS Guided Access zero-latency touch accommodation matrix</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>BlueStacks 5 & LDPlayer 9 ASTC Hardware Texture bypass (240 FPS)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>Direct low-latency RAM cleaner commands</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => openLoginModal('VIP Optimize')}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-5 h-5" />
            <span>Enter VIP Credentials to Unlock</span>
          </button>

          <a
            href={`https://wa.me/94741123762?text=Hello%20FIXA%20GAMING,%20I%20would%20like%20to%20get%20VIP%20Optimization%20access!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp FIXA GAMING: {whatsappContact}</span>
          </a>
        </div>
      </div>
    );
  }

  // Authenticated VIP Content
  return (
    <div className="space-y-10 py-6 pb-20 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-red-950/50 via-zinc-900 to-zinc-950 border-2 border-red-600/70 shadow-[0_0_40px_rgba(220,38,38,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VIP Cleared: {user?.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-white uppercase">
              VIP PERFORMANCE OPTIMIZATION VAULT
            </h1>
            <p className="text-xs text-zinc-400">
              Low-level hardware tweaks, GPU compositor overrides, and emulator frame-rate unlocks.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
          Level: <strong className="text-red-400">Hardware Tuning Pro</strong>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-zinc-400 space-y-3">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-heading font-semibold">Decrypting VIP Optimizer Protocols...</p>
        </div>
      ) : optimizerData ? (
        <div className="space-y-8">
          {/* Section 1: Android Developer Options Deep Tweaks */}
          <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Deep Android System Developer Flags
                </h3>
                <p className="text-xs text-zinc-400">
                  Settings &gt; System &gt; Developer Options (Tap Build Number 7 times to enable)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {optimizerData.deepAndroidTweaks?.map((tweak: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-heading">{tweak.setting}</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 border border-red-600/40 text-red-300 font-mono text-[10px] font-bold">
                      {tweak.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{tweak.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: iOS Pro Tweaks */}
          <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-500/20 text-slate-200 border border-slate-500/40">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Apple iOS Touch Latency & Guided Access Optimization
                </h3>
                <p className="text-xs text-zinc-400">
                  For iPhone 6s through iPhone 16 Pro Max
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {optimizerData.iosProTweaks?.map((tweak: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-heading">{tweak.setting}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                      {tweak.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{tweak.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: PC Emulator BlueStacks & LDPlayer */}
          <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  PC Emulator Engine Optimization (BlueStacks 5 & LDPlayer 9)
                </h3>
                <p className="text-xs text-zinc-400">Unlock 120 / 240 FPS high frame rates on PC</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {optimizerData.pcEmulatorTweaks?.map((tweak: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-heading">{tweak.setting}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                      {tweak.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{tweak.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
