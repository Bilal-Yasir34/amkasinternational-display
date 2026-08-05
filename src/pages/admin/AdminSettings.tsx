import { useEffect, useState } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchSiteSettings, updateSiteSettings } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { optimizeAndUpload } from '@/lib/image';
import { updateFavicon } from '@/lib/seo';
import type { SiteSettings } from '@/types/database';

export default function AdminSettings() {
  const toast = useToast();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFav, setUploadingFav] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then((s) => {
        setData(s);
        if (s?.favicon_url) updateFavicon(s.favicon_url);
      })
      .catch(() => toast('Failed to load', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const saved = await updateSiteSettings(data);
      if (saved.favicon_url) updateFavicon(saved.favicon_url);
      toast('Settings saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
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
      </div>
    </form>
  );
}
