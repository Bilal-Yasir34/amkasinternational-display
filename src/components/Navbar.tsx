import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import { useToast } from '@/lib/toast';
import type { SiteSettings } from '@/types/database';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar({ settings }: { settings: SiteSettings | null }) {
  const toast = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  function handleEmailClick(e: React.MouseEvent) {
    e.preventDefault();
    const email = 'amkas_inter@hotmail.com';
    navigator.clipboard.writeText(email).catch(() => {});
    toast('Email copied: amkas_inter@hotmail.com. Opening email client...');
    setTimeout(() => {
      window.location.href = `mailto:${email}`;
    }, 150);
  }

  const isHome = location.pathname === '/';
  const isDarkHeader = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isDarkHeader
          ? 'bg-transparent'
          : 'bg-white/95 shadow-soft backdrop-blur-md border-b border-ink-100/60'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-2.5" aria-label={settings?.company_name ?? 'AMKAS'}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="logo" className="h-9 w-auto lg:h-10" />
          ) : (
            <span
              className={`font-serif text-lg font-semibold tracking-tight transition-colors lg:text-xl ${
                isDarkHeader ? 'text-white' : 'text-ink-900'
              }`}
            >
              {settings?.company_name ?? 'AMKAS INTERNATIONAL'}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? isDarkHeader
                      ? 'text-white'
                      : 'text-ink-900'
                    : isDarkHeader
                      ? 'text-white/80 hover:text-white'
                      : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {n.label}
                {active && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full ${
                      isDarkHeader ? 'bg-gold-400' : 'bg-gold-500'
                    }`}
                  />
                )}
              </Link>
            );
          })}
          <a href="mailto:amkas_inter@hotmail.com" onClick={handleEmailClick} className="btn-gold ml-3 cursor-pointer">
            <Mail className="h-4 w-4" /> Email Us
          </a>
        </div>

        <button
          className={`lg:hidden ${isDarkHeader ? 'text-white' : 'text-ink-900'}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden">
          <div className="container-px pb-6 pt-2">
            <div className="card flex flex-col gap-1 p-3 shadow-lift bg-white">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    location.pathname === n.to
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <a href="mailto:amkas_inter@hotmail.com" onClick={handleEmailClick} className="btn-gold mt-2 flex w-full justify-center cursor-pointer">
                <Mail className="h-4 w-4" /> Email Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
