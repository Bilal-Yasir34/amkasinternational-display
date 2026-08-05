import { motion } from 'framer-motion';
import { Target, Eye, Globe2, Calendar } from 'lucide-react';
import type { Homepage } from '@/types/database';

export default function WhoWeAre({ homepage }: { homepage: Homepage | null }) {
  const title = homepage?.intro_title ?? 'Who We Are';
  const body =
    homepage?.intro_body ??
    'AMKAS INTERNATIONAL is a premier textile export house specializing in the design, manufacture and global distribution of premium fabrics.';
  const mission = homepage?.mission ?? '';
  const vision = homepage?.vision ?? '';
  const years = homepage?.years_experience ?? 0;
  const markets = homepage?.export_markets ?? '';

  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow mb-4">{title}</p>
          <h2 className="section-title mb-6">A Legacy of Premium Textile Craftsmanship</h2>
          <p className="text-lg leading-relaxed text-ink-600">{body}</p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, label: 'Mission', text: mission },
            { icon: Eye, label: 'Vision', text: vision },
            { icon: Calendar, label: 'Years of Experience', text: `${years}+ years serving global markets` },
            { icon: Globe2, label: 'Export Markets', text: markets },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-500">{c.label}</h3>
              <p className="text-sm leading-relaxed text-ink-700">{c.text || '—'}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
