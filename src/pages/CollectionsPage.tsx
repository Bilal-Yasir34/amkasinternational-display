import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { fetchCollections } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { Collection, SiteSettings, ContactInfo } from '@/types/database';

export default function CollectionsPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections()
      .then((c) => setCollections(c.filter((x) => x.visible)))
      .finally(() => setLoading(false));
  }, []);

  useSeo({
    title: `Collections — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}`,
    description: 'Explore our curated textile collections grouped by season, material and purpose.',
    canonical: window.location.href,
  });

  return (
    <div className="pt-16 lg:pt-20">
      <section className="border-b border-ink-100 bg-beige-50 py-14">
        <div className="container-px">
          <p className="eyebrow mb-3">Collections</p>
          <h1 className="section-title">Our Fabric Collections</h1>
          <p className="mt-4 max-w-2xl text-ink-600">
            Each collection brings together fabrics crafted for a distinct season, material or market.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-px">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[4/3] rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c) => (
                <Link key={c.id} to={`/collections/${c.slug}`} className="card group block overflow-hidden">
                  <div className="relative">
                    <SmartImage src={c.cover_image} alt={c.name} ratio="4/3" sizes="(min-width:1024px) 33vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-serif text-xl font-medium text-white">{c.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-white/80">{c.description ?? ''}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                        Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
