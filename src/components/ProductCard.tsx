import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage';
import type { Product } from '@/types/database';

export default function ProductCard({
  product,
  onSelect,
  index = 0,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  index?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => onSelect(product)}
      className="card group block w-full overflow-hidden text-left"
    >
      <SmartImage
        src={product.images[0]}
        alt={product.name}
        ratio="4/5"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      />
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
          {product.category?.name ?? 'Textile'}
        </p>
        <h3 className="mt-1.5 font-serif text-lg font-medium text-ink-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{product.short_description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors group-hover:text-gold-600">
          View details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.button>
  );
}
