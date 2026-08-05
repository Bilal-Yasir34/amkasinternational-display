import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star, GripVertical } from 'lucide-react';
import { AdminHeader, EmptyState, Field, SaveButton } from '@/components/admin/AdminUI';
import {
  fetchAllProductsAdmin,
  upsertProduct,
  deleteProduct,
  fetchCategories,
  fetchCollections,
} from '@/lib/api';
import { useToast } from '@/lib/toast';
import { optimizeAndUpload } from '@/lib/image';
import type { Product, Category, Collection } from '@/types/database';

type Draft = Partial<Product> & { images: string[] };

const empty: Draft = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  category_id: null,
  collection_id: null,
  images: [],
  featured: false,
  featured_order: 0,
  visible: true,
  sort_order: 0,
  specs: {},
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([fetchAllProductsAdmin(), fetchCategories(), fetchCollections()])
      .then(([p, c, col]) => {
        setProducts(p);
        setCategories(c);
        setCollections(col);
      })
      .finally(() => setLoading(false));
  }, []);

  function startNew() {
    setEditing({ ...empty, specs: {} });
  }
  function startEdit(p: Product) {
    setEditing({ ...p, specs: p.specs ?? {} });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, slug: editing.slug || slugify(editing.name ?? '') };
      const saved = await upsertProduct(payload);
      
      const enrichedSaved: Product = {
        ...saved,
        category: saved.category ?? categories.find((c) => c.id === saved.category_id) ?? null,
        collection: saved.collection ?? collections.find((c) => c.id === saved.collection_id) ?? null,
      };

      setProducts((prev) => {
        const idx = prev.findIndex((x) => x.id === enrichedSaved.id);
        if (idx >= 0) return prev.map((x) => (x.id === enrichedSaved.id ? enrichedSaved : x));
        return [enrichedSaved, ...prev];
      });
      toast('Product saved');
      setEditing(null);
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      toast('Product deleted');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function handleUpload(files: FileList) {
    if (!editing) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const res = await optimizeAndUpload(f, 'products');
        urls.push(res.publicUrl);
      }
      setEditing({ ...editing, images: [...editing.images, ...urls] });
      toast(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setUploading(false);
    }
  }

  function toggleFeatured(p: Product) {
    upsertProduct({ id: p.id, featured: !p.featured })
      .then((saved) => setProducts((prev) => prev.map((x) => (x.id === saved.id ? saved : x))))
      .catch((err) => toast((err as Error).message, 'error'));
  }

  function setSpecField(key: string, value: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      specs: { ...(editing.specs ?? {}), [key]: value },
    });
  }

  function removeSpecField(key: string) {
    if (!editing) return;
    const nextSpecs = { ...(editing.specs ?? {}) };
    delete nextSpecs[key];
    setEditing({ ...editing, specs: nextSpecs });
  }

  function renameSpecKey(oldKey: string, newKey: string) {
    if (!editing || !newKey || oldKey === newKey) return;
    const nextSpecs: Record<string, string> = {};
    for (const [k, v] of Object.entries(editing.specs ?? {})) {
      if (k === oldKey) {
        nextSpecs[newKey] = v;
      } else {
        nextSpecs[k] = v;
      }
    }
    setEditing({ ...editing, specs: nextSpecs });
  }

  return (
    <div>
      <AdminHeader
        title="Products"
        subtitle="Create, edit and manage your product catalogue."
        action={
          <button onClick={startNew} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="No products yet. Click 'Add Product' to create your first." />
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {products.map((p) => {
            const categoryName = p.category?.name ?? categories.find((c) => c.id === p.category_id)?.name ?? 'Uncategorised';
            const collectionName = p.collection?.name ?? collections.find((c) => c.id === p.collection_id)?.name ?? 'No collection';
            return (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <GripVertical className="h-4 w-4 flex-shrink-0 text-ink-300" />
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-ink-100">
                  {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-900">{p.name}</p>
                  <p className="truncate text-xs text-ink-500">
                    <span className="font-medium text-ink-700">{categoryName}</span> · <span className="font-medium text-ink-700">{collectionName}</span>
                  </p>
                </div>
                <button
                  onClick={() => toggleFeatured(p)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    p.featured ? 'bg-gold-50 text-gold-600' : 'text-ink-300 hover:bg-ink-100'
                  }`}
                  aria-label="Toggle featured"
                  title="Featured"
                >
                  <Star className={`h-4 w-4 ${p.featured ? 'fill-gold-500' : ''}`} />
                </button>
                <button onClick={() => startEdit(p)} className="btn-ghost h-9 w-9 p-0" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(p.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={save} className="my-8 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lift sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium">{editing.id ? 'Edit Product' : 'New Product'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">
                <X className="h-5 w-5 text-ink-500" />
              </button>
            </div>

            <div className="space-y-5">
              <Field label="Product Name">
                <input
                  required
                  value={editing.name ?? ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                  className="input"
                />
              </Field>
              <Field label="Slug" hint="URL-friendly identifier. Auto-generated if left blank.">
                <input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <select
                    value={editing.category_id ?? ''}
                    onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                    className="input"
                  >
                    <option value="">None (Uncategorised)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Collection">
                  <select
                    value={editing.collection_id ?? ''}
                    onChange={(e) => setEditing({ ...editing, collection_id: e.target.value || null })}
                    className="input"
                  >
                    <option value="">None (No Collection)</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Short Description">
                <input value={editing.short_description ?? ''} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="input" />
              </Field>
              <Field label="Full Description">
                <textarea rows={4} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input resize-none" />
              </Field>

              {/* Product Specifications & Options */}
              <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="label font-semibold text-ink-900 mb-0">Fabric & Product Specifications</label>
                    <p className="text-xs text-ink-500">Add detailed specs (e.g. Width, Momme, Material, GSM, Weave, Care, Origin).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const key = prompt('Enter specification name (e.g. Width, Momme, GSM, Material):');
                      if (key && key.trim()) {
                        setSpecField(key.trim(), '');
                      }
                    }}
                    className="btn-outline text-xs px-3 py-1.5"
                  >
                    + Add Specification
                  </button>
                </div>

                {/* Preset Quick-Add Buttons */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {['Material', 'Width', 'GSM', 'Momme', 'Weave', 'Finish', 'Care', 'Origin'].map((preset) => {
                    const exists = editing.specs && preset in editing.specs;
                    if (exists) return null;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSpecField(preset, '')}
                        className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-xs text-ink-700 transition hover:border-gold-500 hover:text-gold-700"
                      >
                        + {preset}
                      </button>
                    );
                  })}
                </div>

                {/* Specification Key-Value List */}
                <div className="space-y-2.5">
                  {Object.entries(editing.specs ?? {}).length === 0 ? (
                    <p className="text-xs text-ink-400 italic">No specifications added yet. Click "+ Add Specification" or a quick preset above.</p>
                  ) : (
                    Object.entries(editing.specs ?? {}).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={k}
                          onChange={(e) => renameSpecKey(k, e.target.value)}
                          placeholder="Spec Name (e.g. Width)"
                          className="input text-xs w-1/3 bg-white font-medium"
                        />
                        <input
                          type="text"
                          value={v}
                          onChange={(e) => setSpecField(k, e.target.value)}
                          placeholder="Spec Value (e.g. 58/60 inches)"
                          className="input text-xs flex-1 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecField(k)}
                          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          aria-label="Remove spec"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Product Gallery Images */}
              <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                <label className="label font-semibold text-ink-900 mb-2">Product Gallery Images</label>
                <div className="mb-4 flex flex-wrap gap-3">
                  {editing.images.map((img, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl ring-1 ring-ink-200 bg-white">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, images: editing.images.filter((_, idx) => idx !== i) })}
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-white text-ink-500 transition hover:border-ink-400 hover:text-ink-700">
                    <span className="text-xs font-medium">{uploading ? 'Uploading...' : '📷 + Upload'}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    id="new-product-img-url"
                    placeholder="Or paste image URL and click Add..."
                    className="input bg-white text-xs flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          setEditing({ ...editing, images: [...editing.images, val] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-product-img-url') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setEditing({ ...editing, images: [...editing.images, input.value.trim()] });
                        input.value = '';
                      }
                    }}
                    className="btn-outline text-xs px-3"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Sort Order">
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Featured Order">
                  <input type="number" value={editing.featured_order ?? 0} onChange={(e) => setEditing({ ...editing, featured_order: Number(e.target.value) })} className="input" />
                </Field>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 rounded border-ink-300" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} className="h-4 w-4 rounded border-ink-300" />
                    Visible
                  </label>
                </div>
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
