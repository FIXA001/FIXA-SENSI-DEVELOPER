import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FixaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  glow?: boolean;
}

export const FixaLogo: React.FC<FixaLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  glow = false,
}) => {
  const themeContext = (() => {
    try {
      return useTheme();
    } catch {
      return null;
    }
  })();

  const currentTheme = themeContext?.currentTheme;

  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    try {
      const custom = localStorage.getItem('fixa_custom_logo');
      if (custom) return custom;
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    // Relative path works on root domain and GitHub Pages repo subpaths (e.g. /repo-name/)
    return './fixa-gaming-logo.svg';
  });

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 md:h-12 md:w-12',
    lg: 'h-16 w-16 md:h-20 md:w-20',
    xl: 'h-24 w-24 md:h-28 md:w-28',
    hero: 'h-32 w-32 md:h-44 md:w-44',
  }[size];

  const handleImgError = () => {
    if (imgSrc.startsWith('.')) {
      setImgSrc('/fixa-gaming-logo.svg');
    } else {
      setHasError(true);
    }
  };

  const primaryColor = currentTheme?.primaryColor || '#ef4444';
  const secondaryColor = currentTheme?.secondaryColor || '#f59e0b';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-xl animate-pulse-glow pointer-events-none"
            style={{ backgroundColor: `${primaryColor}4D` }}
          />
        )}

        {!hasError ? (
          <img
            src={imgSrc}
            alt="FIXA GAMING Official Logo"
            onError={handleImgError}
            className={`${sizeClasses} object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]`}
          />
        ) : (
          /* High-Fidelity Inline Fallback Vector (Ensures Logo NEVER breaks on GitHub Pages) */
          <div className={`${sizeClasses} transition-transform duration-300 hover:scale-105`}>
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="fixaLogoPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={primaryColor} />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
                <linearGradient id="fixaLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor={secondaryColor} />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>

              {/* Shield Body */}
              <polygon
                points="250,40 430,100 395,325 250,445 105,325 70,100"
                fill="#09090b"
                stroke="url(#fixaLogoPrimary)"
                strokeWidth="10"
              />
              <polygon
                points="250,55 410,110 380,310 250,420 120,310 90,110"
                fill="#121217"
                stroke="#27272a"
                strokeWidth="3"
              />

              {/* Golden Wings */}
              <path d="M 120,130 L 190,170 L 150,220 L 100,160 Z" fill="url(#fixaLogoGold)" />
              <path d="M 380,130 L 310,170 L 350,220 L 400,160 Z" fill="url(#fixaLogoGold)" />

              {/* Tactical Crosshair */}
              <circle
                cx="250"
                cy="205"
                r="70"
                fill="none"
                stroke="url(#fixaLogoPrimary)"
                strokeWidth="4"
                strokeDasharray="12,6"
              />
              <line x1="250" y1="115" x2="250" y2="145" stroke={primaryColor} strokeWidth="5" />
              <line x1="250" y1="265" x2="250" y2="295" stroke={primaryColor} strokeWidth="5" />
              <line x1="160" y1="205" x2="190" y2="205" stroke={primaryColor} strokeWidth="5" />
              <line x1="310" y1="205" x2="340" y2="205" stroke={primaryColor} strokeWidth="5" />

              {/* Headshot Star Crown */}
              <polygon
                points="250,85 256,99 270,101 259,110 262,124 250,116 238,124 241,110 230,101 244,99"
                fill="url(#fixaLogoGold)"
              />

              {/* Center Flaming Mask */}
              <path
                d="M 250,150 Q 280,180 295,210 Q 280,245 250,260 Q 220,245 205,210 Q 220,180 250,150 Z"
                fill="url(#fixaLogoPrimary)"
              />
              <polygon points="225,200 240,210 228,215" fill="#ffffff" />
              <polygon points="275,200 260,210 272,215" fill="#ffffff" />

              {/* Banner for FIXA */}
              <path
                d="M 90,320 L 410,320 L 385,375 L 250,400 L 115,375 Z"
                fill="#09090b"
                stroke="url(#fixaLogoPrimary)"
                strokeWidth="4"
              />
              <text
                x="250"
                y="365"
                fontFamily="'Chakra Petch', sans-serif"
                fontWeight="900"
                fontSize="48"
                fill="#ffffff"
                textAnchor="middle"
                letterSpacing="4"
              >
                FIXA
              </text>
            </svg>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-heading font-black text-xl md:text-2xl tracking-wider text-white flex items-center gap-1">
            FIXA <span style={{ color: primaryColor }}>GAMING</span>
          </span>
          <span className="font-accent text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Free Fire Esports Hub
          </span>
        </div>
      )}
    </div>
  );
};
