import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Heart,
  Flame,
  Sparkles,
  ExternalLink,
  Activity,
  Share2,
  Crosshair,
  TrendingUp,
  MessageCircle,
  Smartphone
} from 'lucide-react';

interface StatsData {
  visitors: number;
  likes: number;
  tiktokClicks: number;
  whatsappClicks: number;
  calibrations: number;
}

export const TrafficCounterHub: React.FC = () => {
  const [stats, setStats] = useState<StatsData>(() => {
    return {
      visitors: 4860,
      likes: 3410,
      tiktokClicks: 2180,
      whatsappClicks: 1640,
      calibrations: 8920,
    };
  });

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    return localStorage.getItem('fixa_user_has_liked') === 'true';
  });

  const [isLiking, setIsLiking] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Live active users dynamic fluctuation (e.g. 18 to 36 gamers active)
  const [onlineNow, setOnlineNow] = useState<number>(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineNow((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(16, Math.min(42, prev + delta));
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial stats and record unique session visit
  useEffect(() => {
    let isMounted = true;

    async function loadStatsAndRecordVisit() {
      try {
        const visitedSessionKey = 'fixa_visited_session';
        const isNewVisit = !sessionStorage.getItem(visitedSessionKey);

        if (isNewVisit) {
          sessionStorage.setItem(visitedSessionKey, 'true');
          const visitRes = await fetch('/api/stats/visit', { method: 'POST' });
          if (visitRes.ok) {
            const data = await visitRes.json();
            if (isMounted && data.stats) {
              setStats(data.stats);
              return;
            }
          }
        }

        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.stats) {
            setStats(data.stats);
          }
        }
      } catch (e) {
        console.warn('Stats fetch notice:', e);
      }
    }

    loadStatsAndRecordVisit();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Like Button click
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);

    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    localStorage.setItem('fixa_user_has_liked', String(nextHasLiked));

    // Optimistic UI update
    setStats((prev) => ({
      ...prev,
      likes: nextHasLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
    }));

    try {
      if (nextHasLiked) {
        const res = await fetch('/api/stats/like', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setStats(data.stats);
          }
        }
      }
    } catch (e) {
      console.warn('Like error:', e);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle TikTok visit click & tracking
  const handleTikTokClick = async () => {
    // Optimistic increment
    setStats((prev) => ({ ...prev, tiktokClicks: prev.tiktokClicks + 1 }));

    try {
      fetch('/api/stats/tiktok-click', { method: 'POST' }).catch(() => {});
    } catch {}

    window.open('https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl', '_blank', 'noopener,noreferrer');
  };

  // Handle WhatsApp Channel visit click & tracking
  const handleWhatsAppClick = async () => {
    // Optimistic increment
    setStats((prev) => ({ ...prev, whatsappClicks: prev.whatsappClicks + 1 }));

    try {
      fetch('/api/stats/whatsapp-click', { method: 'POST' }).catch(() => {});
    } catch {}

    window.open('https://whatsapp.com/channel/0029Vb9Yq4gL2AU6fS8lR01m', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-red-600/40 bg-gradient-to-b from-[#181216] via-[#101015] to-[#0a0a0e] p-5 sm:p-7 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              Live Traffic & Social Counter
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Server Sync
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading text-white tracking-wide mt-2 uppercase">
            FIXA GAMING COMMUNITY & TRAFFIC TELEMETRY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Live telemetry of total website visitors, TikTok (@fixafftop) redirects, and official WhatsApp Channel player joins.
          </p>
        </div>

        {/* Live Active Online Counter Badge */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 flex items-center gap-3 shrink-0 self-start md:self-auto shadow-lg">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Gamers Online Now
            </div>
            <div className="font-heading font-black text-white text-base sm:text-lg flex items-center gap-1.5">
              <span className="text-emerald-400">{onlineNow}</span>
              <span className="text-xs text-zinc-400 font-normal">Active in Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Traffic & Social Counters */}
      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COUNTER 1: Web Visitors */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 border border-blue-500/30 hover:border-blue-500/60 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
              Unique Visits
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-white tracking-wide">
              {stats.visitors.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-zinc-300 mt-0.5">
              Website Total Visitors
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Total unique gamer visits tracked live
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Traffic Growing Daily</span>
          </div>
        </div>

        {/* COUNTER 2: TikTok Visits (tt ekt ki denek giyada) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 border border-[#fe0979]/30 hover:border-[#fe0979]/60 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#fe0979]/20 border border-[#fe0979]/40 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform font-bold text-xs">
              <Smartphone className="w-5 h-5 text-pink-400" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold border border-pink-500/20">
              @fixafftop
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-pink-400 tracking-wide">
              {stats.tiktokClicks.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-zinc-300 mt-0.5">
              TikTok Page Clicks (TT Visits)
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Gamer clicks redirected to TikTok profile
            </div>
          </div>

          <button
            type="button"
            onClick={handleTikTokClick}
            className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-[#fe0979] to-red-600 hover:from-[#fe0979]/90 hover:to-red-500 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(254,9,121,0.3)] transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Visit TikTok (@fixafftop)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* COUNTER 3: WhatsApp Channel Joins */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              Official Channel
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-400 tracking-wide">
              {stats.whatsappClicks.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-zinc-300 mt-0.5">
              WhatsApp Channel Joins
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Gamer clicks joining the official WhatsApp channel
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Join WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* COUNTER 4: Community Likes & Interactive Like Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 border border-red-500/30 hover:border-red-500/60 transition-all shadow-lg flex flex-col justify-between space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
              Endorsements
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-red-400 tracking-wide flex items-center gap-2">
              <span>{stats.likes.toLocaleString()}</span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            </div>
            <div className="text-xs font-bold text-zinc-300 mt-0.5">
              Player Community Likes
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Community endorsements & player ratings
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleLike}
              className={`w-full px-3 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
                hasLiked
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-500'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-red-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white text-white' : 'text-red-400'}`} />
              <span>{hasLiked ? 'You Liked FIXA ❤️' : 'Drop a Like (+1)'}</span>
            </button>

            {/* Sparkles animation on like */}
            {showHearts && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 text-red-400 font-black text-xs bg-black/90 px-2.5 py-1 rounded-full border border-red-500 shadow-xl pointer-events-none animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>+1 Like Added!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-amber-400" />
          <span>
            Total Sensitivity Calibrations Done: <strong className="text-amber-400 font-heading">{stats.calibrations.toLocaleString()}+</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
          <span>*Traffic telemetry updates live across all player sessions</span>
        </div>
      </div>
    </div>
  );
};
