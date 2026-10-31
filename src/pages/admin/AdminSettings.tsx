import { useEffect, useState, useRef } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchSiteSettings, updateSiteSettings } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { optimizeAndUpload } from '@/lib/image';
import { updateFavicon } from '@/lib/seo';
import {
  isSiteSuspended,
  cleanKeywordsForDisplay,
  prepareKeywordsForSave,
  toggleSiteSuspension,
} from '@/lib/siteSuspension';
import { Power, ShieldAlert, ExternalLink } from 'lucide-react';
import type { SiteSettings } from '@/types/database';

export default function AdminSettings() {
  const toast = useToast();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFav, setUploadingFav] = useState(false);

  // Stealth suspension tracking
  const wasSuspendedRef = useRef<boolean>(false);
  const [isCurrentlySuspended, setIsCurrentlySuspended] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [showSecretControls, setShowSecretControls] = useState(false);
  const [switchToggling, setSwitchToggling] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then((s) => {
        const suspended = isSiteSuspended(s);
        wasSuspendedRef.current = suspended;
        setIsCurrentlySuspended(suspended);

        // Strip hidden suspension token so admin never sees it in input
        const cleanedData = {
          ...s,
          seo_keywords: cleanKeywordsForDisplay(s.seo_keywords),
        };
        setData(cleanedData);
        if (s?.favicon_url) updateFavicon(s.favicon_url);
      })
      .catch(() => toast('Failed to load', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      // Re-attach the suspension token if it was active
      const finalKeywords = prepareKeywordsForSave(data.seo_keywords ?? '', wasSuspendedRef.current);
      const payloadToSave: SiteSettings = {
        ...data,
        seo_keywords: finalKeywords,
      };

      const saved = await updateSiteSettings(payloadToSave);
      if (saved.favicon_url) updateFavicon(saved.favicon_url);
      toast('Settings saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleAdminToggleSwitch() {
    setSwitchToggling(true);
    try {
      const nextState = !isCurrentlySuspended;
      await toggleSiteSuspension(nextState);
      wasSuspendedRef.current = nextState;
      setIsCurrentlySuspended(nextState);
      toast(nextState ? 'Emergency Error Screen ENABLED' : 'Error Screen DISABLED (Site is Live)');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSwitchToggling(false);
    }
  }

  function handleSecretClick() {
    const next = secretClickCount + 1;
    setSecretClickCount(next);
    if (next >= 3) {
      setShowSecretControls((prev) => !prev);
      setSecretClickCount(0);
    }
    setTimeout(() => setSecretClickCount(0), 2000);
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    try {
      const res = await optimizeAndUpload(file, 'branding');
      setData({ ...data, logo_url: res.publicUrl } as SiteSettings);
      toast('Logo uploaded');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setUploadingLogo(false);
    }
  }
  async function uploadFavicon(file: File) {
    setUploadingFav(true);
    try {
      const res = await optimizeAndUpload(file, 'branding');
      setData({ ...data, favicon_url: res.publicUrl } as SiteSettings);
      updateFavicon(res.publicUrl);
      toast('Favicon uploaded. Click Save Settings to persist.');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setUploadingFav(false);
    }
  }

  if (!data) return <div className="skeleton h-96 rounded-3xl" />;

  return (
    <form onSubmit={save}>
      <AdminHeader title="Website Settings" subtitle="Branding, SEO defaults and social links." action={<SaveButton saving={saving} />} />

      <div className="space-y-6">
        <AdminCard>
          <h2 className="mb-4 font-serif text-lg font-medium text-ink-900">Branding & Logo</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Company Name"><input value={data.company_name} onChange={(e) => setData({ ...data, company_name: e.target.value })} className="input" /></Field>
            <Field label="Footer Text"><input value={data.footer_text ?? ''} onChange={(e) => setData({ ...data, footer_text: e.target.value })} className="input" /></Field>
            <Field label="Primary Color"><input value={data.primary_color} onChange={(e) => setData({ ...data, primary_color: e.target.value })} className="input" /></Field>
            <Field label="Secondary Color"><input value={data.secondary_color} onChange={(e) => setData({ ...data, secondary_color: e.target.value })} className="input" /></Field>
            
            <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
              <label className="label font-semibold text-ink-900 mb-2">Website Logo</label>
              {data.logo_url && (
                <div className="mb-3 flex h-16 w-full items-center justify-center rounded-xl bg-ink-900 p-2 border border-ink-200">
                  <img src={data.logo_url} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div className="space-y-2">
                <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-white border border-ink-200 text-xs font-medium text-ink-800 shadow-sm transition hover:bg-ink-50">
                  {uploadingLogo ? 'Uploading...' : '📷 Upload Logo File'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                </label>
                <input
                  type="url"
                  placeholder="Or paste Logo Image URL..."
                  value={data.logo_url ?? ''}
                  onChange={(e) => setData({ ...data, logo_url: e.target.value })}
                  className="input bg-white text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
              <label className="label font-semibold text-ink-900 mb-2">Website Favicon</label>
              {data.favicon_url && (
                <div className="mb-3 flex h-16 w-full items-center justify-center rounded-xl bg-white p-2 border border-ink-200">
                  <img src={data.favicon_url} alt="Favicon preview" className="h-8 w-8 object-contain" />
                </div>
              )}
              <div className="space-y-2">
                <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-white border border-ink-200 text-xs font-medium text-ink-800 shadow-sm transition hover:bg-ink-50">
                  {uploadingFav ? 'Uploading...' : '📷 Upload Favicon File'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFavicon(e.target.files[0])} />
                </label>
                <input
                  type="url"
                  placeholder="Or paste Favicon Image URL..."
                  value={data.favicon_url ?? ''}
                  onChange={(e) => setData({ ...data, favicon_url: e.target.value })}
                  className="input bg-white text-xs"
                />
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-serif text-lg font-medium text-ink-900">SEO Defaults</h2>
          <div className="space-y-4">
            <Field label="Default SEO Title"><input value={data.seo_title ?? ''} onChange={(e) => setData({ ...data, seo_title: e.target.value })} className="input" /></Field>
            <Field label="Default SEO Description"><textarea rows={2} value={data.seo_description ?? ''} onChange={(e) => setData({ ...data, seo_description: e.target.value })} className="input resize-none" /></Field>
            <Field label="SEO Keywords"><input value={data.seo_keywords ?? ''} onChange={(e) => setData({ ...data, seo_keywords: e.target.value })} className="input" /></Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-serif text-lg font-medium text-ink-900">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook"><input value={data.social_facebook ?? ''} onChange={(e) => setData({ ...data, social_facebook: e.target.value })} className="input" /></Field>
            <Field label="Instagram"><input value={data.social_instagram ?? ''} onChange={(e) => setData({ ...data, social_instagram: e.target.value })} className="input" /></Field>
            <Field label="LinkedIn"><input value={data.social_linkedin ?? ''} onChange={(e) => setData({ ...data, social_linkedin: e.target.value })} className="input" /></Field>
            <Field label="Twitter / X"><input value={data.social_twitter ?? ''} onChange={(e) => setData({ ...data, social_twitter: e.target.value })} className="input" /></Field>
          </div>
        </AdminCard>

        {/* Discreet technical system footer note with secret 3-click trigger */}
        <div className="pt-4 pb-2 text-center select-none">
          <p
            onClick={handleSecretClick}
            className="inline-block cursor-pointer text-[11px] text-ink-300 hover:text-ink-400 transition"
            title="System build status"
          >
            AMKAS Core Engine • Build 2026.10 • Database Synced
          </p>

          {/* Revealed only if secret clicked 3 times */}
          {showSecretControls && (
            <div className="mt-4 mx-auto max-w-lg rounded-2xl border border-ink-200 bg-white p-5 text-left shadow-lg">
              <div className="flex items-center justify-between border-b border-ink-100 pb-3 mb-3">
                <div className="flex items-center gap-2 text-ink-900 font-serif font-semibold text-sm">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  <span>Discreet Infrastructure Switch</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isCurrentlySuspended ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isCurrentlySuspended ? 'LOCKED OUT' : 'LIVE'}
                </span>
              </div>
              <p className="text-xs text-ink-600 mb-4">
                This hidden control allows you to toggle the Supabase error screen or jump to the stealth route.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={switchToggling}
                  onClick={handleAdminToggleSwitch}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition ${
                    isCurrentlySuspended ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  {switchToggling ? 'Updating...' : isCurrentlySuspended ? 'Deactivate Error (Make Site Live)' : 'Activate Error (Lock Site)'}
                </button>
                <a
                  href="/errorswitch"
                  className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 ml-auto"
                >
                  <span>Go to /errorswitch</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
