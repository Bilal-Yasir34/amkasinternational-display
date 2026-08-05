import { useEffect, useState } from 'react';
import { Star, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { AdminHeader, EmptyState } from '@/components/admin/AdminUI';
import { fetchAllProductsAdmin, upsertProduct } from '@/lib/api';
import { useToast } from '@/lib/toast';
import type { Product } from '@/types/database';

export default function AdminFeatured() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProductsAdmin()
      .then((p) => setProducts(p))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.featured).sort((a, b) => a.featured_order - b.featured_order);

  async function toggle(p: Product) {
    try {
      const saved = await upsertProduct({ id: p.id, featured: !p.featured });
      setProducts((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
      toast(saved.featured ? 'Marked as featured' : 'Removed from featured');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function move(p: Product, dir: -1 | 1) {
    const idx = featured.findIndex((x) => x.id === p.id);
    const swap = featured[idx + dir];
    if (!swap) return;
    try {
      await Promise.all([
        upsertProduct({ id: p.id, featured_order: swap.featured_order }),
        upsertProduct({ id: swap.id, featured_order: p.featured_order }),
      ]);
      setProducts((prev) =>
        prev.map((x) => {
          if (x.id === p.id) return { ...x, featured_order: swap.featured_order };
          if (x.id === swap.id) return { ...x, featured_order: p.featured_order };
          return x;
        }),
      );
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function toggleVisible(p: Product) {
    try {
      const saved = await upsertProduct({ id: p.id, visible: !p.visible });
      setProducts((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
      toast(saved.visible ? 'Product visible' : 'Product hidden');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  return (
    <div>
      <AdminHeader title="Featured Products" subtitle="Choose which products appear in the homepage carousel and set their order." />
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : featured.length === 0 ? (
        <EmptyState message="No featured products. Mark products as featured from the Products page." />
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {featured.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-ink-100">
                {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">{p.name}</p>
                <p className="truncate text-xs text-ink-500">{p.category?.name ?? 'Uncategorised'}</p>
              </div>
              <button onClick={() => move(p, -1)} disabled={i === 0} className="btn-ghost h-9 w-9 p-0 disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(p, 1)} disabled={i === featured.length - 1} className="btn-ghost h-9 w-9 p-0 disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button onClick={() => toggleVisible(p)} className="btn-ghost h-9 w-9 p-0" aria-label="Toggle visibility">
                {p.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => toggle(p)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600" aria-label="Remove featured">
                <Star className="h-4 w-4 fill-gold-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
