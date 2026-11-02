import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FixaLogo } from './FixaLogo';
import { ExternalLink, CheckCircle2, Heart, UserPlus, ShieldCheck, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';

export const TikTokVerificationGate: React.FC = () => {
  const { isVerifiedTikTok, completeTikTokVerification, tiktokUrl, whatsappContact } = useAuth();
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  if (isVerifiedTikTok) return null;

  const handleOpenTikTok = () => {
    window.open(tiktokUrl, '_blank', 'noopener,noreferrer');
    setStep1Done(true);
    // Start a 5-second countdown to encourage visiting and following
    if (!step2Done) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setStep2Done(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleVerify = () => {
    if (!step1Done) {
      setVerificationError('Please click Step 1 to open and follow @fixafftop on TikTok first!');
      return;
    }
    setVerificationError(null);
    completeTikTokVerification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
      {/* Background Cyber Glow */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-red-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#16161c] to-[#0c0c0f] border-2 border-red-600/80 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden my-8">
        {/* Top Header Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="p-6 md:p-8">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <FixaLogo size="lg" glow={true} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Official Verification Gate
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-black font-heading tracking-wide text-white">
              VERIFY YOUR FIXA MEMBERSHIP
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-sm">
              Follow the official FIXA GAMING TikTok channel and like 3 videos to unlock full website access!
            </p>
          </div>

          {/* Legitimate TikTok Notice Box */}
          <div className="mb-6 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400">Verification Protocol:</span>
                <p className="mt-0.5 text-zinc-400 text-[11px] leading-relaxed">
                  TikTok does not provide third-party apps with private user follow/like tracking APIs without enterprise partnership. To ensure a genuine, transparent system, complete the official actions below:
                </p>
              </div>
            </div>
          </div>

          {verificationError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-600 text-xs text-red-200">
              {verificationError}
            </div>
          )}

          {/* Verification Steps */}
          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${step1Done ? 'bg-red-950/30 border-red-600/60' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${step1Done ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    {step1Done ? <CheckCircle2 className="w-5 h-5 text-white" /> : '1'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-red-400" />
                      Follow @fixafftop on TikTok
                    </h4>
                    <p className="text-xs text-zinc-400">Open our profile and hit Follow</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenTikTok}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
                >
                  <span>{step1Done ? 'Visited' : 'Open TikTok'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border transition-all ${step2Done ? 'bg-red-950/30 border-red-600/60' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${step2Done ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {step2Done ? <CheckCircle2 className="w-5 h-5 text-white" /> : '2'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" />
                    Like 3 Recent Gameplay Videos
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {countdown !== null
                      ? `Confirming action in ${countdown}s...`
                      : 'Show support on our Free Fire highlight clips'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: TikTok Username / Handle */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Your TikTok Username (Optional confirmation)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={tiktokUsername}
                  onChange={(e) => setTiktokUsername(e.target.value)}
                  placeholder="e.g. gamer_headshot99"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Complete Verification Button */}
          <div className="mt-6">
            <button
              onClick={handleVerify}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-400 text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Complete Verification & Enter FIXA GAMING</span>
            </button>
          </div>

          {/* Help link */}
          <div className="mt-4 text-center">
            <a
              href={`https://wa.me/94741123762?text=Hello%20FIXA%20GAMING,%20I%20am%20verifying%20on%20your%20website!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              Need assistance? WhatsApp Owner: {whatsappContact}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
