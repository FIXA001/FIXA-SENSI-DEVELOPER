import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  Award,
  Crosshair,
  Layers,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Flame,
  Target,
} from 'lucide-react';

export const PremiumPanelPage: React.FC = () => {
  const { isVip, user, token, openLoginModal, whatsappContact } = useAuth();
  const [panelData, setPanelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPlayer, setCopiedPlayer] = useState<string | null>(null);

  // Reticle simulator state
  const [reticleColor, setReticleColor] = useState<string>('#ef4444');
  const [reticleSize, setReticleSize] = useState<number>(14);
  const [reticleGap, setReticleGap] = useState<number>(6);
  const [reticleDot, setReticleDot] = useState<boolean>(true);

  useEffect(() => {
    if (isVip && token) {
      setIsLoading(true);
      fetch('/api/vip/premium-panel', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setPanelData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load Premium Panel:', err);
          setIsLoading(false);
        });
    }
  }, [isVip, token]);

  const copyPlayerSettings = (player: any) => {
    const text = `🔥 FIXA GAMING - PRO PLAYER PROFILE: ${player.name} (${player.region})
Device: ${player.device}
Known For: ${player.knownFor}
HUD: ${player.hud}
══════════════════════
Sensitivities:
• General: ${player.settings.general}
• Red Dot: ${player.settings.redDot}
• 2X Scope: ${player.settings.scope2x}
• 4X Scope: ${player.settings.scope4x}
• Sniper: ${player.settings.sniper}
• Free Look: ${player.settings.freeLook}
• Fire Button: ${player.settings.buttonSize}
Verified by FIXA GAMING Esports Premium Hub`;

    navigator.clipboard.writeText(text);
    setCopiedPlayer(player.name);
    setTimeout(() => setCopiedPlayer(null), 2000);
  };

  // If not logged in, show VIP locked gate
  if (!isVip) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-red-600/10 border-2 border-red-600/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
            PREMIUM
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Authorized Esports Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-wide text-white uppercase">
            PREMIUM PANEL ACCESS REQUIRED
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            The FIXA GAMING Premium Panel is an elite dashboard featuring real-world Pro Player configurations (Raistar, Ruok, White444, Nobru), tournament claw HUD blueprints, and crosshair reticle simulators.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
            Premium Panel Privileges:
          </h4>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>Pro Player In-Game Database (Exact Sensitivities & Device Specs)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>3-Finger & 4-Finger Tournament HUD schematics with button dimensions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500">⚡</span>
              <span>Interactive Custom Crosshair Overlay Calibrator</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => openLoginModal('Premium Panel')}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-5 h-5" />
            <span>Enter Premium Credentials</span>
          </button>

          <a
            href={`https://wa.me/94741123762?text=Hello%20FIXA%20GAMING,%20I%20would%20like%20to%20get%20Premium%20Panel%20access!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Request Panel Key on WhatsApp: {whatsappContact}</span>
          </a>
        </div>
      </div>
    );
  }

  // Authenticated Premium Panel
  return (
    <div className="space-y-10 py-6 pb-20 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-black border-2 border-red-500/80 shadow-[0_0_45px_rgba(220,38,38,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Premium Access Cleared • Welcome {user?.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-white uppercase">
              FIXA ESPORTS PREMIUM PANEL
            </h1>
            <p className="text-xs text-zinc-400">
              Pro Player telemetry, tournament HUD layout blueprints, and crosshair reticle simulator.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
          Tier: <strong className="text-amber-400 font-mono">FIXA PRO ESPORTS</strong>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-zinc-400 space-y-3">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-heading font-semibold">Loading Premium Player Database...</p>
        </div>
      ) : panelData ? (
        <div className="space-y-10">
          {/* Section 1: Pro Players Database */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Pro Esports Players Config Database</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Exact sensitivity configurations and HUD details used by the world's most renowned Free Fire players.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {panelData.proPlayers?.map((player: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-red-600/70 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold font-heading text-white">{player.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {player.region}
                      </span>
                    </div>

                    <div className="text-[11px] text-red-400 font-medium">{player.knownFor}</div>
                    <div className="text-[10px] text-zinc-400">Device: {player.device}</div>

                    <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800/80">
                        <span className="text-[9px] text-zinc-500 uppercase">Gen</span>
                        <div className="font-bold text-red-500">{player.settings.general}</div>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800/80">
                        <span className="text-[9px] text-zinc-500 uppercase">RedDot</span>
                        <div className="font-bold text-red-500">{player.settings.redDot}</div>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-950 border border-zinc-800/80">
                        <span className="text-[9px] text-zinc-500 uppercase">Btn</span>
                        <div className="font-bold text-amber-400">{player.settings.buttonSize}</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                      <strong>HUD:</strong> {player.hud}
                    </p>
                  </div>

                  <button
                    onClick={() => copyPlayerSettings(player)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
                  >
                    {copiedPlayer === player.name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Profile</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Tournament HUD Layouts */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Tournament HUD Layout Blueprints</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {panelData.tournamentHudLayouts?.map((hud: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                      Pro Claw Blueprint #{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-white mt-1">{hud.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{hud.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <span className="text-xs font-semibold text-slate-300">Key Finger Assignments:</span>
                    <ul className="space-y-1.5">
                      {hud.features?.map((f: string, fIdx: number) => (
                        <li key={fIdx} className="text-xs text-zinc-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Interactive Custom Crosshair Simulator */}
          <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/40">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Interactive Custom Reticle Overlay Simulator
                </h3>
                <p className="text-xs text-zinc-400">
                  Calibrate your center crosshair for instant no-scope sniper flicks and precise drag alignment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Simulator Screen */}
              <div className="md:col-span-7 relative h-64 md:h-72 rounded-2xl bg-black border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Target dummy background */}
                <div className="absolute inset-0 opacity-20 bg-cyber-grid" />
                <div className="absolute w-28 h-44 rounded-full border border-red-500/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-amber-500/40" />
                </div>

                {/* Simulated Crosshair */}
                <div className="relative flex items-center justify-center pointer-events-none">
                  {reticleDot && (
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '4px',
                        height: '4px',
                        backgroundColor: reticleColor,
                        boxShadow: `0 0 6px ${reticleColor}`,
                      }}
                    />
                  )}
                  {/* Top */}
                  <div
                    className="absolute"
                    style={{
                      width: '2px',
                      height: `${reticleSize}px`,
                      backgroundColor: reticleColor,
                      top: `-${reticleSize + reticleGap}px`,
                      boxShadow: `0 0 6px ${reticleColor}`,
                    }}
                  />
                  {/* Bottom */}
                  <div
                    className="absolute"
                    style={{
                      width: '2px',
                      height: `${reticleSize}px`,
                      backgroundColor: reticleColor,
                      bottom: `-${reticleSize + reticleGap}px`,
                      boxShadow: `0 0 6px ${reticleColor}`,
                    }}
                  />
                  {/* Left */}
                  <div
                    className="absolute"
                    style={{
                      height: '2px',
                      width: `${reticleSize}px`,
                      backgroundColor: reticleColor,
                      left: `-${reticleSize + reticleGap}px`,
                      boxShadow: `0 0 6px ${reticleColor}`,
                    }}
                  />
                  {/* Right */}
                  <div
                    className="absolute"
                    style={{
                      height: '2px',
                      width: `${reticleSize}px`,
                      backgroundColor: reticleColor,
                      right: `-${reticleSize + reticleGap}px`,
                      boxShadow: `0 0 6px ${reticleColor}`,
                    }}
                  />
                </div>

                <div className="absolute bottom-2 right-3 text-[10px] text-zinc-500 font-mono">
                  FIXA RETICLE MATRIX SIMULATOR
                </div>
              </div>

              {/* Controls */}
              <div className="md:col-span-5 space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Reticle Color</label>
                  <div className="flex gap-2">
                    {['#ef4444', '#eab308', '#10b981', '#06b6d4', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setReticleColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          reticleColor === color ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                    <span>Length</span>
                    <span className="font-mono text-red-400">{reticleSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={24}
                    value={reticleSize}
                    onChange={(e) => setReticleSize(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 font-semibold mb-1">
                    <span>Center Gap</span>
                    <span className="font-mono text-red-400">{reticleGap}px</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={16}
                    value={reticleGap}
                    onChange={(e) => setReticleGap(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="centerDot"
                    checked={reticleDot}
                    onChange={(e) => setReticleDot(e.target.checked)}
                    className="rounded accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="centerDot" className="text-zinc-300 cursor-pointer">
                    Enable Precision Center Dot
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
