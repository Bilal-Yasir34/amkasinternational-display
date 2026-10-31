import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, ShieldAlert, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import { verifyMasterPin, toggleSiteSuspension } from '@/lib/siteSuspension';

export default function SupabasePausedScreen() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Disable scrolling on body while error screen is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalMargin = document.body.style.margin;
    document.body.style.overflow = 'hidden';
    document.title = '402: Project Paused | Supabase';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.margin = originalMargin;
    };
  }, []);

  // Keyboard shortcut for master console: Ctrl + Shift + S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setShowSecretModal(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Discreet click trigger: 5 rapid clicks on the Supabase logo
  function handleLogoClick() {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 5) {
      setShowSecretModal(true);
      setClickCount(0);
    }
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  }

  async function handleUnlockDirect(e: React.FormEvent) {
    e.preventDefault();
    if (!verifyMasterPin(pinInput)) {
      setPinError(true);
      return;
    }
    setUnlocking(true);
    try {
      await toggleSiteSuspension(false);
      window.location.reload();
    } catch {
      // Direct navigate to error switch if db update failed
      navigate('/errorswitch');
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex min-h-screen w-screen flex-col items-center justify-between overflow-y-auto bg-[#0c0d0e] p-6 text-white selection:bg-[#3ecf8e]/30 selection:text-[#3ecf8e]">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[140px]" />
        <div className="h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[160px]" />
      </div>

      {/* Top Header bar resembling Supabase cloud incident screen */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-between border-b border-white/10 pb-4 pt-2">
        <div
          onClick={handleLogoClick}
          className="group flex cursor-pointer items-center gap-3 select-none"
          title="Supabase Platform Status"
        >
          {/* Official Supabase Emerald SVG Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17181c] border border-white/10 transition-colors group-hover:border-[#3ecf8e]/40">
            <svg
              className="h-5 w-5 text-[#3ecf8e] transition-transform group-hover:scale-105"
              viewBox="0 0 109 113"
              fill="currentColor"
            >
              <path d="M63.7076 110.284C60.848 113.885 55.0502 111.912 54.9512 107.314L53.5738 43.1667H98.5449C105.541 43.1667 109.616 51.0577 105.474 56.684L63.7076 110.284Z" />
              <path
                d="M63.7076 110.284C60.848 113.885 55.0502 111.912 54.9512 107.314L53.5738 43.1667H98.5449C105.541 43.1667 109.616 51.0577 105.474 56.684L63.7076 110.284Z"
                fillOpacity="0.2"
              />
              <path d="M45.317 2.71618C48.1766 -0.885172 53.9744 1.08779 54.0734 5.68603L54.7958 69.8333H10.4797C3.48358 69.8333 -0.591499 61.9423 3.55034 56.316L45.317 2.71618Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">supabase</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/60">cloud</span>
            </div>
            <p className="text-[11px] text-white/40">Infrastructure Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono text-xs text-amber-400/90 font-medium">Service Restriction Active</span>
        </div>
      </header>

      {/* Main Error Announcement Card */}
      <main className="relative z-10 my-auto flex w-full max-w-2xl flex-col items-center py-10 text-center">
        {/* Status Indicator Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span>HTTP 402 • STATUS_PROJECT_SUSPENDED</span>
        </div>

        {/* Primary Headline */}
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Project Suspended
        </h1>

        {/* Prominent Exact Requested Message */}
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-950/20 p-5 text-center shadow-lg shadow-black/40 backdrop-blur-sm sm:p-6">
          <p className="text-base font-medium leading-relaxed text-red-200/95 sm:text-lg">
            “The site has been paused by Supabase since the outstanding balance remains. Clear the outstanding balance to keep using the benefits.”
          </p>
        </div>

        {/* Technical Diagnostic Metadata Box */}
        <div className="mt-6 w-full rounded-2xl border border-white/10 bg-[#141518]/90 p-5 text-left font-mono text-xs backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="flex items-center gap-1.5 text-white/60">
              <ShieldAlert className="h-4 w-4 text-amber-400" /> System Diagnostics
            </span>
            <span className="text-white/40">REF: qtavkxueidaujzrbrvfw</span>
          </div>

          <div className="space-y-2 text-white/70">
            <div className="flex justify-between">
              <span className="text-white/40">Service Target:</span>
              <span className="text-white">AMKAS INTERNATIONAL (Production)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Database Engine:</span>
              <span className="text-white/60">PostgreSQL 15 (Compute Pool Halted)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">API & Edge Functions:</span>
              <span className="text-red-400 font-semibold">402 Payment Required</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Action Required:</span>
              <span className="text-amber-300 font-semibold">Settle Invoice in Supabase Billing</span>
            </div>
          </div>
        </div>

        {/* Non-functional Action Bar emphasizing lockout */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-medium text-white/40 cursor-not-allowed border border-white/10"
          >
            <Lock className="h-3.5 w-3.5" /> Direct Access Restricted
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-transparent px-5 py-2.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 border border-white/10 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Check Invoice Status
          </button>
        </div>

        <p className="mt-6 text-[11px] text-white/35 max-w-md">
          All client traffic, dashboard routes, and public assets are paused by infrastructure policy until billing settlement has been recorded.
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex w-full max-w-5xl items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/40">
        <div>
          <span>Supabase Infrastructure Engine</span>
          <span className="mx-2">•</span>
          <span>Region: ap-southeast-1</span>
        </div>
        <div className="font-mono">Code: BILLING_DELINQUENT_OVERDUE</div>
      </footer>

      {/* Secret Developer Master Unlock Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-[#16171a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-2 text-white">
              <KeyRound className="h-5 w-5 text-[#3ecf8e]" />
              <h3 className="font-serif text-lg font-semibold">Master Emergency Console</h3>
            </div>
            <p className="mb-4 text-xs text-white/60">
              Enter the master developer passcode to navigate to the switch control room or instantly restore the website.
            </p>

            <form onSubmit={handleUnlockDirect} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">Master Security Passcode</label>
                <input
                  type="password"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter passcode..."
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-sm text-white placeholder-white/30 focus:border-[#3ecf8e] focus:outline-none"
                />
                {pinError && <p className="mt-1 text-xs text-red-400">Incorrect master passcode.</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (verifyMasterPin(pinInput)) {
                      navigate('/errorswitch');
                    } else {
                      setPinError(true);
                    }
                  }}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  Go to /errorswitch
                </button>
                <button
                  type="submit"
                  disabled={unlocking}
                  className="flex-1 rounded-xl bg-[#3ecf8e] py-2.5 text-xs font-semibold text-black transition hover:bg-[#3ecf8e]/90 flex items-center justify-center gap-1.5"
                >
                  {unlocking ? 'Unlocking...' : 'Restore Site Live'} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSecretModal(false)}
                className="w-full text-center text-xs text-white/40 hover:text-white/70 pt-1"
              >
                Close Master Dialog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
