import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollToTopOnRouteChange from '@/components/ScrollToTopOnRouteChange';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoadingScreen from '@/components/LoadingScreen';
import { fetchSiteSettings, fetchContactInfo } from '@/lib/api';
import type { SiteSettings, ContactInfo } from '@/types/database';

export default function SiteLayout() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSiteSettings(), fetchContactInfo()])
      .then(([s, c]) => {
        setSettings(s);
        setContact(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTopOnRouteChange />
      <Navbar settings={settings} />
      <main className="flex-1">
        <Outlet context={{ settings, contact }} />
      </main>
      <Footer settings={settings} contact={contact} />
      <ScrollToTop />
      <WhatsAppButton info={contact} />
    </div>
  );
}
