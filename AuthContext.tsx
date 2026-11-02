import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'vip';
  expiresAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isVip: boolean;
  isAdmin: boolean;
  isVerifiedTikTok: boolean;
  completeTikTokVerification: () => void;
  resetTikTokVerification: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginModalOpen: boolean;
  targetProtectedTab: string | null;
  openLoginModal: (targetTab?: string) => void;
  closeLoginModal: () => void;
  whatsappContact: string;
  tiktokUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fixa_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [targetProtectedTab, setTargetProtectedTab] = useState<string | null>(null);

  const [isVerifiedTikTok, setIsVerifiedTikTok] = useState<boolean>(() => {
    return localStorage.getItem('fixa_tiktok_verified') === 'true';
  });

  const whatsappContact = '0741123762';
  const tiktokUrl = 'https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl';

  useEffect(() => {
    const verifyExistingToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('fixa_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error verifying auth token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingToken();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('fixa_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fixa_auth_token');
    setToken(null);
    setUser(null);
  };

  const completeTikTokVerification = () => {
    localStorage.setItem('fixa_tiktok_verified', 'true');
    setIsVerifiedTikTok(true);
  };

  const resetTikTokVerification = () => {
    localStorage.removeItem('fixa_tiktok_verified');
    setIsVerifiedTikTok(false);
  };

  const openLoginModal = (targetTab?: string) => {
    if (targetTab) setTargetProtectedTab(targetTab);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setTargetProtectedTab(null);
  };

  const isVip = !!user && (user.role === 'vip' || user.role === 'admin');
  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isVip,
        isAdmin,
        isVerifiedTikTok,
        completeTikTokVerification,
        resetTikTokVerification,
        login,
        logout,
        loginModalOpen,
        targetProtectedTab,
        openLoginModal,
        closeLoginModal,
        whatsappContact,
        tiktokUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
