import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { askFixaAI } from './server/ai.js';
import { fetchGamingNews } from './server/news.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Simple in-memory session token store (token -> { userId, role, expiresAt })
const sessions = new Map<string, { userId: string; role: 'admin' | 'vip'; expires: number }>();

function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session || Date.now() > session.expires) {
    if (session) sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  (req as any).user = { id: session.userId, role: session.role };
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Owner/Admin privileges required' });
  }
  next();
}

// --- AUTH API ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.getUserByUsername(username);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({
      error: 'Invalid credentials. Contact FIXA GAMING owner at WhatsApp: 0741123762 for VIP access approval.',
    });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account suspended. Contact FIXA GAMING owner at 0741123762.' });
  }

  // Create session (valid for 7 days)
  const token = 'fixa_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, {
    userId: user.id,
    role: user.role,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      expiresAt: user.expiresAt,
    },
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.getUserById((req as any).user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      expiresAt: user.expiresAt,
    },
  });
});

// --- ADMIN USER MANAGEMENT ---
app.get('/api/admin/users', authenticate, requireAdmin, (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    expiresAt: u.expiresAt,
    status: u.status,
    notes: u.notes,
  }));
  res.json({ users });
});

app.post('/api/admin/users', authenticate, requireAdmin, (req, res) => {
  const { username, password, name, role, expiresAt, notes } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (db.getUserByUsername(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = db.addUser({
    username: username.trim(),
    passwordHash: password.trim(),
    name: name || username,
    role: role === 'admin' ? 'admin' : 'vip',
    expiresAt: expiresAt || '2028-01-01',
    status: 'active',
    notes: notes || 'Created via Admin Dashboard',
  });

  res.json({ user: newUser });
});

app.delete('/api/admin/users/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const userToDelete = db.getUserById(id);
  if (userToDelete && userToDelete.username === 'fixaadmin') {
    return res.status(400).json({ error: 'Cannot delete primary admin account' });
  }
  const deleted = db.deleteUser(id);
  res.json({ success: deleted });
});

// --- FEEDBACK API ---
app.get('/api/feedback', (req, res) => {
  // Publicly returns feedback, or admin gets full management
  res.json({ feedback: db.getFeedback() });
});

app.post('/api/feedback', (req, res) => {
  const { name, deviceModel, category, rating, message } = req.body;
  if (!name || !deviceModel || !message) {
    return res.status(400).json({ error: 'Name, device model, and message are required' });
  }

  const item = db.addFeedback({
    name: String(name).trim(),
    deviceModel: String(deviceModel).trim(),
    category: category || 'General',
    rating: Number(rating) || 5,
    message: String(message).trim(),
  });

  res.json({ success: true, feedback: item });
});

app.delete('/api/feedback/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.deleteFeedback(req.params.id);
  res.json({ success: deleted });
});

// --- CONFIG API ---
app.get('/api/config', (req, res) => {
  res.json({ config: db.getConfig() });
});

app.post('/api/admin/config', authenticate, requireAdmin, (req, res) => {
  const updated = db.updateConfig(req.body);
  res.json({ config: updated });
});

// --- SITE STATS (VISITOR COUNTER & LIKES) ---
app.get('/api/stats', (req, res) => {
  res.json({ stats: db.getStats() });
});

app.post('/api/stats/visit', (req, res) => {
  const updated = db.incrementVisitors();
  res.json({ success: true, stats: updated });
});

app.post('/api/stats/like', (req, res) => {
  const updated = db.incrementLikes();
  res.json({ success: true, stats: updated });
});

app.post('/api/stats/tiktok-click', (req, res) => {
  const updated = db.incrementTikTokClicks();
  res.json({ success: true, stats: updated });
});

app.post('/api/stats/whatsapp-click', (req, res) => {
  const updated = db.incrementWhatsAppClicks();
  res.json({ success: true, stats: updated });
});

app.post('/api/stats/calibration', (req, res) => {
  const updated = db.incrementCalibrations();
  res.json({ success: true, stats: updated });
});

// --- LEADERBOARD & MONTHLY RESET API ---
app.get('/api/leaderboard', (req, res) => {
  const data = db.getLeaderboard();
  res.json(data);
});

app.post('/api/leaderboard/submit', (req, res) => {
  const { name, xp, device, avatar } = req.body;
  if (!name || typeof xp !== 'number') {
    return res.status(400).json({ error: 'Name and numeric xp are required' });
  }
  const entry = db.submitScore(name, xp, device, avatar);
  const updatedLeaderboard = db.getLeaderboard();
  res.json({ success: true, entry, ...updatedLeaderboard });
});

