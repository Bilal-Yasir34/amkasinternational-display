import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { fetchProducts, fetchCategories, fetchCollections } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { Product, Category, Collection, SiteSettings, ContactInfo } from '@/types/database';

export default function ProductsPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [collection, setCollection] = useState<string>('');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchCollections()])
      .then(([p, c, col]) => {
        setProducts(p);
        setCategories(c.filter((x) => x.visible));
        setCollections(col.filter((x) => x.visible));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category?.slug !== category) return false;
      if (collection && p.collection?.slug !== collection) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(s) &&
          !(p.short_description ?? '').toLowerCase().includes(s) &&
          !(p.category?.name ?? '').toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [products, category, collection, search]);

  useSeo({
    title: `Products — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}`,
    description: 'Browse our full range of premium textile products — shawls, wool, cotton and luxury fabrics.',
    canonical: window.location.href,
  });

  return (
    <div className="pt-16 lg:pt-20">
      <section className="border-b border-ink-100 bg-beige-50 py-14">
        <div className="container-px">
          <p className="eyebrow mb-3">Our Products</p>
          <h1 className="section-title">Premium Textile Collection</h1>
          <p className="mt-4 max-w-2xl text-ink-600">
            Browse our complete catalogue of export-grade fabrics. Filter by category or collection to find exactly what you need.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-px">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-10"
                aria-label="Search products"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <SlidersHorizontal className="h-4 w-4" /> Filter:
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-auto py-2" aria-label="Filter by category">
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select value={collection} onChange={(e) => setCollection(e.target.value)} className="input w-auto py-2" aria-label="Filter by collection">
                <option value="">All Collections</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink-200 py-20 text-center">
              <p className="text-ink-500">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} onSelect={setSelected} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
