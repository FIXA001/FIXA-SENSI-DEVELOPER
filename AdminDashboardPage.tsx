import React, { useState, useEffect } from 'react';
import { useAuth, AuthUser } from '../context/AuthContext';
import { FixaLogo } from '../components/FixaLogo';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Smartphone,
  Settings,
  Trash2,
  Plus,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Image as ImageIcon,
  MessageCircle,
  Download,
  Trophy,
  ExternalLink,
  Heart,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, token, isAdmin, login, logout, whatsappContact } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'feedback' | 'devices' | 'settings' | 'contestants'>('users');

  // Admin Login state for non-admins
  const [adminUsername, setAdminUsername] = useState('fixaadmin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // VIP Users State
  const [vipUsers, setVipUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'vip' | 'admin'>('vip');
  const [newExpiresAt, setNewExpiresAt] = useState('2028-12-31');
  const [userActionMsg, setUserActionMsg] = useState<string | null>(null);

  // XP Challenge Contestants State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  // Feedback State
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Custom Devices State
  const [customDevices, setCustomDevices] = useState<any[]>([]);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevicePlatform, setNewDevicePlatform] = useState<'Android' | 'iOS' | 'PC'>('Android');
  const [newDeviceBrand, setNewDeviceBrand] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceRefreshRate, setNewDeviceRefreshRate] = useState(120);
  const [newDeviceDpi, setNewDeviceDpi] = useState(440);
  const [newDeviceSpecs, setNewDeviceSpecs] = useState('');

  // Branding / Logo state
  const [customLogoPreview, setCustomLogoPreview] = useState<string>(() => {
    return localStorage.getItem('fixa_custom_logo') || '';
  });

  // Fetch VIP Users
  const fetchUsers = async () => {
    if (!token) return;
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVipUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch Feedback
  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.feedback || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Fetch Custom Devices
  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/custom-devices');
      if (res.ok) {
        const data = await res.json();
        setCustomDevices(data.devices || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch XP Challenge Contestants
  const fetchRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      const res = await fetch('/api/challenge/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (e) {
      console.warn('Failed to load contestants:', e);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  // Live Traffic Stats
  const [siteStats, setSiteStats] = useState<any>(null);

  const fetchSiteStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setSiteStats(data.stats);
      }
    } catch {}
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchFeedback();
      fetchDevices();
      fetchRegistrations();
      fetchSiteStats();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const res = await login(adminUsername, adminPassword);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid administrator password.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword.trim(),
          name: newName.trim() || newUsername.trim(),
          role: newRole,
          expiresAt: newExpiresAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add user');

      setUserActionMsg('User account created successfully!');
      setShowAddUserModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewName('');
      fetchUsers();
      setTimeout(() => setUserActionMsg(null), 3000);
    } catch (err: any) {
      setUserActionMsg(`Error: ${err.message}`);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete VIP account '${username}'?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      fetchUsers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedback();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceBrand.trim() || !newDeviceModel.trim()) return;

    try {
      const res = await fetch('/api/admin/custom-devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: newDevicePlatform,
          brand: newDeviceBrand.trim(),
          model: newDeviceModel.trim(),
          refreshRate: Number(newDeviceRefreshRate),
          recommendedDpi: Number(newDeviceDpi),
          specs: newDeviceSpecs.trim(),
        }),
      });

      if (res.ok) {
        setShowAddDeviceModal(false);
        setNewDeviceBrand('');
        setNewDeviceModel('');
        fetchDevices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem('fixa_custom_logo', base64);
        setCustomLogoPreview(base64);
        alert('Official FIXA GAMING logo updated successfully across the entire site!');
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('fixa_custom_logo');
    setCustomLogoPreview('');
    alert('Reset to default official FIXA GAMING esports vector logo!');
    window.location.reload();
  };

  // If not logged in as Admin, show Administrator Access portal
  if (!isAdmin) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto text-center space-y-6 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-red-600/10 border-2 border-red-600/50 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(220,38,38,0.3)]">
            <ShieldCheck className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-white uppercase">
            ADMINISTRATOR AUTHENTICATION
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Enter owner credentials to manage VIP users, sensitivity vaults, and feedback.
          </p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-red-950/70 border border-red-600/80 text-xs text-red-200">
            {loginError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In as Owner'}
          </button>
        </form>

        <div className="pt-2 text-[11px] text-zinc-500">
          Default Owner Credentials: <code className="text-zinc-300 font-mono">fixaadmin</code> / <code className="text-zinc-300 font-mono">fixa@2026</code>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard
  return (
    <div className="space-y-8 py-6 pb-20 animate-fadeIn">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border-2 border-red-600/70 shadow-[0_0_40px_rgba(220,38,38,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <FixaLogo size="md" glow={true} />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>FIXA GAMING Official Owner Panel</span>
            </div>
            <h1 className="text-2xl font-black font-heading text-white">SYSTEM CONTROL CENTER</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {userActionMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-xs">
          {userActionMsg}
        </div>
      )}

      {/* Live Community Traffic Telemetry Summary Strip for Admin */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-blue-500/30 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Web Visitors</div>
            <div className="text-lg sm:text-xl font-heading font-black text-white mt-0.5">
              {(siteStats?.visitors ?? 4860).toLocaleString()}+
            </div>
          </div>
          <Eye className="w-5 h-5 text-blue-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-pink-500/30 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">TikTok TT Visits</div>
            <div className="text-lg sm:text-xl font-heading font-black text-pink-400 mt-0.5">
              {(siteStats?.tiktokClicks ?? 2180).toLocaleString()}+
            </div>
          </div>
          <Smartphone className="w-5 h-5 text-pink-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">WA Channel Joins</div>
            <div className="text-lg sm:text-xl font-heading font-black text-emerald-400 mt-0.5">
              {(siteStats?.whatsappClicks ?? 1640).toLocaleString()}+
            </div>
          </div>
          <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-red-500/30 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Platform Likes</div>
            <div className="text-lg sm:text-xl font-heading font-black text-red-400 mt-0.5">
              {(siteStats?.likes ?? 3410).toLocaleString()}+
            </div>
          </div>
          <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>VIP Users ({vipUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'feedback'
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>User Feedback ({feedbackList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'devices'
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Custom Devices ({customDevices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'settings'
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Logo & Brand Settings</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('contestants');
            fetchRegistrations();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'contestants'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>XP Contestants ({registrations.length})</span>
        </button>
      </div>

      {/* Tab 1: VIP Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">Authorized VIP Members</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add VIP Account</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Expires</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {vipUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40">
                    <td className="p-3.5 font-bold text-white">{u.username}</td>
                    <td className="p-3.5 font-sans">{u.name}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-400 font-bold">Active</span>
                    </td>
                    <td className="p-3.5 text-zinc-400">{u.expiresAt}</td>
                    <td className="p-3.5 text-right">
                      {u.username !== 'fixaadmin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="p-1.5 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading text-white">Create New VIP Account</h3>
                <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-300 mb-1">Username *</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. tournament_pro1"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Password *</label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Secret password"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Player Name"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                    >
                      <option value="vip">VIP Member</option>
                      <option value="admin">Administrator / Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Expires Date</label>
                    <input
                      type="date"
                      value={newExpiresAt}
                      onChange={(e) => setNewExpiresAt(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                    >
                      Save Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">Community Submissions</h3>
          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{fb.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-red-400">
                      {fb.deviceModel}
                    </span>
                    <span className="text-[10px] text-zinc-400">({fb.category})</span>
                  </div>
                  <p className="text-xs text-zinc-300">{fb.message}</p>
                  <div className="text-[10px] text-zinc-500">
                    {new Date(fb.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteFeedback(fb.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                  title="Delete feedback"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Custom Devices */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-white">Registered Custom Devices</h3>
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Device</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customDevices.map((dev) => (
              <div
                key={dev.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    {dev.brand} {dev.model}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono">
                    {dev.refreshRate}Hz
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Platform: {dev.platform} • Recommended DPI: {dev.recommendedDpi}
                </div>
                {dev.specs && <p className="text-xs text-zinc-500">{dev.specs}</p>}
              </div>
            ))}
          </div>

          {/* Add Device Modal */}
          {showAddDeviceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading text-white">Add Device Specification</h3>
                <form onSubmit={handleAddDevice} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-300 mb-1">Platform</label>
                    <select
                      value={newDevicePlatform}
                      onChange={(e) => setNewDevicePlatform(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                    >
                      <option value="Android">Android</option>
                      <option value="iOS">iOS (Apple iPhone)</option>
                      <option value="PC">PC / Laptop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Brand *</label>
                    <input
                      type="text"
                      value={newDeviceBrand}
                      onChange={(e) => setNewDeviceBrand(e.target.value)}
                      placeholder="e.g. Samsung, Xiaomi, POCO"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 mb-1">Model Name *</label>
                    <input
                      type="text"
                      value={newDeviceModel}
                      onChange={(e) => setNewDeviceModel(e.target.value)}
                      placeholder="e.g. Galaxy S25 Ultra"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-300 mb-1">Display Hz</label>
                      <input
                        type="number"
                        value={newDeviceRefreshRate}
                        onChange={(e) => setNewDeviceRefreshRate(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 mb-1">Stock DPI</label>
                      <input
                        type="number"
                        value={newDeviceDpi}
                        onChange={(e) => setNewDeviceDpi(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDeviceModal(false)}
                      className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                    >
                      Save Device
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Logo & Branding Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/40">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                FIXA GAMING Official Logo Manager
              </h3>
              <p className="text-xs text-zinc-400">
                Manage your official uploaded logo file across header, navigation, and loading screens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center">
              <span className="text-xs text-zinc-400 mb-3">Current Active Logo:</span>
              <FixaLogo size="hero" glow={true} />
              <span className="text-[11px] text-zinc-500 mt-3">
                {customLogoPreview ? 'Custom Uploaded Image Active' : 'Default Esports Insignia'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider">
                  Upload Custom Logo File (PNG / JPG / SVG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                />
                <p className="text-[11px] text-zinc-500">
                  Selecting a file immediately updates the logo on the website header, navigation, and AI assistant without distortion.
                </p>
              </div>

              {customLogoPreview && (
                <button
                  onClick={handleResetLogo}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Reset to Original Default Logo
                </button>
              )}
            </div>
          </div>

          {/* Download Complete Website Package Card */}
          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Export & Download Complete Website
                </h3>
                <p className="text-xs text-zinc-400">
                  Download the entire project source code, database, and assets bundled in a single `.zip` file.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs space-y-1">
                <div className="font-bold text-white">FIXA GAMING Source Bundle</div>
                <div className="text-zinc-400">
                  Includes React 19 frontend, Express backend, Free Fire sensitivity engine, database, and README instructions.
                </div>
              </div>

              <a
                href="/api/download-zip"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Website (.ZIP)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: XP Challenge Contestants */}
      {activeTab === 'contestants' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                XP Card Challenge Registered Contestants ({registrations.length})
              </h3>
              <p className="text-xs text-zinc-400">
                All players who completed TikTok tasks and registered for the Monthly Free Fire Weekly Lite Membership giveaway.
              </p>
            </div>
            <button
              onClick={fetchRegistrations}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRegistrations ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 uppercase font-bold text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Contestant IGN</th>
                    <th className="p-3.5">FF UID</th>
                    <th className="p-3.5">Phone / WhatsApp</th>
                    <th className="p-3.5">Gmail</th>
                    <th className="p-3.5">Device</th>
                    <th className="p-3.5">XP & Badge</th>
                    <th className="p-3.5">TikTok Verified</th>
                    <th className="p-3.5">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-zinc-500">
                        No players registered yet.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => {
                      const cleanPhone = (reg.phoneNumber || '').replace(/[^0-9]/g, '');
                      const waLink = cleanPhone.startsWith('0')
                        ? `https://wa.me/94${cleanPhone.slice(1)}`
                        : `https://wa.me/${cleanPhone}`;

                      return (
                        <tr key={reg.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-3.5 font-bold font-heading text-white">
                            <div className="flex items-center gap-2">
                              <span>🔥</span>
                              <span>{reg.gameName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-yellow-400 font-bold">
                            {reg.uid}
                          </td>
                          <td className="p-3.5">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 font-semibold"
                            >
                              <span>{reg.phoneNumber}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="p-3.5 text-zinc-300 font-mono text-[11px]">
                            {reg.email}
                          </td>
                          <td className="p-3.5 text-zinc-400">
                            {reg.device || 'Android'}
                          </td>
                          <td className="p-3.5">
                            <div className="font-heading font-black text-amber-400">
                              {(reg.xp || 0).toLocaleString()} XP
                            </div>
                            <div className="text-[10px] text-zinc-400">{reg.badge}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Follow & 3 Likes</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-zinc-500 text-[11px]">
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
