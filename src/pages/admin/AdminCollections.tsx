import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminHeader, EmptyState, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchCollections, upsertCollection, deleteCollection } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { optimizeAndUpload } from '@/lib/image';
import type { Collection } from '@/types/database';

type Draft = Partial<Collection>;
const empty: Draft = { name: '', slug: '', description: '', cover_image: '', sort_order: 0, visible: true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCollections() {
  const toast = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.name ?? '') };
      const saved = await upsertCollection(payload);
      setCollections((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) return prev.map((x) => (x.id === saved.id ? saved : x));
        return [...prev, saved];
      });
      toast('Collection saved');
      setEditing(null);
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this collection? Products will remain but become unlinked.')) return;
    try {
      await deleteCollection(id);
      setCollections((c) => c.filter((x) => x.id !== id));
      toast('Collection deleted');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function handleCover(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      const res = await optimizeAndUpload(file, 'collections');
      setEditing({ ...editing, cover_image: res.publicUrl });
      toast('Cover image uploaded');
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function move(c: Collection, dir: -1 | 1) {
    const idx = collections.findIndex((x) => x.id === c.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= collections.length) return;

    const updated = [...collections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((item, i) => ({
      ...item,
      sort_order: i,
    }));

    setCollections(reordered);

    try {
      await Promise.all(
        reordered.map((item) => upsertCollection({ id: item.id, sort_order: item.sort_order })),
      );
      toast('Collection order updated');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function toggleVisible(c: Collection) {
    const saved = await upsertCollection({ id: c.id, visible: !c.visible });
    setCollections((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
  }

  return (
    <div>
      <AdminHeader
        title="Collections"
        subtitle="Group products into curated collections shown on the homepage."
        action={
          <button onClick={() => setEditing({ ...empty })} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Collection
          </button>
        }
      />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-3xl" />)}</div>
      ) : collections.length === 0 ? (
        <EmptyState message="No collections yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              <div className="relative h-40 bg-ink-100">
                {c.cover_image && <img src={c.cover_image} alt="" className="h-full w-full object-cover" />}
                <div className="absolute right-2 top-2 flex gap-1">
                  <button onClick={() => toggleVisible(c)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-ink-700" aria-label="Toggle visibility">
                    {c.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-medium text-ink-900">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{c.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => move(c, -1)} className="btn-ghost h-8 w-8 p-0" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => move(c, 1)} className="btn-ghost h-8 w-8 p-0" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setEditing({ ...c })} className="btn-ghost ml-auto h-8 w-8 p-0" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(c.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={save} className="my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium">{editing.id ? 'Edit Collection' : 'New Collection'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5 text-ink-500" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Collection Name">
                <input required value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} className="input" />
              </Field>
              <Field label="Slug">
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input resize-none" />
              </Field>
              <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                <label className="label font-semibold text-ink-900 mb-2">Collection Cover Image</label>
                {editing.cover_image && (
                  <div className="mb-3 h-28 w-full overflow-hidden rounded-xl bg-ink-900 border border-ink-200">
                    <img src={editing.cover_image} alt="Collection Cover Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-white border border-ink-200 text-xs font-medium text-ink-800 shadow-sm transition hover:bg-ink-50">
                    {uploading ? 'Uploading Image...' : '📷 Upload Cover File'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCover(e.target.files[0])} />
                  </label>
                  <input
                    type="url"
                    placeholder="Or paste Cover Image URL..."
                    value={editing.cover_image ?? ''}
                    onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                    className="input bg-white text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Field label="Sort Order">
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input w-32" />
                </Field>
                <label className="flex items-center gap-2 pt-6 text-sm text-ink-700">
                  <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} className="h-4 w-4 rounded border-ink-300" />
                  Visible
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <SaveButton saving={saving} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
