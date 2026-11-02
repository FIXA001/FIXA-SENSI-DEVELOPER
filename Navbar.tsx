import React, { useState } from 'react';
import { FixaLogo } from './FixaLogo';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  Flame,
  Crosshair,
  Gauge,
  Award,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  Sliders,
  LogOut,
  Download,
  Smartphone,
} from 'lucide-react';
import { openProAimModal } from './ProAimOverlay';
import { ThemeSelector } from './ThemeSelector';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDownloadModal?: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenDownloadModal,
  onOpenInstallModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isVip, isAdmin, user, openLoginModal, logout, whatsappContact, tiktokUrl } = useAuth();

  const navItems = [
    { name: 'Home', isProtected: false },
    { name: 'Free Sensitivity', isProtected: false },
    { name: 'VIP Sensitivity', isProtected: true, badge: 'VIP' },
    { name: 'Free Optimize', isProtected: false },
    { name: 'VIP Optimize', isProtected: true, badge: 'VIP' },
    { name: 'Premium Panel', isProtected: true, badge: 'PREMIUM' },
    { name: 'User Feedback', isProtected: false },
  ];

  const handleNavClick = (pageName: string, isProtected: boolean) => {
    setMobileMenuOpen(false);
    if (isProtected && !isVip) {
      openLoginModal(pageName);
    } else {
      onNavigate(pageName);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090d]/90 backdrop-blur-md border-b border-red-600/30 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => onNavigate('Home')}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <FixaLogo size="md" showText={true} glow={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name, item.isProtected)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-red-600/20 border border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {item.isProtected && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                        item.badge === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Free Fire Theme Selector */}
            <ThemeSelector />

            {/* Pro-Aim Visual Reticle Helper */}
            <button
              onClick={() => openProAimModal()}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow group"
              title="Pro-Aim Crosshair & Drag Placement Helper"
            >
              <Crosshair className="w-4 h-4 text-red-500 group-hover:rotate-45 transition-transform" />
              <span className="hidden lg:inline font-heading uppercase font-bold text-red-400">Pro-Aim</span>
            </button>

            {/* WhatsApp Contact */}
            <a
              href={`https://wa.me/94741123762`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-400 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Chat with FIXA GAMING"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">{whatsappContact}</span>
            </a>

            {/* Install App Button */}
            <button
              onClick={() => (onOpenInstallModal ? onOpenInstallModal() : null)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow"
              title="Install App on Phone"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden 2xl:inline">Install App</span>
            </button>

            {/* Download Complete Website ZIP */}
            <button
              onClick={() => (onOpenDownloadModal ? onOpenDownloadModal() : window.open('/api/download-zip', '_blank'))}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow"
              title="Download Complete Website (.ZIP)"
            >
              <Download className="w-4 h-4 text-red-500" />
              <span className="hidden 2xl:inline">Download ZIP</span>
            </button>

            {/* Auth / VIP Status button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(isAdmin ? 'Admin Dashboard' : 'VIP Sensitivity')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-red-500/50 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span className="truncate max-w-[100px]">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-heading font-black uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center gap-1.5 cursor-pointer transition-all transform active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>VIP Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger & Quick Theme */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeSelector compact={true} />
            {!user && (
              <button
                onClick={() => openLoginModal()}
                className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-heading font-bold uppercase tracking-wider"
              >
                VIP Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0c0c11] border-b border-red-600/40 p-4 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name, item.isProtected)}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-red-600/30 text-white border border-red-500'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isProtected ? (
                    <Crown className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Flame className="w-4 h-4 text-red-500" />
                  )}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      item.badge === 'VIP'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openProAimModal();
              }}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-red-500/40 text-red-400 flex items-center justify-between font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-red-500" />
                <span>Pro-Aim Reticle & Drag Helper</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">HUD</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenInstallModal) onOpenInstallModal();
              }}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-between font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Install FIXA App on Phone</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">PWA</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenDownloadModal) onOpenDownloadModal();
              }}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-red-400 flex items-center justify-between font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Download Complete Website (.ZIP)</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">84 KB</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <a
                href={`https://wa.me/94741123762`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 flex items-center gap-1.5 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {whatsappContact}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('Admin Dashboard');
                }}
                className="text-zinc-500 hover:text-white text-[11px]"
              >
                Owner Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
