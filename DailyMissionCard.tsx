import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  Trophy,
  Sparkles,
  ChevronRight,
  Zap,
  Target,
  Gauge,
  Newspaper,
  RotateCcw,
  Crown,
  Medal,
  Users,
  Smartphone,
  Calendar,
  Clock,
  Shield,
  Edit2,
  Check,
  Gift
} from 'lucide-react';
import { openProAimModal } from './ProAimOverlay';
import { SiteStatsWidget } from './SiteStatsWidget';
import { XPChallengeRegisterModal } from './XPChallengeRegisterModal';

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  iconName: 'crosshair' | 'zap' | 'newspaper' | 'gauge' | 'check';
  targetAction?: string;
  completed: boolean;
  claimed: boolean;
}

export interface UserProgress {
  points: number;
  seasonMonth: string; // YYYY-MM
  playerName: string;
  playerDevice: string;
  streak: number;
  lastLoginDate: string;
  unlockedBadgeId: string;
  completedMissions: Record<string, boolean>; // missionId -> claimed
  isRegistered?: boolean;
  registeredUid?: string;
  registeredPhone?: string;
}

export interface BadgeTier {
  id: string;
  name: string;
  minPoints: number;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  title: string;
}

export interface LeaderboardPlayer {
  id: string;
  name: string;
  xp: number;
  badge: string;
  device: string;
  avatar: string;
  updatedAt?: string;
  isRegistered?: boolean;
  uid?: string;
}

// XP Gaps expanded & balanced up to 15,000 season cap
export const BADGE_TIERS: BadgeTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Calibrator',
    minPoints: 0,
    icon: '🥉',
    color: 'text-amber-600',
    borderColor: 'border-amber-600/40',
    bgGradient: 'from-amber-950/30 to-zinc-900',
    title: 'Recruit Sensi Tuner'
  },
  {
    id: 'silver',
    name: 'Silver Drag Master',
    minPoints: 250,
    icon: '🥈',
    color: 'text-slate-300',
    borderColor: 'border-slate-400/40',
    bgGradient: 'from-slate-800/40 to-zinc-900',
    title: 'Rapid Flick Specialist'
  },
  {
    id: 'gold',
    name: 'Gold One-Tap Legend',
    minPoints: 800,
    icon: '🥇',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    bgGradient: 'from-yellow-950/40 to-zinc-900',
    title: 'Red Number Maestro'
  },
  {
    id: 'diamond',
    name: 'Diamond Zero-Recoil God',
    minPoints: 2000,
    icon: '💎',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    bgGradient: 'from-cyan-950/40 to-zinc-900',
    title: 'Precision Aim Hacker'
  },
  {
    id: 'champion',
    name: 'FIXA Esports Champion',
    minPoints: 5000,
    icon: '👑',
    color: 'text-red-500',
    borderColor: 'border-red-500/70',
    bgGradient: 'from-red-950/50 to-zinc-900',
    title: 'Grandmaster Dominator'
  },
  {
    id: 'weekly_elite',
    name: 'Weekly Lite Contender',
    minPoints: 15000,
    icon: '⚡',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/70',
    bgGradient: 'from-purple-950/50 to-zinc-900',
    title: 'Grand Prize Target (Max 15k XP)'
  }
];

// Rebalanced, lower XP rewards per mission to make rankings challenging & competitive
const INITIAL_MISSIONS: Omit<Mission, 'completed' | 'claimed'>[] = [
  {
    id: 'mission_checkin',
    title: 'Daily FIXA Check-in',
    description: 'Claim your daily attendance reward and maintain your streak.',
    points: 5,
    iconName: 'check'
  },
  {
    id: 'mission_sensi',
    title: 'Calibrate Phone Sensitivity',
    description: 'Generate or fine-tune custom sensitivities for your device model.',
    points: 10,
    iconName: 'crosshair',
    targetAction: 'Free Sensitivity'
  },
  {
    id: 'mission_flick',
    title: 'Test Drag Flick Velocity',
    description: 'Practice weapon drag flick vectors in the Pro-Aim arena.',
    points: 8,
    iconName: 'zap',
    targetAction: 'pro_aim_modal'
  },
  {
    id: 'mission_news',
    title: 'Inspect OB48 Patch & Meta',
    description: 'Read the latest weapon adjustments and tournament news.',
    points: 6,
    iconName: 'newspaper',
    targetAction: 'news_section'
  },
  {
    id: 'mission_fps',
    title: 'Log FPS Improvement Benchmark',
    description: 'Track frame rate stability before and after applying FIXA configs.',
    points: 10,
    iconName: 'gauge',
    targetAction: 'perf_section'
  }
];

