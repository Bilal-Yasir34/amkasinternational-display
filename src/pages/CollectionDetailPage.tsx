import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { fetchCollectionBySlug, fetchProducts } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { Collection, Product, SiteSettings, ContactInfo } from '@/types/database';

export default function CollectionDetailPage() {
  const { slug = '' } = useParams();
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCollectionBySlug(slug), fetchProducts({ collectionSlug: slug })])
      .then(([c, p]) => {
        setCollection(c);
        setProducts(p);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useSeo({
    title: `${collection?.name ?? 'Collection'} — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}`,
    description: collection?.description ?? '',
    image: collection?.cover_image ?? undefined,
    canonical: window.location.href,
  });

  return (
    <div className="pt-16 lg:pt-20">
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          {collection?.cover_image ? (
            <SmartImage src={collection.cover_image} alt={collection.name} ratio="16/9" loading="eager" />
          ) : (
            <div className="skeleton h-full w-full bg-ink-950" />
          )}
          <div className="absolute inset-0 bg-ink-950/60" />
        </div>
        <div className="container-px relative z-10 py-24">
          <Link to="/collections" className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All Collections
          </Link>
          <p className="eyebrow text-gold-300">Collection</p>
          {loading ? (
            <div className="mt-2 space-y-4">
              <div className="skeleton h-10 w-64 rounded bg-white/20 sm:w-80" />
              <div className="skeleton h-5 w-full max-w-xl rounded bg-white/20" />
            </div>
          ) : (
            <>
              <h1 className="mt-2 font-serif text-4xl font-medium text-white sm:text-5xl">{collection?.name}</h1>
              <p className="mt-4 max-w-2xl text-white/80">{collection?.description ?? ''}</p>
            </>
          )}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-px">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink-200 py-20 text-center text-ink-500">
              No products in this collection yet.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
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