app.post('/api/admin/leaderboard/reset', authenticate, requireAdmin, (req, res) => {
  const season = db.manualResetSeason();
  res.json({ success: true, season, leaderboard: db.getLeaderboard() });
});

// --- XP CARD CHALLENGE REGISTRATION API ---
app.post('/api/challenge/register', (req, res) => {
  const { gameName, email, uid, phoneNumber, device, initialXp, tikTokVerified } = req.body;
  if (!gameName || !uid || !phoneNumber || !email) {
    return res.status(400).json({
      error: 'Free Fire Game Name (IGN), Player UID, Phone Number, and Gmail/Email are required.',
    });
  }

  const result = db.registerXPContestant({
    gameName,
    email,
    uid,
    phoneNumber,
    device,
    initialXp: Number(initialXp) || 100,
    tikTokVerified: Boolean(tikTokVerified),
  });

  const updatedLeaderboard = db.getLeaderboard();

  res.json({
    success: true,
    message: 'Registered successfully for the Monthly XP Card Challenge!',
    registration: result.registration,
    leaderboardEntry: result.leaderboardEntry,
    isNew: result.isNew,
    leaderboard: updatedLeaderboard.leaderboard,
  });
});

app.get('/api/challenge/registrations', (req, res) => {
  res.json({
    registrations: db.getRegistrations(),
    total: db.getRegistrations().length,
  });
});

// --- CUSTOM DEVICES API ---
app.get('/api/custom-devices', (req, res) => {
  res.json({ devices: db.getCustomDevices() });
});

app.post('/api/admin/custom-devices', authenticate, requireAdmin, (req, res) => {
  const { platform, brand, model, refreshRate, recommendedDpi, specs } = req.body;
  if (!brand || !model) {
    return res.status(400).json({ error: 'Brand and Model are required' });
  }
  const dev = db.addCustomDevice({
    platform: platform || 'Android',
    brand: brand.trim(),
    model: model.trim(),
    refreshRate: Number(refreshRate) || 90,
    recommendedDpi: Number(recommendedDpi) || 411,
    specs: specs || '',
  });
  res.json({ device: dev });
});

app.delete('/api/admin/custom-devices/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.deleteCustomDevice(req.params.id);
  res.json({ success: deleted });
});

// --- ZIP DOWNLOAD API ---
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.resolve(__dirname, 'public', 'fixa-gaming-complete-website.zip');
  exec('python3 scripts/build_export_zip.py', () => {
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'fixa-gaming-complete-website.zip');
    } else {
      res.status(404).json({ error: 'Archive could not be generated' });
    }
  });
});

// --- VIP PROTECTED CONTENT VAULTS ---
app.get('/api/vip/sensitivity-vault', authenticate, (req, res) => {
  res.json({
    secretPresets: [
      {
        title: 'Tournament J-Drag Zero-Recoil Matrix',
        targetGuns: ['M1887', 'Woodpecker', 'Desert Eagle'],
        scale: '0 – 200 Scale (OB48/OB49 Meta)',
        general: 196,
        redDot: 190,
        scope2x: 182,
        scope4x: 174,
        sniper: 106,
        freeLook: 168,
        buttonSize: '42%',
        dpiMultiplier: '1.25x Normal (Safe +45 DPI)',
        dragTechnique: 'J-Shape Drag with 0.10s flick speed. Release joystick upon crosshair lock.',
        recoilCompensation: 'Turn on Quick Weapon Switch. Switch to Melee within 240ms of firing shot.',
      },
      {
        title: 'Clash Squad Rusher 120Hz/144Hz Hyper-Speed',
        targetGuns: ['MP40', 'Thompson', 'UMP', 'Shotguns'],
        scale: '0 – 200 Scale (OB48/OB49 Meta)',
        general: 200,
        redDot: 195,
        scope2x: 188,
        scope4x: 178,
        sniper: 118,
        freeLook: 192,
        buttonSize: '40%',
        dpiMultiplier: '450 - 480 DPI',
        dragTechnique: 'Straight Fast Drag from lower screen rim. Keep fire button center-right 15mm from edge.',
        recoilCompensation: 'Burst 5-6 bullets, crouch-cancel, re-drag for 100% headshot cluster.',
      },
      {
        title: 'Pro AWM & Barrett Double-Sniper Instant-Swap',
        targetGuns: ['AWM', 'M82B (Barrett)', 'Kar98k'],
        scale: '0 – 200 Scale (OB48/OB49 Meta)',
        general: 168,
        redDot: 156,
        scope2x: 152,
        scope4x: 148,
        sniper: 124,
        freeLook: 142,
        buttonSize: '48%',
        dpiMultiplier: '411 DPI',
        dragTechnique: 'Hold-to-fire with custom pet emote in exact center for no-scope crosshair alignment.',
        recoilCompensation: 'Fire -> Weapon 2 -> Fire -> Weapon 1 loop with 0.08s rhythm.',
      }
    ],
    calibrationGuide: {
      secretDpiFormula: 'Display PPI / 2.14 = Optimal Android DPI (Max +80 above stock to prevent bootloop)',
      fireButtonPlacement: 'Position the fire button bottom edge aligned with the thumb joint natural resting arc.',
      touchSamplingBoost: 'For Xiaomi/POCO: Game Turbo -> Touch Response 100%, Aim Sensitivity 100%. For Samsung: Game Booster Labs -> Alternate game performance management ON.'
    }
  });
});

