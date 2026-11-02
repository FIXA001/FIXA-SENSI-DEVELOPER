import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'crimson' | 'cobra' | 'venom' | 'gold' | 'draco';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  sinhalaName?: string;
  subtitle: string;
  icon: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  glowColor: string;
  textClass: string;
  borderClass: string;
  bgGradient: string;
  previewBg: string;
  ffGunSkin: string;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson Fire',
    tagline: 'Classic Red',
    sinhalaName: 'Classic Red',
    subtitle: 'Classic One-Tap Flame',
    icon: '🔥',
    primaryColor: '#ef4444',
    secondaryColor: '#f97316',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    textClass: 'text-red-500',
    borderClass: 'border-red-500/50',
    bgGradient: 'from-red-600 to-amber-600',
    previewBg: 'bg-red-600',
    ffGunSkin: 'M1887 One-Tap & Incubator',
  },
  cobra: {
    id: 'cobra',
    name: 'Cobra Cyan',
    tagline: 'Electric Neon Blue',
    sinhalaName: 'Electric Neon Blue',
    subtitle: 'Electric Zero-Recoil Neon',
    icon: '⚡',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/50',
    bgGradient: 'from-cyan-500 to-blue-600',
    previewBg: 'bg-cyan-500',
    ffGunSkin: 'MP40 Predatory Cobra EVO',
  },
  venom: {
    id: 'venom',
    name: 'Venom Emerald',
    tagline: 'Acid Green Matrix',
    sinhalaName: 'Acid Green Matrix',
    subtitle: 'Acid Green Drag Matrix',
    icon: '🐍',
    primaryColor: '#10b981',
    secondaryColor: '#84cc16',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/50',
    bgGradient: 'from-emerald-500 to-lime-500',
    previewBg: 'bg-emerald-500',
    ffGunSkin: 'M1014 Green Flame Draco',
  },
  gold: {
    id: 'gold',
    name: 'Royale Gold',
    tagline: 'VIP Gold Edition',
    sinhalaName: 'VIP Gold Edition',
    subtitle: 'Luxury Poker MP40 Edition',
    icon: '👑',
    primaryColor: '#eab308',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/50',
    bgGradient: 'from-yellow-400 to-amber-600',
    previewBg: 'bg-yellow-400',
    ffGunSkin: 'Flashing Spade Poker MP40',
  },
  draco: {
    id: 'draco',
    name: 'EVO Draco',
    tagline: 'Dragon Shadow Purple',
    sinhalaName: 'Dragon Shadow Purple',
    subtitle: 'Mystic Dragon Shadow Purple',
    icon: '🟣',
    primaryColor: '#a855f7',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/50',
    bgGradient: 'from-purple-500 to-pink-600',
    previewBg: 'bg-purple-500',
    ffGunSkin: 'AK47 Blue Flame Draco EVO',
  },
};

interface ThemeContextType {
  currentTheme: ThemeDefinition;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'fixa_gaming_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && saved in THEMES) {
        return saved as ThemeId;
      }
    } catch (e) {
      console.warn('Storage theme load error:', e);
    }
    return 'crimson';
  });

  const currentTheme = THEMES[themeId] || THEMES.crimson;

  const applyThemeToDOM = (theme: ThemeDefinition) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.id);
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-glow', theme.glowColor);
  };

  const handleSetTheme = (id: ThemeId) => {
    if (THEMES[id]) {
      setThemeId(id);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, id);
      } catch (e) {
        console.warn('Storage theme save error:', e);
      }
      applyThemeToDOM(THEMES[id]);
    }
  };

  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setTheme: handleSetTheme,
        availableThemes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
