import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { AdminHeader, EmptyState, Field, SaveButton } from '@/components/admin/AdminUI';
import { fetchCategories, upsertCategory, deleteCategory } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { Category } from '@/types/database';

type Draft = Partial<Category>;
const empty: Draft = { name: '', slug: '', description: '', sort_order: 0, visible: true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminCategories() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.name ?? '') };
      const saved = await upsertCategory(payload);
      setCategories((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) return prev.map((x) => (x.id === saved.id ? saved : x));
        return [...prev, saved];
      });
      toast('Category saved');
      setEditing(null);
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories((c) => c.filter((x) => x.id !== id));
      toast('Category deleted');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function move(c: Category, dir: -1 | 1) {
    const idx = categories.findIndex((x) => x.id === c.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const updated = [...categories];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((item, i) => ({
      ...item,
      sort_order: i,
    }));

    setCategories(reordered);

    try {
      await Promise.all(
        reordered.map((item) => upsertCategory({ id: item.id, sort_order: item.sort_order })),
      );
      toast('Category order updated');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function toggleVisible(c: Category) {
    const saved = await upsertCategory({ id: c.id, visible: !c.visible });
    setCategories((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
  }

  return (
    <div>
      <AdminHeader
        title="Categories"
        subtitle="Organise products into categories for filtering."
        action={<button onClick={() => setEditing({ ...empty })} className="btn-primary"><Plus className="h-4 w-4" /> Add Category</button>}
      />
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet." />
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink-900">{c.name}</p>
                <p className="truncate text-xs text-ink-500">{c.description ?? '—'}</p>
              </div>
              <button onClick={() => move(c, -1)} className="btn-ghost h-9 w-9 p-0" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(c, 1)} className="btn-ghost h-9 w-9 p-0" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => toggleVisible(c)} className="btn-ghost h-9 w-9 p-0" aria-label="Toggle visibility">{c.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
              <button onClick={() => setEditing({ ...c })} className="btn-ghost h-9 w-9 p-0" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(c.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={save} className="my-8 w-full max-w-md rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium">{editing.id ? 'Edit Category' : 'New Category'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5 text-ink-500" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Name">
                <input required value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} className="input" />
              </Field>
              <Field label="Slug">
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" />
              </Field>
              <Field label="Description">
                <textarea rows={2} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input resize-none" />
              </Field>
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
