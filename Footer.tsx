import React from 'react';
import { FixaLogo } from './FixaLogo';
import { useAuth } from '../context/AuthContext';
import {
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Flame,
  Heart,
  Crown,
  Download,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDownloadModal }) => {
  const { whatsappContact, tiktokUrl, resetTikTokVerification } = useAuth();

  return (
    <footer className="w-full bg-gradient-to-t from-black via-[#09090d] to-[#0d0d14] border-t border-zinc-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <FixaLogo size="md" showText={true} glow={true} />
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              FIXA GAMING is the premier esports sensitivity research and device optimization platform for Garena Free Fire and Free Fire MAX. Calibrated for tournament competitors and passionate rank pushers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/94741123762`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-emerald-900/50"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {whatsappContact}</span>
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>TikTok: @fixafftop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Pages Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-white">
              Esports Hub
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('Home')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Free Sensitivity')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Free Sensitivity Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Free Optimize')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Free FPS & Lag Optimizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('User Feedback')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  User Feedback & Suggestions
                </button>
              </li>
            </ul>
          </div>

          {/* VIP & Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>VIP & Portals</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('VIP Sensitivity')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>VIP Sensitivity Matrix</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('VIP Optimize')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>VIP Performance Vault</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Premium Panel')}
                  className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Pro Esports Premium Panel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('Admin Dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Owner Administration
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onOpenDownloadModal ? onOpenDownloadModal() : window.open('/api/download-zip', '_blank'))}
                  className="hover:text-red-400 text-red-500 font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Website (.ZIP)</span>
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetTikTokVerification}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Re-test TikTok Verification Gate
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-zinc-900 text-center text-[11px] text-zinc-500 space-y-2">
          <p>
            © {new Date().getFullYear()} FIXA GAMING. All Rights Reserved. Official developer brand name: FIXA GAMING.
          </p>
          <p className="max-w-2xl mx-auto text-zinc-600 text-[10px]">
            Disclaimer: Garena Free Fire and Free Fire MAX are trademarks of Garena International I Private Limited. This site is independently developed by FIXA GAMING for device sensitivity analysis and device gaming performance optimization.
          </p>
        </div>
      </div>
    </footer>
  );
};
