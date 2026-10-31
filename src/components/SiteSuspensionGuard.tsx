import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { isSiteSuspended, checkCurrentSuspensionStatus } from '@/lib/siteSuspension';
import SupabasePausedScreen from './SupabasePausedScreen';

export default function SiteSuspensionGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [suspended, setSuspended] = useState<boolean>(() => {
    // Initial sync read from localStorage cache to prevent visual flashing
    try {
      return localStorage.getItem('__amkas_site_suspended__') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // 1. Initial async check against Supabase
    checkCurrentSuspensionStatus().then((isSusp) => {
      setSuspended(isSusp);
    });

    // 2. Real-time Supabase postgres_changes subscription
    const channel = supabase
      .channel('site_settings_suspension_listener')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow && typeof newRow.seo_keywords === 'string') {
            const isSusp = isSiteSuspended(newRow);
            setSuspended(isSusp);
            try {
              localStorage.setItem('__amkas_site_suspended__', isSusp ? 'true' : 'false');
            } catch {}
          }
        }
      )
      .subscribe();

    // 3. Local cross-tab / in-window event listeners
    function onLocalChange() {
      try {
        const isSusp = localStorage.getItem('__amkas_site_suspended__') === 'true';
        setSuspended(isSusp);
      } catch {}
    }

    window.addEventListener('amkas_suspension_change', onLocalChange);
    window.addEventListener('storage', onLocalChange);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('amkas_suspension_change', onLocalChange);
      window.removeEventListener('storage', onLocalChange);
    };
  }, []);

  // The secret route /errorswitch MUST always be reachable so it can be toggled
  const isSecretSwitchRoute = location.pathname.startsWith('/errorswitch');

  if (suspended && !isSecretSwitchRoute) {
    return <SupabasePausedScreen />;
  }

  return <>{children}</>;
}
