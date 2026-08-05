import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Star,
  Layers,
  Tag,
  Home as HomeIcon,
  Building2,
  Phone,
  Landmark,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { fetchSiteSettings } from '@/lib/api';
import type { SiteSettings } from '@/types/database';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/featured', label: 'Featured Products', icon: Star },
  { to: '/admin/collections', label: 'Collections', icon: Layers },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/homepage', label: 'Homepage', icon: HomeIcon },
  { to: '/admin/company', label: 'Company Information', icon: Building2 },
  { to: '/admin/contact', label: 'Contact Information', icon: Phone },
  { to: '/admin/bank', label: 'Bank Details', icon: Landmark },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  async function handleSignOut() {
    await signOut();
    toast('Signed out');
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-ink-100 bg-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <div>
            <p className="font-serif text-base font-semibold text-ink-900">AMKAS Admin</p>
            <p className="text-xs text-ink-400">{settings?.company_name ?? 'AMKAS INTERNATIONAL'}</p>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`
              }
            >
              <n.icon className="h-4.5 w-4.5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-ink-100 p-3">
          <div className="mb-2 truncate px-2 text-xs text-ink-400">{session?.user?.email}</div>
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="h-4.5 w-4.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-5 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-ink-700" />
          </button>
          <p className="font-serif text-sm font-semibold">AMKAS Admin</p>
          <div className="w-5" />
        </header>
        <main className="p-5 lg:p-8">
          <Outlet context={{ settings }} />
        </main>
      </div>
    </div>
  );
}
