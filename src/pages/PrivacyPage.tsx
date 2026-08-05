import { useOutletContext } from 'react-router-dom';
import { useSeo } from '@/lib/seo';
import type { SiteSettings, ContactInfo } from '@/types/database';

export default function PrivacyPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings; contact: ContactInfo }>();
  useSeo({ title: `Privacy Policy — ${settings?.company_name ?? 'AMKAS INTERNATIONAL'}` });
  return (
    <div className="pt-16 lg:pt-20">
      <section className="border-b border-ink-100 bg-beige-50 py-14">
        <div className="container-px">
          <p className="eyebrow mb-3">Legal</p>
          <h1 className="section-title">Privacy Policy</h1>
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="container-px max-w-3xl">
          <div className="prose prose-ink max-w-none space-y-4 text-ink-700">
            <p>
              {settings?.company_name ?? 'AMKAS INTERNATIONAL'} respects your privacy. This policy explains how we collect, use and protect information you provide through this website.
            </p>
            <h2 className="font-serif text-xl text-ink-900">Information We Collect</h2>
            <p>
              We collect information you submit voluntarily — such as your name, email, phone and company — when you use our contact or inquiry forms. We do not collect sensitive personal data without your consent.
            </p>
            <h2 className="font-serif text-xl text-ink-900">How We Use It</h2>
            <p>
              Your information is used solely to respond to your inquiries, provide quotes and samples, and fulfil business communications. We never sell your data to third parties.
            </p>
            <h2 className="font-serif text-xl text-ink-900">Contact</h2>
            <p>
              For any privacy questions, please reach out using the contact details on our Contact page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
