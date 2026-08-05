import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Mail, Phone, MessageCircle } from 'lucide-react';
import SmartImage from './SmartImage';
import { useToast } from '@/lib/toast';
import type { Product } from '@/types/database';

export default function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const toast = useToast();
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [product?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (product && e.key === 'ArrowRight') setActive((a) => Math.min(a + 1, product.images.length - 1));
      if (product && e.key === 'ArrowLeft') setActive((a) => Math.max(a - 1, 0));
    }
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  function handleEmailClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!product) return;
    const email = 'amkas_inter@hotmail.com';
    const subject = `Inquiry regarding ${product.name}`;
    navigator.clipboard.writeText(email).catch(() => {});
    toast(`Email copied: ${email}. Opening mail client...`);
    setTimeout(() => {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    }, 150);
  }

  function handleCallClick(e: React.MouseEvent) {
    e.preventDefault();
    const phone = '+923018621370';
    navigator.clipboard.writeText(phone).catch(() => {});
    toast(`Phone number copied: ${phone}. Dialing...`);
    setTimeout(() => {
      window.location.href = `tel:${phone}`;
    }, 150);
  }

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft backdrop-blur hover:bg-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid lg:grid-cols-2">
              <div className="relative bg-ink-50">
                <SmartImage
                  src={product.images[active]}
                  alt={product.name}
                  ratio="1/1"
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActive((a) => Math.max(a - 1, 0))}
                      disabled={active === 0}
                      className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft disabled:opacity-30"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActive((a) => Math.min(a + 1, product.images.length - 1))}
                      disabled={active === product.images.length - 1}
                      className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft disabled:opacity-30"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                          i === active ? 'ring-gold-500' : 'ring-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <p className="eyebrow">{product.category?.name ?? 'Textile'}</p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-ink-900 sm:text-3xl">{product.name}</h2>
                {product.collection && (
                  <p className="mt-1 text-sm text-ink-500">
                    Part of <span className="font-medium text-ink-700">{product.collection.name}</span>
                  </p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-ink-600">{product.description ?? product.short_description}</p>

                {Object.keys(product.specs ?? {}).length > 0 && (
                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-ink-50 px-4 py-3">
                        <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">{k}</dt>
                        <dd className="mt-0.5 text-sm font-medium text-ink-800">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-auto pt-8">
                  <p className="mb-3 text-sm text-ink-600">Interested in this product? Contact us directly:</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:amkas_inter@hotmail.com?subject=Inquiry%20regarding%20${encodeURIComponent(product.name)}`}
                      onClick={handleEmailClick}
                      className="btn-primary cursor-pointer"
                    >
                      <Mail className="h-4 w-4" /> Email Us
                    </a>
                    <a
                      href={`https://wa.me/923018621370?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline border-green-600 text-green-700 hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                    </a>
                    <a
                      href="tel:+923018621370"
                      onClick={handleCallClick}
                      className="btn-outline cursor-pointer"
                    >
                      <Phone className="h-4 w-4" /> Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
