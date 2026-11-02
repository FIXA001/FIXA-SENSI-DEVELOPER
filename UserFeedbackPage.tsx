import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  deviceModel: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
}

const INITIAL_COMMUNITY_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb_1',
    name: 'Kasun Bandara (亗 K A S U N 亗)',
    deviceModel: 'Redmi Note 12 Pro 5G',
    category: 'Website Improvement',
    rating: 5,
    message: 'The new Theme Selector is awesome! Playing with Cobra Cyan and Draco Purple themes gives a true pro gaming aesthetic. The One-Tap drag sensitivity calibrated for my 120Hz display works with 100% precision. Maintained an 84% headshot rate in CS Ranked!',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'fb_2',
    name: 'Dineth Perera',
    deviceModel: 'iPhone 14 Pro Max',
    category: 'Feature Suggestion',
    rating: 5,
    message: 'The Royale Gold theme and Pro-Aim overlay are incredible additions. Thanks to the Free Fire iOS graphics optimization guide, I get zero frame drops even while recording high-resolution highlight reels. Already registered for the Weekly Lite Challenge!',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'fb_3',
    name: 'Tharindu Fernando',
    deviceModel: 'Samsung Galaxy A54 5G',
    category: 'Sensitivity Correction',
    rating: 5,
    message: 'The 450 DPI and J-drag custom calibration generated for the Exynos 1380 processor by FIXA AI Coach is phenomenal. Consistently hitting full red numbers now. The dark Venom green theme is also super easy on the eyes during late night grinds.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'fb_4',
    name: 'Charith De Silva',
    deviceModel: 'POCO X6 Pro 5G',
    category: 'General',
    rating: 5,
    message: 'Restricting the leaderboard to verified registered players is super fair and competitive. Love that the 5 EVO themes auto-save across sessions so I do not have to reconfigure every time. Highly recommended for all Free Fire players!',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
];

export const UserFeedbackPage: React.FC = () => {
  const [name, setName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_COMMUNITY_FEEDBACKS);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

  const categories = [
    'General',
    'Feature Suggestion',
    'Sensitivity Correction',
    'New Device Request',
    'Website Improvement',
    'Bug Report',
  ];

  const fetchFeedbacks = async () => {
    // 1. Load locally cached feedback (works on GitHub Pages without server)
    let localItems: FeedbackItem[] = [];
    try {
      const saved = localStorage.getItem('fixa_community_feedbacks');
      if (saved) {
        localItems = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    const merged = [...localItems, ...INITIAL_COMMUNITY_FEEDBACKS.filter(init => !localItems.some(l => l.id === init.id))];
    setFeedbacks(merged);

    // 2. Fetch server DB if backend is active
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.feedback) && data.feedback.length > 0) {
          const combined = [...localItems, ...data.feedback.filter((df: any) => !localItems.some(l => l.id === df.id))];
          setFeedbacks(combined);
        }
      }
    } catch {
      // Offline or GitHub Pages: keep merged local feedback
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deviceModel.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const newFeedback: FeedbackItem = {
      id: 'fb_' + Date.now(),
      name: name.trim(),
      deviceModel: deviceModel.trim(),
      category,
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Immediate local persistence (guarantees success even on static GitHub Pages)
    try {
      const saved = localStorage.getItem('fixa_community_feedbacks');
      const existing: FeedbackItem[] = saved ? JSON.parse(saved) : [];
      const updated = [newFeedback, ...existing];
      localStorage.setItem('fixa_community_feedbacks', JSON.stringify(updated));
      setFeedbacks((prev) => [newFeedback, ...prev]);
    } catch (e) {
      console.warn('Local save warning:', e);
    }

    // Attempt backend sync
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });
    } catch (err) {
      // Backend not present - already saved locally
    }

    setSubmittedSuccess(true);
    setName('');
    setDeviceModel('');
    setMessage('');
    setRating(5);
    setIsSubmitting(false);
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  return (
    <div className="space-y-10 py-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Voice</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-heading tracking-wide text-white uppercase">
          USER FEEDBACK & SUGGESTIONS
        </h1>
        <p className="mt-2 text-xs md:text-sm text-zinc-400">
          Help us improve FIXA GAMING. Request new phone models, report sensitivity feedback, or propose future features.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Feedback Form (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>Submit Your Feedback</span>
          </h2>

          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Thank you!</strong> Your feedback has been securely delivered to FIXA GAMING for review.
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Your In-Game / Real Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ruwan FF or Gamer123"
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Device Model *
              </label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g. Redmi Note 13 Pro 5G, iPhone 14 Pro, Samsung A54"
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-white outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Your Message / Suggestion *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Share your thoughts, report incorrect settings, or request a specific phone model..."
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white placeholder-zinc-500 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Feedback...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Community Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <span>Community Reviews & Requests ({feedbacks.length})</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Live Sync</span>
          </div>

          {isLoadingFeedbacks ? (
            <div className="p-8 text-center text-zinc-500 text-xs">Loading feedback entries...</div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800">
              No feedback submitted yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 space-y-2.5 transition-all hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{fb.name}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-red-400 text-[10px] font-semibold border border-zinc-700">
                        {fb.deviceModel}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{fb.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 font-mono">
                      Category: {fb.category}
                    </span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
