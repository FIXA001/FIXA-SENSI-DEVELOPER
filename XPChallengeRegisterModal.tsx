import React, { useState } from 'react';
import {
  X,
  Trophy,
  CheckCircle2,
  ExternalLink,
  Heart,
  UserPlus,
  Smartphone,
  Mail,
  Hash,
  Phone,
  Copy,
  Check,
  Sparkles,
  Share2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Gift
} from 'lucide-react';

interface XPChallengeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  initialPlayerName: string;
  initialDevice: string;
  onRegistered: (data: {
    gameName: string;
    uid: string;
    email: string;
    phoneNumber: string;
    device: string;
    xp: number;
    badge: string;
  }) => void;
}

export const XPChallengeRegisterModal: React.FC<XPChallengeRegisterModalProps> = ({
  isOpen,
  onClose,
  currentPoints,
  initialPlayerName,
  initialDevice,
  onRegistered,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: TikTok Tasks State
  const [hasFollowedTikTok, setHasFollowedTikTok] = useState<boolean>(false);
  const [likedVideos, setLikedVideos] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  const [tiktokNotice, setTiktokNotice] = useState<string | null>(null);

  // Step 2: Form Details State
  const [gameName, setGameName] = useState<string>(initialPlayerName || '');
  const [email, setEmail] = useState<string>('');
  const [uid, setUid] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [device, setDevice] = useState<string>(initialDevice || 'Android Mobile');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 3: Registration Confirmation State
  const [registrationData, setRegistrationData] = useState<{
    id: string;
    gameName: string;
    email: string;
    uid: string;
    phoneNumber: string;
    device: string;
    xp: number;
    badge: string;
    registeredAt: string;
  } | null>(null);

  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const allThreeLikesGiven = likedVideos[1] && likedVideos[2] && likedVideos[3];
  const canProceedToForm = hasFollowedTikTok && allThreeLikesGiven;

  const toggleVideoLike = (videoNum: number) => {
    setLikedVideos(prev => ({
      ...prev,
      [videoNum]: !prev[videoNum],
    }));
    setTiktokNotice(null);
  };

  const handleStep1Next = () => {
    if (!hasFollowedTikTok && !allThreeLikesGiven) {
      setTiktokNotice('Please follow @fixafftop on TikTok and like 3 videos! (FIXA TikTok Follow කර වීඩියෝ 3කට Like දමන්න)');
      return;
    }
    if (!hasFollowedTikTok) {
      setTiktokNotice('Please follow @fixafftop on TikTok and confirm! (FIXA TikTok ගිණුම Follow කර තහවුරු කරන්න)');
      return;
    }
    if (!allThreeLikesGiven) {
      setTiktokNotice('Please like all 3 videos on TikTok and verify! (TikTok වීඩියෝ 3කට Like ලබාදී තහවුරු කරන්න)');
      return;
    }
    setTiktokNotice(null);
    setStep(2);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanGameName = gameName.trim();
    const cleanEmail = email.trim();
    const cleanUid = uid.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanGameName) {
      setFormError('Please enter your Free Fire In-Game Name (IGN) / ක්‍රීඩා නම ඇතුළත් කරන්න.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Please enter a valid Gmail / Email address / වලංගු Gmail ලිපිනයක් ඇතුළත් කරන්න.');
      return;
    }
    if (!cleanUid || cleanUid.length < 5) {
      setFormError('Please enter a valid Free Fire Player UID (min 5 digits) / වලංගු Player UID එකක් ඇතුළත් කරන්න.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 9) {
      setFormError('Please enter a valid Phone or WhatsApp Number / වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/challenge/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameName: cleanGameName,
          email: cleanEmail,
          uid: cleanUid,
          phoneNumber: cleanPhone,
          device: device.trim() || 'Android Phone',
          initialXp: currentPoints || 100,
          tikTokVerified: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Registration failed');
      }

      const data = await res.json();
      const reg = data.registration;

      setRegistrationData(reg);
      setStep(3);

      // Trigger parent callback to update leaderboard state immediately
      onRegistered({
        gameName: reg.gameName,
        uid: reg.uid,
        email: reg.email,
        phoneNumber: reg.phoneNumber,
        device: reg.device,
        xp: reg.xp,
        badge: reg.badge,
      });
    } catch (err: any) {
      setFormError(err?.message || 'ලියාපදිංචි වීමේදී දෝෂයක් සිදුවිය. නැවත උත්සාහ කරන්න.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // High quality formatted WhatsApp text
  const getFormattedWhatsAppMessage = () => {
    const reg = registrationData;
    const ign = reg?.gameName || gameName;
    const playerUid = reg?.uid || uid;
    const phone = reg?.phoneNumber || phoneNumber;
    const playerEmail = reg?.email || email;
    const dev = reg?.device || device;
    const xp = reg?.xp ?? currentPoints;
    const badge = reg?.badge || 'Recruit Sensi Tuner';
    const regId = reg?.id || 'REG-' + Date.now();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `🏆 *FIXA GAMING - XP CARD CHALLENGE REGISTRATION* 🏆
━━━━━━━━━━━━━━━━━━━━━━
🎮 *Free Fire IGN:* ${ign}
🆔 *Player UID:* ${playerUid}
📱 *Phone / WhatsApp:* ${phone}
📧 *Gmail / Email:* ${playerEmail}
📲 *Device Model:* ${dev}
⭐ *Current XP:* ${xp} XP
🎖️ *Rank Badge:* ${badge}
🏷️ *Contestant Ticket ID:* #${regId}
📅 *Registered Date:* ${dateStr}
━━━━━━━━━━━━━━━━━━━━━━
✅ *TikTok Tasks Verification:*
  • Followed @fixafftop: ✅ YES
  • Liked 3 Videos: ✅ YES (All 3 Completed)
━━━━━━━━━━━━━━━━━━━━━━
🎁 *Target Giveaway Reward:*
Free Fire Weekly Lite Membership (Top 1st Place - 15,000 XP Cap)
━━━━━━━━━━━━━━━━━━━━━━
📢 *Official FIXA WhatsApp Channel:*
https://whatsapp.com/channel/0029Vb9Yq4gL2AU6fS8lR01m

🌐 *FIXA Platform:* FIXA GAMING Tournament Engine
━━━━━━━━━━━━━━━━━━━━━━
🔥 _Official Verification Submission: Please confirm my registration entry in the monthly leaderboard!_`;
  };

  const handleCopyMessage = () => {
    const text = getFormattedWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const getWhatsAppSendUrl = () => {
    const text = encodeURIComponent(getFormattedWhatsAppMessage());
    return `https://wa.me/94741123762?text=${text}`;
  };

  const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb9Yq4gL2AU6fS8lR01m';
  const TIKTOK_URL = 'https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden my-8">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />

        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-red-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider">
                  Official Registration
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">
                  Weekly Lite Giveaway
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-white uppercase tracking-wide mt-0.5">
                XP CARD CHALLENGE REGISTRATION
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span className={step === 1 ? 'text-white font-bold' : 'text-zinc-400'}>
              TikTok Tasks
            </span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className={step === 2 ? 'text-white font-bold' : 'text-zinc-400'}>
              Player Details
            </span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              3
            </div>
            <span className={step === 3 ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
              WhatsApp Sync
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* ================= STEP 1: TIKTOK VERIFICATION ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Giveaway Requirements / ලියාපදිංචියට පෙර අනිවාර්ය පියවර</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  <strong>English:</strong> Follow our TikTok account and like any 3 videos before submitting your entry for the Weekly Lite Membership giveaway.
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  <strong>සිංහල:</strong> Weekly Lite Challenge එකට register වීමට පෙර FIXA TikTok ගිණුම Follow කර වීඩියෝ 3කට Like ලබාදී තහවුරු කරන්න.
                </p>
              </div>

              {/* Task 1: Follow TikTok */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#fe0979] flex items-center justify-center text-white shadow-md font-black text-sm">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                        Task 1 of 2
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Follow FIXA GAMING TikTok
                      </h4>
                      <p className="text-xs text-zinc-400">@fixafftop (Official TikTok Page)</p>
                    </div>
                  </div>

                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700 shrink-0"
                  >
                    <span>Open TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Click after following (Follow කළ පසු ක්ලික් කරන්න):</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHasFollowedTikTok(!hasFollowedTikTok);
                      setTiktokNotice(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      hasFollowedTikTok
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {hasFollowedTikTok ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Followed ✅</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>I Have Followed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Task 2: Like 3 TikTok Videos */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-black text-sm">
                      <Heart className="w-5 h-5 fill-red-500" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                        Task 2 of 2
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Like 3 Latest TikTok Videos
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Like any 3 videos on @fixafftop ({Object.values(likedVideos).filter(Boolean).length}/3 Liked) • වීඩියෝ 3කට Like දමන්න
                      </p>
                    </div>
                  </div>

                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700 shrink-0"
                  >
                    <span>Watch Videos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80">
                  {[1, 2, 3].map((num) => {
                    const isLiked = likedVideos[num];
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => toggleVideoLike(num)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-red-500/15 border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                            : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>Video #{num} {isLiked ? '❤️ Liked' : 'Like'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Notice */}
              {tiktokNotice && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-600/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{tiktokNotice}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                  {canProceedToForm ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      All Tasks Verified! (සියලු TikTok Tasks සම්පූර්ණයි!)
                    </span>
                  ) : (
                    <span>Follow & like all 3 videos to continue (Follow කර වීඩියෝ 3ම Like කරන්න)</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStep1Next}
                  className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    canProceedToForm
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <span>Next: Enter Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PLAYER REGISTRATION FORM ================= */}
          {step === 2 && (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Enter Free Fire Contestant Details
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Enter details to join the live leaderboard for the Weekly Lite Membership giveaway. (Leaderboard එකට විස්තර ඇතුළත් කරන්න).
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" />
                  <span>TikTok Verified</span>
                </div>
              </div>

              {/* Current Points Notice */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Your Current FIXA XP Score (ඔබගේ දැනට ඇති ලකුණු):</span>
                </div>
                <strong className="text-amber-400 font-heading text-sm">
                  {currentPoints.toLocaleString()} XP
                </strong>
              </div>

              {/* Form Input 1: Game Name (IGN) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Free Fire Game Name (In-Game Name / IGN) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="e.g. 亗 FIXA_RUSH 亗 or Dineth_FF"
                  maxLength={24}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition-all"
                />
                <p className="text-[11px] text-zinc-400">
                  * Public display name on the live leaderboard. (Leaderboard එකේ පෙන්වන නම).
                </p>
              </div>

              {/* Form Input 2: Free Fire UID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Free Fire Player UID (Account ID) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 2940182391 (Numbers only)"
                  maxLength={16}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition-all font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  * Required for account verification and sending the Weekly Lite Membership. (ත්‍යාගය ලබාදීමට ගිණුම තහවුරු කිරීමට).
                </p>
              </div>

              {/* Form Input 3: Phone / WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone Number / WhatsApp Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0741123762 or 0771234567"
                  maxLength={15}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition-all"
                />
                <p className="text-[11px] text-zinc-400">
                  * FIXA GAMING will contact the winner directly via WhatsApp. (ජයග්‍රාහකයා WhatsApp මඟින් සම්බන්ධ කරගැනීමට).
                </p>
              </div>

              {/* Form Input 4: Gmail / Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gmail / Email Name Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition-all"
                />
                <p className="text-[11px] text-zinc-400">
                  * For official registration receipt and prize claim records. (ලියාපදිංචි තොරතුරු සහ Redeem තහවුරු කිරීමට).
                </p>
              </div>

              {/* Form Input 5: Device Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gaming Device Model (Phone)</span>
                </label>
                <input
                  type="text"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="e.g. Redmi Note 12 / iPhone 13 / Samsung A34"
                  maxLength={30}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition-all"
                />
              </div>

              {/* Form Error Notice */}
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-600/40 text-red-300 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Tasks</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit & Auto-Add to Leaderboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: SUCCESS & WHATSAPP INTEGRATION ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Celebration Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/40 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-white uppercase tracking-wide">
                  🎉 REGISTRATION SUCCESSFUL!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300 font-semibold">
                  You are officially registered for the FIXA Monthly XP Challenge!
                </p>
                <p className="text-xs text-zinc-300">
                  (ඔබ සාර්ථකව FIXA Monthly XP Challenge එකට ලියාපදිංචි විය!)
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mt-1">
                  Your profile has been <strong>auto-added to the Live Leaderboard</strong>. Please join the official WhatsApp Channel below and message the admin to verify your Weekly Lite giveaway entry!
                </p>
                <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                  (ඔබගේ Profile එක Leaderboard එකට auto ඇඩ් විය. පහත Official WhatsApp Channel එකට එක්වන්න!)
                </p>
              </div>

              {/* Player Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    Contestant Entry Card
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-black uppercase">
                    Verified Competitor
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Game IGN</span>
                    <strong className="text-white font-heading truncate block mt-0.5">
                      {registrationData?.gameName || gameName}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Player UID</span>
                    <strong className="text-yellow-400 font-mono truncate block mt-0.5">
                      {registrationData?.uid || uid}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Phone Number</span>
                    <strong className="text-zinc-300 font-mono truncate block mt-0.5">
                      {registrationData?.phoneNumber || phoneNumber}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Registered XP</span>
                    <strong className="text-amber-400 font-heading truncate block mt-0.5">
                      {(registrationData?.xp || currentPoints).toLocaleString()} XP
                    </strong>
                  </div>
                </div>
              </div>

              {/* WhatsApp Message Preview & Direct Share */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Formatted Official WhatsApp Message</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto selection:bg-red-500/30">
                  {getFormattedWhatsAppMessage()}
                </div>
              </div>

              {/* Big Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Send via WhatsApp Button */}
                <a
                  href={getWhatsAppSendUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white text-white" />
                  <span>Send Registration to FIXA WhatsApp (0741123762)</span>
                </a>

                {/* Join Official WhatsApp Channel Button (Requested specifically by user) */}
                <a
                  href={WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>📢 Join Official FIXA WhatsApp Channel</span>
                </a>

                {/* Close & View Leaderboard */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  🏆 View Leaderboard & Start Earning XP Cards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
