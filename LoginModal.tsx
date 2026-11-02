import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FixaLogo } from './FixaLogo';
import { Lock, Eye, EyeOff, ShieldAlert, KeyRound, MessageCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onSuccessNavigate?: (tab: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccessNavigate }) => {
  const { loginModalOpen, closeLoginModal, targetProtectedTab, login, whatsappContact } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      if (targetProtectedTab && onSuccessNavigate) {
        onSuccessNavigate(targetProtectedTab);
      }
    } else {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const fillQuickDemo = (role: 'vip' | 'admin') => {
    if (role === 'admin') {
      setUsername('fixaadmin');
      setPassword('fixa@2026');
    } else {
      setUsername('fixavip');
      setPassword('vipheadshot2026');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Outer Gaming Frame with Neon Red & Carbon Accents */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#141419] to-[#0a0a0d] border-2 border-red-600/70 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.35)] overflow-hidden">
        {/* Top Cyber Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-zinc-800/60 hover:bg-red-600/80 p-2 rounded-lg transition-all"
          title="Close Login Window"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <FixaLogo size="lg" glow={true} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              VIP Gaming Security Portal
            </div>
            <h2 className="mt-2 text-2xl font-bold font-heading tracking-wide text-white">
              {targetProtectedTab ? `Unlock ${targetProtectedTab}` : 'Authorized Access Only'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your FIXA GAMING credentials to access exclusive tournament sensitivities and optimization vaults.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-600/80 flex items-start gap-2.5 text-xs text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username / VIP ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your VIP username"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-bold uppercase tracking-wider rounded-xl transition-all transform active:scale-98 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enter VIP Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper for instant review */}
          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Official Passwords:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('vip')}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 text-[10px] font-mono"
              >
                Auto-fill VIP (fixavip)
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin')}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[10px] font-mono"
              >
                Auto-fill Admin
              </button>
            </div>
          </div>

          {/* WhatsApp Contact Section */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400 mb-2">
              Don't have an authorized VIP Account? Get immediate access key:
            </p>
            <a
              href={`https://wa.me/94741123762?text=Hello%20FIXA%20GAMING,%20I%20want%20to%20get%20VIP%20Access%20for%20Free%20Fire%20Sensitivity%20and%20Optimization!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {whatsappContact}</span>
            </a>
            <span className="block text-[11px] text-zinc-500 mt-1.5">
              Instant activation directly by FIXA GAMING owner
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
