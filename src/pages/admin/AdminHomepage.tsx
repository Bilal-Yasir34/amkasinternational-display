import { useEffect, useState } from 'react';
import { AdminHeader, AdminCard, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchHomepage, updateHomepage } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { optimizeAndUpload } from '@/lib/image';
import type { Homepage, WhyChooseItem } from '@/types/database';

export default function AdminHomepage() {
  const toast = useToast();
  const [data, setData] = useState<Homepage | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHomepage().then(setData).catch(() => toast('Failed to load homepage', 'error'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      await updateHomepage(data);
      toast('Homepage saved');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleHero(file: File) {
    setUploading(true);
    try {
      const res = await optimizeAndUpload(file, 'homepage');
      setData({ ...data, hero_image: res.publicUrl } as Homepage);
      toast('Hero image uploaded');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setUploading(false);
    }
  }

  function updateWhy(index: number, patch: Partial<WhyChooseItem>) {
    if (!data) return;
    const items = [...data.why_choose_us];
    items[index] = { ...items[index], ...patch };
    setData({ ...data, why_choose_us: items });
  }
  function addWhy() {
    if (!data) return;
    setData({ ...data, why_choose_us: [...data.why_choose_us, { title: '', description: '', icon: 'Sparkles' }] });
  }
  function removeWhy(index: number) {
    if (!data) return;
    setData({ ...data, why_choose_us: data.why_choose_us.filter((_, i) => i !== index) });
  }

  if (!data) return <div className="skeleton h-96 rounded-3xl" />;

  return (
    <form onSubmit={save}>
      <AdminHeader title="Homepage" subtitle="Edit hero, company intro, why-choose-us and section visibility." action={<SaveButton saving={saving} />} />

      <div className="space-y-6">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
            <div>
              <h2 className="font-serif text-lg font-medium text-ink-900">Hero Section & Banner</h2>
              <p className="text-xs text-ink-500">Configure the main banner image and headline text displayed at the very top of your homepage.</p>
            </div>
          </div>
          <div className="space-y-5">
            <Field label="Hero Title">
              <input value={data.hero_title} onChange={(e) => setData({ ...data, hero_title: e.target.value })} className="input" />
            </Field>
            <Field label="Hero Subtitle">
              <textarea rows={2} value={data.hero_subtitle} onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })} className="input resize-none" />
            </Field>

            {/* Enhanced Hero Banner Image Upload Section */}
            <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-5">
              <label className="label text-ink-900 font-semibold mb-2">Top Homepage Hero Banner Image</label>
              <p className="text-xs text-ink-500 mb-4">
                This image is displayed as the full-screen background banner at the top of your website. Upload a file from your device or paste an image URL.
              </p>

              <div className="relative mb-4 overflow-hidden rounded-2xl bg-ink-900 border border-ink-200 h-48 sm:h-64">
                {data.hero_image ? (
                  <img src={data.hero_image} alt="Hero Banner Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                    No custom banner uploaded yet. Using default textile background.
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-medium text-white/90">Current Banner Preview</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Upload File</label>
                  <label className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white border border-ink-200 text-sm font-medium text-ink-800 shadow-sm transition hover:bg-ink-50 hover:border-ink-300">
                    {uploading ? 'Uploading Image...' : '📷 Select Image File from Device'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleHero(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="label">Or Enter Direct Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={data.hero_image ?? ''}
                    onChange={(e) => setData({ ...data, hero_image: e.target.value })}
                    className="input bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button 1 Text"><input value={data.hero_button1_text} onChange={(e) => setData({ ...data, hero_button1_text: e.target.value })} className="input" /></Field>
              <Field label="Button 1 Link"><input value={data.hero_button1_link} onChange={(e) => setData({ ...data, hero_button1_link: e.target.value })} className="input" /></Field>
              <Field label="Button 2 Text"><input value={data.hero_button2_text} onChange={(e) => setData({ ...data, hero_button2_text: e.target.value })} className="input" /></Field>
              <Field label="Button 2 Link"><input value={data.hero_button2_link} onChange={(e) => setData({ ...data, hero_button2_link: e.target.value })} className="input" /></Field>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-serif text-lg font-medium text-ink-900">Company Introduction</h2>
          <div className="space-y-4">
            <Field label="Intro Title"><input value={data.intro_title} onChange={(e) => setData({ ...data, intro_title: e.target.value })} className="input" /></Field>
            <Field label="Intro Body"><textarea rows={4} value={data.intro_body ?? ''} onChange={(e) => setData({ ...data, intro_body: e.target.value })} className="input resize-none" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mission"><textarea rows={2} value={data.mission ?? ''} onChange={(e) => setData({ ...data, mission: e.target.value })} className="input resize-none" /></Field>
              <Field label="Vision"><textarea rows={2} value={data.vision ?? ''} onChange={(e) => setData({ ...data, vision: e.target.value })} className="input resize-none" /></Field>
              <Field label="Years of Experience"><input type="number" value={data.years_experience} onChange={(e) => setData({ ...data, years_experience: Number(e.target.value) })} className="input" /></Field>
              <Field label="Export Markets"><input value={data.export_markets ?? ''} onChange={(e) => setData({ ...data, export_markets: e.target.value })} className="input" /></Field>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-ink-900">Why Choose Us</h2>
            <button type="button" onClick={addWhy} className="btn-outline">Add item</button>
          </div>
          <div className="space-y-3">
            {data.why_choose_us.map((item, i) => (
              <div key={i} className="grid gap-3 rounded-2xl border border-ink-100 p-4 sm:grid-cols-[1fr_1fr_auto]">
                <input value={item.title} onChange={(e) => updateWhy(i, { title: e.target.value })} placeholder="Title" className="input" />
                <input value={item.description} onChange={(e) => updateWhy(i, { description: e.target.value })} placeholder="Description" className="input" />
                <div className="flex gap-2">
                  <input value={item.icon} onChange={(e) => updateWhy(i, { icon: e.target.value })} placeholder="Icon" className="input w-28" />
                  <button type="button" onClick={() => removeWhy(i)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Remove">✕</button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-serif text-lg font-medium text-ink-900">Section Visibility</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ['show_featured', 'Featured Products'],
              ['show_collections', 'Collections'],
              ['show_why_choose', 'Why Choose Us'],
              ['show_company_info', 'Company Information'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 rounded-xl border border-ink-100 px-4 py-3 text-sm text-ink-700">
                <input type="checkbox" checked={data[key] as boolean} onChange={(e) => setData({ ...data, [key]: e.target.checked })} className="h-4 w-4 rounded border-ink-300" />
                {label}
              </label>
            ))}
          </div>
        </AdminCard>
      </div>
    </form>
  );
}
