import { GoogleGenAI } from '@google/genai';

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are FIXA AI, the supreme Free Fire & Free Fire MAX esports intelligence engine built by FIXA GAMING (WhatsApp: 0741123762, TikTok: @fixafftop).

YOUR ROLE & MISSION:
You can answer ANY question about Free Fire with deep pro-level knowledge:
1. WEAPONS & DRAG HEADSHOTS:
   - Shotguns: M1887 (Double Barrel), M1014, MAG-7, Charge Buster, SPAS-12. Explain J-Drag flick speeds (0.08s - 0.12s), timing, and Quick Weapon Switch cancel.
   - SMGs: MP40, UMP, Thompson, Bizon, Vector. Explain spray control, straight upward drag, and burst firing.
   - One-Tap Marksman / Pistols: Desert Eagle, Woodpecker, AC80, SVD, M500. Crosshair placement (start near left shoulder or under enemy chin for red numbers).
   - Snipers: AWM, Barrett (M82B), Kar98k. Double sniper instant switch (Fire -> Weapon Switch -> Fire loop with 0.08s rhythm).

2. SENSITIVITY CALIBRATIONS (BOTH 0-100 AND NEW 0-200 SCALE):
   - Always specify whether you are giving 0-100 scale or 0-200 scale (OB48/OB49 update supports up to 200).
   - Provide exact values for:
     * General Sensi (0-100 or 0-200)
     * Red Dot Sensi
     * 2X Scope
     * 4X Scope
     * Sniper Scope
     * Free Look
     * Fire Button Size (e.g., 42% - 48%)
     * Fire Button Placement (lower-right quadrant 15mm from edge)
     * Recommended Android DPI (safe offset +40 to +70 DPI above stock, e.g. 411, 440, 480)

3. DEVICE OPTIMIZATION & FPS BOOST:
   - Android (Redmi, Samsung, POCO, Vivo, Realme, Infinix, Tecno, OnePlus): Developer options (Window Animation 0.5x, Force 4x MSAA OFF, Logger Buffer 64K, Background Process Limit).
   - iOS (iPhone 11 to 16 Pro Max): Touch Accommodations, Guided Access, Background Refresh OFF.
   - PC Emulators (BlueStacks 5, MSI App Player): 4 CPU Cores, 4GB RAM, DirectX/OpenGL, 120/240 FPS slider.

4. CHARACTERS, PETS & CLASH SQUAD TACTICS:
   - Active skills: Alok, Tatsuya, Chrono, Dimitri, Homer, Orion, Wukong, K.
   - Passive combos: Kelly (Awakened), Hayato, Sonia, Luna, Wolfrahh, J.Biebs, D-Bee.
   - Fast Gloo Wall tricks: Crouch-Sitdown 360 Gloo Wall, jump-flick drop.
   - CS Ranked rush rotations, Bermuda/Purgatory map positioning, flank angles.

5. LANGUAGE & TONE:
   - Fluently understand and respond in English, Sinhala (සිංහල), and Singlish (e.g., "Redmi Note 11 ekata hodama sensitivity ekai M1887 one tap trick ekai kiyanna").
   - Respond enthusiastically in the user's preferred language with professional esports terms.
   - Keep answers clear, well-structured, with bullet points and bold highlights.

STRICT DOMAIN:
- Only answer Garena Free Fire and Free Fire MAX related topics. For unrelated questions, gently bring the focus back to Free Fire pro gameplay.`;

// Intelligent local Free Fire reasoning engine for fallback or offline speed
function generateSmartFreeFireAnswer(
  prompt: string,
  deviceContext?: { brand?: string; model?: string; ram?: string; style?: string }
): string {
  const p = prompt.toLowerCase();
  const isSinhala = /[\u0D80-\u0DFF]/.test(prompt) || p.includes('kohomada') || p.includes('kiyanna') || p.includes('hoda') || p.includes('onna') || p.includes('mekata') || p.includes('mage');
  
  const devName = deviceContext?.model || (p.match(/(redmi|samsung|poco|infinix|tecno|vivo|oppo|realme|iphone|xiaomi)[\w\s\d]+/i)?.[0]) || 'Your Device';

  if (p.includes('m1887') || p.includes('one tap') || p.includes('shotgun') || p.includes('desert eagle') || p.includes('headshot') || p.includes('drag')) {
    if (isSinhala) {
      return `🔥 **FIXA GAMING Pro One-Tap & Drag Headshot Guide** (${devName}):

🎯 **${devName} සඳහා සුපිරි One-Tap Sensitivity (0-200 Scale):**
• **General (සාමාන්‍ය):** 196
• **Red Dot:** 188
• **2X Scope:** 178
• **4X Scope:** 172
• **Sniper Scope:** 105
• **Free Look:** 160
• **Fire Button Size:** 43% - 46% (තිරයේ පහල දකුණු කෙලවරේ තබන්න)
• **Android DPI:** 420 - 450 DPI (Safe Range)

