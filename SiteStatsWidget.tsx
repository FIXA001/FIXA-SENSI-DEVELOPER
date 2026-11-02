import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Flame,
  Sparkles,
  Eye,
  Smartphone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface SiteStatsWidgetProps {
  variant?: 'compact' | 'full' | 'hero';
}

export const SiteStatsWidget: React.FC<SiteStatsWidgetProps> = ({ variant = 'full' }) => {
  const [visitors, setVisitors] = useState<number>(() => {
    const saved = localStorage.getItem('fixa_cached_visitors');
    return saved ? parseInt(saved, 10) : 4860;
  });

  const [likes, setLikes] = useState<number>(() => {
    const saved = localStorage.getItem('fixa_cached_likes');
    return saved ? parseInt(saved, 10) : 3410;
  });

  const [tiktokClicks, setTiktokClicks] = useState<number>(() => {
    const saved = localStorage.getItem('fixa_cached_tt');
    return saved ? parseInt(saved, 10) : 2180;
  });

  const [whatsappClicks, setWhatsappClicks] = useState<number>(() => {
    const saved = localStorage.getItem('fixa_cached_wa');
    return saved ? parseInt(saved, 10) : 1640;
  });

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    return localStorage.getItem('fixa_user_has_liked') === 'true';
  });

  const [isLiking, setIsLiking] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Fetch initial stats and record unique visit
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
              setVisitors(data.stats.visitors);
              setLikes(data.stats.likes);
              if (data.stats.tiktokClicks) setTiktokClicks(data.stats.tiktokClicks);
              if (data.stats.whatsappClicks) setWhatsappClicks(data.stats.whatsappClicks);
              localStorage.setItem('fixa_cached_visitors', String(data.stats.visitors));
              localStorage.setItem('fixa_cached_likes', String(data.stats.likes));
              return;
            }
          }
        }

        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.stats) {
            setVisitors(data.stats.visitors);
            setLikes(data.stats.likes);
            if (data.stats.tiktokClicks) setTiktokClicks(data.stats.tiktokClicks);
            if (data.stats.whatsappClicks) setWhatsappClicks(data.stats.whatsappClicks);
            localStorage.setItem('fixa_cached_visitors', String(data.stats.visitors));
            localStorage.setItem('fixa_cached_likes', String(data.stats.likes));
          }
        }
      } catch (err) {
        console.warn('Stats fetch notice:', err);
      }
    }

    loadStatsAndRecordVisit();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);

    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    localStorage.setItem('fixa_user_has_liked', String(nextHasLiked));

    // Optimistic UI update
    setLikes((prev) => (nextHasLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (nextHasLiked) {
        const res = await fetch('/api/stats/like', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setLikes(data.stats.likes);
            localStorage.setItem('fixa_cached_likes', String(data.stats.likes));
          }
        }
      }
    } catch (err) {
      console.warn('Like notice:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleTikTokClick = () => {
    setTiktokClicks((prev) => prev + 1);
    fetch('/api/stats/tiktok-click', { method: 'POST' }).catch(() => {});
    window.open('https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl', '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppClick = () => {
    setWhatsappClicks((prev) => prev + 1);
    fetch('/api/stats/whatsapp-click', { method: 'POST' }).catch(() => {});
    window.open('https://whatsapp.com/channel/0029Vb9Yq4gL2AU6fS8lR01m', '_blank', 'noopener,noreferrer');
  };

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {/* Visitor Counter */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-700/70 shadow-lg backdrop-blur-md">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Eye className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-900" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Site Visitors
            </div>
            <div className="font-heading font-black text-white text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
              <span>{visitors.toLocaleString()}</span>
              <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/20 px-1 py-0.2 rounded-full">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* TikTok Traffic Counter & Direct Click */}
        <button
          type="button"
          onClick={handleTikTokClick}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-pink-500/40 hover:border-pink-500/80 shadow-lg backdrop-blur-md transition-all cursor-pointer group"
          title="Gamers who visited @fixafftop TikTok"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#fe0979]/20 text-pink-400 border border-pink-500/30 group-hover:scale-105 transition-transform">
            <Smartphone className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <span>TikTok Visits</span>
              <ExternalLink className="w-2.5 h-2.5 text-pink-400" />
            </div>
            <div className="font-heading font-black text-pink-400 text-xs sm:text-sm tracking-wide">
              {tiktokClicks.toLocaleString()}+
            </div>
          </div>
        </button>

        {/* WhatsApp Channel Traffic Counter */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-emerald-500/40 hover:border-emerald-500/80 shadow-lg backdrop-blur-md transition-all cursor-pointer group"
          title="Gamers who joined official WhatsApp channel"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <span>WA Channel</span>
              <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <div className="font-heading font-black text-emerald-400 text-xs sm:text-sm tracking-wide">
              {whatsappClicks.toLocaleString()}+
            </div>
          </div>
        </button>

        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className={`relative group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg backdrop-blur-md ${
            hasLiked
              ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 border-red-500/80 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : 'bg-zinc-900/80 border-zinc-700/70 text-zinc-300 hover:border-red-500/50 hover:text-white'
          }`}
          title={hasLiked ? 'You liked FIXA GAMING!' : 'Click to like this website'}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
              hasLiked
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-500/20'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                hasLiked ? 'fill-white text-white' : ''
              }`}
            />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <span>Site Likes</span>
              {hasLiked && <span className="text-red-400 font-bold">• Liked</span>}
            </div>
            <div className="font-heading font-black text-white text-xs sm:text-sm tracking-wide flex items-center gap-1">
              <span>{likes.toLocaleString()}</span>
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
            </div>
          </div>

          {/* Floating Hearts Animation */}
          {showHearts && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-red-500 pointer-events-none animate-bounce text-xs font-black bg-black/80 px-2 py-0.5 rounded-full border border-red-500">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>+1 Like!</span>
            </div>
          )}
        </button>
      </div>
    );
  }

  // Full / Leaderboard banner layout
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-600/30 bg-gradient-to-r from-[#171217] via-[#101015] to-[#0d0d12] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <span>FIXA Community Activity & Traffic</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xs text-zinc-300 mt-0.5">
            Join thousands of Free Fire players calibrating sensitivities daily
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
        {/* Visitors badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-heading font-black text-white">{visitors.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-400 uppercase">Visits</span>
        </div>

        {/* TikTok Visits badge & click */}
        <button
          type="button"
          onClick={handleTikTokClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-pink-500/40 text-pink-400 text-xs font-bold transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="font-heading font-black">{tiktokClicks.toLocaleString()}</span>
          <span className="text-[10px] uppercase text-zinc-400">TT Visits</span>
        </button>

        {/* WhatsApp Channel badge & click */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="font-heading font-black">{whatsappClicks.toLocaleString()}</span>
          <span className="text-[10px] uppercase text-zinc-400">WA Joins</span>
        </button>

        {/* Like button */}
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
            hasLiked
              ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white text-white' : 'text-red-400'}`} />
          <span className="font-heading font-black">{likes.toLocaleString()}</span>
          <span className="text-[10px] uppercase">{hasLiked ? 'Liked' : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};
