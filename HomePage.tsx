import React from 'react';
import { FixaLogo } from '../components/FixaLogo';
import { useAuth } from '../context/AuthContext';
import { DailyMissionCard } from '../components/DailyMissionCard';
import { SiteStatsWidget } from '../components/SiteStatsWidget';
import { TrafficCounterHub } from '../components/TrafficCounterHub';
import { PerformanceTracker } from '../components/PerformanceTracker';
import { GamingNewsSection } from '../components/GamingNewsSection';
import { openProAimModal } from '../components/ProAimOverlay';
import {
  Flame,
  Crosshair,
  Zap,
  ShieldCheck,
  Crown,
  Sliders,
  Gauge,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Smartphone,
  Laptop,
  CheckCircle,
  Activity,
  Newspaper,
  TrendingUp,
  Trophy
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isVip, openLoginModal, whatsappContact, tiktokUrl } = useAuth();

  const handleVipClick = (target: string) => {
    if (isVip) {
      onNavigate(target);
    } else {
      openLoginModal(target);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 py-6 pb-20 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-red-600/40 bg-gradient-to-b from-[#16161f] via-[#0d0d12] to-black p-6 md:p-12 shadow-[0_0_60px_rgba(220,38,38,0.25)]">
        {/* Esports ambient lighting */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo Badge */}
          <div className="mb-4">
            <FixaLogo size="hero" glow={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>OB48 Tournament Edition • Official Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white leading-tight uppercase">
            MASTER YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-400">FREE FIRE</span> DRAG HEADSHOTS
          </h1>

          <p className="mt-4 text-sm md:text-lg text-slate-300 max-w-2xl leading-relaxed">
            The ultimate Free Fire sensitivity generator, hardware FPS tracker, and live patch intelligence suite by <strong className="text-white font-bold">FIXA GAMING</strong>. Custom calibrated for Android, iPhone, and PC emulators.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 w-full">
            <button
              onClick={() => onNavigate('Free Sensitivity')}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <Crosshair className="w-5 h-5" />
              <span>Generate Free Sensitivity</span>
            </button>

            <button
              onClick={() => handleVipClick('VIP Sensitivity')}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-heading font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(234,179,8,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Crown className="w-5 h-5 text-black" />
              <span>Unlock VIP Sensitivity</span>
            </button>

            <button
              onClick={() => openProAimModal()}
              className="px-5 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-red-500/60 hover:border-red-400 font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <Crosshair className="w-5 h-5 text-red-500" />
              <span>Pro-Aim Reticle</span>
            </button>

            <button
              onClick={() => scrollToSection('perf_section')}
              className="px-5 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-zinc-700 font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>FPS Tracker</span>
            </button>

            <button
              onClick={() => scrollToSection('news_section')}
              className="px-5 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-zinc-700 font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Newspaper className="w-5 h-5 text-red-400" />
              <span>Gaming News</span>
            </button>
          </div>

          {/* Live Visitor Counter & Site Like Widget */}
          <div className="mt-8">
            <SiteStatsWidget variant="hero" />
          </div>

          {/* Social Proof Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-zinc-800/80">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xl md:text-2xl font-black font-heading text-red-500">140+</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Device Models</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xl md:text-2xl font-black font-heading text-amber-400">120 FPS</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Max Performance</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xl md:text-2xl font-black font-heading text-red-500">OB48</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Latest Meta</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xl md:text-2xl font-black font-heading text-emerald-400">D3 & AI</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Telemetry & Grounding</div>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY MISSION CARD (Rewards users with XP & Badges for calibrations) */}
      <section>
        <DailyMissionCard
          onNavigate={onNavigate}
          onScrollToSection={scrollToSection}
        />
      </section>

      {/* LIVE TRAFFIC & SOCIAL ANALYTICS COUNTER (Web Visits, TikTok Visits, WA Joins, Likes & Live Gamers) */}
      <section id="traffic_hub">
        <TrafficCounterHub />
      </section>

      {/* Main Feature Cards Grid */}
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs font-accent">
            Comprehensive Esports Suite
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-heading text-white tracking-wide mt-1">
            EVERYTHING YOU NEED TO DOMINATE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Free Sensitivity */}
          <div
            onClick={() => onNavigate('Free Sensitivity')}
            className="group relative p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-red-600/80 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white group-hover:text-red-400 transition-colors">
                Free Sensitivity Generator
              </h3>
              <p className="mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed">
                Calculates device-specific settings for General, Red Dot, 2X, 4X, Sniper, and Fire Button size based on your exact phone model and play style. Includes Smooth Mode Tick!
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold font-heading text-red-500 uppercase tracking-wider">
              <span>Generate Now</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: VIP Sensitivity */}
          <div
            onClick={() => handleVipClick('VIP Sensitivity')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-amber-950/20 to-zinc-900/80 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(234,179,8,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px] font-bold uppercase mb-2">
                VIP Access Required
              </div>
              <h3 className="text-xl font-bold font-heading text-white group-hover:text-amber-400 transition-colors">
                VIP Sensitivity Matrix
              </h3>
              <p className="mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed">
                Secret tournament DPI formulas, zero-recoil drag multipliers, custom weapon configs, and touch acceleration calibration.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold font-heading text-amber-400 uppercase tracking-wider">
              <span>{isVip ? 'Open VIP Vault' : 'Login to Unlock'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Free & VIP Optimize */}
          <div
            onClick={() => onNavigate('Free Optimize')}
            className="group relative p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-red-600/80 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white group-hover:text-red-400 transition-colors">
                Device FPS & Lag Fix
              </h3>
              <p className="mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed">
                Step-by-step performance optimization guide. Fix stutters, eliminate 999+ ping lag spikes, and set optimal in-game graphics.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold font-heading text-red-500 uppercase tracking-wider">
              <span>Explore Guide</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Pro-Aim Visual Helper Featured Card */}
        <div
          onClick={() => openProAimModal()}
          className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#1f1014] via-[#16121f] to-[#101420] border-2 border-red-500/60 hover:border-red-400 transition-all cursor-pointer hover:shadow-[0_0_40px_rgba(220,38,38,0.35)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-amber-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] shrink-0">
                <Crosshair className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider">
                    New OB48 Feature
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                    Zero Ban Risk • 100% Visual Screen HUD
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-heading text-white mt-1 uppercase">
                  Pro-Aim Visual Reticle Helper & Drag Trainer
                </h3>
                <p className="mt-1 text-xs md:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                  Toggle high-contrast screen reticles (Shotgun Ring, Esports Cross, Sniper Center Dot) on your screen. Practice weapon-specific drag flick vectors (M1887 J-Drag, MP40 Straight Drag, Deagle One-Tap Snap) on the 2D dummy target with authentic Red Number hit crunch!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-heading font-black text-xs uppercase tracking-wider group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-1.5"
              >
                <span>Launch Helper</span>
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Premium Panel & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Premium Panel */}
          <div
            onClick={() => handleVipClick('Premium Panel')}
            className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#14141d] to-[#1c1214] border border-red-500/40 hover:border-red-500 transition-all cursor-pointer hover:shadow-[0_0_35px_rgba(220,38,38,0.3)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-red-600/20 text-red-500 border border-red-500/40">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 text-[10px] font-bold uppercase">
                  VIP Authorized
                </span>
                <h3 className="text-xl font-bold font-heading text-white">Esports Premium Panel</h3>
              </div>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              Access the Pro Player Database (Raistar, Ruok, White444, Nobru), 3-finger & 4-finger HUD layout coordinates, and custom reticle overlay calibrators.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold font-heading text-red-400 uppercase tracking-wider">
              <span>{isVip ? 'Open Premium Hub' : 'Login to Access'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Feedback & Community Reviews */}
          <div
            onClick={() => onNavigate('User Feedback')}
            className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#11161d] to-[#111116] border border-zinc-700/60 hover:border-zinc-500 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-zinc-800 text-slate-300 border border-zinc-700">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">Community Feedback & Reviews</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                      <span>★★★★★</span>
                      <span className="text-zinc-400 text-[11px]">(4.9/5 from 340+ Gamers)</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase border border-red-500/30">
                  New Reviews
                </span>
              </div>

              {/* Recent Gamer Reviews Preview */}
              <div className="space-y-2 mt-4">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="font-bold text-white">Kasun Bandara (Redmi Note 12 Pro)</span>
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                  <p className="line-clamp-2 italic text-zinc-300">
                    "The new Theme Selector is awesome! Playing with Cobra Cyan gives a real pro esports vibe. The One-Tap drag sensitivity calibrated for my phone works with 100% precision..."
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="font-bold text-white">Dineth Perera (iPhone 14 Pro Max)</span>
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                  <p className="line-clamp-2 italic text-zinc-300">
                    "Royale Gold theme and the Pro-Aim overlay are worth every second. Zero frame drops even on Ultra graphics and high FPS!"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-bold font-heading text-slate-300 uppercase tracking-wider">
              <span>View All Reviews & Submit Feedback</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-red-400" />
            </div>
          </div>
        </div>
      </section>

      {/* GAMING NEWS & PATCH INTEL (Search Grounding) */}
      <section className="pt-4 border-t border-zinc-800">
        <GamingNewsSection />
      </section>

      {/* VISUAL PERFORMANCE TRACKER (D3.js Hardware Telemetry Engine) */}
      <section className="pt-4 border-t border-zinc-800">
        <PerformanceTracker />
      </section>

      {/* FIXA GAMING Official Identity & Contact Banner */}
      <section className="p-6 md:p-8 rounded-2xl bg-zinc-900/90 border-2 border-red-600/60 shadow-[0_0_40px_rgba(220,38,38,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <FixaLogo size="lg" glow={true} />
          <div>
            <h3 className="text-xl font-black font-heading text-white">
              CONNECT WITH FIXA GAMING
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Official Free Fire Content Creator • VIP Accounts & Tournament Support
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            href={`https://wa.me/94741123762`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 hover:bg-emerald-900/60 text-emerald-300 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp: {whatsappContact}</span>
          </a>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 border border-zinc-600 transition-all"
          >
            <span>TikTok: @fixafftop</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