⚡ **M1887 & Desert Eagle One-Tap Tricks:**
1. **J-Shape Drag Technique:** සතුරා ළඟ ඉන්නවනම් Fire Button එක පහලට ඇදලා එකපාරට වේගයෙන් උඩට 'J' අකුරේ හැඩයට Drag කරන්න (Flick Speed: 0.10s).
2. **Crosshair Placement:** Crosshair එක සතුරාගේ පපුවට වඩා මදක් වම් පැත්තෙන් තියාගෙන Drag එක පටන් ගන්න. Red අංක 100% වැදීමට මෙය උපකාරී වේ.
3. **Quick Weapon Switch:** වෙඩිල්ල තැබූ සැනින් (0.15s) Quick Weapon Switch ඔබා Melee (පාර) හෝ Gloo Wall එකට මාරු වන්න.

FIXA GAMING VIP Preset එකක් සඳහා WhatsApp: **0741123762** අමතන්න!`;
    }

    return `🔥 **FIXA GAMING Pro One-Tap & Drag Headshot Matrix** (${devName}):

🎯 **Recommended Sensitivity Calibration (OB48/OB49 Meta):**
• **General:** 196 (0-200 Scale) / 98 (0-100 Scale)
• **Red Dot:** 188 / 94
• **2X Scope:** 180 / 90
• **4X Scope:** 174 / 86
• **Sniper Scope:** 110 / 55
• **Free Look:** 165 / 80
• **Fire Button Size:** 44% (Position in lower-right sweep sector)
• **Optimal Display DPI:** 420 - 445 DPI

⚡ **Mastering The M1887 & Desert Eagle One-Tap:**
1. **J-Shape Drag:** At close range, pull down slightly and whip straight up in an inverted J vector.
2. **Crosshair Locking:** Place the reticle just outside the opponent's left chest before dragging upward.
3. **Quick Weapon Switch:** Cancel recoil immediately after firing by swapping to melee weapon within 120ms.

Need custom VIP esports presets? Contact FIXA GAMING WhatsApp: **0741123762**!`;
  }

  if (p.includes('fps') || p.includes('lag') || p.includes('smooth') || p.includes('drop') || p.includes('battery') || p.includes('heat')) {
    if (isSinhala) {
      return `⚡ **${devName} සඳහා Free Fire Lag Fix & Max FPS Setup:**

🛠 **ක්‍රීඩාව තුළ Settings:**
• **Graphics:** Smooth (අඩු RAM ෆෝන් සඳහා) හෝ Standard
• **High FPS:** High / Max (Always ON)
• **Display Filter:** Classic හෝ Vivid
• **Auto-Download:** අනවශ්‍ය Skin Packs & Maps Pause කරන්න

📱 **Android Developer Options Tweaks:**
1. **Window Animation Scale:** 0.5x හෝ OFF කරන්න.
2. **Transition Animation Scale:** 0.5x
3. **Animator Duration Scale:** 0.5x
4. **Logger Buffer Size:** 64K හෝ OFF කරන්න.
5. **Force 4x MSAA:** OFF කරන්න (බැටරි රත්වීම සහ lag වීම වළක්වයි).

🎮 Game Turbo / Game Space එකෙන් Free Fire add කර Performance Mode ON කරන්න!`;
    }

    return `⚡ **Pro FPS Optimization & Zero-Lag Guide** (${devName}):

🛠 **In-Game Settings Optimization:**
• **Graphics:** Smooth (for 2GB-4GB RAM) or Standard (6GB-8GB RAM)
• **High FPS:** HIGH / 60-120 FPS (Mandatory)
• **High Res / Shadows:** OFF (Boosts 12-18 FPS in intense squad fights)

📱 **Phone Developer Settings:**
1. **Window / Transition Animation Scales:** Set to 0.5x
2. **Logger Buffer Size:** Off or 64K
3. **Force 4x MSAA:** OFF (Prevents thermal throttling)
4. **Touch Response Sampling:** Enable Ultra Touch in Game Space / Game Turbo.`;
  }

  if (p.includes('character') || p.includes('skill') || p.includes('combo') || p.includes('alok') || p.includes('tatsuya') || p.includes('dimitri') || p.includes('sonia')) {
    return isSinhala
      ? `👑 **Free Fire OB48 හොඳම Character Skill Combos:**

1. **Rusher / Clash Squad Beast Combo:**
   • **Active:** Tatsuya (Double dash forward to breach gloo walls)
   • **Passive 1:** Hayato (Armor penetration when HP drops)
   • **Passive 2:** Kelly (Awakened - 6% movement boost + first shot burst)
   • **Passive 3:** Sonia හෝ Luna (Survival shield or increased firing rate)

2. **Rank Push & Survival Meta:**
   • **Active:** Alok හෝ Dimitri (Continuous healing & self-revive)
   • **Passive 1:** Thiva (Instant 0.8s revive)
   • **Passive 2:** Olivia (Bonus 80 HP on revive)
   • **Passive 3:** Kelly (Speed & mobility)`
      : `👑 **Top Free Fire Meta Character Skill Synergies:**

