import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, Maximize2, X, ExternalLink, Calendar, Building2 } from 'lucide-react';
import SmartImage from './SmartImage';
import type { Homepage, CertificationItem } from '@/types/database';

export default function CertificationsSection({ homepage }: { homepage: Homepage | null }) {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const certs = homepage?.certifications ?? [];

  if (certs.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-beige-50/50 via-white to-beige-50/30 py-20 lg:py-28">
      {/* Decorative ambient backdrop shapes */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-gold-400/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-gold-600/5 blur-3xl" aria-hidden />

      <div className="container-px relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-gold-600" />
            Accreditation & Compliance
          </div>
          <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
            Company Certifications
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            Our commitment to quality, sustainability, and international standards is backed by verified export accreditations and safety certifications.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white/80 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lift"
            >
              {/* Certificate Image Box */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-950/5 p-3">
                <SmartImage
                  src={cert.image_url}
                  alt={cert.title}
                  ratio="4/3"
                  fit="contain"
                  className="rounded-xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay with zoom hint */}
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-ink-900 shadow-lift backdrop-blur">
                    <Maximize2 className="h-3.5 w-3.5 text-gold-600" /> Inspect Certificate
                  </span>
                </div>

                {cert.badge && (
                  <span className="absolute left-3 top-3 rounded-lg border border-gold-400/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gold-700 shadow-sm backdrop-blur">
                    {cert.badge}
                  </span>
                )}
              </div>

              {/* Card Body Details */}
              <div className="mt-5 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink-900 transition-colors group-hover:text-gold-700">
                    {cert.title}
                  </h3>

                  {cert.issuer && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-500">
                      <Building2 className="h-3.5 w-3.5 text-gold-600 flex-shrink-0" />
                      {cert.issuer}
                    </p>
                  )}

                  {cert.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-600">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-ink-100/80 pt-3 text-xs text-ink-500">
                  {cert.issue_date ? (
                    <span className="inline-flex items-center gap-1 text-ink-400 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-gold-600" />
                      Year: {cert.issue_date}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gold-600 font-medium">
                      <Award className="h-3.5 w-3.5" /> Verified Exporter
                    </span>
                  )}
                  <span className="font-semibold text-gold-600 transition-transform duration-300 group-hover:translate-x-0.5">
                    View proof &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Certificate Inspection Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
              onClick={() => setSelectedCert(null)}
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={selectedCert.title}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft backdrop-blur hover:bg-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                {/* Certificate High-Res Container */}
                <div className="relative flex items-center justify-center bg-ink-950/5 p-6 lg:col-span-7 lg:min-h-[420px]">
                  <img
                    src={selectedCert.image_url}
                    alt={selectedCert.title}
                    className="max-h-[60vh] w-auto max-w-full rounded-xl shadow-md object-contain"
                  />
                </div>

                {/* Details Side Panel */}
                <div className="flex flex-col p-6 sm:p-8 lg:col-span-5">
                  {selectedCert.badge && (
                    <span className="mb-2 w-fit rounded-full border border-gold-400/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-700">
                      {selectedCert.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-medium text-ink-900 sm:text-3xl">
                    {selectedCert.title}
                  </h3>

                  {selectedCert.issuer && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-ink-600 font-medium">
                      <Building2 className="h-4 w-4 text-gold-600 flex-shrink-0" />
                      <span>{selectedCert.issuer}</span>
                    </div>
                  )}

                  {selectedCert.issue_date && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                      <Calendar className="h-4 w-4 text-gold-600 flex-shrink-0" />
                      <span>Issued / Valid: {selectedCert.issue_date}</span>
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-ink-600">
                    {selectedCert.description ||
                      'Official corporate proof and accreditation verifying high standards in fabric quality and international trade compliance.'}
                  </p>

                  <div className="mt-8 pt-6 border-t border-ink-100 flex items-center justify-between">
                    <span className="text-xs text-ink-400 font-medium">AMKAS INTERNATIONAL</span>
                    <a
                      href={selectedCert.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-xs py-2 px-3 gap-1.5"
                    >
                      Open Original File <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