app.get('/api/vip/optimizer-vault', authenticate, (req, res) => {
  res.json({
    deepAndroidTweaks: [
      { setting: 'Window Animation Scale', value: '0.5x or OFF', description: 'Cuts UI render latency and quickens app switching.' },
      { setting: 'Transition Animation Scale', value: '0.5x', description: 'Removes stutter between in-game kill feeds.' },
      { setting: 'Animator Duration Scale', value: '0.5x', description: 'Increases perceived input responsiveness.' },
      { setting: 'Logger Buffer Size', value: 'Off or 64K', description: 'Frees CPU cycles from background diagnostic logging.' },
      { setting: 'Force 4x MSAA', value: 'Disabled for FPS / Enabled only on flagship GPUs', description: 'Turning OFF gives 10-15 FPS boost in intense smoke/squad fights.' },
      { setting: 'Disable HW Overlays', value: 'Enabled (Always use GPU for screen compositing)', description: 'Eliminates screen tearing and micro-stuttering in Free Fire.' },
      { setting: 'Graphics Driver Preferences', value: 'System Graphics Driver', description: 'Overrides generic Vulkan layer with vendor-tuned Adreno/Mali driver.' }
    ],
    iosProTweaks: [
      { setting: 'Guided Access', value: 'Enabled with Touch Lock on top notch', description: 'Completely blocks notification drops and swipe gestures during ranked games.' },
      { setting: 'Touch Accommodations', value: 'Hold Duration: 0.10s, Ignore Repeat: OFF', description: 'Stabilizes fast micro-taps and eliminates missed drag inputs.' },
      { setting: 'Reduce Motion', value: 'Enabled in Accessibility', description: 'Frees iOS GPU compositor cycles.' },
      { setting: 'Background App Refresh', value: 'Completely Disabled', description: 'Prevents thermal throttling from iCloud sync and social app fetches.' }
    ],
    pcEmulatorTweaks: [
      { setting: 'BlueStacks 5 CPU Allocation', value: '4 Cores (or 6 for 8+ core CPUs)', description: 'Prevents thread contention.' },
      { setting: 'BlueStacks 5 RAM Allocation', value: '4096 MB (4GB)', description: 'Optimal buffer for Free Fire 64-bit engine.' },
      { setting: 'Graphics Engine Mode', value: 'Performance (Legacy) or Compatibility', description: 'Use DirectX for NVIDIA, OpenGL for AMD GPUs.' },
      { setting: 'ASTC Textures (Beta)', value: 'Hardware Decoding', description: 'GPU unpacks textures with zero CPU overhead.' },
      { setting: 'High Frame Rate', value: 'Enable High Frame Rates -> Slider to 120 or 240 FPS', description: 'Smooth drag tracking.' }
    ]
  });
});

