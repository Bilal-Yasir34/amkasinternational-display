import { motion } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Ship,
  Factory,
  TrendingUp,
  Headset,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Homepage, WhyChooseItem } from '@/types/database';

const ICONS: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Ship,
  Factory,
  TrendingUp,
  Headset,
  Sparkles,
};

const DEFAULT_ITEMS: WhyChooseItem[] = [
  { title: 'Uncompromising Quality', description: 'Rigorous quality control at every stage of textile production from raw yarn to finished fabric.', icon: 'BadgeCheck' },
  { title: 'Global Export Reach', description: 'Reliable logistics, international compliance, and custom-tailored export solutions worldwide.', icon: 'Ship' },
  { title: 'State-of-the-Art Weaving', description: 'Advanced shuttleless looms and traditional artisan craftsmanship combined.', icon: 'Factory' },
  { title: 'Premium Sourcing', description: 'Pure wool, combed cotton, linen, silk, and luxury blend yarns sourced ethically.', icon: 'Sparkles' },
  { title: 'Export Standards Certified', description: 'Adhering to strict international textile testing and color fastness benchmarks.', icon: 'Award' },
  { title: 'Dedicated Business Support', description: 'Personalized customer account managers and rapid sample dispatch for global buyers.', icon: 'Headset' },
];

export default function WhyChooseUs({ homepage }: { homepage: Homepage | null }) {
  const items: WhyChooseItem[] = homepage?.why_choose_us?.length ? homepage.why_choose_us : DEFAULT_ITEMS;

  return (
    <section className="bg-ink-950 py-20 text-white lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow mb-3 text-gold-400">Why Choose Us</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl">
            The AMKAS Standard
          </h2>
          <p className="mt-4 text-white/70">
            Six commitments that define how we work — and why global buyers trust us with their textile needs.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-gold-400/40 hover:bg-white/[0.07]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
