import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';
import type { Product } from '@/types/database';

export default function FeaturedCarousel({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    function updatePerView() {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    }
    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  if (products.length === 0) return null;

  // Append initial items to the end so the carousel never shows empty space when scrolling past the last item
  const displayProducts =
    products.length >= perView
      ? [...products, ...products.slice(0, perView + 1)]
      : products;

  const totalItems = products.length;

  const next = useCallback(() => {
    if (totalItems === 0) return;
    setIndex((i) => (i + 1) % totalItems);
  }, [totalItems]);

  const prev = useCallback(() => {
    if (totalItems === 0) return;
    setIndex((i) => (i - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (paused || totalItems <= perView) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % totalItems);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, totalItems, perView]);

  const slideShift = (index * 100) / perView;

  return (
    <section className="bg-beige-50 py-20 lg:py-28 overflow-hidden">
      <div className="container-px">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Featured</p>
            <h2 className="section-title">Signature Products</h2>
          </div>
          <div className="flex gap-2 sm:flex">
            <button
              onClick={prev}
              className="btn-ghost rounded-full border border-ink-200 transition hover:bg-white hover:shadow-soft"
              aria-label="Previous product"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="btn-ghost rounded-full border border-ink-200 transition hover:bg-white hover:shadow-soft"
              aria-label="Next product"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-3xl p-1"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <motion.div
            className="flex"
            animate={{ x: `-${slideShift}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 35 }}
          >
            {displayProducts.map((p, idx) => (
              <div
                key={`${p.id}-${idx}`}
                className="px-2.5 flex-shrink-0"
                style={{ width: `${100 / perView}%` }}
              >
                <button
                  onClick={() => onSelect(p)}
                  className="card group block w-full overflow-hidden text-left transition hover:shadow-lift"
                >
                  <div className="relative">
                    <SmartImage
                      src={p.images[0]}
                      alt={p.name}
                      ratio="4/5"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gold-700 backdrop-blur shadow-sm">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" /> Featured
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
                      {p.category?.name ?? 'Textile'}
                    </p>
                    <h3 className="mt-1.5 font-serif text-lg font-medium text-ink-900">{p.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{p.short_description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors group-hover:text-gold-600">
                      View details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Indicator Dots */}
        <div className="mt-8 flex justify-center gap-1.5">
          {Array.from({ length: totalItems }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-ink-900' : 'w-2 bg-ink-300 hover:bg-ink-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
