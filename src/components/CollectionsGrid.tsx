import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage';
import type { Collection } from '@/types/database';

export default function CollectionsGrid({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;
  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Collections</p>
          <h2 className="section-title">Curated Fabric Collections</h2>
          <p className="mt-4 text-ink-600">
            Explore our textiles grouped by season, material and purpose — each collection crafted for a distinct market.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link to={`/collections/${c.slug}`} className="card group block overflow-hidden">
                <div className="relative">
                  <SmartImage
                    src={c.cover_image}
                    alt={c.name}
                    ratio="4/3"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-xl font-medium text-white">{c.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">{c.description ?? ''}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