const STORAGE_KEY = 'fixa_daily_missions_v3';

interface DailyMissionCardProps {
  onNavigate?: (page: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const DailyMissionCard: React.FC<DailyMissionCardProps> = ({
  onNavigate,
  onScrollToSection
}) => {
  const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-03"

  const [activeTab, setActiveTab] = useState<'missions' | 'leaderboard'>('missions');
  const [claimCelebration, setClaimCelebration] = useState<string | null>(null);

  // Player progress state with monthly season checking
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserProgress = JSON.parse(saved);
        // Automatic monthly XP reset if month changed
        if (parsed.seasonMonth !== currentMonthKey) {
          return {
            points: 25, // Soft reset to begin fresh monthly race
            seasonMonth: currentMonthKey,
            playerName: parsed.playerName || 'FF_Player_' + Math.floor(100 + Math.random() * 900),
            playerDevice: parsed.playerDevice || 'Android Gaming',
            streak: 1,
            lastLoginDate: new Date().toISOString().split('T')[0],
            unlockedBadgeId: 'bronze',
            completedMissions: { mission_checkin: true },
            isRegistered: parsed.isRegistered || false,
            registeredUid: parsed.registeredUid || '',
            registeredPhone: parsed.registeredPhone || ''
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      points: 75,
      seasonMonth: currentMonthKey,
      playerName: 'FF_Gamer_' + Math.floor(100 + Math.random() * 900),
      playerDevice: 'Android Phone',
      streak: 3,
      lastLoginDate: new Date().toISOString().split('T')[0],
      unlockedBadgeId: 'bronze',
      completedMissions: {
        mission_checkin: true
      },
      isRegistered: false
    };
  });

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.playerName);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [lastMonthWinner, setLastMonthWinner] = useState<{
    name: string;
    xp: number;
    reward: string;
    month: string;
  } | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(1);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Monthly countdown timer
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Registration modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Handle contestant registered callback
  const handleContestantRegistered = (data: {
    gameName: string;
    uid: string;
    email: string;
    phoneNumber: string;
    device: string;
    xp: number;
    badge: string;
  }) => {
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        playerName: data.gameName,
        playerDevice: data.device,
        points: Math.max(prev.points, data.xp),
        isRegistered: true,
        registeredUid: data.uid,
        registeredPhone: data.phoneNumber
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage error:', e);
      }
      return updated;
    });

    setTempName(data.gameName);
    fetchLeaderboard();
    setActiveTab('leaderboard');
    setClaimCelebration('🏆 ලියාපදිංචිය සාර්ථකයි! ඔබ දැන් FIXA Leaderboard එකේ සජීවීව පෙන්වයි.');
    setTimeout(() => setClaimCelebration(null), 6000);
  };

  // Calculate time remaining in the current month
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = Math.max(0, endOfMonth.getTime() - now.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch server leaderboard
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
        if (data.season?.lastMonthWinner) {
          setLastMonthWinner(data.season.lastMonthWinner);
        }
        if (data.totalPlayers !== undefined) {
          setTotalPlayers(data.totalPlayers);
        }
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Sync to server leaderboard whenever player points or name change (ONLY IF REGISTERED!)
  const syncScoreToServer = async (name: string, pts: number) => {
    if (!progress.isRegistered) {
      // Unregistered guest: keep progress locally only
      return;
    }
    try {
      await fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          xp: pts,
          device: progress.playerDevice || 'Android Mobile',
          avatar: '⚡',
          uid: progress.registeredUid
        })
      });
      fetchLeaderboard();
    } catch (err) {
      console.error('Score sync error:', err);
    }
  };

  // Sync local state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  // Determine current badge
  const currentBadge = [...BADGE_TIERS]
    .reverse()
    .find((b) => progress.points >= b.minPoints) || BADGE_TIERS[0];

  // Determine next badge
  const nextBadge = BADGE_TIERS.find((b) => b.minPoints > progress.points);
  const currentLevelMin = currentBadge.minPoints;
  const nextLevelMin = nextBadge ? nextBadge.minPoints : 15000;
  const progressPercent = nextBadge
    ? Math.min(100, Math.max(0, ((progress.points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100))
    : 100;

  const handleClaim = (missionId: string, pts: number) => {
    if (progress.completedMissions[missionId]) return;

    setClaimCelebration(missionId);
    setTimeout(() => setClaimCelebration(null), 2500);

    const newPoints = Math.min(15000, progress.points + pts);
    const newCompleted = { ...progress.completedMissions, [missionId]: true };

    const newBadge = [...BADGE_TIERS]
      .reverse()
      .find((b) => newPoints >= b.minPoints) || BADGE_TIERS[0];

    setProgress((prev) => ({
      ...prev,
      points: newPoints,
      unlockedBadgeId: newBadge.id,
      completedMissions: newCompleted
    }));

    syncScoreToServer(progress.playerName, newPoints);
  };

  const handleSaveName = () => {
    const trimmed = tempName.trim() || 'FF_Player';
    setIsEditingName(false);
    setProgress((prev) => ({ ...prev, playerName: trimmed }));
    syncScoreToServer(trimmed, progress.points);
  };

  const handleActionClick = (target?: string) => {
    if (!target) return;
    if (target === 'pro_aim_modal') {
      openProAimModal();
    } else if (target === 'news_section' || target === 'perf_section') {
      if (onScrollToSection) {
        onScrollToSection(target);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (onNavigate) {
      onNavigate(target);
    }
  };

  const missions: Mission[] = INITIAL_MISSIONS.map((m) => ({
    ...m,
    completed: !!progress.completedMissions[m.id],
    claimed: !!progress.completedMissions[m.id]
  }));

  const completedCount = missions.filter((m) => m.claimed).length;

  // Server leaderboard contains ONLY verified registered players
  // Current user is included on the leaderboard ONLY IF they are registered!
  const displayLeaderboard = [...leaderboard];
  if (progress.isRegistered) {
    const userInLeaderboard = displayLeaderboard.find(
      (p) => (progress.registeredUid && p.uid === progress.registeredUid) || p.name.toLowerCase() === progress.playerName.toLowerCase()
    );
    if (!userInLeaderboard) {
      displayLeaderboard.push({
        id: progress.registeredUid || 'current_user',
        name: progress.playerName + ' (You)',
        xp: progress.points,
        badge: currentBadge.name,
        device: progress.playerDevice,
        avatar: '👑',
        isRegistered: true,
        uid: progress.registeredUid
      });
    }
  }
  displayLeaderboard.sort((a, b) => b.xp - a.xp);

  // User rank in leaderboard (only if registered)
  const userRank = progress.isRegistered
    ? displayLeaderboard.findIndex(
        (p) => (progress.registeredUid && p.uid === progress.registeredUid) || p.name.toLowerCase() === progress.playerName.toLowerCase() || p.id === 'current_user'
      ) + 1
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-red-600/40 bg-gradient-to-b from-[#181216] via-[#101015] to-[#0a0a0e] p-6 md:p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title, Streak, and Nickname */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[11px] font-black uppercase tracking-wider">
                Monthly Championship Season
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {progress.streak} Day Streak!
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-yellow-300" />
                Win Weekly Lite!
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black font-heading text-white tracking-wide mt-1 uppercase">
              FIXA XP CARDS & LEADERBOARD
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Collect XP cards through daily calibrations. The #1 player at the end of the month wins a Free Fire Weekly Lite Membership!
            </p>
          </div>
        </div>

        {/* Current Tier Badge & Player IGN Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-inner">
          <div className="text-3xl animate-bounce">{currentBadge.icon}</div>
          <div className="min-w-[130px]">
            {/* Player Name with inline editing */}
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={20}
                  className="bg-black border border-red-500 text-white text-xs px-2 py-0.5 rounded outline-none w-28"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <span className="text-xs font-black text-white hover:text-red-400 transition-colors truncate max-w-[120px]">
                  {progress.playerName}
                </span>
                <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-red-400 transition-colors" />
              </div>
            )}

            <div className={`text-xs md:text-sm font-black font-heading ${currentBadge.color}`}>
              {currentBadge.name}
            </div>
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span>{progress.points} XP</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                progress.isRegistered 
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-500/30' 
                  : 'text-zinc-400 bg-zinc-800'
              }`}>
                {progress.isRegistered ? `Rank #${userRank}` : 'Unregistered'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to Next Tier & Season Target */}
      <div className="relative z-10 mt-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 font-medium text-zinc-300">
            <span>Season XP Progress</span>
            <span className="text-red-400 font-bold">
              {progress.points} / 15,000 XP Target
            </span>
          </div>
          {nextBadge ? (
            <div className="text-zinc-400 text-right">
              <span className="text-white font-bold">{nextBadge.minPoints - progress.points} XP</span> to{' '}
              <span className={nextBadge.color}>{nextBadge.name}</span> {nextBadge.icon}
            </div>
          ) : (
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 15k Target Milestone Achieved!
            </span>
          )}
        </div>
        <div className="relative w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 transition-all duration-700 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            style={{ width: `${Math.min(100, (progress.points / 15000) * 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Season Month: <strong className="text-white">{progress.seasonMonth}</strong></span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Season Ends in {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
          </span>
        </div>
      </div>

      {/* Tab Switcher: Daily Missions vs Live Leaderboard */}
      <div className="relative z-10 mt-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('missions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'missions'
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Daily XP Missions ({completedCount}/{missions.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('leaderboard');
            fetchLeaderboard();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 Top XP Leaderboard</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsRegisterModalOpen(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Register for Giveaway</span>
        </button>
      </div>

      {/* TAB 1: MISSIONS */}
      {activeTab === 'missions' && (
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fadeIn">
          {missions.map((mission) => {
            const isCelebrated = claimCelebration === mission.id;
            return (
              <div
                key={mission.id}
                className={`group relative p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 border ${
                  mission.claimed
                    ? 'bg-zinc-900/40 border-emerald-500/30 text-zinc-400'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800/80 text-white shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      mission.claimed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-600/20 text-red-400 border border-red-500/30 group-hover:bg-red-600/30'
                    }`}
                  >
                    {mission.iconName === 'crosshair' && <Target className="w-5 h-5" />}
                    {mission.iconName === 'zap' && <Zap className="w-5 h-5" />}
                    {mission.iconName === 'newspaper' && <Newspaper className="w-5 h-5" />}
                    {mission.iconName === 'gauge' && <Gauge className="w-5 h-5" />}
                    {mission.iconName === 'check' && <Award className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold font-heading truncate ${
                          mission.claimed ? 'line-through text-zinc-500' : 'text-white'
                        }`}
                      >
                        {mission.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black">
                        +{mission.points} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{mission.description}</p>
                  </div>
                </div>

                {/* Action / Claim Button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {mission.claimed ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Claimed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {mission.targetAction && (
                        <button
                          onClick={() => handleActionClick(mission.targetAction)}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Go to mission action"
                        >
                          <span>Go</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleClaim(mission.id, mission.points)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Claim</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sparkle explosion on claim */}
                {isCelebrated && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/30 via-red-600/30 to-yellow-400/30 border-2 border-yellow-400 pointer-events-none animate-pulse flex items-center justify-center">
                    <div className="text-white font-black font-heading text-sm uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_10px_rgba(234,179,8,1)]">
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                      +{mission.points} XP COLLECTED!
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: LIVE LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="relative z-10 mt-6 space-y-4 animate-fadeIn">
          {/* Hall of Fame / Last Month Champion if available */}
          {lastMonthWinner && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-zinc-900 border border-yellow-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  👑
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Last Month Season Champion</span>
                  </div>
                  <div className="text-base font-black font-heading text-white">
                    {lastMonthWinner.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Finished with <strong className="text-yellow-400">{lastMonthWinner.xp.toLocaleString()} XP</strong> • Claimed: {lastMonthWinner.reward}
                  </div>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                🏆 Hall of Fame
              </div>
            </div>
          )}

          {/* Notice for Unregistered Users */}
          {!progress.isRegistered && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-amber-950/40 border border-red-500/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center text-xl shrink-0">
                  ⚠️
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>You are not registered on the Leaderboard yet!</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 text-red-300 uppercase font-black">
                      Not Registered
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Only verified players appear on the active leaderboard. Complete TikTok verification to register & compete for the Free Fire Weekly Lite Membership!
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    සිංහල: TikTok verification සම්පූර්ණ කර register වී Free Fire Weekly Lite Membership එක දිනාගන්න!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-heading font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.4)] shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                <span>Register Now</span>
              </button>
            </div>
          )}

          {/* Current Active Leaderboard List */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <div className="flex items-center gap-3">
                <span className="w-8 text-center">Rank</span>
                <span>Verified Contestant ({displayLeaderboard.length})</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="hidden sm:inline">Device</span>
                <span>XP Cards</span>
              </div>
            </div>

            {displayLeaderboard.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <h4 className="text-base font-bold text-white">No Registered Contestants Yet</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto mt-1">
                  The leaderboard only features verified contestants who completed TikTok registration. Be the first player to register & claim the #1 spot for the Free Fire Weekly Lite Membership!
                </p>
                <p className="text-[11px] text-zinc-400 max-w-md mx-auto mt-1">
                  (සිංහල: තවමත් ලියාපදිංචි ක්‍රීඩකයින් නැත. මුලින්ම register වී #1 ස්ථානය දිනාගන්න!)
                </p>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:from-yellow-400 shadow-lg cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Register Now to Be #1</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60 max-h-[420px] overflow-y-auto">
                {displayLeaderboard.map((player, idx) => {
                  const rank = idx + 1;
                  const isUser = player.name.includes('(You)') || player.name.toLowerCase() === progress.playerName.toLowerCase();

                  let rankBadge = (
                    <span className="w-8 h-8 rounded-xl bg-zinc-900 text-zinc-400 flex items-center justify-center font-black text-xs border border-zinc-800">
                      #{rank}
                    </span>
                  );
                  if (rank === 1) {
                    rankBadge = (
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-black flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                        🥇
                      </span>
                    );
                  } else if (rank === 2) {
                    rankBadge = (
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-black flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(203,213,225,0.4)]">
                        🥈
                      </span>
                    );
                  } else if (rank === 3) {
                    rankBadge = (
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(217,119,6,0.4)]">
                        🥉
                      </span>
                    );
                  }

                  return (
                    <div
                      key={player.id || idx}
                      className={`p-3.5 flex items-center justify-between transition-colors ${
                        isUser
                          ? 'bg-red-950/40 border-l-4 border-l-red-500 font-bold'
                          : 'hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {rankBadge}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-heading text-white truncate max-w-[150px] sm:max-w-[220px]">
                              {player.name}
                            </span>
                            {isUser && (
                              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                                You
                              </span>
                            )}
                            {player.isRegistered && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            )}
                            {rank === 1 && (
                              <span className="px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-bold border border-yellow-500/30">
                                Leading 👑
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                            <span className="text-red-400">{player.badge}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 text-right">
                        <div className="hidden sm:block text-[11px] text-zinc-400">
                          {player.device}
                        </div>
                        <div className="text-right">
                          <div className="text-sm md:text-base font-black font-heading text-amber-400 flex items-center justify-end gap-1">
                            <span>{player.xp.toLocaleString()}</span>
                            <span className="text-[10px] text-zinc-400 font-semibold">XP</span>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {Math.round((player.xp / 15000) * 100)}% of Max
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROMINENT MONTHLY GRAND PRIZE NOTICE BANNER (WEEKLY LITE MEMBERSHIP) */}
      <div className="relative z-10 mt-8 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-black to-amber-950/80 border-2 border-yellow-500/70 shadow-[0_0_40px_rgba(234,179,8,0.25)] overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-red-600 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(234,179,8,0.5)] shrink-0">
              💎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase tracking-wider">
                  Official Monthly Esports Reward
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase">
                  1st Place Prize
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black font-heading text-white mt-1 uppercase tracking-wide">
                FREE FIRE WEEKLY LITE MEMBERSHIP GIVEAWAY
              </h3>
              
              {/* Bilingual Details: English + Sinhala */}
              <div className="space-y-1.5 mt-2">
                <p className="text-xs sm:text-sm text-yellow-300 font-semibold leading-relaxed">
                  🔥 <strong>English:</strong> The #1 contestant with the highest FIXA XP Cards at the end of each monthly season wins a <strong>Free Fire Weekly Lite Membership</strong> sponsored by FIXA GAMING! (Milestone Target: <strong>15,000 XP</strong>).
                </p>
                <p className="text-xs sm:text-sm text-yellow-200/90 font-medium leading-relaxed">
                  🔥 <strong>සිංහල:</strong> මාසෙ අගවෙද්දි වැඩිම FIXA XP Cards එකතු කර #1 ස්ථානයට එන ක්‍රීඩකයාට (1st Place) <strong>Free Fire Weekly Lite Membership එකක්</strong> FIXA GAMING වෙතින් නොමිලේ ලබාදේ! (උපරිම XP ඉලක්කය: <strong>15,000 XP</strong>).
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  * XP Cards reset at monthly season close to launch the next competition. Climb the leaderboard today!
                </p>
                <p className="text-[11px] text-zinc-500">
                  * (සෑම මසකම අවසානයේදී XP cards අලුත් වී නව තරග වටයක් ආරම්භ වේ).
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
            {/* Countdown Box */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-yellow-500/40 text-center w-full sm:w-auto">
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Season Closes In
              </div>
              <div className="font-heading font-black text-amber-400 text-sm md:text-base tracking-wider mt-0.5">
                {timeRemaining.days}D : {timeRemaining.hours}H : {timeRemaining.minutes}M : {timeRemaining.seconds}S
              </div>
            </div>

            {/* Register Modal Button */}
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-heading font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Gift className="w-4 h-4 text-black" />
              <span>Register for Challenge (Weekly Lite)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Stats Widget (Visitors Counter & Likes right below hub) */}
      <div className="relative z-10 mt-6">
        <SiteStatsWidget variant="full" />
      </div>

      {/* Rank Badges Showcase */}
      <div className="relative z-10 mt-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            All Rank Badges ({BADGE_TIERS.length})
          </div>
          <div className="text-[11px] text-zinc-500">Auto-unlocks as you collect XP cards</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {BADGE_TIERS.map((tier) => {
            const isUnlocked = progress.points >= tier.minPoints;
            const isCurrent = currentBadge.id === tier.id;
            return (
              <div
                key={tier.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? `bg-zinc-900/90 ${tier.borderColor} ${
                        isCurrent ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : ''
                      }`
                    : 'bg-zinc-950/40 border-zinc-800/60 opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{tier.icon}</div>
                <div className={`text-xs font-bold font-heading truncate ${tier.color}`}>
                  {tier.name}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{tier.minPoints.toLocaleString()} XP</div>
                {isUnlocked && (
                  <div className="mt-1 inline-block text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contestant Registration Modal */}
      <XPChallengeRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        currentPoints={progress.points}
        initialPlayerName={progress.playerName}
        initialDevice={progress.playerDevice}
        onRegistered={handleContestantRegistered}
      />
    </div>
  );
};
