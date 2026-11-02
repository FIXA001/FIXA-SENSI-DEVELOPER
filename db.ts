import fs from 'fs';
import path from 'path';

export interface VIPUser {
  id: string;
  username: string;
  passwordHash: string; // Plain/hashed comparison handled server-side
  role: 'admin' | 'vip';
  name: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'suspended';
  notes?: string;
}

export interface UserFeedback {
  id: string;
  name: string;
  deviceModel: string;
  category: 'General' | 'Feature Suggestion' | 'Sensitivity Correction' | 'New Device Request' | 'Website Improvement' | 'Bug Report';
  rating: number;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

export interface CustomDevice {
  id: string;
  platform: 'Android' | 'iOS' | 'PC';
  brand: string;
  model: string;
  refreshRate: number; // e.g. 60, 90, 120, 144, 165
  recommendedDpi: number;
  specs: string;
  createdAt: string;
}

export interface SiteConfig {
  customLogoUrl: string | null;
  whatsappContact: string;
  tiktokUrl: string;
  tiktokUsername: string;
  announcement: string;
}

export interface SiteStats {
  visitors: number;
  likes: number;
  tiktokClicks: number;
  whatsappClicks: number;
  calibrations: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number; // Max 15,000 target
  badge: string;
  device: string;
  avatar: string;
  updatedAt: string;
  isRegistered?: boolean;
  uid?: string;
}

export interface XPRegistration {
  id: string;
  gameName: string;
  email: string;
  uid: string;
  phoneNumber: string;
  device: string;
  xp: number;
  badge: string;
  tikTokVerified: boolean;
  registeredAt: string;
}

export interface MonthlySeason {
  currentMonth: string; // YYYY-MM
  lastMonthWinner: {
    name: string;
    xp: number;
    reward: string;
    month: string;
  } | null;
}

interface DatabaseSchema {
  users: VIPUser[];
  feedback: UserFeedback[];
  customDevices: CustomDevice[];
  config: SiteConfig;
  stats: SiteStats;
  season: MonthlySeason;
  leaderboard: LeaderboardEntry[];
  registrations: XPRegistration[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'fixa_db.json');

const currentMonthStr = new Date().toISOString().slice(0, 7);

const INITIAL_DB: DatabaseSchema = {
  stats: {
    visitors: 4860,
    likes: 3410,
    tiktokClicks: 2180,
    whatsappClicks: 1640,
    calibrations: 8920,
  },
  season: {
    currentMonth: currentMonthStr,
    lastMonthWinner: {
      name: '亗 K A S U N 亗',
      xp: 13950,
      reward: 'Free Fire Weekly Lite Membership',
      month: 'Last Season Winner',
    },
  },
  leaderboard: [],
  users: [
    {
      id: 'usr_admin_1',
      username: 'fixaadmin',
      passwordHash: 'fixa@2026',
      role: 'admin',
      name: 'FIXA GAMING Owner',
      createdAt: new Date().toISOString(),
      expiresAt: '2099-12-31',
      status: 'active',
      notes: 'Main Administrator & Site Owner',
    },
    {
      id: 'usr_vip_demo',
      username: 'fixavip',
      passwordHash: 'vipheadshot2026',
      role: 'vip',
      name: 'Pro Esports VIP Member',
      createdAt: new Date().toISOString(),
      expiresAt: '2027-12-31',
      status: 'active',
      notes: 'Official VIP Access Pass',
    },
    {
      id: 'usr_vip_player2',
      username: 'headshotking',
      passwordHash: 'onetap777',
      role: 'vip',
      name: 'Drag Master VIP',
      createdAt: new Date().toISOString(),
      expiresAt: '2027-06-30',
      status: 'active',
      notes: 'Tournament player account',
    }
  ],
  feedback: [
    {
      id: 'fb_1',
      name: 'Kasun Bandara',
      deviceModel: 'Redmi Note 12 Pro 5G',
      category: 'Sensitivity Correction',
      rating: 5,
      message: 'The One Tap drag sensitivity for 120Hz display is absolutely insane! Got 82% headshot rate in CS Ranked.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      status: 'reviewed',
    },
    {
      id: 'fb_2',
      name: 'Dineth Perera',
      deviceModel: 'iPhone 14 Pro Max',
      category: 'General',
      rating: 5,
      message: 'Best Free Fire optimization guide for iOS. Zero frame drops even when recording highlights!',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'reviewed',
    },
    {
      id: 'fb_3',
      name: 'Tharindu Fernando',
      deviceModel: 'Samsung Galaxy A54',
      category: 'New Device Request',
      rating: 5,
      message: 'Can you please add more specific settings for Exynos 1380 with 450 DPI? Loved the FIXA AI assistant advice.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      status: 'new',
    }
  ],
  customDevices: [
    {
      id: 'dev_1',
      platform: 'Android',
      brand: 'Infinix',
      model: 'GT 20 Pro Gaming',
      refreshRate: 144,
      recommendedDpi: 440,
      specs: 'Dimensity 8200 Ultimate, 12GB RAM, 144Hz AMOLED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dev_2',
      platform: 'Android',
      brand: 'Tecno',
      model: 'Pova 6 Pro 5G',
      refreshRate: 120,
      recommendedDpi: 420,
      specs: 'Dimensity 6080, 12GB RAM, 120Hz Display',
      createdAt: new Date().toISOString(),
    }
  ],
  config: {
    customLogoUrl: null,
    whatsappContact: '0741123762',
    tiktokUrl: 'https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl',
    tiktokUsername: '@fixafftop',
    announcement: '🔥 FIXA GAMING OB48 Season Update: New Drag Headshot Curve Algorithms and VIP Sensitivity Presets are now live!',
  },
  registrations: []
};

class DBManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const merged: DatabaseSchema = {
          ...INITIAL_DB,
          ...parsed,
          config: { ...INITIAL_DB.config, ...(parsed.config || {}) },
          stats: {
            visitors: parsed.stats?.visitors ?? INITIAL_DB.stats.visitors,
            likes: parsed.stats?.likes ?? INITIAL_DB.stats.likes,
            tiktokClicks: parsed.stats?.tiktokClicks ?? INITIAL_DB.stats.tiktokClicks,
            whatsappClicks: parsed.stats?.whatsappClicks ?? INITIAL_DB.stats.whatsappClicks,
            calibrations: parsed.stats?.calibrations ?? INITIAL_DB.stats.calibrations,
          },
          season: { ...INITIAL_DB.season, ...(parsed.season || {}) },
          leaderboard: Array.isArray(parsed.leaderboard)
            ? parsed.leaderboard.filter((p: any) => p && p.isRegistered === true)
            : [],
          registrations: Array.isArray(parsed.registrations)
            ? parsed.registrations
            : [],
        };
        // Auto check monthly reset upon server startup
        this.data = merged;
        this.checkMonthlyReset();
        return this.data;
      }
    } catch (e) {
      console.error('Error reading DB, using initial data:', e);
    }
    this.saveData(INITIAL_DB);
    return INITIAL_DB;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  // --- STATS (Visitors, Likes, TikTok, WhatsApp & Calibrations) ---
  getStats(): SiteStats {
    if (!this.data.stats) this.data.stats = { ...INITIAL_DB.stats };
    if (this.data.stats.tiktokClicks === undefined) this.data.stats.tiktokClicks = INITIAL_DB.stats.tiktokClicks;
    if (this.data.stats.whatsappClicks === undefined) this.data.stats.whatsappClicks = INITIAL_DB.stats.whatsappClicks;
    if (this.data.stats.calibrations === undefined) this.data.stats.calibrations = INITIAL_DB.stats.calibrations;
    return this.data.stats;
  }

  incrementVisitors(): SiteStats {
    if (!this.data.stats) {
      this.data.stats = { ...INITIAL_DB.stats };
    }
    this.data.stats.visitors += 1;
    this.saveData(this.data);
    return this.data.stats;
  }

  incrementLikes(): SiteStats {
    if (!this.data.stats) {
      this.data.stats = { ...INITIAL_DB.stats };
    }
    this.data.stats.likes += 1;
    this.saveData(this.data);
    return this.data.stats;
  }

  incrementTikTokClicks(): SiteStats {
    if (!this.data.stats) {
      this.data.stats = { ...INITIAL_DB.stats };
    }
    this.data.stats.tiktokClicks = (this.data.stats.tiktokClicks || INITIAL_DB.stats.tiktokClicks) + 1;
    this.saveData(this.data);
    return this.data.stats;
  }

  incrementWhatsAppClicks(): SiteStats {
    if (!this.data.stats) {
      this.data.stats = { ...INITIAL_DB.stats };
    }
    this.data.stats.whatsappClicks = (this.data.stats.whatsappClicks || INITIAL_DB.stats.whatsappClicks) + 1;
    this.saveData(this.data);
    return this.data.stats;
  }

  incrementCalibrations(): SiteStats {
    if (!this.data.stats) {
      this.data.stats = { ...INITIAL_DB.stats };
    }
    this.data.stats.calibrations = (this.data.stats.calibrations || INITIAL_DB.stats.calibrations) + 1;
    this.saveData(this.data);
    return this.data.stats;
  }

  // --- MONTHLY LEADERBOARD & AUTO-RESET ---
  checkMonthlyReset(): boolean {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-03"
    if (!this.data.season) {
      this.data.season = { ...INITIAL_DB.season, currentMonth };
    }

    if (this.data.season.currentMonth !== currentMonth) {
      console.log(`[MONTHLY RESET] Month rollover detected: ${this.data.season.currentMonth} -> ${currentMonth}`);
      
      // Sort existing registered players to find last month's champion
      const sorted = [...(this.data.leaderboard || [])]
        .filter(p => p.isRegistered)
        .sort((a, b) => b.xp - a.xp);
      const champion = sorted[0];

      if (champion && champion.xp > 0) {
        this.data.season.lastMonthWinner = {
          name: champion.name,
          xp: champion.xp,
          reward: 'Free Fire Weekly Lite Membership Claimed',
          month: this.data.season.currentMonth,
        };
      }

      // Reset leaderboard XP for the new month season
      this.data.season.currentMonth = currentMonth;
      this.data.leaderboard = (this.data.leaderboard || []).map(player => ({
        ...player,
        xp: Math.max(50, Math.floor(player.xp * 0.1)), // Season soft-reset to start fresh race
        updatedAt: new Date().toISOString(),
      }));

      this.saveData(this.data);
      return true;
    }
    return false;
  }

  getLeaderboard(): { leaderboard: LeaderboardEntry[]; season: MonthlySeason; totalPlayers: number } {
    this.checkMonthlyReset();
    // STRICTLY ONLY genuine registered players
    const registeredOnly = (this.data.leaderboard || []).filter(p => p && p.isRegistered === true);
    const sorted = [...registeredOnly].sort((a, b) => b.xp - a.xp);
    return {
      leaderboard: sorted,
      season: this.data.season || INITIAL_DB.season,
      totalPlayers: sorted.length,
    };
  }

  submitScore(name: string, xp: number, device?: string, avatar?: string): LeaderboardEntry | null {
    this.checkMonthlyReset();
    const cleanName = (name || '').trim().slice(0, 24);
    if (!cleanName) return null;

    const clampedXp = Math.min(15000, Math.max(0, Math.round(xp))); // 15,000 max target cap
    
    // Determine badge title based on XP
    let badge = 'Bronze Calibrator';
    if (clampedXp >= 15000) badge = 'Weekly Lite Contender';
    else if (clampedXp >= 5000) badge = 'FIXA Esports Champion';
    else if (clampedXp >= 2000) badge = 'Diamond Zero-Recoil God';
    else if (clampedXp >= 800) badge = 'Gold One-Tap Legend';
    else if (clampedXp >= 250) badge = 'Silver Drag Master';

    // Only update if player is an actually registered contestant!
    let entry = this.data.leaderboard.find(
      p => p.isRegistered && p.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (entry) {
      entry.xp = Math.max(entry.xp, clampedXp);
      entry.badge = badge;
      if (device) entry.device = device;
      if (avatar) entry.avatar = avatar;
      entry.updatedAt = new Date().toISOString();
      this.saveData(this.data);
      return entry;
    }

    // Check if player exists in registrations table
    const reg = (this.data.registrations || []).find(
      r => r.gameName.toLowerCase() === cleanName.toLowerCase()
    );

    if (reg) {
      reg.xp = Math.max(reg.xp, clampedXp);
      reg.badge = badge;
      entry = {
        id: 'lb_' + Date.now(),
        name: reg.gameName,
        xp: reg.xp,
        badge,
        device: device || reg.device || 'Android Gaming',
        avatar: avatar || '🔥',
        isRegistered: true,
        uid: reg.uid,
        updatedAt: new Date().toISOString(),
      };
      this.data.leaderboard.push(entry);
      this.saveData(this.data);
      return entry;
    }

    // Unregistered guests are NOT added to the Leaderboard!
    return null;
  }

  registerXPContestant(payload: {
    gameName: string;
    email: string;
    uid: string;
    phoneNumber: string;
    device?: string;
    initialXp?: number;
    tikTokVerified?: boolean;
  }): { registration: XPRegistration; leaderboardEntry: LeaderboardEntry; isNew: boolean } {
    this.checkMonthlyReset();

    const cleanGameName = (payload.gameName || 'FF_Player').trim().slice(0, 24);
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const cleanUid = (payload.uid || '').trim();
    const cleanPhone = (payload.phoneNumber || '').trim();
    const cleanDevice = (payload.device || 'Android Gaming').trim();
    const startingXp = Math.min(15000, Math.max(25, Math.round(Number(payload.initialXp) || 75)));

    // Determine badge based on XP
    let badge = 'Bronze Calibrator';
    if (startingXp >= 15000) badge = 'Weekly Lite Contender';
    else if (startingXp >= 5000) badge = 'FIXA Esports Champion';
    else if (startingXp >= 2000) badge = 'Diamond Zero-Recoil God';
    else if (startingXp >= 800) badge = 'Gold One-Tap Legend';
    else if (startingXp >= 250) badge = 'Silver Drag Master';

    if (!Array.isArray(this.data.registrations)) {
      this.data.registrations = [];
    }

    let reg = this.data.registrations.find(
      r => r.uid === cleanUid || (cleanEmail && r.email === cleanEmail) || r.phoneNumber === cleanPhone
    );

    const isNew = !reg;

    if (reg) {
      reg.gameName = cleanGameName;
      reg.email = cleanEmail;
      reg.phoneNumber = cleanPhone;
      reg.device = cleanDevice;
      reg.xp = Math.max(reg.xp, startingXp);
      reg.badge = badge;
      reg.tikTokVerified = payload.tikTokVerified ?? true;
    } else {
      reg = {
        id: 'reg_' + Date.now(),
        gameName: cleanGameName,
        email: cleanEmail,
        uid: cleanUid,
        phoneNumber: cleanPhone,
        device: cleanDevice,
        xp: startingXp,
        badge,
        tikTokVerified: payload.tikTokVerified ?? true,
        registeredAt: new Date().toISOString(),
      };
      this.data.registrations.push(reg);
    }

    // Auto add or update the player directly on the Leaderboard!
    let lbEntry = this.data.leaderboard.find(
      p => p.name.toLowerCase() === cleanGameName.toLowerCase() || (cleanUid && p.uid === cleanUid)
    );

    if (lbEntry) {
      lbEntry.name = cleanGameName;
      lbEntry.xp = Math.max(lbEntry.xp, startingXp);
      lbEntry.badge = badge;
      lbEntry.device = cleanDevice;
      lbEntry.isRegistered = true;
      lbEntry.uid = cleanUid;
      lbEntry.updatedAt = new Date().toISOString();
    } else {
      lbEntry = {
        id: 'lb_' + Date.now(),
        name: cleanGameName,
        xp: startingXp,
        badge,
        device: cleanDevice,
        avatar: '🔥',
        isRegistered: true,
        uid: cleanUid,
        updatedAt: new Date().toISOString(),
      };
      this.data.leaderboard.push(lbEntry);
    }

    this.saveData(this.data);
    return { registration: reg, leaderboardEntry: lbEntry, isNew };
  }

  getRegistrations(): XPRegistration[] {
    return this.data.registrations || [];
  }

  manualResetSeason(): MonthlySeason {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const sorted = [...(this.data.leaderboard || [])].sort((a, b) => b.xp - a.xp);
    const champion = sorted[0];

    this.data.season = {
      currentMonth,
      lastMonthWinner: champion
        ? {
            name: champion.name,
            xp: champion.xp,
            reward: 'Free Fire Weekly Lite Membership',
            month: 'Reset by Admin',
          }
        : null,
    };

    this.data.leaderboard = INITIAL_DB.leaderboard.map(p => ({
      ...p,
      xp: Math.floor(p.xp * 0.15),
      updatedAt: new Date().toISOString(),
    }));

    this.saveData(this.data);
    return this.data.season;
  }

  // Users
  getUsers(): VIPUser[] {
    return this.data.users;
  }

  getUserByUsername(username: string): VIPUser | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  getUserById(id: string): VIPUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  addUser(user: Omit<VIPUser, 'id' | 'createdAt'>): VIPUser {
    const newUser: VIPUser = {
      ...user,
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Feedback
  getFeedback(): UserFeedback[] {
    return this.data.feedback;
  }

  addFeedback(item: Omit<UserFeedback, 'id' | 'createdAt' | 'status'>): UserFeedback {
    const newFeedback: UserFeedback = {
      ...item,
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.data.feedback.unshift(newFeedback);
    this.saveData(this.data);
    return newFeedback;
  }

  deleteFeedback(id: string): boolean {
    const initialLen = this.data.feedback.length;
    this.data.feedback = this.data.feedback.filter(f => f.id !== id);
    if (this.data.feedback.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Custom Devices
  getCustomDevices(): CustomDevice[] {
    return this.data.customDevices;
  }

  addCustomDevice(device: Omit<CustomDevice, 'id' | 'createdAt'>): CustomDevice {
    const newDevice: CustomDevice = {
      ...device,
      id: 'dev_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.data.customDevices.push(newDevice);
    this.saveData(this.data);
    return newDevice;
  }

  deleteCustomDevice(id: string): boolean {
    const len = this.data.customDevices.length;
    this.data.customDevices = this.data.customDevices.filter(d => d.id !== id);
    if (this.data.customDevices.length !== len) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Config
  getConfig(): SiteConfig {
    return this.data.config;
  }

  updateConfig(updates: Partial<SiteConfig>): SiteConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.saveData(this.data);
    return this.data.config;
  }
}

export const db = new DBManager();
