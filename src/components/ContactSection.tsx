import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Clock, Navigation } from 'lucide-react';
import type { ContactInfo } from '@/types/database';

export default function ContactSection({ info }: { info: ContactInfo | null }) {
  const phones = [info?.phone1, info?.phone2].filter(Boolean) as string[];
  const wa = info?.whatsapp?.replace(/[^0-9]/g, '');

  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow mb-3">Contact</p>
          <h2 className="section-title">Get In Touch</h2>
          <p className="mt-4 text-ink-600">
            Reach our team for export inquiries, product samples or partnership opportunities.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ink-900">Phone</h3>
              </div>
              <div className="space-y-1.5">
                {phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block text-sm text-ink-700 hover:text-gold-600">
                    {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ink-900">Email</h3>
              </div>
              {info?.email && (
                <a href={`mailto:${info.email}`} className="block text-sm text-ink-700 hover:text-gold-600">
                  {info.email}
                </a>
              )}
            </div>

            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ink-900">Address</h3>
              </div>
              <p className="text-sm text-ink-700">{info?.address}</p>
              {info?.business_hours && (
                <div className="mt-4 flex items-start gap-2 border-t border-ink-100 pt-4 text-sm text-ink-600">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" />
                  <span>{info.business_hours}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {phones[0] && (
                <a href={`tel:${phones[0].replace(/\s/g, '')}`} className="btn-primary">
                  <Phone className="h-4 w-4" /> Call
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
              {info?.email && (
                <a href={`mailto:${info.email}`} className="btn-outline">
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card overflow-hidden p-0"
          >
            {info?.map_url ? (
              <iframe
                title="Office location map"
                src={info.map_url}
                className="h-full min-h-[400px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center bg-ink-50 text-ink-400">
                Map unavailable
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
