import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Clock, MapPin, ExternalLink } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import { fetchContactInfo } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import type { ContactInfo, SiteSettings } from '@/types/database';

export default function ContactPage() {
  const { settings, contact: ctxContact } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  const [contact, setContact] = useState<ContactInfo | null>(ctxContact);

  useEffect(() => {
    if (!contact) fetchContactInfo().then(setContact).catch(() => {});
  }, [contact]);

  const email = contact?.email || 'amkas_inter@hotmail.com';
  const phone = contact?.phone1 || '+92 301 8621370';
  const rawPhone = phone.replace(/[^0-9+]/g, '');
  const wa = contact?.whatsapp?.replace(/[^0-9]/g, '') || '923018621370';

  useSeo({
    title: `Contact Us — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}`,
    description: 'Get in touch directly via Email, WhatsApp, or Phone with AMKAS INTERNATIONAL for export inquiries and business partnerships.',
    canonical: window.location.href,
  });

  return (
    <div className="pt-16 lg:pt-20">
      <section className="border-b border-ink-100 bg-beige-50 py-14">
        <div className="container-px">
          <p className="eyebrow mb-3">Contact Us</p>
          <h1 className="section-title">Direct Contact Channels</h1>
          <p className="mt-4 max-w-2xl text-ink-600">
            Reach out directly via Email, WhatsApp, or Phone. Our team is available to assist with your export queries and order specifications.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-px grid gap-8 lg:grid-cols-2">
          {/* Main Direct Contact Methods */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="card flex flex-col justify-between p-6 sm:p-8 border border-ink-100 transition hover:shadow-lift">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-ink-900">Email Us</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Send us your detailed specifications, purchase orders, or technical inquiries.
                  </p>
                  <p className="mt-3 text-base font-semibold text-ink-900 select-all">{email}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-ink-100 pt-4">
                <a
                  href={`mailto:${email}`}
                  className="btn-primary w-full justify-center gap-2 text-sm"
                >
                  <Mail className="h-4 w-4" /> Open Email Client
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="card flex flex-col justify-between p-6 sm:p-8 border border-ink-100 transition hover:shadow-lift">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-ink-900">WhatsApp Chat</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Instant message our sales team for quick quotes, sample requests, and catalogue photos.
                  </p>
                  <p className="mt-3 text-base font-semibold text-ink-900 select-all">{phone}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-ink-100 pt-4">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" /> Start WhatsApp Chat <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Phone Call Card */}
            <div className="card flex flex-col justify-between p-6 sm:p-8 border border-ink-100 transition hover:shadow-lift">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-ink-100 text-ink-800">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-ink-900">Phone Call</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Speak directly with an export consultant during our business hours.
                  </p>
                  <p className="mt-3 text-base font-semibold text-ink-900 select-all">{phone}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-ink-100 pt-4">
                <a
                  href={`tel:${rawPhone}`}
                  className="btn-outline w-full justify-center gap-2 text-sm"
                >
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Information Summary & Map */}
          <div className="flex flex-col">
            <ContactSection info={contact} />
          </div>
        </div>
      </section>
    </div>
  );
}