app.get('/api/vip/premium-panel', authenticate, (req, res) => {
  res.json({
    proPlayers: [
      {
        name: 'Raistar',
        region: 'India / Global',
        knownFor: 'Fastest 360 Movement & One Tap M1887',
        device: 'iPhone 13 Pro Max & PC',
        settings: { general: 100, redDot: 98, scope2x: 95, scope4x: 92, sniper: 58, freeLook: 100, buttonSize: '40%' },
        hud: '3-Finger Claw with left-hand fire button and jump on top right.',
      },
      {
        name: 'Ruok FF',
        region: 'Thailand',
        knownFor: 'Insane Drag Headshots & Surgical Recoil',
        device: 'iPhone 15 Pro / PC BlueStacks',
        settings: { general: 96, redDot: 92, scope2x: 88, scope4x: 85, sniper: 50, freeLook: 75, buttonSize: '43%' },
        hud: '4-Finger Claw with fast Gloo Wall crouch bind.',
      },
      {
        name: 'White444',
        region: 'MENA',
        knownFor: 'One Shot Desert Eagle & AWM Flick Shots',
        device: 'PC MSI App Player / iPhone',
        settings: { general: 98, redDot: 94, scope2x: 90, scope4x: 86, sniper: 45, freeLook: 80, buttonSize: '45%' },
        hud: 'Fast weapon switch binding right adjacent to fire trigger.',
      },
      {
        name: 'Nobru',
        region: 'Brazil (Esports World Champion)',
        knownFor: 'Flawless MP40 spray & Battle Royale Rotations',
        device: 'iPhone 14 Pro Max',
        settings: { general: 100, redDot: 96, scope2x: 92, scope4x: 89, sniper: 60, freeLook: 85, buttonSize: '48%' },
        hud: '2-Finger Hybrid with maximized fire button and quick gloo.',
      }
    ],
    tournamentHudLayouts: [
      {
        name: 'FIXA Esports 3-Finger Competitive Claw',
        description: 'Best balanced layout for high-speed Gloo Wall drops, continuous jumping, and full drag range.',
        features: ['Left Index: Secondary Fire + Gloo Wall', 'Right Thumb: Main Fire + Aim Drag', 'Right Index: Jump + Crouch'],
      },
      {
        name: 'FIXA Esports 4-Finger God-Tier Layout',
        description: 'Designed for professional tournament rushers who need instantaneous weapon switching while sliding and aiming.',
        features: ['Left Index: Fire + Scope', 'Left Thumb: Joystick Movement', 'Right Index: Gloo Wall + Weapon Switch', 'Right Thumb: Aim + Crouch + Jump'],
      }
    ]
  });
});

// --- FIXA AI ENDPOINT ---
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, deviceContext, conversationHistory } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const aiResponse = await askFixaAI(prompt, deviceContext, conversationHistory || []);
    res.json({ response: aiResponse });
  } catch (err: any) {
    console.error('AI chat endpoint caught error:', err);
    res.json({
      response: `🔥 **FIXA AI:** Sensitivity and drag headshot calibration for Free Fire is active. For best performance, use General: 196, Red Dot: 188, 2X Scope: 180, 4X Scope: 174, Fire Button: 44%. Contact FIXA GAMING WhatsApp (0741123762) for instant VIP assistance!`
    });
  }
});

// --- GAMING NEWS & SEARCH GROUNDING ENDPOINTS ---
let cachedNewsData: any = null;
let lastNewsFetchTime = 0;
const NEWS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

app.get('/api/gaming-news', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  if (!forceRefresh && cachedNewsData && now - lastNewsFetchTime < NEWS_CACHE_TTL) {
    return res.json({ ...cachedNewsData, fromCache: true });
  }

  try {
    const data = await fetchGamingNews();
    cachedNewsData = data;
    lastNewsFetchTime = now;
    res.json({ ...data, fromCache: false });
  } catch (err: any) {
    console.log('[Gaming News Route] Serving cached/fallback response:', err?.message || 'Notice');
    if (cachedNewsData) {
      return res.json({ ...cachedNewsData, fromCache: true, stale: true });
    }
    res.json({
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: 'Latest verified Free Fire OB patch updates, weapon rebalances, and FFWS esports circuit data curated by FIXA GAMING.',
      news: [],
      isLiveGrounding: false
    });
  }
});

app.post('/api/gaming-news/refresh', async (req, res) => {
  try {
    const data = await fetchGamingNews();
    cachedNewsData = data;
    lastNewsFetchTime = Date.now();
    res.json({ ...data, fromCache: false, refreshed: true });
  } catch (err: any) {
    console.log('[Gaming News Refresh] Serving fallback response:', err?.message || 'Notice');
    if (cachedNewsData) {
      return res.json({ ...cachedNewsData, fromCache: true, refreshed: false });
    }
    res.json({
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: 'Latest verified Free Fire OB patch updates, weapon rebalances, and FFWS esports circuit data curated by FIXA GAMING.',
      news: [],
      isLiveGrounding: false
    });
  }
});

// Setup Vite in Dev or Serve Static in Prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FIXA GAMING] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
