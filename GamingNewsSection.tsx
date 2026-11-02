import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Flame,
  Trophy,
  Crosshair,
  ExternalLink,
  RotateCw,
  Sparkles,
  Search,
  CheckCircle,
  Calendar,
  Tag,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  category: 'Update' | 'Esports' | 'Weapon Balance' | 'Event';
  summary: string;
  date: string;
  highlights: string[];
  metaTip: string;
  sources?: { title: string; url: string }[];
}

export interface GamingNewsData {
  lastUpdated: string;
  summary: string;
  news: NewsItem[];
  groundingQueries?: string[];
  sources?: { title: string; url: string }[];
  isLiveGrounding: boolean;
  fromCache?: boolean;
}

interface GamingNewsSectionProps {
  onNewsRead?: () => void;
}

export const GamingNewsSection: React.FC<GamingNewsSectionProps> = ({ onNewsRead }) => {
  const [data, setData] = useState<GamingNewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchNews = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const url = forceRefresh ? '/api/gaming-news/refresh' : '/api/gaming-news';
      const method = forceRefresh ? 'POST' : 'GET';

      const res = await fetch(url, { method });
      if (!res.ok) throw new Error('Failed to retrieve news feed');

      const json: GamingNewsData = await res.json();
      setData(json);

      // Auto expand first news item
      if (json.news && json.news.length > 0 && !expandedId) {
        setExpandedId(json.news[0].id);
      }
    } catch (err: any) {
      console.warn('Notice loading news feed:', err?.message || err);
      setError('Unable to load live gaming news at the moment.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(false);
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
    if (onNewsRead) onNewsRead();
  };

  const filteredNews = data?.news?.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  }) || [];

  return (
    <div id="news_section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Gemini Search Grounding
            </span>
            {data?.isLiveGrounding ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Web Verified
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                FIXA Verified Intel
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-heading text-white tracking-wide mt-2 uppercase">
            FREE FIRE GAMING NEWS & PATCH INTEL
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1">
            Real-time updates on OB48 / OB49 weapon balancing, Gloo Wall meta tweaks, and Free Fire World Series (FFWS) tournament schedules.
          </p>
        </div>

        {/* Refresh & Last Updated */}
        <div className="flex items-center gap-3">
          {data?.lastUpdated && (
            <div className="text-right hidden sm:block text-[11px] text-zinc-400">
              <div>Last Synced:</div>
              <strong className="text-zinc-200">{data.lastUpdated}</strong>
            </div>
          )}

          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing || loading}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-red-500' : ''}`} />
            <span>{refreshing ? 'Scanning Web...' : 'Refresh Intel'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Update', 'Esports', 'Weapon Balance', 'Event'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {cat === 'All' && '🔥 All Intel'}
            {cat === 'Update' && '⚡ OB Patch Notes'}
            {cat === 'Esports' && '🏆 FFWS & Esports'}
            {cat === 'Weapon Balance' && '🎯 Weapon Meta'}
            {cat === 'Event' && '🚀 Performance Events'}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse space-y-3"
            >
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-800 rounded w-4/5" />
              <div className="h-12 bg-zinc-800 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchNews(false)}
            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {/* News Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={`group relative p-5 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isExpanded
                    ? 'bg-zinc-900/95 border-red-500/70 shadow-[0_0_30px_rgba(220,38,38,0.25)]'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
                }`}
              >
                <div>
                  {/* Category Pill and Date */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        item.category === 'Update'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : item.category === 'Esports'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : item.category === 'Weapon Balance'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {item.category}
                    </span>

                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold font-heading text-white group-hover:text-red-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Expanded Content: Key Highlights & Meta Tip */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3.5 animate-fadeIn">
                      <div>
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          Key Patch Highlights:
                        </div>
                        <ul className="space-y-1.5">
                          {item.highlights.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* FIXA Pro Tip Box */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-red-950/20 to-zinc-900 border border-amber-500/30 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold font-heading uppercase text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>FIXA Meta Recommendation</span>
                        </div>
                        <p className="mt-1 text-zinc-200 text-xs">{item.metaTip}</p>
                      </div>

                      {/* Sources */}
                      {item.sources && item.sources.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                            Citations:
                          </span>
                          {item.sources.map((s, sIdx) => (
                            <a
                              key={sIdx}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 underline"
                            >
                              <span>{s.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Toggle */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-zinc-400 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {isExpanded ? 'Collapse Intel' : 'Expand Details & Meta Tips'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-red-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search Grounding Transparency Footer */}
      {data?.groundingQueries && data.groundingQueries.length > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Search className="w-4 h-4 text-red-500" />
            <span>Search grounding queries:</span>
            <div className="flex flex-wrap gap-1.5">
              {data.groundingQueries.map((q, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                >
                  "{q}"
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500">
            Grounding powered by Google Search via Gemini 3.8 Flash
          </div>
        </div>
      )}
    </div>
  );
};
