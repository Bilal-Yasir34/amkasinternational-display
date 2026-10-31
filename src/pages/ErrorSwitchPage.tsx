import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Power,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertOctagon,
  LogOut,
  Info,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import {
  checkCurrentSuspensionStatus,
  toggleSiteSuspension,
  verifyMasterPin,
  updateMasterPin,
  DEFAULT_MASTER_PIN,
} from '@/lib/siteSuspension';
import SupabasePausedScreen from '@/components/SupabasePausedScreen';

export default function ErrorSwitchPage() {
  const { session, signIn, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Authentication & authorization states
  const [pinInput, setPinInput] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@amkasinternational.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Switch states
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [toggling, setToggling] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Master PIN change modal
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');

  // Fetch initial suspension status
  useEffect(() => {
    document.title = 'Infrastructure Switch Control';
    checkCurrentSuspensionStatus()
      .then((status) => {
        setIsSuspended(status);
      })
      .catch(() => {})
      .finally(() => setLoadingStatus(false));
  }, []);

  const isAuthorized = Boolean(session) || pinUnlocked;

  // Handle Admin Sign-in to satisfy Supabase RLS
  async function handleAdminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signIn(emailInput, passwordInput);
      toast('Admin authenticated successfully');
      setPinUnlocked(true);
      const latest = await checkCurrentSuspensionStatus();
      setIsSuspended(latest);
    } catch (err) {
      toast((err as Error).message || 'Invalid admin credentials', 'error');
    } finally {
      setAuthLoading(false);
    }
  }

  // Handle Passcode Unlock
  function handlePinUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (verifyMasterPin(pinInput)) {
      setPinUnlocked(true);
      toast('Master access granted');
    } else {
      toast('Incorrect Master Passcode', 'error');
    }
  }

  // Main Toggle Action
  async function handleToggleSwitch() {
    if (!session) {
      toast('Please sign in with Admin credentials below to update Supabase database', 'error');
      return;
    }

    const targetState = !isSuspended;
    setToggling(true);
    try {
      await toggleSiteSuspension(targetState);
      setIsSuspended(targetState);
      if (targetState) {
        toast('Error Switch ENABLED: Entire website is now locked out with Supabase Error!', 'error');
      } else {
        toast('Error Switch DISABLED: Entire website is now restored LIVE!');
      }
    } catch (err) {
      toast(`Failed to update switch: ${(err as Error).message}`, 'error');
    } finally {
      setToggling(false);
    }
  }

  function handleSaveNewPin(e: React.FormEvent) {
    e.preventDefault();
    if (!newPin.trim()) return;
    updateMasterPin(newPin);
    toast('Master passcode updated');
    setShowPinModal(false);
    setNewPin('');
  }

  async function handleLockConsole() {
    setPinUnlocked(false);
    if (session) {
      await signOut();
    }
    toast('Console locked');
  }

  if (previewMode) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-[1000001]">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black shadow-2xl hover:bg-emerald-400 transition"
          >
            <EyeOff className="h-4 w-4" /> Exit Preview Mode
          </button>
        </div>
        <SupabasePausedScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1013] text-ink-100 p-4 sm:p-8 font-sans selection:bg-[#3ecf8e]/30 selection:text-[#3ecf8e]">
      <div className="mx-auto max-w-4xl">
        {/* Stealth Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b1e24] border border-white/10 text-[#3ecf8e]">
              <Power className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-white">
                  Stealth Emergency Switch
                </h1>
                <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase text-red-400 border border-red-500/20">
                  Unlisted Route
                </span>
              </div>
              <p className="text-xs text-white/50">
                Hidden infrastructure control for instant website suspension / restoration
              </p>
            </div>
          </div>

          {isAuthorized && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 transition"
              >
                <Eye className="h-3.5 w-3.5 text-[#3ecf8e]" /> Preview Error Screen
              </button>
              <button
                type="button"
                onClick={handleLockConsole}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Lock Console
              </button>
            </div>
          )}
        </header>

        {/* If NOT authorized: Gatekeeper Screen */}
        {!isAuthorized ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#16191f] p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#3ecf8e] border border-white/10">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-white">Master Authorization</h2>
              <p className="mt-1 text-xs text-white/50">
                Authenticate to access the hidden switch console.
              </p>
            </div>

            {/* Quick Master PIN Option */}
            <form onSubmit={handlePinUnlock} className="mb-6 border-b border-white/10 pb-6">
              <label className="mb-1 block text-xs font-medium text-white/70">
                Method 1: Master Passcode (Quick)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder={`Default: ${DEFAULT_MASTER_PIN}`}
                  className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#3ecf8e] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition border border-white/10"
                >
                  Unlock
                </button>
              </div>
            </form>

            {/* Supabase Admin Login Option */}
            <form onSubmit={handleAdminSignIn} className="space-y-3">
              <label className="block text-xs font-medium text-white/70">
                Method 2: Admin Account Credentials (Required to push changes to Supabase)
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@amkasinternational.com"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#3ecf8e] focus:outline-none"
              />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Admin password"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#3ecf8e] focus:outline-none"
              />
              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-xl bg-[#3ecf8e] py-2.5 text-xs font-semibold text-black hover:bg-[#3ecf8e]/90 transition"
              >
                {authLoading ? 'Signing in...' : 'Sign In & Access Switch'}
              </button>
            </form>
          </div>
        ) : (
          /* Main Control Panel */
          <div className="space-y-6">
            {/* Global Status Banner */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
                isSuspended
                  ? 'border-red-500/30 bg-red-950/20 shadow-lg shadow-red-950/20'
                  : 'border-emerald-500/30 bg-emerald-950/20 shadow-lg shadow-emerald-950/20'
              }`}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                          isSuspended ? 'bg-red-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex h-3 w-3 rounded-full ${
                          isSuspended ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                      />
                    </span>
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-wider ${
                        isSuspended ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isSuspended ? 'SITE IS CURRENTLY PAUSED' : 'SITE IS LIVE & ACTIVE'}
                    </span>
                  </div>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
                    {isSuspended
                      ? 'Error Screen Active Across Website'
                      : 'Website Is Normal & Accessible'}
                  </h2>

                  <p className="mt-1 text-xs text-white/60 sm:text-sm">
                    {isSuspended
                      ? 'Anyone searching or opening the website (including /admin) sees the Supabase suspension screen. All normal pages are completely locked.'
                      : 'Visitors and admins can browse the website and dashboard normally.'}
                  </p>
                </div>

                {/* Big High-Impact Master Toggle Button */}
                <button
                  type="button"
                  disabled={toggling || loadingStatus}
                  onClick={handleToggleSwitch}
                  className={`group relative flex items-center justify-center gap-3 rounded-2xl px-8 py-5 font-serif text-base font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                    isSuspended
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                      : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30'
                  }`}
                >
                  <Power className="h-6 w-6 transition-transform group-hover:scale-110" />
                  <span>
                    {toggling
                      ? 'Updating Supabase...'
                      : isSuspended
                      ? 'Turn OFF Error (Make Site Live)'
                      : 'Turn ON Error (Lock Website)'}
                  </span>
                </button>
              </div>

              {!session && (
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300 border border-amber-500/20">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    Note: To persist the switch directly to the remote Supabase database, make sure you are signed in as an admin below.
                  </span>
                </div>
              )}
            </div>

            {/* Quick Live Testing Links */}
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#16191f] p-5 hover:border-white/20 transition group"
              >
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-[#3ecf8e] transition">
                    Test Public Website (Home)
                  </p>
                  <p className="text-xs text-white/50">Open www.xyz.com in a new tab</p>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white transition" />
              </a>

              <a
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#16191f] p-5 hover:border-white/20 transition group"
              >
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-[#3ecf8e] transition">
                    Test Admin Panel (/admin)
                  </p>
                  <p className="text-xs text-white/50">Open www.xyz.com/admin in a new tab</p>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white transition" />
              </a>
            </div>

            {/* Explanation & Technical Details */}
            <div className="rounded-3xl border border-white/10 bg-[#14161c] p-6 text-xs text-white/70">
              <h3 className="mb-3 font-serif text-sm font-semibold text-white">
                How This Stealth Switch Operates
              </h3>
              <ul className="space-y-2 list-disc pl-4 text-white/60 leading-relaxed">
                <li>
                  <strong className="text-white">Complete Invisibility:</strong> This route (<code className="text-[#3ecf8e]">/errorswitch</code>) is completely unlisted. It does not appear in any menu, footer, navigation bar, or admin sidebar.
                </li>
                <li>
                  <strong className="text-white">Hidden from Admin:</strong> Even if someone is inside the admin panel, the switch is not visible anywhere in the regular settings.
                </li>
                <li>
                  <strong className="text-white">Full-Site Lockout:</strong> When enabled, any route searched or visited (<code className="text-white/80">/</code>, <code className="text-white/80">/products</code>, <code className="text-white/80">/about</code>, <code className="text-white/80">/admin</code>, etc.) immediately shows the official-looking Supabase error screen.
                </li>
                <li>
                  <strong className="text-white">Real-Time Sync:</strong> Changes are saved to Supabase (<code className="text-white/80">site_settings</code>) and broadcast in real-time to all open tabs and devices worldwide.
                </li>
                <li>
                  <strong className="text-white">Emergency Recovery:</strong> You can always return to <code className="text-[#3ecf8e]">/errorswitch</code> to turn the switch off and bring the website back live instantly.
                </li>
              </ul>
            </div>

            {/* Master PIN Configuration */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#14161c] p-4 text-xs">
              <div className="flex items-center gap-2 text-white/70">
                <KeyRound className="h-4 w-4 text-[#3ecf8e]" />
                <span>Master Passcode for quick console unlock</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 transition"
              >
                Change Passcode
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Passcode Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveNewPin}
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#16191f] p-6 shadow-2xl"
          >
            <h3 className="font-serif text-base font-semibold text-white">Change Master Passcode</h3>
            <p className="mt-1 text-xs text-white/50 mb-4">
              Enter a new passcode to protect this console.
            </p>
            <input
              type="text"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="New master passcode"
              className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-white/30 focus:border-[#3ecf8e] focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#3ecf8e] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#3ecf8e]/90 transition"
              >
                Save Passcode
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
