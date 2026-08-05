import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import type { SiteSettings, ContactInfo } from '@/types/database';

export default function Footer({
  settings,
  contact,
}: {
  settings: SiteSettings | null;
  contact: ContactInfo | null;
}) {
  const name = settings?.company_name ?? 'AMKAS INTERNATIONAL';
  const year = new Date().getFullYear();
  const copyright = settings?.footer_text ?? `© ${year} ${name}. All rights reserved.`;

  const socials = [
    { icon: Facebook, url: settings?.social_facebook },
    { icon: Instagram, url: settings?.social_instagram },
    { icon: Linkedin, url: settings?.social_linkedin },
    { icon: Twitter, url: settings?.social_twitter },
  ].filter((s) => s.url);

  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-px py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-xl font-semibold">{name}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Premium textile exporters delivering quality fabrics to discerning markets worldwide.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-gold-500 hover:text-white"
                    aria-label="Social link"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Collections', to: '/collections' },
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/70 transition hover:text-gold-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Products</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {['Shawls', 'Wool Fabrics', 'Cotton Fabrics', 'Luxury Fabrics', 'Winter Collection'].map((l) => (
                <li key={l}>
                  <Link to="/products" className="text-white/70 transition hover:text-gold-400">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {contact?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                  <span>{contact.address}</span>
                </li>
              )}
              {contact?.phone1 && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" />
                  <a href={`tel:${contact.phone1.replace(/\s/g, '')}`} className="hover:text-gold-400">
                    {contact.phone1}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-gold-400">
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>{copyright}</p>
          <Link to="/privacy" className="transition hover:text-gold-400">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
