import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FixaLogo } from './components/FixaLogo';
import { LoginModal } from './components/LoginModal';
import { TikTokVerificationGate } from './components/TikTokVerificationGate';
import { FixaAIChat } from './components/FixaAIChat';
import { DownloadModal } from './components/DownloadModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ProAimOverlay } from './components/ProAimOverlay';

// Pages
import { HomePage } from './pages/HomePage';
import { FreeSensitivityPage } from './pages/FreeSensitivityPage';
import { VipSensitivityPage } from './pages/VipSensitivityPage';
import { FreeOptimizePage } from './pages/FreeOptimizePage';
import { VipOptimizePage } from './pages/VipOptimizePage';
import { PremiumPanelPage } from './pages/PremiumPanelPage';
import { UserFeedbackPage } from './pages/UserFeedbackPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('Home');
  const [activeDeviceContext, setActiveDeviceContext] = useState<{
    brand: string;
    model: string;
    style: string;
  }>({
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    style: 'One Tap',
  });

  const [aiTrigger, setAiTrigger] = useState<{ query: string; timestamp: number } | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);

  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Initial loading screen for high-tech esports entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAIWithDevice = (context: { brand: string; model: string; style: string }) => {
    setActiveDeviceContext(context);
    setAiTrigger({
      query: `What is the optimal Free Fire sensitivity and drag technique for my ${context.brand} ${context.model} playing ${context.style}?`,
      timestamp: Date.now(),
    });
  };

  const handleAskAIWithHealth = (healthQuery: string) => {
    setAiTrigger({
      query: healthQuery,
      timestamp: Date.now(),
    });
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="relative flex flex-col items-center text-center space-y-6 animate-pulse">
          <FixaLogo size="hero" glow={true} />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black font-heading tracking-widest text-white uppercase">
              FIXA <span className="text-red-500">GAMING</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs text-red-400 font-mono tracking-wider uppercase">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Initializing Free Fire Neural Engine...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-slate-100 selection:bg-red-600 selection:text-white relative">
      {/* TikTok Verification Gate (shown before entering if not completed) */}
      <TikTokVerificationGate />

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {currentPage === 'Home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'Free Sensitivity' && (
          <FreeSensitivityPage onAskAIWithDevice={handleAskAIWithDevice} />
        )}
        {currentPage === 'VIP Sensitivity' && <VipSensitivityPage />}
        {currentPage === 'Free Optimize' && (
          <FreeOptimizePage onAskAIWithHealth={handleAskAIWithHealth} />
        )}
        {currentPage === 'VIP Optimize' && <VipOptimizePage />}
        {currentPage === 'Premium Panel' && <PremiumPanelPage />}
        {currentPage === 'User Feedback' && <UserFeedbackPage />}
        {currentPage === 'Admin Dashboard' && <AdminDashboardPage />}
      </main>

      {/* Global Gaming Login Modal (opened on clicking locked VIP features) */}
      <LoginModal onSuccessNavigate={handleNavigate} />

      {/* Download Code Package Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      {/* Install Mobile App (PWA) Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />

      {/* Floating FIXA AI Assistant */}
      <FixaAIChat activeDeviceContext={activeDeviceContext} externalTrigger={aiTrigger} />

      {/* Pro-Aim Visual Helper Overlay & Training Studio */}
      <ProAimOverlay />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
