import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast('Welcome back');
      const dest = (location.state as { from?: string })?.from ?? '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      toast((err as Error).message ?? 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-semibold text-white">AMKAS INTERNATIONAL</p>
          <p className="mt-1 text-sm text-white/50">Admin Dashboard</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-lift">
          <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-ink-100 p-3 text-ink-900 font-medium">
            <LogIn className="h-5 w-5 text-ink-700" />
            <span>Admin Sign In</span>
          </div>

          <p className="mb-6 text-center text-sm text-ink-500">
            Enter your credentials to access the dashboard.
          </p>

          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@amkasinternational.com"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

