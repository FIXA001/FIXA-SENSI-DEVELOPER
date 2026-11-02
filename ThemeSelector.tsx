import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme, ThemeId, THEMES } from '../context/ThemeContext';

interface ThemeSelectorProps {
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelectTheme = (id: ThemeId) => {
    setTheme(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-xl border transition-all flex items-center gap-2 cursor-pointer shadow-sm group ${
          compact
            ? 'p-2 bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 text-zinc-300'
            : 'px-3 py-1.5 bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-500 text-white'
        }`}
        title="Change Free Fire Theme"
        aria-label="Select website theme"
      >
        {/* Color Swatch Dot */}
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ring-1 ring-white/20 transition-transform group-hover:scale-110 flex items-center justify-center text-[10px]"
          style={{ backgroundColor: currentTheme.primaryColor }}
        >
          {currentTheme.icon}
        </span>

        {!compact && (
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-[11px] font-heading font-black uppercase tracking-wider text-white">
              {currentTheme.name}
            </span>
            <span className="text-[9px] text-zinc-400 font-medium">Theme</span>
          </div>
        )}

        <Palette className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors ml-0.5" />
      </button>

      {/* Floating Theme Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-zinc-950/95 border-2 border-zinc-800 shadow-[0_15px_50px_rgba(0,0,0,0.9)] p-3 z-50 backdrop-blur-xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="font-heading font-black text-xs uppercase tracking-wider text-white">
                FREE FIRE GAMING THEMES
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 px-1 mb-2.5">
            Select your favorite Free Fire Gun Skin Vibe. Auto-saved to your device.
          </p>

          {/* Theme Options */}
          <div className="space-y-1.5">
            {availableThemes.map((theme) => {
              const isActive = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 border-white/30 shadow-md ring-1 ring-white/20'
                      : 'bg-zinc-900/40 border-zinc-800/70 hover:bg-zinc-900/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Color Pill */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md shrink-0 bg-gradient-to-br ${theme.bgGradient}`}
                    >
                      <span>{theme.icon}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-black text-xs text-white truncate">
                          {theme.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium truncate">
                          • {theme.tagline || theme.subtitle}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium truncate flex items-center gap-1">
                        <span className="text-zinc-500">{theme.ffGunSkin}</span>
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-black shrink-0 ml-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span
                      className="w-3 h-3 rounded-full opacity-30 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-500 px-1 font-mono">
            <span>OB48 Esports Engine</span>
            <span>Instant Switch</span>
          </div>
        </div>
      )}
    </div>
  );
};
