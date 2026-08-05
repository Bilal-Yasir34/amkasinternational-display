import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';
import type { Homepage } from '@/types/database';

export default function Hero({ homepage }: { homepage: Homepage | null }) {
  const title = homepage?.hero_title ?? 'Trusted Textile Exporters Delivering Premium Fabrics Worldwide';
  const subtitle =
    homepage?.hero_subtitle ??
    'AMKAS INTERNATIONAL crafts and exports premium shawls, wool, cotton and luxury fabrics to discerning markets across the globe.';
  const image =
    homepage?.hero_image ||
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=2000&q=80';
  const b1 = homepage?.hero_button1_text ?? 'Explore Products';
  const b1Link = homepage?.hero_button1_link ?? '/products';
  const b2 = homepage?.hero_button2_text ?? 'Contact Us';
  const b2Link = homepage?.hero_button2_link ?? '/contact';

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage src={image} alt="Premium textile manufacturing" className="scale-105" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-900/60 to-ink-900/30" />
      </div>

      <div className="container-px relative z-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-5 text-gold-300">AMKAS INTERNATIONAL</p>
          <h1 className="font-serif text-4xl font-medium leading-[1.1] text-white text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={b1Link} className="btn-gold">
              {b1} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={b2Link} className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white">
              {b2}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