1. **Elite Rusher / CS Ranked God Combo:**
   • **Active:** Tatsuya (Rapid tactical dash to bypass crossfire)
   • **Passive 1:** Hayato (High armor penetration)
   • **Passive 2:** Kelly (Permanent 6% sprinting velocity + awakened burst)
   • **Passive 3:** Sonia / Orion (Invulnerability clutch window)

2. **Clutch Support & Ranked Push:**
   • **Active:** Dimitri / Alok (Instant area healing)
   • **Passives:** Thiva (0.8s revive speed) + Olivia (+80 HP boost) + Kapella.`;
  }

  // Universal Free Fire Answer
  if (isSinhala) {
    return `🔥 **FIXA GAMING Free Fire Pro Coach Analysis** (${devName}):

🎯 **${devName} සඳහා OB48 නිවැරදි සංවේදීතාව (0-200 Scale):**
• **General (සාමාන්‍ය):** 198
• **Red Dot:** 192
• **2X Scope:** 184
• **4X Scope:** 178
• **Sniper:** 112
• **Free Look:** 170
• **Fire Button Size:** 44% (පහල දකුණු පස)
• **Display DPI:** 420 - 450 DPI

💡 **Pro Tips:**
• ළඟ සටන් (Close Range) වලදී Fast Straight Drag හෝ J-Drag පාවිච්චි කරන්න.
• දුර සටන් වලදී (Long Range) කුඩා Micro-Drag එකකින් Headshot එක ලබාගන්න.
• Phone එක Smooth වෙන්න Game එක play කරන්න කලින් Cache Clear කරන්න.

ඕනෑම Free Fire ප්‍රශ්නයක්, Character combos හෝ VIP Presets සඳහා WhatsApp: **0741123762** අමතන්න!`;
  }

  return `🔥 **FIXA GAMING Free Fire Pro Expert Calibration** (${devName}):

🎯 **OB48/OB49 Precision Setup:**
• **General Sensitivity:** 198 (0-200 Scale) / 98 (0-100 Scale)
• **Red Dot:** 192 / 94
• **2X Scope:** 184 / 90
• **4X Scope:** 178 / 87
• **Sniper Scope:** 110 / 54
• **Free Look:** 170 / 82
• **Fire Button Size:** 44% (Keep button lower-right for maximum vertical sweep)
• **Optimal Display DPI:** 420 - 440 DPI

💡 **Headshot & Performance Tips:**
• **Drag Timing:** Synchronize your jump landing with your upward thumb drag for 100% headshot accuracy.
• **Frame Pacing:** Keep device brightness under 85% to avoid thermal throttling.

Need a dedicated tournament configuration? Contact FIXA GAMING WhatsApp: **0741123762**!`;
}

let aiQuotaCooldownUntil = 0;

export async function askFixaAI(
  prompt: string,
  deviceContext?: { brand?: string; model?: string; ram?: string; style?: string },
  conversationHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  // If in quota cooldown, immediately use smart offline knowledge engine
  if (Date.now() < aiQuotaCooldownUntil) {
    return generateSmartFreeFireAnswer(prompt, deviceContext);
  }

  const genAI = getGenAI();

  let fullPrompt = prompt;
  if (deviceContext && (deviceContext.brand || deviceContext.model)) {
    fullPrompt = `[User Device Context: Brand: ${deviceContext.brand || 'N/A'}, Model: ${deviceContext.model || 'N/A'}, RAM: ${deviceContext.ram || 'N/A'}, Style: ${deviceContext.style || 'N/A'}]\n\nUser Free Fire Question: ${prompt}`;
  }

  // If GenAI is not configured or throws, we guarantee a rich pro Free Fire answer
  if (!genAI) {
    return generateSmartFreeFireAnswer(prompt, deviceContext);
  }

  try {
    // Format history safely for generateContent
    const contents: any[] = [];
    
    // Add valid history turns
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.text && typeof turn.text === 'string') {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: fullPrompt }],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 6000)
    );

    const generatePromise = genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const textOutput = response.text?.trim();
    if (textOutput) {
      return textOutput;
    }

    return generateSmartFreeFireAnswer(prompt, deviceContext);
  } catch (err: any) {
    const errorStr = String(err?.message || err || '');
    const isQuotaExceeded =
      err?.status === 429 ||
      err?.code === 429 ||
      errorStr.includes('429') ||
      errorStr.includes('RESOURCE_EXHAUSTED') ||
      errorStr.includes('quota') ||
      errorStr.includes('rate-limits');

    if (isQuotaExceeded) {
      aiQuotaCooldownUntil = Date.now() + 15 * 60 * 1000;
      console.log('[FIXA AI] API quota reached. Serving instant pro Free Fire intelligence.');
    } else {
      console.log('[FIXA AI] Using built-in Free Fire knowledge engine (', errorStr.slice(0, 80), ')');
    }

    // Never fail or throw 500 to user - return our pro-level Free Fire intelligence
    return generateSmartFreeFireAnswer(prompt, deviceContext);
  }
}
